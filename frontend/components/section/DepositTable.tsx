/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useCreatePaymentByAdminMutation,
  useAdminChangePaymentStatusMutation,
} from "@/app/redux/api/payment/paymentApi";

import { useGetPaymentQuery } from "@/app/redux/api/payment/paymentApi";
import React, { useState } from "react";
import Loading from "../shared/Loading/Loading";
import { format } from "date-fns";
import { selectCurrentUser } from "@/app/redux/api/auth/authSlice";
import { useSelector } from "react-redux";

type Payment = {
  amount: number;
  beforeBalance: number;
  afterBalance: number;
  invoiceId: number;
  userId: { name: string; email: string };
  createdAt: string;
  currency: string;
  status: "pending" | "success" | "failed";
  totalAmount: number;
  updatedAt: string;
  _id?: string;
};

const DepositTable = () => {
  const [adminChangePaymentStatus, { isLoading: statusChanging }] =
    useAdminChangePaymentStatusMutation();
  const [statusError, setStatusError] = useState<string | null>(null);
  // Table state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState("");
  const currentUser = useSelector(selectCurrentUser);
  const [createPaymentByAdmin, { isLoading: creating }] =
    useCreatePaymentByAdminMutation();
  console.log(currentUser);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await createPaymentByAdmin({
        email,
        amount: Number(amount),
        invoiceId,
      }).unwrap();

      setShowCreateModal(false);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create payment.");
    }
  };

  const { data, isLoading } = useGetPaymentQuery({
    page,
    limit,
    sort: sortOrder || "-createdAt",
    searchTerm: "",
  });

  if (isLoading) {
    return <Loading />;
  }

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="mx-2 mt-16">
      {/* <h3>History</h3> */}

      {/* Limit Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="w-[150px] border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {currentUser?.role === "admin" && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm mt-4"
            onClick={() => setShowCreateModal(true)}
          >
            Create Payment
          </button>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => {
                setShowCreateModal(false);
                setError(null);
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2 text-center">
              Create Payment
            </h3>
            <form onSubmit={handleCreatePayment} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  User Email<span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter user email"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="amount"
                >
                  Amount<span className="text-red-500">*</span>
                </label>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border rounded px-3 py-2"
                  min="1"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="invoiceId"
                >
                  Invoice ID<span className="text-red-500">*</span>
                </label>
                <input
                  id="invoiceId"
                  type="text"
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  placeholder="Enter invoice ID"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-2"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Payment"}
              </button>
            </form>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </div>
        </div>
      )}

      <div className="overflow-x-auto w-full rounded-lg shadow-sm bg-white mx-2 mt-5">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-sm md:text-base">
            <tr>
              {/* <th className="px-4 py-3">Id</th> */}
              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-invoiceId") return "invoiceId";
                    if (prev === "invoiceId") return "";
                    return "-invoiceId";
                  });
                  setPage(1);
                }}
              >
                ID
                {sortOrder === "-invoiceId" && <span> ▲</span>}
                {sortOrder === "invoiceId" && <span> ▼</span>}
              </th>
              <th className="px-4 py-3 cursor-pointer select-none">Name</th>
              <th className="px-4 py-3 cursor-pointer select-none">Email</th>

              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-createdAt") return "createdAt";
                    if (prev === "createdAt") return "";
                    return "-createdAt";
                  });
                  setPage(1);
                }}
              >
                Order Data
                {sortOrder === "-createdAt" && <span> ▲</span>}
                {sortOrder === "createdAt" && <span> ▼</span>}
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-beforeBalance") return "beforeBalance";
                    if (prev === "beforeBalance") return "";
                    return "-beforeBalance";
                  });
                  setPage(1);
                }}
              >
                Before Balance
                {sortOrder === "-beforeBalance" && <span> ▲</span>}
                {sortOrder === "beforeBalance" && <span> ▼</span>}
              </th>

              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-amount") return "amount";
                    if (prev === "amount") return "";
                    return "-amount";
                  });
                  setPage(1);
                }}
              >
                Deposit Amount
                {sortOrder === "-amount" && <span> ▲</span>}
                {sortOrder === "amount" && <span> ▼</span>}
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-afterBalance") return "afterBalance";
                    if (prev === "afterBalance") return "";
                    return "-afterBalance";
                  });
                  setPage(1);
                }}
              >
                After Balance
                {sortOrder === "-afterBalance" && <span> ▲</span>}
                {sortOrder === "afterBalance" && <span> ▼</span>}
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-status") return "status";
                    if (prev === "status") return "";
                    return "-status";
                  });
                  setPage(1);
                }}
              >
                Status
                {sortOrder === "-status" && <span> ▲</span>}
                {sortOrder === "status" && <span> ▼</span>}
              </th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((order: Payment, index: number) => (
              <tr
                key={order._id}
                className={`$${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } border-b hover:bg-gray-100 transition-colors`}
              >
                <td className="px-4 py-3">{order?.invoiceId}</td>
                <td className="px-4 py-3">{order?.userId?.name}</td>
                <td className="px-4 py-3">{order?.userId?.email}</td>
                <td className="px-4 py-3">
                  {format(new Date(order.createdAt), "MMM dd, yyyy hh:mm a")}
                </td>
                <td className="px-4 py-3">${order?.beforeBalance || "00"}</td>
                <td className="px-4 py-3">${order?.amount || "00"}</td>
                <td className="px-4 py-3">${order?.afterBalance || "00"}</td>
                {currentUser?.role === "admin" ? (
                  <>
                    <td className="px-4 py-3 uppercase">
                      <select
                        value={order.status}
                        disabled={statusChanging}
                        onChange={async (e) => {
                          setStatusError(null);
                          try {
                            await adminChangePaymentStatus({
                              paymentId: order._id,
                              status: e.target.value,
                            }).unwrap();
                          } catch (err: any) {
                            setStatusError(
                              err?.data?.message || "Failed to change status."
                            );
                          }
                        }}
                        className="border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                      {statusError && (
                        <div className="text-xs text-red-500">
                          {statusError}
                        </div>
                      )}
                    </td>
                  </>
                ) : (
                  <> <td className="px-4 py-3">{order?.status}</td></>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {meta?.totalPage && meta.totalPage > 1 && (
          <div className="flex justify-center items-center my-6 gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {/* Custom Pagination Logic */}
            {(() => {
              const totalPage = meta.totalPage;
              const pages: (number | string)[] = [];
              if (totalPage <= 10) {
                for (let i = 1; i <= totalPage; i++) pages.push(i);
              } else {
                // Always show first 2
                pages.push(1, 2);
                // If current page is in the first 6 (show 1-8)
                if (page <= 6) {
                  for (let i = 3; i <= 8; i++) pages.push(i);
                  pages.push("...");
                  pages.push(totalPage - 1, totalPage);
                }
                // If current page is in the last 6 (show last 8)
                else if (page >= totalPage - 5) {
                  pages.push("...");
                  for (let i = totalPage - 7; i <= totalPage; i++)
                    pages.push(i);
                }
                // Middle pages: show first 2, ..., 6 around current, ..., last 2
                else {
                  pages.push("...");
                  for (let i = page - 2; i <= page + 3; i++) pages.push(i);
                  pages.push("...");
                  pages.push(totalPage - 1, totalPage);
                }
              }
              return pages.map((p, idx) =>
                p === "..." ? (
                  <span key={"ellipsis-" + idx} className="px-2">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(Number(p))}
                    className={`px-3 py-1 border rounded ${
                      page === p ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {p}
                  </button>
                )
              );
            })()}

            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, meta?.totalPage))
              }
              disabled={page === meta?.totalPage}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositTable;
