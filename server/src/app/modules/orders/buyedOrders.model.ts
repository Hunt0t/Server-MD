import { Schema, model } from 'mongoose';

interface TBoughtOrders {
  userId: Schema.Types.ObjectId;
  boughtOrderIds: Schema.Types.ObjectId[];
}

const boughtOrdersSchema = new Schema<TBoughtOrders>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    unique: true,
  },
  boughtOrderIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Orders',
      required: true,
    },
  ],
}, {
  timestamps: true,
});

export const BoughtOrders = model('BoughtOrders', boughtOrdersSchema);
