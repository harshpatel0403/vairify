import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Button";
import SelectBox from "../../SelectBox";
import InputText from "../../InputText";
import { useEffect } from "react";
import PageTitle from "../../PageTitle";
import { toast } from "react-toastify";

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
    if (serviceFields[0].rate == "") {
      toast.error("Please add service rates");
      return;
    }
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
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title='Business Rate & Services' isSmall={true} />
      </div>
      {/* <div className="w-full mx-auto flex flex-row justify-center items-center pt-2">
        <div className="w-[90px]">
          <Button
            text="View"
            size="30px"
            className="flex items-center justify-center font-bold text-[21.6px] text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl"
          />
        </div>
      </div> */}
      <div className="w-full">
        <label className="text-xl text-white font-medium">Set Currency</label>
        <div className="w-full mt-[8px]">
          <SelectBox
            options={currencyOptions}
            value={currency}
            onChange={(e) => changeCurrency(e)}
            className1="text-[14px] font-normal border border-[#919EAB33] w-[100%] rounded-[8px]"
            size={"h-[47px]"}
            textAlign={"text-left"}
            rounded={"rounded-2xl"}
            fontWeight={"font-bold"}
            textColor={"!text-white"}
            textSize={"!text-[14px]"}
          />
        </div>
      </div>
      <div className="w-full mt-[24px]">
        <label className="text-xl text-white font-medium">Title of service</label>
        <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
          <InputText
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className={"text-[14px] font-normal border border-[#919EAB33] w-[100%] rounded-[8px]"}
            placeholder={'Services'}
          />
        </div>
      </div>
      <div className="w-full mt-[24px]">
        <label className="text-xl text-white font-medium">
          Description of service
        </label>
        <textarea
          rows="3"
          className={"text-[14px] font-normal border-[2px] border-[#919EAB33] w-[100%] rounded-[8px] bg-transparent p-[16px] text-white mt-[8px] !placeholder-white"}
          placeholder="Description of service..."
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></textarea>
      </div>
      <div>
        <div className="flex justify-between mt-[24px]">
          <label className="text-xl text-white font-medium">
            rates <span className="text-red-500">*</span>
          </label>
          <Button
            text="+ Add"
            onClick={handleAddServiceField}
            className="py-[4px] !w-fit px-4"
            size="36px"
          />
        </div>
        {serviceFields.map((field, index) => (
          <div
            key={index}
            className="w-full mx-auto flex flex-row justify-start items-center mt-[16px] gap-[16px]"
          >
            <div className="w-full">
              <SelectBox
                options={hoursOptions}
                value={field.hour}
                onChange={(e) => handleHoursChange(e, index)}
                className1="text-[14px] font-normal border border-[#919EAB33] w-[100%] rounded-[8px]"
                size={"h-[47px]"}
                textAlign={"text-left"}
                rounded={"rounded-2xl"}
                fontWeight={"font-bold"}
                textColor={"!text-white"}
                textSize={"!text-[14px]"}
              />
            </div>
            <div className="w-full">
              <InputText
                className={"text-[14px] font-normal border border-[#919EAB33] w-[100%] rounded-[8px]"}
                value={field.rate}
                placeholder={"Rate"}
                onChange={(e) => handleRateChange(e, index)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full bg-[#FFFFFF14] rounded-[16px] p-[16px] mt-[24px] flex flex-col gap-[10px]">
        {serviceFields?.map((item, index) => {
          return (
            <div key={index} className="flex justify-between items-center">
              <p className="text-white font-normal text-sm">
                {item?.hour}
              </p>
              <p className="text-white font-normal text-sm">
                {item?.rate}
              </p>
            </div>
          );
        })}
      </div>
      {/* <div className="w-full mx-auto flex flex-row justify-start items-center mt-9">
        <div className="w-[180px]">
          <Button
            text="Set Description of services >"
            className={
              "font-extrabold text-[12.6px] text-[#073FE1] bg-transparent shadow-none border-b-2 border-b-[#073FE1] rounded-none"
            }
            size="20px"
          />
        </div>
      </div> */}
      <div className="flex justify-center mt-[24px] mb-[48px]">
        <Button
          text={"Finished"}
          size="48px"
          onClick={navigateToBusinessServices}
          className={'max-w-[500px]'}
        />
      </div>
    </div>
  );
}
