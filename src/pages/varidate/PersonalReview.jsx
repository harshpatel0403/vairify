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
    <div className="w-full mx-auto flex justify-between items-center bg-[#919EAB33] p-[16px] rounded-[8px]">
      <div className="flex gap-3 items-center">
        <img src={`${userAvatar}`} alt="Review First Item" className="h-[52px] w-[52px] rounded-full object-cover" />
        <div>
          <div className="font-medium text-base text-white">
            {userName}
          </div>
          <div className="font-normal text-sm text-[#919EAB] uppercase mt-[4px]">
            {vairifyId}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-end">
        <div class="flex gap-1 items-center"><p class="text-[18px] text-white font-bold mt-[2px]">{rate}</p><img src="/images/home/star.svg" alt="star"/></div>
        <div className="font-normal text-[13px] text-[#919EAB]">
          {date}
        </div>

      </div>
      {/* <div className='w-[72px]'><Button onClick={handleNavigation} text="Details" size="27px" className={'font-bold text-white text-[18px] px-2'} bgColor={'[#02227E]'} /></div> */}
    </div>
  );
}
