import express from 'express';
import { userContactController } from './userContact.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.schema';

const router = express.Router();

// Create a new contact (any user)
router.post('/create-contact', userContactController.createContact);

// Get all contacts (admin only)
router.get('/contacts', auth(USER_ROLE.ADMIN), userContactController.getAllContacts);

// Get single contact by id (admin only)
router.get('/contacts/:id', auth(USER_ROLE.ADMIN), userContactController.getContactById);

// Get all contacts by user (user only)
router.get('/my-contacts', auth(USER_ROLE.USER), userContactController.getContactsByUser);

export const userContactRoutes = router;
