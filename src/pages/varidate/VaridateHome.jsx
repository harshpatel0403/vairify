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
    <div style={{ maxHeight: "calc(100vh - 160px)" }}>
      <div className="w-full mx-auto flex flex-row justify-between items-start mt-2 px-3">
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
      </div>

      <div className="w-full mx-auto flex flex-col justify-center items-center mt-2 px-3">
        <span className="font-bold text-[24px] capitalize">
          {varidateData?.companionData?.name}
        </span>
      </div>

      <div className="flex flex-row border-b-2 border-gray-700 justify-evenly mt-4">
        <div
          style={{
            backgroundColor: !handelChangeTab
              ? "rgba(55,96,203,0.2)"
              : "rgba(0,0,0,0)",
          }}
          className="w-1/2 px-4"
          onClick={() => setHandelChangeTab(false)}
        >
          <span className="text-2xl font-bold text-[#01195C]">Services</span>
        </div>
        <div
          style={{
            backgroundColor: handelChangeTab
              ? "rgba(55,96,203,0.2)"
              : "rgba(0,0,0,0)",
          }}
          className="w-1/2 px-4"
          onClick={() => setHandelChangeTab(true)}
        >
          <span className="text-2xl font-bold text-[#01195C]">Rates</span>
        </div>
      </div>
      <div className="inner-content-part-country">
        {!handelChangeTab ? (
          <ServicesTab
            services={varidateData?.selectedSubServices}
            selectedService={varidateData?.service}
            setService={(service) =>
              setVaridateData((prevValue) => ({ ...prevValue, service }))
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
          />
        )}
        <div className="flex items-center justify-center mx-4 mt-2 mb-3">
          <Button
            className={
              "flex items-center mt-4 py-2 w-[50%] my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[23.4px] rounded-xl "
            }
            text={"VAIRIDATE"}
            size="40px"
            onClick={handleVairidate}
          />
        </div>
      </div>
    </div>
  );
};
export default VaridateHome;
