import mongoose, { Schema, models } from 'mongoose';

export interface IVerificationRequest {
  _id: string;
  userId: Schema.Types.ObjectId;
  userName: string;
  userEmail: string;
  dateSubmitted: Date;
  researchField: string;
  institution: string;
  position: string;
  publicationsCount: number;
  motivation: string;
  publicationLinks: string[];
  status: 'pending' | 'approved' | 'rejected';
  roadmapCompleted: boolean;
  reviewedBy?: Schema.Types.ObjectId;
  reviewDate?: Date;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const verificationRequestSchema = new Schema<IVerificationRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      lowercase: true,
      trim: true,
    },
    dateSubmitted: {
      type: Date,
      default: Date.now,
    },
    researchField: {
      type: String,
      required: [true, 'Research field is required'],
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
    },
    publicationsCount: {
      type: Number,
      default: 0,
    },
    motivation: {
      type: String,
      required: [true, 'Motivation is required'],
    },
    publicationLinks: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    roadmapCompleted: {
      type: Boolean,
      default: false,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewDate: {
      type: Date,
    },
    reviewNotes: {
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
verificationRequestSchema.index({ userName: 'text', userEmail: 'text', researchField: 'text', institution: 'text', motivation: 'text' });

// Use existing model or create a new one
const VerificationRequest = models.VerificationRequest || mongoose.model<IVerificationRequest>('VerificationRequest', verificationRequestSchema);

export default VerificationRequest; 