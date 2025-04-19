import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hash } from 'bcryptjs';

// Helper function to determine researcher level based on roadmap progress
function getRoadmapLevel(progress: number): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
  if (progress >= 90) return 'Expert';
  if (progress >= 70) return 'Advanced';
  if (progress >= 40) return 'Intermediate';
  return 'Beginner';
}

// Function to check if email is admin email
function isAdminEmail(email: string): boolean {
  const adminEmails = [
    'tharak.nagaveti@gmail.com',
    'adityasaisontena@gmail.com',
    'dhanushyangal@gmail.com',
    'tejeshvarma07@gmail.com'
  ];
  
  return adminEmails.includes(email.toLowerCase());
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate the input
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Determine if this is an admin email
    const isAdmin = isAdminEmail(email);

    // Create a new user with all required fields
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: isAdmin ? 'admin' : 'user', // Default role is user, admin for special emails
      isVerified: isAdmin, // Admins are automatically verified
      roadmapProgress: 0,
      roadmapLevel: 'Beginner',
      blogEnabled: isAdmin, // Only admins can blog by default
      blogPosts: [],
      datasets: [],
      contributions: {
        papers: [],
        datasets: [],
        experiments: []
      },
      createdAt: new Date(),
    };

    // Insert the user into the database
    const result = await db.collection('users').insertOne(newUser);

    // Return success response (excluding the password)
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          ...userWithoutPassword,
          _id: result.insertedId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the user' },
      { status: 500 }
    );
  }
} 