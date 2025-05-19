import React from "react";

export default function PersonalInformationBtn({
  imgURL,
  alt,
  text,
  className,
  className1,
  className2,
  onClick,
  disabled,
}) {
  return (
    <div className={`w-full relative flex items-center justify-center ${className ? className : ""}`}>
      <button
        disabled={disabled}
        onClick={onClick}
        className={`w-full secondary-btn !bg-[#FFFFFF29] hover:!bg-[#FFFFFF40] max-w-[500px] rounded-lg  ${
          className ? className : ""
        }`}
      >
        {/* <div className="icon-part-data">
          <img
            className={` ${className2 ? className2 : ""}`}
            src={import.meta.env.BASE_URL + imgURL}
            alt={alt}
          />
        </div> */}

        <div className="text-custom f-custom-white" style={{}}>
          <span className={`w-full relative font-medium text-[15px] text-white ${className1 ? className1 : ""}`}>
            {text}
          </span>
        </div>
      </button>
    </div>
  );
}
