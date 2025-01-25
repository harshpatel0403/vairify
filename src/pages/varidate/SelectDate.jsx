import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Calendar from "react-calendar";
import SelectBox from "../../components/SelectBox";
import Button from "../../components/Button";
import { library } from "@fortawesome/fontawesome-svg-core";
import SelectBox_ from "../../components/SelectBox_";
import VaridateService from "../../services/VaridateServices";
import { useDispatch, useSelector } from "react-redux";
import { HandleGetCalendarSchedule } from "../../redux/action/CalendarSchedule";
import moment from "moment";
import { toast } from "react-toastify";
import DateGuardService from "../../services/DateGuardService";
import {
  calculateTotalMinutes,
  generateTimeSlots,
  getDayInWordFromIndex,
} from "../../utils";
import MyVairifyService from "../../services/MyVairifyService";
import { HandleUpdateFollowers } from "../../redux/action/Auth";

export default function SelectDate() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const params = useParams();
  console.log("poarms", params);
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [servicesOptions, setServicesOptions] = useState([]);
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [selectedService, setSelectedService] = useState();
  const [selectedSubServices, setSelectedSubServices] = useState([]);
  const [typeOptions, setTypeOptions] = useState(["Incall", "Outcall"]);
  const [selectedType, setSelectedType] = useState(typeOptions[0]);
  const [hoursOptions, setHoursOptions] = useState([]);
  const [hours, setHours] = useState([]);
  const [selectedHours, setSelectedHours] = useState({});
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();
  const [countries, setCountries] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [companionData, setCompanionData] = useState({});
  const [activeScheduleData, setActiveScheduleData] = useState({});
  const [calendarRules, setCalendarRules] = useState({});
  const [workingDays, setWorkingDays] = useState([]);
  const [activeDates, setActiveDates] = useState([]);
  const [minDate, setMinDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [firstAvailableSlot, setFirstAvailableSlot] = useState("");

  console.log(firstAvailableSlot, "first slot is this")
  const toggleFirstAvaliableSlot = (slot) => {
    // setStaff(props);
    let newSelectedCountry;
    if (selectedType !== "Outcall") {
      newSelectedCountry = activeScheduleData?.location;
    } else {
      newSelectedCountry = selectedCountry;
    }
    if (!newSelectedCountry) {
      toast.error(
        "Please select address, or ask companion to set default address"
      );
      return;
    }
    navigate("/varidate/services-rates", {
      state: {
        type: selectedType,
        hours: selectedHours,
        service: selectedService,
        country: newSelectedCountry,
        date: slot?.date,
        allServices,
        availableHours: hours,
        companionData,
        activeScheduleData,
        calendarRules,
        appointments,
        selectedSlot: slot?.slot,
        selectedSubServices,
      },
    });
  };
  const navigateToSelectDate = () => {
    let newSelectedCountry;
    if (selectedType !== "Outcall") {
      newSelectedCountry = activeScheduleData?.location;
    } else {
      newSelectedCountry = selectedCountry;
    }
    if (!newSelectedCountry) {
      toast.error(
        "Please select address, or ask companion to set default address"
      );
      return;
    }
    navigate(`/varidate/select-time/${params?.userId}`, {
      state: {
        type: selectedType,
        hours: selectedHours,
        service: selectedService,
        country: newSelectedCountry,
        date,
        allServices,
        availableHours: hours,
        companionData,
        activeScheduleData,
        calendarRules,
        appointments,
        selectedSubServices,
      },
    });
  };
  const getUserServices = async (userId) => {
    setLoading(true);
    try {
      const services = await VaridateService.getServices(userId);
      setAllServices(services?.[0]?.services);
      const includedServices = services?.[0]?.services?.filter(
        (item) => item?.service === "Included"
      );
      setServices(includedServices);
      // setServicesOptions(includedServices?.map((item) => item?.servicesName));
      let serviceTypes = [];
      services?.[0]?.services?.forEach((item) => {
        if (!serviceTypes.includes(item?.type)) {
          serviceTypes.push(item?.type);
        }
      });
      setSelectedService(serviceTypes?.[0]);
      setServicesOptions(serviceTypes);
      setHoursOptions(
        services?.[0]?.hourlyRates?.map((item) => `${item?.time} hours`)
      );
      setHours(
        services?.[0]?.hourlyRates?.map((item) => ({
          ...item,
          value: `${item?.time} hours`,
        }))
      );
      setSelectedHours(
        services?.[0]?.hourlyRates?.map((item) => ({
          ...item,
          value: `${item?.time} hours`,
        }))?.[0]
      );
      setCompanionData(services?.[0]?.userId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (userId) => {
    try {
      const apts = await DateGuardService.getAppointments(userId);
      setAppointments(apts);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    if (selectedService) {
      setSelectedSubServices(
        allServices?.filter((item) => item?.type === selectedService)
      );
    }
  }, [selectedService]);

  useEffect(() => {
    if (params?.userId) {
      getUserServices(params?.userId);
      fetchAppointments(params.userId);
      dispatch(HandleGetCalendarSchedule(params?.userId))
        .then((res) => {
          if (!res?.payload) {
            toast.error("No schedules available!");
            navigate(-1);
          }
          console.log("all data", res);
          let activeSchedule = res.payload?.schedule?.find(
            (item) => item?.status == "active"
          );
          let currentTime = moment();
          if (
            moment(activeScheduleData?.date?.end, "DD MMMM").isBefore(
              currentTime
            )
          ) {
            toast.error("No schedules available for future dates!");
            navigate(-1);
          }
          if (
            moment(activeScheduleData?.date?.start, "DD MMMM").isAfter(
              currentTime
            )
          ) {
            setMinDate(
              moment(activeScheduleData?.date?.start, "DD MMMM").toDate()
            );
          }
          if (activeSchedule?.venue !== "Both") {
            setSelectedType(activeSchedule?.venue);
          }
          setActiveScheduleData(activeSchedule);
          setCalendarRules(res?.payload?.settings);
          if (activeSchedule?.days?.length) {
            setWorkingDays(
              activeSchedule.days.map((item) => {
                if (item.day === "Su") {
                  return 0;
                } else if (item.day === "Mo") {
                  return 1;
                } else if (item.day === "Tu") {
                  return 2;
                } else if (item.day === "We") {
                  return 3;
                } else if (item.day === "Th") {
                  return 4;
                } else if (item.day === "Fr") {
                  return 5;
                } else if (item.day === "Sa") {
                  return 6;
                }
              })
            );
          }
        })
        .catch((error) => {
          console.log("Error while fetching active schedule =>", error);
        });
    }
  }, [params?.userId]);

  const getActiveDates = (startDate, endDate, workingDays) => {
    let start = moment(startDate);
    let end = moment(endDate);
    let today = moment(); // Get the current date
    let dates = [];

    while (start <= end) {
      if (
        (start > today || start.isSame(today, "day")) &&
        workingDays.includes(start.day())
      ) {
        dates.push(start.toDate());
      }
      start.add(1, "day");
    }

    return dates;
  };

  useEffect(() => {
    if (workingDays?.length && activeScheduleData?.date) {
      setActiveDates(
        getActiveDates(
          moment(activeScheduleData?.date?.start, "DD MMMM").toDate(),
          moment(activeScheduleData?.date?.end, "DD MMMM").toDate(),
          workingDays
        )
      );
    }
  }, [workingDays, activeScheduleData]);

  const getFirstAvailableSlot = (dates) => {
    let slotData = {};
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];

      let day = activeScheduleData?.days?.find(
        (item) => item?.day == getDayInWordFromIndex(date)
      );
      console.log(getDayInWordFromIndex(date), "dateas slot")
      const slots = generateTimeSlots(
        selectedHours?.time * 60,
        day?.start,
        day?.end,
        calculateTotalMinutes(calendarRules?.bufferTime),
        {
          selectedDate: date,
          ...calendarRules?.blackOutPeriod,
        },
        appointments?.length ? appointments : null
      );
      if (slots?.length) {
        slotData = { date, slot: slots[0] };
        break;
      }
    }
    return slotData;
  };

  useEffect(() => {
    let slot = getFirstAvailableSlot(activeDates);
    console.log(slot, "slot")
    setFirstAvailableSlot(slot);
  }, [
    activeDates,
    activeScheduleData,
    selectedHours,
    calendarRules,
    appointments,
  ]);

  useEffect(() => {
    if (UserData?.savedLocations?.length) {
      setCountries(
        UserData?.savedLocations?.map((item) => ({
          ...item,
          value: item?.country + " " + item?.city,
        }))
      );
      setCountryOptions(
        UserData?.savedLocations?.map(
          (item) => `${item?.country} ${item?.city}`
        )
      );
      if (selectedType === "Outcall") {
        setSelectedCountry(UserData?.incallAddresses?.[0]);
      }
    }
  }, [UserData]);

  useEffect(() => {
    if (activeDates?.length) {
      setDate(activeDates[0]);
    }
  }, [activeDates]);

  const [followLoading, setFollowLoading] = useState(false);

  const isFollowed = useCallback(
    (id) => {
      let result = UserData?.followers?.find((item) => item?.userId === id);
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
      if (isFollowed(companionData?._id)) {
        await MyVairifyService.removeFollow(companionData?._id, {
          userId: UserData?._id,
        });
        dispatch(HandleUpdateFollowers(UserData?._id));
        toast.success("Successfully unfollowed!");
      } else {
        await MyVairifyService.addFollow(companionData?._id, {
          userId: UserData?._id,
        });
        await dispatch(HandleUpdateFollowers(UserData?._id));
        toast.success("Successfully followed!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to follow!");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleChangeSelect = (event, setValue, isObject, options, key) => {
    if (isObject) {
      let selectedOption = options?.find(
        (item) => item?.[key] === event.target.value
      );
      if (selectedOption) {
        setValue(selectedOption);
      } else {
        setValue(null);
      }
    } else {
      setValue(event?.target?.value);
    }
  };

  if (loading) {
    return (
      <div className="main-container">
        <div className="w-full mx-auto flex flex-col justify-center items-center">
          Please wait...
        </div>
      </div>
    );
  }

  const tileDisabled = ({ date, view }) => {
    // Disable dates before the start date or after the end date
    if (view === "month") {
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      return !workingDays.includes(dayOfWeek); // Disable non-working days
    }
  };

  if (!activeDates?.length) {
    return (
      <div className="main-container">
        <div className="w-full mx-auto flex flex-col justify-center items-center">
          <div className="w-full mx-auto flex flex-row justify-between items-start mt-2 mb-3">
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
                  {companionData?.vaiID}
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
                    companionData?.profilePic
                      ? import.meta.env.VITE_APP_S3_IMAGE +
                      `/${companionData?.profilePic}`
                      : companionData?.gender === "Male"
                        ? "/images/male.png"
                        : "/images/female.png"
                  }
                  // src={
                  //   companionData?.profilePic
                  //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                  //       `/${companionData?.profilePic}`
                  //     : companionData?.gender === "Male"
                  //     ? "/images/male.png"
                  //     : "/images/female.png"
                  // }
                  className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                  alt="Intimate Massage"
                />
              </div>
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
                    src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
                    alt="Intimate Massage Icon Second"
                    className={`${isFollowed(companionData?._id) ? "" : "grayscale"
                      }`}
                  />
                )}
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
                  { length: companionData?.avgRating || 0 },
                  (_, index) => index
                )?.map((rating) => (
                  <FontAwesomeIcon
                    icon={faStar}
                    color="#E1AB3F"
                    className="text-[10px] margin-right-5"
                  />
                ))}
                {Array.from(
                  { length: 5 - Math.floor(companionData?.avgRating || 0) },
                  (_, index) => index
                )?.map((rating) => (
                  <FontAwesomeIcon
                    icon={faStar}
                    color="#111"
                    className="text-[10px] margin-right-5"
                  />
                ))}
                <span className="text-[15px] text-[#040C50] font-bold">
                  {companionData?.avgRating}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
            <span className="font-bold text-[24px]">{companionData?.name}</span>
          </div>
          <div className="w-full mx-auto flex flex-col justify-center items-center mt-8">
            <span className="font-bold text-[20px]">
              No active dates available!
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="w-full mx-auto flex flex-row justify-between items-start mt-2 mb-3">
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
                {companionData?.vaiID}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "10px", bottom: "65px" }}
              className="absolute w-full h-full"
            >
              <img
                className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                src={
                  companionData?.profilePic
                    ? import.meta.env.VITE_APP_S3_IMAGE +
                    `/${companionData?.profilePic}`
                    : companionData?.gender === "Male"
                      ? "/images/male.png"
                      : "/images/female.png"
                }
                // src={
                //   companionData?.profilePic
                //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                //       `/${companionData?.profilePic}`
                //     : companionData?.gender === "Male"
                //     ? "/images/male.png"
                //     : "/images/female.png"
                // }
                alt="Intimate Massage"
              />
            </div>
            <div
              style={{ right: "0px", top: "25px", zIndex: "999" }}
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
                  src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
                  alt="Intimate Massage Icon Second"
                  className={`${isFollowed(companionData?._id) ? "" : "grayscale"
                    }`}
                />
              )}
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
                { length: companionData?.avgRating || 0 },
                (_, index) => index
              )?.map((rating) => (
                <FontAwesomeIcon
                  icon={faStar}
                  color="#E1AB3F"
                  className="text-[10px] margin-right-5"
                />
              ))}
              {Array.from(
                { length: 5 - Math.floor(companionData?.avgRating || 0) },
                (_, index) => index
              )?.map((rating) => (
                <FontAwesomeIcon
                  icon={faStar}
                  color="#111"
                  className="text-[10px] margin-right-5"
                />
              ))}
              <span className="text-[15px] text-[#040C50] font-bold">
                {companionData?.avgRating}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
          <span className="font-bold text-[24px] capitalize">
            {companionData?.name}
          </span>
        </div>
        <div className="inner-content-part-country w-full mx-auto overflow-x-hidden">
          <div className="w-full mx-auto flex flex-row justify-around items-center mt-4">
            {firstAvailableSlot?.slot ? (
              <div>
                <div
                  onClick={() => toggleFirstAvaliableSlot(firstAvailableSlot)}
                  className="px-7 rounded-[10px] bg-gradient-to-t from-lime-500 to-emerald-500 border-2 border-solid border-[#707076] cursor-pointer"
                >
                  <span className="font-bold text-[20px] text-[#060b44]">
                    1st Available
                  </span>
                </div>
                <p className="mt-2 text-">
                  {moment(firstAvailableSlot.date).format("DD/MM/YYYY")}{" "}
                  {firstAvailableSlot.slot}
                </p>
              </div>
            ) : (
              <div className="px-7 rounded-[10px] bg-[#a0a0a0] border-2 border-solid border-[#707076] cursor-not-allowed">
                <span className="font-bold text-[20px] text-[#060b44]">
                  1st Available
                </span>
              </div>
            )}
            {/* {
                        staff == "Schedule" ?
                        <div onClick={() => toggle("Schedule")} className='px-4 rounded-tr-md rounded-tl-md bg-[#A0AACD] border-b-4 border-b-[#0247FF]'><span className='font-extrabold text-[24px] text-[#02227E]'>Schedule</span></div>
                        :
                        <div onClick={() => toggle("Schedule")} className='px-4'><span className='font-extrabold text-[24px] text-[#02227E]'>Schedule</span></div>
                    }  */}
          </div>
          <div className="w-[100vw]"></div>
          <div className="w-full mx-auto flex flex-row justify-around items-center flex-wrap-nowrap mt-4">
            <div className="max-w-[254px] w-[100%] px-2 option-selected">
              <SelectBox
                size={"h-[40px]"}
                options={
                  activeScheduleData.venue === "Both"
                    ? typeOptions
                    : typeOptions.filter(
                      (type) => activeScheduleData.venue === type
                    )
                }
                value={selectedType}
                onChange={(e) => {
                  handleChangeSelect(e, setSelectedType);
                  setSelectedCountry(null);
                }}
                className={"rounded-full"}
                shadowNone="shadow-none"
                borderWidth="border-none"
                backgroundColor={"bg-gradient-to-b from-[#02227E] to-[#0247FF]"}
                textSize={"18px"}
                fontWeight={"font-bold"}
                textColor={"text-white"}
                arrowColor={"text-white"}
              />
            </div>
            <div className="max-w-[254px] w-[100%] px-2 option-selected">
              <SelectBox
                size={"h-[40px]"}
                options={servicesOptions}
                value={selectedService?.servicesName}
                onChange={(e) =>
                  handleChangeSelect(
                    e,
                    setSelectedService
                    // true,
                    // servicesOptions,
                    // "servicesName"
                  )
                }
                className={"rounded-full"}
                borderWidth="border-none"
                backgroundColor={"bg-gradient-to-b from-[#02227E] to-[#0247FF]"}
                textSize={"18px"}
                fontWeight={"font-bold"}
                textColor={"text-white"}
                arrowColor={"text-white"}
              />
            </div>
          </div>
          <div className="w-full mx-auto flex flex-row justify-around items-center flex-wrap-nowrap mt-2">
            <div className="max-w-[254px] w-[100%] mb-3 px-2 option-selected">
              <SelectBox
                size={"h-[40px]"}
                options={hoursOptions}
                value={selectedHours?.value}
                onChange={(e) =>
                  handleChangeSelect(e, setSelectedHours, true, hours, "value")
                }
                className={"rounded-full"}
                borderWidth="border-none"
                backgroundColor={"bg-gradient-to-b from-[#02227E] to-[#0247FF]"}
                textSize={"18px"}
                fontWeight={"font-bold"}
                textColor={"text-white"}
                arrowColor={"text-white"}
              />
            </div>
            <div className="max-w-[254px] w-[100%] mb-3 px-2 option-selected relative rounded-2xl w-full  bg-gradient-to-b from-[#02227E] to-[#0247FF] border-none   border-2 border-[#fff] custom-select-dropdown">
              <select
                disabled={selectedType !== "Outcall"}
                className="custom-select-btn appearance-none block w-full  px-4 pr-8 h-[40px] shadow leading-tight rounded-2xl focus:outline-none focus:shadow-outline h-[100%] bg-transparent text-white undefined 18px font-bold   undefined focus:outline-none focus:ring-0 text-center"
                onChange={(e) => {
                  e.target.value === "add-new-addr"
                    ? navigate("/manage-incall-addresses")
                    : handleChangeSelect(
                      e,
                      setSelectedCountry,
                      true,
                      UserData?.incallAddresses,
                      "_id"
                    );
                }}
              >
                <option selected={!selectedCountry}>Select Address</option>
                {!UserData?.incallAddresses.length && (
                  <option
                    value={"add-new-addr"}
                    selected={false}
                    onClick={() => navigate("/manage-incall-addresses")}
                  >
                    Add new address
                  </option>
                )}
                {UserData?.incallAddresses?.map((addr) => (
                  <option
                    selected={addr?._id === selectedCountry?._id}
                    value={addr?._id}
                    key={addr?._id}
                  >
                    {addr.addressLine1}
                  </option>
                ))}
              </select>
              <div
                className="border-none border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent"
              // style="top: 2px;"
              >
                <svg
                  className="w-8 h-8 fill-current text-blue-500 text-white undefined"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z"></path>
                </svg>
              </div>
              {/* <SelectBox
              size={"h-[40px]"}
              options={UserData?.incallAddresses}
              value={selectedCountry?.value}
              onChange={(e) =>
                handleChangeSelect(
                  e,
                  setSelectedCountry,
                  true,
                  countries,
                  "value"
                )
              }
              className={"rounded-full border-0"}
              borderWidth="border-none"
              backgroundColor={"bg-gradient-to-b from-[#02227E] to-[#0247FF]"}
              textSize={"18px"}
              fontWeight={"font-bold"}
              textColor={"text-white"}
              arrowColor={"text-white"}
            /> */}
            </div>
          </div>
          <div className="w-full mx-auto mt-4 calendar-design">
            <Calendar
              onChange={setDate}
              value={date}
              minDate={minDate}
              maxDate={moment(
                activeScheduleData?.date?.end,
                "DD MMMM"
              ).toDate()}
              tileDisabled={tileDisabled}
            />
          </div>
          <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
            <p className="text-center">
              <span className="bold">Selected Date:</span> {date.toDateString()}
            </p>
          </div>
          <div className="w-full mx-auto flex items-center justify-center mt-5">
            <div className="w-[154px]">
              <Button
                onClick={() => navigateToSelectDate()}
                text="Select Time"
                className={
                  "h-[45px] font-bold text-[18px] text-white rounded-[25px] border-2 border-white bg-grandient-to-b from-[#02227E] to-[#0247FF]"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
