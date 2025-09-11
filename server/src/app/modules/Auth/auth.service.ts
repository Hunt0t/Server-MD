/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import speakeasy from 'speakeasy';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config, {
  jwt_access_expires_in,
  jwt_refresh_expires_in,
} from '../../config';
import AppError from '../../errors/AppError';
import { conflict, forbidden, notFound } from '../../utils/errorfunc';
import { createToken, verifyToken } from '../../utils/utils';
import { generateUniqueCode } from '../../utils/generateUniqueCode';
import { TEmailInfo } from '../../utils/utils.interface';
import sendEmail from '../../utils/sendEmail';
import { TUser, UserStatus } from './auth.schema';
import { User } from './auth.model';
import { TLoginUser, TVerification } from './auth.schema';
import geoip from 'geoip-lite';
import useragent from 'useragent';

const loginUser = async (payload: TLoginUser, req: any, res: any) => {
  console.log('loginUser called with payload:', payload);
  const orQuery = [];
  if (payload.email) orQuery.push({ email: payload.email });
  if (payload.name) orQuery.push({ name: payload.name });

  const user = await User.findOne(
    orQuery.length ? { $or: orQuery } : {},
  ).select('+password');

  if (!user) {
    console.log('User not found for:', payload);
    throw notFound('User not found!');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user?.password,
  );
  console.log('Password matched:', isPasswordMatched);

  if (!isPasswordMatched) {
    throw forbidden('Please provide the correct password.');
  }

  const userStatus = user?.status;
  if (userStatus === UserStatus.BLOCKED) {
    throw forbidden('This account has been blocked.', 'not_found');
  }

  if (userStatus === UserStatus.DELETE) {
    throw forbidden('Account is deleted.', 'not_found');
  }

  if (user?.status !== UserStatus.IN_PROGRESS) {
    throw forbidden('Please contact telegram.');
  }

  // 2FA check
  if (user.is2FAEnabled) {
    console.log('2FA is enabled for user:', user.email);
    const twoFAPayload = {
      email: user.email,
      id: user._id,
      password: payload.password,
    };
    const twoFAToken = createToken(
      twoFAPayload,
      config.jwt_access_secret as string,
      '5m',
    );
    // Set twoFAToken as a cookie
    res.cookie('twoFAToken', twoFAToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 5 * 60 * 1000,
    });
    return {
      requires2FA: true,
    };
  }

  const agent = useragent.parse(req.headers['user-agent']);

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const geo = geoip.lookup(ip);
  const { family, major } = agent.os;
  const deviceId = req?.sessionID;

  const detectDeviceType = (userAgentString: string): string => {
    const agent = useragent.parse(userAgentString);
    const osFamily = agent.os.family.toLowerCase();
    const deviceFamily = agent.device.family.toLowerCase();

    // Detect mobile devices
    if (osFamily.includes('android') || osFamily.includes('ios')) {
      return 'mobile';
    }

    // Detect tablets
    if (deviceFamily.includes('tablet') || osFamily.includes('ipad')) {
      return 'tablet';
    }

    if (
      osFamily.includes('windows') ||
      osFamily.includes('mac') ||
      osFamily.includes('linux') ||
      deviceFamily.includes('laptop')
    ) {
      return 'desktop';
    }

    return 'desktop';
  };

  const deviceType = detectDeviceType(req.headers['user-agent'] || '');

  const deviceInfo = {
    deviceId,
    deviceType: deviceType,
    lastActively: new Date(),
    deviceName: family + ' ' + major,
    os: agent.family + ' ' + agent.major,
    lastActivity: new Date(),
    location: geo ? `${geo.city}, ${geo.country}` : 'Unknown',
    ipAddress: ip,
  };

  // Save the device information
  user.devices = user.devices || [];
  const existingDeviceIndex = user.devices.findIndex(
    (d) => d.deviceId === deviceInfo.deviceId,
  );

  if (existingDeviceIndex !== -1) {
    user.devices[existingDeviceIndex] = deviceInfo;
  } else {
    user.devices.unshift(deviceInfo);
  }

  await user.save();

  const jwtPayload = {
    deviceId,
    email: user?.email,
    id: user?._id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    jwt_refresh_expires_in as string,
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    accessToken,
  };
};



  const login2FA = async (req: any, res: any) => {
    console.log('login2FA called');
    const token = req.cookies.twoFAToken;
    const { code } = req.body;
    console.log('2FA code received:', code);
    if (!token) {
      console.log('2FA token missing in cookies');
      throw forbidden('2FA token missing.');
    }
    let decoded: any;
    try {
      decoded = verifyToken(token, config.jwt_access_secret as string);
    } catch (err) {
      console.log('Invalid or expired 2FA token');
      throw forbidden('Invalid or expired 2FA token.');
    }
    const user = await User.findOne({ email: decoded.email }).select(
      '+password',
    );
    if (!user) {
      console.log('User not found for 2FA');
      throw notFound('User not found!');
    }
    if (!user.is2FAEnabled) {
      console.log('2FA is not enabled for this user');
      throw forbidden('2FA is not enabled for this user.');
    }
    if (!user.secret) {
      console.log('2FA secret not set for user');
      throw forbidden('2FA secret not set for user.');
    }
    const speakeasy = require('speakeasy');
    console.log('speakeasy module:', speakeasy);
    console.log('user.secret:', user.secret);
    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: code,
      window: 1,
    });
    console.log('2FA code verified:', verified);
    if (!verified) {
      console.log('Invalid 2FA code');
      throw forbidden('Invalid 2FA code.');
    }
    // Device info and login logic (same as normal login)
    const agent = useragent.parse(req.headers['user-agent']);
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    const { family, major } = agent.os;
    const deviceId = req?.sessionID;
    const detectDeviceType = (userAgentString: string): string => {
      const agent = useragent.parse(userAgentString);
      const osFamily = agent.os.family.toLowerCase();
      const deviceFamily = agent.device.family.toLowerCase();
      if (osFamily.includes('android') || osFamily.includes('ios'))
        return 'mobile';
      if (deviceFamily.includes('tablet') || osFamily.includes('ipad'))
        return 'tablet';
      if (
        osFamily.includes('windows') ||
        osFamily.includes('mac') ||
        osFamily.includes('linux') ||
        deviceFamily.includes('laptop')
      )
        return 'desktop';
      return 'desktop';
    };
    const deviceType = detectDeviceType(req.headers['user-agent'] || '');
    const deviceInfo = {
      deviceId,
      deviceType: deviceType,
      lastActively: new Date(),
      deviceName: family + ' ' + major,
      os: agent.family + ' ' + agent.major,
      lastActivity: new Date(),
      location: geo ? `${geo.city}, ${geo.country}` : 'Unknown',
      ipAddress: ip,
    };
    user.devices = user.devices || [];
    const existingDeviceIndex = user.devices.findIndex(
      (d) => d.deviceId === deviceInfo.deviceId,
    );
    if (existingDeviceIndex !== -1) {
      user.devices[existingDeviceIndex] = deviceInfo;
    } else {
      user.devices.unshift(deviceInfo);
    }
    await user.save();
    const jwtPayload = {
      deviceId,
      email: user?.email,
      id: user?._id,
      role: user?.role,
    };
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      jwt_access_expires_in as string,
    );
    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      jwt_refresh_expires_in as string,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.clearCookie('twoFAToken');
    return {
      accessToken,
    };
  };


const logoutOtherUser = async (req: any, payload: any) => {
  const { deviceId } = req.params;

  const user = await User.findOne({ email: payload?.email });

  if (!user) {
    throw notFound('User not found');
  }

  user.devices = (user.devices || []).filter(
    (d: any) => d.deviceId === deviceId,
  );
  const result = await user.save();

  return result;
};

const logoutUser = async (req: any, data: any) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw notFound('Something was wrong');
  }

  await User.updateOne(
    { email: data?.email },
    { $pull: { devices: { deviceId: data?.deviceId } } },
  );

  req.headers.authorization = '';
  req.cookies.refreshToken = '';
};

const refreshToken = async (req: any, res: any) => {
  const { refreshToken } = req.cookies;

  const decoded = verifyToken(
    refreshToken,
    config.jwt_refresh_secret as string,
  );

  const { email, deviceId } = decoded;
  const user = (await User.findOne({ email })) as unknown as TUser;

  if (!user) {
    throw notFound('User not found!');
  }

  const userStatus = user?.status;
  if (userStatus === UserStatus.BLOCKED) {
    throw forbidden('Please provide the correct password.');
  }
  if (user.status !== UserStatus.IN_PROGRESS) {
    throw forbidden('Please provide the correct password.');
  }

  const isDevice = await User.findOne({
    email: decoded?.email,
    'devices.deviceId': deviceId,
  });

  if (isDevice === null || !isDevice) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Session is expire new error!',
      [
        {
          path: 'unauthorized',
          message: 'Session is expire new error!',
        },
      ],
    );
  }

  res.clearCookie('connect.sid');

  await User.updateOne(
    { email: user?.email, 'devices.deviceId': deviceId },
    {
      $set: {
        'devices.$.lastActivity': new Date(),
      },
    },
  );

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgerPassword = async (email: string) => {
  // checking if the user is exist
  const user: TUser | null = await User.findOne({ email });
  if (!user) {
    throw notFound('User not found!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === UserStatus.BLOCKED) {
    throw forbidden('This use was blocked.');
  }

  const code = generateUniqueCode(6);

  const body = `This is your verification code ${code}`;

  const emailData: TEmailInfo = {
    email: email,
    body: ` <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify OTP to Change Password</title>
    <style>
      svg {
        height: 30px !important;
      }
    </style>
  </head>
  <body style="font-family: Arial, sans-serif;  color: #fff; margin: 0; padding: 0;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #111; border-radius: 8px; box-shadow: 0 4px 8px rgba(255, 255, 0, 0.2); text-align: center;">
            <!-- Header with Logo -->
            <tr>
              <td style="background-color: #ffed00; padding: 10px; text-align: center;">
              
          <img src="https://res.cloudinary.com/dssmacjme/image/upload/v1741600767/vr4iqumzttiqefri1h3n.jpg" alt="Skillion" height="30" class="CToWUd" data-bit="iit">
        
              </td>
            </tr>
            <!-- OTP Section -->
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #fff; font-size: 24px;">🔐 Verify Your OTP</h2>
                <table align="center" style="background-color: #222; padding: 10px; border-radius: 5px;">
                  <tr>
                    <td style="font-size: 28px; font-weight: bold; color: #ffed00;">${code}</td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: red; margin-top: 10px; font-weight: bold;">
                  ⚠ This OTP is valid for **only 5 minutes**. Please use it before it expires!
                </p>
                <p style="font-size: 14px; color: #bbb; margin-top: 10px;">For security reasons, never share your OTP with anyone.</p>
              </td>
            </tr>
            <!-- Footer Links -->
            <tr>
              <td style="background-color: #000; padding: 15px; text-align: center; font-size: 14px;">
                <a href="https://www.facebook.com/skilliontech.official" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">Facebook</a>
                <a href="https://www.youtube.com/@SkillionTech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">YouTube</a>
                <a href="https://www.tiktok.com/@skilliontech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">TikTok</a>
                <a href="https://www.linkedin.com/company/skilliontech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">LinkedIn</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

    `,
    subject: 'Verify OTP to Change Password',
  };

  const sentMail = await sendEmail(emailData);

  const expired = new Date();
  expired.setMinutes(expired.getMinutes() + 2);
  // const sentMail = true;
  if (sentMail) {
    await User.findOneAndUpdate(
      { email },
      { verification: { code, verification, expired } },
    );
  }

  return body;
};

const verification = async (payload: TVerification) => {
  const user = await User.findOne({ email: payload.email }).select(
    'verification',
  );

  if (!user) {
    throw forbidden('Something went wrong!');
  }

  if (!payload?.code) {
    throw forbidden('Enter 6 digit code');
  }

  await User.findOneAndUpdate(
    { email: payload.email },
    { verification: { verification: true, code: payload?.code } },
  );

  return;
};

const verificationForgetPassword = async (payload: {
  code: string;
  email: string;
}) => {
  const user = await User.findOne({ email: payload.email }).select(
    'verification',
  );

  if (!user) {
    throw forbidden('Something went wrong!');
  }

  if (!payload?.code) {
    throw forbidden('Enter 6 digit code');
  }

  await User.findOneAndUpdate(
    { email: payload.email },
    { verification: { verification: true, code: payload?.code } },
  );

  const jwtPayload = {
    email: payload.email,
    code: payload.code,
  };

  const validation = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '2m' as string,
  );

  return { validation };
};

const setNewPassword = async (token: string, password: string) => {
  // Checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email } = decoded;

  // Checking if the user exists
  const user = (await User.findOne({ email }).select(
    'email status -_id',
  )) as unknown as TUser;

  if (!user) {
    throw notFound('User not found!');
  }

  const userStatus = user?.status;

  if (userStatus === UserStatus.BLOCKED) {
    throw forbidden('The user has been blocked!');
  }

  // Ensure bcrypt_salt_rounds is a valid number
  const saltRounds = Number(config.bcrypt_salt_rounds);

  if (isNaN(saltRounds) || saltRounds <= 0) {
    throw new Error('Invalid bcrypt salt rounds configuration.');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: hashedPassword,
      updateAt: new Date(),
    },
  );

  return '';
};

const changePassword = async (req: any) => {
  // Check if the user is authenticated
  const token = req.cookies.refreshToken;
  if (!token) {
    throw forbidden('Something went wrong');
  }
  const payload = req.body;

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  //hash new password
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // update user password
  await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: hashedPassword,
      updateAt: new Date(),
    },
  );
};

const getMe = async (payload: any) => {
  const user = await User.findById(payload.id);

  if (!user) {
    throw notFound('No user found.');
  }

  // Destructure and reassemble the user data
  const { email, ...restUserData } = user.toObject();

  return { email, ...restUserData };
};

// Update an existing user
const updateMe = async (req: any) => {
  const id: string = req?.user?.id;
  const payload: any = req?.body;

  const isUser = (await User.findById(id).select('+password')) as TUser;

  if (!isUser) {
    throw notFound('No user found');
  }

  const isExitsName = await User.findOne({ name: payload?.name });

  if (isExitsName) {
    throw conflict('Name already exists.', 'name');
  }

  if (!/^[A-Za-z0-9_]+$/.test(payload.name)) {
    throw conflict(
      'Name can only contain letters, numbers, and underscores.',
      payload.name,
    );
  }
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw notFound('Something is wrong');
  }

  return result;
};

// Delete a user
const deleteMe = async (id: string) => {
  const deletedUser = await User.findByIdAndUpdate(id, {
    status: UserStatus.DELETE,
  });
  if (!deletedUser) {
    throw notFound('No user found.');
  }
  return deletedUser;
};

const enable2FA = async (_id: string) => {
  const user = await User.findOne({ _id });
  if (!user) {
    throw notFound('User not found');
  }

  const secret = authenticator.generateSecret();

  user.secret = secret;
  await user.save();

  const otpauthURL = authenticator.keyuri(user.email, 'MyApp', secret);
  const qrCode = await qrcode.toDataURL(otpauthURL);

  return { qrCode, secret };
};

// 2FA verification stub

const verify2fa = async (userId: string, code: string, secret: string) => {
  const user = await User.findById(userId);
  if (!user) {
    return {
      success: false,
      message: 'User not found.',
    };
  }

  const userSecret = secret || user.secret;
  if (!userSecret) {
    return {
      success: false,
      message: '2FA secret not set for user.',
    };
  }

  const verified = speakeasy.totp.verify({
    secret: userSecret,
    encoding: 'base32',
    token: code,
    window: 1,
  });

  if (verified) {
    if (!user.is2FAEnabled) {
      user.is2FAEnabled = true;
      await user.save();
    }
    return {
      success: true,
      message: '2FA verification successful.',
    };
  } else {
    return {
      success: false,
      message: 'Invalid 2FA code.',
    };
  }
};

export const AuthServices = {
  loginUser,
  login2FA,
  logoutUser,
  changePassword,
  refreshToken,
  verification,
  forgerPassword,
  setNewPassword,
  verificationForgetPassword,
  getMe,
  updateMe,
  deleteMe,
  logoutOtherUser,
  enable2FA,
  verify2fa,
};
