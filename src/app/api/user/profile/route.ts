import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { GridFSBucket, ObjectId } from 'mongodb';
import clientPromise, { connectToDatabase } from '@/lib/mongodb';

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// List of admin emails
const ADMIN_EMAILS = [
  'tharak.nagaveti@gmail.com',
  'adityasaisontena@gmail.com',
  'dhanushyangal@gmail.com',
  'tejeshvarma07@gmail.com'
];

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get email - may come from different places depending on auth provider
    const userEmail = getUserEmail(session.user);
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found in session' },
        { status: 400 }
      );
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Find user by email
    const user = await usersCollection.findOne({ email: userEmail });
    
    if (!user) {
      // Create a new user document if not found
      const newUser = {
        name: session.user.name || 'User',
        email: userEmail,
        image: session.user.image || '',
        // Assign admin role if email is in the admin list
        role: ADMIN_EMAILS.includes(userEmail) ? 'admin' : 'user',
        isVerified: ADMIN_EMAILS.includes(userEmail), // Admins are automatically verified
        roadmapProgress: 0,
        roadmapLevel: 'Beginner',
        blogEnabled: ADMIN_EMAILS.includes(userEmail), // Only admins can blog by default
        blogPosts: [],
        datasets: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bio: '',
        specialization: '',
        interests: '',
        teamRegistered: false,
        contributions: {
          papers: [],
          datasets: [],
          experiments: []
        }
      };
      
      const result = await usersCollection.insertOne(newUser);
      
      if (!result.acknowledged) {
        throw new Error('Failed to create user profile');
      }
      
      return NextResponse.json(newUser);
    }
    
    // Check if user should be an admin but isn't (for users who signed up before being added to admin list)
    if (ADMIN_EMAILS.includes(userEmail) && user.role !== 'admin') {
      await usersCollection.updateOne(
        { email: userEmail },
        { $set: { role: 'admin', updatedAt: new Date().toISOString() } }
      );
      user.role = 'admin';
    }
    
    // Return user profile with provider data for Google accounts
    const providerData = session.user.providerData || [];
    
    return NextResponse.json({
      ...user,
      _id: user._id.toString(),
      providerData
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: `Failed to fetch user profile: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// Helper function to get user email from session user
function getUserEmail(user: any): string | null {
  if (!user) return null;
  
  // Standard format
  if (typeof user.email === 'string') {
    return user.email;
  }
  
  // For Google Auth, email might be in a different location
  if (user.providerData && user.providerData[0]?.email) {
    return user.providerData[0].email;
  }
  
  return null;
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userEmail = getUserEmail(session.user);
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found in session' },
        { status: 400 }
      );
    }
    
    // Parse FormData instead of JSON
    const formData = await request.formData();
    console.log('Received form data fields:', [...formData.keys()]);
    
    // Extract fields from FormData
    const bio = formData.get('bio') as string || '';
    const specialization = formData.get('specialization') as string || '';
    const interests = formData.get('interests') as string || '';
    const name = formData.get('name') as string || '';
    const profileImage = formData.get('profileImage') as File | null;
    
    // Connect to database
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Find user by email
    const user = await usersCollection.findOne({ email: userEmail });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Handle profile image upload if provided
    let imageUrl = user.image; // Keep existing image by default
    if (profileImage) {
      // Validate file size
      if (profileImage.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size should be less than 5MB' },
          { status: 400 }
        );
      }

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(profileImage.type)) {
        return NextResponse.json(
          { error: 'Only JPEG, PNG, WebP, and GIF images are allowed' },
          { status: 400 }
        );
      }

      try {
        const client = await clientPromise;
        const db = client.db();
        const bucket = new GridFSBucket(db, { bucketName: 'profileImages' });

        // Delete old image if it exists and is stored in GridFS
        if (user.image && user.image.includes('api/files')) {
          const oldImageId = user.image.split('/').pop();
          try {
            await bucket.delete(new ObjectId(oldImageId));
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Continue even if delete fails
          }
        }

        // Upload new image
        const buffer = Buffer.from(await profileImage.arrayBuffer());
        const uploadStream = bucket.openUploadStream(
          `${user._id}-${Date.now()}-${profileImage.name}`,
          {
            contentType: profileImage.type,
            metadata: {
              userId: user._id.toString(),
              uploadDate: new Date(),
              originalName: profileImage.name
            },
          }
        );

        await new Promise((resolve, reject) => {
          uploadStream.end(buffer, (error) => {
            if (error) reject(error);
            else resolve(uploadStream.id);
          });
        });

        imageUrl = `/api/files/${uploadStream.id}`;
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }
    
    // Update user profile
    const result = await usersCollection.updateOne(
      { email: userEmail },
      {
        $set: {
          name: name || user.name,
          bio: bio || user.bio,
          specialization: specialization || user.specialization,
          interests: interests || user.interests,
          image: imageUrl,
          updatedAt: new Date().toISOString()
        }
      }
    );
    
    if (!result.acknowledged) {
      throw new Error('Failed to update user profile');
    }
    
    // Get updated user
    const updatedUser = await usersCollection.findOne({ email: userEmail });
    
    // Return updated user profile
    return NextResponse.json({
      ...updatedUser,
      _id: updatedUser._id.toString()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: `Failed to update user profile: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const userEmail = getUserEmail(session.user);
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found in session' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Find user by email
    const user = await usersCollection.findOne({ email: userEmail });
    
    if (!user) {
      // Create new user if not found
      const newUser = {
        email: userEmail,
        name: session.user.name || 'User',
        image: session.user.image || '',
        role: ADMIN_EMAILS.includes(userEmail) ? 'admin' : 'user',
        isVerified: ADMIN_EMAILS.includes(userEmail), // Admins are automatically verified
        roadmapProgress: 0,
        roadmapLevel: 'Beginner',
        blogEnabled: ADMIN_EMAILS.includes(userEmail), // Only admins can blog by default
        blogPosts: [],
        datasets: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bio: '',
        specialization: '',
        interests: '',
        teamRegistered: false,
        contributions: {
          papers: [],
          datasets: [],
          experiments: []
        }
      };
      
      const result = await usersCollection.insertOne(newUser);
      
      if (!result.acknowledged) {
        throw new Error('Failed to create user profile');
      }
      
      return NextResponse.json(newUser);
    }

    const formData = await req.formData();
    const profileImage = formData.get('profileImage') as File | null;

    // Handle profile image upload
    let imageUrl = user.image; // Keep existing image by default
    if (profileImage) {
      // Validate file size
      if (profileImage.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size should be less than 5MB' },
          { status: 400 }
        );
      }

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(profileImage.type)) {
        return NextResponse.json(
          { error: 'Only JPEG, PNG, WebP, and GIF images are allowed' },
          { status: 400 }
        );
      }

      try {
        const client = await clientPromise;
        const db = client.db();
        const bucket = new GridFSBucket(db, { bucketName: 'profileImages' });

        // Delete old image if it exists and is stored in GridFS
        if (user.image && user.image.includes('api/files')) {
          const oldImageId = user.image.split('/').pop();
          try {
            await bucket.delete(new ObjectId(oldImageId));
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Continue even if delete fails
          }
        }

        // Upload new image
        const buffer = Buffer.from(await profileImage.arrayBuffer());
        const uploadStream = bucket.openUploadStream(
          `${user._id}-${Date.now()}-${profileImage.name}`,
          {
            contentType: profileImage.type,
            metadata: {
              userId: user._id.toString(),
              uploadDate: new Date(),
              originalName: profileImage.name
            },
          }
        );

        await new Promise((resolve, reject) => {
          uploadStream.end(buffer, (error) => {
            if (error) reject(error);
            else resolve(uploadStream.id);
          });
        });

        imageUrl = `/api/files/${uploadStream.id}`;
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Update user profile
    const result = await usersCollection.updateOne(
      { email: userEmail },
      {
        $set: {
          image: imageUrl,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    // Get updated user
    const updatedUser = await usersCollection.findOne({ email: userEmail });
    
    return NextResponse.json({
      ...updatedUser,
      _id: updatedUser._id.toString()
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    return NextResponse.json(
      { error: `Failed to update profile image: ${(error as Error).message}` },
      { status: 500 }
    );
  }
} 