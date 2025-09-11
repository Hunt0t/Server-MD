import { PaymentGateway } from './payment.gateway.model';
import { TPaymentGateway } from './payment.gateway.schema';

// Get all payment gateways
const getPaymentGateways = async () => {
  return PaymentGateway.find();
};



const updatePaymentGateway = async (payload: Partial<TPaymentGateway>) => {
  // If isActive is being set to true, deactivate all others first
  if (payload.isActive === true) {
    await PaymentGateway.updateMany({}, { isActive: false });
  }
  // Build update object
  const updateObj: any = {};
  if (typeof payload.isActive === 'boolean') updateObj.isActive = payload.isActive;
  if (payload.name !== undefined) updateObj.name = payload.name;
  if (payload.apiKey !== undefined) updateObj.apiKey = payload.apiKey;
  if (payload.details !== undefined) updateObj.details = payload.details;

  return PaymentGateway.findByIdAndUpdate(
    payload.id,
    updateObj,
    { new: true },
  );
};


// Update only status (isActive) of a payment gateway
const updatePaymentGatewayStatus = async (id: string, isActive: boolean) => {
  if (isActive === true) {
    await PaymentGateway.updateMany({}, { isActive: false });
  }
  return PaymentGateway.findByIdAndUpdate(
    id,
    { isActive },
    { new: true },
  );
};


export const paymentGatewayService = {
  updatePaymentGateway,
  getPaymentGateways,
  updatePaymentGatewayStatus,
};
