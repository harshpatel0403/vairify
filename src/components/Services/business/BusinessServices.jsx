import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Button";
import SelectBox from "../../SelectBox";
import InputText from "../../InputText";
import { useEffect } from "react";

export default function BusinessRateServices({ UserData, EditData }) {
  const currencyOptions = ["Currency", "USD", "EUR", "INR", "FDP"];
  const hoursOptions = ["1 Hour", "2 Hour", "3 Hour", "4 Hour", "5 Hour"];
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("Currency");
  const [serviceFields, setServiceFields] = useState([
    { hour: "1 Hour", rate: "" }, // Initial service field
  ]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleHoursChange = (e, index) => {
    const updatedFields = [...serviceFields];
    updatedFields[index].hour = e.target.value;
    setServiceFields(updatedFields);
  };

  const handleRateChange = (e, index) => {
    const updatedFields = [...serviceFields];
    updatedFields[index].rate = e.target.value;
    setServiceFields(updatedFields);
  };

  const handleAddServiceField = () => {
    setServiceFields([...serviceFields, { hour: "1 Hour", rate: "" }]);
  };

  const changeCurrency = (e) => {
    setCurrency(e.target.value);
  };

  const navigateToBusinessServices = () => {
    const body = {
      userId: UserData?._id,
      user_type: UserData?.user_type,
      title,
      description,
      businessHourlyRates: serviceFields,
      currency,
    };
    if (EditData) {
      body.EditData = EditData;
    }
    navigate("/business-hours", { state: body });
  };

  useEffect(() => {
    if (EditData) {
      setCurrency(EditData?.currency);
      setTitle(EditData?.title);
      setDescription(EditData?.description);
      setServiceFields(EditData?.businessHourlyRates);
    }
  }, [EditData]);
  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-7">
        <span className="font-extrabold text-[27px]">
          Business <br />
          Rate & Services
        </span>
      </div>
      <div className="w-full mx-auto flex flex-row justify-center items-center pt-2">
        <div className="w-[90px]">
          <Button
            text="View"
            size="30px"
            className="flex items-center justify-center font-bold text-[21.6px] text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl"
          />
        </div>
      </div>
      <div className="w-full mx-auto flex flex-row justify-between items-center">
        <div>
          <span className="font-extrabold text-[12.6px]">Set Currency</span>
        </div>
        <div className="w-[130px] flex flex-col justify-center items-center">
          <SelectBox
            options={currencyOptions}
            value={currency}
            onChange={(e) => changeCurrency(e)}
            borderNone
            shadowNone
            textColor="text-[#026EFF]"
            borderWidth="border-2"
            borderColor="border-white"
            size="40px"
            pr="pr-12"
          />
        </div>
      </div>
      <div className="w-full mx-auto flex flex-col justify-center items-center mt-5">
        <div className="w-full mx-auto flex flex-row justify-start items-center">
          <span className="font-extrabold text-[12.6px]">Title of service</span>
        </div>
        <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
          <InputText
            className={"rounded-none"}
            bgColor="white"
            border="#D9D9D9"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
      </div>
      <div className="w-full mx-auto flex flex-col justify-center items-center mt-5">
        <div className="w-full mx-auto flex flex-row justify-start items-center">
          <span className="font-extrabold text-[12.6px]">
            Description of service
          </span>
        </div>
        <textarea
          rows="3"
          className="block p-2.5 w-full text-[15px] text-gray-900 rounded-sm border-0 focus:ring-blue-500 dark:placeholder-gray-400  bg-[white] focus-visible:border-0 mt-2"
          placeholder=""
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></textarea>
      </div>
      <div>
        {serviceFields.map((field, index) => (
          <div
            key={index}
            className="w-full mx-auto flex flex-row justify-start items-center mt-9"
          >
            <div className="w-[120px] flex flex-col justify-center items-center mr-2">
              <SelectBox
                options={hoursOptions}
                value={field.hour}
                onChange={(e) => handleHoursChange(e, index)}
                borderWidth="border-2"
                borderColor="border-white"
                textSize="text-[12.6px]"
                fontWeight="font-bold"
              />
            </div>
            <div className="w-[120px] h-[40px] flex flex-col justify-center items-center mr-2">
              <InputText
                className={"border-2 text-[12.6px] font-bold"}
                value={field.rate}
                placeholder={"Rate"}
                onChange={(e) => handleRateChange(e, index)}
              />
            </div>
          </div>
        ))}
        <div className="w-[120px] flex flex-col justify-center items-center mt-3">
          <Button
            text="Add"
            onClick={handleAddServiceField}
            className="from-[#02227E] to-[#0247FF] bg-gradient-to-b text-white text-[14px] font-bold rounded-xl"
            size="40px"
          />
        </div>
      </div>
      <div className="w-full mx-auto flex justify-start items-center mt-7  flex-col grid grid-cols-3">
        {serviceFields?.map((item, index) => {
          return (
            <div key={index}>
              <span className="font-bold text-[9px] mr-2">
                Time {item?.hour}/Price {item?.rate}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full mx-auto flex flex-row justify-start items-center mt-9">
        <div className="w-[180px]">
          <Button
            text="Set Description of services >"
            className={
              "font-extrabold text-[12.6px] text-[#073FE1] bg-transparent shadow-none border-b-2 border-b-[#073FE1] rounded-none"
            }
            size="20px"
          />
        </div>
      </div>
      <div className="flex items-center justify-center px-5">
        <div className="flex items-center justify-center w-full max-w-[420px]">
          <Button
            className={
              "flex items-center w-[249px] mt-[20px] px-[40px] py-2 my-2 w-fit max-w-[270px] justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] rounded-xl"
            }
            text={"Finished"}
            size="42px"
            onClick={navigateToBusinessServices}
          />
        </div>
      </div>
    </div>
  );
}
