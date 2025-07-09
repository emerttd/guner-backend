import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  name: string;
  quantity: number;
  category: 'yaş pasta' | 'tatlı' | 'kuru pasta';
  status: 'beklemede' | 'hazırlanıyor' | 'hazır' | 'iptal edildi';
  branchId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}

const orderSchema = new Schema<IOrder>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: {
      type: String,
      enum: ['yaş pasta', 'tatlı', 'kuru pasta'],
      required: true,
    },
    status: {
      type: String,
      enum: ['beklemede', 'hazırlanıyor', 'hazır', 'iptal edildi'],
      default: 'beklemede',
    },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true }, // 🔄 düzeltildi
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);
