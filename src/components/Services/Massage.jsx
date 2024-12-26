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
      setSelectedTraditional([...selectedTraditional, {name: massage, type: "Massage"}]);
      dispatch(HandleSelectServices([...service, {name: massage, type: "Massage"}]));
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
    <div className="pb-8">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        <div className="w-full mx-auto flex items-center justify-center mt-2">
          <span className="font-extrabold text-[24px] text-[#02227E]">
            Traditional Massage
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {traditionalMassage.map((item) => (
            <div
              key={item}
              className={`bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[20px] flex flex-row items-center justify-center px-6 pl-8 py-2 h-[38px] relative`}
              onClick={() => handleTraditionalToggle(item)}
            >
              <div className="flex items-center justify-center absolute left-1">
                <button
                  className={`w-[20px] h-[20px] rounded-[100%] border-2 border-[#0CA36C] ${selectedTraditional?.find(obj => (obj?.name === item))
                    ? "bg-[#08FA5A]"
                    : "bg-[#D9D9D9]"
                    }`}
                ></button>
              </div>
              <div className="flex items-center justify-center w-[100px] leading-4">
                <span className="font-bold text-[14px] text-white">{item}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full mx-auto flex items-center justify-center mt-2">
          <span className="font-extrabold text-[24px] text-[#02227E]">
            Sensual Massage
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {sensualMassage.map((items) => (
            <div
              key={items}
              className={`bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[20px] flex flex-row items-center justify-center px-6 pl-8 py-2 h-[38px] relative`}
              onClick={() => handleSensualToggle(items)}
            >
              <div className="flex items-center justify-center absolute left-1">
                <button
                  className={`w-[20px] h-[20px] rounded-[100%] border-2 border-[#0CA36C] ${selectedSensual?.find(item => (item?.name === items))
                    ? "bg-[#08FA5A]"
                    : "bg-[#D9D9D9]"
                    }`}
                ></button>
              </div>
              <div className="flex items-center justify-center w-[100px] leading-4">
                <span className="font-bold text-[14px] text-white">
                  {items}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full mx-auto flex items-center justify-center mt-2">
          <span className="font-extrabold text-[24px] text-[#02227E]">
            Release
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {release.map((data) => (
            <div
              key={data}
              className={`bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[20px] flex flex-row items-center justify-center px-6 pl-8 py-2 h-[38px] relative`}
              onClick={() => handleReleaseToggle(data)}
            >
              <div className="flex items-center justify-center absolute left-1">
                <button
                  className={`w-[20px] h-[20px] rounded-[100%] border-2 border-[#0CA36C] ${selectedRelease?.find(item => (item?.name === data))
                    ? "bg-[#08FA5A]"
                    : "bg-[#D9D9D9]"
                    }`}
                ></button>
              </div>
              <div className="flex items-center justify-center w-[100px] leading-4">
                <span className="font-bold text-[14px] text-white">{data}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
