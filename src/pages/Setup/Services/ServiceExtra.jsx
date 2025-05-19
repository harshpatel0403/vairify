import React, { useEffect, useState } from "react";
import InputText from "../../../components/InputText";
import SelectBox from "../../../components/SelectBox";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import Selecter from "../../../components/Selecter/Selecter";
import { useSelector } from "react-redux";
import PageTitle from "../../../components/PageTitle";

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

  const currencyOptions = ["INR Currency", "USD", "EUR", "INR", "FDP"];
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
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Service/Extra’s"} />
      </div>
      <div className="relative">
        <div className="">
          <div className="grid grid-cols-12 sm:gap-[24px] gap-[16px]">
            <div className=" sm:col-span-4 col-span-3">
              <span className="text-white items-center mt-4 text-[14px] font-[500]">
                Service
              </span>
            </div>
            <div className="sm:col-span-4 col-span-5">
              <span className="text-white items-center mt-5 text-[14px] font-[500]">
                Included/Extra
              </span>
            </div>
            <div className="col-span-4">
              <span className="text-white items-center mt-4 text-[14px] font-[500]">
                Amount
              </span>
            </div>
          </div>
          <div className="absolute right-0 md:top-[-5px] top-[50px]">
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



          <div className="sm:w-full w-[calc(100vw-32px)] mx-auto overflow-auto scrollbar-hidden">
            {rows?.map((item, i) => {
              console.log("Checkig itemsss", item);
              return (
                <div className="w-full grid grid-cols-12 mt-5 sm:gap-[24px] gap-[16px]">
                  <div className="sm:col-span-4 col-span-3">
                    <span className="text-[14px] font-normal text-white">
                      {item?.servicesName}
                    </span>
                  </div>
                  <div className="w-full flex flex-col justify-center items-center input-select-box sm:col-span-4 col-span-5">
                    <SelectBox
                      options={item?.options}
                      className1="text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"
                      value={item?.service}
                      size={"h-[49px]"}
                      textAlign={"text-left"}
                      fontWeight={"font-bold"}
                      textColor={"text-[#ffffff]"}
                      textSize={"text-[14px]"}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[i].service = e.target.value;
                        setRows(updatedRows);
                      }}
                    />
                  </div>
                  <div className="w-full flex justify-center items-center gap-2 col-span-4">
                    <InputText
                      value={item?.amount}
                      className="w-full text-[12px] border text-white border-[#919EAB33] rounded-[10px] py-2 px-2"
                      disabled={item?.service === "Included"}
                      placeholder="Enter amount"
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[i].amount = e.target.value;
                        setRows(updatedRows);
                      }}
                      border={errors[i] && `#ef4444`}
                    />
                    <div className="w-[80px] flex flex-col justify-center items-center">
                      <span className="text-[14px] font-medium text-white">{currency}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center w-full max-w-[500px] mx-auto sm:my-[48px] my-[24px]">
          <Button
            text={"Submit"}
            size="42px"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
