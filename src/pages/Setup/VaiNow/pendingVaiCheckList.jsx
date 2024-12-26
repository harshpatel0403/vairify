import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import VaridateService from "../../../services/VaridateServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";

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
      <div className="main-container h-full">
        <div className="h-full flex justify-center items-center">
          <p>Loading...</p>
        </div>
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
      className="main-content py-4 rounded-2xl pb-[0px] bg-[#D5D6E0]"
      style={{ height: "calc(100vh - 149px)" }}
    >
      <div className="flex flex-col justify-between">
        <div className="mt-0 bg-[#040C50]/[26%] w-full ">
          <h2 className="font-extrabold py-2 text-[24px] mulish-font-family uppercase">
            Vai check
          </h2>
        </div>
        <div className="mt-[20px] items-center flex sm:flex-row flex-col gap-[26px] px-2 pb-8">
          <div className="">
            <div className="grid md:grid-cols-2 gap-4 w-full">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="sm:w-[100%] max-w-[440px] bg-[#3760CB] shadow-2xl py-[12px] rounded-[20px] border border-gray-100 h-[auto] min-h-[235px]"
                >
                  <div className="flex gap-2 sm:gap-4 pl-[10px] pr-[10px] items-center">
                    <div className="w-[25%] justify-center">
                      <img
                        src={
                          appointment?.[
                            userType == "client-hobbyist"
                              ? "companionId"
                              : "clientId"
                          ]?.profilePic
                            ? 
                            `${
                              import.meta.env
                                .VITE_APP_S3_IMAGE
                            }/${
                              appointment?.[
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
                    </div>
                    <div className="flex-1">
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
                      <div className="flex gap-2 sm:gap-4 pl-[10px] pr-[10px]">
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaiCheckList;
