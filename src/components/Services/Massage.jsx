import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleSelectServices } from "../../redux/action/Services";

export default function Massage() {
  const dispatch = useDispatch();
  const service = useSelector((state) => state?.Services?.selectServices);
  console.log("🚀 ~ file: Massage.jsx:8 ~ Massage ~ service:", service)

  const [selectedTraditional, setSelectedTraditional] = useState(service);
  const [selectedSensual, setSelectedSensual] = useState(service);
  const [selectedRelease, setSelectedRelease] = useState(service);

  console.log("🚀 ~ file: Massage.jsx:11 ~ Massage ~ service:", service);

  //   useEffect(() => {
  //     const selectedOptions = [
  //       ...service,
  //       ...selectedTraditional,
  //       ...selectedSensual,
  //       ...selectedRelease,
  //     ];
  //     dispatch(HandleSelectServices(selectedOptions));
  //   }, [selectedTraditional, selectedSensual, selectedRelease]);

  const traditionalMassage = ["Deep Tissue", "Swedish", "Thai", "Shiatsu"];
  const sensualMassage = [
    "Body Rub",
    "Tantra",
    "Dark tantra",
    "Prostate",
    "Erotic",
    "Nuru",
    "Foam",
    "Esalen",
    "Lingam",
    "Yoni",
  ];
  const release = [
    "Therapeutic",
    "Hand job",
    "Full Service",
    "BBBJ",
    "Prostate",
    "CBJ",
    "Grinding",
    "Toys",
  ];

  const handleTraditionalToggle = (massage) => {
    if (selectedTraditional?.find(item => (item?.name === massage))) {
      setSelectedTraditional(
        selectedTraditional.filter((item) => item?.name !== massage)
      );
      dispatch(
        HandleSelectServices(service.filter((item) => item?.name !== massage))
      );
    } else {
      setSelectedTraditional([...selectedTraditional, { name: massage, type: "Massage" }]);
      dispatch(HandleSelectServices([...service, { name: massage, type: "Massage" }]));
    }
  };

  const handleSensualToggle = (massage) => {
    if (selectedSensual?.find(item => (item?.name === massage))) {
      setSelectedSensual(selectedSensual.filter((item) => item?.name !== massage));
      dispatch(
        HandleSelectServices(service.filter((item) => item?.name !== massage))
      );
    } else {
      setSelectedSensual([...selectedSensual, { name: massage, type: "Massage" }]);
      dispatch(HandleSelectServices([...service, { name: massage, type: "Massage" }]));
    }
  };

  const handleReleaseToggle = (massage) => {
    if (selectedRelease?.find(item => (item?.name === massage))) {
      setSelectedRelease(selectedRelease.filter((item) => item?.name !== massage));
      dispatch(
        HandleSelectServices(service.filter((item) => item?.name !== massage))
      );
    } else {
      setSelectedRelease([...selectedRelease, { name: massage, type: "Massage" }]);
      dispatch(HandleSelectServices([...service, { name: massage, type: "Massage" }]));
    }
  };

  return (
    <div className="w-full">
      <div className="w-full mx-auto flex flex-col justify-center items-center ">
        <div className="pb-[24px] text-lg text-white font-medium">
          Traditional Massage
        </div>
        <div className="grid grid-cols-2 sm:gap-[24px] gap-[16px] w-full">
          {traditionalMassage.map((item) => (
            <div
              key={item}
              className={`p-[12px] rounded-[8px] flex items-center justify-center  relative w-full cursor-pointer
                ${selectedTraditional?.find(obj => (obj?.name === item))
                  ? "sm:bg-[#405FC4] bg-[#2F3BA480]"
                  : "bg-[#FFFFFF14]"
                }`}
              onClick={() => handleTraditionalToggle(item)}
            >
              {/* <div className="flex items-center justify-center absolute left-1">
                <button
                  className={`w-[20px] h-[20px] rounded-[100%] border-2 border-[#0CA36C] ${selectedTraditional?.find(obj => (obj?.name === item))
                    ? "bg-[#08FA5A]"
                    : "bg-[#D9D9D9]"
                    }`}
                ></button>
              </div> */}
              <div className="text-xs font-bold text-center text-white">
                {item}
              </div>
            </div>
          ))}
        </div>
        <div className="py-[24px] text-lg text-white font-medium">
          Sensual Massage
        </div>
        <div className="grid grid-cols-2 sm:gap-[24px] gap-[16px] w-full">
          {sensualMassage.map((items) => (
            <div
              key={items}
              className={`p-[12px] rounded-[8px] flex items-center justify-center  relative w-full cursor-pointer
                ${selectedSensual?.find(item => (item?.name === items))
                  ? "sm:bg-[#405FC4] bg-[#2F3BA480]"
                  : "bg-[#FFFFFF14]"
                }`}
              onClick={() => handleSensualToggle(items)}
            >
              {/* <div className="flex items-center justify-center absolute left-1">
                <button
                  className={`w-[20px] h-[20px] rounded-[100%] border-2 border-[#0CA36C] ${selectedSensual?.find(item => (item?.name === items))
                    ? "bg-[#08FA5A]"
                    : "bg-[#D9D9D9]"
                    }`}
                ></button>
              </div> */}
              <div className="text-xs font-bold text-center text-white">
                  {items}
              </div>
            </div>
          ))}
        </div>
        <div className="py-[24px] text-lg text-white font-medium">
          Release
        </div>
        <div className="grid grid-cols-2 sm:gap-[24px] gap-[16px] w-full">
          {release.map((data) => (
            <div
              key={data}
              className={`p-[12px] rounded-[8px] flex items-center justify-center  relative w-full cursor-pointer
                ${selectedRelease?.find(item => (item?.name === data))
                  ? "sm:bg-[#405FC4] bg-[#2F3BA480]"
                  : "bg-[#FFFFFF14]"
                }`}
              onClick={() => handleReleaseToggle(data)}
            >
              {/* <div className="flex items-center justify-center absolute left-1">
                <button
                  className={`w-[20px] h-[20px] rounded-[100%] border-2 border-[#0CA36C] ${selectedRelease?.find(item => (item?.name === data))
                    ? "bg-[#08FA5A]"
                    : "bg-[#D9D9D9]"
                    }`}
                ></button>
              </div> */}
              <div className="text-xs font-bold text-center text-white">
                {data}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
