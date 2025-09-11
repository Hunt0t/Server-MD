/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateContactMutation,
  useTelegramQuery,
} from "@/app/redux/api/contact/contactApi";
import Swal from "sweetalert2";
import Navbar from "@/components/shared/Navbar/Navbar";
import Container from "@/components/shared/Container/Container";
export default function ContactPage() {
  const schema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(2, "Subject is required"),
    message: z.string().min(5, "Message is required"),
  });

  type ContactFormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
  });

  const [createContact, { isLoading }] = useCreateContactMutation();
  const { data } = useTelegramQuery({});
  

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await createContact(values).unwrap();
      Swal.fire({
        icon: "success",
        title: "Message Sent",
        text: "Your message has been sent successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      reset();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.data?.message || "Failed to send message.",
      });
    }
  };

  return (
     <div>
       <Navbar />
       <Container className="md:pt-[180px] pt-[150px]">
      <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center">
        Contact Us
      </h1>
      <p className="text-lg text-gray-700 mb-12 text-center">
        Have questions, feedback, or need support? Reach out to us and our team
        will get back to you as soon as possible.
      </p>
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Contact Form */}
        <div className="md:w-1/2 w-full">
          <form
            className="bg-white rounded-xl shadow p-8 text-left"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label className="block mb-2 font-semibold text-gray-700">
              Name
            </label>
            <input
              type="text"
              className={`w-full mb-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="Your Name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>
            )}

            <label className="block mb-2 font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              className={`w-full mb-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="you@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">
                {errors.email.message}
              </p>
            )}

            <label className="block mb-2 font-semibold text-gray-700">
              Subject
            </label>
            <input
              type="text"
              className={`w-full mb-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.subject ? "border-red-500" : ""
              }`}
              placeholder="Subject"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mb-2">
                {errors.subject.message}
              </p>
            )}

            <label className="block mb-2 font-semibold text-gray-700">
              Message
            </label>
            <textarea
              className={`w-full mb-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.message ? "border-red-500" : ""
              }`}
              rows={5}
              placeholder="How can we help you?"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mb-2">
                {errors.message.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
        {/* Right: Contact Info & Map */}
        <div className="md:w-1/2 w-full flex flex-col gap-8 justify-between">
          <div className="bg-blue-50 rounded-xl shadow p-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
              Contact Information
            </h2>
            
            <div className="mb-3">
              <span className="font-semibold">Telegram:</span>{" "}
            
              <a
                href={`https://t.me/${data?.data?.link}`}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @{data?.data?.link}
              </a>
            </div>
            <div className="mb-3">
              <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:support@databasemarketplace.com"
                className="text-blue-600 hover:underline"
              >
                support@databasemarketplace.com
              </a>
            </div>
            <div className="mb-3">
              <span className="font-semibold">Phone:</span>{" "}
              <a
                href="tel:+1234567890"
                className="text-blue-600 hover:underline"
              >
                +1 234 567 890
              </a>
            </div>
          </div>
        </div>
      </div>
    </Container>
     </div>
  );
}
