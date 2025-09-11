"use client";
import React from "react";
import {
  usePaymentConfirmMutation,
  usePaymentProgressMutation,
  useSinglePaymentQuery,
} from "@/app/redux/api/payment/paymentApi";
import { useParams } from "next/navigation";

const PaymentInstructionsPage = () => {
  const payload = useParams();

  const { data } = useSinglePaymentQuery({
    nowpayments_payment_url: payload.url,
  });

  const [paymentProgress] = usePaymentProgressMutation();

  const payment = data?.data;
  const handleCompletePayment = async () => {
    try {
      const res = await paymentProgress({
        url: payload.url,
      });
      // console.log(res?.data?.data);
      if (res) {
        window.open(
          `https://nowpayments.io/payment?iid=${res?.data?.data?.invoiceId}`,
          "_blank"
        );
      }
    } catch {
      // Optional: error handle
    }
    // 2. Redirect to NowPayments
    // window.open(
    //   `https://nowpayments.io/payment?iid=${payment?.nowpayments_payment_id}`,
    //   "_blank"
    // );
  };

  return (
    <div className="flex justify-center items-center mt-5">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-gray-50 border-b px-6 py-3">
          <h2 className="text-xl font-semibold text-gray-700 text-center">
            Deposit
          </h2>
        </div>
        <div className="px-6 py-12 text-center">
          <h3 className="text-2xl font-semibold mb-6">Payment Instructions</h3>
          {
            <div className="mb-4 text-yellow-700 bg-yellow-100 rounded p-3 font-medium">
              Payment created, but not yet successful. Please complete your
              payment below.
            </div>
          }
          <p className="text-lg mb-2">
            Amount: <span className="font-bold">{payment?.amount} USD</span>
          </p>
          <p className="mb-2">
            Order ID:{" "}
            <span className="font-mono">
              {payment?.orderId || payment?._id}
            </span>
          </p>
          <p className="mb-6">
            Please complete your payment using the following link:
          </p>

          <button
            onClick={handleCompletePayment}
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructionsPage;
