import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import PersonalInformationBtn from "../../components/PersonalInformationBtn";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import QRCode from "react-qr-code";
import { HandleGetServices } from "../../redux/action/Services";
import UserService from "../../services/userServices";

export default function PublicProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  // const { state: userDetails } = useLocation();
  // const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const [qrOpen, setQrOpen] = useState(false);
  const [UserData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const userType = UserData.user_type; // ADD user type here

  // TODO static datails here...
  const userDetails = null;
  // const UserData = {};

  const navigateToAboutMe = () => {
    const userDataForAboutPage = UserData;
    navigate("/settings/about-me", {
      state: {
        userData: userDataForAboutPage,
        isMarket: false,
      },
    });
  };
  const navigateToTrurevu = () => {
    navigate("/varidate/reviews", {
      state: {
        ...UserData,
        vaiID: UserData?.vaiID,
        averageRating: UserData?.averageRating,
        name: UserData?.name,
        userId: UserData?._id,
        profilePic: UserData?.profilePic,
      },
    });
  };

  const navigateToUserGallery = () => {
    const usrDataForNextScreen = UserData;
    navigate("/user/gallery", {
      state: {
        userId: usrDataForNextScreen?._id,
        user: usrDataForNextScreen,
      },
    });
  };

  // const rate = (userDetails?.item?.userId?.reviews || []).reduce((total, item) => total + item.rating, 0) / ((userDetails?.item?.userId?.reviews || []).length || 1)
  const rate = UserData?.averageRating;

  const fetchUserDetails = async () => {
    setLoading(true);
    const usr = await UserService.getPublicUser(params.vaiId);
    setUserData(usr);
    dispatch(HandleGetServices(usr?._id));
    setLoading(false);
  };

  useEffect(() => {
    // TODO: user details
    fetchUserDetails();
  }, []);

  if (loading) {
    return <div>Please wait..</div>;
  }

  return (
    <div
      className="main-container usergreydisabled pb-1 py-1"
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
                <>{UserData?.vaiID}</>
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "0px", bottom: "65px" }}
              className="absolute w-full h-full rounded-full"
            >
              {UserData?.profilePic ? (
                <img
                src={
                  import.meta.env.VITE_APP_S3_IMAGE +
                  `/${UserData?.profilePic}`
                }
                  // src={
                  //   import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                  //   `/${UserData?.profilePic}`
                  // }
                  className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                  alt="Hot Rod"
                />
              ) : (
                <img
                  className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                  src={
                    UserData?.gender === "Male"
                      ? "/images/male.png"
                      : "/images/female.png"
                  }
                  alt="Hot Rod"
                />
              )}
            </div>
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
                {rate === 0 ? rate : rate?.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
          <span className="font-bold text-[24px] capitalize">
            <>{UserData?.name}</>
          </span>
        </div>
        <div className="inner-content-part-medium flex flex-col mx-auto w-full items-center">
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
                      state: UserData,
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
                        state: UserData,
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
              {userType === "companion-provider" ||
              userType === "agency-business" ? (
                <div className="w-full mx-auto flex items-center justify-center mt-6 mb-4">
                  <PersonalInformationBtn
                    disabled={!UserData?.allowUserToAccessServices}
                    imgURL="images/rate.png"
                    alt="Services & Rates"
                    text="Services & Rates"
                    className="h-[47.7px]"
                    className1="text-[24px] font-bold"
                    className2="w-[25px]"
                    onClick={() =>
                      navigate(`/user/services-rates`, { state: UserData })
                    }
                  />
                </div>
              ) : null}
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
            </>
          </div>
        </div>
      </div>

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
                value={`${import.meta.env.VITE_APP_PUBLIC_URL}/public/profile/${
                  userDetails?.market || userDetails?.vairipay
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
