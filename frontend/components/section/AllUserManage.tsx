/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useAllUserManageQuery,
  useChangeUserStatusMutation,
  useRegistationMutation,
} from "@/app/redux/api/auth/authApi";
import Loading from "../shared/Loading/Loading";
import Swal from "sweetalert2";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const AdminCreateUserSchema = z.object({
  name: z.string().min(1, "Please enter a name"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AdminCreateUserForm = z.infer<typeof AdminCreateUserSchema>;
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions = [
  { value: "in-progress", label: "Recover" },
  { value: "blocked", label: "Block" },
  { value: "delete", label: "Delete" },
];

const AllUserManage = () => {
  const { data, isLoading, refetch } = useAllUserManageQuery({});
  const [search, setSearch] = useState<string>("");
  const [changeUserStatus, { isLoading: changing }] =
    useChangeUserStatusMutation();
  const [changingId, setChangingId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [createUser, { isLoading: creating }] = useRegistationMutation();

  // Form for admin create user
  const form = useForm<AdminCreateUserForm>({
    resolver: zodResolver(AdminCreateUserSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  // Handle admin create user submit
  const handleCreateUser = async (data: AdminCreateUserForm) => {
    try {
      const result = await createUser(data).unwrap();
      if (result?.success) {
        Swal.fire({
          icon: "success",
          title: result?.message || "User created successfully!",
          timer: 1200,
          showConfirmButton: false,
        });
        setShowModal(false);
        form.reset();
        refetch();
      }
    } catch (err: any) {
      const serverErrors = err?.data?.errorSources;
      if (serverErrors?.length) {
        serverErrors.forEach((e: any) => {
          Swal.fire({
            icon: "error",
            title: e.message,
            showConfirmButton: true,
          });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: err?.data?.message || "Failed to create user.",
        });
      }
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setChangingId(userId);
    try {
      await changeUserStatus({ id: userId, status: newStatus }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `User status changed to ${newStatus}`,
        timer: 1500,
        showConfirmButton: false,
      });
      await refetch();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.data?.message || "Failed to change status.",
      });
    } finally {
      setChangingId("");
    }
  };

  if (isLoading) return <Loading />;
  // Filtered users by search
  const users = (data?.data || []).filter((user: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(s) ||
      user.email?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center my-3 gap-2">
        <h2 className="text-center">All Users</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="border rounded px-3 py-2 w-full md:w-64"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap"
            onClick={() => setShowModal(true)}
          >
            + Create New User
          </button>
        </div>
      </div>

      {/* Modal for create user */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2 text-center">
              Create New User
            </h3>
            <form
              onSubmit={form.handleSubmit(handleCreateUser)}
              className="space-y-4"
            >
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="name"
                >
                 user Name<span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...form.register("name")}
                  placeholder="Enter name"
                  className="w-full border rounded px-3 py-2"
                  autoComplete="off"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.name.message as string}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Enter email"
                  className="w-full border rounded px-3 py-2"
                  autoComplete="off"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.email.message as string}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="password"
                >
                  Password<span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  placeholder="Enter password"
                  className="w-full border rounded px-3 py-2"
                  autoComplete="off"
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.password.message as string}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-2"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create User"}
              </button>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full text-left border-collapse mt-4">
        <thead className="bg-gray-100 text-gray-700 text-sm md:text-base">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Change Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr
              key={user._id}
              className="border-b hover:bg-gray-100 transition-colors"
            >
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.role}</td>
              <td className="px-4 py-3">{user.status}</td>
              <td className="px-4 py-3">
                {/* <Select
                  value={user.status}
                  onValueChange={(val) => handleStatusChange(user._id, val)}
                  disabled={changingId === user._id || changing}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select> */}

                <Select
                  value={undefined}
                  onValueChange={(val) => handleStatusChange(user._id, val)}
                  disabled={changingId === user._id || changing}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUserManage;
