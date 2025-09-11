/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineDownload } from "react-icons/ai";
import { useAppSelector } from "@/app/redux/featuers/hooks";
import { RootState } from "@/app/redux/featuers/store";
import Loading from "../shared/Loading/Loading";

import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useLazyExportOrdersQuery,
} from "@/app/redux/api/orders/ordersApi";
import Swal from "sweetalert2";

interface User {
  _id: string;
  id: string;
  email: string;
  name: string;
}

interface Order {
  _id: string;
  userId: User;
  paymentId: string;
  price: number;
  status: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
  // Product fields
  orderId?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  year?: number;
  gender: string;
  ssn: string;
  mail: string;
  dob: any;
  address: string;
}

const OrdersTable = () => {
  // For API export
  const [exportedOrders, setExportedOrders] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  // Progress modal state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExportCancelling, setIsExportCancelling] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { startYear, endYear } = useAppSelector(
    (state: RootState) => state.yearRange
  );

  const { data, isLoading } = useGetOrdersQuery({
    page,
    limit,
    searchTerm,
    startYear,
    endYear,
    sort: sortOrder,
  });

  const [deleteOrder, { isLoading: Dloading }] = useDeleteOrderMutation();
  const [exportOrders, { data: exportData, isLoading: Eloading }] =
    useLazyExportOrdersQuery();

  const handleDeleteOrder = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteOrder(orderId).unwrap();
        Swal.fire("Deleted!", "Order has been deleted.", "success");

        // Remove from selectedIds if needed
        setSelectedIds((prev) => prev.filter((id) => id !== orderId));

        // Optional: remove from localOrders if using local state
      } catch (error: any) {
        console.error(error);
        Swal.fire("Error", "Failed to delete the order.", "error");
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const orders: Order[] = data?.data || [];

  const meta = data?.meta;
  const paginatedOrders = orders;

  const exportToExcel = async (
    ordersToExport: Order[],
    fileName = "orders.xlsx"
  ) => {
    setExportModalOpen(true);
    setExportProgress(0);
    setIsExportCancelling(false);
    setIsExporting(true);
    const ids = ordersToExport.map((order) => order._id);

    try {
      const response = await exportOrders(ids).unwrap();
      // response is already the data array
      let progress = 0;
      const total = response.length;
      setExportedOrders(response);
      const interval = setInterval(() => {
        if (isExportCancelling) {
          clearInterval(interval);
          setExportModalOpen(false);
          setExportProgress(0);
          setIsExporting(false);
          return;
        }
        progress += Math.ceil(total / 40) || 1;
        setExportProgress(Math.min(Math.round((progress / total) * 100), 100));
        if (progress >= total) {
          clearInterval(interval);
          setTimeout(() => {
            setExportModalOpen(false);
            setExportProgress(0);
            setIsExporting(false);
            const ws = XLSX.utils.json_to_sheet(response);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Orders");
            XLSX.writeFile(wb, fileName);
          }, 500);
        }
      }, 50);
    } catch (err) {
      setExportModalOpen(false);
      setIsExporting(false);
      Swal.fire("Error", "Failed to export orders.", "error");
    }
  };
  // Cancel export handler
  const handleExportCancel = () => {
    setIsExportCancelling(true);
    setExportModalOpen(false);
    setExportProgress(0);
  };

  // Download single order
  const handleSingleDownload = (order: Order) => {
    exportToExcel([order], `order_${order._id}.xlsx`);
  };

  // Download selected
  const handleSelectedDownload = () => {
    const selectedOrders = orders.filter((order) =>
      selectedIds.includes(order._id)
    );
    exportToExcel(selectedOrders);
  };

  // Download all
  const handleAllDownload = () => {
    exportToExcel(orders);
  };

  // Handle select all on current page
  const handleSelectAll = (checked: boolean) => {
    const idsOnPage = paginatedOrders.map((order) => order._id);
    if (checked) {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...idsOnPage])));
    } else {
      setSelectedIds((prev) => prev.filter((id) => !idsOnPage.includes(id)));
    }
  };

  // Handle single select
  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const allSelectedOnPage =
    paginatedOrders.length > 0 &&
    paginatedOrders.every((order) => selectedIds.includes(order._id));

  return (
      <div>
     
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-[350px] flex flex-col items-center">
            <h3 className="mb-4 text-lg font-bold">Exporting Orders</h3>
            <div className="w-full mb-2 text-sm text-gray-600">
              Progress: {exportProgress}%
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            <button
              className="mt-2 px-4 py-2 rounded bg-red-500 text-white font-semibold"
              onClick={handleExportCancel}
              disabled={exportProgress === 100}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center my-16 bg-white shadow-sm p-10 mx-10 border rounded-md">
        <div className="flex items-center justify-between border rounded-lg px-4 py-3 w-full max-w-md relative">
          <svg
            className="text-gray-400 mr-2"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="flex-1 outline-none text-gray-700 placeholder-gray-400"
          />
          {searchTerm && (
            <button
              type="button"
              className="text-red-500 cursor-pointer hover:text-red-600 ml-2"
              onClick={() => {
                setSearchTerm("");
                setPage(1);
              }}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 8.586l4.95-4.95a1 1 0 1 1 1.414 1.414L11.414 10l4.95 4.95a1 1 0 0 1-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 0 1-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 1 1 5.05 3.636L10 8.586z" />
              </svg>
            </button>
          )}
        </div>
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
          <button
            className={`ml-2 px-4 cursor-pointer py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
              selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSelectedDownload}
            disabled={selectedIds.length === 0}
            style={selectedIds.length === 0 ? { pointerEvents: "none" } : {}}
          >
            Selected Download
          </button>
          <button
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleAllDownload}
          >
            All Download
          </button>
        </div>
      </div>
      <div className="overflow-x-auto w-full text-[14px]  rounded-lg shadow-sm bg-white mx-2 mt-5">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelectedOnPage}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-orderId") return "orderId";
                    if (prev === "orderId") return "";
                    return "-orderId";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center truncate">
                  Order ID
                  <p className="flex flex-col">
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "-orderId" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "orderId" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-firstName") return "firstName";
                    if (prev === "firstName") return "";
                    return "-firstName";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center truncate">
                  First Name
                  <p className="flex flex-col">
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "-firstName" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "firstName" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-lastName") return "lastName";
                    if (prev === "lastName") return "";
                    return "-lastName";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center truncate">
                  Last Name
                  <p className="flex flex-col">
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "-lastName" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "lastName" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-gender") return "gender";
                    if (prev === "gender") return "";
                    return "-gender";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center">
                  Gender
                  <p className="flex flex-col">
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "-gender" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "gender" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-dob") return "dob";
                    if (prev === "dob") return "";
                    return "-dob";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center">
                  Dob
                  <p className="flex flex-col">
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "-dob" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "dob" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-address") return "address";
                    if (prev === "address") return "";
                    return "-address";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center">
                  Address
                  <p className="flex flex-col">
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "-address" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "address" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-city") return "city";
                    if (prev === "city") return "";
                    return "-city";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center">
                  City
                  <p className="flex flex-col">
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "-city" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "city" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-state") return "state";
                    if (prev === "state") return "";
                    return "-state";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center">
                  State
                  <p className="flex flex-col">
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "-state" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "state" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-zip") return "zip";
                    if (prev === "zip") return "";
                    return "-zip";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center">
                  Zip
                  <p className="flex flex-col">
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "-zip" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "zip" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>

              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-email") return "email";
                    if (prev === "email") return "";
                    return "-email";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center">
                  Email
                  <p className="flex flex-col">
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "-email" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "email" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-ssn") return "ssn";
                    if (prev === "ssn") return "";
                    return "-ssn";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center">
                  Ssn
                  <p className="flex flex-col">
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "-ssn" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "ssn" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-country") return "country";
                    if (prev === "country") return "";
                    return "-country";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center">
                  Country
                  <p className="flex flex-col">
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "-country" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "country" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>

              <th
                className="px-4 py-3 cursor-pointer select-none gap-1"
                onClick={() => {
                  setSortOrder((prev: any) => {
                    if (prev === "-price") return "price";
                    if (prev === "price") return "";
                    return "-price";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center">
                  Price
                  <p className="flex flex-col">
                    <span
                      className="h-3 size-0"
                      style={{ opacity: sortOrder === "-price" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▲
                    </span>
                    <span
                      className="h-3 text-xs"
                      style={{ opacity: sortOrder === "price" ? 1 : 0.5 }}
                    >
                      {" "}
                      ▼
                    </span>
                  </p>
                </div>
              </th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order, index) => (
              <tr
                key={order._id}
                className={`$${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } border-b hover:bg-gray-100 transition-colors`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(order._id)}
                    onChange={(e) => handleSelect(order._id, e.target.checked)}
                  />
                </td>
                <td className="px-4 py-3">{order?.orderId}</td>
                <td className="px-4 py-3">{order?.firstName}</td>
                <td className="px-4 py-3">{order?.lastName}</td>
                <td className="px-4 py-3">{order?.gender}</td>
                <td className="px-4 py-3 truncate">
                  {order?.dob
                    ? (() => {
                        try {
                          return format(new Date(order.dob), "dd-MM-yyyy");
                        } catch {
                          return order.dob;
                        }
                      })()
                    : ""}
                </td>
                <td className="px-4 py-3 truncate">{order?.address}</td>
                <td className="px-4 py-3truncate">{order?.state}</td>
                <td className="px-4 py-3 truncate">{order?.city}</td>
                <td className="px-4 py-3 truncate">{order?.zip}</td>
                <td className="px-4 py-3 truncate">{order?.mail}</td>
                <td className="px-4 py-3 truncate">{order?.ssn}</td>
                <td className="px-4 py-3 truncate">{order?.country}</td>
                <td className="px-4 py-3 truncate">${order?.price}</td>
                <td className="px-4 py-3 flex gap-2">
                   <button
                    className="w-8 h-8 bg-blue-500 text-white flex justify-center items-center rounded-md cursor-pointer disabled:opacity-50"
                    onClick={() => handleSingleDownload(order)}
                  >
                    <AiOutlineDownload size={20} />
                  </button>
                 
                  <button
                    className="w-8 h-8 bg-red-500 text-white flex justify-center items-center rounded-md cursor-pointer disabled:opacity-50"
                    onClick={() => handleDeleteOrder(order._id)}
                    disabled={Dloading}
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                 
                </td>
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

export default OrdersTable;
