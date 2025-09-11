import { z } from 'zod';
import { BaseType } from '../../utils/utils.interface';

export enum ANNOUNCEMENT_STATUS {
  ACTIVE = 'active',
  DELETE = 'delete',
}

const announcementSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required.' }),
    description: z.string({ required_error: 'Description is required.' }),
    position: z.string().optional(),
    status: z.enum([ANNOUNCEMENT_STATUS.ACTIVE, ANNOUNCEMENT_STATUS.DELETE]).optional().default(ANNOUNCEMENT_STATUS.ACTIVE),
  }),
});

export type TAnnouncementStatus = `${ANNOUNCEMENT_STATUS}`;
export type TAnnouncement = BaseType & z.infer<typeof announcementSchema.shape.body>;

export const AnnouncementValidation = {
  announcementSchema,
};
