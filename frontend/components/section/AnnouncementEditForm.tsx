


/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  useEditAnnouncementMutation,
  useGetAnnouncementsQuery,
} from "@/app/redux/api/announcement/announcementApi";
import { TbCloudUpload } from "react-icons/tb";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import Container from "../shared/Container/Container";

const AnnouncementEditForm = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useGetAnnouncementsQuery(undefined, { skip: !id });
  const announcement = data?.data?.find((item: any) => item._id === id);

  const [title, setTitle] = useState("");
  const { quill, quillRef } = useQuill();
  const [editAnnouncement, { isLoading: isUpdating }] = useEditAnnouncementMutation();

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      if (quill && announcement.description) {
        quill.clipboard.dangerouslyPasteHTML(announcement.description);
      }
    }
  }, [announcement, quill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const payload = {
      title,
      description: quill ? quill.root.innerHTML : announcement?.description,
    };

    try {
      await editAnnouncement({ id, data: payload }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Announcement updated successfully!",
        showConfirmButton: false,
            timer: 1000,
      }).then(() => router.push("/dashboard"));
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: err?.data?.message || err?.message || "Failed to update announcement.",
      });
    }
  };

  if (isLoading || !announcement) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <Container className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg md:p-8 p-4 border">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Edit Announcement</h3>
        <p className="text-center text-gray-500 mb-6">
          Update the fields below to edit the announcement
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter announcement title"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <div
              ref={quillRef}
              style={{ minHeight: 200, background: "#fff" }}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUpdating}
          >
            <TbCloudUpload size={20} />
            {isUpdating ? "Updating..." : "Update Announcement"}
          </button>
        </form>
      </div>
    </Container>
  );
};

export default AnnouncementEditForm;

