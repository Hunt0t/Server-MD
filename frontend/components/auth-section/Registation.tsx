/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from "next/link"
import ReuseMainForm from "../shared/Form/ReuseMainForm"
import ReuseInput from "../shared/Form/ReuseInput"
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRegistationMutation } from "@/app/redux/api/auth/authApi";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Container from "../shared/Container/Container";
import { validateCaptcha } from "react-simple-captcha";
import CaptchaBox from "./CaptchaBox";

// ==================== Form Data & Validation ====================
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterValidationSchema = z
  .object({
    name: z.string().min(1, "Please enter your name"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Please enter a password with at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const defaultValues: FormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// ==================== Registration Component ====================
const Registation = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");


  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const router = useRouter();
  const [registation, { isLoading }] = useRegistationMutation();

  const handleSignin = async (data: FormData) => {
    if (!validateCaptcha(captchaValue)) {
      Swal.fire({
        icon: "error",
        title: "Captcha is invalid!",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    try {
      const result = await registation(data).unwrap();

      if (result?.success) {
        localStorage.setItem(
          "usesjhdtevdfsdswrEmailskjstshxcsewsd",
          data?.email
        );

        Swal.fire({
          icon: "success",
          title: result?.message,
          showConfirmButton: false,
          timer: 1000,
        });

        router.push("/login");
      }
    } catch (err: any) {
      console.log(err);
      const serverErrors = (err as any)?.data?.errorSources;

      if (serverErrors?.length) {
        serverErrors.forEach((e: any) => {
          Swal.fire({
            icon: "error",
            title: e.message,
            showConfirmButton: true,
          });
        });
      }
    }
  };

  return (
    <Container className="mt-10 min-h-screen flex justify-center items-center">
      <div className="bg-[#F7F9FC] md:p-10 p-5 max-w-lg w-full mx-auto rounded-lg">
        <h3 className="text-center font-bold">Create Your Account</h3>
        <p className="text-center font-medium">Please fill all forms to continue</p>

        <ReuseMainForm
          onSubmit={handleSignin}
          resolver={zodResolver(RegisterValidationSchema)}
          defaultValues={defaultValues}
          className="mt-5"
        >
          <div className="grid grid-cols-1 gap-3">
            {/* Name */}
            <div className="flex flex-col gap-[10px] w-full">
              <label
                className="text-textColor lg:text-[18px] md:text-[18px] text-[14px] font-medium"
                htmlFor="name"
              >
                User Name
                <span className="text-[#F00C89] font-normal">*</span>
              </label>

              <ReuseInput
                name="name"
                type="text"
                placeholder=""
                className="w-full h-[45px] rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px] font-normal placeholder-[#999] text-textColor placeholder:font-normal"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-[10px] w-full">
              <label
                className="text-textColor lg:text-[18px] md:text-[18px] text-[14px] font-medium"
                htmlFor="email"
              >
                Email
                <span className="text-[#F00C89] font-normal">*</span>
              </label>

              <ReuseInput
                name="email"
                type="text"
                placeholder="Enter Your Email"
                className="w-full h-[45px] rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px] font-normal placeholder-[#999] text-textColor placeholder:font-normal"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-[10px] relative">
              <label
                className="text-textColor md:text-[18px] text-[14px] font-medium md:leading-[23.4px] leading-[18px]"
                htmlFor="password"
              >
                Password
                <span className="text-[#F00C89] font-normal">*</span>
              </label>

              <ReuseInput
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                className="w-full h-[45px] rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px] font-normal placeholder-[#999] text-textColor"
              />
              <div
                className="absolute md:top-[46px] top-[41px] right-4 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? <FiEye size={24} /> : <FiEyeOff size={24} />}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-[10px] relative">
              <label
                className="text-textColor md:text-[18px] text-[14px] font-medium md:leading-[23.4px] leading-[18px]"
                htmlFor="confirmPassword"
              >
                Confirm Password
                <span className="text-[#F00C89] font-normal">*</span>
              </label>

              <ReuseInput
                name="confirmPassword"
                type={isPasswordVisible ? "text" : "password"}
                className="w-full h-[45px] rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px] font-normal placeholder-[#999] text-textColor"
              />
              <div
                className="absolute md:top-[46px] top-[41px] right-4 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? <FiEye size={24} /> : <FiEyeOff size={24} />}
              </div>
            </div>
          </div>
          <CaptchaBox onChange={(value) => setCaptchaValue(value)} />


          <button
            className="rounded-[6px] mt-[24px] w-full h-[45px] text-white text-[14px] text-center bg-btnColor font-medium leading-[18px] cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Create Account"}
          </button>

          <div className="flex items-center my-4">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="mx-4 text-gray-600">on</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          <p className="text-textColor text-[14px] font-normal leading-[23.4px] text-center mt-5">
            Already have an account?
            <Link
              href="/login"
              className="md:text-[16px] text-[14px] ml-1 font-normal leading-[23.4px] cursor-pointer underline"
            >
              Login
            </Link>
          </p>
        </ReuseMainForm>
      </div>
    </Container>
  );
};

export default Registation;
