import mongoose, { Schema, Document } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  location?: string;
}

const branchSchema = new Schema<IBranch>(
  {
    name: { type: String, required: true },
    location: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IBranch>('Branch', branchSchema);
