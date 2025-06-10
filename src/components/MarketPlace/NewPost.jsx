import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Button from "../../components/Button/index";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUSLocale from "date-fns/locale/en-US";
import SelectBox_ from "../../components/SelectBox_";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { HandleCountry, HandleSaveLocation, HandleUser } from "../../redux/action/Auth";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths } from "date-fns";
import moment from "moment-timezone";
import { CaretDown } from "phosphor-react";
const locales = {
  "en-US": enUSLocale,
};
let Location = [];
const FavoriteLocations = [];
// const City = [];
const CustomPrevArrow = ({ onClick }) => (
  <div onClick={onClick} className="custom-prev-arrow">
    {"<"}
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div onClick={onClick} className="custom-next-arrow">
    {">"}
  </div>
);

export default function NewPost() {

  // new post
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState();
  const [message, setMessage] = useState();

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setImage(fileUploaded);
  };
  const data = {
    image,
    message,
  };
  const HandleClick = () => {
    const validationErrors = {};
    if (!image) {
      validationErrors.image = "Image is required";
    }
    if (!message) {
      validationErrors.message = "Message is required"
    }

    if (Object.keys(validationErrors).length > 0) {
      toast(validationErrors.image || validationErrors.message, {
        hideProgressBar: true,
        autoClose: 1000,
        type: "error",
      });
      setError(validationErrors);
      return;
    }
    setError({});
    console.log(data);
    navigate("/my-calendar", {
      state: data,
    });
  };





  // calendar
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const countryData = useSelector((state) => state?.Auth?.country);
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const CurrentLocation = useSelector(
    (state) => state?.CurrentLocation?.currentLocation
  );
  const { state } = useLocation();
  console.log("🚀 ~ file: MyCalendar.jsx:33 ~ MyCalendar ~ state:", state);
  const [fromTime, setFromTime] = useState("10:00");
  const [fromZone, setFromZone] = useState("A.M");
  const [toTime, setToTime] = useState("05:00");
  const [toZone, setToZone] = useState("P.M");
  const [selectedLocation, setSelectedLocation] = useState(state?.location);
  const [frequency, setFrequency] = useState(state?.frequency);
  const [featurelisting, setFeaturelisting] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState({});
  const [addSearchLocation, setAddSearchLocation] = useState(false);
  const [addLocation, setAddLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState("City");

  const [City, setCity] = useState([]);

  useEffect(() => {
    dispatch(HandleUser(UserDetails?._id))
  }, [])
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
  const Frequency = ["1", "2", "3"];

  const HandleButton = () => {
    const validationErrors = {};
    if (!image) {
      validationErrors.image = "Image is required";
    }
    if (!message) {
      validationErrors.message = "Message is required"
    }
    if (!selectedLocation) {
      validationErrors.selectedLocation = "Location is required";
    }
    if (!frequency) {
      validationErrors.frequency = "Frequency is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setError({});

    const FromDate = moment(startDate).format("DD/MM/YYYY");
    const ToDate = moment(endDate).format("DD/MM/YYYY");

    const newtformtime = fromTime + " " + fromZone;
    const newtotime = toTime + " " + toZone;

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const startTimeWithTimezone = moment.tz(newtformtime, "hh:mm A", userTimezone);
    const endTimeWithTimezone = moment.tz(newtotime, "hh:mm A", userTimezone);

    const fromUtc = startTimeWithTimezone.utc().format("YYYY-MM-DD hh:mm A");
    const toUtc = endTimeWithTimezone.utc().format("YYYY-MM-DD hh:mm A");

    const duration = moment.duration(endTimeWithTimezone.diff(startTimeWithTimezone));
    const hours = duration.asHours();

    // const startTime = moment(newtformtime, "hh:mm A");
    // const endTime = moment(newtotime, "hh:mm A");
    // const duration = moment.duration(endTime.diff(startTime));
    // const hours = duration.hours();

    const startdate = moment(startDate, "DD/MM/YYYY");
    const enddate = moment(endDate, "DD/MM/YYYY");
    const dayduration = moment.duration(enddate.diff(startdate));
    const days = dayduration.days() + 1;

    const newPostHours = parseFloat(hours) / parseFloat(frequency);
    const perdaypost = newPostHours.toFixed();
    const totalpost = parseInt(perdaypost) * (parseInt(days) || 1);

    const newData = { ...state, ...data, };
    newData.date = {
      from: FromDate,
      to: ToDate || FromDate,
    };
    newData.date = {
      from: FromDate,
      to: ToDate === "Invalid date" ? FromDate : ToDate,
    };
    newData.time = {
      from: fromUtc,
      to: toUtc,
    };
    const locData = UserDetails.savedLocations.find(
      (item) => item._id === selectedLocation
    );
    newData.location = locData.country;
    newData.city = locData.city;
    newData.frequency = frequency;
    newData.featurelisting = featurelisting;
    newData.durationHours = hours;
    newData.durationDays = days;
    newData.perdaypost = perdaypost;
    newData.totalpost = totalpost;
    newData.totalGRT = parseInt(totalpost) * (featurelisting ? 2 : 1);
    newData.userId = UserDetails?._id;

    navigate("/marketplace/post/review", {
      state: newData,
    });
  };

  useMemo(() => {
    const countryNames = [];
    countryData &&
      countryData?.map((item) => {
        const name = item.name;
        const city = item?.cities?.map((city) => city?.name);
        countryNames.push(name);

        // City.push(city)
      });
    if (CurrentLocation?.country_name) {
      const normalizedValue = CurrentLocation?.country_name;
      if (!FavoriteLocations?.includes(normalizedValue)) {
        FavoriteLocations.push(normalizedValue);
      }
    }

    Location = countryNames;
  }, [countryData]);

  useEffect(() => {
    let country = countryData?.find((item) => item.name === addLocation);
    if (country) {
      setCity(country.cities);
      setSelectedCity(null);
    }
  }, [addLocation]);

  useEffect(() => {
    dispatch(HandleCountry());
  }, []);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const HandleLocation = () => {
    const location = addLocation;
    if (location && selectedCity) {
      dispatch(
        HandleSaveLocation(
          { country: location, city: selectedCity },
          UserDetails._id
        )
      );
    }
  };


  return (
    <div className="max-w-[500px] mx-auto">
      {/* new post */}
      <div className="flex flex-col gap-[24px] mb-[24px]">
        <div>
          <div className="bg-[url('/images/marketplace/token-card-bg.svg')] w-full h-[150px] rounded-[8px] py-[24px] px-[16px] flex justify-between items-start lg:mt-0 mt-8">
            <div>
              <p className="text-sm font-normal text-[#919EAB]">Available Point </p>
              <p className="text-[28px] font-semibold text-[#060C4D] mt-[2px]">{UserDetails?.tokens}</p>
            </div>
            <button className="text-white text-sm py-[2px] px-[20px] bg-[#060C4D] rounded-[16px]" onClick={() => navigate('/goldentoken')}>
              Add
            </button>
          </div>
          <div className="flex justify-center items-center mx-auto w-full h-[144px] rounded-lg my-[24px]">
            {image ? (
              <img className="w-full object-cover h-[146px] rounded-lg " src={URL.createObjectURL(image)} />
            ) : (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="70"
                  height="60"
                  viewBox="0 0 89 75"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23.7584 9.51738C25.6194 6.37437 26.5499 4.80721 27.8465 3.66548C28.9932 2.65486 30.3422 1.89181 31.8067 1.42543C33.4604 0.900147 35.3038 0.900146 38.995 0.900146H49.601C53.2966 0.900146 55.14 0.900147 56.7937 1.42543C58.2582 1.89181 59.6072 2.65486 60.7539 3.66548C62.0504 4.80721 62.981 6.37437 64.842 9.51738L67.4527 13.9237H70.7602C76.9342 13.9237 80.0212 13.9237 82.3805 15.1045C84.4545 16.1459 86.1402 17.8069 87.1963 19.8494C88.4002 22.1719 88.4002 25.2107 88.4002 31.2884V57.3354C88.4002 63.4131 88.4002 66.4519 87.1963 68.7744C86.1395 70.8153 84.4538 72.4747 82.3805 73.515C80.0212 74.7001 76.9342 74.7001 70.7602 74.7001H17.8402C11.6662 74.7001 8.5792 74.7001 6.21985 73.515C4.14497 72.4754 2.45765 70.816 1.39972 68.7744C0.200196 66.4519 0.200195 63.4131 0.200195 57.3354V31.2884C0.200195 25.2107 0.200196 22.1719 1.39972 19.8494C2.4569 17.8062 4.1443 16.1452 6.21985 15.1045C8.5792 13.9237 11.6662 13.9237 17.8402 13.9237H21.1477L23.7584 9.51738ZM44.3002 61.8937C49.8558 61.8937 55.1839 59.7212 59.1123 55.854C63.0407 51.9869 65.2477 46.742 65.2477 41.2731C65.2477 35.8042 63.0407 30.5592 59.1123 26.6921C55.1839 22.825 49.8558 20.6525 44.3002 20.6525C38.7446 20.6525 33.4165 22.825 29.4881 26.6921C25.5597 30.5592 23.3527 35.8042 23.3527 41.2731C23.3527 46.742 25.5597 51.9869 29.4881 55.854C33.4165 59.7212 38.7446 61.8937 44.3002 61.8937ZM56.2072 41.2731C56.2072 44.3817 54.9527 47.3631 52.7197 49.5612C50.4867 51.7594 47.4581 52.9943 44.3002 52.9943C41.1423 52.9943 38.1137 51.7594 35.8807 49.5612C33.6477 47.3631 32.3932 44.3817 32.3932 41.2731C32.3932 38.1644 33.6477 35.1831 35.8807 32.985C38.1137 30.7868 41.1423 29.5519 44.3002 29.5519C47.4581 29.5519 50.4867 30.7868 52.7197 32.985C54.9527 35.1831 56.2072 38.1644 56.2072 41.2731Z"
                    fill="white"
                  />
                </svg>
              </span>
            )}
          </div>
          <div>
            <button
              // type="button"
              onClick={handleClick}
              className="bg-[#919EAB33] p-[16px] rounded-lg font-normal text-[14px] text-white flex items-center justify-center gap-1 w-full "
            >
              <img src="/images/home/upload.svg" alt="icon" /> Upload Image from gallery
            </button>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleChange}
              style={{ display: "none" }}
              accept=".png, .jpg, .jpeg, image/png, image/jpeg"
            />
          </div>
        </div>
        {error.image && (
          <label className="text-red-500 text-lg flex items-baseline pl-[25px] pt-[1px] pb-[2px]">
            {error.image}
          </label>
        )}
        <textarea
          className="border border-[#919EAB33] rounded-lg p-[14px] w-full bg-transparent !text-white text-[14px] font-normal !placeholder-white"
          rows={4}
          placeholder="Message"
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        {error.message && (
          <label className="text-red-500 text-lg flex items-baseline pl-[25px] pt-[1px] pb-[2px]">
            {error.message}
          </label>
        )}
        {/* <div className="px-4 mt-2">
          <div className="flex mt-2 items-center justify-center w-full">
            <Button
              text={"Schedule time"}
              onClick={HandleClick}
            />
          </div>
        </div> */}
      </div>
      {/* ------------> calendar <-------------  */}
      <div className="post-section">
        <h4 className="font-medium text-[18px] text-white mb-1">Select Date</h4>
        <div>
          <DatePicker
            selected={startDate}
            onChange={onChange}
            minDate={new Date()}
            maxDate={addMonths(new Date(), 5)}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            showDisabledMonthNavigation
          />

          <div className="flex items-center justify-between gap-2 mt-[10px]">
            <button className="bg-[#FFFFFF] rounded-[8px] py-[7px] px-[20px] w-full max-w-[144px] text-[14px] font-medium text-[#060C4D] hover:scale-[0.97] transition-all duration-200">
              Done
            </button>
            <button
              className="bg-[#FFFFFF29] rounded-[8px] py-[7px] px-[20px] w-full max-w-[144px] text-[14px] font-medium text-white hover:scale-[0.97] transition-all duration-200"
              onClick={() => {
                setEndDate(new Date());
                setStartDate(new Date());
              }}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col items-start justify-start">
            <div className="text-white text-[18px] font-medium mb-1">Select Timing</div>
            <div className="flex gap-2 sm:justify-between items-center w-full sm:flex-nowrap flex-wrap">
              <div className="flex gap-2 justify-center items-center">
                {/* <SelectBox_
              onChange={(e) => {
                setFromTime(e.target.value);
              }}
              options={times}
              className={
                "bg-gradient-to-b from-[#02227E] to-[#02227E] rounded-l-xl rounded-r-none text-[16px] text-[#fff] font-extrabold px-0 pl-2 max-[350px]:pl-1 sm:pl-4 pr-3 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[35px]"
              }
              value={fromTime}
            /> */}
                <div className="relative w-[85px]">
                  <SelectBox_
                    onChange={(e) => {
                      setFromTime(e.target.value);
                    }}
                    options={times}
                    value={fromTime}
                    className={
                      "bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
                    }
                  />
                  <div className="absolute z-[-1] top-[10px] right-2 text-white"><CaretDown size={16} /></div>
                </div>
                {/* <SelectBox_
              onChange={(e) => setFromZone(e.target.value)}
              options={zones}
              className={
                "bg-gradient-to-b from-[#02227E] to-[#02227E] rounded-r-xl rounded-l-none text-[16px] text-[#fff] font-extrabold px-0 pl-1 max-[350px]:pr-4 pr-5 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[35px]"
              }
              value={fromZone}
            /> */}
                <div className="relative rounded-xl w-[60px]">
                  <SelectBox_
                    onChange={(e) => setFromZone(e.target.value)}
                    options={zones}
                    className={
                      "bg-transparent appearance-none cursor-pointer pl-2 rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2  w-full border border-[#919EAB33] focus:border-[#ffffff] "
                    }
                    value={fromZone}
                  />
                  <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
                </div>
              </div>
              <p className="text-[14px] text-white font-normal sm:hidden">To</p>
              <div className="flex gap-2 justify-center items-center">
                {/* <SelectBox_
              onChange={(e) => {
                setToTime(e.target.value);
              }}
              options={times}
              className={
                "bg-gradient-to-b from-[#02227E] to-[#02227E] rounded-l-xl rounded-r-none text-[16px] text-[#fff] font-extrabold px-0 pl-2 max-[350px]:pl-1 sm:pl-4 pr-3 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[35px]"
              }
              value={toTime}
            /> */}
                <div className="relative w-[85px] rounded-xl">
                  <SelectBox_
                    onChange={(e) => {
                      setToTime(e.target.value);
                    }}
                    options={times}
                    value={toTime}
                    className={
                      "bg-transparent appearance-none cursor-pointer pl-2 rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2  w-full border border-[#919EAB33] focus:border-[#ffffff] "
                    }
                  />
                  <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
                </div>
                {/* <SelectBox_
              onChange={(e) => setToZone(e.target.value)}
              options={zones}
              className={
                "bg-gradient-to-b from-[#02227E] to-[#02227E] rounded-r-xl rounded-l-none text-[16px] text-[#fff] font-extrabold px-0 pl-1 max-[350px]:pr-4 pr-5 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[35px]"
              }
              value={toZone}
            /> */}
                <div className="relative rounded-xl w-[60px]">
                  <SelectBox_
                    onChange={(e) => setToZone(e.target.value)}
                    options={zones}
                    className={
                      "bg-transparent appearance-none cursor-pointer pl-2 rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2  w-full border border-[#919EAB33] focus:border-[#ffffff] "
                    }
                    value={toZone}
                  />
                  <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[24px] flex items-center justify-between">
            <div className="text-white text-[18px] font-medium mb-1">Location</div>
            <Button
              text={"+ Add"}
              className={'max-w-[60px] !p-0'}
              onClick={() => setAddSearchLocation(!addSearchLocation)}
            />
          </div>

          <div>
            <div className="relative mt-2">
              <select
                className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
                name="location"
                onChange={(e) => setSelectedLocation(e.target.value)}
                value={selectedLocation}
              >
                <option value={CurrentLocation?.country_name} className="text-black">
                  Current Location ({CurrentLocation?.country_name})
                </option>
                {(UserDetails.savedLocations || []).map((item) => {
                  return (
                    <option key={item._id} value={item._id} className="text-black">
                      {item.country} {item.city}
                    </option>
                  );
                })}
              </select>
              <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
            </div>
            {error.selectedLocation && (
              <label className="text-red-500 text-lg flex items-baseline pl-[12px] mt-2 pb-[2px]">
                {error.selectedLocation}
              </label>
            )}
          </div>
          {addSearchLocation && (
            <div className="flex flex-col items-start w-full mt-6 mb-1">
              <p className="text-[18px] text-white text-start font-medium">
                Search
              </p>
              <div className="flex items-center justify-center w-full gap-4 sm:gap-5">
                <div className="relative w-full">
                  <select
                    className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff]"
                    name="location"
                    onChange={(e) => {
                      setAddLocation(e.target.value);
                    }}
                  >
                    <option selected disabled className="text-black">
                      Country
                    </option>
                    {Location.map((item) => {
                      return <option value={item} className="text-black">{item}</option>;
                    })}
                  </select>
                  <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
                </div>
                <div className="relative w-full">
                  <select
                    className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff]"
                    name="city"
                    onChange={(e) => setSelectedCity(e.target.value)}
                    value={selectedCity}
                  >
                    <option selected={!selectedCity} className="text-black">City</option>
                    {City.map((item) => {
                      return (
                        <option
                          selected={item.name === selectedCity}
                          value={item.name}
                          className="text-black"
                        >
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
                </div>
              </div>
              <Button
                className={'my-[24px]'}
                text={"Save location "}
                onClick={() => {
                  HandleLocation();
                  setAddSearchLocation(!addSearchLocation);
                }}
              />
            </div>
          )}
          <div>
            <div className="flex gap-2 justify-between items-center w-full my-[24px]">
              <div className="flex relative flex-row justify-center items-center w-full">
                <select
                  className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff]"
                  name="frequency"
                  onChange={(e) => setFrequency(e.target.value)}
                  value={frequency}
                >
                  <option selected disabled>
                    Frequency
                  </option>
                  {Frequency.map((item) => {
                    return <option value={item} className="text-black">{item}hrs</option>;
                  })}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
              </div>

              <div className="flex flex-row justify-center items-center w-fit">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => setFeaturelisting(e.target.checked)}
                        sx={{
                          color: 'white',
                          '&.Mui-checked': {
                            color: 'white',
                          },
                        }}
                      />
                    }
                    className="w-[19px]"
                  />
                </FormGroup>
                <p className="text-[18px] text-white text-start font-normal">
                  Feature
                </p>
              </div>
            </div>
            {error.frequency && (
              <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[1px] pb-[2px]">
                {error.frequency}
              </label>
            )}
          </div>
          <div className="my-[24px]">
            <p className="text-[14px] font-normal text-white opacity-[0.7]">*1GRT Per Post</p>
            <p className="text-[14px] font-normal text-white opacity-[0.7]">
              {" "}
              *2GRT per day for Feature listing
            </p>
          </div>
          <div className="w-full">
            <Button
              text={"Review"}
              onClick={HandleButton}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
