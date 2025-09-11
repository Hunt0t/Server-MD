"use client";

import { useEffect, useState } from "react";
import { loadCaptchaEnginge, LoadCanvasTemplateNoReload } from "react-simple-captcha";
import { FiRefreshCw } from "react-icons/fi";

const CaptchaBox = ({ onChange }: { onChange: (value: string) => void }) => {
  const [input, setInput] = useState("");

  // captcha generate only once
  useEffect(() => {
    loadCaptchaEnginge(6); // 6 characters
  }, []);

  const handleChange = (val: string) => {
    setInput(val);
    onChange(val); // send input value to parent
  };

  const handleRefresh = () => {
    loadCaptchaEnginge(6); // regenerate captcha
    setInput("");
    onChange("");
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Captcha Canvas */}
      <div className="flex items-center gap-2 mt-1">
        <LoadCanvasTemplateNoReload />
        <button
          type="button"
          onClick={handleRefresh}
          className="p-1.5 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          <FiRefreshCw size={18} />
        </button>
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter Captcha"
        className="border h-[46px] pl-5 rounded-md focus:outline-none focus:ring-[1px] focus:ring-textColor transition-all duration-200"
      />
    </div>
  );
};

export default CaptchaBox;
