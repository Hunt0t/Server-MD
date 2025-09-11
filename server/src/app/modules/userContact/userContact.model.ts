import { Schema, model } from 'mongoose';

export interface IUserContact {
  name: string;
  email: string;
  subject?: string;
  message: string;
  userId?: string;
}

const userContactSchema = new Schema<IUserContact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  userId: { type: String },
}, { timestamps: true });

export const UserContact = model<IUserContact>('UserContact', userContactSchema);
