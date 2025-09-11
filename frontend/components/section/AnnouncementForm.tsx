



/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useCreateAnnouncementMutation } from "@/app/redux/api/announcement/announcementApi";
import { TbCloudUpload } from "react-icons/tb";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import Container from "../shared/Container/Container";

const AnnouncementForm = () => {
  const [title, setTitle] = useState("");
  const { quill, quillRef } = useQuill();
  const router = useRouter();

  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description: quill ? quill.root.innerHTML : "",
    };

    try {
      const res = await createAnnouncement(payload).unwrap();
      console.log(res);

      Swal.fire({
        icon: "success",
        title: "Announcement created successfully!",
        showConfirmButton: false,
            timer: 1000,
      }).then(() => {
        setTitle("");
        if (quill) quill.setText("");
        router.push("/dashboard");
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: err?.data?.message || err?.message || "Failed to create announcement.",
      });
    }
  };

  return (
    <Container className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg md:p-8 p-4 border">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Create Announcement</h3>
        <p className="text-center text-gray-500 mb-6">
          Fill out the form below to create a new announcement
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
            disabled={isLoading}
          >
            <TbCloudUpload size={20} />
            {isLoading ? "Creating..." : "Create Announcement"}
          </button>
        </form>
      </div>
    </Container>
  );
};

export default AnnouncementForm;

