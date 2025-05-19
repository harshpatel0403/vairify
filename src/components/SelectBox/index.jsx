import React, { useEffect, useState } from "react";

function SelectBox({
  className1,
  className2,
  options,
  onChange,
  placeholder,
  value,
  size,
  span,
  customization,
  textColor,
  backgroundColor,
  arrowColor,
  borderColor,
  borderWidth,
  textSize,
  fontWeight,
  borderRightNone,
  borderLeftNone,
  setRules,
  borderNone,
  shadowNone,
  pl,
  pr,
  px,
  iconColor,
  rounded,
  textAlign,
  border,
  disabledOption,
  disabled,
}) {
  // ${size?`h-[${size}]`:'h-[50px]'}

  return (
    <div
      className={`relative ${rounded ? rounded : "rounded-full"} w-full ${span ? `col-span-${span}` : ""
        } ${backgroundColor ? backgroundColor : ""} ${borderWidth} ${borderRightNone == "true" ? "rounded-r-none" : ""
        } ${borderLeftNone == "true" ? "rounded-l-none" : ""} border-none border-[${border ? border : `#3760CB`
        }]`}
      style={{ borderColor: border ? `${border}` : "" }}
    >
      <select
        disabled={!!disabled}
        style={{ whiteSpace: "pre-wrap" }}
        className={`appearance-none block w-full ${pl ? pl : ""} ${px ? `${px}` : "px-4"
          } ${pr ? `${pr}` : "pr-8"} ${size} ${shadowNone ? `shadow-none` : `shadow`
          } ${borderNone ? `border-none` : "border-2"
          } leading-tight rounded-2xl focus:outline-none focus:shadow-outline h-[100%] bg-transparent ${textColor} ${borderColor} ${textSize} ${fontWeight} ${borderRightNone == "true" ? "rounded-r-none" : ""
          } ${borderLeftNone == "true" ? "rounded-l-none" : ""
          } ${className1} focus:outline-none focus:ring-0 ${textAlign ? textAlign : "text-center"
          }`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      >
        {disabledOption && (
          <option selected disabled>
            {disabledOption}
          </option>
        )}
        {options?.map((option) => (
          <option className="text-black" key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div
        style={{ top: "2px" }}
        className={`${borderWidth} border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent ${customization == "true" ? "custom-dropdownicon" : ""
          } ${setRules == "true" ? "set-rules-dropdown-icon" : ""} ${className2}`}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.0004 12.9177C9.8057 12.9181 9.61701 12.8503 9.46708 12.726L4.46708 8.55938C4.1127 8.26482 4.06419 7.73876 4.35874 7.38438C4.6533 7.02999 5.17936 6.98149 5.53374 7.27604L10.0004 11.0094L14.4671 7.40938C14.6392 7.26957 14.86 7.20415 15.0806 7.22761C15.3011 7.25107 15.5032 7.36148 15.6421 7.53438C15.7964 7.70759 15.8715 7.93727 15.8493 8.16817C15.8272 8.39908 15.7098 8.6103 15.5254 8.75104L10.5254 12.776C10.3712 12.8806 10.1863 12.9305 10.0004 12.9177Z" fill="#919EAB" />
        </svg>

      </div>
    </div>
  );
}

export default SelectBox;
