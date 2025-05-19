import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyVairifyService from "../../services/MyVairifyService";
import { toast } from "react-toastify";
import { HandleGetProfile } from "../../redux/action/Profile";
import { HandleUpdateFollowers } from "../../redux/action/Auth";
import PageTitle from "../../components/PageTitle";

const AboutMe = (props) => {
  // const {
  //   state: { userData, isMarket },
  // } = useLocation();
  const location = useLocation();
  const userData = props.userData || location.state?.userData;
  const isMarket = props.isMarket ?? location.state?.isMarket;

  const userType = userData?.user_type ?? userData?.userType;
  const dispatch = useDispatch();
  const [userProfileData, setUserProfileData] = useState();
  useEffect(() => {
    if (userData?._id) {
      dispatch(HandleGetProfile(userData._id))
        .then((response) => {
          setUserProfileData(response?.payload);
        })
        .catch((error) => console.log(error));
      dispatch(HandleUpdateFollowers(ownDetails?._id))
    }
  }, [userData]);
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
      toast.error(error?.response?.data?.message || "Unable to follow!");
    } finally {
      setFollowLoading(false);
    }
  };


  return (
    <div className="container mb-[48px]">
      <div className=" lg:hidden block ">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"About Me"} />
        </div>
      </div>
      <div className="flex justify-center mt-[28px]">
        <div className="relative">
          <img
            src={
              userData?.profilePic
                ? `${import.meta.env.VITE_APP_S3_IMAGE}/${userData?.profilePic
                }`
                : userData?.gender === "Male"
                  ? "/images/male.png"
                  : "/images/female.png"
            }
            className="w-[100px] h-[100px] rounded-[125px] object-cover"
            alt={userData?.name}
          />
          {isMarket && (
            <div
              onClick={() => {
                followLoading ? null : handleFollow();
              }}
              style={{ right: "0px", bottom: "0px" }}
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
      </div>
      <div className="mt-[24px] flex sm:justify-around justify-between">
        <div className="flex flex-col justify-center items-center">
          <div className="text-white opacity-[0.6] text-sm font-normal">VAIRIFY ID</div>
          <p className="text-white font-semibold text-base uppercase mt-[4px]"> {userData.vaiID}</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-white opacity-[0.6] text-sm font-normal">Name</div>
          <p className="text-white font-semibold text-base mt-[4px]"> {userData?.name}</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-white opacity-[0.6] text-sm font-normal">TruRevu</div>
          <div className="flex gap-1 items-center">
            <p className="text-white font-semibold text-base mt-[4px]"> {userData.averageRating}</p>
            <img src="/images/home/star.svg" alt="rating" />
          </div>
        </div>
      </div>

      <div className="mt-[24px]">
        <p className="text-sm text-white font-normal text-center">
          {userProfileData?.description}
        </p>

      </div>
      <div className="mt-[24px] w-full bg-[#FFFFFF14] p-[16px] rounded-[16px]">
        <div class="flex justify-between gap-3">
          <p class="font-normal text-white text-sm opacity-[0.6]">Gender</p>
          <p class="font-medium text-white text-sm">{userData.gender ?? userProfileData.gender ?? "Not Specified"}</p>
        </div>
        <div class="flex justify-between gap-3 mt-[8px]">
          <p class="font-normal text-white text-sm opacity-[0.6]">Age</p>
          <p class="font-medium text-white text-sm">{userData.age ?? userProfileData?.age ?? "Not Specified"}</p>
        </div>
        <div class="flex justify-between gap-3 mt-[8px]">
          <p class="font-normal text-white text-sm opacity-[0.6]">Height</p>
          <p class="font-medium text-white text-sm">{userData.height ?? userProfileData?.height ?? "Not Specified"}</p>
        </div>
        <div class="flex justify-between gap-3 mt-[8px]">
          <p class="font-normal text-white text-sm opacity-[0.6]">Weight</p>
          <p class="font-medium text-white text-sm"> {userData.weight ?? userProfileData?.weight ?? "Not Specified"}</p>
        </div>

      </div>
    </div>
  );
};
export default AboutMe;
