import React, { useState } from "react";

export default function InputPassword({
  type,
  hidden,
  textSize,
  name,
  value,
  placeholder,
  className,
  onChange,
  showPassword,
  border,
  inputClass
}) {
  return (
    <div
      className={`flex items-center rounded-[8px] border-none  relative border-[${
        border ? border : `#919EAB33`
      }] hover:border-gray-800 h-[50px] p-0 ${className}`}
      style={{ borderColor: border ? `${border}` : "" }}
    >
      <input
        type={type}
        className={`bg-transparent !text-[14x] !font-normal border-[#919EAB33] border-2 focus-visible:border-1 focus-visible:border-[#0247ff] w-full h-[50px] rounded-[8px] text-white py-1 px-6 pl-2 leading-tight focus:outline-none focus:ring-0 text-[${textSize}px] ${inputClass}`}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      <div className="mr-3 absolute right-[8px] cursor-pointer" onClick={showPassword}>
        {type === "password" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#FFFFFF"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
             stroke="#FFFFFF"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
