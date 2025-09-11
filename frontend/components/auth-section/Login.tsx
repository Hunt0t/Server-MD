/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import ReuseMainForm from "../shared/Form/ReuseMainForm";
import ReuseInput from "../shared/Form/ReuseInput";
import { z } from "zod";
import { useRef, useState } from "react";
import { useLogin2FAMutation } from "@/app/redux/api/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/app/redux/api/auth/authApi";
import { setUser, TUser } from "@/app/redux/api/auth/authSlice";
import { verifyToken } from "@/lib/verifyToken";
import { useAppDispatch } from "@/app/redux/featuers/hooks";
import { useForm } from "react-hook-form";
import Container from "../shared/Container/Container";
import CaptchaBox from "./CaptchaBox";
import { validateCaptcha } from "react-simple-captcha";
import Swal from "sweetalert2";

interface FormData {
  identifier: string;
  password: string;
}
const LoginValidationSchema = z.object({
  identifier: z.string().min(1, "Please enter your email or username"),
  password: z
    .string()
    .min(8, "Please enter a password with at least 8 characters"),
});

export const defaultValues = {
  identifier: "",
  password: "",
};

type ValidationError = {
  path: string;
  message: string;
};

const Login = () => {
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAToken, setTwoFAToken] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [login2FA, { isLoading: is2FALoading }] = useLogin2FAMutation();
  const [captchaValue, setCaptchaValue] = useState("");

  const formRef = useRef<ReturnType<typeof useForm<FormData>> | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [error, setError] = useState<ValidationError[]>([]);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSignin = async (data: FormData) => {
    if (!validateCaptcha(captchaValue)) {
      Swal.fire({
        icon: "error",
        title: "Captcha is invalid!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    // console.log(data)
    const userInfo: any = { password: data.password };

    if (data.identifier.includes("@")) {
      userInfo.email = data.identifier;
    } else {
      userInfo.name = data.identifier;
    }

    try {
      const res = await login(userInfo).unwrap();
      // If 2FA is required, show modal and store token
      if (res?.data?.requires2FA) {
        setTwoFAToken(res.data.twoFAToken);
        setShow2FAModal(true);
        return;
      }
      // Normal login
      const user = verifyToken(res?.data?.accessToken) as TUser;
      dispatch(setUser({ user: user, token: res?.data?.accessToken }));
      if (user?.role === "admin") {
        router.push("/dashboard/orders-manage");
      } else {
        router.push("/search");
      }
    } catch (err: any) {
      setError(err?.data?.errorSources);
    }

    // 2FA modal submit handler
  };

    const handle2FASubmit = async () => {
    try {
      const res = await login2FA({ twoFAToken, code: twoFACode }).unwrap();
      const user = verifyToken(res?.data?.accessToken) as TUser;
      dispatch(setUser({ user: user, token: res?.data?.accessToken }));
      setShow2FAModal(false);
      setTwoFACode("");
      setTwoFAToken("");
      if (user?.role === "admin") {
        router.push("/dashboard/orders-manage");
      } else {
        router.push("/search");
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Invalid 2FA code!",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const passwordErrors = error?.find((error) => error?.path === "forbidden");
  const emailError = error?.find((error) => error?.path === "not_found");

  return (
    <>
      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xs">
            <h2 className="text-lg font-bold mb-2">Enter 2FA Code</h2>
            <input
              type="text"
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-3"
              placeholder="Enter 2FA code"
              maxLength={6}
            />
            <button
              className="bg-btnColor text-white px-4 py-2 rounded w-full"
              onClick={handle2FASubmit}
              disabled={is2FALoading || !twoFACode}
            >
              {is2FALoading ? "Verifying..." : "Verify & Login"}
            </button>
            <button
              className="mt-2 text-sm text-gray-500 w-full"
              onClick={() => setShow2FAModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <Container className="mt-10 min-h-screen flex justify-center items-center">
        <div className="bg-[#F7F9FC] md:p-10 p-5 max-w-lg w-full mx-auto rounded-lg">
          <h3 className="text-center font-bold">Welcome To x </h3>
          <p className="text-center font-medium">
            Log in with email & password
          </p>
          <ReuseMainForm
            onSubmit={handleSignin}
            resolver={zodResolver(LoginValidationSchema)}
            defaultValues={defaultValues}
            setFormMethods={(methods) => {
              formRef.current = methods;
            }}
            className="mt-5"
          >
            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-col gap-[10px] w-full">
                <label
                  className="text-textColor lg:text-[18px] md:text-[18px] text-[14px]  font-medium"
                  htmlFor="Phone or Email"
                >
                  User Name/Email
                  <span className="text-[#F00C89] font-normal">*</span>
                </label>

                <ReuseInput
                  name="identifier"
                  type="text"
                  placeholder="Enter Your Email"
                  className={`w-full h-[45px]  rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px] font-normal placeholder-[#999] text-textColor placeholder:font-normal ${
                    emailError ? "border-red-400" : ""
                  }`}
                />

                <div className="flex justify-between items-center">
                  {emailError && (
                    <p className="text-red-400 text-sm font-medium">
                      {emailError?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-[10px] relative">
                <label
                  className="text-textColor md:text-[18px] text-[14px] font-medium md:leading-[23.4px] leading-[18px]"
                  htmlFor="password"
                >
                  Password
                  <span className="text-[#F00C89] font-normal ">*</span>
                </label>

                <ReuseInput
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  className={`w-full h-[45px] rounded-[6px] border-[1px] border-[#E5E5E5] bg-white outline-0 pl-5 md:text-[18px] text-[14px]  font-normal placeholder-[#999] text-textColor ${
                    passwordErrors ? "border-red-400" : ""
                  }`}
                />

                {passwordErrors && (
                  <p className="text-red-400 text-sm font-medium">
                    {passwordErrors?.message}
                  </p>
                )}
                <div
                  className="absolute md:top-[46px] top-[41px] right-4 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    <FiEye size={24} />
                  ) : (
                    <FiEyeOff size={24} />
                  )}
                </div>
              </div>
            </div>

            <CaptchaBox onChange={(value) => setCaptchaValue(value)} />

            <button
              className={`rounded-[6px] mt-[20px] w-full h-[45px] text-white text-[14px] text-center bg-btnColor font-medium leading-[18px] cursor-pointer`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="flex items-center my-4">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="mx-4 text-gray-600">on</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>

            <p className="text-textColor text-[14px]  font-normal leading-[23.4px] text-center mt-5">
              Don’t have account?
              <Link
                href="/register"
                className="md:text-[16px] text-[14px] ml-1 font-normal leading-[23.4px] cursor-pointer underline"
              >
                Sign up
              </Link>
            </p>
          </ReuseMainForm>
        </div>

        {/* <div className="bg-[#e5ebfa] max-w-lg w-full mx-auto rounded-b-lg py-2.5">
            <h4 className="text-center text-[16px] font-normal">Forgot your password?
             <Link className="text-black font-semibold" href={'/forget-password'}> Reset It</Link>
            </h4>
         </div> */}
      </Container>
    </>
  );
};

export default Login;
