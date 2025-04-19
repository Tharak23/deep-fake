import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { uploadFile, getFilePath } from '@/lib/storage';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

// POST /api/upload - Upload a file
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to upload files' },
        { status: 401 }
      );
    }
    
    // Get form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    if (!type) {
      return NextResponse.json(
        { error: 'File type is required' },
        { status: 400 }
      );
    }
    
    // Validate file type based on the content type
    const validTypes = {
      paper: ['application/pdf'],
      dataset: ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'],
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    };
    
    if (type in validTypes && !validTypes[type as keyof typeof validTypes].includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type for ${type}. Supported types: ${validTypes[type as keyof typeof validTypes].join(', ')}` },
        { status: 400 }
      );
    }
    
    // Upload the file using our storage utility
    const result = await uploadFile(file, type, session.user.id);
    
    return NextResponse.json({
      url: result.url,
      filename: result.name,
      originalFilename: result.originalName,
      contentType: result.type,
      size: result.size,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
} 