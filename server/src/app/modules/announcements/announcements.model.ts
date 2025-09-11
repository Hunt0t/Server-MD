import { Schema, model } from 'mongoose';
import { ANNOUNCEMENT_STATUS, TAnnouncement } from './announcements.schema';

const announcementSchema = new Schema<TAnnouncement>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ANNOUNCEMENT_STATUS),
      default: ANNOUNCEMENT_STATUS.ACTIVE,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Announcement = model<TAnnouncement>('Announcement', announcementSchema);
