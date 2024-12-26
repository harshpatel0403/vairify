import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import { calculateTotalMinutes, generateTimeSlots } from "../../utils";
import moment from "moment";
import DateGuardService from "../../services/DateGuardService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { HandleUpdateFollowers } from "../../redux/action/Auth";
import MyVairifyService from "../../services/MyVairifyService";

export default function SelectTime() {
  const location = useLocation();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const dispatch = useDispatch()
  useEffect(() => {
    if (location?.state) {
      setVaridateData({
        ...location?.state,
        address: location?.state?.country,
      });
    }
  }, [location]);

  const navigate = useNavigate();
  const [staff, setStaff] = useState("");
  const [varidateData, setVaridateData] = useState();
  const [slots, setSlots] = useState([]);
  const handleClick = (props) => {
    setStaff(props);
    setVaridateData((prevValue) => ({
      ...prevValue,
      selectedSlot: props,
    }));
  };
  const navigateToSelectTime = () => {
    navigate("/varidate/verification");
  };
  const navigateToServicesRates = () => {
    navigate("/varidate/services-rates", { state: varidateData });
  };

  const setStartAndEndHours = (dayInWord) => {
    let day = varidateData?.activeScheduleData?.days?.find(
      (item) => item?.day == dayInWord
    );
    let generatedSlots = generateTimeSlots(
      varidateData?.hours?.time * 60,
      day?.start,
      day?.end,
      calculateTotalMinutes(varidateData?.calendarRules?.bufferTime),
      {
        selectedDate: varidateData?.date,
        ...varidateData?.calendarRules?.blackOutPeriod,
      },
      varidateData?.appointments?.length ? varidateData.appointments : null
    );
    setSlots(generatedSlots);
  };

  useEffect(() => {
    if (varidateData?.hours) {
      if (varidateData?.date) {
        let dayIndex = varidateData?.date?.getDay();
        if (dayIndex == 0) {
          setStartAndEndHours("Su");
        } else if (dayIndex == 1) {
          setStartAndEndHours("Mo");
        } else if (dayIndex == 2) {
          setStartAndEndHours("Tu");
        } else if (dayIndex == 3) {
          setStartAndEndHours("We");
        } else if (dayIndex == 4) {
          setStartAndEndHours("Th");
        } else if (dayIndex == 5) {
          setStartAndEndHours("Fr");
        } else if (dayIndex == 6) {
          setStartAndEndHours("Sa");
        }
      }
    }
  }, [varidateData]);

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
    <div
      className="main-container pb-0"
      style={{ maxHeight: "calc(100vh - 160px)" }}
    >
      <div className="mx-auto flex flex-col justify-center items-center form-field-container w-full">
        <div className="mx-auto flex flex-row justify-between items-start mt-2 form-field-container w-full">
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
              className="absolute w-full h-full"
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
                  key={rating}
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
                  key={rating}
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

        <div className="mx-auto flex flex-col justify-center items-center mt-2 form-field-container">
          <span className="font-bold text-[24px] capitalize">
            {varidateData?.companionData?.name}
          </span>
        </div>

        <div className="inner-content-part-country pt-6">
          <div className="mx-auto flex flex-col items-center mt-2 mb-2 gap-4 form-field-container w-full">
            {slots?.map((slot, index) => (
              <div key={index} className="">
                {staff == slot ? (
                  <div className="w-full mx-auto flex flex-row justify-center items-center">
                    <div className="max-w-[50%] w-[100%] mr-2 mb-2">
                      <Button
                        onClick={() => handleClick("")}
                        text={slot}
                        bgColor="[#01195C]"
                        className={
                          "bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-white px-4 h-[60px]"
                        }
                      />
                    </div>
                    <div className="max-w-[50%] w-[100%] mb-2">
                      <Button
                        onClick={() => navigateToServicesRates()}
                        text="VAIRIDATE>>"
                        className={
                          "bg-[#05B7FD] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#01195C] px-2 h-[60px]"
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleClick(slot)}
                    text={slot}
                    className={
                      "bg-[#9099BB] border-2 border-[#02227E] rounded-md font-bold text-[24px] text-[#01195C] px-4 h-[60px]"
                    }
                  />
                )}
              </div>
            ))}
            {/* <div className='w-full mt-4'>
                        {
                            staff == "Second" ?
                                <div className='w-full mx-auto flex flex-row justify-center items-center'>
                                    <div className='max-w-[50%] w-[100%] mr-2 mb-2'><Button onClick={() => handleClick("")} text="10:00am" bgColor='[#01195C]' className={'bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-white'} /></div>
                                    <div className='max-w-[50%] w-[100%] mb-2'><Button onClick={() => navigateToServicesRates()} text="VAIRIDATE>>" className={'bg-[#05B7FD] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#01195C] px-2'} /></div>
                                </div>
                                :
                                <Button onClick={() => handleClick("Second")} text="10:00am" className={'bg-[#9099BB] border-2 border-[#02227E] rounded-md font-bold text-[24px] text-[#01195C]'} />
                        }
                    </div>
                    <div className='w-full mt-4'>
                        {
                            staff == "Three" ?
                                <div className='w-full mx-auto flex flex-row justify-center items-center'>
                                    <div className='max-w-[50%] w-[100%] mr-2 mb-2'><Button onClick={() => handleClick("")} text="10:30am" bgColor='[#01195C]' className={'bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-white'} /></div>
                                    <div className='max-w-[50%] w-[100%] mb-2'><Button onClick={() => navigateToServicesRates()} text="VAIRIDATE>>" className={'bg-[#05B7FD] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#01195C] px-2'} /></div>
                                </div>
                                :
                                <Button onClick={() => handleClick("Three")} text="10:30am" className={'bg-[#9099BB] border-2 border-[#02227E] rounded-md font-bold text-[24px] text-[#01195C]'} />
                        }
                    </div>
                    <div className='w-full mt-4'>
                        {
                            staff == "Four" ?
                                <div className='w-full mx-auto flex flex-row justify-center items-center'>
                                    <div className='max-w-[50%] w-[100%] mr-2 mb-2'><Button onClick={() => handleClick("")} text="11:30am" bgColor='[#01195C]' className={'bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-white'} /></div>
                                    <div className='max-w-[50%] w-[100%] mb-2'><Button onClick={() => navigateToServicesRates()} text="VAIRIDATE>>" className={'bg-[#05B7FD] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#01195C] px-2'} /></div>
                                </div>
                                :
                                <Button onClick={() => handleClick("Four")} text="11:30am" className={'bg-[#9099BB] border-2 border-[#02227E] rounded-md font-bold text-[24px] text-[#01195C]'} />
                        }
                    </div>
                    <div className='w-full mt-4'>
                        {
                            staff == "Fifth" ?
                                <div className='w-full mx-auto flex flex-row justify-center items-center'>
                                    <div className='max-w-[50%] w-[100%] mr-2 mb-2'><Button onClick={() => handleClick("")} text="1:30am" bgColor='[#01195C]' className={'bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-white'} /></div>
                                    <div className='max-w-[50%] w-[100%] mb-2'><Button onClick={() => navigateToServicesRates()} text="VAIRIDATE>>" className={'bg-[#05B7FD] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#01195C] px-2'} /></div>
                                </div>
                                :
                                <Button onClick={() => handleClick("Fifth")} text="1:30am" className={'bg-[#9099BB] border-2 border-[#02227E] rounded-md font-bold text-[24px] text-[#01195C]'} />
                        }
                    </div> */}
          </div>

          <div className="d-block mb-4 mt-4 px-4 ">
            <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
              <span className="font-bold text-[20px]">
                {moment(varidateData?.date).format("dddd DD/MM/YYYY")}
              </span>
            </div>
            {staff != "" && (
              <div className="w-full">
                <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
                  <span className="font-bold text-[16px]">{`${staff}`} </span>
                </div>
                <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
                  <span className="font-bold text-[16px]">
                    Escort {varidateData?.type}
                  </span>
                </div>
                {/* <div className='w-full mx-auto flex flex-row justify-center items-center mt-2'>
                                <textarea rows="3"
                                    className="block p-2.5 w-full text-[15px] text-gray-900 rounded-md border-2 border-[#02227E] focus:ring-blue-500 dark:placeholder-gray-400 dark:text-white bg-[#a5adce] focus-visible:border-0 mt-2"
                                    value={varidateData?.address}
                                    onChange={(event) => setVaridateData((prevValue) => ({ ...prevValue, address: event?.target?.value }))}
                                    placeholder="Address">
                                </textarea>
                            </div> */}
                <div className="mx-auto flex flex-row justify-center items-center mt-2 flex-wrap form-field-container flex-wrap">
                  <div className=" w-[100%] font-bold text-[16px]">
                    Agreed Price
                  </div>
                  <div className="w-[100%]">
                    <Button
                      onClick={() => navigateToSelectTime()}
                      text={
                        varidateData?.hours?.[
                        varidateData?.type?.toLowerCase()
                        ] +
                        " " +
                        varidateData?.hours?.currency
                      }
                      bgColor="[#a5adce]"
                      className={
                        "w-24 bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#000] !h-[35px] max-w-[200px]"
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
