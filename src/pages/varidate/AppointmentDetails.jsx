import React, { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import VaridateService from "../../services/VaridateServices";
import { toast } from "react-toastify";
import MyVairifyService from "../../services/MyVairifyService";
import { HandleUpdateFollowers } from "../../redux/action/Auth";

const Modal = ({ isOpen, onClose, appointment, UserDetails }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      await VaridateService.updateAppointment(UserDetails._id, appointmentId, {
        companionStatus: "Rejected",
        rejectionMessage: message,
      });
      onClose();
      navigate("/varidate/invitations-list");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {isOpen ? (
        <div className="fixed z-10 inset-0 overflow-y-auto rounded-2xl">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div> */}

            {/* <span className="hidden sm:inline-block sm:align-top sm:h-screen" aria-hidden="true">&#8203;</span> */}

            <div className="bg-gradient-to-t w-full from-[#0247FF] to-[#316AFF] inline-block align-middle bg-[white] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-white">
                      Would you like to write <br />{" "}
                      {appointment?.clientId?.name} a message
                    </h3>
                    <div className="mt-2">
                      <textarea
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        className="w-full rounded-2xl"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 mb-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center flex">
                <button
                  disabled={loading}
                  onClick={() => cancelAppointment(appointment._id)}
                  type="button"
                  className="w-32 inline-flex justify-center rounded-full border border-transparent  bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm h-[32px]"
                >
                  {loading ? "Loading.." : "Deny"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default function AppointmentDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const location = useLocation();
  const appointment = location.state;

  const userType = UserData.user_type;
  const isScheduled =
    appointment?.clientStatus === "Scheduled" ||
    appointment?.companionStatus === "Scheduled";
  const handleOpenDenyModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigateToesign = () => {
    navigate("/varidate/esign-send", { state: appointment });
  };

  const navigateToModify = () => {
    navigate(`/varidate/change-appointment-date/${appointment._id}`);
  };


  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      await VaridateService.updateAppointment(UserData._id, appointmentId, {
        cancellationRequested: true,
        cancellationRequestedBy: userType,
      });
      navigate("/marketplace");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const approveCancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      await VaridateService.updateAppointment(UserData._id, appointmentId, {
        companionStatus: "Cancel",
        clientStatus: "Cancel",
      });
      navigate("/marketplace");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const [followLoading, setFollowLoading] = useState(false);

  const isFollowed = useCallback(
    (id) => {
      let result = UserData?.followers?.find((item) => item?.userId === id);
      if (result) {
        return true;
      } else {
        return false;
      }
    },
    [UserData]
  );

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      if (
        isFollowed(
          userType === "client-hobbyist"
            ? appointment?.["companionId"]?._id
            : appointment?.["clientId"]?._id
        )
      ) {
        await MyVairifyService.removeFollow(
          userType === "client-hobbyist"
            ? appointment?.["companionId"]?._id
            : appointment?.["clientId"]?._id,
          { userId: UserData?._id }
        );
        dispatch(HandleUpdateFollowers(UserData?._id));
        toast.success("Successfully unfollowed!");
      } else {
        await MyVairifyService.addFollow(
          userType === "client-hobbyist"
            ? appointment?.["companionId"]?._id
            : appointment?.["clientId"]?._id,
          { userId: UserData?._id }
        );
        await dispatch(HandleUpdateFollowers(UserData?._id));
        toast.success("Successfully followed!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to follow!");
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="main-container px-0">
      <div className="w-full mx-auto flex flex-col justify-center items-center pb-6">
        <div className="w-full mx-auto flex flex-row justify-between items-start mt-2 px-[10px]">
          <div className="flex flex-col items-center justify-center">
            <div>
              <span className="text-[18px] text-[#040C50] font-extrabold">
                VAI
                <span className="text-[18px] text-[#040C50] font-semibold">
                  RIFY ID
                </span>
              </span>
            </div>
            <div>
              <span className="text-[15px] text-[#040C50] font-bold">
                {userType === "client-hobbyist"
                  ? appointment?.["companionId"]?.vaiID
                  : appointment?.["clientId"]?.vaiID}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "-6px", bottom: "65px" }}
              className="absolute w-full h-full rounded-full"
            >
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden">
                <img
                  src={
                    appointment?.[
                      userType === "client-hobbyist"
                        ? "companionId"
                        : "clientId"
                    ]?.profilePic
                      ? 
                      import.meta.env.VITE_APP_S3_IMAGE +
                      `/${appointment?.[
                        userType === "client-hobbyist"
                          ? "companionId"
                          : "clientId"
                      ]?.profilePic
                      }`
                      // import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                      // `/${appointment?.[
                      //   userType === "client-hobbyist"
                      //     ? "companionId"
                      //     : "clientId"
                      // ]?.profilePic
                      // }`
                      : appointment?.[
                        userType === "client-hobbyist"
                          ? "companionId"
                          : "clientId"
                      ]?.gender === "Male"
                        ? "/images/male.png"
                        : "/images/female.png"
                  }
                  // src={'/images/IntimateMassage.png'}
                  alt="Intimate Massage"
                />
              </div>
            </div>
            <div
              style={{ right: "6px", top: "20px" }}
              className="absolute"
              onClick={() => {
                followLoading ? null : handleFollow();
              }}
            >
              {followLoading ? (
                <div
                  className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                ></div>
              ) : (
                <img
                  src={"/images/SugarIcon2.png"}
                  alt="Sugar Icon Second"
                  className={`${isFollowed(
                    userType === "client-hobbyist"
                      ? appointment?.["companionId"]?._id
                      : appointment?.["clientId"]?._id
                  )
                      ? ""
                      : "grayscale"
                    }`}
                />
              )}
            </div>
          </div>
          <div>
            <div>
              <span className="text-[18px] text-[#040C50] font-bold">
                TruRevu
              </span>
            </div>
            {/* TODO: make this dynamic when we implement trureview */}
            <div className="flex flex-row justify-center items-center">
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating >= 1
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating >= 2
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating >= 3
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating >= 4
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating >= 5
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <span className="text-[15px] text-[#040C50] font-bold">
                {(
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating || 0
                ).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
          <span className="font-bold text-[24px]">
            {
              appointment?.[
                userType === "client-hobbyist" ? "companionId" : "clientId"
              ]?.name
            }
          </span>
        </div>

        <div className="w-full flex flex-col items-center mt-2 bg-[#797E9E] py-2 px-[10px]">
          <span className="font-bold text-[26px] text-[#040C50]">
            Past Appointments
          </span>
        </div>
        <div className="w-full">
          <div className="inner-content-part-country w-full pb-20">
            <div className="w-full mx-auto flex flex-col justify-center items-center mt-4 px-[10px]">
              <div className="w-full mx-auto flex flex-row justify-center items-center">
                <span className="font-extrabold text-[22px]">
                  Past Booking Details
                </span>
              </div>
              <div className="w-full mx-auto flex flex-row justify-between items-center px-2 mt-4">
                <div>
                  <span className="font-bold text-[14px] text-[#0247FF]">
                    Date/Time
                  </span>
                </div>
                <div>
                  <span className="font-normal text-[14px]">
                    {moment(appointment?.startDateTime).format(
                      "MM/DD/YY hh:mmA"
                    )}
                  </span>
                </div>
              </div>
              <div
                style={{ border: "1px solid white" }}
                className="w-full mt-2"
              ></div>
              <div className="w-full mx-auto flex flex-row justify-between items-center px-2 mt-4">
                <div className="flex flex-row justify-center items-center">
                  <div>
                    <span className="font-bold text-[16px] text-[#0247FF] mr-2">
                      Service
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-[14px]">
                      {appointment?.service?.servicesName}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row justify-center items-center">
                  <div>
                    <span className="font-bold text-[16px] text-[#0247FF] mr-2">
                      Duration
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-[14px]">
                      {(appointment?.duration || 0) / 60} hr(s)
                    </span>
                  </div>
                </div>
                <div className="flex flex-row justify-center items-center">
                  <div>
                    <span className="font-bold text-[16px] text-[#0247FF] mr-2">
                      Rate
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-[14px]">
                      ${appointment?.agreedPrice || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{ border: "1px solid white" }}
                className="w-full mt-2"
              ></div>
              <div className="w-full mx-auto flex flex-row justify-between items-center px-2 mt-4">
                <div>
                  <span className="font-bold text-[14px] text-[#0247FF]">
                    Extra's
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[14px]">
                    {appointment?.extras
                      ?.map(
                        (item) => `${item?.servicesName} - $${item?.amount}`
                      )
                      .join(", ")}
                  </span>
                </div>
              </div>
              <div
                style={{ border: "1px solid white" }}
                className="w-full mt-2"
              ></div>
              <div className="w-full mx-auto flex flex-row justify-between items-center px-2 mt-4">
                <div>
                  <span className="font-bold text-[14px] text-[#0247FF]">
                    {appointment?.type}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[14px]">
                    {appointment?.location?.city} -{" "}
                    {appointment?.location?.country}
                  </span>
                </div>
              </div>
              <div
                style={{ border: "1px solid white" }}
                className="w-full mt-2"
              ></div>
            </div>
            <div className="w-full mx-auto flex flex-col justify-center items-center mt-4 px-[10px]">
              <div className="w-full mx-auto flex flex-row justify-center items-center">
                <span className="font-extrabold text-[22px]">
                  {
                    appointment?.[
                      userType === "client-hobbyist"
                        ? "companionId"
                        : "clientId"
                    ]?.name
                  }{" "}
                  Details
                </span>
              </div>
              <div className="w-full mx-auto flex flex-row justify-between items-center px-2 mt-4">
                <div>
                  <span className="font-bold text-[16px] text-[#0247FF]">
                    Gender
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[16px]">
                    {
                      appointment?.[
                        userType === "client-hobbyist"
                          ? "companionId"
                          : "clientId"
                      ]?.gender
                    }
                  </span>
                </div>
              </div>
              <div
                style={{ border: "1px solid white" }}
                className="w-full mt-2"
              ></div>
              <div className="w-full mx-auto flex flex-row justify-between items-center px-2 mt-4">
                <div>
                  <span className="font-extrabold uppercase text-[16px] text-[#0247FF]">
                    VAI<span className="logoSetupweight">RIFY ID</span>
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[17px] text-[#0247FF]">
                    {
                      appointment?.[
                        userType === "client-hobbyist"
                          ? "companionId"
                          : "clientId"
                      ]?.vaiID
                    }
                  </span>
                </div>
              </div>
              {/* <div style={{border: '1px solid white'}} className='w-full mt-2'></div>
                    <div className='w-full mx-auto flex flex-row justify-between items-center px-2 mt-4'>
                        <div><span className='font-bold text-[16px] text-[#0247FF]'>VAIRIDATE #</span></div>
                        <div><span className='font-bold text-[16px] text-[#0247FF]'>0046893490</span></div>
                    </div> */}
              <div
                style={{ border: "1px solid white" }}
                className="w-full mt-2"
              ></div>
              <div className="w-full mx-auto flex flex-row justify-between items-center px-2 mt-4">
                <div>
                  <span className="font-bold text-[16px]">
                    Agreed Rate for this Appointment
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[16px]">
                    ${appointment?.agreedPrice || 0}
                  </span>
                </div>
              </div>
              <div
                style={{ border: "1px solid white" }}
                className="w-full mt-2"
              ></div>
            </div>
            {appointment?.from !== "vai-now" &&
              moment(appointment?.startDateTime).isAfter(moment()) &&
              (userType !== "client-hobbyist" ? (
                appointment?.companionStatus !== "Signed" &&
                  appointment?.clientStatus === "Signed" ? (
                  <div className="w-full mx-auto flex flex-row justify-center items-center mt-14 px-[30px]">
                    <div className="w-[104px] mr-2 mb-2">
                      <Button
                        onClick={() => navigateToesign()}
                        text="Sign"
                        className={
                          "rounded-[20px] bg-[#13A307] border-2 border-[#02227E] font-extrabold text-[16px] text-[#02227E]"
                        }
                        size="33px"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full mx-auto flex flex-row justify-between items-center mt-14 px-[30px]">
                    <div className="w-[104px] mr-2 mb-2">
                      <Button
                        onClick={() => navigateToesign()}
                        text="Approve"
                        className={
                          "rounded-[20px] bg-[#13A307] border-2 border-[#02227E] font-extrabold text-[16px] text-[#02227E]"
                        }
                        size="33px"
                      />
                    </div>
                    <div className="w-[104px] mr-2 mb-2">
                      <Button
                        onClick={() => navigateToModify()}
                        text="Modify"
                        className={
                          "rounded-[20px] bg-[#FFC020] border-2 border-[#02227E] font-extrabold text-[16px] text-[#02227E]"
                        }
                        size="33px"
                      />
                    </div>
                    <div className="w-[104px] mb-2">
                      <Button
                        text="Deny"
                        onClick={handleOpenDenyModal}
                        className={
                          "rounded-[20px] bg-[#DB3002] border-2 border-[#02227E] font-extrabold text-[16px] text-[#02227E]"
                        }
                        size="33px"
                      />
                    </div>
                  </div>
                )
              ) : (
                (appointment?.companionStatus === "Signed" ||
                  appointment?.companionStatus === "Modified") && (
                  <div className="w-full mx-auto flex flex-row justify-center items-center mt-14 px-[30px]">
                    <div className="w-[104px] mr-2 mb-2">
                      <Button
                        onClick={() => navigateToesign()}
                        text="E-sign"
                        className={
                          "rounded-[20px] bg-[#13A307] border-2 border-[#02227E] font-extrabold text-[16px] text-[#02227E]"
                        }
                        size="33px"
                      />
                    </div>
                  </div>
                )
              ))}

            {isScheduled &&
              moment(appointment?.startDateTime).isAfter(moment()) &&
              ((appointment?.cancellationRequested &&
                appointment?.cancellationRequestedBy !== userType) ||
                !appointment?.cancellationRequested) &&
              (appointment?.cancellationRequested ? (
                <button
                  disabled={loading}
                  onClick={() => approveCancelAppointment(appointment._id)}
                  className="mt-2 w-[90%] ms-6 font-roboto font-bold text-[16px]  px-2 py-[3px]  rounded-[10px]  text-white bg-[#E04A22] "
                >
                  {loading ? "Loading.." : "Approve Cancellation"}
                </button>
              ) : (
                <button
                  disabled={loading}
                  onClick={() => cancelAppointment(appointment._id)}
                  className="mt-2 w-[90%] ms-6 font-roboto font-bold text-[16px]  px-2 py-[3px]  rounded-[10px]  text-white bg-[#E04A22] "
                >
                  {loading ? "Loading..." : "Request Cancellation"}
                </button>
              ))}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        appointment={appointment}
        UserDetails={UserData}
      />
    </div>
  );
}
