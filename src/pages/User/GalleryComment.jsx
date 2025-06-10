import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PersonalComments from "../../components/PersonalComments";
import InputText from "../../components/InputText";
import UserGalleryService from "../../services/UserGalleryService";
import MyVairifyService from "../../services/MyVairifyService";
import { HandleUpdateFollowers } from "../../redux/action/Auth";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Index";

const GalleryComment = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [comments, setComments] = useState("");
  const [AllCommments, setAllComments] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);
  const [loading, setLoading] = useState();
  const userProfile = state?.userId || state?.user;

  const getComments = () => {
    setLoading(true);
    UserGalleryService.getSpeficComments(state?.personId, state?.item?._id)
      .then((res) => {
        console.log(res);
        setAllComments(res.comments);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getComments();
  }, [state]);

  const handelComments = (e) => {
    e.preventDefault();
    let body = {
      userId: state?.personId || UserDetails?._id,
      imageId: state?.item?._id,
      commentText: comments,
    };
    UserGalleryService.addComments(body)
      .then((res) => {
        console.log(res);
        setComments("");
        getComments();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      if (isFollowed(userProfile?._id || state?._id)) {
        await MyVairifyService.removeFollow(userProfile?._id, {
          userId: UserDetails?._id,
        });
        dispatch(HandleUpdateFollowers(UserDetails?._id));
        toast.success(t("gallerycomment.unfollowSuccess"));
      } else {
        await MyVairifyService.addFollow(userProfile?._id, {
          userId: UserDetails?._id,
        });
        await dispatch(HandleUpdateFollowers(UserDetails?._id));
        toast.success(t("gallerycomment.followSuccess"));
      }
    } catch (error) {
      console.log(error);
      toast.error(t("gallerycomment.followError"));
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

  if (loading) {
    return (

      <div className="flex justify-center align-center items-center pt-[48px]">
        <Loading />
      </div>
    )
  }
  else {
    return (
      <div className=" mb-[48px]">
        <div className="w-full mx-auto flex flex-col justify-center items-center">

          {/* <div className="w-full mx-auto flex flex-row justify-between items-start mt-4">
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
          <div className="my-6 flex w-full border-[#919EAB33] border-[2px] rounded-[16px] pr-4">
            <InputText
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              influencer-affiliate
              placeholder={"comment"}
              className={"h-[40px] text-[18px] font-normal text-white !border-0 w-full"}
            />
            <button
              onClick={(e) => handelComments(e)}
              className="w-[24px] ml-[20px] invert"
            >
              <img src="/public/images/comments.png" />
            </button>
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
        <div className="w-full mx-auto flex flex-col justify-center items-center pt-4">
          <span className="font-bold text-[24px]">{userProfile?.name}</span>
        </div> */}
          {/* <div className="w-full mx-auto flex flex-col justify-center items-center mt-9">
          <span className="font-bold text-[24px]">Comments</span>
        </div> */}
          <div className="w-full">
            {AllCommments &&
              AllCommments?.map((item, index) => {
                return (
                  <div key={index} className="w-full mx-auto mt-2">
                    <PersonalComments
                      userAvatar={`${import.meta.env.VITE_APP_S3_IMAGE
                        }/${item?.userId?.profilePic}`}
                      // userAvatar={`${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL
                      //   }/${item?.userId?.profilePic}`}
                      userName={item?.userId?.name}
                      duration={item?.timeAgo}
                      content={item?.commentText}
                      userNameColor={'!text-white'}
                    />
                  </div>
                );
              })}
          </div>
          <div className="sm:my-6 mt-4 flex w-full border-[#919EAB33] border-[2px] rounded-[16px] pr-4">
            <InputText
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              influencer-affiliate
              placeholder={t("gallerycomment.commentPlaceholder")}
              className={"h-[40px] text-[18px] font-normal text-white !border-0 w-full"}
            />
            <button
              onClick={(e) => handelComments(e)}
              className="w-[24px] ml-[20px] invert"
            >
              <img src="/images/comments.png" />
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default GalleryComment;
