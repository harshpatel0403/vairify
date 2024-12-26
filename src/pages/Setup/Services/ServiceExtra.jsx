import React, { useEffect, useState } from "react";
import InputText from "../../../components/InputText";
import SelectBox from "../../../components/SelectBox";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import Selecter from "../../../components/Selecter/Selecter";
import { useSelector } from "react-redux";

export default function ServiceExtra() {
  const { state: Service } = useLocation();
  const [errors, setErrors] = useState({});
  const savedServices = useSelector((state) => state?.Services?.getservices);
  const updatedServices = useSelector(
    (state) => state?.Services?.services?.updatedServices
  );


  const existingServices = savedServices[0] || {}; 

   const amountArray = updatedServices
    ? (updatedServices?.services?.map((service) => service?.amount) || [])
    : (existingServices?.services?.map((service) => service?.amount) || []);
  const currencyArray = updatedServices
    ? (updatedServices?.services?.map((service) => service?.currency) || [])
    : existingServices?.services?.map((service) => service?.currency) || [];
  const serviceArray = updatedServices
    ? (updatedServices?.services?.map((service) => service?.service) || [])
    : existingServices?.services?.map((service) => service?.service) || [];

  const rowsData = [];
  for (let i = 0; i < Service?.service?.length; i++) {
    rowsData.push({
      servicesName: Service?.service[i]?.name,
      options: ["Included", "Extra"],
      service: serviceArray[i] !== undefined ? serviceArray[i] : "Included",
      currency: currencyArray[i] !== undefined ? currencyArray[i] : "USD",
      amount: amountArray[i] !== undefined ? amountArray[i] : "",
      type: Service?.service[i]?.type,
    });
  }
  const [currency, setCurrency] = useState("USD");
  const [rows, setRows] = useState(rowsData);

  const currencyOptions = ["Currency", "USD", "EUR", "INR", "FDP"];
  const [step, setStep] = useState("first");

  useEffect(() => {
    const updatedRows = rows.map((row) => ({ ...row, currency }));
    setRows(updatedRows);
  }, [currency]);

  const handleService = (type) => {
    setStep(type);
  };

  const changeCurrency = (e) => {
    setCurrency(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = () => {
    // Check for errors
    const newErrors = {};
    rows.forEach((item, i) => {
      if (item.service === "Extra" && !item.amount) {
        newErrors[i] = true;
      }
    });
    setErrors(newErrors);

    // If there are no errors, proceed to the next page
    if (Object.keys(newErrors).length === 0) {
      navigate("/hourly-rates", {
        state: { rows, Service },
      });
    }
  };

  return (
    <div className="main-container p-0">
      <div className="flex flex-col justify-center items-center pt-custom-24 mx-auto">
        <div className="text-custom-13 text-[#02227E]">
          <span>Service/Extra’s</span>
        </div>
        <div className="w-full px-2 overflow-x-auto">
          <div className="w-full flex flex-row justify-between items-center mt-4">
            <div className="w-[100px] flex flex-col justify-center items-left">
              <span className="text-[14px] font-bold text-[#026EFF]">
                Service
              </span>
            </div>
            <div className="w-[160px] flex flex-col justify-center items-left">
              <span className="text-[14px] font-bold text-[#026EFF]">
                Included
              </span>
            </div>
            <div className="w-[100px] flex flex-col justify-center items-left">
              <span className="text-[14px] font-bold text-[#026EFF]">
                Extra
              </span>
            </div>
            <div className="w-[80px] flex flex-col justify-left items-left currency-part">
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
            {rows?.map((item, i) => {
              console.log("Checkig itemsss", item);
              return (
                <div className="w-full flex flex-row justify-between items-center mt-5 gap-[5px]">
                  <div className="w-[210px] flex flex-col justify-center items-center">
                    <span className="text-[14px] font-medium text-center">
                      {item?.servicesName}
                    </span>
                  </div>
                  <div className="w-[160px] flex flex-col justify-center items-center input-select-box">
                    <SelectBox
                      options={item?.options}
                      className="font-bold h-[33px] w-5/6"
                      borderNone={true}
                      value={item?.service}
                      textSize={"text-[14px]"}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[i].service = e.target.value;
                        setRows(updatedRows);
                      }}
                    />
                  </div>
                  <div className="w-[100px] flex flex-col justify-center items-center">
                    <InputText
                      value={item?.amount}
                      className="w-full text-[12px] font-bold"
                      size="35px"
                      disabled={item?.service === "Included"}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[i].amount = e.target.value;
                        setRows(updatedRows);
                      }}
                      border={errors[i] && `#ef4444`}
                    />
                  </div>
                  <div className="w-[80px] flex flex-col justify-center items-center">
                    <span className="text-[12px] font-bold">{currency}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex w-full items-center justify-center w-full max-w-[420px] my-5">
          <Button
            className={
              "flex items-center w-[249px] py-2 my-2 w-fit max-w-[270px] justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] py-2 rounded-xl"
            }
            text={"Submit>>"}
            size="42px"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
