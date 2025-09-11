import { z } from 'zod';
import { BaseType } from '../../utils/utils.interface';


// Define Zod schema for notification creation and update
const googleAuthSchema = z.object({
  body: z.object({
    googleId: z.string({
      required_error: 'Please provide the message.',
    }),
  }),
});
const telegramSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Please provide the title.',
    }),
    link: z.string({
      required_error: 'Please provide the link.',
    }),
  }),
});

export type TGoogleAuth = BaseType &
  z.infer<typeof googleAuthSchema.shape.body>;

export type TTelegram = BaseType &
  z.infer<typeof telegramSchema.shape.body>;

export const userValidation = {
  googleAuthSchema,
  telegramSchema
};
