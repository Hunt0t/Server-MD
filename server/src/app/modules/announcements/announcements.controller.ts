import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { announcementServices } from './announcements.service';

const createAnnouncement = catchAsync(async (req, res) => {
  const result = await announcementServices.createAnnouncement(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `Announcement created`,
    data: result,
  });
});

const getAnnouncements = catchAsync(async (req, res) => {
  const result = await announcementServices.getAnnouncements(req as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All announcements loaded.',
    meta: result.meta,
    data: result.data,
  });
});

const updateAnnouncement = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await announcementServices.updateAnnouncement(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Announcement updated',
    data: result,
  });
});

const deleteAnnouncement = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await announcementServices.deleteAnnouncement(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Announcement deleted',
    data: result,
  });
});

export const announcementControllers = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
