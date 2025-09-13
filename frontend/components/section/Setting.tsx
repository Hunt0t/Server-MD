/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "../shared/Loading/Loading";
import Swal from "sweetalert2";
import {} from "@/app/redux/api/announcement/announcementApi";
import { useState } from "react";
import {
  useGetPaymentGatewaysQuery,
  useTelegramQuery,
  useUpdatePaymentGatewayMutation,
  useUpdateTelegramMutation,
} from "@/app/redux/api/contact/contactApi";

const Settings = () => {
   
  const [updatePaymentGateway] = useUpdatePaymentGatewayMutation();

  const handleToggleGateway = async (item: any) => {
    try {
      if (!updatePaymentGateway) return;
      await updatePaymentGateway({ id: item._id, isActive: !item.isActive }).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Payment gateway ${!item.isActive ? 'activated' : 'deactivated'} successfully.`
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err?.data?.message || err?.message || 'Failed to update payment gateway status.'
      });
    }
  };
  // Update Telegram API
  const [updateTelegram] = useUpdateTelegramMutation();
  const { data, isLoading } = useTelegramQuery({});
  const { data: paymentGateways, isLoading: isLoadingPaymentGateways } =
    useGetPaymentGatewaysQuery({});

  const [isEditingTelegram, setIsEditingTelegram] = useState(false);
  const [telegramValue, setTelegramValue] = useState("");


  // Payment Gateway Edit State
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({ name: '', apiKey: '', details: '', wallet: '', email: '', password: '' });

  if (isLoading || isLoadingPaymentGateways) {
    return <Loading />;
  }

  const handleEditClick = (item: any) => {
    setEditId(item._id);
    setEditData({
      name: item.name || '',
      apiKey: item.apiKey || '',
      details: item.details || '',
      wallet: item.wallet || '',
      email: item.email || '',
      password: item.password || ''
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (item: any) => {
    try {
      const payload = { ...editData };
      if (!payload.password) {
        delete (payload as any).password;
      }
      await updatePaymentGateway({ id: item._id, ...payload }).unwrap();
      setEditId(null);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Payment gateway updated successfully.'
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err?.data?.message || err?.message || 'Failed to update payment gateway.'
      });
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  const handleTelegramEdit = () => setIsEditingTelegram(true);

  // Telegram update handler
  const handleUpdateTelegram = async (id: { id: string }) => {
    try {
      await updateTelegram({ link: telegramValue, id }).unwrap();
      setIsEditingTelegram(false);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          err?.data?.message ||
          err?.message ||
          "Failed to update telegram link.",
      });
    }
  };

  return (
    <div className="max-w-full mx-auto p-4">
      <div className="flex flex-col gap-2 md:flex-row justify-between items-center">
        <h2 className="mb-6">Setting</h2>
      </div>

      <h4 className="mb-6">Contact Information</h4>
      <ul className="mt-8 mb-10  grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="font-semibold">Telegram:</span>{" "}
          {isEditingTelegram ? (
            <>
              <input
                type="text"
                className="border rounded px-2 py-1"
                onChange={(e) => setTelegramValue(e.target.value)}
              />
              <button
                className="ml-2 text-green-600 hover:text-green-800"
                onClick={() => handleUpdateTelegram(data?.data?._id)}
                title="Save"
              >
                ✔
              </button>
            </>
          ) : (
            <>
              <a
                href={`https://t.me/${data?.data?.link}`}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @{data?.data?.link}
              </a>
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={handleTelegramEdit}
                title="Edit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0L4 18v2h2l5-5z"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </ul>
      <h4 className="mb-6">Change payment method</h4>
      <ul className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paymentGateways?.data?.map((item: any) => (
          <li
            key={item._id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            {editId === item._id ? (
              <>
                <div className="flex flex-col gap-2 mb-2">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                    placeholder="Gateway Name"
                  />
                  API key(public)
                  <input
                    type="text"
                    name="apiKey"
                    value={editData.apiKey}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                    placeholder="API Key"
                  />
                  Wallet Number
                  <input
                    type="text"
                    name="wallet"
                    value={editData.wallet}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                    placeholder="Wallet"
                  />
Email
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                    placeholder="Email"
                  />
                  Password
                  <input
                    type="text"
                    name="password"
                    value={editData.password}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                    placeholder="New Password (optional)"
                  />
                  Details (Note)
                  <textarea
                    name="details"
                    value={editData.details}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                    placeholder="Details"
                  />
                </div>
                <div className="flex gap-2 mb-2">
                  <button
                    className="text-green-600 hover:text-green-800 border px-2 py-1 rounded"
                    onClick={() => handleEditSave(item)}
                  >Save</button>
                  <button
                    className="text-gray-600 hover:text-gray-800 border px-2 py-1 rounded"
                    onClick={handleEditCancel}
                  >Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="uppercase text-lg  leading-[20px] font-semibold">{item.name}</h2>
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => handleEditClick(item)}
                    title="Edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0L4 18v2h2l5-5z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg leading-[30px] font-semibold">{item.apiKey}</h2>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Wallet:</span>
                  <span className="text-sm break-all">{item.wallet || '-'}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm break-all">{item.email || '-'}</span>
                </div>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: item.details }}
                />
              </>
            )}
            <div className="flex gap-2 mt-2 items-center">
              <span className="font-semibold">Status:</span>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={() => handleToggleGateway(item)}
                  className="sr-only"
                />
                <span
                  className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${
                    item.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      item.isActive ? "translate-x-4" : ""
                    }`}
                  />
                </span>
                <span className="ml-2 text-sm">
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Settings;
