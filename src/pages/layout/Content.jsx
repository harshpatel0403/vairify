import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function Content({ contentComponent, bgColor, showLayoutHeader ,shouldHideHeader }) {
  const location = useLocation();
  const nav = useNavigate();
  const path = location.pathname;
  const isOutsider =
    path.startsWith("/dateguard/emergency-contacts") ||
    ["/login", "/language", "/selectcategory", "/signup"].includes(path);


  return (
    <div
      className={`content-layout h-[100%]  ${(!shouldHideHeader && showLayoutHeader) || (!shouldHideHeader && !showLayoutHeader) ? 'sm:pt-[90px] pt-[70px]' : ''} relative ${path.startsWith("/varidate")
          ? " h-[100%] relative  mb-[80px] vai-now-path"
          : ""
        // }${path.startsWith("/vairify-schedule") ? " display-prifile-icon" : ""}${path.startsWith("/vai-now") ? " vai-now-path" : ""
        }${path.startsWith("/public/profile") ? " vai-now-path" : ""}${path === "/marketplace" ? " vai-now-path" : ""
        }${path === "/vairipay-request" ? " vai-now-path" : ""}${path === "/marketplace/active/invitation" ? " vai-now-path" : ""
        // }${path === "/vairipay-options" ? " vai-now-path" : ""}${path === "/marketplace/post" ? " mt-[15px]" : ""
        }${path === "/my-vairify-details" ? " vai-now-path" : ""}${path === "/settings/about-me" ? " vai-now-path" : ""
        }${path === "/profile-permissions"
          ? " profile-permission-screen mt-[0px]"
          : ""
      }
      ${path.startsWith("/chat/") ? " !fixed h-screen top-0 !overflow-hidden scrollbar-hidden" : ""}
      `}
    >
      {path.includes("/varidate") ||
        path.includes("manage-incall-addresses") ? (
        // <div
        //   className=" rounded-2xl bg-[#D5D6E0] overflow-visible pb-3 pt-2 mx-[8px]"
        //   style={{ minHeight: `calc(100vh - 149px)`, maxHeight: `calc(100vh - 149px)` }}
        // >
        //   {contentComponent}
        // </div>
        <div
          // style={{
          //   minHeight: `100vh`,
          //   maxHeight: `100vh`,
          // }}
        >
          {contentComponent}
        </div>
      ) 
      // : path.includes("/vai-now") ? (
      //   <div
      //     style={{
      //       minHeight: `100vh`,
      //       maxHeight: `100vh`,
      //     }}
      //   >
      //     {contentComponent}
      //   </div>
      // ) 
      : path.includes("/calendar") ? (
        <div className=" ">
          {contentComponent}
        </div>
      ) : path.startsWith("/dateguard") ? (
        <div>
          {contentComponent}
        </div>
      ) :
        // path.startsWith("/my-vairify") ? (
        //   <div
        //     className={` rounded-2xl bg-[#b9bacc] ${
        //       path === "/my-vairify-details" ? "overflow-visible" : ""
        //     }`}
        //     style={{
        //       minHeight: `calc(100vh - 160px)`,
        //       maxHeight: `calc(100vh - 160px)`,
        //     }}
        //   >
        //     {contentComponent}
        //   </div>
        // ) : 
        path.includes("/godlen-rose-tokens") ? (
          <div className=" rounded-2xl bg-[#3760CB]">
            {contentComponent}
          </div>
        )
          // : path.includes("/personal-information") ? (
          //   <div
          //     className=" "
          //     style={{ minHeight: `calc(100vh - 149px)` }}
          //   >
          //     {contentComponent}
          //   </div>
          // ) 
          // : path.includes("/user/profile") ? (
          //   <div
          //     className=" rounded-2xl bg-[#b9bacc] overflow-visible"
          //   >
          //     {contentComponent}
          //   </div>
          // ) 
          : (
            <>
              {contentComponent}
            </>
          )}
      {!isOutsider && <Footer bgColor={bgColor} />}
    </div>
  );
}
