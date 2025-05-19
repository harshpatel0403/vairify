import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import VaridateService from "../../../services/VaridateServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import Loading from "../../../components/Loading/Index";
import PageTitle from "../../../components/PageTitle";
import Modal from 'react-modal'
import { IoCloseCircleOutline } from "react-icons/io5";
import HotRodAnalysis from "../../varidate/HotRodAnalysis";

const VaiNowList = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [particularItem, setParticularItem] = useState({});
  const closeModal = () => {
    setOpenModal(false);
  }

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const userType = UserDetails?.user_type; //'companion-provider'

  const accpetAppt = (appointment) => {
    navigate("/varidate/face-verification", {
      state: { ...appointment, from: "vairifyNow" },
    });
  };

  const rejectAppt = async (appointmentId) => {
    try {
      setLoading(true);
      await VaridateService.updateAppointment(UserDetails._id, appointmentId, {
        companionStatus: "Rejected",
        clientStatus: "Rejected",
      });
      await fetchAppointments();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToviewall = (appointment) => {
    // if (
    //   userType === "client-hobbyist" &&
    //   (appointment?.companionStatus === "Accepted" ||
    //     appointment?.clientStatus === "Sign Pending")
    // ) {
    //   navigate("/Vairify now/accept", {
    //     state: { ...appointment, from: "Vairify now" },
    //   });
    // } else if (appointment.companionStatus === "Pending") {
    //   navigate("/Vairify now/accept", {
    //     state: { ...appointment, from: "Vairify now" },
    //   });
    // } else {
    // }
    navigate("/varidate/booking-details", {
      state: { ...appointment, from: "Vairify now" },
    });
  };
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const apts = await VaridateService.getVaiNowAppointments(UserDetails._id);
      setAppointments(apts);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      await VaridateService.updateAppointment(UserDetails._id, appointmentId, {
        [userType === "client-hobbyist" ? "clientStatus" : "companionStatus"]:
          "Cancel",
      });
      await fetchAppointments();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center align-center items-center pt-[48px] h-[50vh]">
        <Loading />
      </div>
    );
  }

  const navigateToViewPage = (appointment) => {
    if (appointment.manualSelfie) {
      // /varidate/verification-manual
      // /varidate/verification
      navigate("/varidate/verification-manual", { state: appointment });
    } else {
      navigate("/varidate/verification", { state: appointment });
    }
  };

  return (
    <div
      className="container"
    >
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"VAIRIFY Now"} />
      </div>
      <div className="flex flex-col justify-between">

        {appointments?.length > 0 ? (
          <div className="items-center flex sm:flex-row flex-col gap-[26px] px-2 pb-8">
            <div className="grid md:grid-cols-2 gap-4 w-full">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="w-full p-[16px] bg-[#919EAB33] rounded-[16px] "
                >

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-[8px] flex-grow">
                      <div>
                        <img
                          src={
                            appointment?.[
                              userType == "client-hobbyist"
                                ? "companionId"
                                : "clientId"
                            ]?.profilePic
                              ?
                              `${import.meta.env
                                .VITE_APP_S3_IMAGE
                              }/${appointment?.[
                                userType == "client-hobbyist"
                                  ? "companionId"
                                  : "clientId"
                              ]?.profilePic
                              }`
                              : appointment?.[
                                userType == "client-hobbyist"
                                  ? "companionId"
                                  : "clientId"
                              ]?.gender === "Male"
                                ? "/images/male.png"
                                : "/images/female.png"
                          }
                          className="w-[48px] h-[48px] rounded-full object-cover"
                          alt=""
                        />

                      </div>
                      <div>
                        <div className="sm:text-base text-sm text-white font-medium">
                          {
                            appointment?.[
                              userType == "client-hobbyist"
                                ? "companionId"
                                : "clientId"
                            ]?.name
                          }
                        </div>
                        <div className="sm:text-sm text-xs font-normal text-[#919EAB] uppercase">
                          {
                            appointment?.[
                              userType == "client-hobbyist"
                                ? "companionId"
                                : "clientId"
                            ]?.vaiID
                          }
                        </div>

                      </div>
                    </div>
                    <div>
                      <div className="flex gap-[4px]">
                        <p className="sm:text-base text-sm text-white font-semibold">
                          {appointment?.[userType === "client-hobbyist" ? "companionId" : "clientId"]?.avgRating || 0}
                        </p>
                        <img src="/images/home/star.svg" alt="rating" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-[16px]">
                    <div className="flex justify-between gap-2">
                      <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">VAIRIFY Now</div>
                      <p className="text-white sm:text-sm text-xs font-medium text-right">
                        {appointment?._id}
                      </p>
                    </div>
                    <div className="flex justify-between gap-2">
                      <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">Request Appt/time</div>
                      <p className="text-white sm:text-sm text-xs font-medium text-right">
                        {moment(appointment?.startDateTime).format(
                          "MM/DD/YYYY"
                        )}{" "}
                        -
                        {moment(appointment?.startDateTime).format(
                          "hh:mmA"
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between gap-2">
                      <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">Elapsed Time</div>
                      <p className="text-white sm:text-sm text-xs font-medium text-right">
                        {appointment?.createdAt
                          ? moment(appointment?.createdAt).fromNow()
                          : " - "}
                      </p>
                    </div>
                    <div className="flex justify-between gap-2">
                      <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">Status</div>
                      <p className={`sm:text-sm text-xs font-medium text-right ${(userType === "client-hobbyist"
                        ? appointment?.companionStatus
                        : appointment?.clientStatus) === "Requested"
                        ? "text-cyan-500"
                        : (userType === "client-hobbyist"
                          ? appointment?.companionStatus
                          : appointment?.clientStatus) === "Rejected"
                          ? "text-red-500"
                          : (userType === "client-hobbyist"
                            ? appointment?.companionStatus
                            : appointment?.clientStatus) === "Scheduled"
                            ? "text-green-500"
                            : (userType === "client-hobbyist"
                              ? appointment?.companionStatus
                              : appointment?.clientStatus) === "Pending"
                              ? "text-yellow-500"
                              : "text-white"
                        }`}>
                        {userType === "client-hobbyist" &&
                          appointment?.clientStatus !== "Cancel"
                          ? appointment?.companionStatus
                          : appointment?.clientStatus}
                      </p>
                    </div>
                  </div>





                  {/* old */}
                  <div className="flex gap-2 sm:gap-4 items-center">
                    <div className="flex-1">
                      <div className="flex mt-4 gap-2">
                        <div className="w-full flex gap-[8px]">
                          <Button
                            onClick={() =>
                              navigate("/user/profile", {
                                state: {
                                  item: {
                                    userId:
                                      appointment?.[
                                      userType === "client-hobbyist"
                                        ? "companionId"
                                        : "clientId"
                                      ],
                                  },
                                  market: true,
                                },
                              })
                            }
                            className="py-[4px] w-full px-4"
                            text={'View Profile'}
                            size={'36px'}
                          />

                          {userType !== "client-hobbyist" &&
                            appointment?.companionStatus !== "Scheduled" &&
                            appointment?.companionStatus !== "Rejected" && (
                              <Button
                                // disabled={
                                //   appointment?.companionStatus !== "Accepted" &&
                                //   appointment?.companionStatus !== "Signed" &&
                                //   appointment?.companionStatus !== "Scheduled"
                                // }
                                onClick={() => accpetAppt(appointment)}
                                className="py-[4px] secondary-btn !bg-[#008F34] px-4"
                                text={'Accept'}
                              />

                            )}
                          {userType !== "client-hobbyist" &&
                            appointment?.companionStatus !== "Scheduled" &&
                            appointment?.companionStatus !== "Rejected" && (
                              <Button
                                // disabled={
                                //   appointment?.companionStatus !== "Accepted" &&
                                //   appointment?.companionStatus !== "Signed" &&
                                //   appointment?.companionStatus !== "Scheduled"
                                // }
                                onClick={() => rejectAppt(appointment?._id)}
                                className="py-[4px] secondary-btn !bg-[#E43530] px-4"
                                text={'Cancel'}
                              />
                            )}
                          {(userType === "client-hobbyist" ||
                            appointment?.companionStatus === "Scheduled") && (
                              <Button
                                // disabled={
                                //   appointment?.companionStatus !== "Accepted" &&
                                //   appointment?.companionStatus !== "Signed" &&
                                //   appointment?.companionStatus !== "Scheduled"
                                // }
                                onClick={() => navigateToviewall(appointment)}
                                className="py-[4px] secondary-btn !bg-transparent border-[2px] border-[#919EAB33] hover:!bg-[#FFFFFF29]"
                                text={'View'}
                                size={'36px'}
                              />
                            )}
                        </div>
                      </div>
                      {appointment?.vaiCheckStatus?.[
                        userType === "client-hobbyist"
                          ? "clientStatus"
                          : "companionStatus"
                      ] === "Verified" ? (
                        <Button
                          onClick={() => {
                            setOpenModal(true);
                            setParticularItem(appointment)
                          }
                          }
                          // onClick={() =>
                          //   navigate("/varidate/post/review", {
                          //     state: appointment,
                          //   })
                          // }
                          className="w-full mt-3 py-[4px] secondary-btn !bg-transparent border-[2px] border-[#919EAB33] hover:!bg-[#FFFFFF29]"
                          disabled={appointment?.[
                            userType == "client-hobbyist"
                              ? "companionId"
                              : "clientId"
                          ]?.reviews?.find(
                            (review) =>
                              review?.appointment === appointment?._id
                          )}
                          text={appointment?.[
                            userType == "client-hobbyist"
                              ? "companionId"
                              : "clientId"
                          ]?.reviews?.find(
                            (review) =>
                              review?.appointment === appointment?._id
                          )
                            ? "Reviewed"
                            : "Post Review"}
                        ></Button>
                      ) : (
                        appointment?.companionStatus === "Scheduled" && (
                          <Button
                            onClick={() =>
                              navigate("/varidate/face-verification", {
                                state: {
                                  ...appointment,
                                  from: "vairifyNow",
                                  for: "vaicheck",
                                },
                              })
                            }
                            text={'VAI Check'}
                            className="w-full px-7 py-[4px] secondary-btn !bg-[#008F34] mt-3 mb-4"
                          >

                          </Button>
                        )
                      )}
                      <div className="flex justify-between items-center"></div>
                    </div>
                  </div>
                  {true || userType === "client-hobbyist" ? (
                    <></>
                  ) : (
                    <>
                      <div className="w-full mx-auto flex flex-row justify-center items-center mt-3">
                        <div className="w-[100%] text-center">
                          <button className="w-full font-roboto font-bold text-[16px] text-white px-7 py-[3px]  rounded-[25px] bg-[#02227E]">
                            {
                              appointment?.[
                              userType === "client-hobbyist"
                                ? "clientStatus"
                                : "companionStatus"
                              ]
                            }
                          </button>
                        </div>
                        <div className="max-w-[50%] w-[100%] text-center pe-3">
                          <Button
                            onClick={() => navigateToViewPage(appointment)}
                            text={"Go to VAIRIDATE"}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xl text-white font-bold text-center flex flex-col justify-center items-center my-[48px] gap-[24px]">
            <div className="image-not">
              <img src="/images/home/result-not-found.svg" alt="not found" />
            </div>
            Result not found
          </div>
        )}
        {/* </div>
        </div> */}
        <Modal
          isOpen={openModal}
          onRequestClose={closeModal}
          className=" max-w-[550px] sm:max-h-[800px] max-h-[600px] h-full mx-auto bg-white overflow-auto fixed rounded-2xl sm:p-[24px] p-[16px] w-[90%]"
          contentLabel="#"
        >
          <button
            className="absolute sm:right-[24px] right-[16px] sm:top-[20px] top-[12px] p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={closeModal}
          >
            <IoCloseCircleOutline size={26} />
          </button>
          <HotRodAnalysis state={particularItem} />
        </Modal>
      </div>
    </div>
  );
};

export default VaiNowList;
