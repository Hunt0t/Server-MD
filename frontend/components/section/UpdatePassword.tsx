/* eslint-disable @typescript-eslint/no-explicit-any */

import ReuseMainForm from "../shared/Form/ReuseMainForm";
import ReuseInput from "../shared/Form/ReuseInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useChangePasswordMutation } from "@/app/redux/api/auth/authApi";
import Swal from "sweetalert2";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

export const RegisterValidationSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const defaultValues: FormData = {
  newPassword: "",
  confirmPassword: "",
};

type ValidationError = {
  path: string;
  message: string;
};

export function UpdatePassword() {
  const [error, setError] = useState<ValidationError[]>([]);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordNewVisible, setIsPasswordNewVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const togglePasswordNewVisibility = () => {
    setIsPasswordNewVisible(!isPasswordNewVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleProfile = async (data: FormData) => {
    try {
      const res = await changePassword({
        newPassword: data.newPassword,
      }).unwrap();
      if (res.success) {
        Swal.fire({
          title: "Success",
          text: "Password updated successfully",
          icon: "success",
          timer: 3000,
        });
      }
    } catch (err) {
      console.log(err);
      setError((err as any)?.data?.errorSources);
    }
  };

  const passwordErrors = error?.find((error) => error?.path === "forbidden");

  return (
    <div className="flex flex-col gap-5 md:gap-10 lg:flex-row lg:justify-between mt-10">

<div className="lg:w-[30%] w-full">
     <h3 className="mb-2">Update Password     </h3>
     <p>Ensure your account is using a long, random password to stay secure.</p>
     </div>


        <div className="lg:w-[60%] w-full shadow-md bg-white md:p-10 p-5 rounded-md border">
      <ReuseMainForm
        onSubmit={handleProfile}
        resolver={zodResolver(RegisterValidationSchema)}
        defaultValues={defaultValues}
        className="mt-5"
      >
        <div className="grid grid-cols-1 gap-5">
          {/* New Password */}
          <div className="flex flex-col gap-[10px] relative">
            <label
              className="text-[#666] md:text-[18px] text-[14px]  font-normal md:leading-[23.4px] leading-[18px]"
              htmlFor="password"
            >
              New Password
            </label>
            <ReuseInput
              name="newPassword"
              type={isPasswordNewVisible ? "text" : "password"}
              className={`w-full h-[45px]  rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px]  font-normal placeholder-[#999] text-textColor placeholder:font-normal`}
            />
            <div
              className="absolute md:top-[46px] top-[41px] right-4 cursor-pointer"
              onClick={togglePasswordNewVisibility}
            >
              {isPasswordNewVisible ? (
                <FiEye className="text-secondaryColor" size={24} />
              ) : (
                <FiEyeOff className="text-secondaryColor" size={24} />
              )}
            </div>
          </div>
          {/* Confirm Password */}
          <div className="flex flex-col gap-[10px] relative">
            <label
              className="text-[#666] md:text-[18px] text-[14px]  font-normal md:leading-[23.4px] leading-[18px]"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <ReuseInput
              name="confirmPassword"
              type={isConfirmPasswordVisible ? "text" : "password"}
              className={`w-full h-[45px]  rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px]  font-normal placeholder-[#999] text-textColor placeholder:font-normal`}
            />
            <div
              className="absolute md:top-[46px] top-[41px] right-4 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {isConfirmPasswordVisible ? (
                <FiEye className="text-secondaryColor" size={24} />
              ) : (
                <FiEyeOff className="text-secondaryColor" size={24} />
              )}
            </div>
          </div>
        </div>

       <div className="flex justify-end">
       <button
          className={`rounded-[6px] mt-[24px] px-6 h-[45px] text-white text-[14px] text-center bg-primary font-bold leading-[18px] cursor-pointer`}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
       </div>
      </ReuseMainForm>
    </div>
    </div>
  );
}
