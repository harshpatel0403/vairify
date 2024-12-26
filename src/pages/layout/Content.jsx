import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function Content({ contentComponent, bgColor, setHandleBack }) {
  const location = useLocation();
  const nav = useNavigate();
  const path = location.pathname;
  const isOutsider = path.startsWith("/dateguard/emergency-contacts");

  return (
    <div
      className={`h-auto content-layout overflow-visible z-[99] mt-[80px] mb-[69px] relative${
        path.startsWith("/varidate")
          ? " h-auto z-[9999] relative overflow-visible mb-[80px] vai-now-path"
          : ""
      }${path.startsWith("/vairify-schedule") ? " display-prifile-icon" : ""}${
        path.startsWith("/vai-now") ? " vai-now-path" : ""
      }${path.startsWith("/public/profile") ? " vai-now-path" : ""}${
        path === "/marketplace" ? " vai-now-path" : ""
      }${path === "/vairipay-request" ? " vai-now-path" : ""}${
        path === "/marketplace/active/invitation" ? " vai-now-path" : ""
      }${path === "/vairipay-options" ? " vai-now-path" : ""}${
        path === "/marketplace/post" ? " mt-[15px]" : ""
      }${path === "/my-vairify-details" ? " vai-now-path" : ""}${
        path === "/settings/about-me" ? " vai-now-path" : ""
      }${
        path === "/profile-permissions"
          ? " profile-permission-screen mt-[0px]"
          : ""
      }`}
    >
      {path.includes("/varidate") ||
      path.includes("manage-incall-addresses") ? (
        // <div
        //   className="main-content rounded-2xl bg-[#D5D6E0] overflow-visible pb-3 pt-2 mx-[8px]"
        //   style={{ minHeight: `calc(100vh - 149px)`, maxHeight: `calc(100vh - 149px)` }}
        // >
        //   {contentComponent}
        // </div>
        <div
          className="main-content rounded-2xl bg-[#D5D6E0] overflow-visible pb-3 pt-2 mx-[8px]"
          style={{
            minHeight: `calc(100vh - 160px)`,
            maxHeight: `calc(100vh - 160px)`,
          }}
        >
          {contentComponent}
        </div>
      ) : path.includes("/vai-now") ? (
        <div
          className="main-content rounded-2xl bg-[#D5D6E0] overflow-visible pb-3 pt-2 mx-[8px]"
          style={{
            minHeight: `calc(100vh - 149px)`,
            maxHeight: `calc(100vh - 149px)`,
          }}
        >
          {contentComponent}
        </div>
      ) : path.includes("/calendar") ? (
        <div className="main-content rounded-2xl bg-[#3760CB]">
          {contentComponent}
        </div>
      ) : path.startsWith("/dateguard") ? (
        <div className="main-content rounded-2xl bg-[#100333]">
          {contentComponent}
        </div>
      ) : path.startsWith("/my-vairify") ? (
        <div
          className={`main-content rounded-2xl bg-[#b9bacc] ${
            path === "/my-vairify-details" ? "overflow-visible" : ""
          }`}
          style={{
            minHeight: `calc(100vh - 160px)`,
            maxHeight: `calc(100vh - 160px)`,
          }}
        >
          {contentComponent}
        </div>
      ) : path.includes("/godlen-rose-tokens") ? (
        <div className="main-content rounded-2xl bg-[#3760CB]">
          {contentComponent}
        </div>
      ) : path.includes("/personal-information") ? (
        <div
          className="main-content rounded-2xl bg-[#b9bacc] overflow-visible"
          style={{ minHeight: `calc(100vh - 149px)` }}
        >
          {contentComponent}
        </div>
      ) : path.includes("/user/profile") ? (
        <div
          className="main-content rounded-2xl bg-[#b9bacc] overflow-visible"
          style={{ minHeight: `calc(100vh - 155px)` }}
        >
          {contentComponent}
        </div>
      ) : (
        <div
          className="main-content rounded-2xl bg-[#b9bacc] overflow-visible"
          style={{ minHeight: `calc(100vh - 149px)` }}
        >
          {contentComponent}
        </div>
      )}
      {!isOutsider && <Footer bgColor={bgColor} />}
    </div>
  );
}
