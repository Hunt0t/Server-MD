/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

// Create a new user
const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `${req?.body?.email} Check your email and use the 6-digit code.`,
    data: result,
  });
});


const getUsers = catchAsync(async (req: any, res) => {
  const result = await UserServices.getUsers(req as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users have been successfully loaded.',
    data: result.transformedUsers,
    meta: result.meta,
  });
});

// Update user status
const updateUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await UserServices.updateUserStatus(id, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status updated successfully.',
    data: result,
  });
});

// Update user status
const updateTelegram = catchAsync(async (req, res) => {
  
  const link = req.body.link;
  const id = req.body.id;
  const result = await UserServices.updateTelegram(id, link);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status updated successfully.',
    data: result,
  });
});

// Update user status
const telegram = catchAsync(async (req, res) => {
  const result = await UserServices.telegram();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status updated successfully.',
    data: result,
  });
});

export const UserControllers = {
  getUsers,
  createUser,
  updateUserStatus,
  updateTelegram,
  telegram,
};
