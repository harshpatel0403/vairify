import React from "react";

export default function Loading({ className = '' }) {
  return (
    <div>
      <div
        className={` ${className} sm:mt-[-3px] mt-[1px] inline-block sm:h-8 sm:w-8 h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#ffffff] border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]`}
        role="status"
      >
        <span className="!absolute !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}
