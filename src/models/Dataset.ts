import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IDataset extends Document {
  name: string;
  description: string;
  category: string;
  tags: string[];
  uploadedBy: mongoose.Types.ObjectId | IUser;
  fileUrl: string;
  thumbnailUrl?: string;
  size: number; // in bytes
  format: string;
  version: string;
  downloads: number;
  lastUpdated: Date;
  visibility: 'public' | 'team' | 'private';
  metadata?: {
    sampleCount?: number;
    dimensions?: string;
    features?: string[];
    [key: string]: any;
  };
}

const DatasetSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    size: { type: Number, required: true },
    format: { type: String, required: true },
    version: { type: String, default: '1.0' },
    downloads: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    visibility: { 
      type: String, 
      enum: ['public', 'team', 'private'], 
      default: 'team' 
    },
    metadata: {
      sampleCount: { type: Number },
      dimensions: { type: String },
      features: [{ type: String }],
    },
  },
  { timestamps: true }
);

// Add text index for search functionality
DatasetSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text',
  category: 'text',
});

export default mongoose.models.Dataset || mongoose.model<IDataset>('Dataset', DatasetSchema); 