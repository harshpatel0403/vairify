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
import AboutMe from "../Settings/AboutMe";
import UserGallery from "./UserGallery";
import Reviews from "../varidate/Reviews";
import SocialLinks from "../socialLinks";
import { HandleGetProfile } from "../../redux/action/Profile";
import Loading from "../../components/Loading/Index";
import PageTitle from "../../components/PageTitle";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state: userDetails } = useLocation();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  let TargetUserId = userDetails?.item?.userId?._id || userDetails?.item?._id;

  const userData = userDetails?.market || userDetails?.vairipay
    ? userDetails?.item?.userId || userDetails?.item
    : UserData
  const isMarket = userDetails?.market || userDetails?.vairipay;

  const [messageOpen, setMessageOpen] = useState(false);
  const [ammount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [message, setMessage] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [paymentRequestLoading, setPaymentRequestLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [userProfileData, setUserProfileData] = useState();
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    if (userData?._id) {
      dispatch(HandleGetProfile(userData._id))
        .then((response) => {
          setUserProfileData(response?.payload);
        })
        .catch((error) => console.log(error));
      dispatch(HandleUpdateFollowers(UserData?._id))
    }
  }, []);

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
        setMessageOpen(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.error || err.message);
      })
      .finally(() => {
        setAmount("");
        setMessage("")
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
      toast.error(error?.response?.data?.message || "Unable to follow!");
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



  useEffect(() => {
    dispatch(
      HandleGetServices(
        userDetails?.market || userDetails?.vairipay
          ? userDetails?.item?.userId?._id || userDetails?.item?._id
          : UserData?._id,
        userDetails?.market || userDetails?.vairipay
          ? userDetails?.item?.userId?.user_type || userDetails?.item?.user_type
          : UserData?.userType, userDetails
      )
    );
  }, []);

  const tabs = [
    {
      id: 1, label: "Gallery", component: <UserGallery userId={userDetails?.market || userDetails?.vairipay
        ? userDetails?.item?.userId?._id || userDetails?.item?._id
        : UserData?._id} user={userDetails?.market || userDetails?.vairipay
          ? userDetails?.item?.userId || userDetails?.item
          : UserData} />
    },
    {
      id: 2, label: "TruRevu", component: <Reviews

        location={{
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
          }
        }
        }
      />
    },
    {
      id: 3, label: "Follow Me", component: <SocialLinks state={
        userDetails?.market || userDetails?.vairipay
          ? userDetails?.item?.userId || userDetails?.item
          : UserData
      } />
    },
  ];


  return (
    <div
      className="container"
    >
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"View Profile"} />
      </div>
      <div className="flex gap-[24px]">
        <div
          className="w-fit sm:bg-[#FFFFFF0A] sm:p-[16px] rounded-[16px] w-full lg:max-w-[350px] flex flex-col "
        >
          <div
            className="flex justify-center items-center "
          >
            <div className="relative">
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
                  className="w-[120px] h-[120px] rounded-[125px] object-cover overflow-hidden bg-[#fff] border-2 border-white"
                  alt="profile photo"
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
                  alt="profile photo"
                />
              )}
              {(
                (userDetails?.market || userDetails?.vairipay
                  ? userDetails?.item?.userId?._id || userDetails?.item?._id
                  : UserData?._id
                ) === UserData?._id
              ) && (
                  <button className="absolute bottom-0 right-[8px]" onClick={() => setQrOpen(true)}>
                    <img
                      src="/images/home/qr.svg"
                      alt="QR"
                      className="w-[24px] h-[24px] rounded-full "
                    />
                  </button>
                )}
            </div>


          </div>
          <div className="w-full mx-auto flex flex-row justify-around items-start gap-[24px] mt-[24px]">

            <div className="flex flex-col items-center justify-center  w-full ">
              <div className="text-white text-sm opacity-[0.6] font-normal  whitespace-nowrap">
                VAIRIFY ID
              </div>
              <div className="text-base text-white font-semibold  whitespace-nowrap">
                {userDetails?.market || userDetails?.vairipay ? (
                  <>
                    {userDetails?.item?.userId?.vaiID ||
                      userDetails?.item?.vaiID}
                  </>
                ) : (
                  <>{UserData?.vaiID}</>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center  w-full">
              <div className="text-white text-sm opacity-[0.6] font-normal  whitespace-nowrap">
                Name
              </div>
              <div className="text-base text-white font-semibold whitespace-nowrap">
                {userDetails?.market || userDetails?.vairipay ? (
                  <>{userDetails?.item?.userId?.name || userDetails?.item?.name}</>
                ) : (
                  <>{UserData?.name}</>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center  w-full ">
              <div className="text-white text-sm opacity-[0.6] font-normal  whitespace-nowrap">
                TruRevu
              </div>
              <div className="flex gap-1 items-center">
                <p className="text-[18px] text-white font-bold m-0">
                  {(rate || 0).toFixed(1)}
                </p>
                <img src="/images/home/star.svg" alt="star" />
              </div>
            </div>
          </div>
          <div className="w-full">
            {(userDetails?.market || userDetails?.vairipay
              ? userDetails?.item?.userId?._id || userDetails?.item?._id
              : UserData?._id) !== UserData?._id && (
                <div className="mt-[24px] flex gap-[16px]">
                  <Button disabled={followLoading} text={followLoading ?
                    (<Loading />) :
                    isFollowed(userDetails?.item?.userId?._id || userDetails?.item?._id) ? 'Unfollow' : 'Follow'
                  } size={'36px'} className={'py-[4px]'} onClick={handleFollow} />
                  <Button text={'QR Code'} size={'36px'} className={'py-[4px] secondary-btn !bg-[#FFFFFF29]'} onClick={() => setQrOpen(true)} />
                </div>)}
          </div>
          <div className="flex gap-[16px] items-stretch">
            {(userDetails?.market || userDetails?.vairipay
              ? userDetails?.item?.userId?._id || userDetails?.item?._id
              : UserData?._id) !== UserData?._id && (
                <button className="py-[10px] px-[4px] gap-[6px] w-full flex flex-col items-center justify-center border border-[#919EAB33] text-xs text-white font-medium rounded-[8px] mt-[24px]" onClick={() => setMessageOpen(true)}>
                  <img src="/images/home/dollar-pay.svg" alt="pay" />
                  Pay
                </button>
              )}

            {(userType === "companion-provider") &&
              (userDetails?.market || userDetails?.vairipay
                ? userDetails?.item?.userId?._id || userDetails?.item?._id
                : UserData?._id) !== UserData?._id ? (
              <button className="py-[10px] px-[4px] gap-[6px] w-full flex flex-col items-center justify-center border border-[#919EAB33] text-xs text-white font-medium rounded-[8px] mt-[24px] " onClick={() => {
                navigate("/vairify-schedule", { state: userDetails });
              }}>
                <img src="/images/home/vairify-now.svg" alt="vairify-now" />
                VAIRIFY - NOW
              </button>
            ) : null}
            {(userDetails?.market || userDetails?.vairipay) && (
              userType === "client-hobbyist" ? (
                <></>
              ) : (
                <button className="py-[10px] px-[4px] gap-[6px] w-full flex flex-col items-center justify-center border border-[#919EAB33] text-xs text-white font-medium rounded-[8px] mt-[24px]"
                  onClick={() =>
                    navigate(`/varidate/select-date/${TargetUserId}`)
                  }>
                  <img src="/images/home/varidate.svg" alt="varidate" />
                  VAIRIDATE
                </button>
              )
            )}
          </div>
          <div className="flex gap-[16px]">
            {(userType === "companion-provider" ||
              userType === "client-hobbyist") &&
              (userDetails?.market || userDetails?.vairipay
                ? userDetails?.item?.userId?._id || userDetails?.item?._id
                : UserData?._id) !== UserData?._id ? (
              null
            ) : (
              <Button
                onClick={() => {
                  navigate("/vai-now", { state: userDetails });
                }}
                text="VAI-CHECK"
                className="!bg-[#008F34] py-[4px] secondary-btn mt-[24px] "
                size={'36px'}
              />)}
            {(userDetails?.market || userDetails?.vairipay
              ? userDetails?.item?.userId?._id || userDetails?.item?._id
              : UserData?._id) === UserData?._id && (
                <Button
                  onClick={() => navigate("/location-requests")}
                  text="Location Requests"
                  className="!bg-[#FFFFFF29] py-[4px] secondary-btn mt-[24px]"
                  size={'36px'}
                />
              )}
          </div>
          <div className="w-full mt-[24px]">
            <p className="text-sm text-white font-normal text-center opacity-[0.9]">
              {userProfileData?.description}
            </p>
          </div>
          <div className="w-full lg:mt-[24px] lg:block hidden">
            <div className="flex justify-between gap-3">
              <p className="font-normal text-white text-base opacity-[0.6]">Gender</p>
              <p className="font-medium text-white text-base">
                {userData?.gender ?? userProfileData?.gender ?? "Not Specified"}
              </p>
            </div>
            <div className="flex justify-between gap-3 mt-1">
              <p className="font-normal text-white text-base opacity-[0.6]">Age</p>
              <p className="font-medium text-white text-base">
                {userData?.age ?? userProfileData?.age ?? "Not Specified"}
              </p>
            </div>
            <div className="flex justify-between gap-3 mt-1">
              <p className="font-normal text-white text-base opacity-[0.6]">Height</p>
              <p className="font-medium text-white text-base">
                {userData?.height ?? userProfileData?.height ?? "Not Specified"}
              </p>
            </div>
            <div className="flex justify-between gap-3 mt-1">
              <p className="font-normal text-white text-base opacity-[0.6]">Weight</p>
              <p className="font-medium text-white text-base">
                {userData?.weight ?? userProfileData?.weight ?? "Not Specified"}
              </p>
            </div>
          </div>
          <div className="w-full mt-[auto]">
            {(userType === "companion-provider" ||
              userType === "client-hobbyist") &&
              (userDetails?.market || userDetails?.vairipay
                ? userDetails?.item?.userId?._id || userDetails?.item?._id
                : UserData?._id) !== UserData?._id ? (
              <Button text={'Contact Me'} size={'42px'} className={'py-[5px] mt-[24px] bg-[#283B7B] sm:bg-[#E8EBF0] profile'} onClick={() =>
                navigate(
                  `/chat/${userDetails?.market || userDetails?.vairipay
                    ? userDetails?.item?.userId?._id ||
                    userDetails?.item?._id
                    : UserData?._id
                  }`
                )
              } />
            ) : null}
          </div>
        </div>
        <div className="w-full bg-[#FFFFFF0A] p-[16px] rounded-[16px] lg:block hidden">
          <div className="">
            {/* Tab Headers */}
            <div className="flex gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-[8px] rounded-[8px] text-sm text-white font-medium hover:bg-[#FFFFFF29]
              ${activeTab === tab.id
                      ? "bg-[#FFFFFF29]"
                      : "bg-transparent"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-[24px]">
              {tabs.find((tab) => tab.id === activeTab)?.component}
            </div>
          </div>
        </div>
      </div>


      <div className="w-full mb-[48px]">

        <div className="flex flex-col mx-auto w-full items-center">

          <div className="lg:hidden block w-full">
            {userType === "companion-provider" ||
              userType === "agency-business" ||
              userType === "client-hobbyist" ||
              userType === "super" ? (
              <div className="w-full mx-auto flex items-center justify-center mt-4">
                <Button
                  onClick={() => navigateToAboutMe()}
                  text="About Me"
                  className="sm:!bg-[#FFFFFF29] !bg-[#283B7B] secondary-btn"
                />
              </div>
            ) : null}

            {userType === "companion-provider" ||
              userType === "agency-business" ||
              userType === "client-hobbyist" ||
              userType === "super" ? (
              <div className="w-full mx-auto flex items-center justify-center mt-4">
                <Button
                  disabled={
                    userDetails?.market || userDetails?.vairipay
                      ? !(
                        userDetails?.item?.userId?.allowUserToAccessGallery ||
                        userDetails?.item?.allowUserToAccessGallery
                      )
                      : !UserData?.allowUserToAccessGallery
                  }
                  text="Gallery"
                  className="sm:!bg-[#FFFFFF29] !bg-[#283B7B] secondary-btn"
                  onClick={() => navigateToUserGallery()}
                />
              </div>
            ) : null}

            {userType === "companion-provider" ||
              userType === "agency-business" ||
              userType === "client-hobbyist" ? (
              <div className="w-full mx-auto flex items-center justify-center mt-4">
                <Button
                  disabled={
                    userDetails?.market || userDetails?.vairipay
                      ? !(
                        userDetails?.item?.userId?.allowUserCanRates ||
                        userDetails?.item?.allowUserCanRates
                      )
                      : !UserData?.allowUserCanRates
                  }
                  text="TruRevu"
                  className="sm:!bg-[#FFFFFF29] !bg-[#283B7B] secondary-btn"
                  onClick={navigateToTrurevu}
                />
              </div>
            ) : null}

            {userType === "companion-provider" ||
              userType === "agency-business" ||
              userType === "client-hobbyist" ||
              userType === "super" ? (
              <div className="w-full mx-auto flex items-center justify-center mt-4">
                <Button
                  text="Follow Me"
                  className="sm:!bg-[#FFFFFF29] !bg-[#283B7B] secondary-btn"
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
            <>
              {userType === "agency-business" || userType === "super" ? (
                <div className="w-full mx-auto flex items-center justify-center mt-4">
                  <Button
                    // disabled={!userType.calendarActivity}
                    text="Staff"
                    className="sm:!bg-[#FFFFFF29] !bg-[#283B7B] secondary-btn"
                  />
                </div>
              ) : null}

              {userType === "super" || userType === "agency-business" ? (
                <div className="w-full mx-auto flex items-center justify-center mt-4">
                  <Button
                    text="Hours/Contact"
                    className="sm:!bg-[#FFFFFF29] !bg-[#283B7B] secondary-btn"
                  />
                </div>
              ) : null}
            </>
          </div>
        </div>
      </div>

      <Modal
        isOpen={messageOpen}
        //   onAfterOpen={afterMessageOpen}
        onRequestClose={closeMessage}
        className={
          "bg-white relative max-w-[500px] mx-auto w-[90%] rounded-[16px]"
        }
        contentLabel="#"
      >
        <div className=" p-[24px] rounded-[16px]">
          <div className="relative w-full">
            <div className="text-[#212B36] text-xl font-semibold text-center">
              VAIRIPAY Request
            </div>
            <button className="absolute top-0 right-0" onClick={closeMessage}>
              <img src="/images/home/close.svg" alt="close" className="w-[24px] h-[24px]" />
            </button>
          </div>
          <div className="mt-[24px] flex justify-center">
            <img
              className="w-[100px] h-[100px] rounded-[125px] overflow-hidden object-cover"
              src={
                userDetails?.item?.userId?.profilePic ||
                  userDetails?.item?.profilePic
                  ?
                  import.meta.env.VITE_APP_S3_IMAGE +
                  `/${userDetails?.item?.userId?.profilePic ||
                  userDetails?.item?.profilePic
                  }`
                  : userDetails?.item?.userId?.gender === "Male" ||
                    userDetails?.item?.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
              }
              alt=""
            />
          </div>
          <div className="mt-[24px] flex justify-around gap-2">
            <div className="flex flex-col items-center justify-center">
              <div className="text-[#212B36] opacity-[0.6] text-sm font-normal">VAIRIFY ID</div>
              <div className="text-[#212B36] text-base font-semibold mt-[4px] uppercase"> {userDetails?.item?.userId?.vaiID || userDetails?.item?.vaiID}</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-[#212B36] opacity-[0.6] text-sm font-normal">Name</div>
              <div className="text-[#212B36] text-base font-semibold mt-[4px] ">  {userDetails?.item?.userId?.name || userDetails?.item?.name}</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-[#212B36] opacity-[0.6] text-sm font-normal">TruRevu</div>
              <div className="text-[#212B36] text-base font-semibold mt-[4px] flex items-center gap-1"> {rate?.toFixed(1)} <img src="/images/home/star.svg" alt="star" /></div>
            </div>
          </div>
          <div className="mt-[24px]">
            <div className="w-full relative">
              <label className="absolute left-[20px] top-[16px]">$</label>
              <input
                value={ammount}
                onChange={handleAmountChange}
                size="25px"
                className="w-full text-sm font-normal p-[16px] border border-[#919EAB33] rounded-[8px] pl-[36px]"
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
            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-sm font-normal p-[16px] border border-[#919EAB33] rounded-[8px] mt-[10px]"
                placeholder="Comments"
              />
            </div>
          </div>
          <Button
            disabled={paymentRequestLoading}
            onClick={handelUserRequest}
            text={paymentRequestLoading ? <div className="flex items-center	justify-center ">
              <Loading />
            </div> : "Send"}
            className="secondary-btn mt-[16px]"
          />

        </div>
      </Modal>

      <Modal
        isOpen={qrOpen}
        //   onAfterOpen={afterMessageOpen}
        onRequestClose={() => setQrOpen(false)}
        className={
          "bg-white relative max-w-[500px] mx-auto w-[90%] rounded-[16px]"
        }
        contentLabel="#"
      >
        <div className="p-[24px] rounded-[16px]">
          <div className="flex flex-col pb-2">
            <div className="flex relative justify-center mb-3">
              <button
                onClick={() => setQrOpen(false)}
                className="mt-1 absolute top-0 right-0"
              >
                <img
                  src="/images/home/close.svg"
                  alt=""
                  width="24px"
                  height="24px"
                />
              </button>
              <p className="text-xl font-semibold text-center text-[#212B36]">
                QR Code
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center sm:my-[24px] my-[10px]">
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



