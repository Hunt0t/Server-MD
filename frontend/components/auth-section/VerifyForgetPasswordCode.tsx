
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import {
  useVerifyForgetPasswordCodeMutation,
} from "@/app/redux/api/auth/authApi";
import { useRouter } from "next/navigation";
import Container from "../shared/Container/Container";

type ValidationError = {
  path: string;
  message: string;
};

const VerifyForgetPasswordCode = () => {
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [error, setError] = useState<ValidationError[]>([]);
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();

  const [verifyForgetPasswordCode, { isLoading }] = useVerifyForgetPasswordCodeMutation();
  const email = typeof window !== "undefined" ? localStorage.getItem("usesjhdtevdfsdswrEmailskjstshxcsewsd") : "";
  // console.log(email)

  const handleInputChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newCode = [...code];

    if (/^[0-9]$/.test(value) || value === "") {
      newCode[index] = value;
      setCode(newCode);
      setValue(`code${index}`, value);

      if (value && index < code.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      setValue(`code${index - 1}`, "");
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleInputFocus = (index: number) => () => {
    inputRefs.current[index]?.select();
  };

  const isButtonEnabled = code.every((digit) => digit !== "");

  const onSubmit = async (data: FieldValues) => {
    const codeString = Object.values(data).join("");
    // console.log(codeString)

    try {
      const res = await verifyForgetPasswordCode({ code: codeString, email }).unwrap();
    //   console.log(res)
      if (res?.success) {
       
        router.push("/new-password");
      }
    } catch (err) {
      setError((err as any)?.data?.errorSources || []);
    }
  };

  const codeError = error.find((e) => e.path === "forbidden");

  

  

  return (
    <Container>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="2xl:p-[50px] lg:p-[20px] md:p-[50px] p-0 flex justify-center items-center">
          <div className="bg-white 2xl:w-[710px] lg:w-[710px] w-full rounded-[10px] border border-[#E5E5E5] 2xl:p-[70px] lg:p-[50px] md:p-[50px] p-4 xl:mt-[30px] lg:mt-[20px]">
            <h1 className="text-black text-center text-[24px] font-bold">
              Check your email
            </h1>
            <p className="text-[#888] text-center mt-2 text-[16px]">
              We sent a reset link to <span className="text-black">{email}</span>
            </p>
            <p className="text-[#888] text-center text-[16px] mb-6">
              Enter the 6-digit code mentioned in the email.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-center gap-3 mb-4">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    {...register(`code${index}`)}
                    ref={(el) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={handleInputChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    onFocus={handleInputFocus(index)}
                    className="w-[50px] h-[50px] rounded-md border text-center text-xl font-semibold outline-none border-gray-300 focus:border-black"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>

              {codeError && (
                <p className="text-red-400 text-center text-sm mb-4 font-medium">{codeError.message}</p>
              )}

              <button
                type="submit"
                disabled={!isButtonEnabled}
                className={`w-full h-[50px] text-[16px] font-medium rounded-md transition-colors cursor-pointer ${
                  isButtonEnabled
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Verifying..." : "Verify the Code"}
              </button>

              <div className="mt-5 text-center text-[14px] text-black">
                Didn’t get the code?
                <span
                  className={`ml-2 underline font-medium cursor-pointer`}
                >
                    Resend Code
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default VerifyForgetPasswordCode;


