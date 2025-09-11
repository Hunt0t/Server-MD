import express from 'express';
import { announcementControllers } from './announcements.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.schema';

const router = express.Router();

// Create announcement
router.post(
  '/create-announcement',
  auth(USER_ROLE.ADMIN),
  announcementControllers.createAnnouncement,
);

// Update announcement
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN),
  announcementControllers.updateAnnouncement,
);

// Delete announcement
router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  announcementControllers.deleteAnnouncement,
);

// Get all announcements
router.get(
  '/announcements',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  announcementControllers.getAnnouncements,
);

export const announcementRoutes = router;
