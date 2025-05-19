import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Massage from "../../../components/Services/Massage";
import ExoticDance from "../../../components/Services/ExoticDance";
import SensualServices from "../../../components/Services/SensualServices";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleGetServices,
  HandleSelectServices,
} from "../../../redux/action/Services";

export default function Escort() {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const service = useSelector((state) => state?.Services?.selectServices);
  const savedServices = useSelector((state) => state?.Services?.getservices);
  const updatedServices = useSelector(
    (state) => state?.Services?.services?.updatedServices
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [escort, setEscort] = useState(false);
  const [massage, setMassage] = useState(false);
  const [exotic, setExotic] = useState(false);
  const [sensual, setSensual] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Function to handle the toggle for all states
  const handleToggle = (selectedState) => {
    // setEscort(false);
    setMassage(false);
    setExotic(false);
    // setSensual(false);
    selectedState(true);
  };

  const HandleOnClick = () => {
    const selectedServices = [];

    if (escort || sensual) {
      selectedServices.push("Escort");
    }
    if (massage) {
      selectedServices.push("Massage");
    }
    if (exotic) {
      selectedServices.push("Exotic Dance");
    }
    navigate("/service/extras", {
      state: { service, selectedServices },
    });
  };

  useEffect(() => {
    dispatch(HandleGetServices(UserDetails?._id, UserDetails?.user_type));
    if (!updatedServices && savedServices && savedServices?.length > 0) {
      const { serviceType, services } = savedServices[0];
      if (serviceType?.includes("Escort")) {
        setEscort(true);
        setSensual(true);
      }
      if (serviceType?.includes("Massage")) {
        setMassage(true);
      }
      if (serviceType?.includes("Exotic Dance")) {
        setExotic(true);
      }
      dispatch(
        HandleSelectServices(
          services?.map((item) => ({
            name: item.servicesName,
            type: item.type,
          }))
        )
      );
    } else if (updatedServices?.serviceType) {
      const { serviceType, services } = updatedServices;
      if (serviceType.includes("Escort")) {
        setEscort(true);
        setSensual(true);
      }
      if (serviceType.includes("Massage")) {
        setMassage(true);
      }
      if (serviceType.includes("Exotic Dance")) {
        setExotic(true);
      }
      dispatch(
        HandleSelectServices(
          services.map((item) => ({ name: item.servicesName, type: item.type }))
        )
      );
    }
  }, []);

  useEffect(() => {
    if (!updatedServices && savedServices && savedServices?.length > 0) {
      const { serviceType, services } = savedServices[0];
      if (serviceType?.includes("Escort")) {
        setEscort(true);
        setSensual(true);
      }
      if (serviceType?.includes("Massage")) {
        setMassage(true);
      }
      if (serviceType?.includes("Exotic Dance")) {
        setExotic(true);
      }
      dispatch(
        HandleSelectServices(
          services?.map((item) => ({
            name: item.servicesName,
            type: item.type,
          }))
        )
      );
    }
  }, [savedServices]);

  const handleServiceType = (type, state) => {
    if (type == "Escort") {
      setEscort(state);
      setSensual(state);
      state == false &&
        dispatch(
          HandleSelectServices(service.filter((item) => item.type != "Escort"))
        );
    }
    if (type == "Massage") {
      setMassage(state);
      state == false &&
        dispatch(
          HandleSelectServices(service.filter((item) => item.type != "Massage"))
        );
    }
    if (type == "Exotic Dancer") {
      setExotic(state);
      state == false &&
        dispatch(
          HandleSelectServices(
            service.filter((item) => item.type != "Exotic Dance")
          )
        );
    }
  };

  const tabs = [
    { label: "Escort, Sensual Services", component: <SensualServices /> },
    { label: "Massage", component: <Massage /> },
    { label: "Exotic Dancer", component: <ExoticDance /> },
  ];

  return (
    <div>
      <div className="container">
        <div className="flex gap-[16px] w-full overflow-x-auto scrollbar-hidden">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`py-[6px] px-[12px] text-white rounded-[8px] text-sm font-bold transition-all duration-300 whitespace-nowrap  ${activeTab === index
                ? "bg-[#FFFFFF29]"
                : ""
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="w-full pb-[48px] mt-[24px]">
          {tabs[activeTab].component}

          <div className="flex items-center justify-center max-w-[500px] mx-auto my-[48px]">
            <Button
              text={"Save"}
              onClick={HandleOnClick}
              disabled={service?.length <= 0}
            />
          </div>
        </div>
      </div>

      {/* <div className="flex w-full inline-table max-w-[400px] flex-col items-center justify-between">
        <div className="px-5 w-full mx-auto text-center">
          <div
            className="border-2 border-[#CCCCCC] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-2xl flex flex-row items-center justify-start px-6 pl-16 py-2 h-[60px] relative mt-5"
            onClick={() => handleServiceType("Escort", !escort)}
          >
            <div className="flex items-center justify-center absolute left-3">
              <button
                className={`w-[31px] h-[31px] rounded-[100%] border-2 border-[#0CA36C] ${escort ? "bg-[#08FA5A]" : "bg-[#D9D9D9]"
                  }`}
              ></button>
            </div>
            <div className="flex items-center w-[100px] leading-4 w-full">
              <span className="font-bold text-[26px] text-white">Escort</span>
            </div>
          </div>

          <div
            className="border-2 border-[#CCCCCC] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-2xl flex flex-row items-center justify-start px-6 pl-16 py-2 h-[60px] relative mt-5"
            onClick={() => handleServiceType("Massage", !massage)}
          >
            <div className="flex items-center justify-center absolute left-3">
              <button
                className={`w-[31px] h-[31px] rounded-[100%] border-2 border-[#0CA36C] ${massage ? "bg-[#08FA5A]" : "bg-[#D9D9D9]"
                  }`}
              ></button>
            </div>
            <div className="flex items-center w-[100px] leading-4 w-full">
              <span className="font-bold text-[26px] text-white">Massage</span>
            </div>
          </div>
          {massage && <Massage />}
          <div
            className="border-2 border-[#CCCCCC] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-2xl flex flex-row items-center justify-start px-6 pl-16 py-2 h-[60px] relative mt-5"
            onClick={() => handleServiceType("Exotic Dancer", !exotic)}
          >
            <div className="flex items-center justify-center absolute left-3">
              <button
                className={`w-[31px] h-[31px] rounded-[100%] border-2 border-[#0CA36C] ${exotic ? "bg-[#08FA5A]" : "bg-[#D9D9D9]"
                  }`}
              ></button>
            </div>
            <div className="flex items-center w-[100px] leading-4 w-full">
              <span className="font-bold text-[26px] text-white">
                Exotic Dancer
              </span>
            </div>
          </div>
          {exotic && <ExoticDance />}

          <div
            className="border-2 border-[#CCCCCC] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-2xl flex flex-row items-center justify-start px-6 pl-16 py-2 h-[60px] relative mt-5"
            onClick={() => handleServiceType("Escort", !sensual)}
          >
            <div className="flex items-center justify-center absolute left-3">
              <button
                className={`w-[31px] h-[31px] rounded-[100%] border-2 border-[#0CA36C] ${sensual ? "bg-[#08FA5A]" : "bg-[#D9D9D9]"
                  }`}
              ></button>
            </div>
            <div className="flex items-center w-[100px] leading-4  w-full">
              <span className="font-bold text-[26px] text-white">
                Sensual Services
              </span>
            </div>
          </div>
        </div>
        {sensual && <SensualServices />}
        
      </div> */}

    </div>
  );
}
