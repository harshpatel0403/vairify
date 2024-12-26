import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import DateGuardService from "../../../services/DateGuardService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

export default function DateGuardSelectAppointment() {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const userType = UserDetails?.user_type; //'companion-provider'

  const navigate = useNavigate();

  const userId = UserDetails?._id;
  useEffect(() => {
    if (!UserDetails) {
      navigate("/login");
      return;
    }
    setLoading(true);
    DateGuardService.getAppointments(userId)
      .then((res) => {
        console.log(res, " <=== appointments in response..");
        setAppointments(res || []);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.error || error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSelectAppointment = (appointment) => {
    navigate(`/dateguard/pick-group/${appointment._id}`);
  };
  return (
    <div className="main-container form-field-container p-0">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        <div className="w-full mx-auto flex items-center justify-center">
          <span className="font-bold text-[30px] text-[#05B7FD] change-font-family">
            Date Guard
          </span>
        </div>
        <div className="w-full mx-auto flex items-center justify-center mt-4">
          <div className="w-[67px] h-[82px]">
            <img src={"/images/DateGuardMask.png"} alt="Date Guard Mask" />
          </div>
        </div>

        {appointments?.length > 0 ? (
          <div className="w-full mx-auto flex items-center justify-center mt-4">
            <span className="font-bold text-[30px] text-[#D9D9D9] change-font-family">
              SELECT APPOINTMENT
            </span>
          </div>
        ) : null}

        {/* <div className="w-full mx-auto flex items-center justify-center mt-12">
          <div className="w-[262px]">
            <Button
              onClick={() => nav("/dateguard/create-group")}
              text="Create Group"
              className={
                "bg-[#4200FF] rounded-[25px] font-bold text-[24px] text-[#D9D9D9] change-font-family"
              }
              size="43px"
            />
          </div>
        </div> */}
        <div className="w-full mx-auto flex flex-col justify-between items-center mt-7 mb-20">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : (
            <>
              {appointments?.length === 0 ? (
                <div className="text-[32px] text-[#4b4b4b] font-bold text-center h-[300px] flex flex-col justify-center items-center">
                  <div className="image-not">
                    <img src="/images/notFound.png" alt="logo" />
                  </div>
                  Result not found
                </div>
              ) : (
                <>
                  {appointments.map((appointment, index) => (
                    <div
                      key={index}
                      className="w-full mx-auto flex flex-row justify-between items-center flex-wrap mb-4"
                    >
                      <div className="name-time-part flex flex-row justify-start items-center">
                        <div className="w-[40px] h-[40px] rounded-[50%] bg-[#05B7FD] flex items-center justify-center mr-4 mb-0">
                          {/* <img
                        src={"/images/MathPlusMinus.png"}
                        alt="Plus-Minus Icon"
                      /> */}
                          <span>
                            {
                              appointment?.[
                                userType === "client-hobbyist"
                                  ? "companionId"
                                  : "clientId"
                              ]?.name?.[0]
                            }
                          </span>
                        </div>
                        <div className="w-[150px] flex flex-col justify-center items-start mr-6 ml-2">
                          <div>
                            <span className="font-bold text-[20px] text-[#D9D9D9]">
                              {
                                appointment?.[
                                  userType === "client-hobbyist"
                                    ? "companionId"
                                    : "clientId"
                                ].name
                              }
                            </span>
                          </div>
                          <div className="w-[150px] flex flex-start ">
                            {/* <Link to={`/dateguard/edit-group/${appointment._id}`}>
                      <Button
                        text="Edit/Details"
                        className={
                          "rounded-[10px] change-font-family bg-[#05B7FD] font-bold text-[14px] text-[#02227E]"
                        }
                        size="20px"
                      />
                    </Link> */}
                            {appointment?.startDateTime && (
                              <span className="rounded-[10px] text-left font-bold text-[14px] text-[#fff] opacity-50">
                                {moment(appointment?.startDateTime)?.format(
                                  "DD/MM/YYYY HH:mm:ss"
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-[77px]">
                        <Button
                          onClick={() => handleSelectAppointment(appointment)}
                          text="Select"
                          className={
                            "rounded-[10px] change-font-family bg-[#05B7FD] font-bold text-[20px]"
                          }
                          size="34px"
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
          {/* <div className='w-full mx-auto flex flex-row justify-center items-center flex-wrap mt-5'>
                        <div className='w-[34px] h-[34px] rounded-[50%] bg-[#05B7FD] flex items-center justify-center mr-4 mb-0'><img src={'/images/MathPlusMinus.png'} alt="Plus-Minus Icon" /></div>
                        <div className='w-[122px] flex flex-col justify-center items-start mr-6 mb-4'><div><span className='font-bold text-[20px] text-[#D9D9D9]'>Family</span></div><div className='w-[100px]'><Button text="Edit/Details" className={'rounded-[10px] change-font-family bg-[#05B7FD] font-bold text-[14px] text-[#02227E]'} size="20px" /></div></div>
                        <div className='w-[35px] mr-4 mb-4'><span className='font-bold text-[30px] text-[#D9D9D9]'>5</span></div>
                        <div className='w-[77px] mb-4'><Button text="Select" className={'rounded-[10px] change-font-family bg-[#05B7FD] font-bold text-[20px]'} size="34px" /></div>
                    </div>
                    <div className='w-full mx-auto flex flex-row justify-center items-center flex-wrap mt-5'>
                        <div className='w-[34px] h-[34px] rounded-[50%] bg-[#05B7FD] flex items-center justify-center mr-4 mb-0'><img src={'/images/MathPlusMinus.png'} alt="Plus-Minus Icon" /></div>
                        <div className='w-[122px] flex flex-col justify-center items-start mr-6 mb-4'><div><span className='font-bold text-[20px] text-[#D9D9D9]'>Atlanta</span></div><div className='w-[100px]'><Button text="Edit/Details" className={'rounded-[10px] change-font-family bg-[#05B7FD] font-bold text-[14px] text-[#02227E]'} size="20px" /></div></div>
                        <div className='w-[35px] mr-4 mb-4'><span className='font-bold text-[30px] text-[#D9D9D9]'>10</span></div>
                        <div className='w-[77px] mb-4'><Button text="Select" className={'rounded-[10px] change-font-family bg-[#05B7FD] font-bold text-[20px]'} size="34px" /></div>
                    </div> */}
        </div>
      </div>
    </div>
  );
}
