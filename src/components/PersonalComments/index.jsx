import React from "react";

export default function PersonalComments({
  userAvatar,
  userName,
  duration,
  content,
  gender,
  userNameColor
}) {
  return (
    <div className="w-full mx-auto flex flex-col justify-center items-center">
      <div className="w-full mx-auto flex flex-row justify-between items-start gap-1 mt-[16px]">
        <div className="flex gap-[16px] items-start">
          <div className="h-[40px] w-[40px] mr-2">
            <img src={`${userAvatar}`} alt="" className="rounded-full h-[40px] w-[40px] object-cover" />
          </div>
          <div className="mr-2">
            <div className={`text-base sm:text-[#212B36] text-white font-medium ${userNameColor}`}>{userName}</div>
            <div className="font-normal sm:text-[#919EAB] text-white text-sm">{content}</div>
          </div>
        </div>
        <div>
          <div className="font-normal sm:text-[#919EAB] text-white text-xs">{duration}</div>
        </div>
      </div>
      {/* <div className="w-full mx-auto flex flex-row justify-start items-center mt-[10px] mb-[10px] ">
        <div className="font-bold text-[16px]">{content}</div>
      </div> */}
      {/* <div className='w-full mx-auto flex flex-row justify-start items-center flex-wrap mt-5'>
                <button className='mr-5 mb-3'><span className='font-bold text-[14.4px] opacity-20'>1 like</span></button>
                <button className='mr-5 mb-3'><span className='font-bold text-[14.4px] opacity-20'>Reply</span></button>
                <button className='mr-5 mb-3'><span className='font-bold text-[14.4px] opacity-20'>See Translation</span></button>
            </div> */}
    </div>
  );
}
