/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetProductsQuery } from "@/app/redux/api/product/productApi";
import { format } from "date-fns";
import Loading from "../shared/Loading/Loading";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoCart, IoClose } from "react-icons/io5";
import YearRangePicker from "./YearRangePicker";
import { useAppSelector } from "@/app/redux/featuers/hooks";
import { RootState } from "@/app/redux/featuers/store";
import { useCreateOrdersMutation } from "@/app/redux/api/orders/ordersApi";
import Swal from "sweetalert2";
import Link from "next/link";
import StateSelete from "./StateSelete";

interface Order {
  _id: string;
  orderId: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  dob: number;
  gender: number;
  price: number;
}

const DataTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedState, setSelectedState] = useState("");

  const { startYear, endYear } = useAppSelector(
    (state: RootState) => state.yearRange
  );

  const { data, isLoading, refetch } = useGetProductsQuery({
    page,
    limit,
    searchTerm,
    startYear,
    endYear,
    sort: sortOrder,
    state: selectedState,
  });

  const [createOrders, { isLoading: creating }] = useCreateOrdersMutation();

  useEffect(() => {
    setSelectAll(
      selectedOrders.length === (data?.data?.length || 0) &&
        (data?.data?.length || 0) > 0
    );
  }, [selectedOrders, data?.data]);

  if (isLoading) return <Loading />;
  const orders: Order[] = data?.data || [];
  const meta = data?.meta;

  const handleSingleOrder = async (orderId: string) => {
    try {
      await createOrders({ productIds: [orderId] }).unwrap();
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
      await refetch();

      Swal.fire({
        icon: "success",
        title: "Order Created!",
        text: "The order has been successfully created.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.message ||
        "Failed to create order. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    }
  };

  // Handle bulk order
  const handleBulkOrder = async () => {
    if (selectedOrders.length === 0) return;
    try {
      await createOrders({ productIds: selectedOrders }).unwrap();
      const count = selectedOrders.length;
      setSelectedOrders([]);
      setSelectAll(false);
      await refetch();

      Swal.fire({
        icon: "success",
        title: "Orders Created!",
        text: `${count} orders have been successfully created.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.message ||
        "Failed to create orders. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    }
  };

  // Handle individual checkbox
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
      setSelectAll(false);
    } else {
      setSelectedOrders(orders.map((o) => o._id));
      setSelectAll(true);
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setPage(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center my-16 bg-white shadow-sm p-10 mx-10 border rounded-md">
        <div className="flex items-center justify-between border rounded-lg px-4 py-3 w-full max-w-md relative">
          <FaSearch className="text-gray-400 mr-2" />
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
            <IoClose
              size={20}
              className="text-red-500 cursor-pointer hover:text-red-600 ml-2"
              onClick={() => {
                setSearchTerm("");
                setPage(1);
              }}
            />
          )}
        </div>
        <div>
          <StateSelete
            value={selectedState}
            onStateChange={handleStateChange}
          />
        </div>
        <div>
          <YearRangePicker />
        </div>
      </div>

      <div className="flex justify-between items-center px-4 mb-2">
        <div className="mx-5 flex items-center gap-2">
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

        <div className="flex items-center gap-5">
          <Link
            href={"/deposits"}
            className="px-4 py-2 text-white font-medium text-[16px] bg-red-500 rounded-md"
          >
            Deposit
          </Link>

          <button
            onClick={handleBulkOrder}
            disabled={selectedOrders.length === 0}
            className="px-4 py-2 text-white font-medium text-[16px] bg-blue-600 rounded-md disabled:opacity-50"
          >
            {creating ? "Creating" : "Buy Bulk"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full rounded-lg shadow-sm bg-white mx-2 mt-5">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-sm md:text-base">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
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
                <div className="flex gap-1 items-center">
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
                <div className="flex gap-1 items-center">
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
                <div className="flex gap-1 items-center">
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
                    if (prev === "-dob") return "dob";
                    if (prev === "dob") return "";
                    return "-dob";
                  });
                  setPage(1);
                }}
              >
                <div className="flex gap-1 items-center">
                  Dob (Year)
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
                // onClick={() => {
                //   setSortOrder((prev: any) => {
                //     if (prev === "-price") return "price";
                //     if (prev === "price") return "";
                //     return "-price";
                //   });
                //   setPage(1);
                // }}
              >
                <div className="flex gap-1 items-center">
                  Price
                  {/* <p className="flex flex-col">
                    <span className="h-3 text-xs" style={{ opacity: sortOrder === "-price" ? 1 : 0.5 }}> ▲</span>
                    <span className="h-3 text-xs" style={{ opacity: sortOrder === "price" ? 1 : 0.5 }}> ▼</span>
                  </p> */}
                </div>
              </th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } border-b hover:bg-gray-100 transition-colors`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => handleSelectOrder(order._id)}
                  />
                </td>
                <td className="px-4 py-3">{order.orderId}</td>
                <td className="px-4 py-3">{order.firstName}</td>
                <td className="px-4 py-3">{order.lastName}</td>
                <td className="px-4 py-3">{order.gender}</td>
                <td className="px-4 py-3">{order.state}</td>
                <td className="px-4 py-3">{order.zip}</td>
                <td className="px-4 py-3">
                  {order.dob ? format(new Date(order.dob), "yyyy") : ""}
                </td>
                <td className="px-4 py-3">${order.price}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleSingleOrder(order._id)}
                    className="w-8 h-8 bg-blue-500 text-white flex justify-center items-center rounded-md cursor-pointer"
                  >
                    <IoCart size={20} />
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

export default DataTable;
