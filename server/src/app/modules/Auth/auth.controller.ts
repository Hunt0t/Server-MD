
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body, req, res);
  

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: result,
  });
});

// 2FA login controller
const login2FA = catchAsync(async (req, res) => {
  
  const result = await AuthServices.login2FA( req, res);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '2FA login successful!',
    data: { accessToken: result.accessToken },
  });
});


const logoutUser = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;

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

  await AuthServices.logoutUser(req as any, decoded as any);
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged out successfully!',
    data: null,
  });
});

const logoutOtherUser = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;

  let decoded: jwt.JwtPayload;
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

  await AuthServices.logoutOtherUser(req as any, decoded as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logout successfully!',
    data: '',
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const result = await AuthServices.refreshToken(req as any, res as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result.accessToken,
  });
});

const forgerPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgerPassword(req.body.email as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Verification code has been sent!`,
    data: result,
  });
});

const verification = catchAsync(async (req, res) => {
  const result = await AuthServices.verification(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'You are verified!',
    data: result,
  });
});

const setNewPassword = catchAsync(async (req, res) => {
  const validation = await req.cookies.validation;

  const result = await AuthServices.setNewPassword(
    validation,
    req.body.password,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password has been changed!',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePassword(req as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password has been changed!',
    data: result,
  });
});
const verificationForgetPassword = catchAsync(async (req, res) => {
  const { validation } = await AuthServices.verificationForgetPassword(
    req.body,
  );

  res.cookie('validation', validation, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 1000 * 60 * 5,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Verified!',
    data: validation,
  });
});

// Get a single user
const getMe = catchAsync(async (req , res) => {
  const result = await AuthServices.getMe(req?.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My information  loaded.',
    data: result,
  });
});

// Update an existing user
const updateMe = catchAsync(async (req, res) => {
  const result = await AuthServices.updateMe(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been successfully updated.',
    data: result,
  });
});

// Delete a user
const deleteMe = catchAsync(async (req : any, res) => {
  const result = await AuthServices.deleteMe(req?.user?.id as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been successfully deleted.',
    data: result,
  });
});

const enable2FA = catchAsync(async (req : any, res) => {
  const result = await AuthServices.enable2FA(req?.user?.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '2FA enabled. Scan the QR code with your authenticator app.',
    data: result,
  });
});

// POST /auth/verify-2fa
export const verify2fa = catchAsync(async (req : any, res) => {

  const result = await AuthServices.verify2fa(req?.user?.id, req.body.code, req.body.secret);
  res.status(200).json({
    success: result.success,
    message: result.message,
  });
});

export const AuthControllers = {
  loginUser,
  login2FA,
  logoutUser,
  refreshToken,
  verification,
  forgerPassword,
  changePassword,
  setNewPassword,
  verificationForgetPassword,
  getMe,
  updateMe,
  deleteMe,
  logoutOtherUser,
  enable2FA,
};
