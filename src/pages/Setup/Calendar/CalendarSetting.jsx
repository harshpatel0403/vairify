import React from "react";
import IconButton from "../../../components/IconButton";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
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

  const handle2Calendar = () => {
    navigate("/calendar");
  };
  const handle2Schedule = () => {
    navigate("/schedule");
  };
  const handle2Rule = () => {
    navigate("/set-rules", { state: CalendarSettings });
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
      setAvailableDetails(status);
      setDuration(status?.duration);
      let durationToCalc = status?.duration || 0;
      let hours = Math.floor(durationToCalc / 60);
      let mins = (durationToCalc / 60 - hours) * 60;
      setBufferHr(hours);
      setBufferMin(mins);
      setVenue(status?.venue);
      setIsAvailableNow(
        moment().isBefore(
          moment(status?.availableFrom).add(status?.duration, "minutes")
        )
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvailableStatus = async (pvt, away) => {
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
              isPrivate: pvt,
            }
      );
      getAvailableDetails();
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
    <div className="flex flex-col justify-between main-container px-0 min-h-[calc(100vh-150px)]">
      <div>
        <h2 className="text-[28px] font-black my-2">Calendar</h2>
      </div>
      <div className="w-full bg-gradient-to-t from-[#0247FF] to-[#02227EAD] h-[10px] w-full"></div>
      <h2 className="text-[22px] font-extrabold my-1">VAI<span className="logoSetupweight">RIFY-NOW</span></h2>
      <div className="px-6 flex flex-col justify-center form-field-container">
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
            className={`w-[50px] h-[50px] border-4 border-${
              isAvailableNow ? "[#02227E]" : "[#0C8A02]"
            } rounded-full bg-${
              isAvailableNow ? "[#0C8A02]" : "gradient-to-t"
            } from-[#8387E0] to-[#0A44A0] relative left-0`}
          ></div>
          <h2 className="text-white text-[24px] font-semibold relative -top-11">
            Available Now
          </h2>
        </div>
      </div>
      <p className="text-[#DB3002] font-bold text-[14px] mt-1">
        Activating Available the now feature will
        <br /> overide schedules during designated time
      </p>
      <div className="px-6 bg-[#0247FF7F] mt-3">
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
      </div>
      <div className="justify-center form-field-container mt-3 px-6 flex flex-col gap-4 mb-5">
        <div
          className="bg-[#3760CB] h-[54px] border-[3px] border-[#040C50] rounded-2xl flex justify-center items-center"
          onClick={handle2Calendar}
        >
          <h2 className="text-[20px] font-semibold text-white leading-[28px]">
            View/Edit
            <br />
            Calendar
          </h2>
        </div>
        <div
          className="bg-[#3760CB] h-[54px] border-[3px] border-[#040C50] rounded-2xl flex justify-center items-center"
          onClick={handle2Schedule}
        >
          <h2 className="text-[20px] font-semibold text-white leading-[28px]">
            View/Edit
            <br />
            Schedules
          </h2>
        </div>
        <div
          className="bg-[#3760CB] h-[54px] border-[3px] border-[#040C50] rounded-2xl flex justify-center items-center"
          onClick={handle2Rule}
        >
          <h2 className="text-[20px] font-semibold text-white leading-[28px]">
            View/Edit
            <br />
            Rules
          </h2>
        </div>
        <div
          className="bg-[#3760CB] h-[54px] border-[3px] border-[#040C50] rounded-2xl flex justify-center items-center"
          onClick={handle2SyncCalendar}
        >
          <h2 className="text-[20px] font-semibold text-white leading-[28px]">
            Sync Calendar
          </h2>
        </div>
      </div>
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
          "bg-[#3760CB] relative top-56 mx-auto py-4 w-[360px] rounded-2xl px-4"
        }
        contentLabel="#"
      >
        <button
          className="cancel-button absolute right-2 top-2 p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
          onClick={closeModal}
        >
          <img src={"/images/close-btn.svg"} alt="cancle" />
        </button>
        <div className="w-full mx-auto flex flex-col justify-center items-cener px-1 mt-5">
          <div className="font-bold text-[24px] text-white text-center leading-9">
            Please Select Your Venue
          </div>

          <div className="flex flex-grow justify-between items-center gap-2 modal-radio-btn">
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
                className="w-[20px] h-[20px]"
              />
              <label
                htmlFor="default-radio-1"
                className="ml-2 text-white text-[18px] font-bold"
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
                className="w-[20px] h-[20px]"
              />
              <label
                htmlFor="default-radio-2"
                className="ml-2 text-white text-[18px] font-bold"
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
                className="w-[20px] h-[20px]"
              />
              <label
                htmlFor="default-radio-3"
                className="ml-2 text-white text-[18px] font-bold"
              >
                Mobile
              </label>
            </div>
          </div>

          <div className="font-bold text-[24px] text-white text-center leading-9 mt-6">
            How Would you like to Share your location
          </div>

          <div className="w-full mx-auto flex flex-row justify-around items-start my-3">
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
          </div>
        </div>
      </Modal>
    </div>
  );
}
