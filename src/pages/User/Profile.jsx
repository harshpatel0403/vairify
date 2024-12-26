import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import PersonalInformationBtn from "../../components/PersonalInformationBtn";
import Modal from "react-modal";
import InputText from "../../components/InputText";
import VaripayService from "../../services/VaripayServices";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import MyVairifyService from "../../services/MyVairifyService";
import { HandleUpdateFollowers } from "../../redux/action/Auth";
import { HandleGetServices } from "../../redux/action/Services";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state: userDetails } = useLocation();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  let TargetUserId = userDetails?.item?.userId?._id || userDetails?.item?._id;

  const [messageOpen, setMessageOpen] = useState(false);
  const [ammount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [message, setMessage] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [paymentRequestLoading, setPaymentRequestLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const userType =
    userDetails?.market || userDetails?.vairipay
      ? userDetails?.item?.userId?.user_type ||
      userDetails?.item?.user_type ||
      userDetails?.item?.userType
      : UserData.user_type;
  const EscortDetails = userDetails?.item?.userId || userDetails?.item?._id;

  const handleAmountChange = (e) => {
    const inputRegex = /^[0-9]*$/;

    if (inputRegex.test(e.target.value) || e.target.value === "") {
      setAmount(e.target.value);
      setAmountError("");
    } else {
      setAmountError("*Amount should be number only");
    }
  };

  const handelUserRequest = () => {
    if (!ammount && !message) {
      toast.error("Please enter amount and comments");
      return;
    } else if (!ammount) {
      toast.error("Please enter amount");
      return;
    } else if (!message) {
      toast.error("Please enter comments");
      return;
    }

    let body = {
      requester: UserData._id,
      targetUser: TargetUserId,
      amount: ammount,
      comment: message,
    };
    setPaymentRequestLoading(true);

    VaripayService.createUserVaripayRequest(body)
      .then((res) => {
        console.log("res: ", res);
        setMessageOpen(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.error || err.message);
      })
      .finally(() => {
        setPaymentRequestLoading(false);
      });
  };

  const closeMessage = () => {
    setMessageOpen(false);
  };

  const navigateToAboutMe = () => {
    const userDataForAboutPage =
      userDetails?.market || userDetails?.vairipay
        ? userDetails?.item?.userId || userDetails?.item
        : UserData;
    navigate("/settings/about-me", {
      state: {
        userData: userDataForAboutPage,
        isMarket: userDetails?.market || userDetails?.vairipay,
      },
    });
  };
  const navigateToTrurevu = () => {
    navigate("/varidate/reviews", {
      state: {
        vaiID:
          userDetails?.market || userDetails?.vairipay
            ? userDetails?.item?.userId?.vaiID || userDetails?.item?.vaiID
            : UserData?.vaiID,
        averageRating:
          userDetails?.market || userDetails?.vairipay
            ? userDetails?.item?.userId?.averageRating ||
            userDetails?.item?.averageRating
            : UserData?.averageRating,
        name:
          userDetails?.market || userDetails?.vairipay
            ? userDetails?.item?.userId?.name || userDetails?.item?.name
            : UserData?.name,
        userId:
          userDetails?.market || userDetails?.vairipay
            ? userDetails?.item?.userId?._id || userDetails?.item?._id
            : UserData?._id,
        profilePic:
          userDetails?.market || userDetails?.vairipay
            ? userDetails?.item?.userId?.profilePic ||
            userDetails?.item?.profilePic
            : UserData?.profilePic,
      },
    });
  };

  const navigateToUserGallery = () => {
    const usrDataForNextScreen =
      userDetails?.market || userDetails?.vairipay
        ? userDetails?.item?.userId || userDetails?.item
        : UserData;
    navigate("/user/gallery", {
      state: {
        userId: usrDataForNextScreen?._id,
        user: usrDataForNextScreen,
      },
    });
  };

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      if (
        isFollowed(userDetails?.item?.userId?._id || userDetails?.item?._id)
      ) {
        await MyVairifyService.removeFollow(
          userDetails?.item?.userId?._id || userDetails?.item?._id,
          {
            userId: UserData?._id,
          }
        );
        dispatch(HandleUpdateFollowers(UserData?._id));
        toast.success("Successfully unfollowed!");
      } else {
        await MyVairifyService.addFollow(
          userDetails?.item?.userId?._id || userDetails?.item?._id,
          {
            userId: UserData?._id,
          }
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

  // const rate = (userDetails?.item?.userId?.reviews || []).reduce((total, item) => total + item.rating, 0) / ((userDetails?.item?.userId?.reviews || []).length || 1)
  const rate =
    userDetails?.market || userDetails?.vairipay
      ? userDetails?.item?.userId?.averageRating ||
      userDetails?.item?.averageRating
      : UserData?.averageRating;

  const isFollowed = useCallback(
    (id) => {
      let result = UserData?.followers?.find(
        (item) => item?.userId === id || item?._id === id
      );
      if (result) {
        return true;
      } else {
        return false;
      }
    },
    [UserData]
  );

  useEffect(() => {
    dispatch(
      HandleGetServices(
        userDetails?.market || userDetails?.vairipay
          ? userDetails?.item?.userId?._id || userDetails?.item?._id
          : UserData?._id,
        userDetails?.market || userDetails?.vairipay
          ? userDetails?.item?.userId?.userType || userDetails?.item?.userType
          : UserData?.userType
      )
    );
  }, []);

  return (
    <div
      className="main-container usergreydisabled pb-1 "
      style={{ maxHeight: "calc(100vh - 160px)" }}
    >
      <div className="w-full mx-auto flex flex-col justify-center items-center ">
        <div className="w-full mx-auto flex flex-row justify-between items-start mt-4">
          <div className="flex flex-col items-center justify-center leading-[18px]">
            <div>
              <span className="text-[18px] text-[#040C50] font-extrabold font-Roboto-Serif">
                VAI
                <span className="text-[18px] text-[#040C50] font-semibold font-Roboto-Serif">
                  RIFY ID
                </span>
              </span>
            </div>
            <div>
              <span className="text-[15px] text-[#040C50] font-bold uppercase">
                {userDetails?.market || userDetails?.vairipay ? (
                  <>
                    {userDetails?.item?.userId?.vaiID ||
                      userDetails?.item?.vaiID}
                  </>
                ) : (
                  <>{UserData?.vaiID}</>
                )}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "-5px", bottom: "65px" }}
              className="absolute w-full h-full rounded-full"
            >
              {(
                userDetails?.market || userDetails?.vairipay
                  ? userDetails?.item?.userId?.profilePic ||
                  userDetails?.item?.profilePic
                  : UserData?.profilePic
              ) ? (
                <img
                src={
                  import.meta.env.VITE_APP_S3_IMAGE +
                  `/${userDetails?.market || userDetails?.vairipay
                    ? userDetails?.item?.userId?.profilePic ||
                    userDetails?.item?.profilePic
                    : UserData?.profilePic
                  }`
                }
                  // src={
                  //   import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                  //   `/${userDetails?.market || userDetails?.vairipay
                  //     ? userDetails?.item?.userId?.profilePic ||
                  //     userDetails?.item?.profilePic
                  //     : UserData?.profilePic
                  //   }`
                  // }
                  className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                  alt="Hot Rod"
                />
              ) : (
                <img
                  className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                  src={
                    (userDetails?.market || userDetails?.vairipay
                      ? userDetails?.item?.userId?.gender ||
                      userDetails?.item?.gender
                      : UserData?.gender) === "Male"
                      ? "/images/male.png"
                      : "/images/female.png"
                  }
                  alt="Hot Rod"
                />
              )}
            </div>
            {userDetails?.market ||
              (userDetails?.vairipay && (
                <div
                  onClick={() => {
                    followLoading ? null : handleFollow();
                  }}
                  style={{ right: "0px", top: "25px" }}
                  className="absolute"
                >
                  {userType === "client-hobbyist" ? (
                    <img
                      src={import.meta.env.BASE_URL + "images/HotRodIcon2.png"}
                      alt="Hot Rod Icon Second"
                      className={`${isFollowed(
                        userDetails?.item?.userId?._id ||
                        userDetails?.item?._id
                      )
                        ? ""
                        : "grayscale"
                        }`}
                    />
                  ) : null}
                  {userType === "companion-provider" ? (
                    <img
                      src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
                      alt="Sugar Icon Second"
                      className={`${isFollowed(
                        userDetails?.item?.userId?._id ||
                        userDetails?.item?._id
                      )
                        ? ""
                        : "grayscale"
                        }`}
                    />
                  ) : null}
                  {userType === "agency-business" || userType === "super" ? (
                    <img
                      src={
                        import.meta.env.BASE_URL +
                        "images/IntimateMassageIcon2.png"
                      }
                      alt="Sugar Icon Second"
                      className={`${isFollowed(
                        userDetails?.item?.userId?._id ||
                        userDetails?.item?._id
                      )
                        ? ""
                        : "grayscale"
                        }`}
                    />
                  ) : null}
                </div>
              ))}
          </div>
          <div className="leading-[18px]">
            <div>
              <span className="text-[18px] text-[#040C50] font-bold font-Roboto-Serif">
                TruRevu
              </span>
            </div>

            <div className="flex justify-center items-center">
              <FontAwesomeIcon
                icon={faStar}
                color={rate >= 1 ? "#E1AB3F" : "#111"}
                className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={rate >= 2 ? "#E1AB3F" : "#111"}
                className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={rate >= 3 ? "#E1AB3F" : "#111"}
                className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={rate >= 4 ? "#E1AB3F" : "#111"}
                className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={rate >= 5 ? "#E1AB3F" : "#111"}
                className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
              />
              <span className="text-[15px] text-[#040C50] font-bold ml-0.5">
                {/* {rate?.toFixed(1)} */}
                {(rate || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
          <span className="font-bold text-[24px] capitalize">
            {userDetails?.market || userDetails?.vairipay ? (
              <>{userDetails?.item?.userId?.name || userDetails?.item?.name}</>
            ) : (
              <>{UserData?.name}</>
            )}
          </span>
        </div>
        <div className="inner-content-part-medium flex flex-col mx-auto w-full items-center no-scrollbar">
          {(userDetails?.market || userDetails?.vairipay
            ? userDetails?.item?.userId?._id || userDetails?.item?._id
            : UserData?._id) !== UserData?._id && (
              <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
                <button
                  onClick={() => setMessageOpen(true)}
                  className="w-[142px] h-[31px] bg-gradient-to-b from-[#FFFFFF] to-[#0C8A02] px-2 rounded-[20px]"
                >
                  <div className="flex flex-row justify-center items-center">
                    <span className="mr-2 font-bold text-[16px] flex items-center justify-center">
                      Request
                    </span>
                    <div className="w-[62px] h-[21px] flex items-center justify-center">
                      <img
                        src={
                          import.meta.env.BASE_URL +
                          "images/VairipayRequestSecond.png"
                        }
                        alt="Vairify Request"
                      />
                    </div>
                  </div>
                </button>
              </div>
            )}

          <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
            <button
              onClick={() => setQrOpen(true)}
              className="w-[142px] h-[31px] bg-gradient-to-b from-[#FFFFFF] to-[#0C8A02] px-2 rounded-[20px]"
            >
              <div className="flex flex-row justify-center items-center">
                <span className="mr-2 font-bold text-[16px] flex items-center justify-center">
                  QR
                </span>
                <div className="w-[62px] h-[21px] flex items-center justify-center">
                  <img
                    src={import.meta.env.BASE_URL + "images/QRCodeScan.png"}
                    alt="Vairify Request"
                    style={{ height: "100%" }}
                  />
                </div>
              </div>
            </button>
          </div>

          <div className="w-full max-w-[400px]">
            {userType === "companion-provider" ||
              userType === "agency-business" ||
              userType === "client-hobbyist" ||
              userType === "super" ? (
              <div className="w-full mx-auto flex items-center justify-center mt-4">
                <PersonalInformationBtn
                  onClick={() => navigateToAboutMe()}
                  imgURL="images/ContactsIcon.png"
                  alt="Profile Contact"
                  text="About Me"
                  className="h-[47.7px]"
                  className1="text-[24px] font-bold"
                  className2="w-[26.1px]"
                />
              </div>
            ) : null}

            {userType === "companion-provider" ||
              userType === "agency-business" ||
              userType === "client-hobbyist" ||
              userType === "super" ? (
              <div className="w-full mx-auto flex items-center justify-center mt-6">
                <PersonalInformationBtn
                  disabled={
                    userDetails?.market || userDetails?.vairipay
                      ? !(
                        userDetails?.item?.userId?.allowUserToAccessGallery ||
                        userDetails?.item?.allowUserToAccessGallery
                      )
                      : !UserData?.allowUserToAccessGallery
                  }
                  imgURL="images/GalleryIcon.png"
                  alt="Gallery Info"
                  text="Gallery"
                  className="h-[47.7px]"
                  className1="text-[24px] font-bold"
                  className2="w-[28.95px]"
                  onClick={() => navigateToUserGallery()}
                />
              </div>
            ) : null}

            {/* <div className="w-full mx-auto flex items-center justify-center mt-6">
              <PersonalInformationBtn
                imgURL="images/GalleryIcon.png"
                alt="Gallery Info"
                text="Gallery 2"
                className="h-[47.7px]"
                className1="text-[24px] font-bold"
                className2="w-[28.95px]"
                onClick={() => navigateToUserGallery(2)}
              />
            </div> */}

            {userType === "companion-provider" ||
              userType === "agency-business" ||
              userType === "client-hobbyist" ? (
              <div className="w-full mx-auto flex items-center justify-center mt-6">
                <PersonalInformationBtn
                  disabled={
                    userDetails?.market || userDetails?.vairipay
                      ? !(
                        userDetails?.item?.userId?.allowUserCanRates ||
                        userDetails?.item?.allowUserCanRates
                      )
                      : !UserData?.allowUserCanRates
                  }
                  imgURL="images/png/find-friend.png"
                  alt="Trurevu"
                  text="TruRevu"
                  className="h-[47.7px]"
                  className1="text-[24px] font-bold"
                  className2="w-[28.8px]"
                  onClick={navigateToTrurevu}
                />
              </div>
            ) : null}

            {/* {userType === "companion-provider" ||
            userType === "agency-business" ||
            userType === "client-hobbyist" ||
            userType === "super" ? (
              <div className="w-full mx-auto flex items-center justify-center mt-6">
                <PersonalInformationBtn
                  // disabled={!userType.varipayActivity}
                  imgURL="images/VairipayIcon2.png"
                  alt="Vairipay"
                  text="VAIRIPAY"
                  className="h-[47.7px]"
                  className1="text-[24px] font-bold"
                  className2="w-[50px] top-1"
                  onClick={() =>
                    navigate("/my-vairipay", {
                      state: userDetails?.item?.userId,
                    })
                  }
                />
              </div>
            ) : null} */}

            {/* {!userDetails?.market && ( */}
            <>
              {userType === "companion-provider" ||
                userType === "agency-business" ||
                userType === "client-hobbyist" ||
                userType === "super" ? (
                <div className="w-full mx-auto flex items-center justify-center mt-6 mt-6">
                  <PersonalInformationBtn
                    imgURL="images/MyVairifyIcon.png"
                    alt="Follow Me"
                    text="Follow Me"
                    className="h-[47.7px]"
                    className1="text-[24px] font-bold"
                    className2="w-[27px]"
                    onClick={() => {
                      navigate("/social-links", {
                        state:
                          userDetails?.market || userDetails?.vairipay
                            ? userDetails?.item?.userId || userDetails?.item
                            : UserData,
                      });
                    }}
                  />
                </div>
              ) : null}

              {/* TODO: we need to check if we already have page to show these info.. */}
              {/* {userType === "companion-provider" ||
              userType === "agency-business" ||
              userType === "super" ? (
                <div className="w-full mx-auto flex items-center justify-center mt-6 mt-6">
                  <PersonalInformationBtn
                    // disabled={!userType.calendarActivity}
                    imgURL="images/calendarW.png"
                    alt="Calendar"
                    text="Calendar"
                    className="h-[47.7px]"
                    className1="text-[24px] font-bold"
                    className2="w-[27px]"
                  />
                </div>
              ) : null} */}

              {/* TODO: we need to check if we already have page to show these info.. */}
              {/* {userType === "companion-provider" ||
              userType === "agency-business" ? (
                <div className="w-full mx-auto flex items-center justify-center mt-6 mb-4">
                  <PersonalInformationBtn
                    disabled={
                      userDetails?.market || userDetails?.vairipay
                        ? !(
                            userDetails?.item?.userId
                              ?.allowUserToAccessServices ||
                            userDetails?.item?.allowUserToAccessServices
                          )
                        : !UserData?.allowUserToAccessServices
                    }
                    imgURL="images/rate.png"
                    alt="Services & Rates"
                    text="Services & Rates"
                    className="h-[47.7px]"
                    className1="text-[24px] font-bold"
                    className2="w-[25px]"
                    onClick={() =>
                      navigate(`/user/services-rates`, { state: userDetails })
                    }
                  />
                </div>
              ) : null} */}
            </>
            {/*  )}
           {(userDetails?.market ||
             userDetails?.vairipay) && ( */}
            <>
              {userType === "agency-business" || userType === "super" ? (
                <div className="w-full mx-auto flex items-center justify-center mt-6 mb-4">
                  <PersonalInformationBtn
                    // disabled={!userType.calendarActivity}
                    imgURL="images/staff.png"
                    alt="Staff"
                    text="Staff"
                    className="h-[47.7px]"
                    className1="text-[24px] font-bold"
                    className2="w-[25px]"
                  />
                </div>
              ) : null}

              {userType === "super" || userType === "agency-business" ? (
                <div className="w-full mx-auto flex items-center justify-center mt-6 mb-4">
                  <PersonalInformationBtn
                    imgURL="images/hours_contact.png"
                    alt="Hours_Contact"
                    text="Hours/Contact"
                    className="h-[47.7px]"
                    className1="text-[24px] font-bold"
                    className2="w-[25px]"
                  />
                </div>
              ) : null}

              {(userType === "companion-provider" ||
                userType === "client-hobbyist") &&
                (userDetails?.market || userDetails?.vairipay
                  ? userDetails?.item?.userId?._id || userDetails?.item?._id
                  : UserData?._id) !== UserData?._id ? (
                <div className="w-full mx-auto flex items-center justify-center mt-6 mb-4">
                  <PersonalInformationBtn
                    imgURL="images/phone-call.png"
                    alt="Contact Me"
                    text="Contact Me"
                    className="h-[47.7px]"
                    className1="text-[24px] font-bold"
                    className2="w-[25px]"
                    onClick={() =>
                      navigate(
                        `/chat/${userDetails?.market || userDetails?.vairipay
                          ? userDetails?.item?.userId?._id ||
                          userDetails?.item?._id
                          : UserData?._id
                        }`
                      )
                    }
                  />
                </div>
              ) : null}

              {(userDetails?.market || userDetails?.vairipay
                ? userDetails?.item?.userId?._id || userDetails?.item?._id
                : UserData?._id) === UserData?._id && (
                  <div className="w-full mx-auto flex items-center justify-center mt-6 mb-4">
                    <PersonalInformationBtn
                      onClick={() => navigate("/location-requests")}
                      imgURL="images/phone-call.png"
                      alt="Location Requests"
                      text="Location Requests"
                      className="h-[47.7px]"
                      className1="text-[24px] font-bold"
                      className2="w-[25px]"
                    />
                  </div>
                )}

              {(userType === "companion-provider" ||
                userType === "client-hobbyist") &&
                (userDetails?.market || userDetails?.vairipay
                  ? userDetails?.item?.userId?._id || userDetails?.item?._id
                  : UserData?._id) !== UserData?._id ? (
                null
              ) : (<div className="w-full mx-auto flex items-center justify-center mt-6 mb-4">
                <PersonalInformationBtn
                  onClick={() => {
                    navigate("/vai-now", { state: userDetails });
                  }}
                  imgURL="images/barCheck.png"
                  alt="VAI-CHECK"
                  text="VAI-CHECK"
                  className="h-[47.7px] bg-green-btn"
                  className1="text-[24px] font-bold text-[#01195C]"
                  className2="w-[25px] text-[#01195C]"
                />
              </div>)}

              {(userType === "companion-provider" ||
                userType === "client-hobbyist") &&
                (userDetails?.market || userDetails?.vairipay
                  ? userDetails?.item?.userId?._id || userDetails?.item?._id
                  : UserData?._id) !== UserData?._id ? (
                <div className="w-full mx-auto flex items-center justify-center mt-6 mb-4">
                  <PersonalInformationBtn
                    onClick={() => {
                      navigate("/vairify-schedule", { state: userDetails });
                    }}
                    imgURL="images/varidate.png"
                    alt="VAIRIFY-NOW"
                    text="VAIRIFY-NOW"
                    className="h-[47.7px] bg-green-btn"
                    className1="text-[24px] font-bold text-[#01195C]"
                    className2="w-[25px] text-[#01195C]"
                  />
                </div>
              ) : null}

              {/* {!userDetails?.market || !userDetails?.vairipay ? (
                <>
                  {userType === "companion-provider" ||
                  userType === "agency-business" ? (
                    <div className="w-full mx-auto flex items-center justify-center mt-6 mb-4">
                      <PersonalInformationBtn
                        imgURL="images/varidate.png"
                        alt="VAIRIDATE"
                        text="VAIRIDATE"
                        className="h-[47.7px] bg-green-btn"
                        className1="text-[24px] font-bold text-[#01195C]"
                        className2="w-[25px] text-[#01195C]"
                      />
                    </div>
                  ) : null}
                </>
              ) : null} */}
            </>
            {/* )} */}
            {(userDetails?.market || userDetails?.vairipay) && (
              <div className="flex mt-2 items-center justify-center w-full mb-3">
                <Button
                  onClick={() =>
                    navigate(`/varidate/select-date/${TargetUserId}`)
                  }
                  className={
                    "flex items-center mt-2 h-[47px] w-[50%] my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] py-2 rounded-[20px]"
                  }
                  text={"Request VAIRIDATE"}
                  size="45px"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={messageOpen}
        //   onAfterOpen={afterMessageOpen}
        onRequestClose={closeMessage}
        className={
          "bg-[#3760CB] relative top-[50%] translate-y-[-50%] max-w-[450px] mx-auto py-4 w-[95%] rounded-3xl border-2 border-[#fff] px-4"
        }
        contentLabel="#"
      >
        <div className=" sm:h-fit bg-[#3760CBD4]">
          <div className="flex">
            <div className="flex flex-col justify-between items-center w-[30%]">
              <img
                className="w-[74px] h-[74px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                src={
                  userDetails?.item?.userId?.profilePic ||
                    userDetails?.item?.profilePic
                    ? 
                    import.meta.env.VITE_APP_S3_IMAGE +
                    `/${userDetails?.item?.userId?.profilePic ||
                    userDetails?.item?.profilePic
                    }`
                    // import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                    // `/${userDetails?.item?.userId?.profilePic ||
                    // userDetails?.item?.profilePic
                    // }`
                    : userDetails?.item?.userId?.gender === "male" ||
                      userDetails?.item?.gender === "Male"
                      ? "/images/female.png"
                      : "/images/male.png"
                  //"/images/gallery-peofile.png"
                }
                alt=""
              />
              <p className="text-[12px] mt-1 text-[#fff] font-bold pt-px leading-[10.57px]">
                TruRevu
              </p>
              <p className="text-[12px] text-[#fff] pb-1 font-bold text-center leading-[17.57px]">
                {userDetails?.item?.userId?.name || userDetails?.item?.name}{" "}
                <span className="uppercase">
                  {userDetails?.item?.userId?.vaiID || userDetails?.item?.vaiID}
                </span>
              </p>
              <div className="flex gap-1 pb-1 items-start">
                <div className="flex gap-1 mt-1">
                  {Array.from(
                    { length: Math.floor(rate || 0) },
                    (_, index) => index
                  ).map((rating) => (
                    <img
                      key={rating}
                      src="/images/Star.svg"
                      className="w-[10px]  h-[10px]"
                      alt=""
                    />
                  ))}
                  {Array.from(
                    { length: 5 - Math.floor(rate || 0) },
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
                  {rate?.toFixed(1)}
                </span>
              </div>
              <p className="text-[12px] text-[#fff] font-bold rounded-2xl border-2 border-[#fff] bg-[#02227E] px-2 py-px text-center h-fit min-h-[33.7px] flex justify-center items-center cursor-pointer">
                View Profile
              </p>
            </div>
            <div className="w-[74%]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[14px] font-bold text-[#fff] text-center leading-[17.57px]">
                    Amount Requested
                  </p>
                  <div className="flex justify-center items-center">
                    <div className="w-[100px] relative">
                      <label className="absolute left-3 top-1">$</label>
                      <input
                        value={ammount}
                        onChange={handleAmountChange}
                        size="25px"
                        className="placeholder:text-[#ccc] w-full text-[18px] border-2 border-[#02227E] rounded-[10px] py-2 pl-6 pr-4 border-2 rounded-2xl h-[32px] bg-[#D9D9D97D]"
                        placeholder={"0.00"}
                      />
                      {amountError?.length > 0 ? (
                        <span className="text-[10px] text-[#DB3002] font-bold whitespace-nowrap">
                          {amountError}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#fff]">
                    Request Type{" "}
                  </p>
                  <p className="text-[18px] font-bold text-[#fff] uppercase">
                    <span className="font-extrabold uppercase">
                      VAI<span className="logoSetupweight">ripay</span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="pb-px pt-5">
                <p className="text-[10px] font-bold text-center text-[#fff]">
                  Comments
                </p>
                <div className="px-7">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      height: '59px',
                      backgroundColor: '#D9D9D97D',
                      borderColor: '#02227E',
                      borderWidth: '2px',
                      borderRadius: '16px',
                      resize: 'none',
                    }}
                    className="border-2 rounded-2xl ps-2 pt-2"
                  />
                </div>
              </div>
              <div className="my-1 flex justify-center h-[34px] flex justify-center items-center pt-2">
                <p
                  disabled={paymentRequestLoading}
                  onClick={handelUserRequest}
                  className="text-[#FFFFFF] text-[20px] font-bold mt-2 px-7 py-2 rounded-2xl bg-gradient-to-b from-[#A30C30] to-[#DB3002] max-w-[150px] text-center"
                >
                  {paymentRequestLoading ? "Loading.." : "Send"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={qrOpen}
        //   onAfterOpen={afterMessageOpen}
        onRequestClose={() => setQrOpen(false)}
        className={
          "bg-[#3760CB] relative top-[50%] translate-y-[-50%] max-w-[450px] mx-auto py-4 w-[95%] rounded-3xl border-2 border-[#fff] px-4"
        }
        contentLabel="#"
      >
        <div className=" sm:h-fit bg-[#3760CBD4]">
          <div className="flex flex-col pb-2">
            <div className="flex relative justify-center mb-3">
              <button
                onClick={() => setQrOpen(false)}
                className="right-2 my-2 absolute top-0 right-0"
              >
                <img
                  src="/images/Mask group-close.png"
                  alt=""
                  width="30px"
                  height="30px"
                />
              </button>
              <p className="text-[24px] font-bold text-center text-[#fff]">
                Scan QR
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <QRCode
                value={`${import.meta.env.VITE_APP_PUBLIC_URL}/public/profile/${userDetails?.market || userDetails?.vairipay
                  ? userDetails?.item?.userId?.vaiID ||
                  userDetails?.item?.vaiID
                  : UserData?.vaiID
                  }`}
                height={400}
                width={400}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
