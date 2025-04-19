import mongoose, { Schema, models } from 'mongoose';

export interface IFile {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'papers' | 'datasets' | 'experiments' | 'images';
  originalName: string;
  path: string;
  url: string;
  size: number;
  mimeType: string;
  downloads?: number;
  views?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

const fileSchema = new Schema<IFile>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['papers', 'datasets', 'experiments', 'images'],
      required: [true, 'File type is required'],
      index: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original filename is required'],
    },
    path: {
      type: String,
      required: [true, 'File path is required'],
      unique: true,
    },
    url: {
      type: String,
      required: [true, 'File URL is required'],
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search
fileSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Use existing model or create a new one
const File = models.File || mongoose.model<IFile>('File', fileSchema);

export default File; 