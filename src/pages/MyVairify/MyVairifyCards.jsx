import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import MyVairifyService from "../../services/MyVairifyService";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Index";
import {
  HandleUpdateFavourites,
  HandleUpdateFollowers,
  HandleUpdateUser,
} from "../../redux/action/Auth";

const MyVairifyCards = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const userType = UserData?.user_type;
  const [followLoading, setFollowLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    option1: false,
    option2: false,
    option3: false,
  });
  const [selectedNotifyPost, setSelectedNotifyPost] = useState(false);
  const [selectedNotifyTrurevu, setSelectedNotifyTrurevu] = useState(false);
  const [selectedNotifyPostGalleryImage, setSelectedNotifyPostGalleryImage] =
    useState(false);
  const [notifyPostLoading, setNotifyPostLoading] = useState(false);
  const [notifyTrurevuLoading, setNotifyTrurevuLoading] = useState(false);
  const [notifyPostGalleryImageLoading, setNotifyPostGalleryImageLoading] =
    useState(false);
  const rate = UserDetails?.market
    ? UserDetails?.item?.userId?.averageRating
    : UserData?.averageRating;

  const toggleCheckbox = (option) => {
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [option]: !prevCheckboxes[option],
    }));
  };

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      if (isFollowed(state?._id)) {
        await MyVairifyService.removeFollow(state?._id, {
          userId: UserData?._id,
        });

        await dispatch(HandleUpdateFollowers(UserData?._id));

        await MyVairifyService.getNotifyRules(state?._id, UserData?._id).then(
          (response) => {
            setSelectedNotifyPost(response?.isNotifyWhenPost);
            setSelectedNotifyTrurevu(response?.isNotifyWhenNewReview);
            setSelectedNotifyPostGalleryImage(
              response?.isNotifyWhenNewGallaryImagePost
            );
          }
        );
        toast.success("Successfully unfollowed!");
      } else {
        await MyVairifyService.addFollow(state?._id, { userId: UserData?._id });
        await dispatch(HandleUpdateFollowers(UserData?._id));
        toast.success("Successfully followed!");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setFollowLoading(false);
    }
  };

  const isFollowed = useCallback(
    (id) => {
      let result = UserData?.followers?.find(
        (item) => item?._id === id || item?.userId === id
      );
      if (result) {
        return true;
      } else {
        return false;
      }
    },
    [UserData]
  );

  const isFavorite = useCallback(
    (id) => {
      let result = UserData?.favourites?.find(
        (item) => item?.favourite_id === id
      );
      if (result) {
        return true;
      } else {
        return false;
      }
    },
    [UserData]
  );

  const handleFavorite = async () => {
    try {
      setFavoriteLoading(true);
      if (isFavorite(state?._id)) {
        await MyVairifyService.removeFavorite(UserData?._id, {
          userId: state?._id,
        });
        await dispatch(HandleUpdateFavourites(UserData?._id));
        toast.success("Successfully removed from favourites!");
      } else {
        await MyVairifyService.addFavorite(UserData?._id, {
          userId: state?._id,
        });
        await dispatch(HandleUpdateFavourites(UserData?._id));
        toast.success("Successfully added to favourites!");
      }
    } catch (error) {
      toast.error("Unable to perform this action!");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleNotifyPost = async () => {
    try {
      setNotifyPostLoading(true);
      // api call
      await MyVairifyService.updateWhenToNotify(UserData?._id, {
        followerId: state?._id,
        isNotifyWhenPost: !selectedNotifyPost,
      });
      setSelectedNotifyPost(!selectedNotifyPost);
      toast.success("Sucessfully changed notify on post!");
    } catch (error) {
      toast.error("Unable to change notify on post!");
    } finally {
      setNotifyPostLoading(false);
    }
  };

  const handleNotifyTrurevu = async () => {
    try {
      setNotifyTrurevuLoading(true);
      // api call
      await MyVairifyService.updateWhenToNotify(UserData?._id, {
        followerId: state?._id,
        isNotifyWhenNewReview: !selectedNotifyTrurevu,
      });
      setSelectedNotifyTrurevu(!selectedNotifyTrurevu);
      toast.success("Sucessfully changed notify on trurevu!");
    } catch (error) {
      toast.error("Unable to change notify on trurevu!");
    } finally {
      setNotifyTrurevuLoading(false);
    }
  };

  const handleNotifyPostGalleryImage = async () => {
    try {
      setNotifyPostGalleryImageLoading(true);
      // api call
      await MyVairifyService.updateWhenToNotify(UserData?._id, {
        followerId: state?._id,
        isNotifyWhenNewGallaryImagePost: !selectedNotifyPostGalleryImage,
      });
      setSelectedNotifyPostGalleryImage(!selectedNotifyPostGalleryImage);
      toast.success("Sucessfully changed notify on post gallery image!");
    } catch (error) {
      toast.error("Unable to change notify on post gallery image!");
    } finally {
      setNotifyPostGalleryImageLoading(false);
    }
  };

  useEffect(() => {
    if (isFollowed(state?._id)) {
      MyVairifyService.getNotifyRules(UserData?._id, state?._id).then(
        (response) => {
          setSelectedNotifyPost(response?.isNotifyWhenPost);
          setSelectedNotifyTrurevu(response?.isNotifyWhenNewReview);
          setSelectedNotifyPostGalleryImage(
            response?.isNotifyWhenNewGallaryImagePost
          );
        }
      );
    }
  }, []);

  const updateNotificationSettings = async (updatedCheckboxes) => {
    try {
      const payload = {
        userId: state._id,
        isNotifyWhenPost: updatedCheckboxes.isNotifyWhenPost,
        isNotifyWhenNewPost: updatedCheckboxes.isNotifyWhenNewPost,
        isNotifyWhenNewGallaryImagePost:
          updatedCheckboxes.isNotifyWhenNewGallaryImagePost,
      };
      const result = await MyVairifyService.updateNotifications(
        UserDetails._id,
        payload
      );
      toast.success(result.message);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  if (followLoading) {
    return (
      <div className="main-container h-full">
        <div className="h-full flex justify-center items-center">
          <div className="mt-[20px]">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-2xl ">
      <div className="w-full mx-auto flex flex-row justify-between items-start mt-4 relative social-heading pt-[20px]">
        <div className="flex flex-col items-center justify-center leading-[18px] mx-[10px]">
          <div>
            <span className="text-[20px] text-[#040C50] font-extrabold font-Roboto-Serif">
              VAI
              <span className="text-[20px] text-[#040C50] font-semibold font-Roboto-Serif">
                RIFY ID
              </span>
            </span>
          </div>
          <div>
            <span className="text-[15px] text-[#01195C] font-bold sub-title-class val-id uppercase">
              {state?.vaiID ? <>{state?.vaiID}</> : <>{UserData?.vaiID}</>}
            </span>
          </div>
        </div>

        <div className="w-[140px] absolute inset-x-0 top-[-55px] left-[0px] mx-auto image-sr">
          <div
            style={{ left: "0px", bottom: "65px", zIndex: 50 }}
            className="w-full h-full rounded-full"
          >
            <img
              className="md:min-w-[120px] md:max-w-[120px] md:w-[120px] md:h-[120px] min-w-[100px] max-w-[100px] w-[100px] h-[100px] rounded-[100px] my-1 mx-auto"
               src={
                state?.profilePic
                  ? import.meta.env.VITE_APP_S3_IMAGE +
                    `/${state?.profilePic}`
                  : state?.gender === "Male"
                  ? "/images/male.png"
                  : "/images/female.png"
              }
              // src={
              //   state?.profilePic
              //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
              //       `/${state?.profilePic}`
              //     : state?.gender === "Male"
              //     ? "/images/male.png"
              //     : "/images/female.png"
              // }
              alt="Hot Rod"
            />
          </div>
          {state?._id !== UserData?._id && (
            <div
              style={{ right: "22px", top: "5.1rem", zIndex: 51 }}
              className="absolute"
              onClick={() => {
                followLoading ? null : handleFollow();
              }}
            >
              {state?.userType === "client-hobbyist" ? (
                <img
                  src={import.meta.env.BASE_URL + "images/HotRodIcon2.png"}
                  alt="Sugar Icon"
                  className={`${isFollowed(state?._id) ? "" : "grayscale"}`}
                />
              ) : null}
              {state?.userType === "companion-provider" ? (
                <img
                  src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
                  alt="Intimate Message Icon"
                  className={`${isFollowed(state?._id) ? "" : "grayscale"}`}
                />
              ) : null}
              {state?.userType === "agency-business" || userType === "super" ? (
                <img
                  src={
                    import.meta.env.BASE_URL + "images/IntimateMassageIcon2.png"
                  }
                  alt="Hod Rod Icon"
                  className={`${isFollowed(state?._id) ? "" : "grayscale"}`}
                />
              ) : null}
            </div>
          )}
        </div>

        <div className="leading-[18px] mx-[10px]">
          <div>
            <span className="text-[20px] text-[#040C50] font-extrabold font-Roboto-Serif">
            TruRevu
            </span>
          </div>
          <div className="flex flex-row justify-center items-center trurevu-star">
            <FontAwesomeIcon
              icon={faStar}
              color={state?.averageRating >= 1 ? "#E1AB3F" : "#111"}
              className="text-[10px] margin-right-5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={state?.averageRating >= 2 ? "#E1AB3F" : "#111"}
              className="text-[10px] margin-right-5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={state?.averageRating >= 3 ? "#E1AB3F" : "#111"}
              className="text-[10px] margin-right-5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={state?.averageRating >= 4 ? "#E1AB3F" : "#111"}
              className="text-[10px] margin-right-5"
            />
            <FontAwesomeIcon
              icon={faStar}
              color={state?.averageRating >= 5 ? "#E1AB3F" : "#111"}
              className="text-[10px] margin-right-5"
            />
            <span className="text-[15px] text-[#01195C] font-bold sub-title-class val-id">
              {state?.averageRating === 0
                ? state?.averageRating
                : state?.averageRating?.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="text-[24px] font-extrabold capitalize">{state?.name}</div>

      <div className="mx-5 mt-2">
        <div className="text-[22px] font-bold text-left mt-1 mb-5">Social</div>
        <div className="flex flex-row justify-between items-center social-border fav-follow">
          <div className="text-[18px] opacity-70 font-semibold text-left mt-1 mb-2 follow-class sub-title-class">
            Favorites
          </div>
          {favoriteLoading ? (
            <div className="flex flex-row justify-between items-right">
              <span
                className={`w-full relative text-[15px] font-semibold text-black text-center px-3`}
              >
                Loading...
              </span>
            </div>
          ) : (
            <button
              className={`w-[110px] flex flex-row justify-between  items-right ${
                isFavorite(state?._id)
                  ? "personal-information-btn-2-active"
                  : "personal-information-btn-2"
              } h-[34px] leading-[34px] rounded-[5px] mb-[12px]`}
              onClick={handleFavorite}
              disabled={favoriteLoading}
            >
              <span
                className={`w-full relative text-[15px] font-semibold ${
                  isFavorite(state?._id) ? "text-black" : "text-white"
                } text-center px-3`}
              >
                {isFavorite(state?._id) ? "Unfavorites" : "Favorites"}
              </span>
            </button>
          )}
        </div>
        <div className="flex flex-row justify-between items-center social-border">
          <div className="text-[18px] opacity-70 font-semibold text-left mt-1 mb-2 follow-class sub-title-class">
            Follow
          </div>

          {followLoading ? (
            <div className="flex flex-row justify-between items-right">
              <span
                className={`w-full relative text-[15px] font-semibold text-black text-center px-3`}
              >
                Loading...
              </span>
            </div>
          ) : (
            <button
              className={`w-[110px] flex flex-row justify-between  items-right ${
                isFollowed(state?._id)
                  ? "personal-information-btn-2-active"
                  : "personal-information-btn-2"
              } h-[34px] leading-[34px] rounded-[5px] mb-[10px]`}
              onClick={handleFollow}
              disabled={followLoading}
            >
              <span
                className={`w-full relative text-[15px] font-semibold ${
                  isFollowed(state?._id) ? "text-black" : "text-white"
                } text-center px-3`}
              >
                {isFollowed(state?._id) ? "Following" : "Follow"}
              </span>
            </button>
          )}
        </div>
      </div>

      {isFollowed(state?._id) && (
        <div className="mx-5">
          <div className="text-[22px] font-bold text-left mt-8 mb-5">
            Notifications
          </div>
          <div className="flex flex-row justify-between items-center social-border fav-follow">
            <div className="text-[18px] opacity-70 font-semibold text-left mt-1 mb-[12px] sub-title-class">
              Notify when post
            </div>
            <div className="switch-container mb-[12px]">
              <input
                type="checkbox"
                id="yesCheckbox1"
                checked={selectedNotifyPost}
                onChange={handleNotifyPost}
                className="hidden"
                disabled={notifyPostLoading}
              />
              <label
                htmlFor="yesCheckbox1"
                className={`border-[#4CAF50] switch-button ${
                  selectedNotifyPost ? "active" : "text-black"
                }`}
              >
                Yes
              </label>
              <label
                htmlFor="yesCheckbox1"
                className={`border-[#4CAF50] switch-button ${
                  !selectedNotifyPost ? "active" : "text-black"
                }`}
              >
                No
              </label>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center social-border fav-follow">
            <div className="text-[18px] opacity-70 font-semibold text-left mt-1 mb-[12px] sub-title-class">
              Notify when New TruRevu is posted
            </div>
            <div className="switch-container mb-[12px]">
              <input
                type="checkbox"
                id="yesCheckbox2"
                checked={selectedNotifyTrurevu}
                onChange={handleNotifyTrurevu}
                className="hidden"
                disabled={notifyTrurevuLoading}
              />
              <label
                htmlFor="yesCheckbox2"
                className={`border-[#4CAF50] switch-button ${
                  selectedNotifyTrurevu ? "active" : "text-black"
                }`}
              >
                Yes
              </label>
              <label
                htmlFor="yesCheckbox2"
                className={`border-[#4CAF50] switch-button ${
                  !selectedNotifyTrurevu ? "active" : "text-black"
                }`}
              >
                No
              </label>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center social-border">
            <div className="text-[18px] opacity-70 font-semibold text-left mt-1 mb-[12px] sub-title-class">
              Notify when new gallery image is posted
            </div>
            <div className="switch-container mb-[12px]">
              <input
                type="checkbox"
                id="yesCheckbox3"
                checked={selectedNotifyPostGalleryImage}
                onChange={handleNotifyPostGalleryImage}
                className="hidden"
                disabled={notifyPostGalleryImageLoading}
              />
              <label
                htmlFor="yesCheckbox3"
                className={`border-[#4CAF50] switch-button ${
                  selectedNotifyPostGalleryImage ? "active" : "text-black"
                }`}
              >
                Yes
              </label>
              <label
                htmlFor="yesCheckbox3"
                className={`border-[#4CAF50] switch-button ${
                  !selectedNotifyPostGalleryImage ? "active" : "text-black"
                }`}
              >
                No
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVairifyCards;
