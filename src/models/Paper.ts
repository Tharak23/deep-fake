import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IPaper extends Document {
  title: string;
  authors: mongoose.Types.ObjectId[] | IUser[];
  abstract: string;
  tags: string[];
  publicationDate: Date;
  journal?: string;
  doi?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  citations: number;
  downloads: number;
  views: number;
  bookmarkedBy: mongoose.Types.ObjectId[] | IUser[];
  aiSummary?: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'team' | 'private';
}

const PaperSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    authors: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    abstract: { type: String, required: true },
    tags: [{ type: String }],
    publicationDate: { type: Date, default: Date.now },
    journal: { type: String },
    doi: { type: String },
    fileUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    citations: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    aiSummary: { type: String },
    status: { 
      type: String, 
      enum: ['draft', 'published', 'archived'], 
      default: 'draft' 
    },
    visibility: { 
      type: String, 
      enum: ['public', 'team', 'private'], 
      default: 'team' 
    },
  },
  { timestamps: true }
);

// Add text index for search functionality
PaperSchema.index({ 
  title: 'text', 
  abstract: 'text', 
  tags: 'text',
  journal: 'text',
  doi: 'text'
});

export default mongoose.models.Paper || mongoose.model<IPaper>('Paper', PaperSchema); 
