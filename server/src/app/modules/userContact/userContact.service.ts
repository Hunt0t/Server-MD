import { UserContact, IUserContact } from './userContact.model';
import QueryBuilder from '../../builder/QueryBuilder';

// Create a new contact
const createContact = async (payload: IUserContact) => {
  
  const result = await UserContact.create(payload);
  return result;
};

// Get all contacts (admin) with pagination and filter
const getAllContacts = async (req: any) => {
  const queryBuilder = new QueryBuilder(
    UserContact.find(),
    req.query,
  ).cleanQuery()
    .filter()
    .sort('-createdAt')
    .paginate()
    // .fields();
  const data = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();
  return { data, meta };
};

// Get single contact by id
const getContactById = async (id: string) => {
  return UserContact.findById(id);
};

// Get all contacts by userId with pagination and filter
const getContactsByUser = async (userId: string, req: any) => {
  const queryBuilder = new QueryBuilder(
    UserContact.find({ userId }),
    req.query,
  )
    .filter()
    .sort('-createdAt')
    .paginate()
    .fields();
  const data = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();
  return { data, meta };
};

export const userContactService = {
  createContact,
  getAllContacts,
  getContactById,
  getContactsByUser,
};
