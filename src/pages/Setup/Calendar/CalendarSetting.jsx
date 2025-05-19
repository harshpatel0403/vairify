import React from "react";
import IconButton from "../../../components/IconButton";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleCreateCalendarSetting,
  HandleGetCalendarSettings,
} from "../../../redux/action/CalendarSchedule";
import Loading from "../../../components/Loading/Index";
import { useEffect } from "react";
import UserService from "../../../services/userServices";
import { toast } from "react-toastify";
import moment from "moment";
import { HandleUser } from "../../../redux/action/Auth";
import Header from "../../../components/Header/Header";
import PageTitle from "../../../components/PageTitle";

export default function CalendarSetting() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const CalendarSettings = useSelector((state) => state?.Calendar?.getsettings);
  console.log(
    "🚀 ~ file: CalendarSetting.jsx:20 ~ CalendarSetting ~ CalendarSettings:",
    CalendarSettings
  );
  const [isOpen, setIsOpen] = useState(false);
  const [bufferDay, setBufferDay] = useState("00");
  const [bufferHr, setBufferHr] = useState("01");
  const [bufferMin, setBufferMin] = useState("00");
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [isShownLocation, setIsShownLocation] = useState(false);
  const [isShown, setIsShown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [availableDetials, setAvailableDetails] = useState({});

  const [isAvailableNow, setIsAvailableNow] = useState(false);

  const [duration, setDuration] = useState(60);
  const [venue, setVenue] = useState("Incall");
  const [isPublic, setIsPublic] = useState(false);

  const handle2Calendar = () => {
    navigate("/calendar");
  };
  const handle2Schedule = () => {
    navigate("/schedule");
  };
  const handle2Rule = () => {
    navigate("/set-rules");
  };

  const handle2SyncCalendar = () => {
    navigate("/sync-calendar");
  };
  const handleClick = (event) => {
    setIsShown((current) => !current);
  };

  const handleClickLocation = (event) => {
    setIsShownLocation((current) => !current);
  };

  const closeModal = () => {
    setIsOpen(false);
    const checkbox = document.getElementsByName("available-now")[0]
    if (checkbox) {
      checkbox.checked = false;
    }
  };

  useEffect(() => {
    let calculatedMins = parseInt(bufferHr) * 60 + parseInt(bufferMin);
    setDuration(calculatedMins);
  }, [bufferHr, bufferMin]);


  const handleDurationUpBuffer = () => {
    let totalMinutes =
      parseInt(bufferDay) * 24 * 60 + parseInt(bufferHr) * 60 + parseInt(bufferMin);
    totalMinutes += 15;

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    setBufferDay(days.toString().padStart(2, "0"));
    setBufferHr(hours.toString().padStart(2, "0"));
    setBufferMin(minutes.toString().padStart(2, "0"));
  };

  const handleDurationDownBuffer = () => {
    let totalMinutes =
      parseInt(bufferDay) * 24 * 60 + parseInt(bufferHr) * 60 + parseInt(bufferMin);
    totalMinutes -= 15;

    if (totalMinutes < 0) {
      totalMinutes = 0;
    }

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    setBufferDay(days.toString().padStart(2, "0"));
    setBufferHr(hours.toString().padStart(2, "0"));
    setBufferMin(minutes.toString().padStart(2, "0"));
  };

  const HandleSaveButton = () => {
    setIsLoading(true);
    const AllData = {
      userId: UserDetails?._id,
      availableTime: bufferHr + ":" + bufferMin,
      blackOutPeriodStatus: false,
      availableStatus: true,
    };
    dispatch(HandleCreateCalendarSetting(AllData))
      .then(async (result) => {
        if (result?.payload?.status === 200) {
          await dispatch(HandleGetCalendarSettings(UserDetails?._id));
          setIsOpen(false);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const getAvailableDetails = async () => {
    setLoading(true);
    try {
      const status = await UserService.getAvailableStatus(UserDetails?._id);
      const checkbox = document.getElementsByName("available-now")[0]
      const isAvailable = moment().isBefore(
        moment(status?.availableFrom).add(status?.duration, "minutes")
      )
      isAvailable ? checkbox.checked = true : checkbox.checked = false;
      setAvailableDetails(status);
      setDuration(status?.duration);
      let durationToCalc = status?.duration || 0;
      let hours = Math.floor(durationToCalc / 60);
      let mins = (durationToCalc / 60 - hours) * 60;
      setBufferHr(hours);
      setBufferMin(mins);
      setVenue(status?.venue);
      setIsAvailableNow(isAvailable);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvailableStatus = async (away) => {
    if ((!duration || !venue) && !away) {
      toast.error("Duration or Venue are missing");
      return;
    }
    setLoading(true);
    try {
      await UserService.updateAvailableStatus(
        UserDetails?._id,
        away
          ? {
            duration: 0,
          }
          : {
            availableFrom: new Date(),
            duration: duration,
            venue,
            isPrivate: isPublic ? false : true,
          }
      );
      getAvailableDetails();
      await dispatch(HandleUser(UserDetails?._id));
      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(HandleGetCalendarSettings(UserDetails?._id));
    getAvailableDetails();
  }, []);

  return (
    <div className="">
      <div className="container pb-[48px]">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"Calendar"} />
        </div>
        {/* <h2 className="text-[22px] font-extrabold my-1">VAI<span className="logoSetupweight">RIFY-NOW</span></h2> */}
        <div className="w-full p-[16px] rounded-[16px] bg-[#FFFFFF14] flex justify-between">
          <div className="xl:max-w-[25%] max-w-[84%]">
            <p className="text-base text-white font-medium">Available Now</p>
            <p className="text-sm text-white opacity-[0.7] font-normal mt-1">Activating Available the now feature will overide schedules during designated time</p>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="available-now" value="" className="sr-only peer"
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsOpen(true);
                  }
                }} />
              <div className="w-[33px] h-[20px] bg-[#FFFFFF] border border-[#FFFFFF] peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#060C4D] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#060C4D] after:border-[#060C4D] after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-green-500 peer-checked:border-none peer-checked:after:bg-[#FFFFFF] peer-checked:after:border-none"></div>
            </label>
          </div>
        </div>
        <div className="mt-[24px] grid sm:grid-cols-2 sm:gap-[24px] gap-[16px]">
          <div
            className="bg-[#FFFFFF29] flex justify-center items-center p-[12px] rounded-[8px] font-bold text-[15px] text-white cursor-pointer "
            onClick={handle2Calendar}
          >
            View/Edit Calendar
          </div>
          <div
            className="bg-[#FFFFFF29] flex justify-center items-center p-[12px] rounded-[8px] font-bold text-[15px] text-white cursor-pointer"
            onClick={handle2Schedule}
          >
            View/Edit Schedules
          </div>
          <div
            className="bg-[#FFFFFF29] flex justify-center items-center p-[12px] rounded-[8px] font-bold text-[15px] text-white cursor-pointer"
            onClick={handle2Rule}
          >
            View/Edit Rules
          </div>
          <div
            className="bg-[#FFFFFF29] flex justify-center items-center p-[12px] rounded-[8px] font-bold text-[15px] text-white cursor-pointer"
            onClick={handle2SyncCalendar}
          >
            Sync Calendar
          </div>
        </div>
      </div>
      {/* <div className="px-6 flex flex-col justify-center form-field-container">
        <div
          className="rounded-full bg-[#02227E] h-[50px] items-center justify-center w-full"
          onClick={() => {
            if (!isAvailableNow) {
              setIsOpen(true);
            } else {
              handleUpdateAvailableStatus(undefined, true);
            }
          }}
        >
          <div
            className={`w-[50px] h-[50px] border-4 border-${isAvailableNow ? "[#02227E]" : "[#0C8A02]"
              } rounded-full bg-${isAvailableNow ? "[#0C8A02]" : "gradient-to-t"
              } from-[#8387E0] to-[#0A44A0] relative left-0`}
          ></div>
          <h2 className="text-white text-[24px] font-semibold relative -top-11">
            Available Now
          </h2>
        </div>
      </div> */}

      {/* <div className="px-6 bg-[#0247FF7F] mt-3">
        <div className="w-full  h-[70px] mt-1 flex justify-center items-center">
          <h4 className="text-bold max-[425px]:text-[24px] max-[425px]:mr-4 text-[27px] font-bold mr-6">
            Duration
          </h4>
          <div className="flex gap-2 mb-3">
            <div>
              <h6 className="font-bold text-[10px]">Hr</h6>
              <div className="bg-[#02227E] w-[45px] h-[45px] rounded-md flex justify-center items-center">
                <h6 className="text-white font-[700] text-[14px]">
                  {bufferHr}
                </h6>
              </div>
            </div>
            <div>
              <h6 className="font-bold text-[10px]">Min</h6>
              <div className="bg-[#02227E] w-[45px] h-[45px] rounded-md flex justify-center items-center">
                <h6 className="text-white font-[700] text-[14px]">
                  {bufferMin}
                </h6>
              </div>
            </div>
          </div>
          <div className="mx-2 flex gap-2">
            <IconButton
              onClick={() => handleDurationUpBuffer()}
              icon={
                <>
                  <img
                    className="w-[20px] h-[20px]"
                    src={`/images/VectorUp.png`}
                    alt=""
                  />
                </>
              }
              className={"w-[45px] h-[45px] bg-white rounded-md"}
            />
            <IconButton
              disabled={parseInt(bufferMin) == 0 && parseInt(bufferHr) == 0}
              onClick={() => handleDurationDownBuffer()}
              icon={
                <>
                  <img
                    className="w-[20px] h-[20px]"
                    src={`/images/VectorDown.png`}
                    alt=""
                  />
                </>
              }
              className={"w-[45px] h-[45px] bg-white rounded-md"}
            />
          </div>
        </div>
      </div> */}

      {/* <div className="mt-6 pb-5 px-6">
        <Button
          text={"Submit"}
          className="w-[145px] max-w-[163px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-Roboto font-bold text-[23px] text-[#040C50] py-1"
        />
      </div> */}

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className={
          "bg-[#FFFFFF] relative mx-auto rounded-[16px] p-[24px] w-[90%] max-w-[548px]"
        }
        contentLabel="#"
      >
        <button
          className=" absolute right-[26px] top-[26px] bg-transparent border border-[#919EAB] h-[18px] w-[18px] flex justify-center items-center rounded-full bg-white"
          onClick={closeModal}
        >
          <img src={"/images/close-btn.svg"} alt="cancle" className="bg-[#060C4D] rounded-full h-full w-full object-cover" />
        </button>
        <div className="w-full mx-auto flex flex-col justify-center items-cener px-1 ">
          <h6 className="text-center text-[#212B36] text-xl font-semibold">Select Available</h6>
          <div className="mt-[24px]">
            <div className="w-full">
              <h4 className="font-medium text-base text-[#212B36]">
                Duration
              </h4>
              <div className="flex gap-2 items-center justify-center mt-2">
                <div className="flex gap-2 mb-3">
                  <div>
                    <h6 className="font-bold text-[10px] text-[#212B36]">Hr</h6>
                    <div className="bg-[#919EAB33] w-[45px] h-[45px] rounded-[8px] flex justify-center items-center">
                      <h6 className="text-[#212B36] font-[700] text-[14px]">
                        {bufferHr}
                      </h6>
                    </div>
                  </div>
                  <div>
                    <h6 className="font-bold text-[10px] text-[#212B36]">Min</h6>
                    <div className="bg-[#919EAB33] w-[45px] h-[45px] rounded-[8px] flex justify-center items-center">
                      <h6 className="text-[#212B36] font-[700] text-[14px]">
                        {bufferMin}
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="mx-2 flex gap-2">
                  <IconButton
                    onClick={() => handleDurationUpBuffer()}
                    icon={
                      <img
                        className="w-[16px] h-[16px]"
                        src={`/images/setup/vector-up.svg`}
                        alt=""
                      />
                    }
                    className={"w-[45px] h-[45px] bg-[#919EAB33] !rounded-[8px]"}
                  />
                  <IconButton
                    disabled={parseInt(bufferMin) == 0 && parseInt(bufferHr) == 0}
                    onClick={() => handleDurationDownBuffer()}
                    icon={
                      <img
                        className="w-[16px] h-[16px]"
                        src={`/images/setup/vector-down.svg`}
                        alt=""
                      />
                    }
                    className={"w-[45px] h-[45px] bg-[#919EAB33] !rounded-[8px] disabled:!bg-[#919EAB33]"}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="font-medium text-[#212B36] text-base mt-[16px]">
            Please Select Your Venue
          </div>

          <div className="flex items-center gap-[32px]">
            <div className="flex items-center mt-3">
              <input
                id="default-radio-1"
                value={"Incall"}
                type="checkbox"
                onChange={() =>
                  setVenue(
                    venue.includes("Incall")
                      ? venue.filter((ven) => ven !== "Incall")
                      : [...venue, "Incall"]
                  )
                }
                checked={venue.includes("Incall")}
                name="default-radio"
                className="appearance-none h-[18px] w-[18px] border border-[#637381] rounded-[4px] focus:outline-none checked:bg-[#060C4D] checked:border-[#060C4D] relative checked:before:content-[''] checked:before:bg-[url('/images/setup/checked-white.svg')] checked:before:bg-contain checked:before:bg-center checked:before:h-[10px] checked:before:w-[11px] checked:before:absolute checked:before:left-[3px] checked:before:top-[3.5px] transition-all duration-300 checked:before:bg-no-repeat"

              />
              <label
                htmlFor="default-radio-1"
                className="ml-2 text-[#212B36] text-base font-normal"
              >
                Incall
              </label>
            </div>
            <div className="flex items-center mt-3">
              <input
                id="default-radio-2"
                value={"Outcall"}
                type="checkbox"
                onChange={() =>
                  setVenue(
                    venue.includes("Outcall")
                      ? venue.filter((ven) => ven !== "Outcall")
                      : [...venue, "Outcall"]
                  )
                }
                checked={venue.includes("Outcall")}
                name="default-radio"
                className="appearance-none h-[18px] w-[18px] border border-[#637381] rounded-[4px] focus:outline-none checked:bg-[#060C4D] checked:border-[#060C4D] relative checked:before:content-[''] checked:before:bg-[url('/images/setup/checked-white.svg')] checked:before:bg-contain checked:before:bg-center checked:before:h-[10px] checked:before:w-[11px] checked:before:absolute checked:before:left-[3px] checked:before:top-[3.5px] transition-all duration-300 checked:before:bg-no-repeat"
              />
              <label
                htmlFor="default-radio-2"
                className="ml-2 text-[#212B36] text-base font-normal"
              >
                Outcall
              </label>
            </div>
            <div className="flex items-center mt-3">
              <input
                id="default-radio-3"
                value={"Mobile"}
                type="checkbox"
                onChange={() =>
                  setVenue(
                    venue.includes("Mobile")
                      ? venue.filter((ven) => ven !== "Mobile")
                      : [...venue, "Mobile"]
                  )
                }
                checked={venue.includes("Mobile")}
                name="default-radio"
                className="appearance-none h-[18px] w-[18px] border border-[#637381] rounded-[4px] focus:outline-none checked:bg-[#060C4D] checked:border-[#060C4D] relative checked:before:content-[''] checked:before:bg-[url('/images/setup/checked-white.svg')] checked:before:bg-contain checked:before:bg-center checked:before:h-[10px] checked:before:w-[11px] checked:before:absolute checked:before:left-[3px] checked:before:top-[3.5px] transition-all duration-300 checked:before:bg-no-repeat"

              />
              <label
                htmlFor="default-radio-3"
                className="ml-2 text-[#212B36] text-base font-normal"
              >
                Mobile
              </label>
            </div>
          </div>

          <div className="mt-[32px] flex gap-[16px]">
            <div>
              <div className="font-medium text-base text-[#212B36] ">
                How Would you like to Share your location
              </div>
              <p className="mt-2 text-base text-[#919EAB] font-normal">Control Your Location Sharing – Choose to share your location publicly or only when requested.</p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setIsPublic(true);
                    }
                  }} />
                <div className="w-[33px] h-[20px] bg-[#060C4D] border border-[#060C4D] peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#060C4D] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#FFFFFF] after:border-[#FFFFFF] after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-green-500 peer-checked:border-none peer-checked:after:bg-[#FFFFFF] peer-checked:after:border-none"></div>
              </label>
            </div>
          </div>

          <div className="mt-[24px]">
            <Button text={loading ? <Loading /> : 'Update'} className='secondary-btn' onClick={() => handleUpdateAvailableStatus()} />
          </div>
          {/* <div className="w-full mx-auto flex flex-row justify-around items-start my-3">
            <div className="text-center flex-1">
              <button
                onClick={() => handleUpdateAvailableStatus(true)}
                className="w-[140px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-Roboto font-bold text-[20px] text-[#040C50] py-1 px-1"
              >
                {!isLoading ? (
                  "Request only"
                ) : (
                  <div className="flex items-center	justify-center pt-[6px]">
                    <Loading />
                  </div>
                )}
              </button>
              <img
                className="w-[40px] mx-auto mt-3"
                src={"/images/info.svg"}
                alt="Pin"
                onClick={handleClickLocation}
              />
              {isShownLocation && (
                <p className="info-text">
                  Members must request to see your location
                </p>
              )}
            </div>
            <div className="text-center flex-1">
              <button
                onClick={() => handleUpdateAvailableStatus(false)}
                className="w-[140px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-Roboto font-bold text-[20px] text-[#040C50] py-1 px-1"
              >
                Public
              </button>
              <img
                className="w-[40px] mx-auto mt-3"
                src={"/images/info.svg"}
                alt="Pin"
                onClick={handleClick}
              />
              {isShown && (
                <p className="info-text">
                  Members can see your location in map view
                </p>
              )}
            </div>
          </div> */}
        </div>
      </Modal>
    </div>
  );
}
