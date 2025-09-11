"use client";
import React, { useCallback, useEffect, useState } from "react";
import { usePaymentConfirmMutation } from "@/app/redux/api/payment/paymentApi";
import Link from "next/link";

interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function PaymentSuccessPage({ searchParams }: PageProps) {
  // Accept either ?url=... or ?NP_id=... (fallback) just in case.
  const rawUrlParam = searchParams?.url || searchParams?.NP_id || "";
  const paymentUrl = Array.isArray(rawUrlParam) ? rawUrlParam[0] : rawUrlParam;
  const npId = Array.isArray(searchParams?.NP_id)
    ? searchParams?.NP_id[0]
    : (searchParams?.NP_id as string | undefined);

  const [paymentConfirm, { isLoading }] = usePaymentConfirmMutation();
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  interface ConfirmMutationResult {
    data?: {
      data?: {
        invoiceId?: string;
      };
    };
    error?: unknown;
  }

  const handleConfirm = useCallback(async () => {
    if (!paymentUrl) return;
    try {
      const res = (await paymentConfirm({
        url: paymentUrl,
      })) as ConfirmMutationResult;
      const id = res.data?.data?.invoiceId;
      if (id) {
        setInvoiceId(id);
        setConfirmed(true);
      }
    } catch {
      // silent; UI will show generic error state
    }
  }, [paymentUrl, paymentConfirm]);

  useEffect(() => {
    if (paymentUrl) handleConfirm();
  }, [paymentUrl, handleConfirm]);

  return (
    <div className="flex justify-center items-center mt-10 mb-16 px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-green-600 text-white px-6 py-4 text-center">
          <h1 className="text-2xl font-semibold">Payment Status : success</h1>
        </div>
        <div className="px-6 py-8 text-center">
          <p className="text-green-700 font-medium mb-4">
            Your payment was successful. Thank you!
          </p>
          {npId && (
            <p className="text-sm mb-2">
              NP_id: <span className="font-mono font-semibold">{npId}</span>
            </p>
          )}
          {invoiceId && (
            <p className="text-sm mb-2">
              Invoice ID: <span className="font-mono font-semibold">{invoiceId}</span>
            </p>
          )}
         <div className="flex gap-2 items-center justify-center">
             <button
            onClick={handleConfirm}
            disabled={!paymentUrl || isLoading}
            className="mt-4 bg-blue-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {confirmed ? "Re-Check" : "Confirm Again"}
          </button>
          <Link href="/search">
          
          
            <button
            onClick={handleConfirm}
            disabled={!paymentUrl || isLoading}
            className="mt-4 bg-blue-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
           Back to Main Page
          </button></Link>
         </div>
        </div>
      </div>
    </div>
  );
}
