import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getFileById } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fileId = params.id;
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Get file details and increment view counter
    const file = await getFileById(fileId);

    // Return the file details
    return NextResponse.json({ file });
  } catch (error: any) {
    console.error('Error getting file details:', error);
    return NextResponse.json(
      { error: 'Error getting file details', details: error.message },
      { status: 500 }
    );
  }
} 