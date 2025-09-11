/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useImportOrdersCsvMutation,
  useImportOrdersJsonMutation,
  useDeleteProductsByFileNameMutation,
} from "@/app/redux/api/product/productApi";
import Loading from "../shared/Loading/Loading";
import React, { useRef } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useState } from "react";
import { format } from "date-fns";
import StateSelectFileName from "../section/StateSelectFileName";

interface Order {
  _id: string;
  orderId: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  dob: string;
  phone: string;
  price: number;
}

const DashboardDataTable = () => {
  const [deleteProduct] = useDeleteProductMutation();
  const [selectedState, setSelectedState] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleteProductsByFileName, { isLoading: isDeletingFile }] =
    useDeleteProductsByFileNameMutation();
  // Delete all products by fileName
  const handleDeleteFile = async () => {
    if (!selectedState) return;
    Swal.fire({
      title: `Delete all records for file '${selectedState}'?`,
      text: `This will delete all products with fileName '${selectedState}'. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete file!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProductsByFileName(selectedState).unwrap();
          Swal.fire(
            "Deleted!",
            `All records for file '${selectedState}' have been deleted!`,
            "success"
          );
          setSelectedRows([]);
          setSelectedState("");
          refetch();
        } catch (error: any) {
          Swal.fire(
            "Error!",
            error?.data?.message || "Failed to delete file records",
            "error"
          );
        }
      }
    });
  };

  const jsonInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  // These hooks should accept FormData, not File
  const [importOrdersJson] = useImportOrdersJsonMutation();
  const [importOrdersCsv] = useImportOrdersCsvMutation();
  const [importPrice, setImportPrice] = useState<number>(0.25);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [totalOrders, setTotalOrders] = React.useState(0);
  const [createdOrders, setCreatedOrders] = React.useState(0);
  const [uploadType, setUploadType] = React.useState<"json" | "csv" | null>(
    null
  );

  // Simulate progress for demo (replace with real progress if available)
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (
      modalOpen &&
      !isCancelling &&
      totalOrders > 0 &&
      createdOrders < totalOrders
    ) {
      timer = setInterval(() => {
        setCreatedOrders((prev) => {
          const next = Math.min(
            prev + Math.ceil(totalOrders / 40),
            totalOrders
          );
          setProgress(Math.round((next / totalOrders) * 100));
          if (next === totalOrders) {
            setTimeout(() => {
              setModalOpen(false);
              setProgress(0);
              setCreatedOrders(0);
              setTotalOrders(0);
              setUploadType(null);
              setIsCancelling(false);
              Swal.fire({
                icon: "success",
                title: "Success!",
                text: `Add product successfully.`,
              });
            }, 800);
          }
          return next;
        });
      }, 120);
    }
    return () => clearInterval(timer);
  }, [modalOpen, isCancelling, totalOrders, createdOrders]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
  };
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, refetch } = useGetProductsQuery({
    page,
    limit,
    fileName: selectedState,
  });

  if (isLoading) {
    return <Loading />;
  }

  const orders: Order[] = data?.data || [];
  const meta = data?.meta;

  // Checkbox logic
  const allSelected =
    orders.length > 0 && selectedRows.length === orders.length;
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < orders.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(orders.map((order) => order._id));
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Bulk delete logic
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${selectedRows.length} selected record(s)? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete selected!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            selectedRows.map((id) => deleteProduct(id).unwrap())
          );
          Swal.fire(
            "Deleted!",
            "Selected records have been deleted.",
            "success"
          );
          setSelectedRows([]);
          refetch();
        } catch (error: any) {
          Swal.fire(
            "Error!",
            error?.data?.message || "Failed to delete selected records",
            "error"
          );
        }
      }
    });
  };

  const handleImportJson = () => {
    setUploadType("json");
    setTimeout(() => jsonInputRef.current?.click(), 0);
  };

  const handleImportCsv = () => {
    setUploadType("csv");
    setTimeout(() => csvInputRef.current?.click(), 0);
  };

  const handleJsonFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("importPrice", importPrice);
    const file = e.target.files?.[0];
    // const file = event.target.files[0];
    if (!file) return;
    setTotalOrders(Math.max(Math.floor(file.size / 200), 10));
    setCreatedOrders(0);
    setProgress(0);
    setModalOpen(true);
    setIsCancelling(false);

    await importOrdersJson({ file, price: importPrice || "0.25" });
    e.target.value = "";
  };

  const handleCsvFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => { 
    const file = e.target.files?.[0];
    if (!file) {
      Swal.fire({
        icon: "error",
        title: "No file selected",
        text: "Please select a CSV file to import.",
      });
      return;
    }
    setTotalOrders(Math.max(Math.floor(file.size / 300), 10));
    setCreatedOrders(0);
    setProgress(0);
    setModalOpen(true);
    setIsCancelling(false);

    const result = await importOrdersCsv({
      file,
      price: importPrice || "0.25",
    });
    if (
      result &&
      typeof result === "object" &&
      "error" in result &&
      result.error &&
      typeof result.error === "object" &&
      "data" in result.error &&
      result.error.data &&
      typeof result.error.data === "object" &&
      "message" in result.error.data &&
      result.error.data.message === "No file uploaded"
    ) {
      Swal.fire({
        icon: "error",
        title: "Upload Error",
        text: "No file uploaded. Please try again.",
      });
    }
    e.target.value = "";
  };

  const handleCancel = () => {
    setIsCancelling(true);
    setModalOpen(false);
    setProgress(0);
    setCreatedOrders(0);
    setTotalOrders(0);
    setUploadType(null);
    Swal.fire({
      icon: "info",
      title: "Cancelled",
      text: "Upload cancelled.",
    });
  };

  return (
    <div className="overflow-x-auto w-full rounded-lg shadow-sm bg-white mx-2 my-2">
      <div className="flex justify-between px-4 items-center">
        <div className="flex flex-col md:flex-row w-full items-center md:items-start gap-3 md:gap-0 py-3">
          {/* <button
            className="bg-red-500/10  text-red-500 border border-red-500 px-4 py-2 rounded mr-2 disabled:not-allowed disabled:bg-red-100"
            onClick={handleBulkDelete}
            disabled={selectedRows.length === 0}
          >
            Bulk Delete
          </button> */}
          <StateSelectFileName
            value={selectedState}
            onStateChange={handleStateChange}
          />
        </div>
        <div className="flex flex-col md:flex-row w-full items-center md:items-end gap-3 md:gap-0 py-3 justify-end">
          {selectedState && (
            <button
              className="rounded-[6px] px-6 py-3 text-white text-[14px] text-center bg-red-600 font-medium leading-[18px] cursor-pointer flex items-end justify-center mr-3 disabled:opacity-60"
              onClick={handleDeleteFile}
              disabled={isDeletingFile}
            >
              {isDeletingFile
                ? "Deleting..."
                : `Delete File (${selectedState})`}
            </button>
          )}

          <div className="flex justify-end gap-3 mx-5 items-center">
            {/* Price input for import */}
            <input
              type="number"
              min="0"
              step="0.01"
              value={importPrice}
              onChange={(e) => setImportPrice(Number(e.target.value))}
              className="border rounded px-2 py-1 w-24 mr-2"
              placeholder="Price"
              title="Set price for imported products"
            />
            <input
              type="file"
              accept="application/json"
              ref={jsonInputRef}
              style={{ display: "none" }}
              onChange={handleJsonFileChange}
            />
            <button
              className="rounded-[6px] px-6 py-3 text-white text-[14px] text-center bg-green-600 font-medium leading-[18px] cursor-pointer flex items-end justify-center"
              onClick={handleImportJson}
            >
              Import JSON
            </button>
            <input
              type="file"
              accept=".csv,text/csv"
              ref={csvInputRef}
              style={{ display: "none" }}
              onChange={handleCsvFileChange}
            />
            <button
              className="rounded-[6px] px-6 py-3 text-white text-[14px] text-center bg-blue-600 font-medium leading-[18px] cursor-pointer flex items-end justify-center"
              onClick={handleImportCsv}
            >
              Import CSV
            </button>
          </div>

          {/* Modal for progress */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-10">
              <div className="bg-white rounded-lg shadow-lg p-8 w-[350px] flex flex-col items-center">
                <h3 className="mb-4 text-lg font-bold">
                  Uploading {uploadType === "json" ? "JSON" : "CSV"} Orders
                </h3>
                <div className="w-full mb-2 text-sm text-gray-600">
                  {createdOrders} / {totalOrders} orders created
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="mb-2 text-sm">{progress}%</div>
                <button
                  className="mt-2 px-4 py-2 rounded bg-red-500 text-white font-semibold"
                  onClick={handleCancel}
                  disabled={progress === 100}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 text-sm md:text-base">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-4 py-3">Id</th>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">First Name</th>
            <th className="px-4 py-3">Last Name</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">State</th>
            <th className="px-4 py-3">Zip</th>
            <th className="px-4 py-3">Country</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Year</th>
            <th className="px-4 py-3">Price</th>
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
                  checked={selectedRows.includes(order._id)}
                  onChange={() => handleSelectRow(order._id)}
                />
              </td>
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{order?.orderId}</td>
              <td className="px-4 py-3">{order?.firstName}</td>
              <td className="px-4 py-3">{order?.lastName}</td>
              <td className="px-4 py-3">{order?.city}</td>
              <td className="px-4 py-3">{order?.state}</td>
              <td className="px-4 py-3">{order?.zip}</td>
              <td className="px-4 py-3">{order?.country}</td>
              <td className="px-4 py-3">{order?.phone}</td>
              <td className="px-4 py-3">
                {order.dob ? format(new Date(order.dob), "yyyy") : ""}
              </td>
              <td className="px-4 py-3">${order?.price}</td>
              <td className="px-4 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-gray-200 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Link href={`/dashboard/create-table/${order?._id}`}>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </Link>

                    <DropdownMenuItem
                    // onClick={() => handleDelete(order?._id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                for (let i = totalPage - 7; i <= totalPage; i++) pages.push(i);
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
  );
};

export default DashboardDataTable;
