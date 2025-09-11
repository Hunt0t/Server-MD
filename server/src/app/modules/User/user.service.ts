/* eslint-disable @typescript-eslint/no-explicit-any */

import { conflict } from '../../utils/errorfunc';
import { IMyRequest } from '../../utils/decoded';
import QueryBuilder from '../../builder/QueryBuilder';
import bcrypt from 'bcrypt';
import { TUser, USER_ROLE } from '../Auth/auth.schema';
import { User } from '../Auth/auth.model';
import { Telegram } from './user.model';


const getUsers = async (req: IMyRequest) => {
  const queryBuilder = new QueryBuilder(
    User.find({ role: USER_ROLE.USER }),
    req.query,
  ).search(['firstName', 'lastName', 'email'])
    .filter()
    .sort('-createdAt')
    .paginate()
    .fields();

  const transformedUsers = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  return { transformedUsers, meta };
};

// Create a new user
const createUser = async (payload: TUser) => {
  // Validate name: only A-Za-z0-9 and _ allowed
  if (!/^[A-Za-z0-9_]+$/.test(payload.name)) {
    throw conflict(
      'Name can only contain letters, numbers, and underscores.',
      payload.name,
    );
  }

  const isExitsUser = await User.findOne({ email: payload?.email });
  const isExitsName = await User.findOne({ name: payload?.name });
  if (isExitsUser) {
    throw conflict('User already exists.', 'exists');
  }
  if (isExitsName) {
    throw conflict('Name already exists.', 'name');
  }

  const hashPassword = await bcrypt.hash(payload?.password, 12); // 12 salt round
  payload.devices = [];
  payload.password = hashPassword;
  payload.role = USER_ROLE.USER;

  const result = await User.create(payload);
  return result;
};

// Update user status
const updateUserStatus = async (id: string, status: string) => {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );
  return updatedUser;
};

// Update user status
const updateTelegram = async (id: string, link: string) => {
  console.log(link)
  const updatedUser = await Telegram.findByIdAndUpdate(
    id,
    { link },
    {
      new: true,
    },
  );
  return updatedUser;
};

// Update user status
const telegram = async () => {
  const updatedUser = await Telegram.findOne();
  return updatedUser;
};

export const UserServices = {
  getUsers,
  createUser,
  updateUserStatus,
  updateTelegram,
  telegram,
};
