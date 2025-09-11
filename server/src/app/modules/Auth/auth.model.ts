import { Schema, model } from 'mongoose';
import { TUser, USER_ROLE, UserStatus } from './auth.schema';

const userSchema = new Schema<TUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    secret: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
    },
    is2FAEnabled: {
      type: Boolean,
      trim: true,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.IN_PROGRESS,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
      trim: true,
    },
    devices: [
      {
        deviceId: { type: String, required: true, trim: true },
        deviceName: { type: String, required: true, trim: true },
        os: { type: String, required: true, trim: true },
        lastActivity: { type: Date, required: true },
        location: { type: String, required: true, trim: true },
        ipAddress: { type: String, required: true, trim: true },
      },
    ],
    rememberPassword: {
      type: Boolean,
      default: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<TUser>('Users', userSchema);
