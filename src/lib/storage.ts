'use server';

import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import dbConnect from './mongoose';
import File from '@/models/File';
import User from '@/models/User';

// Local storage path (for development)
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
}

// Generate a unique filename
export async function generateUniqueFilename(originalFilename: string) {
  const ext = path.extname(originalFilename);
  const name = path.basename(originalFilename, ext);
  const timestamp = Date.now();
  const uuid = uuidv4().substring(0, 8);
  return `${name}-${timestamp}-${uuid}${ext}`;
}

// Get file path based on type
export async function getFilePath(type: string, filename: string, userId: string) {
  return `${type}/${userId}/${filename}`;
}

// Upload a file
export async function uploadFile(
  file: File,
  type: string,
  userId: string,
  metadata: Record<string, any> = {}
) {
  await ensureUploadDir();
  
  const uniqueFilename = await generateUniqueFilename(file.name);
  const relativePath = await getFilePath(type, uniqueFilename, userId);
  const fullPath = join(UPLOAD_DIR, relativePath);
  
  // Ensure directory exists
  await mkdir(path.dirname(fullPath), { recursive: true });
  
  // Write file to disk
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);
  
  // Create file record in database
  await dbConnect();
  const fileDoc = await File.create({
    name: uniqueFilename,
    originalName: file.name,
    path: relativePath,
    url: `/uploads/${relativePath}`,
    type: file.type,
    mimeType: file.type,
    size: file.size,
    userId,
    title: metadata.title || file.name,
    description: metadata.description || '',
    tags: metadata.tags || [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Update user's contributions if applicable
  if (['papers', 'datasets', 'experiments', 'images'].includes(type)) {
    await User.findByIdAndUpdate(
      userId,
      { $push: { [`contributions.${type}`]: fileDoc._id } },
      { new: true }
    );
  }
  
  // Return public URL and file details
  return {
    id: fileDoc._id.toString(),
    name: uniqueFilename,
    originalName: file.name,
    url: `/uploads/${relativePath}`,
    type: file.type,
    size: file.size,
    title: metadata.title || file.name,
    description: metadata.description || '',
    createdAt: fileDoc.createdAt
  };
}

// Delete a file
export async function deleteFile(fileId: string) {
  await dbConnect();
  
  // Find file in database
  const fileDoc = await File.findById(fileId);
  if (!fileDoc) {
    throw new Error('File not found');
  }
  
  // Delete file from disk
  const fullPath = join(UPLOAD_DIR, fileDoc.path);
  try {
    await unlink(fullPath);
  } catch (error) {
    console.error('Error deleting file from disk:', error);
  }
  
  // Remove file from user's contributions
  if (fileDoc.userId && ['papers', 'datasets', 'experiments', 'images'].includes(fileDoc.type)) {
    await User.findByIdAndUpdate(
      fileDoc.userId,
      { $pull: { [`contributions.${fileDoc.type}`]: fileDoc._id } }
    );
  }
  
  // Delete file record from database
  await File.findByIdAndDelete(fileId);
  
  return { success: true };
}

// Get file URL
export async function getFileUrl(relativePath: string) {
  return `/uploads/${relativePath}`;
}

// List files
export async function listFiles(userId: string, type?: string) {
  await dbConnect();
  
  const query: any = { userId };
  if (type) {
    query.type = type;
  }
  
  const files = await File.find(query).sort({ createdAt: -1 });
  
  // Process files one by one to handle async operations
  const result = [];
  for (const file of files) {
    result.push({
      id: file._id.toString(),
      name: file.name,
      originalName: file.originalName,
      url: file.url || await getFileUrl(file.path),
      type: file.type,
      size: file.size,
      title: file.title,
      description: file.description,
      tags: file.tags,
      views: file.views,
      downloads: file.downloads,
      uploadedAt: file.createdAt
    });
  }
  
  return result;
}

// Get file by ID
export async function getFileById(fileId: string) {
  await dbConnect();
  
  const file = await File.findById(fileId);
  if (!file) {
    throw new Error('File not found');
  }
  
  // Increment views
  await File.findByIdAndUpdate(fileId, { $inc: { views: 1 } });
  
  return {
    id: file._id.toString(),
    name: file.name,
    originalName: file.originalName,
    url: file.url || await getFileUrl(file.path),
    type: file.type,
    size: file.size,
    title: file.title,
    description: file.description,
    tags: file.tags,
    views: file.views,
    downloads: file.downloads,
    userId: file.userId,
    createdAt: file.createdAt
  };
}

// Download file (increment download counter)
export async function downloadFile(fileId: string) {
  await dbConnect();
  
  const file = await File.findById(fileId);
  if (!file) {
    throw new Error('File not found');
  }
  
  // Increment downloads
  await File.findByIdAndUpdate(fileId, { $inc: { downloads: 1 } });
  
  return {
    url: file.url || await getFileUrl(file.path),
    name: file.originalName
  };
} 