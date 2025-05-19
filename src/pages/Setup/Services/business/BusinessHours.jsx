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
import SelectBox from "../../../../components/SelectBox";
import PageTitle from "../../../../components/PageTitle";

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
    <div id="schedule_rules" className="container pb-[48px]">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Business Hours"} />
      </div>
      <div className="w-full">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="w-full mx-auto flex flex-col justify-center items-center relative"
          >
            <div className="text-white font-medium text-lg text-left mb-[8px] w-full">
              {day}
            </div>
            <div className="w-full mx-auto flex flex-row justify-start items-center sm:flex-nowrap flex-wrap">
              <div className="mb-3 flex flex-row justify-center items-center w-full gap-[8px]">
                <div className="relative w-full rounded-xl">
                  <SelectBox
                    options={times}
                    value={selectedHours[day]?.fromTime}
                    onChange={(event) =>
                      updateSelectedHours(day, "fromTime", event.target.value)
                    }
                    className1="text-[14px] font-normal  border border-[#919EAB33] w-[100%] rounded-[8px]"
                    size={"h-[47px]"}
                    textAlign={"text-left"}
                    rounded={"rounded-2xl"}
                    fontWeight={"font-bold"}
                    textColor={"text-white"}
                    textSize={"text-[14px]"}
                  />
                </div>
                <div className="relative  w-full rounded-xl">
                  <SelectBox
                    options={zones}
                    value={selectedHours[day]?.fromZone}
                    onChange={(event) =>
                      updateSelectedHours(day, "fromZone", event.target.value)
                    }
                    className1="text-[14px] font-normal  border border-[#919EAB33] w-[100%] rounded-[8px]"
                    size={"h-[47px]"}
                    textAlign={"text-left"}
                    rounded={"rounded-2xl"}
                    fontWeight={"font-bold"}
                    textColor={"text-white"}
                    textSize={"text-[14px]"}
                  />
                </div>
              </div>
              <div className="mx-3 mb-3">
                <span className="text-[16px] font-medium text-white">To</span>
              </div>
              <div className="mb-3 flex flex-row justify-center items-center w-full">
                <div className="flex flex-row justify-center items-center w-full gap-[8px]">
                  <div className="relative  w-full rounded-xl">
                    <SelectBox
                      options={times}
                      value={selectedHours[day]?.toTime}
                      onChange={(event) =>
                        updateSelectedHours(day, "toTime", event.target.value)
                      }
                      className1="text-[14px] font-normal  border border-[#919EAB33] w-[100%] rounded-[8px]"
                      size={"h-[47px]"}
                      textAlign={"text-left"}
                      rounded={"rounded-2xl"}
                      fontWeight={"font-bold"}
                      textColor={"text-white"}
                      textSize={"text-[14px]"}
                    />
                  </div>
                  <div className="relative  w-full rounded-xl">
                    <SelectBox
                      options={zones}
                      value={selectedHours[day]?.toZone}
                      onChange={(event) =>
                        updateSelectedHours(day, "toZone", event.target.value)
                      }
                      className1="text-[14px] font-normal  border border-[#919EAB33] w-[100%] rounded-[8px]"
                      size={"h-[47px]"}
                      textAlign={"text-left"}
                      rounded={"rounded-2xl"}
                      fontWeight={"font-bold"}
                      textColor={"text-white"}
                      textSize={"text-[14px]"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center ">
        <div className="flex items-center justify-center w-full max-w-[500px] mt-[24px]">
          <Button
            text={
              !isLoading ? (
                "Finished"
              ) : (
                <div className="flex items-center	justify-center">
                  <Loading />
                </div>
              )
            }
            disabled={isLoading}
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
