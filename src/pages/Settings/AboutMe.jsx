import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyVairifyService from "../../services/MyVairifyService";
import { toast } from "react-toastify";
import { HandleGetProfile } from "../../redux/action/Profile";
import { HandleUpdateFollowers } from "../../redux/action/Auth";

const AboutMe = () => {
  const {
    state: { userData, isMarket },
  } = useLocation();
  const userType = userData?.user_type ?? userData?.userType;
  const dispatch = useDispatch();
  const [userProfileData, setUserProfileData] = useState();
  const [followLoading, setFollowLoading] = useState(false);
  const ownDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const isFollowed = useCallback(
    (id) => {
      let result = ownDetails?.followers?.find(
        (item) => item?.userId === id || item?._id === id
      );
      if (result) {
        return true;
      } else {
        return false;
      }
    },
    [userData]
  );

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      if (isFollowed(userData?._id)) {
        await MyVairifyService.removeFollow(userData?._id, {
          userId: ownDetails?._id,
        });
        dispatch(HandleUpdateFollowers(userData?._id));
        toast.success("Successfully unfollowed!");
      } else {
        await MyVairifyService.addFollow(userData?._id, {
          userId: ownDetails?._id,
        });
        await dispatch(HandleUpdateFollowers(userData?._id));
        toast.success("Successfully followed!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to follow!");
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      dispatch(HandleGetProfile(userData._id))
        .then((response) => {
          setUserProfileData(response?.payload);
        })
        .catch((error) => console.log(error));
    }
  }, [userData]);

  return (
    <div className="main-container px-3 pb-6 gap-2 flex flex-col">
      <div className="w-full mx-auto flex flex-row justify-between items-start mt-4">
        <div className="flex flex-col items-center justify-center leading-[18px]">
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
              {userData.vaiID}
            </span>
          </div>
        </div>
        <div className="w-[120px] relative">
          <div
            style={{ left: "0px", bottom: "65px" }}
            className="absolute w-full h-full rounded-full"
          >
            <img
              src={
                userData?.profilePic
                  ? `${import.meta.env.VITE_APP_S3_IMAGE}/${userData?.profilePic
                  }`
                  : userData?.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
              }
              // src={
              //   userData?.profilePic
              //     ? `${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL}/${userData?.profilePic
              //     }`
              //     : userData?.gender === "Male"
              //       ? "/images/male.png"
              //       : "/images/female.png"
              // }
              className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
              alt={userData?.name}
            />
          </div>

          {isMarket && (
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
                  className={`${isFollowed(userData?._id) ? "" : "grayscale"}`}
                />
              ) : null}
              {userType === "companion-provider" ? (
                <img
                  src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
                  alt="Sugar Icon Second"
                  className={`${isFollowed(userData?._id) ? "" : "grayscale"}`}
                />
              ) : null}
              {userType === "agency-business" || userType === "super" ? (
                <img
                  src={
                    import.meta.env.BASE_URL + "images/IntimateMassageIcon2.png"
                  }
                  alt="Sugar Icon Second"
                  className={`${isFollowed(userData?._id) ? "" : "grayscale"}`}
                />
              ) : null}
            </div>
          )}
        </div>
        <div className="leading-[18px]">
          <div>
            <span className="text-[18px] text-[#040C50] font-bold">
              TruRevu
            </span>
          </div>

          <div className="flex justify-center items-center">
            <FontAwesomeIcon
              icon={faStar}
              color={userData.averageRating >= 1 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={userData.averageRating >= 2 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={userData.averageRating >= 3 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={userData.averageRating >= 4 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={userData.averageRating >= 5 ? "#E1AB3F" : "#111"}
              className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
            />
            <span className="text-[15px] text-[#040C50] font-bold ml-0.5">
              {userData.averageRating}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
        <span className="font-bold text-[24px] capitalize">
          {userData?.name}
        </span>
      </div>
      <div className="about-me-data mt-2 inner-content-part-data form-field-container">
        <h4 className="font-bold text-[28px] capitalize color-[#000]">
          About me
        </h4>
        <div className="bg-[#d4d5d7] p-3 my-3 mx-auto">
          <p className="text-[16px] tracking-wide">
            {userProfileData?.description}
          </p>
        </div>
        <div className="form-field-container mt-10">
          <div className="personal-details-con w-full">
            <h6 className="text-left mb-4 font-bold text-[18px] capitalize color-[#000]">
              My Details
            </h6>
            <div className="grid grid-cols-11 gap-2 text-start">
              <p className="font-bold col-span-3">Gender</p>
              <p className="font-bold">:</p>
              <p className="col-span-7">
                {userData.gender ?? userProfileData.gender ?? "Not Specified"}
              </p>
              <p className="font-bold col-span-3">Age</p>
              <p className="font-bold">:</p>
              <p className="col-span-7">
                {userData.age ?? userProfileData?.age ?? "Not Specified"}
              </p>
              <p className="font-bold col-span-3">Height</p>
              <p className="font-bold">:</p>
              <p className="col-span-7">
                {userData.height ?? userProfileData?.height ?? "Not Specified"}
              </p>
              <p className="font-bold col-span-3">Weight</p>
              <p className="font-bold">:</p>
              <p className="col-span-7">
                {userData.weight ?? userProfileData?.weight ?? "Not Specified"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutMe;
