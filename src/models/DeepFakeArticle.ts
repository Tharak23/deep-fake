import mongoose from 'mongoose';
import { Schema, models, model } from 'mongoose';

export interface IDeepFakeArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: Date;
  content: string | null;
  category: string;
  relevanceScore: number;
  isPublished: boolean;
  publishDate: Date | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DeepFakeArticleSchema = new Schema<IDeepFakeArticle>(
  {
    source: {
      id: { type: String, default: null },
      name: { type: String, required: true },
    },
    author: { type: String, default: null },
    title: { type: String, required: true },
    description: { type: String, default: null },
    url: { type: String, required: true, unique: true },
    urlToImage: { type: String, default: null },
    publishedAt: { type: Date, required: true },
    content: { type: String, default: null },
    category: { type: String, required: true, default: 'news' },
    relevanceScore: { type: Number, required: true, default: 0 },
    isPublished: { type: Boolean, default: false },
    publishDate: { type: Date, default: null },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
DeepFakeArticleSchema.index({ url: 1 }, { unique: true });
DeepFakeArticleSchema.index({ publishedAt: -1 });
DeepFakeArticleSchema.index({ relevanceScore: -1 });
DeepFakeArticleSchema.index({ isPublished: 1, publishDate: -1 });
DeepFakeArticleSchema.index({ tags: 1 });

// Create a text index for search functionality
DeepFakeArticleSchema.index(
  { title: 'text', description: 'text', content: 'text' },
  { weights: { title: 10, description: 5, content: 1 } }
);

// Export the model
const DeepFakeArticle = models.DeepFakeArticle || model<IDeepFakeArticle>('DeepFakeArticle', DeepFakeArticleSchema);

export default DeepFakeArticle; 