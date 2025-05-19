import React, { useEffect, useState } from "react";
import InputText from "../../../components/InputText";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Selecter from "../../../components/Selecter/Selecter";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleGetServices,
  HandleSelectServices,
  HandleServices,
} from "../../../redux/action/Services";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
import Button from "../../../components/Button";
import { FormControl, MenuItem, Select } from "@mui/material";
import SelectBox from "../../../components/SelectBox";
import PageTitle from "../../../components/PageTitle";

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
          dispatch(HandleGetServices(UserDetails?._id, UserDetails?.user_type));
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
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px] md:hidden block">
        <PageTitle title={'Hourly Rates'} />
      </div>
      <div className="flex flex-col justify-center items-center  mx-auto ">
        
        <div className="flex justify-center items-center relative w-full md:my-[48px] my-[24px]">
        <div className="text-center  sm:text-[28px] text-2xl text-white font-semibold md:block hidden">Hourly Rates</div>
          <div className="absolute right-0 md:top-[-5px] top-[-24px]">
            {/* <FormControl className='bg-[#040c50] text-white rounded-[30px]' sx={{ minWidth: 160 }}>
              <Select
                value={currency}
                onChange={(e) => changeCurrency(e)}
                // displayEmpty
                // inputProps={{ 'aria-label': 'Without label' }}
                sx={{ '& .MuiSelect-select': { color: currency ? 'white' : '#aaa', border: '1px solid rgba(255, 255, 255, 0.3)', backgroundColor: '#FFFFFF14', padding: '5px' } }}
              >
                <MenuItem value="" disabled selected>
                   Currency
                </MenuItem>
                {currencyOptions?.map((item) => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <SelectBox
              options={currencyOptions}
              value={currency}
              onChange={(e) => changeCurrency(e)}
              className1="text-[14px] font-normal border border-[#919EAB33] w-[100%] rounded-[8px]"
              size={"h-[42px]"}
              textAlign={"text-left"}
              rounded={"rounded-2xl"}
              fontWeight={"font-bold"}
              textColor={"text-white"}
              textSize={"text-[14px]"}
            />
          </div>
        </div>

        <div className="sm:w-full w-[calc(100vw-32px)] mx-auto overflow-auto scrollbar-hidden">
          <div className=" sm:w-full font-[500] text-[18px] mt-[5%] mx-auto w-fit">
            <div className="flex flex-row text-white items-center mt-4 text-[14px] font-[500]">
              <div className="w-[100px] flex justify-start items-center">Time</div>
              <div className="flex-1 px-5">Incall</div>
              <div className="flex-1 px-2">Outcall</div>
              <div className="w-[100px] flex justify-center items-center">Currency</div>
            </div>

            <div className="flex flex-col gap-4 mt-4 text-white text-[13px] font-[400]">
              {hourlyData?.length > 0 &&
                hourlyData.map((hour, index) => (
                  <div
                    key={index}
                    className="w-full flex flex-row items-center service-item-row"
                  >
                    <div className="w-[100px] flex justify-start items-center">
                      <span>{hourss[hour.time]}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <InputText
                        value={hour?.incall}
                        placeholder="Enter amount"
                        className="w-full text-[12px] border border-[#919EAB33] rounded-[10px] py-2 px-2 min-w-[100px]"
                        onChange={(e) => handleChange(index, "incall", e.target.value)}
                      />
                    </div>

                    <div className="flex-1 px-2 min-w-0">
                      <InputText
                        value={hour?.outcall}
                        placeholder="Enter amount"
                        className="w-full text-[12px] border border-[#919EAB33] rounded-[10px] py-2 px-2 min-w-[100px]"
                        onChange={(e) => handleChange(index, "outcall", e.target.value)}
                      />
                    </div>

                    <div className="w-[100px] flex justify-center items-center">
                      <span className="text-[14px]">{currency}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>


        {errors?.message && (
          <label className="text-red-500 text-lg pt-5 flex items-baseline ">
            {errors.message}
          </label>
        )}
        <div className="flex justify-center w-full max-w-[500px] mx-auto pb-20 mt-[24px]">
          <Button
            text={
              !isLoading ? (
                "Submit"
              ) : (
                <div className="flex items-center	justify-center">
                  <Loading />
                </div>
              )
            }
            disabled={isLoading}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default HourlyRates;
