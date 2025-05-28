import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  name: string;
  quantity: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  branchId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}

const orderSchema = new Schema<IOrder>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);
