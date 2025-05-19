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
import Button from "../../components/Button";
import PageTitle from "../../components/PageTitle";

const MyVairifyCards = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (state?._id) {
      dispatch(HandleUpdateFollowers(UserData?._id))
      dispatch(HandleUpdateFavourites(UserData?._id))
    }
  }, [state]);

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
      console.error(error)
      toast.error("Unable to perform this action!");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleNotifyPost = async (e) => {
    try {
      setNotifyPostLoading(true);
      const checkbox = document.getElementsByName("notify-post")[0]
      checkbox.checked = e.target.checked;

      // api call
      await MyVairifyService.updateWhenToNotify(state?._id, {
        followerId: UserData?._id,
        isNotifyWhenPost: e.target.checked,
      });
      toast.success(`Sucessfully changed notify ${e.target.checked ? "on" : "off"} post!`);
    } catch (error) {
      toast.error("Unable to change notify on post!");
    } finally {
      setNotifyPostLoading(false);
    }
  };

  const handleNotifyTrurevu = async (e) => {
    try {
      setNotifyTrurevuLoading(true);
      const checkbox = document.getElementsByName("notify-trurevu")[0]
      checkbox.checked = e.target.checked;

      // api call
      await MyVairifyService.updateWhenToNotify(state?._id, {
        followerId: UserData?._id,
        isNotifyWhenNewReview: e.target.checked,
      });
      toast.success(`Sucessfully changed notify ${e.target.checked ? "on" : "off"} trurevu!`);
    } catch (error) {
      toast.error("Unable to change notify on trurevu!");
    } finally {
      setNotifyTrurevuLoading(false);
    }
  };

  const handleNotifyPostGalleryImage = async (e) => {
    try {
      setNotifyPostGalleryImageLoading(true);
      const checkbox = document.getElementsByName("notify-gallery-post")[0]
      checkbox.checked = e.target.checked;
      // api call
      await MyVairifyService.updateWhenToNotify(state?._id, {
        followerId: UserData?._id,
        isNotifyWhenNewGallaryImagePost: e.target.checked,
      });
      toast.success(`Sucessfully changed notify ${e.target.checked ? "on" : "off"} post gallery image!`);
    } catch (error) {
      toast.error("Unable to change notify on post gallery image!");
    } finally {
      setNotifyPostGalleryImageLoading(false);
    }
  };

  useEffect(() => {
    if (isFollowed(state?._id)) {

      MyVairifyService.getNotifyRules(state?._id, UserData?._id).then(
        (response) => {
          const notifyPost = document.getElementsByName("notify-post")[0]
          notifyPost.checked = response?.isNotifyWhenPost ? true : false;

          const notifyTrurevu = document.getElementsByName("notify-trurevu")[0]
          notifyTrurevu.checked = response?.isNotifyWhenNewReview ? true : false;

          const notifyGalleryPost = document.getElementsByName("notify-gallery-post")[0]
          notifyGalleryPost.checked = response?.isNotifyWhenNewGallaryImagePost ? true : false;
        }
      );
    }
  }, [UserData?._id, state?._id]);

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
    <div className="h-full rounded-2xl container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"My VAIRIFY"} />
      </div>
      <div className="w-full mx-auto items-start mt-4 relative">
        <div className="flex gap-[24px] md:flex-nowrap flex-wrap">
          {isFollowed(state?._id) ? (
            <div
              className="w-fit sm:bg-[#FFFFFF0A] sm:p-[16px] rounded-[16px] w-full lg:max-w-[350px] flex flex-col "
            >
              <div
                className="flex justify-center items-center "
              >
                <div className="relative">

                  <img
                    src={
                      state?.profilePic
                        ? import.meta.env.VITE_APP_S3_IMAGE +
                        `/${state?.profilePic}`
                        : state?.gender === "Male"
                          ? "/images/male.png"
                          : "/images/female.png"
                    }
                    className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                    alt="Hot Rod"
                  />

                </div>


              </div>
              <div className="w-full mx-auto flex flex-row justify-around items-start gap-[24px] mt-[24px]">

                <div className="flex flex-col items-center justify-center  w-full ">
                  <div className="text-white text-sm opacity-[0.6] font-normal  whitespace-nowrap">
                    VAIRIFY ID
                  </div>
                  <div className="text-base text-white font-semibold  whitespace-nowrap">
                    {state?.vaiID ? <>{state?.vaiID}</> : <>{UserData?.vaiID}</>}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center  w-full">
                  <div className="text-white text-sm opacity-[0.6] font-normal  whitespace-nowrap">
                    Name
                  </div>
                  <div className="text-base text-white font-semibold whitespace-nowrap">
                    {state?.name}
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
                <div className="mt-[24px] flex gap-[16px]">
                  <Button text={followLoading ?
                    (<Loading />) :
                    isFollowed(state?._id) ? 'Unfollow' : 'Follow'
                  } size={'36px'} className={'py-[4px]'} onClick={handleFollow} />
                  <Button text={favoriteLoading ? (<Loading className="!h-5 !w-5 flex-1" />) : isFavorite(state?._id) ? 'Favorited' : 'Favorites'} size={'36px'} className={'py-[4px] secondary-btn !bg-[#FFFFFF29]'} onClick={handleFavorite} showFavIcon={favoriteLoading ? false : true}>
                  </Button>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex justify-center items-center w-full">
              <div
                className="w-fit sm:bg-[#FFFFFF0A] sm:p-[16px] rounded-[16px] w-full lg:max-w-[350px] flex flex-col "
              >
                <div
                  className="flex justify-center items-center "
                >
                  <div className="relative">

                    <img
                      src={
                        state?.profilePic
                          ? import.meta.env.VITE_APP_S3_IMAGE +
                          `/${state?.profilePic}`
                          : state?.gender === "Male"
                            ? "/images/male.png"
                            : "/images/female.png"
                      }
                      className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                      alt="Hot Rod"
                    />

                  </div>


                </div>
                <div className="w-full mx-auto flex flex-row justify-around items-start gap-[24px] mt-[24px]">

                  <div className="flex flex-col items-center justify-center  w-full ">
                    <div className="text-white text-sm opacity-[0.6] font-normal  whitespace-nowrap">
                      VAIRIFY ID
                    </div>
                    <div className="text-base text-white font-semibold  whitespace-nowrap">
                      {state?.vaiID ? <>{state?.vaiID}</> : <>{UserData?.vaiID}</>}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center  w-full">
                    <div className="text-white text-sm opacity-[0.6] font-normal  whitespace-nowrap">
                      Name
                    </div>
                    <div className="text-base text-white font-semibold whitespace-nowrap">
                      {state?.name}
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
                  <div className="mt-[24px] flex gap-[16px]">
                    <Button text={followLoading ?
                      (<Loading />) :
                      isFollowed(state?._id) ? 'Unfollow' : 'Follow'
                    } size={'36px'} className={'py-[4px]'} onClick={handleFollow} />
                    <Button text={favoriteLoading ? (<Loading className="!h-5 !w-5 flex-1" />) : isFavorite(state?._id) ? 'Favorited' : 'Favorites'} size={'36px'} className={'py-[4px] secondary-btn !bg-[#FFFFFF29]'} onClick={handleFavorite} showFavIcon={favoriteLoading ? false : true}>
                    </Button>
                  </div>
                </div>



              </div>
            </div>
          )}

          {isFollowed(state?._id) && (
            <div className="w-full md:bg-[#FFFFFF0A] md:p-[16px] rounded-[16px] lg:block text-white">
              <div className="md:mx-5 ">
                <div className="text-[20px] text-white font-bold text-left mt-0 mb-5">
                  Notifications
                </div>
                <div className="flex flex-row justify-between items-center social-border fav-follow bg-[#FFFFFF14] rounded-[12px] p-[12px] mb-5">
                  <div className="sm:text-[18px] text-sm font-semibold text-lef sub-title-class">
                    Notify when post
                  </div>
                  <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="notify-post" value="" className="sr-only peer"
                        onChange={(e) => handleNotifyPost(e)} />
                      <div className="w-[33px] h-[20px] bg-[#FFFFFF] border border-[#FFFFFF] peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#060C4D] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#060C4D] after:border-[#060C4D] after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-green-500 peer-checked:border-none peer-checked:after:bg-[#FFFFFF] peer-checked:after:border-none"></div>
                    </label>
                  </div>

                </div>
                <div className="flex flex-row justify-between items-center social-border fav-follow bg-[#FFFFFF14] rounded-[12px] p-[12px] mb-5">
                  <div className="sm:text-[18px] text-sm font-semibold text-left sub-title-class">
                    Notify when New TruRevu is posted
                  </div>
                  <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="notify-trurevu" value="" className="sr-only peer"
                        onChange={(e) => handleNotifyTrurevu(e)} />
                      <div className="w-[33px] h-[20px] bg-[#FFFFFF] border border-[#FFFFFF] peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#060C4D] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#060C4D] after:border-[#060C4D] after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-green-500 peer-checked:border-none peer-checked:after:bg-[#FFFFFF] peer-checked:after:border-none"></div>
                    </label>
                  </div>

                </div>
                <div className="flex flex-row justify-between items-center social-border bg-[#FFFFFF14] rounded-[12px] p-[12px] mb-5">
                  <div className="sm:text-[18px] text-sm font-semibold text-left sub-title-class">
                    Notify when new gallery image is posted
                  </div>
                  <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="notify-gallery-post" value="" className="sr-only peer"
                        onChange={(e) => handleNotifyPostGalleryImage(e)} />
                      <div className="w-[33px] h-[20px] bg-[#FFFFFF] border border-[#FFFFFF] peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#060C4D] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#060C4D] after:border-[#060C4D] after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-green-500 peer-checked:border-none peer-checked:after:bg-[#FFFFFF] peer-checked:after:border-none"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyVairifyCards;
