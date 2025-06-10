import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import VaridateService from "../../../services/VaridateServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import Loading from "../../../components/Loading/Index";
import PageTitle from "../../../components/PageTitle";

const VaiCheckList = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  console.log(UserDetails, " logged in user");

  const userType = UserDetails?.user_type; //'companion-provider'

  const accpetAppt = (appointment) => {
    navigate("/varidate/face-verification", {
      state: { ...appointment, from: "vai-check" },
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
      state: { ...appointment, from: "vai-check" },
    });
  };
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const apts = await VaridateService.getVaiCheckAppointments(
        UserDetails._id
      );
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
      <div className="flex justify-center align-center items-center h-[25vh]">
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
    <div className="container lg:p-0 pb-[48px]">
      <div className=" lg:hidden block">

        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"VAI CHECK"} />
        </div>
      </div>
      {appointments.length > 0 ?
        (
          <div
            className="md:bg-[#FFFFFF0A] md:p-[16px] rounded-[16px] w-full"
          >
            <div className="flex flex-col justify-between">
              {/* <div className="mt-0 bg-[#040C50]/[26%] w-full ">
          <h2 className="font-extrabold py-2 text-[24px] mulish-font-family uppercase">
            Vai check
          </h2>
        </div> */}


              <div className="grid md:grid-cols-2 gap-[24px] w-full">
                {appointments.map((appointment) => {
                  const statusText =
                    userType === "client-hobbyist" && appointment?.clientStatus !== "Cancel"
                      ? appointment?.companionStatus
                      : appointment?.clientStatus;
                  return (
                    <div
                      key={appointment._id}
                      className="w-full bg-[#919EAB33] p-[16px] rounded-[16px] h-[auto] "
                    >

                      <div className="flex justify-between items-start">
                        <div className="flex gap-2">
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
                          <div>
                            <div className="font-medium sm:text-base text-sm text-white">
                              {
                                appointment?.[
                                  userType == "client-hobbyist"
                                    ? "companionId"
                                    : "clientId"
                                ]?.name
                              }
                            </div>
                            <p className="text-[#919EAB] font-normal sm:text-sm text-xs">
                              {
                                appointment?.[
                                  userType == "client-hobbyist"
                                    ? "companionId"
                                    : "clientId"
                                ]?.vaiID
                              }
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="flex gap-1 items-center">
                            <p className="text-base text-white font-bold m-0">
                              {
                                appointment?.[
                                  userType == "client-hobbyist"
                                    ? "companionId"
                                    : "clientId"
                                ]?.avgRating
                              }
                            </p>
                            <img src="/images/home/star.svg" alt="star" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-[16px]">
                        <div className="flex gap-3 justify-between items-center">
                          <div className="sm:text-sm text-xs text-white font-normal opacity-[0.6]">
                            VAI CHECK
                          </div>
                          <div className="font-medium text-white sm:text-sm text-xs uppercase">
                            {appointment?._id}
                          </div>
                        </div>
                        <div className="flex gap-3 justify-between items-center mt-[4px]">
                          <div className="sm:text-sm text-xs text-white font-normal opacity-[0.6]">
                            Request Appt/time
                          </div>
                          <div className="font-medium text-white sm:text-sm text-xs">
                            {moment(appointment?.startDateTime).format(
                              "MM/DD/YYYY"
                            )}{" "}
                            -
                            {moment(appointment?.startDateTime).format(
                              "hh:mmA"
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3 justify-between items-center  mt-[4px]">
                          <div className="sm:text-sm text-xs text-white font-normal opacity-[0.6]">
                            Elapsed Time
                          </div>
                          <div className="font-medium text-white sm:text-sm text-xs">
                            {appointment?.createdAt
                              ? moment(appointment?.createdAt).fromNow()
                              : " - "}
                          </div>
                        </div>
                        <div className="flex gap-3 justify-between items-center  mt-[4px]">
                          <div className="sm:text-sm text-xs text-white font-normal opacity-[0.6]">
                            Status
                          </div>
                          <div
                            className={`font-medium sm:text-sm text-xs ${statusText === "Sign Pending"
                              ? "text-[#FFC107]"
                              : statusText === "Scheduled"
                                ? "text-[#008F34]"
                                : statusText === "Rejected"
                                  ? "text-[#E43530]"
                                  : "text-white"
                              }`}
                          >
                            {statusText}
                          </div>
                        </div>
                        <div className="flex gap-2 sm:mt-[24px] mt-[16px]">
                          <div className="w-[100%] text-center">
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
                              text={" Profile"}
                              size={'36px'}
                              className={'py-[4px]'}
                            />
                            {/* View Profile */}
                            {/* </button> */}
                          </div>

                          <div className="w-[100%] text-center gap-3 flex flex-wrap justify-center">
                            {userType !== "client-hobbyist" &&
                              appointment?.companionStatus !== "Scheduled" &&
                              appointment?.companionStatus !== "Signed" &&
                              appointment?.companionStatus !== "Rejected" && (
                                <button
                                  // disabled={
                                  //   appointment?.companionStatus !== "Accepted" &&
                                  //   appointment?.companionStatus !== "Signed" &&
                                  //   appointment?.companionStatus !== "Scheduled"
                                  // }
                                  onClick={() => accpetAppt(appointment)}
                                  // className="w-full font-bold text-[16px] px-7 py-[3px]  rounded-[25px] border-white bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold change-font-family"
                                  className="w-full font-roboto font-bold text-[16px] text-white px-7 py-[6px] rounded-[8px] bg-[#008F34]"
                                >
                                  Accept
                                </button>
                              )}
                            {userType !== "client-hobbyist" &&
                              appointment?.companionStatus !== "Scheduled" &&
                              appointment?.companionStatus !== "Rejected" && (
                                <button
                                  // disabled={
                                  //   appointment?.companionStatus !== "Accepted" &&
                                  //   appointment?.companionStatus !== "Signed" &&
                                  //   appointment?.companionStatus !== "Scheduled"
                                  // }
                                  onClick={() => rejectAppt(appointment?._id)}
                                  className="w-full font-roboto font-bold text-[16px] text-white py-[6px] rounded-[8px] border-white bg-[#E43530]"
                                >
                                  Cancel
                                </button>
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
                                  className="py-[4px] !bg-transparent border-2 border-[#919EAB33] secondary-btn"
                                  text={'View'}
                                  size={'36px'}

                                />

                              )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:gap-4 items-center">
                        {/* <div className="w-[25%] justify-center">
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
                              // `${
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
                          className="w-[86px] h-[86px] min-w-[86px] min-h-[86px] max-w-[86px] max-h-[86px] rounded-full"
                          alt=""
                        />
                        <div className="mt-2">
                          <h6 className="text-xs text-white font-roboto font-semibold">
                            TruRevu
                          </h6>
                          <h6 className="text-xs text-white font-roboto font-semibold capitalize">
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
  
                          <div className="flex gap-1 items-start justify-center">
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
                          </div>
                        </div>
                      </div> */}
                        {/* <div className="flex-1">
                    <div className="flex justify-around">
                      <div className="text-part">
                        <h6 className="font-extrabold mb-0 text-[24px] mulish-font-family uppercase">
                          Vai check
                        </h6>
                        <p className="font-extrabold uppercase m-0 p-0">
                          {appointment?._id}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:gap-4 ">
                      <div className="flex-1">
                        <div className="grid gap-[5px] mt-4 grid-cols-3">
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
                        <div className="grid gap-[5px] mt-4 sm:mt-[14px] grid-cols-3">
                          <span className="font-roboto text-white text-[10px]">
                            {moment(appointment?.startDateTime).format(
                              "MM/DD/YYYY"
                            )}{" "}
                            <br />
                            {moment(appointment?.startDateTime).format(
                              "hh:mmA"
                            )}
                          </span>
                          <span className="font-roboto text-white text-[10px]">
                            {appointment?.createdAt
                              ? moment(appointment?.createdAt).fromNow()
                              : " - "}
                          </span>
                          <span className="font-roboto text-white text-[10px]">
                            {userType === "client-hobbyist" &&
                              appointment?.clientStatus !== "Cancel"
                              ? appointment?.companionStatus
                              : appointment?.clientStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex mt-4 gap-2">
                      <div className="w-[100%] text-center mt-3">
                        <button
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
                          className="w-full font-roboto font-bold text-[16px] text-white px-2 py-[3px]  border rounded-[25px] border-white bg-[#02227E]"
                        >
                          View Profile
                        </button>
                      </div>
  
                      <div className="w-[100%] text-center mt-3 gap-3 flex flex-wrap justify-center">
                        {userType !== "client-hobbyist" &&
                          appointment?.companionStatus !== "Scheduled" &&
                          appointment?.companionStatus !== "Signed" &&
                          appointment?.companionStatus !== "Rejected" && (
                            <button
                              // disabled={
                              //   appointment?.companionStatus !== "Accepted" &&
                              //   appointment?.companionStatus !== "Signed" &&
                              //   appointment?.companionStatus !== "Scheduled"
                              // }
                              onClick={() => accpetAppt(appointment)}
                              className="w-full font-bold text-[16px] px-7 py-[3px]  rounded-[25px] border-white bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold change-font-family"
                            >
                              Accept
                            </button>
                          )}
                        {userType !== "client-hobbyist" &&
                          appointment?.companionStatus !== "Scheduled" &&
                          appointment?.companionStatus !== "Rejected" && (
                            <button
                              // disabled={
                              //   appointment?.companionStatus !== "Accepted" &&
                              //   appointment?.companionStatus !== "Signed" &&
                              //   appointment?.companionStatus !== "Scheduled"
                              // }
                              onClick={() => rejectAppt(appointment?._id)}
                              className="w-full font-roboto font-bold text-[16px] text-white px-7 py-[3px]  rounded-[25px] border-white bg-[#DB3002]"
                            >
                              Cancel
                            </button>
                          )}
                        {(userType === "client-hobbyist" ||
                          appointment?.companionStatus === "Scheduled") && (
                            <button
                              // disabled={
                              //   appointment?.companionStatus !== "Accepted" &&
                              //   appointment?.companionStatus !== "Signed" &&
                              //   appointment?.companionStatus !== "Scheduled"
                              // }
                              onClick={() => navigateToviewall(appointment)}
                              className="w-full font-roboto font-bold text-[16px] text-white px-7 py-[3px]  border rounded-[25px] border-white bg-[#02227E]"
                            >
                              View
                            </button>
                          )}
                      </div>
                    </div>
                    {
                      appointment?.vaiCheckStatus?.[
                        userType === "client-hobbyist"
                          ? "clientStatus"
                          : "companionStatus"
                      ] === "Verified" ? (
                        <button
                          onClick={() =>
                            navigate("/varidate/post/review", {
                              state: appointment,
                            })
                          }
                          className="w-full font-roboto font-bold text-[16px] text-white px-7 py-[3px]  border rounded-[25px] border-white bg-[#02227E] mt-3 mb-4"
                          disabled={appointment?.[
                            userType == "client-hobbyist"
                              ? "companionId"
                              : "clientId"
                          ]?.reviews?.find(
                            (review) =>
                              review?.appointment === appointment?._id
                          )}
                        >
                          {appointment?.[
                            userType == "client-hobbyist"
                              ? "companionId"
                              : "clientId"
                          ]?.reviews?.find(
                            (review) =>
                              review?.appointment === appointment?._id
                          )
                            ? "Reviewed"
                            : "Post Review"}
                        </button>
                      ) : null
                      // appointment?.companionStatus === "Scheduled" && (
                      //   <button
                      //     onClick={() =>
                      //       navigate("/varidate/face-verification", {
                      //         state: {
                      //           ...appointment,
                      //           from: "vairifyNow",
                      //           for: "vaicheck",
                      //         },
                      //       })
                      //     }
                      //     className="w-full text-[16px] px-7 py-[3px]  rounded-[25px] border-white bg-[#02227E] mt-3 mb-4 bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold change-font-family"
                      //   >
                      //     VAI Check
                      //   </button>
                      // )
                    }
                    <div className="flex justify-between items-center"></div>
                  </div> */}
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
                                text={"Go to VAIRIDATE>>"}
                                className={
                                  "bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold shadow-l"
                                }
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>


            </div>
          </div>
        ) :
        (<>
          <div
            className="sm:bg-[#FFFFFF0A] sm:p-[16px] rounded-[16px] w-full"
          >
            <div className="text-[24px] text-[#ffffff] font-medium text-center h-[500px] flex flex-col justify-center items-center">
              <div className="image-not">
                <img src="/images/home/notfound.svg" alt="logo" className="mb-4" />
              </div>
              there are no appointments yet!!!
            </div>
          </div>
        </>)
      }

    </div>
  );
};

export default VaiCheckList;
