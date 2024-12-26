import React, { useState } from "react";
import Button from "../../../../components/Button";
import SelectBox_ from "../../../../components/SelectBox_";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HandleEditServices,
  HandleServices,
} from "../../../../redux/action/Services";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loading from "../../../../components/Loading/Index";
import { useEffect } from "react";

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
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const zones = ["A.M", "P.M"];
export default function BusinessHours() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(
    "🚀 ~ file: BusinessHours.jsx:36 ~ BusinessHours ~ state:",
    state
  );
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const [selectedHours, setSelectedHours] = useState({
    Sunday: {
      fromTime: "",
      toTime: "",
    },
    Monday: {
      fromTime: "",
      toTime: "",
    },
    Tuesday: {
      fromTime: "",
      toTime: "",
    },
    Wednesday: {
      fromTime: "",
      toTime: "",
    },
    Thursday: {
      fromTime: "",
      toTime: "",
    },
    Friday: {
      fromTime: "",
      toTime: "",
    },
    Saturday: {
      fromTime: "",
      toTime: "",
    },
  });

  // Function to update the state for a specific day and field
  const updateSelectedHours = (day, field, value) => {
    setSelectedHours((prevHours) => ({
      ...prevHours,
      [day]: {
        ...prevHours[day],
        [field]: value,
      },
    }));
  };

  const HandelButton = () => {
    setIsLoading(true);
    const newData = { ...state };
    // Filter out days with empty time selections
    const nonEmptyDays = Object.keys(selectedHours).filter(
      (day) => selectedHours[day].fromTime && selectedHours[day].toTime
    );

    // Create a new object with non-empty days
    const filteredSelectedHours = {};
    nonEmptyDays.forEach((day) => {
      filteredSelectedHours[day] = selectedHours[day];
    });

    newData.businessday = filteredSelectedHours;
    dispatch(
      state?.EditData
        ? HandleEditServices(state?.EditData?._id, newData)
        : HandleServices(newData)
    )
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setIsLoading(false);
        } else {
          toast(result?.payload?.data?.error, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "error",
          });
          setIsLoading(false);
        }
        navigate(-2)
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err, "Error");
        navigate(-2)        
      });
  };

  useEffect(() => {
    if (state?.EditData?.businessday) {
      setSelectedHours(state?.EditData?.businessday);
    }
  }, [state?.EditData]);

  return (
    <div id="schedule_rules" className="main-container pb-4">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-4 pb-5">
        <div className="w-full mx-auto flex flex-col justify-center items-center">
          <span className="font-extrabold text-[27px] text-black">
            Business Hours
          </span>
        </div>
      </div>
      <div className="form-field-container">
      {daysOfWeek.map((day) => (
        <div
          key={day}
          className="w-full mx-auto flex flex-col justify-center items-center relative"
        >
          <div className="w-full mx-auto flex flex-col justify-center items-start pl-2 pb-2">
            <span className="font-extrabold text-[18px]">{day}</span>
          </div>
          <div className="w-full mx-auto flex flex-row justify-start items-center">
            <div className="mb-3 flex flex-row justify-center items-center">
              <div className="relative w-[82px] rounded-xl">
                <SelectBox_
                  options={times}
                  value={selectedHours[day]?.fromTime}
                  onChange={(event) =>
                    updateSelectedHours(day, "fromTime", event.target.value)
                  }
                  className="rounded-r-none bg-inherit pl-2 appearance-none rounded-2xl text-[18px] font-bold px-0 max-[350px]:pl-2 sm:2l-4 py-1 w-full border-2 border-[#fff] focus:border-[#000] h-[40px]"
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
              <div className="relative w-[75px] rounded-xl">
                <SelectBox_
                  options={zones}
                  value={selectedHours[day]?.fromZone}
                  onChange={(event) =>
                    updateSelectedHours(day, "fromZone", event.target.value)
                  }
                  className="rounded-l-none bg-inherit pl-2 appearance-none rounded-2xl text-[18px] font-bold px-0 max-[350px]:pl-2 sm:2l-4 py-1 w-full border-2 border-[#fff] focus:border-[#000] h-[40px]"
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
            <div className="mx-2 mb-3">
              <span className="text-[16px] font-medium">To</span>
            </div>
            <div className="mb-3 flex flex-row justify-center items-center">
              <div className="mr-3 flex flex-row justify-center items-center">
                <div className="relative w-[83px] rounded-xl">
                  <SelectBox_
                    options={times}
                    value={selectedHours[day]?.toTime}
                    onChange={(event) =>
                      updateSelectedHours(day, "toTime", event.target.value)
                    }
                    className="rounded-r-none bg-inherit pl-2 appearance-none rounded-2xl text-[18px] font-bold px-0 max-[350px]:pl-2 sm:2l-4 py-1 w-full border-2 border-[#fff] focus:border-[#000] h-[40px]"
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
                <div className="relative w-[75px] rounded-xl">
                  <SelectBox_
                    options={zones}
                    value={selectedHours[day]?.toZone}
                    onChange={(event) =>
                      updateSelectedHours(day, "toZone", event.target.value)
                    }
                    className="rounded-l-none bg-inherit pl-2 appearance-none rounded-2xl text-[18px] font-bold px-0 max-[350px]:pl-2 sm:2l-4 py-1 w-full border-2 border-[#fff] focus:border-[#000] h-[40px]"
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
        </div>
      ))}
      </div>
      <div className="flex items-center justify-center px-5">
        <div className="flex items-center justify-center w-full max-w-[420px]">
          <Button
            className={
              "flex items-center w-[249px] mt-[20px] px-[40px] py-2 my-2 w-fit max-w-[270px] justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] rounded-xl"
            }
            text={
              !isLoading ? (
                "Finished"
              ) : (
                <div className="flex items-center	justify-center pt-[6px]">
                  <Loading />
                </div>
              )
            }
            size="42px"
            onClick={HandelButton}
          />
        </div>
      </div>

      {/* <div className="w-[364px] flex flex-row justify-between items-center mt-6">
        <Button
          text="Skip>>"
          className="text-[#040C50] mr-6 bg-transparent shadow-none font-bold text-[23.4px]"
        />
        <Button
          text="Finished"
          className="text-[#040C50] font-bold text-[23.4px]"
        />
      </div> */}
    </div>
  );
}
