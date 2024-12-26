import React, { useState, useEffect, useMemo, useRef } from "react";
import Modal from "react-modal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import SelectBox_ from "../../../components/SelectBox_";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleCreateCalendarSchedule,
  HandleDeleteCalendarSchedule,
  HandleEditCalendarSchedule,
} from "../../../redux/action/CalendarSchedule";
import { toast } from "react-toastify";
import { HandleCountry } from "../../../redux/action/Auth";
import Loading from "../../../components/Loading/Index";
import UserService from "../../../services/userServices";

const savedSchedules = [
  "Save schedules",
  "Schedule 1",
  "Schedule 2",
  "Schedule 3",
];
let locations = [];
const times = [
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
];
const zones = ["A.M", "P.M"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
];

export default function SetSchedule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const countryData = useSelector((state) => state?.Auth?.country);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [scheduleModale, setScheduleModale] = useState(false);
  const [fromMonth, setFromMonth] = useState("January");
  const [fromDay, setFromDay] = useState("01");
  const [toDay, setToDay] = useState("10");
  const [toMonth, setToMonth] = useState("January");

  const [fromTime, setFromTime] = useState("10:00");
  const [fromZone, setFromZone] = useState("A.M");
  const [toTime, setToTime] = useState("06:00");
  const [toZone, setToZone] = useState("P.M");
  const [arrayTimes, setTimes] = useState([]);
  const [myLocation, setMyLocation] = useState({});

  const [modalIsOpen, setIsOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [day, setDays] = useState([
    {
      day: "Su",
      start: "",
      end: "",
      status: false,
    },
    {
      day: "Mo",
      start: "",
      end: "",
      status: false,
    },
    {
      day: "Tu",
      start: "",
      end: "",
      status: false,
    },
    {
      day: "We",
      start: "",
      end: "",
      status: false,
    },
    {
      day: "Th",
      start: "",
      end: "",
      status: false,
    },
    {
      day: "Fr",
      start: "",
      end: "",
      status: false,
    },
    {
      day: "Sa",
      start: "",
      end: "",
      status: false,
    },
  ]);
  const [nameSchedule, setNameSchedule] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [venue, setVenue] = useState("Both");

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const myLocationRef = useRef();

  useEffect(() => {
    Modal.setAppElement("#schedule_rules");
  });

  useMemo(() => {
    const countryNames = [];

    countryData?.map((item) => {
      const name = item.name;
      countryNames.push(name);
    });
    locations = countryNames;
  }, [countryData]);
  useEffect(() => {
    dispatch(HandleCountry());

    setLoading(true);
    UserService.getIncallAddresses(UserDetails?._id)
      .then((data) => {
        setAddresses(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    if (state) {
      setNameSchedule(state?.nameSchedule);
      setMyLocation(state?.location);
      setVenue(state?.venue);
      setFromMonth(state?.date?.start?.split(" ")[1]);
      setFromDay(state?.date?.start?.split(" ")[0]);
      setToMonth(state?.date?.end?.split(" ")[1]);
      setToDay(state?.date?.end?.split(" ")[0]);
      setDays((prevDays) =>
        prevDays.map((oldDay) => {
          const newDay = state?.days?.find(
            (newDay) => newDay.day === oldDay.day
          );
          if (newDay) {
            return { ...oldDay, ...newDay };
          }
          return oldDay;
        })
      );
    }
  }, [state]);

  const openModal = () => {
    const validationErrors = {};
    const allStatusesFalse = day?.every(item => !item?.status);
    const allTimesMissing = day?.every(item => !item?.start && !item?.end);

    day?.map((item) => {
      if (allStatusesFalse && allTimesMissing) {
        validationErrors.time = "Both time and days are required";
      }
      else if (item?.status && !item?.start && !item?.end) {
        validationErrors.time = "Please select atleast any one time";
      }
      else if (!item?.status && (item?.start || item?.end)) {
        validationErrors.status = "Please select atleast any one day";
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      toast(validationErrors.time, {
        hideProgressBar: true,
        autoClose: 1000,
        type: "error",
      });
      return;
    }

    // If no validation errors, clear the error state and open the modal
    setError({});

    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // navigate("/set-rules")
  };

  const handleNavigateToCalendar = () => {
    navigate("/calendar");
  };

  const closeMessage = () => {
    setMessageOpen(false);
  };

  const afterMessageOpen = () => {
    setTimeout(() => navigate("/schedule"), 2000);
  };

  const handleSave = async () => {
    const validationErrors = {};
    if (!nameSchedule) {
      validationErrors.name = "Name is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    setError({});

    const NewDays = day.filter(
      (days) => days?.status && days.start !== "" && days.end !== ""
    );
    setIsLoading(true);
    const AllData = {
      userId: UserDetails._id,
      location: myLocation,
      nameSchedule: nameSchedule,
      venue: venue,
      color: "",
      status: "active",
      days: NewDays,
      date: {
        start: fromDay + " " + fromMonth,
        end: toDay + " " + toMonth,
      },
    };
    await dispatch(
      state?._id
        ? HandleEditCalendarSchedule(state?._id, AllData)
        : HandleCreateCalendarSchedule(AllData)
    )
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setIsOpen(false);
          setScheduleModale(true);
          setIsLoading(false);
          setTimeout(async () => {
            await setScheduleModale(false);
            navigate("/schedule");
          }, 2000);
        } else {
          setIsLoading(false);
          // setError(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err, "Error");
      });
  };

  const HandleDelete = (id) => {
    dispatch(HandleDeleteCalendarSchedule(id))
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setIsLoading(false);
          navigate("/schedule");
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err, "Error");
      });
  };

  const HandleTime = () => {
    setError({});
    const index = day.map((days) => {
      if (days?.status && days.start === "" && days.end === "") {
        days.start = fromTime + " " + fromZone;
        days.end = toTime + " " + toZone;
      }
      return days;
    });
    setDays(index);
  };
  return (
    <div
      id="schedule_rules"
      className="main-container px-0 min-h-[calc(100vh-150px)]"
    >
      <div className="max-w-[400px] mx-auto px-6 min-h-[calc(40vh-85px)] flex flex-col justify-between py-4">
        <div className="w-full mx-auto flex flex-col justify-center items-center pt-0">
          <div className="w-full mx-auto flex flex-col justify-center items-center">
            {state ? (
              <span className="font-semibold text-[27px] text-black">
                Set Schedule
              </span>
            ) : (
              <span className="font-extrabold text-[27px] text-black">
                Create Schedule
              </span>
            )}
          </div>
        </div>
        {/* <div className="w-full mx-auto flex justify-between items-center gap-2 mt-4">
          <div className="flex flex-grow justify-between items-center gap-2">
            <div className="relative flex items-center w-fit rounded-[10px]">
              <select
                className="h-[37px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[10px] appearance-none pl-3 pr-8 py-1.5 text-[14px] text-[#fff] font-semibold"
                name="savedSchedules"
              >
                {savedSchedules.map((item, index) => {
                  return (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
              <div className="absolute top-2 right-2 pointer-events-none">
                <svg
                  className={`w-6 h-6 fill-current text-white`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </div>
          </div>
        </div> */}
        <div className="venue-part flex items-center mt-3">
          <div className="text-[14px] font-semibold me-3 text-[18px]">
            Venue:
          </div>
          <div className="flex flex-grow justify-between items-center gap-2 schedule-radio-btn">
            <div className="flex items-center">
              <input
                id="default-radio-1"
                type="radio"
                value="Incall"
                onChange={(e) => setVenue(e.target.value)}
                checked={venue === "Incall"}
                name="default-radio"
                className="w-[20px] h-[20px]"
              />
              <label
                htmlFor="default-radio-1"
                className="ml-2 text-[18px] font-bold"
              >
                Incall
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="default-radio-2"
                type="radio"
                value="Outcall"
                onChange={(e) => setVenue(e.target.value)}
                checked={venue === "Outcall"}
                name="default-radio"
                className="w-[20px] h-[20px]"
              />
              <label
                htmlFor="default-radio-2"
                className="ml-2 text-[18px] font-bold"
              >
                Outcall
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="default-radio-3"
                type="radio"
                value="Both"
                onChange={(e) => setVenue(e.target.value)}
                checked={venue === "Both"}
                name="default-radio"
                className="w-[20px] h-[20px]"
              />
              <label
                htmlFor="default-radio-3"
                className="ml-2 text-[18px] font-bold"
              >
                Both
              </label>
            </div>
          </div>
        </div>
        {venue !== "Outcall" && (
          <div className="location-part-data flex mt-4">
            <div className="relative flex items-center w-fit rounded-[10px]">
              <select
                className="w-full h-[37px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[10px] appearance-none pl-3 pr-8 py-1.5 text-[14px] text-[#fff] font-semibold"
                name="location"
                onChange={(e) => setSelectedLocation(e.target.value)}
                value={selectedLocation}
                ref={myLocationRef}
              >
                <option selected={!selectedLocation} value={null}>
                  Select Address
                </option>
                {!addresses.length && (
                  <Link to={"/manage-incall-addresses"}>
                    <option>Add Incall address</option>
                  </Link>
                )}
                {addresses.map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={item?._id}
                      selected={item?._id === selectedLocation}
                    >
                      {item.addressLine1}
                    </option>
                  );
                })}
              </select>
              <div className="absolute top-2 right-2 pointer-events-none">
                <svg
                  className={`w-6 h-6 fill-current text-white`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </div>
            <div className="ml-2">
              <Button
                text="Add"
                bgColor=" from-[#02227E] to-[#0247FF]"
                className="px-3 bg-gradient-to-b text-white font-semibold rounded-[10px] text-[12.6px]"
                size="36px"
                onClick={() => {
                  setMyLocation(
                    addresses.find(
                      (item) => item?._id == myLocationRef?.current?.value
                    )
                  );
                }}
              />
            </div>
          </div>
        )}
        <div className="w-full flex flex-row justify-between items-center mt-4">
          <div className="flex gap-1 justify-between items-center w-full">
            <div className="flex flex-row justify-center items-center w-full">
              <div className="relative w-full">
                <SelectBox_
                  onChange={(e) => setFromMonth(e.target.value)}
                  options={months}
                  value={fromMonth}
                  className={
                    "appearance-none rounded-[10px] text-[#fff] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] border-[#CCCCCC] rounded-r-none text-[12px] font-semibold px-0 pl-2 max-[350px]:pl-1 sm:pl-4 pr-3 py-1 w-full  h-[37px]"
                  }
                />
                <div className="absolute top-2 right-[5px] pointer-events-none">
                  <svg
                    className={`w-6 h-6 fill-current text-[#fff]`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <SelectBox_
                  onChange={(e) => setFromDay(e.target.value)}
                  options={days}
                  value={fromDay}
                  className={
                    "appearance-none rounded-[10px] text-[#fff] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] border-l border-[#CCCCCC] rounded-l-none text-[12px] font-semibold px-0 pl-2 max-[350px]:pr-4 pr-5 py-1 h-[37px]"
                  }
                />
                <div className="absolute top-2 max-[400px]:right-[2px] right-[5px] pointer-events-none">
                  <svg
                    className={`w-6 h-6 fill-current text-[#fff]`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
            <span className="text-[14.4px] font-bold">To</span>
            <div className="flex flex-row justify-center items-center w-full">
              <div className="relative w-full">
                <SelectBox_
                  onChange={(e) => setToMonth(e.target.value)}
                  options={months}
                  value={toMonth}
                  className={
                    "appearance-none rounded-[10px] text-[#fff] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] border-[#CCCCCC] rounded-r-none text-[12px] font-semibold px-0 pl-2 max-[350px]:pl-1 sm:pl-4 pr-3 py-1 w-full h-[37px]"
                  }
                />
                <div className="absolute top-2 right-[5px] pointer-events-none">
                  <svg
                    className={`w-6 h-6 fill-current text-[#fff]`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <SelectBox_
                  onChange={(e) => setToDay(e.target.value)}
                  options={days}
                  value={toDay}
                  className={
                    "appearance-none rounded-[10px] text-[#fff] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] border-l border-[#CCCCCC] rounded-l-none text-[12px] font-semibold px-0 pl-2 max-[350px]:pr-4 pr-5 py-1 h-[37px]"
                  }
                />
                <div className="absolute top-2 max-[400px]:right-[2px] right-[5px] pointer-events-none">
                  <svg
                    className={`w-6 h-6 fill-current text-[#fff]`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row gap-x-2 items-center mt-4">
          <div>
            <span className="text-[18px] font-semibold">Days:</span>
          </div>
          {day?.map((days, index) => {
            return (
              <div key={index} className="w-[36px]">
                <Button
                  text={days.day}
                  className="border-2 border-gray-300 rounded-[9px] text-[12px] font-semibold text-white"
                  size="32px"
                  bgColor={
                    days?.status
                      ? "bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF]"
                      : "white"
                  }
                  onClick={() => {
                    const updatedDays = [...day];
                    updatedDays[index].status = !days.status;
                    if (!updatedDays[index].status) {
                      updatedDays[index].start = "";
                      updatedDays[index].end = "";
                    }
                    setDays(updatedDays);
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="w-full flex flex-row justify-between items-center gap-2 mt-4">
          <div className="flex gap-1 justify-between items-center w-full">
            <div className="flex flex-row justify-center items-center w-full">
              <div className="relative w-1/2">
                <SelectBox_
                  onChange={(e) => {
                    setFromTime(e.target.value);
                  }}
                  value={fromTime}
                  options={times}
                  className={
                    "appearance-none rounded-[10px] text-[#fff] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] border-[#CCCCCC]  rounded-r-none appearance-none text-[12px] font-semibold px-0 pl-2 max-[350px]:pl-1 sm:pl-4 pr-3 py-1 w-full h-[37px]"
                  }
                  border={error?.time ? `#ef4444` : "#cccccc"}
                />
                <div className="absolute top-2 max-[400px]:right-[2px] right-[5px] pointer-events-none">
                  <svg
                    className={`w-6 h-6 fill-current text-[#fff]`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
              <div className="relative w-1/2">
                <SelectBox_
                  onChange={(e) => setFromZone(e.target.value)}
                  options={zones}
                  value={fromZone}
                  className={
                    "rounded-[10px] text-[#fff] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] border-l border-[#CCCCCC] rounded-l-none text-[12px] appearance-none font-semibold px-0 pl-2 max-[350px]:pr-4 pr-5 py-1 w-full h-[37px]"
                  }
                  border={error?.time ? `#ef4444` : "#cccccc"}
                />
                <div className="absolute top-2 max-[400px]:right-[2px] right-[5px] pointer-events-none">
                  <svg
                    className={`w-6 h-6 fill-current text-[#fff]`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
            <span className="text-[14.4px] font-bold">To</span>
            <div className="flex flex-row justify-center items-center w-full">
              <div className="relative w-1/2">
                <SelectBox_
                  onChange={(e) => {
                    setToTime(e.target.value);
                  }}
                  border={error?.time ? `#ef4444` : "#cccccc"}
                  options={times}
                  value={toTime}
                  className={
                    "rounded-[10px] text-[#fff] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] border-[#CCCCCC] rounded-r-none appearance-none text-[12px] font-semibold px-0 pl-2 max-[350px]:pl-1 sm:pl-4 pr-3 py-1 w-full h-[37px]"
                  }
                />
                <div className="absolute top-2 max-[400px]:right-[2px] right-[5px] pointer-events-none">
                  <svg
                    className={`w-6 h-6 fill-current text-[#fff]`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
              <div className="relative w-1/2">
                <SelectBox_
                  onChange={(e) => setToZone(e.target.value)}
                  options={zones}
                  value={toZone}
                  border={error?.time ? `#ef4444` : "#cccccc"}
                  className={
                    " rounded-[10px] text-[#fff] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] border-l border-[#CCCCCC] rounded-l-none text-[12px] appearance-none font-semibold px-0 pl-2 max-[350px]:pr-4 pr-5 py-1 w-full h-[37px]"
                  }
                />
                <div className="absolute top-2 max-[400px]:right-[2px] right-[5px] pointer-events-none">
                  <svg
                    className={`w-6 h-6 fill-current text-[#fff]`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <Button
              onClick={() => {
                HandleTime();
                // setTimes([
                //   ...arrayTimes,
                //   `${fromTime} ${fromZone},${toTime} ${toZone}`,
                // ]);
              }}
              text="Add"
              bgColor=" from-[#02227E] to-[#0247FF]"
              className="px-3 bg-gradient-to-b text-white text-[12.6px] font-semibold rounded-[10px]"
              size="36px"
            // disabled={disabledButton}
            />
          </div>
        </div>
      </div>
      <div className="w-full py-3 mt-3 bg-[#3760CB6B]"></div>
      <div className="max-w-[400px] pb-4 mx-auto px-6 flex flex-col">
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
          <div className="flex w-full items-start">
            <div className="w-full">
              {state && (
                <div className="w-full mx-auto flex items-center">
                  <div className="mr-6 text-left min-w-[80px]">
                    <span className="font-bold text-[18px] text-[#026EFF]">
                      Name
                    </span>
                  </div>
                  <div className="font-semibold text-[18px]">
                    <span>{state?.nameSchedule}</span>
                  </div>
                </div>
              )}
              <div className="w-full mx-auto flex justify-start items-center mt-4">
                <div className="mr-6 min-w-[80px] text-left">
                  <span className="font-bold text-[18px] text-[#026EFF]">
                    Location
                  </span>
                </div>
                <div className="font-semibold text-[18px]">
                  <span>{myLocation?.addressLine1}</span>
                </div>
              </div>
              <div className="w-full mx-auto flex justify-start items-center mt-4">
                <div className="mr-6  text-left min-w-[80px]">
                  <span className="font-bold text-[18px] text-[#026EFF]">
                    Date
                  </span>
                </div>
                <div className="font-semibold text-[18px]">
                  <span>
                    {fromDay}/{fromMonth?.slice(0, 3)} - {toDay}/
                    {toMonth?.slice(0, 3)}
                  </span>
                </div>
              </div>
            </div>
            {state && (
              <div
                className="flex flex-col justify-center items-center"
                onClick={() => setIsDeleteOpen(true)}
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/Calendar.png`}
                  alt=""
                  width={26}
                />
                <p className="text-[10px] font-semibold whitespace-pre">
                  Delete Schedule{" "}
                </p>
              </div>
            )}
          </div>
          <div className="w-full mx-auto flex flex-col justify-between items-start mt-4">
            <div>
              <span className="text-[18px] font-bold text-[#026EFF]">Day</span>
            </div>
            <div className="flex gap-1 w-full">
              {day
                ?.filter((day) => day.status)
                .map((day, index) => {
                  return (
                    <div key={index} className="w-[45px] h-[45px]">
                      <Button
                        key={index}
                        text={day?.day}
                        className="bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[9px] text-[18px] font-semibold text-white"
                        size="45px"
                      />
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="w-full mx-auto flex flex-col justify-start items-start mt-4">
            <div className="mr-6">
              <span className="font-bold text-[20px] text-[#026EFF]">Time</span>
            </div>
            <div className="w-full flex justify-start gap-1">
              {day &&
                day
                  .filter((D) => D.status && D.start && D.end)
                  ?.map((t, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <button className="w-[45px] h-[45px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] border-2 border-[#ffffff] rounded-[9px] text-[12px] font-semibold leading-3 text-white leading-3">
                        {t?.start?.split(",")[0]?.split(" ")[0]}
                        <br />
                        {t?.start?.split(",")[0]?.split(" ")[1]}
                      </button>
                      <button className="w-[45px] h-[45px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] border-2 border-[#ffffff] rounded-[9px] text-[12px] font-semibold leading-3 text-white leading-3">
                        {t?.end?.split(",")[0]?.split(" ")[0]}
                        <br />
                        {t?.end?.split(",")[0]?.split(" ")[1]}
                      </button>
                    </div>
                  ))}
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row justify-between items-center mb-2 mt-6">
          <Button
            onClick={() => handleNavigateToCalendar()}
            text="Calendar"
            className={
              "font-bold text-[18px] from-0% to-65% from-[#0CA36C] to-[#08FA5A] bg-gradient-to-b text-[#040C50] mr-6 rounded-[10px]"
            }
            size={"40px"}
          />
          <Button
            onClick={() => openModal()}
            text="Review"
            className={
              "font-bold text-[18px] from-0% to-65% from-[#0CA36C] to-[#08FA5A] bg-gradient-to-b text-[#040C50] rounded-[10px]"
            }
            size={"40px"}
          />
        </div>
        <Modal
          isOpen={messageOpen}
          onAfterOpen={afterMessageOpen}
          onRequestClose={closeMessage}
          className={
            "bg-[#3760CB] relative top-[50%] translate-y-[-50%] mx-auto py-4 w-[360px] rounded-2xl px-4"
          }
          contentLabel="#"
        >
          <h3 className="text-[16px] text-white font-bold">
            Schedule Saved Successfully
          </h3>
        </Modal>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className={
            "bg-[#3760CB] relative top-[50%] translate-y-[-50%] mx-auto pb-2 w-[360px] rounded-2xl"
          }
          contentLabel="#"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2"
          >
            <img
              src="/images/Mask group-close.png"
              alt=""
              width="30px"
              height="30px"
            />
          </button>
          <h4 className="text-[26px] text-[#01195C] font-bold text-center">
            Detail
          </h4>
          <div className="w-full bg-[#D9D9D936] mt-1">
            <h4 className="text-[26px] text-[#01195C] font-bold text-center">
              Set Schedule
            </h4>
          </div>
          <div className="w-full mx-auto flex flex-col justify-start items-center px-5 py-3">
            <div className="w-full mx-auto flex flex-row items-center flex-wrap">
              <div className="w-1/2">
                <span className="text-[16px] font-bold text-white">
                  Country
                </span>
              </div>
              <div className="w-1/2">
                <span className="text-base font-bold text-white mr-2">
                  {myLocation?.addressLine1}
                </span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row items-center flex-wrap">
              <div className="w-1/2">
                <span className="text-[16px] font-bold text-white">
                  City/State
                </span>
              </div>
              <div className="w-1/2">
                <span className="text-base font-bold text-white mr-2">
                  Seattle,WA
                </span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row items-center flex-wrap mt-2">
              <div className="w-1/2">
                <span className="text-[16px] font-bold text-white">Date</span>
              </div>
              <div className="w-1/2">
                <span className="text-base font-bold text-white">
                  {fromMonth.slice(0, 3)}
                  {fromDay} - {toMonth.slice(0, 3)}
                  {toDay}
                </span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row items-center flex-wrap mt-2">
              <div className="w-1/2">
                <span className="text-[16px] font-bold text-white">Days</span>
              </div>
              <div className="w-1/2">
                <span className="text-base font-bold text-white">
                  {day
                    ?.filter((item) => item?.status)
                    ?.map((item) => item?.day)
                    .join(", ")}
                </span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row items-center flex-wrap mt-2">
              <div className="w-1/2">
                <span className="text-[16px] font-bold text-white">Time</span>
              </div>
              <div className="w-1/2">
                <span className="text-base font-bold text-white">
                  {day?.find((item) => item?.status && item?.start && item?.end)
                    ?.start +
                    " - " +
                    day?.find(
                      (item) => item?.status && item?.start && item?.end
                    )?.end}
                </span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row items-center  mt-2">
              <div className="w-1/2">
                <span className="text-[16px] font-bold text-white">
                  Name Schedule
                </span>
              </div>
              <div className="w-1/2">
                <InputText
                  size="30px"
                  onChange={(e) => setNameSchedule(e.target.value)}
                  className="rounded-sm bg-white"
                  value={nameSchedule}
                  border={error?.name ? `#ef4444` : "#cccccc"}
                />
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row justify-center gap-2 items-center mt-3">
              <Button
                onClick={() => handleSave()}
                className="text-black from-0% to-65% from-[#0CA36C] to-[#08FA5A] bg-gradient-to-b text-[18px] font-bold max-w-[157px]"
                size="40px"
                text={
                  !isLoading ? (
                    "Save Schedule"
                  ) : (
                    <div className="flex items-center	justify-center pt-[6px]">
                      <Loading />
                    </div>
                  )
                }
              />
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={scheduleModale}
          // onRequestClose={closeSyatem}
          className=" w-[360px] h-[175px] center-modal bg-[#3760CB] relative rounded-2xl px-4"
        >
          <button
            onClick={() => setScheduleModale(false)}
            className="absolute top-2 right-2"
          >
            <img
              src="/images/Mask group-close.png"
              alt=""
              width="30px"
              height="30px"
            />
          </button>
          <p className="text-[36px] font-bold text-center text-[#fff] w-full pt-5 leading-10 max-w-none">
            Schedule <br /> Saved <br />
            successfully
          </p>
          <div className="flex justify-around items-center w-full">
            <div className="w-[40%]"></div>
            <div className="w-[40%]"></div>
          </div>
        </Modal>
        <Modal
          isOpen={isDeleteOpen}
          onRequestClose={closeModal}
          className={
            "bg-[#3760CB] relative top-[50%] translate-y-[-50%] mx-auto py-4 w-[360px] rounded-2xl px-4"
          }
          contentLabel="#"
        >
          <button
            onClick={() => setIsDeleteOpen(false)}
            className="absolute top-2 right-2"
          >
            <img
              src="/images/Mask group-close.png"
              alt=""
              width="30px"
              height="30px"
            />
          </button>
          <div className="w-full mx-auto flex flex-col justify-center items-cener px-4">
            <div className="font-bold text-[24px] pt-3 text-white text-center leading-9">
              Are you sure you want to delete your schedule?
            </div>
            <div className="w-full mx-auto flex flex-row justify-around items-center mt-2">
              <button
                onClick={() => HandleDelete(state?._id)}
                className="w-[120px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-[10px] font-Roboto font-bold text-[23px] text-[#040C50] py-1"
              >
                Yes
              </button>
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="w-[120px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-[10px] font-Roboto font-bold text-[23px] text-[#040C50] py-1"
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
