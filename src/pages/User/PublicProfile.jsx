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
import Loading from "../../components/Loading/Index";
import Button from "../../components/Button";

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
    return <div className="flex items-center justify-center h-full w-full"><Loading /></div>;
  }

  return (
    <div className="container">
      <div className="w-full flex flex-row sm:justify-around justify-between items-end mt-[102px] sm:p-[16px] sm:bg-[#FFFFFF0A] rounded-[16px]">
        <div className="flex flex-col items-center justify-center sm:min-w-[120px] min-w-[80px]">
          <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
            VAIRIFY ID
          </div>
          <div className="font-bold sm:text-lg text-base text-white uppercase">
            {UserData?.vaiID}
          </div>
        </div>
        <div className="relative">
          <div
            className="sm:h-[120px] h-[80px] sm:w-[120px] w-[80px] rounded-full mt-[-74px] relative flex justify-center"
          >
            {UserData?.profilePic ? (
              <img
                src={
                  import.meta.env.VITE_APP_S3_IMAGE +
                  `/${UserData?.profilePic}`
                }
                className="sm:w-[100px] w-[80px] sm:h-[100px] h-[80px] rounded-full  border-2 border-white"
                alt="Hot Rod"
              />
            ) : (
              <img
                className="w-[100px] h-[100px] rounded-[125px] border-2 border-white"
                src={
                  UserData?.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
                }
                alt="Hot Rod"
              />
            )}


          </div>
          <div className="flex-col flex justify-center items-center mt-[24px]">
            <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
              Name
            </div>
            <span className="font-bold sm:text-lg text-base text-white">
              {UserData?.name}
            </span>
          </div>
        </div>
        <div className="leading-[18px] sm:min-w-[120px] min-w-[80px] flex flex-col justify-center items-center">
          <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
            TruRevu
          </div>
          <div className="flex justify-center items-center gap-1">
            <div className="sm:text-lg text-base text-white font-bold ">
              {rate}
            </div>
            <img src="/images/home/star.svg" alt="star" />
          </div>
        </div>
      </div>



      <div className="w-full mx-auto flex flex-col justify-center items-center sm:mt-8 mt-6">
        <Button
          onClick={() => setQrOpen(true)}
          className="w-full secondary-btn !bg-[#FFFFFF29] hover:!bg-[#FFFFFF40] max-w-[500px]"
          text={'QR Code'}
          size={'48px'}
        />
      </div>
      <div className="w-full mx-auto sm:mb-8 mb-6">
        {userType === "companion-provider" ||
          userType === "agency-business" ||
          userType === "client-hobbyist" ||
          userType === "super" ? (
          <div className="w-full mx-auto flex items-center justify-center sm:mt-6 mt-[16px]">
            <PersonalInformationBtn
              onClick={() => navigateToAboutMe()}
              imgURL="images/ContactsIcon.png"
              alt="Profile Contact"
              text="About Me"
              className="h-[47.7px]"
              className1="font-bold text-[15px] text-white"
              className2="w-[26.1px]"
            />
          </div>
        ) : null}

        {userType === "companion-provider" ||
          userType === "agency-business" ||
          userType === "client-hobbyist" ||
          userType === "super" ? (
          <div className="w-full mx-auto flex items-center justify-center sm:mt-6 mt-[16px]">
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
              className1="font-bold text-[15px] text-white"
              className2="w-[28.95px]"
              onClick={() => navigateToUserGallery()}
            />
          </div>
        ) : null}

        {userType === "companion-provider" ||
          userType === "agency-business" ||
          userType === "client-hobbyist" ? (
          <div className="w-full mx-auto flex items-center justify-center sm:mt-6 mt-[16px]">
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
              className1="font-bold text-[15px] text-white"
              className2="w-[28.8px]"
              onClick={navigateToTrurevu}
            />
          </div>
        ) : null}

        {/* {userType === "companion-provider" ||
            userType === "agency-business" ||
            userType === "client-hobbyist" ||
            userType === "super" ? (
              <div className="w-full mx-auto flex items-center justify-center sm:mt-6 mt-[16px]">
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
            <div className="w-full mx-auto flex items-center justify-center sm:mt-6 mt-[16px]">
              <PersonalInformationBtn
                imgURL="images/MyVairifyIcon.png"
                alt="Follow Me"
                text="Follow Me"
                className="h-[47.7px]"
                className1="font-bold text-[15px] text-white"
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


      <Modal
        isOpen={qrOpen}
        //   onAfterOpen={afterMessageOpen}
        onRequestClose={() => setQrOpen(false)}
        className="max-w-[500px] bg-[#FFFFFF] relative rounded-2xl p-[24px] w-[90%] mx-auto"
        contentLabel="#"
      >
        <button
          onClick={() => setQrOpen(false)}
          className="absolute top-[24px] right-[24px]"
        >
          <img
            src="/images/home/modalClose.svg"
            alt="icon"
            width="20px"
            height="20px"
          />
        </button>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex relative justify-center mb-3">
            <p className="text-[20px] font-medium text-center text-black">
              Scan QR
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center mb-3">
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
      </Modal>
    </div>
  );
}
