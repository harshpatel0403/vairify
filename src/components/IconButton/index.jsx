import React from "react";

export default function IconButton({
  icon,
  text,
  className,
  onClick,
  disabled,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled && disabled}
      className={`text-white font-bold p-1 rounded-full flex items-center justify-center ${
        className ? className : ""
      }`}
    >
      {icon}
      {text}
    </button>
  );
}
