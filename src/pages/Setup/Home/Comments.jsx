import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import PersonalComments from "../../../components/PersonalComments";
import { useLocation } from "react-router";
import InputText from "../../../components/InputText";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  HandleCommentsPost,
  HandleGetCommentsPost,
} from "../../../redux/action/MarketplaceSearch";
import MyVairifyService from "../../../services/MyVairifyService";
import { HandleUpdateFollowers } from "../../../redux/action/Auth";
import { toast } from "react-toastify";

export default function Comments() {
  const { state } = useLocation();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const dispatch = useDispatch();
  const AllCommments = useSelector((state) => state.Market.getAllPostComment);
  const [comments, setComments] = useState("");
  const [followLoading, setFollowLoading] = useState(false);

  const userProfile = state?.userId || state?.user;

  const HandleButton = () => {
    if (!comments) {
      return;
    }
    const body = {
      userId: UserDetails?._id,
      text: comments,
    };
    dispatch(HandleCommentsPost(state?._id, body))
      .then((result) => {
        if (result?.payload?.status === 200) {
          setComments("");
          dispatch(HandleGetCommentsPost(state?._id));
        }
      })
      .catch((err) => {
        console.error(err, "Error");
      });
  };

  useEffect(() => {
    if (state?._id) {
      dispatch(HandleGetCommentsPost(state?._id));
    }
  }, []);

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      if (isFollowed(userProfile?._id || state?._id)) {
        await MyVairifyService.removeFollow(userProfile?._id, {
          userId: UserDetails?._id,
        });
        dispatch(HandleUpdateFollowers(UserDetails?._id));
        toast.success("Successfully unfollowed!");
      } else {
        await MyVairifyService.addFollow(userProfile?._id, {
          userId: UserDetails?._id,
        });
        await dispatch(HandleUpdateFollowers(UserDetails?._id));
        toast.success("Successfully followed!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to follow!");
    } finally {
      setFollowLoading(false);
    }
  };

  const isFollowed = useCallback(
    (id) => {
      let result = UserDetails?.followers?.find(
        (item) => item?.userId === id || item?._id === id
      );
      if (result) {
        return true;
      } else {
        return false;
      }
    },
    [UserDetails]
  );

  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="w-full mx-auto flex flex-row justify-between items-start mt-4">
          <div className="flex flex-col items-center justify-center leading-[18px]">
            <div>
              <span className="text-[18px] text-[#040C50] font-extrabold font-Roboto-Serif">
                VAI
              </span>
              <span className="text-[18px] text-[#040C50] font-semibold font-Roboto-Serif">
                RIFY ID
              </span>
            </div>
            <div>
              <span className="text-[15px] text-[#040C50] font-bold uppercase">
                {userProfile?.vaiID}
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
                  userProfile?.profilePic
                    ? `${import.meta.env.VITE_APP_S3_IMAGE}/${
                        userProfile?.profilePic
                      }`
                    : state?.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
                }
                // src={
                //   userProfile?.profilePic
                //     ? `${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL}/${
                //         userProfile?.profilePic
                //       }`
                //     : state?.gender === "Male"
                //     ? "/images/male.png"
                //     : "/images/female.png"
                // }
                alt="User"
                className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
              />
            </div>
            {userProfile?._id !== UserDetails?._id && (
              <div
                style={{ right: "0px", top: "25px" }}
                className="absolute"
                onClick={() => {
                  followLoading ? null : handleFollow();
                }}
              >
                <img
                  src={"/images/SugarIcon2.png"}
                  alt="Crystal Icon"
                  className={`${
                    isFollowed(userProfile?._id) ? "" : "grayscale"
                  }`}
                />
              </div>
            )}
          </div>
          <div className="leading-[18px]">
            <div>
              <span className="text-[18px] text-[#040C50] font-bold font-Roboto-Serif">
                TruRevu
              </span>
            </div>
            <div className="flex flex-row justify-center items-center">
              <FontAwesomeIcon
                icon={faStar}
                color={userProfile?.averageRating >= 1 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={userProfile?.averageRating >= 2 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={userProfile?.averageRating >= 3 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={userProfile?.averageRating >= 4 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={userProfile?.averageRating >= 5 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <span className="text-[15px] text-[#040C50] font-bold ml-0.5">
                {(userProfile?.averageRating || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center py-5">
          <span className="font-bold text-[24px] capitalize">
            {userProfile?.name}
          </span>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-9">
          <span className="font-bold text-[24px]">Comments</span>
        </div>
        <div className="w-full max-h-[473px] overflow-scroll">
          {AllCommments &&
            AllCommments?.map((item, index) => {
              return (
                <div key={index} className="w-full mx-auto mt-9">
                  <PersonalComments
                    userAvatar={
                      item?.userId?.profilePic !== ""
                        ? `${
                            import.meta.env.VITE_APP_S3_IMAGE
                          }/${item?.userId?.profilePic}`
                        : item?.userId?.gender === "Male"
                        ? "/images/male.png"
                        : "/images/female.png"
                    }
                    // userAvatar={
                    //   item?.userId?.profilePic !== ""
                    //     ? `${
                    //         import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL
                    //       }/${item?.userId?.profilePic}`
                    //     : item?.userId?.gender === "Male"
                    //     ? "/images/male.png"
                    //     : "/images/female.png"
                    // }
                    userName={item?.userId?.name}
                    duration={item?.timeAgo}
                    content={item?.text}
                  />
                </div>
              );
            })}
        </div>
        <div className="mb-4 flex">
          <InputText
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            influencer-affiliate
            placeholder={"comment"}
            className={"h-[40px] text-[18px] font-bold text-gray"}
          />
          <button className="w-[35px] ml-[20px]" onClick={HandleButton}>
            <img src="/public/images/comments.png" />
          </button>
        </div>
      </div>
    </div>
  );
}
