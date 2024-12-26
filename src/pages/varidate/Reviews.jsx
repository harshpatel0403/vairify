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

export default function Reviews() {
  const location = useLocation();
  const appointment = location.state;
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
  }, [appointment, UserDetails]);
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
    return <div>Loading...</div>;
  }

  console.log(appointment, " <=== I am ppt...");

  return (
    <div className="main-container flex flex-col justify-start">
      <div className="w-full mx-auto flex flex-col justify-center items-center ">
        <div className="w-full mx-auto flex flex-row justify-between items-start pt-2">
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
                {usrToShowDetails?.vaiID}
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
                  usrToShowDetails?.profilePic
                    ? import.meta.env.VITE_APP_S3_IMAGE +
                      `/${usrToShowDetails?.profilePic}`
                    : usrToShowDetails?.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
                }
                // src={
                //   usrToShowDetails?.profilePic
                //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                //       `/${usrToShowDetails?.profilePic}`
                //     : usrToShowDetails?.gender === "Male"
                //     ? "/images/male.png"
                //     : "/images/female.png"
                // }
                className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                alt="Hot Rod"
              />
            </div>
            {usrToShowDetails?._id !== UserDetails?._id &&
              usrToShowDetails?.userId !== UserDetails?._id && (
                <div
                  style={{ right: "0px", top: "25px" }}
                  className="absolute"
                  onClick={() => {
                    followLoading ? null : handleFollow();
                  }}
                >
                  {followLoading ? (
                    <div
                      className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    ></div>
                  ) : (
                    <img
                      src={"/images/SugarIcon2.png"}
                      alt="Sugar Icon Second"
                      className={`${
                        isFollowed(
                          usrToShowDetails?._id || usrToShowDetails?.userId
                        )
                          ? ""
                          : "grayscale"
                      }`}
                    />
                  )}
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
                color={
                  usrToShowDetails?.averageRating >= 1 ? "#E1AB3F" : "#111"
                }
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  usrToShowDetails?.averageRating >= 2 ? "#E1AB3F" : "#111"
                }
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  usrToShowDetails?.averageRating >= 3 ? "#E1AB3F" : "#111"
                }
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  usrToShowDetails?.averageRating >= 4 ? "#E1AB3F" : "#111"
                }
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  usrToShowDetails?.averageRating >= 5 ? "#E1AB3F" : "#111"
                }
                className="text-[10px] margin-right-5 drop-shadow-[1px_1px_0px_#111]"
              />
              <span className="text-[15px] text-[#040C50] font-bold ml-0.5">
                {(usrToShowDetails?.averageRating || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center pt-4">
          <span className="font-bold text-[20px] capitalize">
            {usrToShowDetails?.name}
          </span>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-0">
          <span className="font-bold text-[24px]">TruRevu</span>
        </div>
        <div className="w-full mx-auto flex flex-row justify-around items-center mt-7">
          {staff == "Reviewed" ? (
            <div
              onClick={() => toggle("Reviewed")}
              className="px-4 rounded-tr-md rounded-tl-md bg-[#A0AACD] border-b-4 border-b-[#0247FF]"
            >
              <span className="font-extrabold text-[24px] text-[#02227E]">
                Reviewed
              </span>
            </div>
          ) : (
            <div onClick={() => toggle("Reviewed")} className="px-4">
              <span className="font-extrabold text-[24px] text-[#02227E]">
                Reviewed
              </span>
            </div>
          )}
          {staff == "Reviews" ? (
            <div
              onClick={() => toggle("Reviews")}
              className="px-4 rounded-tr-md rounded-tl-md bg-[#A0AACD] border-b-4 border-b-[#0247FF]"
            >
              <span className="font-extrabold text-[24px] text-[#02227E]">
                Reviews
              </span>
            </div>
          ) : (
            <div onClick={() => toggle("Reviews")} className="px-4">
              <span className="font-extrabold text-[24px] text-[#02227E]">
                Reviews
              </span>
            </div>
          )}
        </div>
        {/* <div style={{border:'1px solid black'}} className='w-[100vw]'></div> */}
        <div
          className="w-full overflow-hidden overflow-y-auto pr-1"
          style={{ maxHeight: "calc(100vh - 400px)" }}
        >
          {/* TODO: make these dynamic once we implement the TruRevu */}
          <div className="w-full mt-7">
            {staff === "Reviewed" ? (
              reviewed && reviewed.length ? (
                reviewed.map((item) => (
                  <>
                    <PersonalReview
                      vairifyId={item?.["reviewer"]?.vaiID}
                      userAvatar={
                        item?.["reviewer"]?.profilePic
                          ? import.meta.env.VITE_APP_S3_IMAGE +
                            `/${item?.["reviewer"]?.profilePic}`
                          : item?.["reviewer"]?.gender === "Male"
                          ? "/images/male.png"
                          : "/images/female.png"
                      }
                      // userAvatar={
                      //   item?.["reviewer"]?.profilePic
                      //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                      //       `/${item?.["reviewer"]?.profilePic}`
                      //     : item?.["reviewer"]?.gender === "Male"
                      //     ? "/images/male.png"
                      //     : "/images/female.png"
                      // }
                      userName={item?.["reviewer"]?.name}
                      date={moment(item?.createdAt).format("DD/MM/YYYY")}
                      rate={item?.rating?.toFixed(1)}
                    />
                  </>
                ))
              ) : (
                <> No Reviews </>
              )
            ) : reviewee && reviewee.length ? (
              reviewee.map((item) => (
                <>
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
                    // userAvatar={
                    //   item?.["reviewee"]?.profilePic
                    //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                    //       `/${item?.["reviewee"]?.profilePic}`
                    //     : item?.["reviewee"]?.gender === "Male"
                    //     ? "/images/male.png"
                    //     : "/images/female.png"
                    // }
                    userName={item?.["reviewee"]?.name}
                    date={moment(item?.createdAt).format("DD/MM/YYYY")}
                    rate={item?.rating?.toFixed(1)}
                  />
                </>
              ))
            ) : (
              <>No Reviews</>
            )}
          </div>
          {/* <div className='w-full mt-7'><PersonalReview userAvatar="Ellipse 155(2).png" userName="Sugar" date="01/03/2023" rate="5.0" /></div>
                <div className='w-full mt-7'><PersonalReview userAvatar="Ellipse 155(2).png" userName="Sugar" date="01/03/2023" rate="5.0" /></div>
                <div className='w-full mt-5'><PersonalReview userAvatar="Ellipse 157(2).png" userName="Crystal" date="01/03/2023" rate="5.0" /></div>
                <div className='w-full mt-5'><PersonalReview userAvatar="Ellipse 158(2).png" userName="Baby 98" date="01/03/2023" rate="5.0" /></div>
                <div className='w-full mt-5'><PersonalReview userAvatar="Ellipse 156(2).png" userName="Faye Love" date="01/03/2023" rate="5.0" /></div> */}
        </div>
      </div>
    </div>
  );
}
