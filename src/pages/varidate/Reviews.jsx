import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import PersonalReview from "./PersonalReview";
import { useLocation } from "react-router-dom";
import VaridateService from "../../services/VaridateServices";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import MyVairifyService from "../../services/MyVairifyService";
import { HandleUpdateFollowers } from "../../redux/action/Auth";
import Loading from "../../components/Loading/Index";
import PageTitle from "../../components/PageTitle";

export default function Reviews(props) {
  const location = useLocation();
  const appointment = props?.location?.state || location?.state;
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const usrToShowDetails =
    appointment?.from === "manual"
      ? appointment?.appointment[
      appointment?.userType === "client-hobbyist"
        ? "companionId"
        : "clientId"
      ]
      : appointment?.userId
        ? appointment
        : UserDetails;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  const [staff, setStaff] = useState("Reviewed");
  const toggle = (props) => {
    setStaff(props);
  };

  const [followLoading, setFollowLoading] = useState(false);
  const [isFromProp, setIsFromProp] = useState(true);

  useEffect(() => {
    const fromProps = props?.location;
    setIsFromProp(fromProps);
  }, [props?.location]);

  const isFollowed = (id) => {
    let result = UserDetails?.followers?.find(
      (item) => (item?.userId || item?._id) === id
    );
    if (result) {
      return true;
    } else {
      return false;
    }
  };

  const handleFollow = async () => {
    alert(usrToShowDetails?.userId || usrToShowDetails?._id);
    try {
      setFollowLoading(true);
      if (isFollowed(usrToShowDetails?.userId || usrToShowDetails?._id)) {
        await MyVairifyService.removeFollow(
          usrToShowDetails?.userId || usrToShowDetails?._id,
          {
            userId: UserDetails?._id,
          }
        );
        dispatch(HandleUpdateFollowers(UserDetails?._id));
        toast.success("Successfully unfollowed!");
      } else {
        await MyVairifyService.addFollow(
          usrToShowDetails?.userId || usrToShowDetails?._id,
          {
            userId: UserDetails?._id,
          }
        );
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

  // useEffect(() => {
  //   if (usrToShowDetails?.userId || usrToShowDetails?._id) {
  //     setLoading(true);
  //     VaridateService.fetchReviews(UserDetails?._id)
  //       .then((data) => {
  //         setReviews(data);
  //       })
  //       .catch((error) => {
  //         toast.error(error?.response?.data?.error || error?.message);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // }, [appointment]);

  useEffect(() => {
    if (usrToShowDetails?.userId || usrToShowDetails?._id) {
      setLoading(true);
      VaridateService.fetchReviews(
        usrToShowDetails?.userId || usrToShowDetails?._id
      )
        .then((data) => {
          setReviews(data);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || error?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const reviewed = reviews.filter(
    (item) =>
      item?.reviewee?._id ===
      (usrToShowDetails?.userId || usrToShowDetails?._id)
  );
  const reviewee = reviews.filter(
    (item) =>
      item?.reviewer?._id ===
      (usrToShowDetails?.userId || usrToShowDetails?._id)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center pt-[48px] mt-7">
        <Loading />
      </div>
    );
  }


  return (
    <div className={`container pb-[48px] ${!isFromProp ? "" : "lg:p-0 "}`}>
      <div className={`${!isFromProp && "min-h-[calc(100vh-380px)]"}`}>
        {!isFromProp &&
          <div className="md:mb-0 sm:mb-[30px] mb-[16px] ">
            <PageTitle title={"TruRevu"} />
          </div>
        }
        <div className="w-full mx-auto flex flex-col justify-center items-center lg:mt-0 mt-[24px]">
          <div className="w-full mx-auto flex flex-row justify-start items-center gap-[16px]">
            <div
              onClick={() => toggle("Reviewed")}
              className={`py-[6px] px-[12px] rounded-[8px] font-bold text-white text-sm cursor-pointer ${staff === "Reviewed" ? "bg-[#FFFFFF29]" : "bg-[#FFFFFF14]"}`}
            >
              Reviewed
            </div>

            <div
              onClick={() => toggle("Reviews")}
              className={`py-[6px] px-[12px] rounded-[8px] font-bold text-white text-sm cursor-pointer ${staff === "Reviews" ? "bg-[#FFFFFF29]" : "bg-[#FFFFFF14]"}`}
            >
              Reviews
            </div>
          </div>
        </div>
        <div
          className="w-full mt-[24px]"
        >
          {/* TODO: make these dynamic once we implement the TruRevu */}
          <div className="w-full">
            <div className="grid lg:grid-cols-2 gap-[20px]">
              {staff === "Reviewed" ? (
                reviewed && reviewed.length ? (
                  reviewed.map((item) => (

                    <PersonalReview
                      vairifyId={item?.["reviewee"]?.vaiID}
                      userAvatar={
                        item?.["reviewee"]?.profilePic
                          ? import.meta.env.VITE_APP_S3_IMAGE +
                          `/${item?.["reviewee"]?.profilePic}`
                          : item?.["reviewee"]?.gender === "Male"
                            ? "/images/male.png"
                            : "/images/female.png"
                      }
                      userName={item?.["reviewee"]?.name}
                      date={moment(item?.createdAt).format("DD/MM/YYYY")}
                      rate={item?.rating?.toFixed(1)}
                    />
                  ))
                ) : (
                  <div className="text-white text-base font-normal col-span-2"> No Reviews </div>
                )
              ) : reviewee && reviewee.length ? (
                reviewee.map((item) => (
                  <PersonalReview
                    vairifyId={item?.["reviewee"]?.vaiID}
                    userAvatar={
                      item?.["reviewee"]?.profilePic
                        ? import.meta.env.VITE_APP_S3_IMAGE +
                        `/${item?.["reviewee"]?.profilePic}`
                        : item?.["reviewee"]?.gender === "Male"
                          ? "/images/male.png"
                          : "/images/female.png"
                    }
                    userName={item?.["reviewee"]?.name}
                    date={moment(item?.createdAt).format("DD/MM/YYYY")}
                    rate={item?.rating?.toFixed(1)}
                  />
                ))
              ) : (
                <div className="text-white text-base font-normal col-span-2">No Reviews</div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
