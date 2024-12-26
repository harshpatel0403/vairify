import React, { useEffect, useState } from "react";
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
import DateGuardService from "../../services/DateGuardService";
import moment from "moment";
import { HandleGetCalendarSchedule } from "../../redux/action/CalendarSchedule";
import { toast } from "react-toastify";

export default function ChangeAppointmentDate() {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const params = useParams();
  const [UserData, setUserData] = useState({});
  const [servicesOptions, setServicesOptions] = useState([]);
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [selectedService, setSelectedService] = useState();
  const [typeOptions, setTypeOptions] = useState(["Incall", "Outcall"]);
  const [selectedType, setSelectedType] = useState(typeOptions[0]);
  const [hoursOptions, setHoursOptions] = useState([]);
  const [hours, setHours] = useState([]);
  const [selectedHours, setSelectedHours] = useState({});
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();
  const [countries, setCountries] = useState([]);
  const [staff, setStaff] = useState("1st Available");
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [companionData, setCompanionData] = useState({});
  const [activeScheduleData, setActiveScheduleData] = useState({});

  const [appointmentData, setAppointmentData] = useState({});

  const toggle = (props) => {
    setStaff(props);
  };

  const fetchAppointment = async () => {
    setLoading(true);
    const appointment = await DateGuardService.getAppointment(
      params?.appointmentId
    );
    setAppointmentData(appointment);
    const UserData = await VaridateService.fetchUserDetails(
      appointment?.clientId?._id
    );

    // Schedules fetched as per new flow...
    const userSchedulesResponse = await dispatch(
      HandleGetCalendarSchedule(appointment?.companionId?._id)
    );

    if (!userSchedulesResponse?.payload) {
      toast.error("No schedules available!");
      navigate(-1);
    }

    let activeSchedule = userSchedulesResponse.payload?.schedule?.find(
      (item) => item?.status == "active"
    );
    let currentTime = moment();

    if (
      moment(activeScheduleData?.date?.end, "DD MMMM").isBefore(currentTime)
    ) {
      toast.error("No schedules available for future dates!");
      navigate(-1);
    }
    if (
      moment(activeScheduleData?.date?.start, "DD MMMM").isAfter(currentTime)
    ) {
      // setMinDate(
      //   moment(activeScheduleData?.date?.start, "DD MMMM").toDate()
      // );
    }
    console.log(activeSchedule, " ,+=== active scheudel..");
    if (activeSchedule?.venue !== "Both") {
      setSelectedType(activeSchedule?.venue);
    }

    setActiveScheduleData(activeSchedule);

    setUserData(UserData);
    const userId = appointment?.companionId?._id;
    try {
      const services = await VaridateService.getServices(userId);
      setAllServices(services?.[0]?.services);
      const includedServices = services?.[0]?.services?.filter(
        (item) => item?.service === "Included"
      );

      let serviceTypes = [];
      services?.[0]?.services?.forEach((item) => {
        if (!serviceTypes.includes(item?.type)) {
          serviceTypes.push(item?.type);
        }
      });

      const serviceOptionsLocal = includedServices?.map(
        (item) => item?.servicesName
      );
      const hoursOptionsLocal = services?.[0]?.hourlyRates?.map(
        (item) => `${item?.time} hours`
      );
      const hoursLocal = services?.[0]?.hourlyRates?.map((item) => ({
        ...item,
        value: `${item?.time} hours`,
      }));

      setServices(includedServices);
      setServicesOptions(serviceTypes);
      setHoursOptions(hoursOptionsLocal);
      setHours(hoursLocal);

      setCompanionData(services?.[0]?.userId);
      setSelectedType(appointment?.type);
      console.log(
        hoursOptionsLocal,
        appointment?.duration,
        hoursOptionsLocal.find(
          (item) => item.time == appointment?.duration / 60
        ),
        " default hours..."
      );
      setSelectedHours(
        services?.[0]?.hourlyRates.find(
          (item) => item.time == appointment?.duration / 60
        )
      );
      setSelectedService(appointment?.service?.servicesName);
      const existingLocation = UserData.savedLocations.find(
        (item) =>
          item.city === appointment?.location?.city &&
          item?.country === appointment?.location?.country
      );
      setSelectedCountry({
        ...(existingLocation || {}),
        value: `${existingLocation.country} ${existingLocation.city}`,
      });
      setDate(moment(appointment?.startDateTime).toDate());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSelectDate = () => {
    navigate(`/varidate/change-appointment-time/${params?.appointmentId}`, {
      state: {
        type: selectedType,
        hours: selectedHours,
        service: { servicesName: selectedService },
        country: selectedCountry,
        date,
        allServices,
        availableHours: hours,
        companionData,
      },
    });
  };

  const getUserServices = async (userId) => {};

  useEffect(() => {
    fetchAppointment();
    // if (params?.userId) {
    //   getUserServices(params?.userId);
    // }
  }, [params?.appointmentId]);

  // useEffect(() => {
  //   if (UserData?.savedLocations?.length) {
  //     setCountries(
  //       UserData?.savedLocations?.map((item) => ({
  //         ...item,
  //         value: item?.country + " " + item?.city,
  //       }))
  //     );
  //     setCountryOptions(
  //       UserData?.savedLocations?.map(
  //         (item) => `${item?.country} ${item?.city}`
  //       )
  //     );
  //     setSelectedCountry(
  //       UserData?.savedLocations?.map((item) => ({
  //         ...item,
  //         value: item?.country + " " + item?.city,
  //       }))?.[0]
  //     );
  //   }
  // }, [UserData]);

  const handleChangeSelect = (event, setValue, isObject, options, key) => {
    if (isObject) {
      let selectedOption = options?.find(
        (item) => item?.[key] === event.target.value
      );
      if (selectedOption) {
        setValue(selectedOption);
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

  return (
    <div className="main-container pb-2">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="w-full mx-auto flex flex-row justify-between items-start mt-2">
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
              <span className="text-[15px] text-[#040C50] font-bold">
                {companionData?.vaiID}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              className="border-2 w-[120px] rounded-full"
              style={{ marginTop: "-67px", zIndex: "99" }}
            >
              <img
                className="rounded-full"
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
            {/* <div
              style={{ right: "0px", top: "25px", zIndex: "999" }}
              className="absolute"
            >
              <img
                src={"/images/IntimateMassageIcon2.png"}
                alt="Intimate Massage Icon Second"
              />
            </div> */}
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
        <div className="w-full mx-auto flex flex-col justify-center items-center">
          <span className="font-bold text-[24px]">{companionData?.name}</span>
        </div>
        <div
          className="inner-content-part-medium form-field-container"
          style={{ maxWidth: "100%" }}
        >
          <div className="w-full mx-auto flex flex-row justify-around items-center mt-4">
            {staff == "1st Available" ? (
              <div
                onClick={() => toggle("1st Available")}
                className="px-7 rounded-[10px] bg-[#a0a0a0] border-2 border-solid border-[#707076]"
              >
                <span className="font-bold text-[20px] text-[#060b44]">
                  1st Available
                </span>
              </div>
            ) : (
              <div
                onClick={() => toggle("1st Available")}
                className="px-7 rounded-[10px] bg-gradient-to-t from-lime-500 to-emerald-500 border-2 border-solid border-[#707076]"
              >
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
          <div className="w-full mx-auto flex flex-row justify-around items-center flex-wrap-nowrap mt-4">
            <div className="max-w-[254px] w-[100%] px-2 option-selected">
              <SelectBox
                disabled
                size={"h-[40px]"}
                // options={typeOptions}
                options={
                  activeScheduleData?.venue === "Both"
                    ? typeOptions
                    : typeOptions.filter(
                        (type) => activeScheduleData?.venue === type
                      )
                }
                value={selectedType}
                onChange={(e) => handleChangeSelect(e, setSelectedType)}
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
                value={selectedService}
                onChange={(e) =>
                  handleChangeSelect(
                    e,
                    setSelectedService
                    // true,
                    // services,
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
            <div className="max-w-[254px] w-[100%] mb-3 px-2 option-selected">
              <div className="max-w-[254px] w-[100%] mb-3 px-2 option-selected relative rounded-2xl w-full  bg-gradient-to-b from-[#02227E] to-[#0247FF] border-none   border-2 border-[#fff] custom-select-dropdown">
                <select
                  // disabled={selectedType !== "Incall"}
                  disabled
                  className="custom-select-btn appearance-none block w-full  px-4 pr-8 h-[40px] shadow leading-tight rounded-2xl focus:outline-none focus:shadow-outline h-[100%] bg-transparent text-white undefined 18px font-bold   undefined focus:outline-none focus:ring-0 text-center"
                  onChange={(e) => {
                    e.target.value === "add-new-addr"
                      ? navigate("/manage-incall-addresses")
                      : handleChangeSelect(
                          e,
                          setSelectedCountry,
                          true,
                          UserDetails?.incallAddresses,
                          "_id"
                        );
                  }}
                >
                  <option selected={!selectedCountry}>Select Address</option>
                  {!UserDetails?.incallAddresses.length && (
                    <option
                      value={"add-new-addr"}
                      selected={false}
                      onClick={() => navigate("/manage-incall-addresses")}
                    >
                      Add new address
                    </option>
                  )}
                  {UserDetails?.incallAddresses?.map((addr) => (
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
          </div>
          <div className="w-full mx-auto mt-1 calendar-design">
            <Calendar onChange={setDate} value={date} />
          </div>
          <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
            <p className="text-center">
              <span className="bold">Selected Date:</span> {date.toDateString()}
            </p>
          </div>
          <div className="w-full mx-auto flex items-center justify-center mt-2">
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
