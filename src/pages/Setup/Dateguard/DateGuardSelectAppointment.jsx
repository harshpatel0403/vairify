import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import DateGuardService from "../../../services/DateGuardService";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import Header from "../../../components/Header/Header";
import Loading from "../../../components/Loading/Index";
import PageTitle from "../../../components/PageTitle";

export default function DateGuardSelectAppointment() {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const userType = UserDetails?.user_type;
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
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Date Guard"} />
      </div>
      <div className="flex items-center justify-center">
        <img src="/images/setup/Disarm.svg" alt="guard" />
      </div>


      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        {appointments?.length > 0 ? (
          <div className="mt-4">
            <span className="font-medium sm:text-[28px] text-[24px] text-white text-center">
              Select Appointment
            </span>
            <p className="font-normal sm:text-[18px] text-[14px] opacity-70 text-white text-center">Select Client for meeting</p>
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
            <Loading />
          ) : (
            <>
              {appointments?.length === 0 ? (
                <div className="text-[24px] text-white font-medium text-center h-[300px] flex flex-col justify-center items-center gap-2">
                  <div className="image-not">
                    <img src="/images/home/notfound.svg" alt="logo" />
                  </div>
                  Result not found
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-[24px]">
                    {appointments.map((appointment, index) => (
                      <div
                        key={index}
                        className="w-full mx-auto flex flex-row justify-between items-center mb-4"
                      >
                        <div className="name-time-part flex flex-row justify-start items-center">
                          <div className="w-[50px] h-[50px] rounded-[50%] bg-[#FFFFFF14] flex items-center justify-center sm:mr-4 mt-2 mb-0">
                            {/* <img
                        src={"/images/MathPlusMinus.png"}
                        alt="Plus-Minus Icon"
                      /> */}
                            <span className="font-medium text-[20px] text-[#ffffff]">
                              {
                                appointment?.[
                                  userType === "client-hobbyist"
                                    ? "companionId"
                                    : "clientId"
                                ]?.name?.[0]
                              }
                            </span>
                          </div>
                          <div className="w-[150px] flex flex-col justify-center items-start sm:mr-6 mr-2 ml-2">
                            <div>
                              <span className="font-medium text-[14px] text-[#ffffff]">
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
                                <span className="font-medium text-[14px] text-[#ffffff] opacity-70">
                                  {moment(appointment?.startDateTime)?.format(
                                    "DD/MM/YYYY HH:mm:ss"
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button
                            onClick={() => handleSelectAppointment(appointment)}
                            text="Select"
                            className="font-medium text-[14px] text-[#ffffff] py-[5px] px-[18px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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
