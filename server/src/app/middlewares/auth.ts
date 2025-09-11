import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import catchAsync from '../utils/catchAsync';
import { forbidden, notFound, unauthorized } from '../utils/errorfunc';
import { User } from '../modules/Auth/auth.model';
import { TUserRole, UserStatus } from '../modules/Auth/auth.schema';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw unauthorized('Please login!');
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (error) {
      res.status(401).json({
        message: 'Unauthorized: Invalid or expired token',
      });
      return;
    }

    const { email, role, deviceId } = decoded;

    // Find the full user information by email
    const user = await User.findOne({ email });

    if (!user) {
      throw notFound('User not found!');
    }
 
    // Device session validation
    if (
      !user.devices ||
      !user.devices.some((d: any) => d.deviceId === deviceId)
    ) {
      console.log('Your session expired')
      // Log cookies before clearing
      // res.cookie('refreshToken', '', { httpOnly: true });
      // res.cookie('accessToken', '', { httpOnly: true }); 
      // return res.status(401).json({
      //   message: 'Your session expired, please login again.',
      // });
    }


    if (user.status === UserStatus.BLOCKED) {
      throw forbidden('The user has been blocked!');
    }

    if (user.status !== UserStatus.IN_PROGRESS) {
      throw forbidden('The user has been blocked!');
    }


    if (requiredRoles && !requiredRoles.includes(role)) {
      throw unauthorized('You are not authorized!');
    }

    req.user = { ...decoded, role, email, id : decoded.id };

    next();
  });
};

export default auth;
