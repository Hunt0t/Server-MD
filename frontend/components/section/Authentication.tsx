/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */

import React, { useState } from "react";
import {
  useLoginMutation,
  useGetMeQuery, 
  useLazyEnable2faQuery, 
  useVerify2faMutation,
} from "@/app/redux/api/auth/authApi";

const Authentication = () => {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // Get user email from profile
  const { data: userData } = useGetMeQuery({});
  const email = userData?.data?.email || "";

  // RTK Query login mutation
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [verify2fa, { isLoading: isVerifyLoading }] = useVerify2faMutation();
  // enable2faQuery is lazy, so we will call it manually
  const [triggerEnable2fa] = useLazyEnable2faQuery();

  const handleEnableClick = () => {
    setShowModal(true);
    setError("");
    setPassword("");
    setStep(1);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ email, password }).unwrap();
      if (res?.success) {
        // Login success, now get 2FA secret
        const enable2faRes = await triggerEnable2fa(email).unwrap();
        if (enable2faRes?.data?.secret) {
          setSecret(enable2faRes.data.secret);
        }
        setStep(2);
        setError("");
      } else {
        setError(res?.message || "Incorrect password. Please try again.");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Incorrect password. Please try again.");
    }
  };

  

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try { 
      const res = await verify2fa({
        secret ,
        code: otpCode,
      }).unwrap();
      if (res?.success) {
        setStep(3);
        setError("");
      } else {
        setError(res?.message || "Invalid OTP code. Please try again.");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Invalid OTP code. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setStep(1);
    setPassword("");
    setError("");
  };

  return (
    <div>
      <div className="flex flex-col gap-5 md:gap-10 lg:flex-row lg:justify-between mt-10">
        <div className="lg:w-[30%] w-full">
          <h3 className="mb-2">Two Factor Authentication </h3>
          <p>
            Add additional security to your account using two factor
            authentication.
          </p>
        </div>
        <div className="lg:w-[60%] w-full shadow-md bg-white md:p-10 p-5 rounded-md border">
          <h3 className="mb-5">
            You have not enabled two factor authentication.
          </h3>
          <p>
            When two factor authentication is enabled, you will be prompted for
            a secure, random token during authentication. You may retrieve this
            token from your phone's Google Authenticator application.
          </p>
          <div className="mt-5">
            {userData?.data?.is2FAEnabled ? (
              <button
                className={`rounded-[6px] mt-[24px] px-6 h-[45px] text-white text-[14px] text-center bg-gray-400 font-bold leading-[18px] cursor-not-allowed uppercase`}
              >
                Enabled
              </button>
            ) : (
              <button
                className={`rounded-[6px] mt-[24px] px-6 h-[45px] text-white text-[14px] text-center bg-primary font-bold leading-[18px] cursor-pointer uppercase`}
                onClick={handleEnableClick}
              >
                Enable
              </button>
            )} 
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            {step === 1 && (
              <form onSubmit={handlePasswordSubmit}>
                <h2 className="text-xl font-semibold mb-4">
                  Enter your password
                </h2>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded px-4 py-2 mb-3"
                  placeholder="Password"
                  required
                />
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? "Checking..." : "Next"}
                  </button>
                </div>
              </form>
            )}
            {step === 2 && (
              <div className="h-[90vh] overflow-x-scroll">
                <h2 className="text-xl font-semibold mb-4">
                  Finish enabling two factor authentication.
                </h2>
                <p className="mb-2 text-gray-700">
                  When two factor authentication is enabled, you will be
                  prompted for a secure, random token during authentication. You
                  may retrieve this token from your phone's Google Authenticator
                  application.
                </p>
                <p className="mb-4 text-gray-700">
                  To finish enabling two factor authentication, scan the
                  following QR code using your phone's authenticator application
                  or enter the setup key and provide the generated OTP code.
                </p>
                {/* Dynamic QR and setup key */}
                <div className="flex justify-center mb-4">
                  {secret && (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/SSNPro?secret=${secret}`}
                      alt="QR Code"
                    />
                  )}
                </div>
                <div className="mb-2 text-center">
                  <span className="font-semibold">Setup Key:</span> {secret}
                </div>
                <input
                  onChange={(e) => setOtpCode(e.target.value)}
                  type="text"
                  className="w-full border rounded px-4 py-2 mb-3"
                  placeholder="Code"
                />
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    type="button"
                    className="px-4 py-2 bg-primary text-white rounded"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Authentication;
