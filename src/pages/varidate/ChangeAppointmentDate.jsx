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
import ChangeAppointmentTime from "./ChangeAppointmentTime";
import Loading from "../../components/Loading/Index";
import PageTitle from "../../components/PageTitle";

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

  const getUserServices = async (userId) => { };

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
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container pb-[48px]">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle isSmall={true} title={"Modify Appointment"} />
      </div>
      <div className="w-full flex flex-row sm:justify-around justify-between items-end mt-[110px] p-[16px] bg-[#FFFFFF0A] rounded-[16px]">
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
              alt="Intimate Massage"
            />

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
              {companionData?.avgRating}
            </div>
            <img src="/images/home/star.svg" alt="star" />
          </div>
        </div>
      </div>

      <div className="w-full mx-auto flex flex-row justify-around items-center mt-4">
        {staff == "1st Available" ? (
          <Button
            onClick={() => toggle("1st Available")}
            className="secondary-btn !bg-[#FFFFFF29] w-full opacity-[0.7] cursor-not-allowed max-w-[500px]"
            text='Book 1st Available'
          />
        ) : (
          <Button
            onClick={() => toggle("1st Available")}
            className="secondary-btn !bg-[#FFFFFF29] w-full max-w-[500px]"
            text='Book 1st Available'
          />
        )}
      </div>

      <div className="w-full sm:mt-[48px] mt-[24px]">
        <div className="w-full mx-auto flex flex-row  items-center flex-wrap-nowrap sm:gap-[24px] gap-[16px]">
          <div className="w-full">
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
              className1="text-[14px] font-normal border border-[#919EAB33] w-[100%] rounded-[8px] h-[54px]"
              textAlign={"text-left"}
              rounded={"rounded-2xl"}
              fontWeight={"font-bold"}
              textColor={"text-white"}
              textSize={"text-[14px]"}
            />
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row  items-center flex-wrap-nowrap sm:mt-[24px] mt-[16px] sm:gap-[24px] gap-[16px]">
          <div className=" w-[100%] ">
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
          <div className=" w-[100%] ">
            <div className="w-full select-arrow">
              <select
                // disabled={selectedType !== "Incall"}
                disabled
                className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
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
            </div>
          </div>
        </div>
        <div className="w-full mx-auto mt-[24px] calendar-design max-w-[550px] ">
          <Calendar onChange={setDate} value={date} />
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
          <p className="text-center text-sm text-white mt-[24px]">Selected Date: {date.toDateString()}</p>
        </div>
        {/* <div className="w-full mx-auto flex items-center justify-center mt-2">
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

        <ChangeAppointmentTime state={{
          type: selectedType,
          hours: selectedHours,
          service: { servicesName: selectedService },
          country: selectedCountry,
          date,
          allServices,
          availableHours: hours,
          companionData,
          params: params
        }} />
      </div>
    </div>
  );
}
