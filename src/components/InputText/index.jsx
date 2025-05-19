import React from "react";

export default function InputText({
  name,
  placeholder,
  type,
  className,
  size,
  bgColor,
  border,
  onChange,
  value,
  disabled,
  defaultValue
}) {
  return (
    <input
      className={`w-full text-[14px] text-white border-2 border-[${
        border ? border : `#3760CB`
      }] rounded-2xl py-2 px-4 ${className ? className : ""} ${
        size ? `h-[${size}]` : "h-[50px]"
      } ${bgColor ? `bg-${bgColor}` : "bg-transparent"} `}
      name={name}
      value={value}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
      style={{ borderColor: border ? `${border}` : "" }}
      disabled={disabled && disabled}
      defaultValue={defaultValue&&defaultValue}
    />
  );
}
