import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUSLocale from "date-fns/locale/en-US";
import SelectBox_ from "../../../components/SelectBox_";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { HandleCountry, HandleSaveLocation } from "../../../redux/action/Auth";
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

export default function MyCalendar() {
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
    if (!selectedLocation) {
      validationErrors.selectedLocation = "Location is required";
    }
    if (!frequency) {
      validationErrors.frequency = "Frequency is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return; // Prevent form submission if there are errors
    }
    // Clear any previous errors
    setError({});

    const FromDate = moment(startDate).format("DD/MM/YYYY");
    const ToDate = moment(endDate).format("DD/MM/YYYY");

    // Hours
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

    // Days
    const startdate = moment(startDate, "DD/MM/YYYY");
    const enddate = moment(endDate, "DD/MM/YYYY");
    const dayduration = moment.duration(enddate.diff(startdate));
    const days = dayduration.days() + 1;

    const newPostHours = parseFloat(hours) / parseFloat(frequency);
    const perdaypost = newPostHours.toFixed();
    const totalpost = parseInt(perdaypost) * (parseInt(days) || 1);

    const newData = { ...state };
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
      (item) => (item.country === selectedLocation) || (item?._id === selectedLocation)
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
      // Call api service here...
      dispatch(
        HandleSaveLocation(
          { country: location, city: selectedCity },
          UserDetails._id
        )
      );
    }
  };

  return (
    <div className="container">
      <div className="max-w-[400px] mx-auto sm:my-[48px] my-[24px]">
        <div className="post-section">
          <h4 className="font-medium text-[18px] text-white mb-1 text-center">Select Date</h4>
          <div className="mt-[24px]">
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
          </div>

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
          <div className="mt-[24px]">
            <div className="flex flex-col items-start justify-start">
              <div className="text-white text-[18px] font-medium mb-1">Select Timing</div>
              <div className="flex gap-2 sm:justify-between sm:flex-nowrap flex-wrap items-center w-full">
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
                  value={UserDetails?.savedLocations?.find(item => item?.country === selectedLocation)?._id}
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
    </div>
  );
}
