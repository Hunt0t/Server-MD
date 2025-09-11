import { ANNOUNCEMENT_STATUS, TAnnouncement } from './announcements.schema';
import { Announcement } from './announcements.model';
import { IMyRequest } from '../../utils/decoded';
import QueryBuilder from '../../builder/QueryBuilder';

const getAnnouncements = async (req: IMyRequest) => {
  const queryBuilder = new QueryBuilder(
    Announcement.find({ status: ANNOUNCEMENT_STATUS.ACTIVE }),
    req.query,
  )
    .search(['title', 'description'])
    .filter()
    .sort(req.query.sort || 'no')
    .dateFilter('date')
    .paginate()
    .fields();
  const data = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();
  return { meta, data };
};

const createAnnouncement = async (payload: TAnnouncement) => {
  const result = await Announcement.create(payload);
  return result;
};

const updateAnnouncement = async (id: string, payload: Partial<TAnnouncement>) => {
  const updated = await Announcement.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

const deleteAnnouncement = async (id: string) => {
  const deleted = await Announcement.findByIdAndUpdate(
    id,
    { status: ANNOUNCEMENT_STATUS.DELETE },
    { new: true },
  );
  return deleted;
};

export const announcementServices = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
