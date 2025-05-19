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
import { IoCloseCircleOutline } from "react-icons/io5";
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
        <div className="fixed inset-0 overflow-y-auto rounded-2xl z-[10000000000000] flex items-center justify-center w-full">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black opacity-30"
          />
          <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center sm:p-[24px] p-[16px] bg-[white] w-[90%] mx-auto max-w-[500px] rounded-2xl relative">
            {/* <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div> */}

            {/* <span className="hidden sm:inline-block sm:align-top sm:h-screen" aria-hidden="true">&#8203;</span> */}

            <div className="w-full">
              <button onClick={onClose} className="absolute sm:right-[24px] right-[16px] sm:top-[20px] top-[12px] p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              >
                <IoCloseCircleOutline size={26} />
              </button>
              <div className="w-full">
                <div className="text-center">
                  <h3 className="text-[20px] text-center font-medium text-[#212B36]">
                    Would you like to write <br />{" "}
                    {appointment?.clientId?.name} a message
                  </h3>
                  <div className="mt-5 w-full">
                    <textarea
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      className="w-full text-[14px] text-black px-[12px] py-[6px] rounded-lg bg-transparent border-2"
                      rows={4}
                      placeholder="Comments"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full mt-[24px]">
                <button
                  disabled={loading}
                  onClick={() => cancelAppointment(appointment._id)}
                  type="button"
                  className="justify-center w-full rounded-lg border-none bg-[#E43530] py-[11px] px-[16px] text-base font-medium text-white hover:bg-[#060C4D] focus:outline-none focus:ring-0 flex items-center"
                >
                  {loading ? <div className="flex items-center	justify-center">
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

export default function UpcomingBookingDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [followLoading, setFollowLoading] = useState(false);
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const location = useLocation();
  const dispatch = useDispatch();
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

  const rate = (data) =>
    (data || []).reduce((total, item) => total + item.rating, 0) /
    ((data || []).length || 1);


  useEffect(() => {
    if (UserData?._id) {
      dispatch(HandleUpdateFollowers(UserData?._id))
    }
  }, []);

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

  const status =
    appointment?.[
    userType === "client-hobbyist" ? "clientStatus" : "companionStatus"
    ];


  return (
    <div className="container mb-[48px]">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle isSmall={true} title={"Booking Details"} />
      </div>
      <div className="w-full flex flex-row justify-around items-end mt-[102px] p-[16px] bg-[#FFFFFF0A] rounded-[16px]">
        <div className="flex flex-col items-center justify-center sm:min-w-[120px] min-w-[80px]">
          <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
            VAIRIFY ID
          </div>
          <div className="font-bold text-lg text-white uppercase">
            {userType === "client-hobbyist"
              ? appointment?.["companionId"]?.vaiID
              : appointment?.["clientId"]?.vaiID}
          </div>
        </div>
        <div className=" relative sm:min-w-[120px] min-w-[80px]">
          <div
            className="h-[120px] w-[120px] rounded-full mt-[-74px] relative"
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
              className="w-[120px] h-[120px] rounded-full object-cover border-[4px] border-white"
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
            <span className="font-bold text-lg text-white">
              {
                appointment?.[
                  userType === "client-hobbyist" ? "companionId" : "clientId"
                ]?.name
              }
            </span>
          </div>
        </div>
        <div className="leading-[18px] sm:min-w-[120px] min-w-[80px]">
          <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
            TruRevu
          </div>
          <div className="flex justify-center items-center gap-1">
            <div className="text-lg text-white font-bold ">
              {rate(
                appointment?.[
                  userType === "client-hobbyist" ? "companionId" : "clientId"
                ]?.reviews
              ) === 0
                ? rate(
                  appointment?.[
                    userType === "client-hobbyist"
                      ? "companionId"
                      : "clientId"
                  ]?.reviews
                )
                : rate(
                  appointment?.[
                    userType === "client-hobbyist"
                      ? "companionId"
                      : "clientId"
                  ]?.reviews
                ).toFixed(1)}
            </div>
            <img src="/images/home/star.svg" alt="star" />
          </div>
        </div>
      </div>

      <div className="mt-[24px] flex justify-between items-center">
        <div className="text-lg font-medium text-white">Upcoming Requests</div>
        <div className={`font-bold text-sm py-[4px] px-[8px] rounded-[8px] ${status === "Scheduled"
          ? "text-[#008F34] bg-[#008F3429]"
          : status === "Rejected"
            ? "text-[#E43530] bg-[#E4353029]"
            : "text-white"
          }`}>
          {status}{" "}
          Request
        </div>
      </div>

      <div className="bg-[#FFFFFF14] rounded-[16px] p-[16px] mt-[24px]">
        <div className="flex justify-between items-center">
          <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Date/Time</div>
          <p className="font-medium sm:text-base text-sm text-white"> {moment(appointment?.startDateTime).format("MM/DD/YY hh:mmA") || '-'}</p>
        </div>
        <div className="flex justify-between items-center mt-[8px]">
          <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Services</div>
          <p className="font-medium sm:text-base text-sm text-white"> {appointment?.service?.servicesName || '-'}</p>
        </div>
        <div className="flex justify-between items-center mt-[8px]">
          <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Durations</div>
          <p className="font-medium sm:text-base text-sm text-white">{(appointment?.duration || 0) / 60} hr(s)</p>
        </div>
        <div className="flex justify-between items-center mt-[8px]">
          <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Rate</div>
          <p className="font-medium sm:text-base text-sm text-white"> ${appointment?.agreedPrice || 0}</p>
        </div>
        <div className="flex justify-between items-center mt-[8px]">
          <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Extra’s</div>
          {console.log(moment().isAfter(
            moment(appointment?.startDateTime).subtract(2, "hours")
          ))}
          <p className="font-medium sm:text-base text-sm text-white">  {appointment?.extras?.map((item) => `${item?.servicesName} - $${item?.amount}`).join(", ") || '-'}</p>
        </div>
        <div className="flex justify-between items-center mt-[8px]">
          <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">VAI CHECK</div>
          {moment().isAfter(
            moment(appointment?.startDateTime).subtract(2, "hours")
          ) && (
              <div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${appointment?.location?.lat},${appointment?.location?.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium sm:text-base text-sm text-white"
                >
                  {appointment?.location?.address || '-'}
                </a>
              </div>
            )}
        </div>
      </div>

      <div className="text-lg font-medium text-white mt-[24px]">{
        appointment?.[
          userType === "client-hobbyist"
            ? "companionId"
            : "clientId"
        ]?.name
      }{" "}
        Details</div>
      <div className="bg-[#FFFFFF14] rounded-[16px] p-[16px] mt-[24px]">
        <div className="flex justify-between items-center ">
          <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Gender</div>
          <p className="font-medium sm:text-base text-sm text-white"> {appointment?.[userType === "client-hobbyist" ? "companionId" : "clientId"]?.gender}</p>
        </div>
        <div className="flex justify-between items-center mt-[8px]">
          <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">VAIRIFY ID</div>
          <p className="font-medium sm:text-base text-sm text-white">  {appointment?.[userType === "client-hobbyist" ? "companionId" : "clientId"]?.vaiID}</p>
        </div>
        <div className="flex justify-between items-center mt-[8px]">
          <div className="text-white opacity-[0.6] sm:text-base text-sm font-normal">Remark</div>
          <p className="font-medium sm:text-base text-sm text-white">  Agreed Rate for this Appointment</p>
        </div>
      </div>

      <div className="w-full mx-auto flex flex-col justify-center items-center">

        <div className="pb-[48px] w-full">

          {appointment?.from !== "vai-now" &&
            (userType !== "client-hobbyist" ? (
              appointment?.companionStatus !== "Signed" &&
                appointment?.clientStatus === "Signed" ? (
                <div className="w-full mx-auto flex justify-center items-center mt-[24px] ">
                  <Button
                    onClick={() => navigateToesign()}
                    text="Sign"
                    className={'py-[5px] max-w-[500px]'}
                    size="40px"
                  />
                </div>
              ) : appointment?.companionStatus === "Scheduled" &&
                appointment?.clientStatus === "Scheduled" ? null : (
                appointment?.clientStatus !== "Cancel" && (
                  <div className="mx-auto flex flex-row justify-center items-center mt-[24px] w-full gap-[8px]">
                    <Button
                      onClick={() => navigateToesign()}
                      text="Approve"
                      className={
                        " w-full"
                      }
                    />
                    <Button
                      onClick={() => navigateToModify()}
                      text="Modify"
                      className={
                        "secondary-btn  !bg-[#FFFFFF29] w-full"
                      }
                    />
                    <Button
                      text="Deny"
                      onClick={handleOpenDenyModal}
                      className={
                        "secondary-btn  !bg-[#E43530] w-full"
                      }
                    />
                  </div>
                )
              )
            ) : (
              (appointment?.companionStatus === "Signed" ||
                appointment?.companionStatus === "Modified") && (
                <div className="w-full mx-auto flex flex-row justify-center items-center mt-[24px] ">
                  <Button
                    onClick={() => navigateToesign()}
                    text="E-sign"
                    className={'py-[5px] max-w-[500px]'}
                    size="40px"
                  />
                </div>
              )
            ))}

          {isScheduled &&
            ((appointment?.cancellationRequested &&
              appointment?.cancellationRequestedBy !== userType) ||
              !appointment?.cancellationRequested) &&
            (appointment?.cancellationRequested ? (
              <Button
                disabled={loading}
                onClick={() => approveCancelAppointment(appointment._id)}
                className={'py-[5px] max-w-[500px] mt-[24px]'}
                size="40px"
                text={loading ? <div className="flex items-center	justify-center">
                  <Loading />
                </div> : "Approve Cancellation"}
              />
            ) : moment(appointment?.startDateTime).isBefore(moment()) ? (
              <></>
            ) : (
              appointment.type !== "vairify-now" && (
                <div className="flex justify-center ">
                   
                <Button
                  disabled={loading}
                  onClick={() => cancelAppointment(appointment._id)}
                  className={' max-w-[500px] mt-[24px] !mx-auto !bg-red-500 secondary-btn hover:!bg-red-600'}
                  text={loading ? <div className="flex items-center	justify-center">
                    <Loading />
                  </div> : "Request Cancellation"}
                />
              </div>
              )
            ))}
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
