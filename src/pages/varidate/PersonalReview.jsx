import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function PersonalReview({
  userAvatar,
  userName,
  date,
  rate,
  vairifyId,
}) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/varidate/sugar-analysis");
  };

  return (
    <div className="w-full mx-auto flex flex-row justify-between items-center bg-[#3760CB] h-[75px] rounded-[25px] px-4 py-2 mb-3">
      <div className="w-[47.7px] h-[47.7px] overflow-hidden rounded-full">
        <img src={`${userAvatar}`} alt="Review First Item" />
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="font-bold text-[16.2px] text-white">
          <span>{userName}</span>
        </div>
        <div className="font-extrabold text-[8.1px] text-white uppercase">
          <span>VAI<span className="logoSetupweight">RIFY ID</span> {vairifyId}</span>
        </div>
        <div></div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="font-bold text-[12.6px] text-white flex items-center justify-center">
          <span>{date}</span>
        </div>
        <div className="flex justify-center items-center mt-2 mb-2">
          <FontAwesomeIcon
            icon={faStar}
            color={rate >= 1 ? "#E1AB3F" : "#111"}
            className="text-[10px] margin-right-5"
          />
          <FontAwesomeIcon
            icon={faStar}
            color={rate >= 2 ? "#E1AB3F" : "#111"}
            className="text-[10px] margin-right-5"
          />
          <FontAwesomeIcon
            icon={faStar}
            color={rate >= 3 ? "#E1AB3F" : "#111"}
            className="text-[10px] margin-right-5"
          />
          <FontAwesomeIcon
            icon={faStar}
            color={rate >= 4 ? "#E1AB3F" : "#111"}
            className="text-[10px] margin-right-5"
          />
          <FontAwesomeIcon
            icon={faStar}
            color={rate >= 5 ? "#E1AB3F" : "#111"}
            className="text-[10px]"
          />
        </div>
        <div className="flex items-center justify-center">
          <span className="font-bold text-[12.6px] text-white">{rate}</span>
        </div>
      </div>
      {/* <div className='w-[72px]'><Button onClick={handleNavigation} text="Details" size="27px" className={'font-bold text-white text-[18px] px-2'} bgColor={'[#02227E]'} /></div> */}
    </div>
  );
}
