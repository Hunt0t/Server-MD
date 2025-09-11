/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useGetAnnouncementsQuery,
  useDeleteAnnouncementMutation,
} from "@/app/redux/api/announcement/announcementApi";
import { format } from "date-fns";
import Link from "next/link";
import Loading from "../shared/Loading/Loading";
import Swal from "sweetalert2";

const AnnouncementList = () => {
  const { data, isLoading } = useGetAnnouncementsQuery({});
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  if(isLoading){
    return <Loading/>
   }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteAnnouncement(id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The announcement has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: err?.data?.message || err?.message || "Failed to delete announcement.",
        });
      }
    }
  };


  
  

  return (
    <div className="max-w-full mx-auto p-4">
      <div className="flex flex-col gap-2 md:flex-row justify-between items-center">
      <h2 className="mb-6">Announcements</h2>
       <Link className="bg-blue-500 px-4 py-3 rounded-md text-white text-[16px] font-bold" href="/dashboard/announcement/create-announcement">Create Announcements</Link>
      </div>
     
      <ul className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data?.data?.map((item: any) => (
          <li
            key={item._id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <span className="text-xs text-gray-500">
                {item.createdAt
                  ? format(new Date(item.createdAt), "MMMM dd, yyyy")
                  : ""}
              </span>
            </div>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
            <div className="flex gap-2 mt-2">
              <a
                href={`/dashboard/announcement/create-announcement/${item._id}`}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </a>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementList;
