import react, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import ServicesTab from "./ServicesTab";
import RatesTab from "./RatesTab";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { HandleUpdateFollowers } from "../../redux/action/Auth";
import { toast } from "react-toastify";
import MyVairifyService from "../../services/MyVairifyService";
import PageTitle from "../../components/PageTitle";

const VaridateHome = () => {
  const [handelChangeTab, setHandelChangeTab] = useState(false);
  const [varidateData, setVaridateData] = useState({});
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const dispatch = useDispatch()

  const location = useLocation();
  useEffect(() => {
    if (location?.state) {
      setVaridateData({ ...location?.state, extraServices: [] });
    }
  }, [location]);

  const handleVairidate = () => {
    navigate("/varidate/appointment-review", { state: varidateData });
  };

  const [followLoading, setFollowLoading] = useState(false)

  const isFollowed = useCallback(
    (id) => {
      let result = UserData?.followers?.find(item => item?.userId === id)
      if (result) {
        return true
      } else {
        return false
      }
    },
    [UserData]
  )

  const handleFollow = async () => {
    try {
      setFollowLoading(true)
      if (isFollowed(varidateData?.companionData?._id)) {
        await MyVairifyService.removeFollow(varidateData?.companionData?._id, { userId: UserData?._id })
        dispatch(HandleUpdateFollowers(UserData?._id));
        toast.success("Successfully unfollowed!");
      } else {
        await MyVairifyService.addFollow(varidateData?.companionData?._id, { userId: UserData?._id })
        await dispatch(HandleUpdateFollowers(UserData?._id));
        toast.success("Successfully followed!");
      }
    } catch (error) {
      console.log(error)
      toast.error("Unable to follow!")
    } finally {
      setFollowLoading(false)
    }
  }

  return (
    <div className="container">
      {/* <div className="w-full mx-auto flex flex-row justify-between items-start mt-2 px-3">
        <div className="flex flex-col items-center justify-center">
          <div>
            <span className="text-[18px] text-[#040C50] font-extrabold">
              VAI
              <span className="text-[18px] text-[#040C50] font-semibold">
                RIFY ID
              </span>
            </span>
          </div>
          <div>
            <span className="text-[15px] text-[#040C50] font-bold uppercase">
              {varidateData?.companionData?.vaiID}
            </span>
          </div>
        </div>
        <div className="w-[120px] relative">
          <div
            style={{ left: "10px", bottom: "65px" }}
            className="absolute w-full h-full rounded-full"
          >
            <img
             src={
              varidateData?.companionData?.profilePic
                ? import.meta.env.VITE_APP_S3_IMAGE +
                `/${varidateData?.companionData?.profilePic}`
                : varidateData?.companionData?.gender === "Male"
                  ? "/images/male.png"
                  : "/images/female.png"
            }
              // src={
              //   varidateData?.companionData?.profilePic
              //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
              //     `/${varidateData?.companionData?.profilePic}`
              //     : varidateData?.companionData?.gender === "Male"
              //       ? "/images/male.png"
              //       : "/images/female.png"
              // }
              alt="Sugar"
              className="rounded-full"
            />
          </div>
          <div style={{ right: "0px", top: "25px" }} className="absolute" onClick={() => { followLoading ? null : handleFollow() }} >
            {
              followLoading ?
                <div
                  className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                </div>
                :
                <img src={"/images/SugarIcon2.png"}
                  alt="Sugar Icon Second"
                  className={`${isFollowed(varidateData?.companionData?._id) ? "" : "grayscale"}`}
                />
            }
          </div>
        </div>
        <div>
          <div>
            <span className="text-[18px] text-[#040C50] font-bold">
            TruRevu
            </span>
          </div>
          <div className="flex flex-row justify-center items-center">
            {Array.from(
              { length: varidateData?.companionData?.avgRating || 0 },
              (_, index) => index
            )?.map((rating) => (
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
            ))}
            {Array.from(
              {
                length:
                  5 - Math.floor(varidateData?.companionData?.avgRating || 0),
              },
              (_, index) => index
            )?.map((rating) => (
              <FontAwesomeIcon
                icon={faStar}
                color="#111"
                className="text-[10px] margin-right-5"
              />
            ))}
            <span className="text-[15px] text-[#040C50] font-bold">
              {varidateData?.companionData?.avgRating}
            </span>
          </div>
        </div>
      </div> */}
      {/* 
      <div className="w-full mx-auto flex flex-col justify-center items-center mt-2 px-3">
        <span className="font-bold text-[24px] capitalize">
          {varidateData?.companionData?.name}
        </span>
      </div> */}

      <div className="min-h-[calc(100vh-380px)]">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle isSmall={true} title={"Services/Rates"} />
        </div>

        <div className="flex flex-row gap-[16px] mt-4">
          <div
            style={{
              backgroundColor: !handelChangeTab
                ? "#FFFFFF29"
                : "#FFFFFF14",
            }}
            className="px-[12px] py-[6px] text-sm font-bold text-white rounded-[8px] cursor-pointer"
            onClick={() => setHandelChangeTab(false)}
          >
            Services
          </div>
          <div
            style={{
              backgroundColor: handelChangeTab
                ? "#FFFFFF29"
                : "#FFFFFF14",
            }}
            className="px-[12px] py-[6px] text-sm font-bold text-white rounded-[8px] cursor-pointer"
            onClick={() => setHandelChangeTab(true)}
          >
            Rates
          </div>
        </div>
        <div>
          {!handelChangeTab ? (
            <ServicesTab
              services={varidateData?.selectedSubServices}
              setService={(service) =>
                setVaridateData((prevValue) => ({ ...prevValue, service }))
              }
              removeService={(service) =>
                setVaridateData((prevValue) => ({
                  ...prevValue,
                  selectedSubServices: prevValue?.["selectedSubServices"]?.filter(
                    (item) => item?._id !== service?._id
                  ),
                }))
              }
              selectedExtraServices={varidateData?.extraServices}
              setSelectedExtraServices={(service) =>
                setVaridateData((prevValue) => ({
                  ...prevValue,
                  extraServices: [...prevValue?.["extraServices"], service],
                }))
              }
              removeSelectedExtraService={(service) =>
                setVaridateData((prevValue) => ({
                  ...prevValue,
                  extraServices: prevValue?.["extraServices"]?.filter(
                    (item) => item?._id !== service?._id
                  ),
                }))
              }
            />
          ) : (
            <RatesTab
              availableHours={varidateData?.availableHours}
              selectedHours={varidateData?.hours}
              setHours={(hour) =>
                setVaridateData((prevValue) => ({
                  ...prevValue,
                  hours: hour,
                }))
              }
            />
          )}
          <div className="max-w-[500px] mx-auto mt-[24px] mb-[48px]">
            <Button
              text={"VAIRIDATE"}
              size="48px"
              onClick={handleVairidate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default VaridateHome;
