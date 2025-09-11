/* eslint-disable @typescript-eslint/no-explicit-any */
import { Orders } from './orders.model';
import { BoughtOrders } from './buyedOrders.model';
import { Product } from '../products/products.model';
import { Payment } from '../payment/payment.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { conflict, notFound } from '../../utils/errorfunc';

// Create orders (one order per productId)
const createOrders = async (payload: { productIds: string[] }, req: any) => {
  const userId = req?.user?.id;
  if (!userId) throw new Error('User not authenticated');

  // Fetch all products by IDs
  const products = await Product.find({ _id: { $in: payload.productIds } });
  const foundIds = products.map((p) => p._id.toString());
  const missingIds = payload.productIds.filter((id) => !foundIds.includes(id));
  if (missingIds.length > 0) {
    throw new Error('Products not found: ' + missingIds.join(', '));
  }
 
  const lastPayment = await Payment.findOne({ userId }).sort({ createdAt: -1 });
  if (!lastPayment) throw new Error('No payment found for user');

  let totalCost = 0;
  for (const productId of payload.productIds) {
    const product = products.find((p) => p._id.toString() === productId);
    if (!product) continue;
    totalCost += product.price || 0;
  }
  if (totalCost > lastPayment.totalAmount) {
    throw new Error('Total cost exceeds your last payment totalAmount');
  }
  ``;
 
  const orders = [];
  const newOrderIds = [];
  for (const productId of payload.productIds) {
    const product = products.find((p) => p._id.toString() === productId);
    if (!product) continue;
    const order = await Orders.create({
      userId,
      productId,
      price: product.price,
      paymentId: lastPayment._id,
      firstName: product.firstName,
      lastName: product.lastName,
      city: product.city,
      state: product.state,
      zip: product.zip,
      country: product.country,
      year: product.dob,
      status: product.status,
      orderId: product.orderId,
      phone: product.phone,
      mail: product.mail,
      ssn: product.ssn,
      address: product.address,
      dob: product.dob,
      gender: product.gender,
    });
    orders.push(order);
    newOrderIds.push(product._id);
    // Delete the product after buying
    // await Product.findByIdAndDelete(product._id);
  }

  // Update BoughtOrders for the user
  let boughtOrders = await BoughtOrders.findOne({ userId });
  if (boughtOrders) {
    boughtOrders.boughtOrderIds = [
      ...boughtOrders.boughtOrderIds,
      ...newOrderIds,
    ];
    await boughtOrders.save();
  } else {
    await BoughtOrders.create({ userId, boughtOrderIds: newOrderIds });
  }

  // Deduct the cost from last payment's totalAmount
  lastPayment.totalAmount = lastPayment.totalAmount - totalCost;
  await lastPayment.save();

  return orders;
};

// Get all orders for a user
const getOrders = async (userId: string, filter: any = {}) => {
  const queryBuilder = new QueryBuilder(Orders.find({ userId }), filter)
    .cleanQuery()
    .search(['firstName', 'lastName', 'city', 'state', 'zip', 'country'])
    .filter()
    .sort(filter.sort || 'no')
    .dateFilter('createdAt')
    // .yearFilter('year')
    .paginate()
    .fields()
    .populate('userId', '-devices');
  // .populate('productId');
  const data = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();
  return { meta, data };
};

// Delete order by id
const deleteOrder = async (_id: string) => {
  const order = await Orders.findOne({ _id });
  if (!order) throw notFound('Order not found or not authorized');
  const deleted = await Orders.findByIdAndDelete(_id);
  if (!deleted) throw conflict('Order could not be deleted');
  return deleted;
};

export const orderServices = {
  createOrders,
  getOrders,
  deleteOrder,
};
