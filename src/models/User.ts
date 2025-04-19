import mongoose, { Schema, models } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: 'admin' | 'user' | 'verified_researcher';
  isVerified: boolean;
  verificationDate?: Date;
  roadmapProgress: number;
  roadmapLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  specialization?: string;
  bio?: string;
  interests?: string;
  institution?: string;
  position?: string;
  field?: string;
  teamRegistered?: boolean;
  blogEnabled?: boolean;
  blogPosts?: Schema.Types.ObjectId[];
  datasets?: Schema.Types.ObjectId[];
  contributions?: {
    papers: string[];
    datasets: string[];
    experiments: string[];
  };
  createdAt: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Not required because of OAuth
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'verified_researcher'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDate: {
      type: Date,
    },
    roadmapProgress: {
      type: Number,
      default: 0,
    },
    roadmapLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    },
    specialization: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    interests: {
      type: String,
      default: '',
    },
    institution: {
      type: String,
    },
    position: {
      type: String,
    },
    field: {
      type: String,
    },
    teamRegistered: {
      type: Boolean,
      default: false,
    },
    blogEnabled: {
      type: Boolean,
      default: false,
    },
    blogPosts: [{ type: Schema.Types.ObjectId, ref: 'BlogPost', default: [] }],
    datasets: [{ type: Schema.Types.ObjectId, ref: 'Dataset', default: [] }],
    contributions: {
      papers: [{ type: Schema.Types.ObjectId, ref: 'Paper', default: [] }],
      datasets: [{ type: Schema.Types.ObjectId, ref: 'Dataset', default: [] }],
      experiments: [{ type: Schema.Types.ObjectId, ref: 'Experiment', default: [] }],
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
userSchema.index({ name: 'text', email: 'text', specialization: 'text', bio: 'text', interests: 'text' });

// Use existing model or create a new one
const User = models.User || mongoose.model<IUser>('User', userSchema);

export default User; 