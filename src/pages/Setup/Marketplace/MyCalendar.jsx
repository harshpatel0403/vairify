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
import moment from "moment";

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
    const startTime = moment(newtformtime, "hh:mm A");
    const endTime = moment(newtotime, "hh:mm A");
    const duration = moment.duration(endTime.diff(startTime));
    const hours = duration.hours();
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
      from: startTime.format("hh:mm A"),
      to: endTime.format("hh:mm A"),
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
    <div className="main-container celender px-0 p-4 bg-[#D5D6E0] ">
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

      <div className="flex items-center justify-center">
        <button className="bg-[#01195C] px-8 py-2 mr-4 text-white rounded-[30px]">
          Done
        </button>
        <button
          className="bg-[#01195C] px-8 py-2 text-white rounded-[30px]"
          onClick={() => {
            setEndDate(new Date());
            setStartDate(new Date());
          }}
        >
          Reset
        </button>
      </div>

      <hr className="border-[3px] border-[#000] my-4" />
      <div className="form-field-container">
        <div className="flex flex-col items-start justify-start px-4">
          <div className="text-black text-[16px] font-extrabold">Time :</div>
          <div className="flex gap-2 justify-between items-center w-full">
            <div className="flex flex-row justify-center items-center w-full">
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
              <div className="relative w-[85px] bg-[#02227E] rounded-xl">
                <SelectBox_
                  onChange={(e) => {
                    setFromTime(e.target.value);
                  }}
                  options={times}
                  value={fromTime}
                  className={
                    "rounded-r-none bg-inherit pl-2 appearance-none rounded-xl bg-[#02227E] text-[18px] text-[#fff] font-bold px-0 max-[350px]:pl-2 sm:2l-4 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[36px]"
                  }
                />
                <div className="absolute top-2 right-1">
                  <svg
                    className={`w-6 h-6 fill-current text-white`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
              {/* <SelectBox_
              onChange={(e) => setFromZone(e.target.value)}
              options={zones}
              className={
                "bg-gradient-to-b from-[#02227E] to-[#02227E] rounded-r-xl rounded-l-none text-[16px] text-[#fff] font-extrabold px-0 pl-1 max-[350px]:pr-4 pr-5 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[35px]"
              }
              value={fromZone}
            /> */}
              <div className="relative w-1/2 bg-[#02227E] rounded-xl">
                <SelectBox_
                  onChange={(e) => setFromZone(e.target.value)}
                  options={zones}
                  className={
                    "rounded-l-none bg-inherit pl-2 appearance-none rounded-xl bg-[#02227E] text-[18px] text-[#fff] font-bold px-0 max-[350px]:pl-2 sm:2l-4 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[36px]"
                  }
                  value={fromZone}
                />
                <div className="absolute top-2 right-1">
                  <svg
                    className={`w-6 h-6 fill-current text-white`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
            <span className="text-[14.4px] font-bold">To</span>
            <div className="flex flex-row justify-center items-center w-full">
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
              <div className="relative w-[85px] bg-[#02227E] rounded-xl">
                <SelectBox_
                  onChange={(e) => {
                    setToTime(e.target.value);
                  }}
                  options={times}
                  value={toTime}
                  className={
                    "rounded-r-none bg-inherit pl-2 appearance-none rounded-xl bg-[#02227E] text-[18px] text-[#fff] font-bold px-0 max-[350px]:pl-2 sm:2l-4 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[36px]"
                  }
                />
                <div className="absolute top-2 right-1">
                  <svg
                    className={`w-6 h-6 fill-current text-white`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
              {/* <SelectBox_
              onChange={(e) => setToZone(e.target.value)}
              options={zones}
              className={
                "bg-gradient-to-b from-[#02227E] to-[#02227E] rounded-r-xl rounded-l-none text-[16px] text-[#fff] font-extrabold px-0 pl-1 max-[350px]:pr-4 pr-5 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[35px]"
              }
              value={toZone}
            /> */}
              <div className="relative w-1/2 bg-[#02227E] rounded-xl">
                <SelectBox_
                  onChange={(e) => setToZone(e.target.value)}
                  options={zones}
                  className={
                    "rounded-l-none bg-inherit pl-2 appearance-none rounded-xl bg-[#02227E] text-[18px] text-[#fff] font-bold px-0 max-[350px]:pl-2 sm:2l-4 py-1 w-full border-2 border-[#CFCFCF] focus:border-[#000] h-[36px]"
                  }
                  value={toZone}
                />
                <div className="absolute top-2 right-1">
                  <svg
                    className={`w-6 h-6 fill-current text-white`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start px-4">
          <div className="text-black text-[16px] font-extrabold">Location:</div>
          <div className="flex gap-5 justify-between items-center w-full">
            <div className="flex relative flex-row items-center">
              <select
                className="appearance-none pl-2 pr-8 pb-1.5 bg-[#02227E] rounded-xl text-[20px] text-[#fff] font-bold font-inter h-[35px]"
                name="location"
                onChange={(e) => setSelectedLocation(e.target.value)}
                value={selectedLocation}
              >
                <option value={CurrentLocation?.country_name}>
                  Current Location ({CurrentLocation?.country_name})
                </option>
                {(UserDetails.savedLocations || []).map((item) => {
                  return (
                    <option key={item._id} value={item._id}>
                      {item.country} {item.city}
                    </option>
                  );
                })}
              </select>
              <div className="absolute top-2 right-2">
                <svg
                  className={`w-6 h-6 fill-current text-white`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-row justify-center items-center w-fit">
              <Button
                className={
                  " flex items-center px-[10px] py-2 my-2 justify-center rounded-xl bg-gradient-to-b from-[#02227E] to-[#02227E] text-[#fff] font-bold text-[20px] w-[70.2px]"
                }
                text={"Add"}
                size="35px"
                onClick={() => setAddSearchLocation(!addSearchLocation)}
              />
            </div>
          </div>
          {error.selectedLocation && (
            <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[1px] pb-[2px]">
              {error.selectedLocation}
            </label>
          )}
        </div>
        {addSearchLocation && (
          <div className="flex px-4 flex-col items-start w-full max-w-[420px] mt-6 mb-1">
            <p className="text-[18px] text-[#000] text-start font-bold font-inter">
              Search
            </p>
            <div className="flex items-center justify-center w-full gap-4 sm:gap-5">
              <div className="relative w-full">
                <select
                  className="w-full rounded-xl bg-[#02227E] appearance-none px-2 pr-5 py-1.5 bg-gradient-to-b from-[#02227E] to-[#02227E] text-[#fff] font-bold font-inter shadow-[0px_3px_20px_rgba(0,0,0,0.5)]"
                  name="location"
                  onChange={(e) => {
                    setAddLocation(e.target.value);
                  }}
                >
                  <option selected disabled>
                    Country
                  </option>
                  {Location.map((item) => {
                    return <option value={item}>{item}</option>;
                  })}
                </select>
                <div className="absolute top-2 right-2">
                  <svg
                    className={`w-6 h-6 fill-current text-white`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
              <div className="relative w-full">
                <select
                  className="w-full rounded-xl bg-[#02227E] appearance-none px-2 pr-5 py-1.5 bg-gradient-to-b from-[#02227E] to-[#02227E] text-[#fff] font-bold font-inter shadow-[0px_3px_20px_rgba(0,0,0,0.5)]"
                  name="city"
                  onChange={(e) => setSelectedCity(e.target.value)}
                  value={selectedCity}
                >
                  <option selected={!selectedCity}>City</option>
                  {City.map((item) => {
                    return (
                      <option
                        selected={item.name === selectedCity}
                        value={item.name}
                      >
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute top-2 right-2">
                  <svg
                    className={`w-6 h-6 fill-current text-white`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center items-center">
              <div className="flex justify-center items-center">
                <Button
                  className={
                    "flex items-center pr-4 pl-4 mt-4 py-2 my-2 justify-center bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#02227E] text-[#fff] font-bold text-[24px] py-2 rounded-xl shadow-[0px_9px_20px_rgba(0,0,0,0.5)]"
                  }
                  text={"Save location "}
                  size="40px"
                  onClick={() => {
                    HandleLocation();
                    setAddSearchLocation(!addSearchLocation);
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col items-start justify-start px-4">
          <div className="text-black text-[16px] font-extrabold">Frequency</div>
          <div className="flex gap-5 justify-between items-center w-full">
            <div className="flex relative flex-row justify-center items-center">
              <select
                className="w-full appearance-none pl-2 pr-8 pb-1.5 bg-[#02227E] rounded-xl text-[20px] text-[#fff] font-bold font-inter h-[35px]"
                name="frequency"
                onChange={(e) => setFrequency(e.target.value)}
                value={frequency}
              >
                <option selected disabled>
                  Frequency
                </option>
                {Frequency.map((item) => {
                  return <option value={item}>{item}hrs</option>;
                })}
              </select>
              <div className="absolute top-2 right-2">
                <svg
                  className={`w-6 h-6 fill-current text-white`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-row justify-center items-center w-fit gap-4 mr-10">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => setFeaturelisting(e.target.checked)}
                    />
                  }
                  className="w-[19px]"
                />
              </FormGroup>
              <p className="text-[#02227E] text-[20px] font-extrabold">
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
        <div className="text-start px-4">
          <p className="text-[20px] font-extrabold">*1GRT Per Post</p>
          <p className="text-[20px] font-extrabold">
            {" "}
            *2GRT per day for Feature listing
          </p>
        </div>
        <div className="px-4 w-full mt-4 flex justify-center">
          <div className="w-[80%]">
            <Button
              className={
                "flex items-center px-[10px] py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px]"
              }
              text={"Review"}
              size="40px"
              onClick={HandleButton}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
