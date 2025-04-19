import mongoose, { Schema, models } from 'mongoose';

export interface IBlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  tags: string[];
  likes: number;
  comments: number;
  image?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
    },
    author: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
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
blogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text', tags: 'text' });

// Use existing model or create a new one
const BlogPost = models.BlogPost || mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPost; 