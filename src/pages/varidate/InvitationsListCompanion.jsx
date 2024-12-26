import React from "react";
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const InvitationsCompanion = () => {
  const navigate = useNavigate();
  const navigateToviewall = () => {
    navigate("/varidate/booking-details");
}
  return (
    <div className="main-content py-4 rounded-2xl pb-[45px] bg-[#D5D6E0]">
      <div className="flex flex-col justify-between">
        <div className="mt-2 bg-[#040C50]/[26%] w-full ">
          <h2 className="font-bold py-2 text-[24px] text-[#02227E] font-inter ">
            Pending Requests/invitations
          </h2>
        </div>
        <div className="mt-[35px] items-center flex sm:flex-row flex-col gap-[26px] px-2">
          <div className="sm:w-[100%] max-w-[440px] bg-[#3760CB] shadow-2xl py-[12px] rounded-[20px] border border-gray-100 h-[auto] min-h-[235px]">
            <div className="flex gap-2 sm:gap-4 pl-[10px] pr-[10px]">
              <div className="w-[25%] justify-center">
                <img
                  src="/images/EllipseSugar.png"
                  className="w-[86px] h-[86px]"
                  alt=""
                />
                <div className="mt-3">
                  <Button text='View Profile' className={'p-1 h-[min-content] text-[14px] text-white rounded-[25px] border-2 border-white bg-grandient-to-b from-[#02227E] to-[#0247FF]'}  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="text-xs text-white font-roboto font-semibold">
                    TruRevu
                    </h6>
                    <h6 className="text-xs text-white font-roboto font-semibold">
                      Sugar / ID# 5SES168
                    </h6>

                    <div className="flex gap-1 items-start">
                      <div className="flex gap-1 mt-1">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <img
                            src="/images/Star.svg"
                            className="w-[10px]  h-[10px]"
                            alt=""
                          />
                        ))}
                      </div>
                      <span className="text-white block text-center  font-roboto font-bold text-[15px]">
                        5.0
                      </span>
                    </div>
                  </div>
                  <button>
                    <img src="/images/phone-rounded.svg" />
                  </button>
                  <button>
                    <img src="/images/massege-rounded.svg" />
                  </button>
                </div>
                <div className="grid gap-[5px] mt-4 grid-cols-4">
                  <span className="font-roboto text-white text-[10px]">
                    Requested <br /> Appt/time
                  </span>
                  <span className="font-roboto text-white text-[10px]">
                    Requested <br /> Appt/time
                  </span>
                  <span className="font-roboto text-white text-[10px]">
                    Elapsed <br /> Time
                  </span>
                  <span className="font-roboto text-white text-[10px]">
                    Status
                  </span>
                </div>
                <div className="grid gap-[5px] mt-4 sm:mt-[14px] grid-cols-4">
                  <span className="font-roboto text-white text-[10px]">
                    1/28/23 <br />
                    6:oopm-9:00pm
                  </span>
                  <span className="font-roboto text-white text-[10px]">
                    1/28/23 <br /> 4:28pm
                  </span>
                  <span className="font-roboto text-white text-[10px]">
                    3hr 46m
                  </span>
                  <span className="font-roboto text-white text-[10px]">
                    Pending
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row justify-center items-center mt-3"> 
              <div className='max-w-[50%] w-[100%] px-4 text-center flex flex-col justify-center'>
                <span className="text-white font-bold" >Status</span>
                <button className="font-roboto font-bold text-[16px] text-white px-7 py-[3px] border rounded-[25px] border-[#02227E] bg-[#02227E]">
                  Pending
                </button>
              </div>
              <div className='max-w-[50%] w-[100%] text-center pe-2 flex items-end h-full'>
                <Button className={'h-[min-content] bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[16px] p-1 font-bold shadow-2xl mt-auto'} text={'Go to varidate>>'} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvitationsCompanion;
