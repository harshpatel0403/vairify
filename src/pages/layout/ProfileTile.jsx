/* eslint-disable react/prop-types */

import { useCallback, useState } from "react";
import MyVairifyService from "../../services/MyVairifyService";
import { HandleUpdateFollowers } from "../../redux/action/Auth";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const usersTypes = Object.freeze({
  clientHobbyist: "client-hobbyist",
  companionProvider: "companion-provider",
  agencyBusiness: "agency-business",
});

const ProfileTile = ({ userDetails, currentUserDetails }) => {
  const dispatch = useDispatch();
  const [followLoading, setFollowLoading] = useState(false);
  const userType =
    userDetails?.market || userDetails?.vairipay
      ? userDetails?.user?.userId?.user_type ||
        userDetails?.user?.user_type ||
        userDetails?.user?.userType
      : currentUserDetails.user_type;
  const userId = userDetails?.user?.userId?._id || userDetails?.user?._id;

  const isFollowed = useCallback(
    (id) => {
      let result = currentUserDetails?.followers?.find(
        (item) => item?.userId === id || item?._id === id
      );

      return !!result;
    },
    [currentUserDetails]
  );

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      if (isFollowed(userId)) {
        await MyVairifyService.removeFollow(userId, {
          userId: currentUserDetails?._id,
        });
        dispatch(HandleUpdateFollowers(currentUserDetails?._id));
        toast.success("Successfully unfollowed!");
      } else {
        await MyVairifyService.addFollow(userId, {
          userId: currentUserDetails?._id,
        });
        await dispatch(HandleUpdateFollowers(currentUserDetails?._id));
        toast.success("Successfully followed!");
      }
    } catch (error) {
      toast.error(
        `Unable to follow!, ${error?.response?.data?.error || error.message}`
      );
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="w-full text-[#040C50] font-Roboto-Serif mx-auto flex flex-col justify-center items-center px-2 ">
      <div className="w-full mx-auto flex flex-row justify-between items-start leading-[18px]">
        <div>
          <p className="text-[18px] pt-4">
            <span className="font-extrabold">VAI</span>
            <span className="font-semibold">RIFY ID</span>
          </p>
          <p className="text-[15px] font-bold uppercase">
            {userDetails?.user?.vaiID}
          </p>
        </div>
        <div className="w-[120px] h-[60px] relative">
          <div
            style={{ left: "-5px", bottom: "0px" }}
            className="absolute w-full rounded-full"
          >
            <img
              src={
                userDetails?.user?.profilePic
                  ? userDetails?.user?.profilePic
                  : userDetails?.user?.gender === "male"
                  ? "/images/male.png"
                  : "/images/female.png"
              }
              alt={userDetails?.user?.name}
              className="aspect-square object-cover rounded-full overflow-hidden bg-[#fff] border-2 border-white w-full h-full"
            />
          </div>
          {(userDetails?.userId ?? userDetails?.user?._id) !=
            currentUserDetails?._id && (
            <div
              onClick={() => {
                followLoading ? null : handleFollow();
              }}
              style={{ right: "5px", top: "20px" }}
              className="absolute"
            >
              <img
                src={`${import.meta.env.BASE_URL}${
                  userType === usersTypes.clientHobbyist
                    ? "images/HotRodIcon2.png"
                    : userType === usersTypes.companionProvider
                    ? "images/SugarIcon2.png"
                    : userType === usersTypes.agencyBusiness
                    ? "images/IntimateMassageIcon2.png"
                    : "images/HotRodIcon2.png"
                }`}
                alt="Follow"
                className={`${isFollowed(userId) ? "" : "grayscale"}`}
              />
            </div>
          )}
        </div>
        <div className="pt-4">
          <p>
            <span className="text-[18px] font-bold">TruRevu</span>
          </p>
          <div className="flex flex-row justify-center items-center">
            {Array.from(
              {
                length: userDetails?.user?.averageRating || 0,
              },
              (_, index) => index
            )?.map((rating) => (
              <img
                key={rating}
                src="/images/Star.svg"
                className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
                alt=""
              />
            ))}
            {Array.from(
              {
                length: 5 - Math.floor(userDetails?.user?.averageRating),
              },
              (_, index) => index
            )?.map((rating) => (
              <img
                key={rating}
                src="/images/StarUnfilled.svg"
                className="drop-shadow-[1px_1px_0px_#111] text-[10px] mr-0.5"
                alt=""
              />
            ))}
            <span className="text-[15px] font-bold ml-0.5">
              {(userDetails?.user?.averageRating || 0).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      <p className="font-bold text-[20px] capitalize">
        {userDetails?.user?.name}
      </p>
    </div>
  );
};

export default ProfileTile;
