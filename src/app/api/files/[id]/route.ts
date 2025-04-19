import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: 'profileImages' });

    // Find the file metadata
    const files = await bucket.find({ _id: new ObjectId(params.id) }).toArray();
    if (!files.length) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const file = files[0];

    // Check if the request has a matching ETag
    const ifNoneMatch = request.headers.get('if-none-match');
    const etag = `"${file._id.toString()}"`;
    
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 });
    }

    try {
      // Create a stream to read the file
      const stream = bucket.openDownloadStream(new ObjectId(params.id));

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }
      const buffer = Buffer.concat(chunks);

      // Return the file with appropriate headers
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': file.contentType || 'application/octet-stream',
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
          'ETag': etag,
          'Last-Modified': file.uploadDate.toUTCString(),
          'Accept-Ranges': 'bytes',
        },
      });
    } catch (error) {
      console.error('Error streaming file:', error);
      return NextResponse.json(
        { error: 'Error reading file' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('GET /api/files/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add DELETE endpoint to handle file deletion
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: 'profileImages' });

    // Find the file metadata
    const files = await bucket.find({ _id: new ObjectId(params.id) }).toArray();
    if (!files.length) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const file = files[0];

    // Verify file ownership through metadata
    if (file.metadata?.userId) {
      const user = await db.collection('users').findOne({
        email: session.user.email,
      });

      if (!user || file.metadata.userId !== user._id.toString()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Delete the file
    await bucket.delete(new ObjectId(params.id));

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /api/files/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 