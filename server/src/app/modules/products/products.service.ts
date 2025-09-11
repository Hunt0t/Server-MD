/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

import { IMyRequest } from '../../utils/decoded';
import QueryBuilder from '../../builder/QueryBuilder';
import { PRODUCT_STATUS, TProduct } from './products.schema';
import { Product } from './products.model';
import { BoughtOrders } from '../orders/buyedOrders.model';
import { Orders } from '../orders/orders.model';

const getProducts = async (req: IMyRequest) => {
  let excludeIds: string[] = [];
  const userId = (req as any)?.user?.id;
  if (userId) {
    const bought = await BoughtOrders.findOne({ userId });
    if (
      bought &&
      Array.isArray(bought.boughtOrderIds) &&
      bought.boughtOrderIds.length > 0
    ) {
      excludeIds = bought.boughtOrderIds.map((id: any) => id.toString());
    }
  }

  // Step 2: Build the base query, excluding bought products
  const baseQuery: any = { status: PRODUCT_STATUS.ACTIVE };
  if (excludeIds.length > 0) {
    baseQuery._id = {
      $nin: excludeIds.map((id) => new mongoose.Types.ObjectId(id)),
    };
  }

  const queryBuilder = new QueryBuilder(Product.find(baseQuery), req.query)
    .cleanQuery()
    .yearFilter('dob')
    .search(['firstName', 'lastName', 'city', 'zip', 'country'])
    .filter()
    .sort(req.query.sort || 'no')
    .paginate()
    .select('orderId firstName lastName gender dob zip state price')
    .fields();
  const data = await queryBuilder.modelQuery;

  const meta = await queryBuilder.countTotal();
  return { meta, data };
};

const getProductsForAdmin = async (req: IMyRequest) => {
  let excludeIds: string[] = [];
  const userId = (req as any)?.user?.id;
  if (userId) {
    const bought = await BoughtOrders.findOne({ userId });
    if (
      bought &&
      Array.isArray(bought.boughtOrderIds) &&
      bought.boughtOrderIds.length > 0
    ) {
      excludeIds = bought.boughtOrderIds.map((id: any) => id.toString());
    }
  }

  // Step 2: Build the base query, excluding bought products
  const baseQuery: any = { status: PRODUCT_STATUS.ACTIVE };
  if (excludeIds.length > 0) {
    baseQuery._id = {
      $nin: excludeIds.map((id) => new mongoose.Types.ObjectId(id)),
    };
  }

  const queryBuilder = new QueryBuilder(Product.find(baseQuery), req.query)
    .cleanQuery()
    .yearFilter('dob')
    .search(['firstName', 'lastName', 'city', 'zip', 'country'])
    .filter()
    .sort(req.query.sort || 'no')
    .paginate()
    .fields();
  const data = await queryBuilder.modelQuery;

  const meta = await queryBuilder.countTotal();
  return { meta, data };
};

// Create a new user
const createProduct = async (payload: TProduct) => {
  const lastProduct = await Product.findOne()
    .sort({ orderId: -1 })
    .select('orderId');

  const nextOrderId = lastProduct?.orderId
    ? Number(lastProduct.orderId) + 1
    : 1;

  payload.orderId = nextOrderId.toString().padStart(6, '0');
  const result = await Product.create(payload);
  return result;
};
// Update a product
const updateProduct = async (id: string, payload: Partial<TProduct>) => {
  const updatedProduct = await Product.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedProduct;
};

// Delete a product (soft delete by setting status to 'delete')
const deleteProduct = async (id: string) => {
  const deletedProduct = await Product.findByIdAndUpdate(
    id,
    { status: PRODUCT_STATUS.DELETE },
    { new: true },
  );
  return deletedProduct;
};

const exportProducts = async (ids?: string[]) => {
  const matchStage: any = {};
  if (ids && ids.length > 0) {
    matchStage._id = {
      $in: ids.map((id) =>
        typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id,
      ),
    };
  }

  // Only select the required fields
  const pipeline = [
    { $match: matchStage },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        gender: 1,
        dob: 1,
        address: 1,
        phone: 1,
        city: 1,
        state: 1,
        zip: 1,
        mail: 1,
        ssn: 1,
      },
    },
  ];
  const data = await Orders.aggregate(pipeline);
  type Row = any;
  // Map to required header names
  const headerMap: { [key in keyof Row]: string } = {
    firstName: 'FIRST NAME',
    lastName: 'LAST NAME',
    gender: 'GENDER',
    dob: 'DOB',
    address: 'ADDRESS',
    city: 'CITY',
    state: 'STATE',
    zip: 'ZIP',
    phone: 'PHONE',
    mail: 'MAIL',
    ssn: 'SSN',
  };

  const rows = data.map((row: any) => {
    const mapped: any = {};
    for (const key in headerMap as any) {
      let value = row[key] ?? '';
      if (key === 'dob' && value) {
        const dateObj = new Date(value);
        if (!isNaN(dateObj.getTime())) {
          const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
          const dd = String(dateObj.getDate()).padStart(2, '0');
          const yyyy = dateObj.getFullYear();
          value = `${mm}/${dd}/${yyyy}`;
        }
      }
      mapped[headerMap[key as any]] = value;
    }
    return mapped;
  });

  return rows;
};

const bulkImportOrders = async (orders: any[], req: any) => {
  const price = Number(req?.body?.price || 0.25);
  const fileName = req.file.originalname;
  const toCamelCase = (str: string) => {
    return str
      .replace(
        /\b([A-Z]+)\b/g,
        (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase(),
      )
      .replace(/^(.)/, (m, c) => c.toLowerCase())
      .replace(/\s+(\w)/g, (_, c) => c.toUpperCase())
      .replace(/\s/g, '');
  };

  const processOrder = (order: any) => {
    const newOrder: any = {};
    for (const key in order) {
      let camelKey = toCamelCase(key);
      let value = order[key];
      if (camelKey === 'dob') {
        if (typeof value === 'string') {
          const parsedDate = new Date(value);
          if (!isNaN(parsedDate.getTime())) {
            value = parsedDate;
          }
        } else if (typeof value === 'object' && value && value.$date) {
          const parsedDate = new Date(value.$date);
          if (!isNaN(parsedDate.getTime())) {
            value = parsedDate;
          }
        }
      }
      newOrder[camelKey] = value;
    }
    return newOrder;
  };

  const userId = req?.user?.id;
  if (!userId) throw new Error('User not authenticated');

  const lastProduct = await Product.findOne()
    .sort({ orderId: -1 })
    .select('orderId');
  let nextOrderId = lastProduct?.orderId ? Number(lastProduct.orderId) + 1 : 1;

  const created = [];
  for (const order of orders) {
    const processed = processOrder(order);
    const { _id, orderId, createdAt, updatedAt, ...rest } = processed;
    const allEmpty = Object.values(rest).every((v) => v === '');
    if (allEmpty) continue;

    // Safely handle dob if it is an object with $date (defensive)
    if (rest.dob && typeof rest.dob === 'object' && rest.dob.$date) {
      rest.dob = new Date(rest.dob.$date);
    }

    const newOrderId = nextOrderId.toString().padStart(6, '0');
    nextOrderId++;
    const doc = await Product.create({
      ...rest,
      userId,
      orderId: newOrderId,
      price,
      fileName,
    });
    created.push(doc);
  }
  return created;
};

// Get unique states using aggregation
const getUniqueStates = async () => {
  const result = await Product.aggregate([
    { $group: { _id: '$state' } },
    { $project: { _id: 0, state: '$_id' } },
    { $sort: { state: 1 } },
  ]);
  return result.map((item: any) => item.state);
};
const getUniqueFileNames = async () => {
  const result = await Product.aggregate([
    { $match: { status: { $ne: PRODUCT_STATUS.DELETE } } },
    { $group: { _id: '$fileName' } },
    { $project: { _id: 0, state: '$_id' } },
    { $sort: { state: 1 } },
  ]);
  return result.map((item: any) => item.state);
};

const deleteProductsByFileName = async (fileName: string) => {
  const result = await Product.updateMany(
    { fileName },
    { status: PRODUCT_STATUS.DELETE },
  );
  return result;
};

export const productServices = {
  getProducts,
  getProductsForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProducts,
  bulkImportOrders,
  getUniqueStates,
  getUniqueFileNames,
  deleteProductsByFileName,
};
