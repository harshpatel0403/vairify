import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback } from "react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import BaseAPI from "../../../BaseAPI";
import { useDispatch, useSelector } from "react-redux";
import MyVairifyService from "../../../services/MyVairifyService";
import { toast } from "react-toastify";
import { HandleUpdateFollowers } from "../../../redux/action/Auth";

export default function PostDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const likedByUser = state?.likes?.includes(UserDetails?._id);

  const [followLoading, setFollowLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      if (isFollowed(state?.userId?._id)) {
        await MyVairifyService.removeFollow(state?.userId?._id, {
          userId: UserDetails?._id,
        });
        dispatch(HandleUpdateFollowers(UserDetails?._id));
        toast.success("Successfully unfollowed!");
      } else {
        await MyVairifyService.addFollow(state?.userId?._id, {
          userId: UserDetails?._id,
        });
        await dispatch(HandleUpdateFollowers(UserDetails?._id));
        toast.success("Successfully followed!");
      }
    } catch (error) {
      toast.error(`Unable to follow! ${error.response.message}`);
    } finally {
      setFollowLoading(false);
    }
  };

  const isFollowed = useCallback(
    (id) => {
      let result = UserDetails?.followers?.find((item) => item._id === id);
      if (result) {
        return true;
      } else {
        return false;
      }
    },
    [UserDetails]
  );

  return (
    <div>
      <div className="main-container">
        <div className="w-full mx-auto flex flex-col justify-center items-center ">
          <div className="w-full mx-auto flex flex-row justify-between items-start pt-4">
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
                  {state?.userId?.vaiID}
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
                    state?.userId?.profilePic
                      ? `${import.meta.env.VITE_APP_S3_IMAGE
                      }/${state?.userId?.profilePic}`
                      : state?.gender === "Male"
                        ? "/images/male.png"
                        : "/images/female.png"
                  }
                  // src={
                  //   state?.userId?.profilePic
                  //     ? `${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL
                  //     }/${state?.userId?.profilePic}`
                  //     : state?.gender === "Male"
                  //       ? "/images/male.png"
                  //       : "/images/female.png"
                  // }
                  alt="User"
                  className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                />
              </div>

              {state?.userId?._id !== UserDetails?._id && (
                <div
                  style={{ right: "0px", top: "25px" }}
                  className="absolute"
                  onClick={() => (followLoading ? null : handleFollow())}
                >
                  {state.userId?.user_type === "client-hobbyist" ? (
                    <img
                      src={import.meta.env.BASE_URL + "images/HotRodIcon2.png"}
                      alt="Sugar Icon"
                      className={`${isFollowed(state?.userId?._id) ? "" : "grayscale"
                        }`}
                    />
                  ) : null}
                  {state.userId?.user_type === "companion-provider" ? (
                    <img
                      src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
                      alt="Intimate Message Icon"
                      className={`${isFollowed(state?.userId?._id) ? "" : "grayscale"
                        }`}
                    />
                  ) : null}
                  {state.userId?.user_type === "agency-business" ||
                    state.userId?.user_type === "super" ? (
                    <img
                      src={
                        import.meta.env.BASE_URL +
                        "images/IntimateMassageIcon2.png"
                      }
                      alt="Hod Rod Icon"
                      className={`${isFollowed(state?.userId?._id) ? "" : "grayscale"
                        }`}
                    />
                  ) : null}
                </div>
              )}
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
                  color={state?.userId?.averageRating >= 1 ? "#E1AB3F" : "#111"}
                  className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
                />
                <FontAwesomeIcon
                  icon={faStar}
                  color={state?.userId?.averageRating >= 2 ? "#E1AB3F" : "#111"}
                  className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
                />
                <FontAwesomeIcon
                  icon={faStar}
                  color={state?.userId?.averageRating >= 3 ? "#E1AB3F" : "#111"}
                  className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
                />
                <FontAwesomeIcon
                  icon={faStar}
                  color={state?.userId?.averageRating >= 4 ? "#E1AB3F" : "#111"}
                  className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
                />
                <FontAwesomeIcon
                  icon={faStar}
                  color={state?.userId?.averageRating >= 5 ? "#E1AB3F" : "#111"}
                  className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
                />
                <span className="text-[15px] text-[#040C50] font-bold ml-0.5">
                  {(state?.userId?.averageRating || 0).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
            <span className="font-bold text-[24px] capitalize">
              {state?.userId?.name}
            </span>
          </div>
        </div>
      </div>
      <div className="gap-6 flex items-center mb-1 justify-between p-3 ">
        {UserDetails?._id === state?.userId?._id ? (
          <div className="mt-2"></div>
        ) : (
          <div className="mt-2">
            {UserDetails?.user_type === "client-hobbyist" ? (
              <button
                className="text-[14px] border-[2px] rounded-full px-2 py-[3px] mt-0 text-white bg-[#02227E] font-roboto  border-[#0198FE]"
                onClick={() => {
                  navigate(`/varidate/select-date/${state?.userId?._id}`);
                }}
              >
                Request <span className="font-bold">VAI</span>
                <span>RIDATE</span>
              </button>
            ) : (
              ""
            )}
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[12px] text-[#01195C] font-bold font-700">
              {state?.likes?.length}
            </span>
            <span className="text-[12px] text-[#01195C] font-bold font-700">
              {`Like${state?.likes?.length > 1 ? "s" : ""}`}
            </span>

            <img
              src={likedByUser ? "/images/likes.png" : "/images/like.png"}
              className="w-[25px]"
            />
          </div>
          <div
            className="flex items-center gap-1"
            onClick={() =>
              navigate("/user/comments", {
                state: state,
              })
            }
          >
            <span className="text-[12px] text-[#01195C] font-bold font-700">
              {state?.comments?.length}
            </span>
            <span className="text-[12px] text-[#01195C] font-bold font-700">
              {`Comment${state?.comments?.length > 1 ? "s" : ""}`}
            </span>

            <img className="w-[25px]" src="/images/Vector (1).png" />
          </div>
        </div>
      </div>
      <div className="px-px">
        <img
          src={`${import.meta.env.VITE_APP_S3_IMAGE}/${state?.image
            }`}
          className="rounded-t-[15px] max-w-[362px] w-full mx-auto "
        />
        {state?.message === 'undefined' ? (<></>) : (
          <div className="pt-[8px] pb-[8px] rounded-b-[15px] bg-[#3760CB69] max-w-[362px] w-full mx-auto">
            <h2 className="text-[16px] font-bold text-[#02227E]  mx-auto max-w-[300px]  sm:max-w-auto text-center ">
              {state?.message}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
