/* eslint-disable no-unused-vars */

export enum UserStatus {
  IN_PROGRESS = 'in-progress',
  BLOCKED = 'blocked',
  DELETE = 'delete',
}

export enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

export type TUserStatus = `${UserStatus}`;
export type TUserRole = `${USER_ROLE}`;
/* eslint-disable no-unused-vars */

import { z } from 'zod';
import { BaseType } from '../../utils/utils.interface';

const signupSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required.' }),
    name: z.string({ required_error: 'Name is required.' }),
    is2FAEnabled: z.boolean().optional(),
    password: z.string({ required_error: 'Password is required' }),
    role: z.string().optional(),
    status: z.enum([UserStatus.IN_PROGRESS, UserStatus.BLOCKED, UserStatus.DELETE]).optional(),
    rememberPassword: z.boolean().optional(),
    secret: z.string().optional(),
    devices: z
      .array(
        z.object({
          deviceId: z.string({ required_error: 'Device ID is required' }),
          deviceName: z.string({ required_error: 'Device name is required' }),
          os: z.string({ required_error: 'OS is required' }),
          lastActivity: z.coerce.date({
            required_error: 'Last activity is required',
          }),
          location: z.string({ required_error: 'Location is required' }),
          ipAddress: z.string({ required_error: 'IP address is required' }),
        }),
      )
      .optional(),
  }),
});

const loginSchema = z.object({
  body: z
    .object({
      email: z.string({ required_error: 'Email is required.' }).optional(),
      name: z.string({ required_error: 'Name is required.' }).optional(),
      password: z.string({ required_error: 'Password is required' }),
      devices: z
        .array(
          z.object({
            deviceId: z.string({ required_error: 'Device ID is required' }),
            deviceName: z.string({ required_error: 'Device name is required' }),
            os: z.string({ required_error: 'OS is required' }),
            lastActivity: z.coerce.date({
              required_error: 'Last activity is required',
            }),
            location: z.string({ required_error: 'Location is required' }),
            ipAddress: z.string({ required_error: 'IP address is required' }),
          }),
        )
        .optional(),
    })
    .refine((data) => !!data.email || !!data.name, {
      message: 'Either email or name is required.',
      path: ['email', 'name'],
    }),
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

const verificationSchema = z.object({
  body: z.object({
    code: z.string({
      required_error: 'Enter 6 digit code',
    }),
    email: z.string({ required_error: 'Something issue' }),
  }),
});

const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const forgetPasswordSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'User id is required!',
    }),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'User id is required!',
    }),
    newPassword: z.string({
      required_error: 'User password is required!',
    }),
  }),
});

export type TLoginUser = z.infer<typeof loginSchema.shape.body>;
export type TVerification = BaseType &
  z.infer<typeof verificationSchema.shape.body>;
export type TUser = BaseType & z.infer<typeof signupSchema.shape.body>;

export const AuthValidation = {
  loginSchema,
  changePasswordSchema,
  verificationSchema,
  refreshTokenSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  signupSchema,
};
