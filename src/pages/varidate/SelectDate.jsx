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
import Loading from "../../components/Loading/Index";
import PageTitle from "../../components/PageTitle";
import { HandleGetProfile } from "../../redux/action/Profile";

export default function SelectDate() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const params = useParams();
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
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (date) {
      setVaridateData({
        type: selectedType,
        hours: selectedHours,
        service: selectedService,
        country: selectedCountry,
        date: firstAvailableSlot?.date,
        allServices,
        availableHours: hours,
        companionData,
        activeScheduleData,
        calendarRules,
        appointments,
        selectedSlot: firstAvailableSlot?.slot,
        selectedSubServices,
        address: selectedCountry,
      });
    }
  }, [firstAvailableSlot]);

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


  useEffect(() => {
    if (UserData?._id) {
      dispatch(HandleUpdateFollowers(UserData?._id))
    }
  }, []);

  const isFollowed = useCallback(
    (id) => {
      let result = UserData?.followers?.find((item) => item?.userId === id || item?._id === id);
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
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
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
      <div className="container">
        <div className="md:min-h-[calc(100vh-350px)] min-h-[calc(100vh-305px)]">
          <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
            <PageTitle title={"VAIRIDATE"} />
          </div>
          <div className="w-full mx-auto flex flex-col justify-center items-center">
            <div className="w-full flex flex-row sm:justify-around justify-between items-end mt-[80px] p-[16px] bg-[#FFFFFF0A] rounded-[16px]">
              <div className="flex flex-col items-center justify-center sm:min-w-[120px] min-w-[80px]">
                <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
                  VAIRIFY ID
                </div>
                <div className="font-bold sm:text-lg text-base text-white uppercase">
                  {companionData?.vaiID}
                </div>
              </div>
              <div className=" relative">
                <div
                  className="sm:h-[120px] h-[80px] sm:w-[120px] w-[80px] rounded-full mt-[-74px] relative flex justify-center"
                >
                  <img
                    className="sm:w-[120px] w-[80px] sm:h-[120px] h-[80px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                    src={
                      companionData?.profilePic
                        ? import.meta.env.VITE_APP_S3_IMAGE +
                        `/${companionData?.profilePic}`
                        : companionData?.gender === "Male"
                          ? "/images/male.png"
                          : "/images/female.png"
                    }
                    alt="profile photo"
                  />
                  <div
                    style={{ right: "0px", bottom: "0px", zIndex: "1" }}
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
                <div className="flex-col flex justify-center items-center mt-[24px]">
                  <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
                    Name
                  </div>
                  <span className="font-bold sm:text-lg text-base text-white">
                    {companionData?.name}
                  </span>
                </div>
              </div>
              <div className="leading-[18px] sm:min-w-[120px] min-w-[80px] flex flex-col justify-center items-center">
                <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
                  TruRevu
                </div>
                <div className="flex justify-center items-center gap-1">
                  <div className="sm:text-lg text-base text-white font-bold ">
                    {companionData?.avgRating ?? 0}
                  </div>
                  <img src="/images/home/star.svg" alt="star" />
                </div>
              </div>
            </div>

            <div className="w-full mx-auto flex flex-col justify-center items-center my-[48px] text-base font-medium text-white">
              No active dates available!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="w-full">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"VAIRIDATE"} />
        </div>
        <div className="w-full flex flex-row sm:justify-around justify-between items-end mt-[102px] p-[16px] bg-[#FFFFFF0A] rounded-[16px]">
          <div className="flex flex-col items-center justify-center sm:min-w-[120px] min-w-[80px]">
            <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
              VAIRIFY ID
            </div>
            <div className="font-bold sm:text-lg text-base text-white uppercase">
              {companionData?.vaiID}
            </div>
          </div>
          <div className=" relative">
            <div
              className="sm:h-[120px] h-[80px] sm:w-[120px] w-[80px] rounded-full mt-[-74px] relative flex justify-center"
            >
              <img
                className="sm:w-[120px] w-[80px] sm:h-[120px] h-[80px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                src={
                  companionData?.profilePic
                    ? import.meta.env.VITE_APP_S3_IMAGE +
                    `/${companionData?.profilePic}`
                    : companionData?.gender === "Male"
                      ? "/images/male.png"
                      : "/images/female.png"
                }
                alt="profile"
              />
              <div
                style={{ right: "0px", bottom: "0px", zIndex: "1" }}
                className="absolute"
                onClick={() => {
                  followLoading ? null : handleFollow();
                }}
              >
                {followLoading ? (
                  <div
                    className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-white align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
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
            <div className="flex-col flex justify-center items-center mt-[24px]">
              <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
                Name
              </div>
              <span className="font-bold sm:text-lg text-base text-white">
                {companionData?.name}
              </span>
            </div>
          </div>
          <div className="leading-[18px] sm:min-w-[120px] min-w-[80px] flex flex-col justify-center items-center">
            <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
              TruRevu
            </div>
            <div className="flex justify-center items-center gap-1">
              <div className="sm:text-lg text-base text-white font-bold ">
                {companionData?.avgRating ?? 0}
              </div>
              <img src="/images/home/star.svg" alt="star" />
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="w-full mx-auto flex flex-row justify-around items-center sm:mt-[48px] mt-[24px]">
            {firstAvailableSlot?.slot ? (
              <div className="max-w-[500px] w-full mx-auto">
                <Button
                  onClick={() => toggleFirstAvaliableSlot(firstAvailableSlot)}
                  className="secondary-btn !bg-[#FFFFFF29] w-full"
                  text='Book 1st Available'
                />
                <p className="mt-2 text-center text-sm text-white font-normal opacity-[0.7]">
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
          <div className="w-full mx-auto flex sm:mt-[48px] mt-[24px] sm:gap-[24px] gap-[16px]">
            <div className="w-full ">
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
                className1="text-[14px] font-normal border border-[#919EAB33] w-[100%] rounded-[8px] h-[54px]"
                textAlign={"text-left"}
                rounded={"rounded-2xl"}
                fontWeight={"font-bold"}
                textColor={"text-white"}
                textSize={"text-[14px]"}
              />
            </div>
            <div className="w-full">
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
                className1="text-[14px] font-normal border border-[#919EAB33] w-[100%] rounded-[8px] h-[54px]"
                textAlign={"text-left"}
                rounded={"rounded-2xl"}
                fontWeight={"font-bold"}
                textColor={"text-white"}
                textSize={"text-[14px]"}
              />
            </div>
          </div>
          <div className="w-full mx-auto flex sm:mt-[24px] mt-[16px] sm:gap-[24px] gap-[16px]">
            <div className="w-full">
              <SelectBox
                size={"h-[40px]"}
                options={hoursOptions}
                value={selectedHours?.value}
                onChange={(e) =>
                  handleChangeSelect(e, setSelectedHours, true, hours, "value")
                }
                className1="text-[14px] font-normal border border-[#919EAB33] w-[100%] rounded-[8px] h-[54px]"
                textAlign={"text-left"}
                rounded={"rounded-2xl"}
                fontWeight={"font-bold"}
                textColor={"text-white"}
                textSize={"text-[14px]"}
              />
            </div>
            <div className="w-full select-arrow ">
              <select
                disabled={selectedType !== "Outcall"}
                className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
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
                <option selected={!selectedCountry} className="text-black">Select Address</option>
                {!UserData?.incallAddresses.length && (
                  <option
                    value={"add-new-addr"}
                    selected={false}
                    onClick={() => navigate("/manage-incall-addresses")}
                    className="text-black"
                  >
                    Add new address
                  </option>
                )}
                {UserData?.incallAddresses?.map((addr) => (
                  <option
                    selected={addr?._id === selectedCountry?._id}
                    value={addr?._id}
                    key={addr?._id}
                    className="text-black"
                  >
                    {addr.addressLine1}
                  </option>
                ))}
              </select>
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

          <div className="text-center text-xl font-medium text-white sm:mt-[48px] mt-[24px]">
            Select Date
          </div>
          <div className="w-full mx-auto mt-[24px] calendar-design max-w-[550px] ">
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
          <p className="text-center text-sm text-white mt-[24px]">Selected Date:{date.toDateString()}</p>
          {/* <div className="w-full mx-auto flex items-center justify-center mt-5">
            <div className="w-[154px]">
              <Button
                onClick={() => navigateToSelectDate()}
                text="Select Time"
                className={
                  "h-[45px] font-bold text-[18px] text-white rounded-[25px] border-2 border-white bg-grandient-to-b from-[#02227E] to-[#0247FF]"
                }
              />
            </div>
          </div> */}

          <div className="text-center text-lg font-medium text-white sm:mt-[48px] mt-[24px]">
            Select Slot
          </div>

          <div>
            <div className="mx-auto flex flex-col justify-center items-center form-field-container w-full">

              <div className="mt-[24px] w-full">
                <div className="w-full grid grid-cols-2 sm:gap-[24px] gap-[16px]">
                  {slots?.map((slot, index) => (
                    <div key={index} className="">
                      {/* {staff == slot ? ( */}
                      {/* <div className="w-full mx-auto flex flex-row justify-center items-center">
                            <Button
                              onClick={() => handleClick("")}
                              text={slot}
                              bgColor="[#01195C]"
                              className={
                                "bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-white px-4 h-[60px]"
                              }
                            />
                            <Button
                              onClick={() => navigateToServicesRates()}
                              text="VAIRIDATE>>"
                              className={
                                "bg-[#05B7FD] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#01195C] px-2 h-[60px]"
                              }
                            />
                        </div> */}
                      {/* ) : ( */}
                      <Button
                        onClick={() => handleClick(slot)}
                        text={slot}
                        className={'secondary-btn !bg-[#FFFFFF14] focus:!bg-[#405FC4] hover:!bg-[#405FC4]'}
                      />
                      {/* )} */}
                    </div>
                  ))}
                </div>

                <div className="mb-4 mt-4 px-4 ">
                  {/* <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
                    <span className="font-bold text-[20px]">
                      {moment(varidateData?.date).format("dddd DD/MM/YYYY")}
                    </span>
                  </div> */}
                  {staff != "" && (
                    <div className="w-full">
                      <div className="text-center text-sm text-white mt-[24px]">
                        Selected slot: {`${staff}`}
                      </div>
                      <div className="text-center text-sm text-white mt-2">
                        Escort {varidateData?.type}
                      </div>
                      <div className="mx-auto flex flex-row justify-center items-center gap-[8px] mt-2">
                        <div className="text-center text-base text-white opacity-[0.7]">
                          Agreed Price:
                        </div>
                        <Button
                          // onClick={() => navigateToSelectTime()}
                          text={
                            varidateData?.hours?.[
                            varidateData?.type?.toLowerCase()
                            ] +
                            " " +
                            varidateData?.hours?.currency
                          }
                          className={'!w-fit px-4 py-[4px] !bg-[#FFFFFF29] secondary-btn'}
                          size={'32px'}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="max-w-[500px] w-full mx-auto mb-[48px]">
                  <Button onClick={() => navigateToServicesRates()} text={'Save'} size={'48px'} className={'mt-[20px]'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
