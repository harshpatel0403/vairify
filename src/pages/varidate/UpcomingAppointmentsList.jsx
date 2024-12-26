/*global google*/
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import SelectBox_ from "../../components/SelectBox_";
import VaridateService from "../../services/VaridateServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import DateGuardService from "../../services/DateGuardService";
import CalendarService from "../../services/CalendarService";
import { fetchLocation } from "../../utils";
import { GoogleApiWrapper } from "google-maps-react";

const UpcomingAppointmentsList = (props) => {
  const navigate = useNavigate();
  const navigateToviewall = (appointment) => {
    navigate("/varidate/booking-details", { state: appointment });
  };
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [syncOptions] = useState(["Select", "Google", "Outlook", "Apple"]);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  console.log(UserDetails, " logged in user");

  const userType = UserDetails?.user_type; //'companion-provider'

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        const location = await fetchLocation();
        // setCurrentLocation(location);
        // Calculate distances automatically when current location is available
        calculateDistances(location);
      } catch (error) {
        console.error("Error fetching current location:", error);
      }
    };
    if (appointments?.length) {
      setLocationLoading(true);
      fetchCurrentLocation().finally(() => {
        setLocationLoading(false);
      });
    }
  }, [appointments]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const apts = await DateGuardService.getAppointments(UserDetails?._id);
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
        cancellationRequested: true,
        cancellationRequestedBy: userType,
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

  const onSelectSyncWith = async (value, eventId) => {
    // const selectedSync = event.targe.value
    if (value == "Google") {
      const syncRes = await CalendarService.syncGoogleEvents({
        userType: userType,
        isSingleEvent: true,
        eventId: eventId,
      });
      const link = document.createElement("a");
      link.href = syncRes.authorizationUrl;
      link.target = "_blank";
      console.log(link);
      link.click();
    } else if (value == "Outlook") {
      const syncRes = await CalendarService.syncMicrosoftEvents({
        userType: userType,
        isSingleEvent: true,
        eventId: eventId,
      });
      const link = document.createElement("a");
      link.href = syncRes.authorizationUrl;
      link.target = "_blank";
      console.log(link);
      link.click();
    } else return true;
  };

  const getDistance = async (currentLocation, lat, lng) => {
    const directionsService = new props.google.maps.DirectionsService();
    const origin = new props.google.maps.LatLng(
      parseFloat(currentLocation.latitude),
      parseFloat(currentLocation.longitude)
    );
    const destination = new props.google.maps.LatLng(
      parseFloat(lat),
      parseFloat(lng)
    );

    return new Promise((resolve, reject) => {
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: props.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === props.google.maps.DirectionsStatus.OK) {
            const route = result.routes[0];
            const distanceInMeters = route.legs[0].distance.value;
            const distanceInMiles = distanceInMeters * 0.000621371; // Conversion to miles
            resolve(distanceInMiles);
          } else {
            reject(`Error fetching directions: ${status}`);
          }
        }
      );
    });
  };

  const calculateDistances = async (currentLocation) => {
    const updatedDisabledButtons = {};

    for (const appointment of appointments) {
      const { _id, location } = appointment;
      try {
        const distance = await getDistance(
          currentLocation,
          location?.lat,
          location?.lng
        );
        console.log(distance);
        updatedDisabledButtons[_id] = distance > 1; // Disable button if distance is less than one mile
      } catch (error) {
        updatedDisabledButtons[_id] = true;
        console.error("Error calculating distance:", error);
      }
    }

    setDisabledButtons(updatedDisabledButtons);
  };

  return (
    <div
      className="main-content py-4 rounded-2xl pb-[10px] bg-[#D5D6E0]"
      style={{ maxHeight: "calc(100vh - 160px)" }}
    >
      <div className="flex flex-col justify-between">
        <div className="mt-2 bg-[#040C50]/[26%] w-full ">
          <h2 className="font-bold py-2 text-[24px] text-[#02227E] font-inter ">
            Upcoming Appointments
          </h2>
        </div>
        {!appointments?.length && (
          <div className="text-[32px] text-[#4b4b4b] font-bold text-center h-[430px] flex flex-col justify-center items-center">
            <div className="image-not">
              <img src="/images/notFound.png" alt="logo" />
            </div>
            Result not found
          </div>
        )}
        <div className="mt-[20px] px-2">
          <div className="grid md:grid-cols-2 gap-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="sm:w-[100%] max-w-[440px] bg-[#3760CB] py-[12px] rounded-[20px] border border-gray-100 h-[auto] min-h-[235px]"
              >
                <div className="flex gap-2 sm:gap-4 pl-[10px] pr-[10px]">
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
                            import.meta.env.VITE_APP_S3_IMAGE
                          }/${
                            appointment?.[
                              userType == "client-hobbyist"
                                ? "companionId"
                                : "clientId"
                            ]?.profilePic
                          }`
                          //  `${
                          //     import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL
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
                      className="w-[86px] h-[86px] max-w-[86px] max-h-[86px] min-w-[86px] min-h-[86px] rounded-full"
                      alt=""
                    />
                    <div className="mt-1 ">
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
                        }
                      </h6>
                      <h6 className="text-xs text-white font-roboto font-semibold">
                        ID #
                        {
                          appointment?.[
                            userType == "client-hobbyist"
                              ? "companionId"
                              : "clientId"
                          ]?.vaiID
                        }
                      </h6>
                      <div className="flex gap-1 mt-1 justify-center">
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
                    <div className="max-w-[100%] w-[100%] text-center">
                      <button
                        onClick={() =>
                          navigate("/user/profile", {
                            state: {
                              item: {
                                userId:
                                  appointment?.[
                                    userType == "client-hobbyist"
                                      ? "companionId"
                                      : "clientId"
                                  ],
                              },
                              market: true,
                            },
                          })
                        }
                        className="mt-3 font-roboto font-bold text-[12px] text-white px-1 py-[3px]  border rounded-[25px] border-white bg-[#02227E]"
                      >
                        View Profile
                      </button>

                      {/* <div>
                        <label className="mt-4 font-roboto font-bold text-[12px] text-white px-1 py-[3px]">
                          Sync With
                        </label>
                        <SelectBox_
                          className={"select-sync-options"}
                          options={syncOptions}
                          onChange={(e) => {
                            onSelectSyncWith(e.target.value, appointment._id);
                          }}
                        />
                      </div> */}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-around items-center">
                      {/* <button>
                      <img src="/images/phone-rounded.svg" />
                    </button> */}
                      <button
                        onClick={() =>
                          handleChatIcon(
                            appointment?.[
                              userType == "client-hobbyist"
                                ? "companionId"
                                : "clientId"
                            ]?._id
                          )
                        }
                        className="usergreydisabled"
                      >
                        <img src="/images/massege-rounded.svg" className="" />
                      </button>
                      <button
                        onClick={() => navigateToviewall(appointment)}
                        className="font-roboto font-extrabold text-[16px] text-white px-2 py-[3px] rounded-[10px] border-white bg-[#02227E]"
                      >
                        View VAI<span className='logoSetupweight'>RIDATE</span>
                      </button>
                    </div>
                    <div className="grid gap-[5px] mt-4 grid-cols-3">
                      <span className="font-roboto text-white text-[10px]">
                        Requested <br /> Appt/time
                      </span>
                      {/* <span className="font-roboto text-white text-[10px]">
                      Requested <br /> Appt/time
                    </span> */}
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
                        {moment(appointment?.startDateTime).format("hh:mmA")}-
                        {moment(appointment?.startDateTime)
                          .add(appointment?.duration, "minutes")
                          .format("hh:mmA")}
                      </span>
                      {/* <span className="font-roboto text-white text-[10px]">
                      1/28/23 <br /> 4:28pm
                    </span> */}
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
                    {Object.keys(disabledButtons).length > 0 &&
                      !disabledButtons[appointment._id] &&
                      !locationLoading && (
                        <button
                          // disabled={appointment?.lastMileInst}
                          // disabled={appointment?.[userType === 'client-hobbyist' ? 'clientStatus' : 'companionStatus'] === 'Cancel' || appointment?.companionStatus === 'Rejected' || appointment?.companionStatus === 'Signed'} onClick={() => cancelAppointment(appointment._id)}
                          onClick={() => {
                            navigate("/varidate/last-mile-instruction", {
                              state: appointment,
                            });
                          }}
                          className="mt-3 w-[90%] ms-6 font-roboto font-bold text-[16px]  px-2 py-[3px]  rounded-[10px] bg-[#08FA5A] text-[#02227E]"
                        >
                          Last Mile Directions
                        </button>
                      )}
                    <button
                      disabled={appointment?.cancellationRequested}
                      onClick={() => cancelAppointment(appointment._id)}
                      className="mt-2 w-[90%] ms-6 font-roboto font-bold text-[16px]  px-2 py-[3px]  rounded-[10px]  text-white bg-[#E04A22] "
                    >
                      {appointment?.cancellationRequested
                        ? "Cancellation Requested"
                        : "Request Cancellation"}
                    </button>
                  </div>
                </div>
                <div className="sync-data pl-[16px] pr-[10px]">
                  <p>Sync With</p>
                  <div className="sync-app">
                    <div
                      onClick={() =>
                        onSelectSyncWith("Google", appointment._id)
                      }
                      className={`font-roboto font-bold text-[16px] text-white px-4 py-[3px] rounded-[10px] border-white bg-[${
                        appointment?.ClientGCalSyncId ? "#555" : "#02227E"
                      }]`}
                    >
                      Google
                    </div>
                    <div
                      onClick={() =>
                        onSelectSyncWith("Outlook", appointment._id)
                      }
                      className={`font-roboto font-bold text-[16px] text-white px-4 py-[3px] rounded-[10px] border-white bg-[${
                        appointment?.ClientOCalSyncId ? "#555" : "#02227E"
                      }]`}
                    >
                      Outlooks
                    </div>
                  </div>
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: import.meta.env.VITE_APP_GOOGLEMAPS_KEY,
})(UpcomingAppointmentsList);
