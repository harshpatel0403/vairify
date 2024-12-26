import React from "react";
import Escort from "./Escort";
import { useSelector } from "react-redux";
import BusinessRateServices from "../../../components/Services/business/BusinessServices";
import { useLocation } from "react-router-dom";

export default function Home() {
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const { state } = useLocation();
  return (
    <div className="main-container px-0">
      {UserData?.user_type === "agency-business" ? (
        <BusinessRateServices UserData={UserData} EditData={state} />
      ) : (
        <>
          <h1 className="text-[32px] text-[#02227E] font-bold text-center font-roboto-serif py-2">
            Services
          </h1>
          <div className="w-full bg-gradient-to-t from-[#0247FF] to-[#02227EAD] h-[27px]"></div>
          <Escort />
        </>
      )}
    </div>
  );
}
