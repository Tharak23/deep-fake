import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IDataset } from './Dataset';

export interface IExperiment extends Document {
  name: string;
  description: string;
  startedBy: mongoose.Types.ObjectId | IUser;
  startDate: Date;
  endDate?: Date;
  status: 'queued' | 'running' | 'paused' | 'completed' | 'failed';
  progress: number; // 0-100
  datasets: (mongoose.Types.ObjectId | IDataset)[];
  modelType: string;
  modelParameters?: {
    [key: string]: any;
  };
  results?: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    [key: string]: any;
  };
  logs: {
    timestamp: Date;
    message: string;
    level: 'info' | 'warning' | 'error';
  }[];
  outputFiles: {
    name: string;
    fileUrl: string;
    type: string;
    size: number;
  }[];
  visibility: 'public' | 'team' | 'private';
}

const ExperimentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { 
      type: String, 
      enum: ['queued', 'running', 'paused', 'completed', 'failed'], 
      default: 'queued' 
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    datasets: [{ type: Schema.Types.ObjectId, ref: 'Dataset' }],
    modelType: { type: String, required: true },
    modelParameters: { type: Schema.Types.Mixed },
    results: {
      accuracy: { type: Number },
      precision: { type: Number },
      recall: { type: Number },
      f1Score: { type: Number },
    },
    logs: [{
      timestamp: { type: Date, default: Date.now },
      message: { type: String, required: true },
      level: { 
        type: String, 
        enum: ['info', 'warning', 'error'], 
        default: 'info' 
      },
    }],
    outputFiles: [{
      name: { type: String, required: true },
      fileUrl: { type: String, required: true },
      type: { type: String, required: true },
      size: { type: Number, required: true },
    }],
    visibility: { 
      type: String, 
      enum: ['public', 'team', 'private'], 
      default: 'team' 
    },
  },
  { timestamps: true }
);

// Add text index for search functionality
ExperimentSchema.index({ 
  name: 'text', 
  description: 'text', 
  modelType: 'text',
});

export default mongoose.models.Experiment || mongoose.model<IExperiment>('Experiment', ExperimentSchema); 