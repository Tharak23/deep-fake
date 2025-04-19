import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import { uploadFile } from '@/lib/storage';
import User from '@/models/User';

// This is a placeholder for your MongoDB model
// You'll need to create this model
import FileModel from '@/models/File';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') ? JSON.parse(formData.get('tags') as string) : [];

    if (!file || !type) {
      return NextResponse.json({ error: 'File and type are required' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['papers', 'datasets', 'experiments', 'images'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Upload file using our storage utility
    const metadata = {
      title: title || file.name,
      description: description || '',
      originalName: file.name,
      tags: tags || [],
    };

    // Connect to database
    await dbConnect();

    // Upload file and store in MongoDB
    const result = await uploadFile(file, type, session.user.id, metadata);

    // Update user's contributions
    if (type === 'papers' || type === 'datasets' || type === 'experiments') {
      await User.findByIdAndUpdate(
        session.user.id,
        { $push: { [`contributions.${type}`]: result.id } },
        { new: true }
      );
    }

    // Return success response with file details
    return NextResponse.json({
      message: 'File uploaded successfully',
      file: {
        id: result.id,
        title: result.title,
        description: result.description,
        url: result.url,
        type: type,
        size: result.size,
        createdAt: result.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading file', details: error.message },
      { status: 500 }
    );
  }
} 