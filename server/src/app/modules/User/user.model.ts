import { model, Schema } from 'mongoose';
import { TGoogleAuth, TTelegram } from './user.schema';

const googleAuthSchema = new Schema<TGoogleAuth>({
  googleId: String,
  _id: String,
  email: String,
});
export const GoogleAuth = model<TGoogleAuth>('GoogleAuth', googleAuthSchema);

const telegramSchema = new Schema<TTelegram>({
  title: {
    type: String,
    required: false,
  },
  link: {
    type: String,
    required: false,
  },
});
export const Telegram = model<TTelegram>('setting', telegramSchema);
