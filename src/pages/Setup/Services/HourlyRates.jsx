import React, { useEffect, useState } from "react";
import InputText from "../../../components/InputText";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Selecter from "../../../components/Selecter/Selecter";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleSelectServices,
  HandleServices,
} from "../../../redux/action/Services";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
import Button from "../../../components/Button";

const HourlyRates = () => {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const updatedServices = useSelector(
    (state) => state?.Services?.services?.updatedServices
  );
  const savedServices = useSelector((state) => state?.Services?.getservices);
  const existingServices = savedServices[0];

  const { state: Service } = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currencyOptions = ["Currency", "USD", "EUR", "INR", "FDP"];
  const [currency, setCurrency] = useState(
    updatedServices
      ? updatedServices?.hourlyRates[0]?.currency
      : existingServices?.hourlyRates[0]?.currency || Service?.rows[0]?.currency
  );
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [errors, setErrors] = useState({});

  const changeCurrency = (e) => {
    setCurrency(e.target.value);
  };

  const hours = [
    { label: "0.5 Hour", value: 0.5 },
    { label: "1 Hour", value: 1 },
    { label: "2 Hours", value: 2 },
    { label: "3 Hours", value: 3 },
    { label: "6 Hours", value: 6 },
    { label: "12 Hours", value: 12 },
    { label: "24 Hours", value: 24 },
    { label: "48 Hours", value: 48 },
    { label: "Another 24th", value: 244 },
  ];

  const hourss = {
    0.5: "0.5 Hour",
    1: "1 Hour",
    2: "2 Hours",
    3: "3 Hours",
    6: "6 Hours",
    12: "12 Hours",
    24: "24 Hours",
    48: "48 Hours",
    244: "Another 24th",
  };

  const [hourlyData, setHourlyData] = useState(
    hours.map((hour) => ({
      time: hour.value,
      incall: "",
      outcall: "",
      currency: currency,
    }))
  );

  useEffect(() => {
    if (
      updatedServices?.hourlyRates &&
      updatedServices?.hourlyRates.length > 0
    ) {
      const updatedHours = hourlyData.map((firstEle) => {
        const hourData = updatedServices.hourlyRates.find((secondEle) => {
          return secondEle.time == firstEle.time;
        });

        if (hourData) {
          return {
            ...firstEle,
            incall: hourData.incall,
            outcall: hourData.outcall,
          };
        }

        return firstEle;
      });
      setHourlyData(updatedHours);
    }
  }, []);

  useEffect(() => {
    if (
      !updatedServices &&
      existingServices?.hourlyRates &&
      existingServices?.hourlyRates?.length > 0
    ) {
      const updatedHours = hourlyData.map((firstEle) => {
        const hourData = existingServices.hourlyRates.find((secondEle) => {
          return secondEle.time == firstEle.time;
        });

        if (hourData) {
          return {
            ...firstEle,
            incall: hourData.incall,
            outcall: hourData.outcall,
          };
        }

        return firstEle;
      });
      setHourlyData(updatedHours);
    }
  }, [existingServices]);

  const handleChange = (index, field, value) => {
    const inputRegex = /^[0-9]*$/;

    if (inputRegex.test(value) || value === "") {
      setErrors({});
      const updatedData = [...hourlyData];
      updatedData[index][field] = value;

      setHourlyData(updatedData);
    } else {
      setErrors({
        message: "*Amount should be number only",
      });
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Check if both Incall and Outcall are not set for any item
    const hasAllIncompleteData = hourlyData.every(
      (item) => item.incall.trim() === "" && item.outcall.trim() === ""
    );

    if (hasAllIncompleteData) {
      setErrors({
        message: "Incall or Outcall is required for at least one item",
      });
      setIsLoading(false);
      return;
    }
    setErrors({});

    const filteredHourlyData = hourlyData?.filter(
      (hourData) =>
        hourData.incall.trim() !== "" || hourData.outcall.trim() !== ""
    );
    const body = {
      userId: UserDetails?._id,
      services: Service?.rows,
      hourlyRates: filteredHourlyData,
      user_type: UserDetails?.user_type,
      serviceType: Service?.Service?.selectedServices,
    };
    dispatch(HandleServices(body))
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          dispatch(HandleSelectServices([]));
          navigate(-3)
          setIsLoading(false);
        } else {
          toast(result?.payload?.data?.error, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "error",
          });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        navigate(-3)
        setIsLoading(false);
        console.error(err, "Error");
      });
  };

  return (
    <div className="main-container p-0">
      <div className="flex flex-col justify-center items-center pt-custom-24 mx-auto">
        <div className="text-[27px] text-[#000] font-bold pt-4">
          <span>Hourly Rates</span>
        </div>
        <div className="data-body" style={{ maxWidth: "95%" }}>
          <div className="w-full flex flex-row justify-between items-center mt-4">
            <div className="w-[100px] flex flex-col justify-center items-center">
              <span className="text-[14px] font-bold text-[#026EFF]">Time</span>
            </div>
            <div className="w-[160px] flex flex-col justify-center items-center">
              <span className="text-[14px] font-bold text-[#026EFF]">
                Incall
              </span>
            </div>
            <div className="w-[100px] flex flex-col justify-center items-center">
              <span className="text-[14px] font-bold text-[#026EFF]">
                Outcall
              </span>
            </div>
            <div className="w-[80px] flex flex-col justify-center items-center currency-part">
              <Selecter
                options={currencyOptions}
                value={currency}
                onChange={(e) => changeCurrency(e)}
                className="text-[8px] text-right font-bold text-[#026EFF] txt-custom-color-4 shadow-none focus-visible:border-0 focus-visible:border-white px-1 py-2"
                textSize="8px"
                textColor="#026EFF"
              />
            </div>
          </div>
          <div className="w-full flex flex-col justify-center items-center data-item">
            {hourlyData?.length > 0 &&
              hourlyData?.map((hour, index) => {
                return (
                  <div className="w-full flex flex-row justify-between items-center mt-5 text-[13px] text-[#02227E] font-bold service-item-row">
                    <div className="w-[100px] sm:w-[100px] flex flex-col justify-center items-center">
                      <span className="text-[14px] font-medium">
                        {hourss[hour.time]}
                      </span>
                    </div>
                    <div className="w-[160px] flex flex-col justify-center items-center">
                      <InputText
                        value={hour?.incall}
                        placeholder="Enter ammount"
                        className="w-full text-[12px] font-bold"
                        size="30px"
                        onChange={(e) =>
                          handleChange(index, "incall", e.target.value)
                        }
                      />
                    </div>
                    <div className="w-[100px] flex flex-col justify-center items-center">
                      <InputText
                        value={hour?.outcall}
                        placeholder="Enter ammount"
                        className="w-full text-[12px] font-bold"
                        size="30px"
                        onChange={(e) =>
                          handleChange(index, "outcall", e.target.value)
                        }
                      />
                    </div>
                    <div className="w-[80px]  flex flex-col justify-center items-center">
                      <span className="text-[14px] font-medium">
                        {currency}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {errors?.message && (
          <label className="text-red-500 text-lg pt-5 flex items-baseline ">
            {errors.message}
          </label>
        )}
        <div className="mt-0 mb-2 flex justify-center items-center py-5 w-full">
          <Button
            className={
              "flex items-center justify-center max-w-[270px] bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
            }
            text={
              !isLoading ? (
                "Submit"
              ) : (
                <div className="flex items-center	justify-center pt-[6px]">
                  <Loading />
                </div>
              )
            }
            size="45px"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default HourlyRates;
