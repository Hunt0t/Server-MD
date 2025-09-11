import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { orderServices } from './orders.service';

// Create orders (multiple orders at once)
const createOrders = catchAsync(async (req, res) => {
  try {
    const result = await orderServices.createOrders(req.body, req);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Order(s) created successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: (error as Error).message,
      data: null,
    });
  }
});

const getOrders = catchAsync(async (req, res) => {
  const filter = req.query || {};
  const userId = req?.user?.id;
  const result = await orderServices.getOrders(userId as string, filter);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders loaded successfully',
    data: result.data,
    meta: result.meta,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await orderServices.deleteOrder(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  });
});

export const orderControllers = {
  createOrders,
  getOrders,
  deleteOrder,
};
