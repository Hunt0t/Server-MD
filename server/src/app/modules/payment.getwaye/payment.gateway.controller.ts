
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse'; 
import { paymentGatewayService } from './payment.gateway.service';
 

// Get all payment gateways
const getPaymentGateways = catchAsync(async (req, res) => {
  const result = await paymentGatewayService.getPaymentGateways();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All payment gateways loaded.',
    data: result,
  });
}); 

const updatePaymentGateway = catchAsync(async (req, res) => {
  
  const result = await paymentGatewayService.updatePaymentGateway(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment gateway updated.',
    data: result,
  });
});

// Update only payment gateway status
const updatePaymentGatewayStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const result = await paymentGatewayService.updatePaymentGatewayStatus(id, isActive);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment gateway status updated.',
    data: result,
  });
});


export const paymentGatewayController = { 
  getPaymentGateways, 
  updatePaymentGateway, 
  updatePaymentGatewayStatus,
};
