import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import VaridateService from "../../services/VaridateServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import HotRodAnalysis from "./HotRodAnalysis";
import Modal from 'react-modal'
import { IoCloseCircleOutline } from "react-icons/io5";
import Loading from "../../components/Loading/Index";
import PageTitle from "../../components/PageTitle";
const PastInvitations = () => {
  const navigate = useNavigate();
  const navigateToviewall = (appointment) => {
    navigate("/varidate/appointment-details", { state: appointment });
  };
  const [openModal, setOpenModal] = useState(false);
  const [particularItem, setParticularItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  console.log(UserDetails, " logged in user");

  const userType = UserDetails?.user_type; //'companion-provider'

  const closeModal = () => {
    setOpenModal(false);
  }

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const apts = await VaridateService.getPastAppointments(UserDetails._id);
      console.log(apts, " <=== apts...");
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

  const handleChatIcon = (id) => {
    navigate(`/chat/${id}`);
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
      className="container mb-[48px]"
    >
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle isSmall={true} title={"Past Appointment"} />
      </div>
      <div className="w-full">
        {!appointments?.length && (
          <div className="text-xl text-white font-bold text-center flex flex-col justify-center items-center my-[48px] gap-[24px]">
            <div className="image-not">
              <img src="/images/home/result-not-found.svg" alt="not found" />
            </div>
            Result not found
          </div>
        )}
        <div className="">
          <div className="mt-[20px] gap-[26px] px-2">
            <div className="grid md:grid-cols-2 gap-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="w-full p-[16px] bg-[#919EAB33] rounded-[16px] cursor-pointer"
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
                          {
                            appointment?.[
                              userType === "client-hobbyist" ? "companionId" : "clientId"
                            ]?.avgRating || 0
                          }
                        </p>
                        <img src="/images/home/star.svg" alt="rating" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-[16px]">
                    <div className="flex justify-between gap-2">
                      <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">Date/Time</div>
                      <p className="text-white sm:text-sm text-xs font-medium text-right">
                        {moment(appointment?.startDateTime).format(
                          "DD/MM/YY"
                        )}{' '}
                        {moment(appointment?.startDateTime).format(
                          "hh.mma"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-[16px] flex gap-[8px]">
                    <Button
                      text={'View'}
                      size={'36px'}
                      className={'py-[4px]'}
                      onClick={() => navigateToviewall(appointment)}
                    />

                    {appointment?.companionStatus === "Scheduled" &&
                      appointment?.clientStatus === "Scheduled" && (
                        <Button
                          disabled={appointment?.[
                            userType == "client-hobbyist"
                              ? "companionId"
                              : "clientId"
                          ]?.reviews?.find(
                            (review) => review?.appointment === appointment?._id
                          )}
                          onClick={() => {
                            setOpenModal(true);
                            setParticularItem(appointment)
                          }
                            // navigate("/varidate/post/review", {
                            //   state: appointment,
                            // })
                          }
                          className={'py-[4px] !bg-transparent secondary-btn border-2 border-[#919EAB33] hover:!bg-[#919EAB33]'}
                          text={appointment?.[
                            userType == "client-hobbyist"
                              ? "companionId"
                              : "clientId"
                          ]?.reviews?.find(
                            (review) => review?.appointment === appointment?._id
                          )
                            ? "Reviewed"
                            : "Post Review"}
                        />

                      )}
                  </div>
                  {/* <div className="flex gap-2 sm:gap-4 pl-[10px] pr-[10px]">
                    <div className="w-[20%] justify-center">
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
                            //  `${
                            //     import.meta.env
                            //       .VITE_APP_API_USERPROFILE_IMAGE_URL
                            //   }/${
                            //     appointment?.[
                            //       userType == "client-hobbyist"
                            //         ? "companionId"
                            //         : "clientId"
                            //     ]?.profilePic
                            //   }`
                            : appointment?.[
                              userType == "client-hobbyist"
                                ? "companionId"
                                : "clientId"
                            ]?.gender === "Male"
                              ? "/images/male.png"
                              : "/images/female.png"
                        }
                        className="w-[60px] h-[60px] rounded-full"
                        alt=""
                      />
                  
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <h6 className="text-xs text-white font-roboto font-semibold">
                            TruRevu
                          </h6>
                          <h6 className="text-xs text-white font-roboto font-semibold">
                            {
                              appointment?.[
                                userType == "client-hobbyist"
                                  ? "companionId"
                                  : "clientId"
                              ]?.name
                            }{" "}
                            / ID #$
                            {
                              appointment?.[
                                userType == "client-hobbyist"
                                  ? "companionId"
                                  : "clientId"
                              ]?.vaiID
                            }
                          </h6>

                          <div className="flex gap-1 items-start">
                            <div className="flex gap-1 mt-1">
                              {Array.from(
                                {
                                  length:
                                    appointment?.[
                                      userType == "client-hobbyist"
                                        ? "companionId"
                                        : "clientId"
                                    ]?.avgRating || 0,
                                },
                                (_, index) => index
                              )?.map((rating) => (
                                <img
                                  src="/images/Star.svg"
                                  className="w-[10px]  h-[10px]"
                                  alt=""
                                />
                              ))}
                              {Array.from(
                                {
                                  length:
                                    5 -
                                    Math.floor(
                                      appointment?.[
                                        userType == "client-hobbyist"
                                          ? "companionId"
                                          : "clientId"
                                      ]?.avgRating || 0
                                    ),
                                },
                                (_, index) => index
                              )?.map((rating) => (
                                <img
                                  src="/images/StarUnfilled.svg"
                                  className="w-[10px]  h-[10px]"
                                  alt=""
                                />
                              ))}
                            </div>
                            <span className="text-white block text-center  font-roboto font-bold text-[15px]">
                              {appointment?.[
                                userType == "client-hobbyist"
                                  ? "companionId"
                                  : "clientId"
                              ]?.avgRating || 0}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h6 className="text-xs text-white font-roboto font-semibold">
                            {moment(appointment?.startDateTime).format(
                              "DD/MM/YY"
                            )}
                          </h6>
                          <h6 className="text-xs text-white font-roboto font-semibold">
                            {moment(appointment?.startDateTime).format(
                              "hh.mma"
                            )}
                          </h6>
                        </div>
                        <div className="user-information"></div>

                  
                        <button
                          onClick={() => navigateToviewall(appointment)}
                          className="font-roboto font-bold text-[16px] text-white px-3 py-[3px]  border rounded-[25px] border-white bg-[#02227E]"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                  {appointment?.companionStatus === "Scheduled" &&
                    appointment?.clientStatus === "Scheduled" && (
                      <button
                        disabled={appointment?.[
                          userType == "client-hobbyist"
                            ? "companionId"
                            : "clientId"
                        ]?.reviews?.find(
                          (review) => review?.appointment === appointment?._id
                        )}
                        onClick={() =>
                          navigate("/varidate/post/review", {
                            state: appointment,
                          })
                        }
                        className="font-roboto font-bold text-[16px] text-white px-7 py-[3px]  border rounded-[25px] border-white bg-[#02227E]"
                      >
                        {appointment?.[
                          userType == "client-hobbyist"
                            ? "companionId"
                            : "clientId"
                        ]?.reviews?.find(
                          (review) => review?.appointment === appointment?._id
                        )
                          ? "Reviewed"
                          : "Post Review"}
                      </button>
                    )} */}
                </div>
              ))}
            </div>
            {/* <div className="sm:w-[100%] max-w-[440px] bg-[#3760CB] shadow-2xl py-[12px] rounded-[20px] border border-gray-100 h-[auto] min-h-[235px]">
            <div className="flex gap-2 sm:gap-4 pl-[4px] pr-[10px]">
              <div className="w-[25%] justify-center">
                <img
                  src="/images/vairify-marketpalce.png"
                  className="w-[86px] h-[86px] rounded-full "
                  alt=""
                />
                <div className="mt-3">
                  <span className="block text-[12px] font-bold font-roboto text-white whitespace-nowrap">
                    Request Type
                  </span>
                  <span className="text-white font-bold  block text-[16px]">
                    Invitation
                  </span>
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
                          />
                        ))}
                      </div>
                      <span className="text-white block text-center  font-roboto font-bold text-[15px]">
                        5.0
                      </span>
                    </div>
                  </div>
                  <button>
                    <img src="/images/massege-rounded.svg" alt="" />
                  </button>
                </div>
                <div className="grid gap-[10px] mt-4 grid-cols-4">
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
                <div className="grid gap-[10px] mt-4 sm:mt-[14px] grid-cols-4">
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
            <div className="w-full flex items-end justify-between px-2 sm:px-5 gap-[21px]">
              <div className="w-full mx-auto flex flex-row justify-center items-center mt-3">
                <div className="max-w-[50%] w-[100%] text-center">
                  <button className="font-roboto font-bold text-[16px] text-white px-7 py-[3px] border rounded-[25px] border-[#02227E] bg-[#E04A22]">
                    Cancel
                  </button>
                </div>
                <div className="max-w-[50%] w-[100%] text-center">
                  <button
                    onClick={() => navigateToviewall()}
                    className="font-roboto font-bold text-[16px] text-white px-7 py-[3px] border rounded-[25px] border-white bg-[#02227E]"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default PastInvitations;
