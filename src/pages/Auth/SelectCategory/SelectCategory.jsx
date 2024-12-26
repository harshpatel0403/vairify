import React from "react";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChainPassIDPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const handleCompanion = () => {
    navigate("/signup", {
      state: { type: "companion-provider", language: state.language }
    });
  };
  const handleAgency = () => {
    navigate("/signup", {
      state: { type: "agency-business", language: state.language }
    });
  };
  const handleClient = () => {
    navigate("/signup", {
      state: { type: "client-hobbyist", language: state.language }
    });
  };
  const handleInfluencer = () => {
    navigate("/signup", {
      state: { type: "influencer-affiliate", language: state.language }
    });
  };

  return (
    <div className="main-container flex flex-col justify-center form-field-container">
      <div className="relative flex flex-col justify-start items-center">
        <div className="relative top-6">
          <img src={"/images/VectorLogo1.png"} alt="Vector Logo 1" />
        </div>
        <div className="relative bottom-2 left-4">
          <img src={"/images/VectorLogo2.png"} alt="Vector Logo 2" />
        </div>
        <div className="relative ">
          <span
            style={{ fontFamily: "Roboto Serif" }}
            className="font-bold text-[28px] text-center text-[#02227E]"
          >
            VAI
          </span>
          <span
            style={{ fontFamily: "Roboto Serif" }}
            className="font-light text-[28px] text-center text-[#02227E]"
          >
            RIFY
          </span>
        </div>
      </div>
      <div className="mt-5 mb-2">
        <span
          className="text-[18px] text-[#02227E] font-bold"
        >
          Select Your Category
        </span>
      </div>
      <div className="">
        <Button
          className={
            "mt-6 from-[#02227E] to-[#0247FF] font-bold text-white text-[19.8px] border-4 border-[#CCCCCC]"
          }
          size="52px"
          text={"Client/Hobbyist"}
          onClick={handleClient}
        />
        <Button
          className={
            "mt-4 from-[#02227E] to-[#0247FF] font-bold text-white text-[19.8px] border-4 border-[#CCCCCC]"
          }
          size="52px"
          text={"Companion/Provider"}
          onClick={handleCompanion}
        />
        <Button
          className={
            "mt-4 from-[#02227E] to-[#0247FF] font-bold text-white text-[19.8px] border-4 border-[#CCCCCC]"
          }
          size="52px"
          text={"Agency/Business"}
          onClick={handleAgency}
        />
        <Button
          className={
            "mt-4 from-[#02227E] to-[#0247FF] font-bold text-white text-[19.8px] border-4 border-[#CCCCCC]"
          }
          size="52px"
          text={"Influencer/Affliliate"}
          onClick={handleInfluencer}
        />
      </div>
      {/* <div className="mb-12 mt-9">
            <Button text={'Next'} className={'text-custom-1 py-2 from-inherit to-inherit bg-[#05B7FD] text-black'} />
        </div> */}
    </div>
  );
}
