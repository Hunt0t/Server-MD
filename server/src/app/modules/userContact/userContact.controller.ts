import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userContactService } from './userContact.service';

// Create a new contact
const createContact = catchAsync(async (req : any, res) => {
  const result = await userContactService.createContact({ ...req.body });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Contact created successfully.',
    data: result,
  });
});

// Get all contacts (admin)
const getAllContacts = catchAsync(async (req, res) => {
  const result = await userContactService.getAllContacts(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All contacts loaded.',
    data: result,
  });
});

// Get single contact by id
const getContactById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userContactService.getContactById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact loaded.',
    data: result,
  });
});

// Get all contacts by user
const getContactsByUser = catchAsync(async (req : any, res) => {
  const userId = req?.user?.id;
  const result = await userContactService.getContactsByUser(userId, req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contacts loaded for user.',
    data: result,
  });
});

export const userContactController = {
  createContact,
  getAllContacts,
  getContactById,
  getContactsByUser,
};
