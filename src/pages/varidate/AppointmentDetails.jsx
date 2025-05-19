import React, { useCallback, useEffect, useState } from "react";
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
import Loading from "../../components/Loading/Index";
import PageTitle from "../../components/PageTitle";

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
                  {loading ? <div className="flex items-center	justify-center ">
                    <Loading />
                  </div> : "Deny"}
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

  useEffect(() => {
    if (UserData?._id) {
      dispatch(HandleUpdateFollowers(UserData?._id))
    }
  }, []);

  const [followLoading, setFollowLoading] = useState(false);

  const isFollowed = useCallback(
    (id) => {
      let result = UserData?.followers?.find((item) => item?.userId === id || item?._id === id);
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
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle isSmall={true} title={"Past Appointment"} />
      </div>

      <div className="w-full">

        <div className="w-full flex flex-row sm:justify-around justify-between items-end mt-[110px] sm:p-[16px] sm:bg-[#FFFFFF0A] rounded-[16px]">
          <div className="flex flex-col items-center justify-center sm:min-w-[120px] min-w-[80px]">
            <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
              VAIRIFY ID
            </div>
            <div className="font-bold sm:text-lg text-base text-white uppercase">
              {userType === "client-hobbyist"
                ? appointment?.["companionId"]?.vaiID
                : appointment?.["clientId"]?.vaiID}
            </div>
          </div>
          <div className=" relative">
            <div
              className="sm:h-[120px] h-[80px] sm:w-[120px] w-[80px] rounded-full mt-[-74px] relative flex justify-center"
            >

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
                    : appointment?.[
                      userType === "client-hobbyist"
                        ? "companionId"
                        : "clientId"
                    ]?.gender === "Male"
                      ? "/images/male.png"
                      : "/images/female.png"
                }
                alt="Intimate Massage"
                className="sm:w-[120px] w-[80px] sm:h-[120px] h-[80px] bg-[#fff] rounded-full border-2 overflow-hidden object-cover"
              />
              <div
                style={{ right: "0px", bottom: "0px" }}
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
            <div className="flex-col flex justify-center items-center mt-[24px]">
              <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
                Name
              </div>
              <span className="font-bold sm:text-lg text-base text-white">
                {
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.name
                }
              </span>
            </div>
          </div>
          <div className="leading-[18px] sm:min-w-[120px] min-w-[80px] flex flex-col justify-center items-center">
            <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
              TruRevu
            </div>
            <div className="flex justify-center items-center gap-1">
              <div className="sm:text-lg text-base text-white font-bold ">
                {(
                  appointment?.[
                    userType === "client-hobbyist" ? "companionId" : "clientId"
                  ]?.averageRating || 0
                ).toFixed(1)}
              </div>
              <img src="/images/home/star.svg" alt="star" />
            </div>
          </div>
        </div>

        <div className="text-lg font-medium text-white my-[24px]">Past Booking Details</div>
        <div className="bg-[#FFFFFF14] rounded-[16px] p-[16px] flex flex-col gap-[8px]">
          <div className="flex justify-between items-center ">
            <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Date/Time</div>
            <p className="font-medium sm:text-base text-sm text-white">
              {moment(appointment?.startDateTime).format(
                "MM/DD/YY hh:mmA"
              ) || '-'}</p>
          </div>
          <div className="flex justify-between items-center ">
            <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Services</div>
            <p className="font-medium sm:text-base text-sm text-white">
              {appointment?.service?.servicesName || '-'}
            </p>
          </div>
          <div className="flex justify-between items-center ">
            <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Durations</div>
            <p className="font-medium sm:text-base text-sm text-white">
              {(appointment?.duration || 0) / 60} hr(s)
            </p>
          </div>
          <div className="flex justify-between items-center ">
            <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Rate</div>
            <p className="font-medium sm:text-base text-sm text-white">
              ${appointment?.agreedPrice || 0}
            </p>
          </div>
          <div className="flex justify-between items-center ">
            <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Extra’s</div>
            <p className="font-medium sm:text-base text-sm text-white">
              {appointment?.extras
                ?.map(
                  (item) => `${item?.servicesName} - $${item?.amount}`
                )
                .join(", ") || '-'}
            </p>
          </div>
          <div className="flex justify-between items-center ">
            <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">VAI-CHECK</div>
            <p className="font-medium sm:text-base text-sm text-white">
              {appointment?.location?.city} -{" "}
              {appointment?.location?.country}
            </p>
          </div>
        </div>

        <div className="text-lg font-medium text-white my-[24px]">
          {
            appointment?.[
              userType === "client-hobbyist"
                ? "companionId"
                : "clientId"
            ]?.name
          }{" "}
          Details
        </div>
        <div className="bg-[#FFFFFF14] rounded-[16px] p-[16px] flex flex-col gap-[8px]">
          <div className="flex justify-between items-center ">
            <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Gender</div>
            <p className="font-medium sm:text-base text-sm text-white">
              {
                appointment?.[
                  userType === "client-hobbyist"
                    ? "companionId"
                    : "clientId"
                ]?.gender
              }
            </p>
          </div>
          <div className="flex justify-between items-center ">
            <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">VAIRIFY ID</div>
            <p className="font-medium sm:text-base text-sm text-white uppercase">
              {
                appointment?.[
                  userType === "client-hobbyist"
                    ? "companionId"
                    : "clientId"
                ]?.vaiID
              }
            </p>
          </div>
          <div className="flex justify-between items-center ">
            <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Total Offered for this appointment</div>
            <p className="font-medium sm:text-base text-sm text-white ">
              ${appointment?.agreedPrice || 0}
            </p>
          </div>
        </div>


        {/* old */}

        <div className="w-full">
          <div className="inner-content-part-country w-full pb-20">

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
                <div className="flex justify-center mt-[24px]">
                  <Button
                    disabled={loading}
                    onClick={() => approveCancelAppointment(appointment._id)}
                    className="max-w-[500px] mx-auto"
                    text={loading ? <div className="flex items-center	justify-center">
                      <Loading />
                    </div> : "Approve Cancellation"}
                  />
                </div>
              ) : (
                <div className="flex justify-center mt-[24px]">
                  <Button
                    disabled={loading}
                    onClick={() => cancelAppointment(appointment._id)}
                    className="max-w-[500px] mx-auto"
                    text={loading ? <div className="flex items-center	justify-center">
                      <Loading />
                    </div> : "Request Cancellation"}
                  />
                </div>
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
