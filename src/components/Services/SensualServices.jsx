import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleSelectServices } from "../../redux/action/Services";

export default function SensualServices() {
  const dispatch = useDispatch();
  const service = useSelector((state) => state?.Services?.selectServices);
  const [selectedTypeOfEvent, setSelectedTypeOfEvent] = useState(service);

  const typeOfEvent = [
    "Girlfriend Experience",
    "Porn Star Experience",
    "French kissing",
    "Cunnilingus",
    "BBBJ",
    "CBJ",
    "Deepthroat",
    "Cum in mouth",
    "Msog",
    "Swallowing",
    "Prostate play",
    "Anal",
    "Rimming",
    "Fingering",
    "4 handed",
    "Pegging",
    "Kamasutra",
    "Erotic massage",
    "Duo with girl",
    "Couples",
    "Group sex",
    "With 2 men",
    "Hand Job",
    "Foot Job",
    "Bdsm",
    "Foot fetish",
    "Submissive",
    "Femdom",
    "Dirty talk",
    "Masturbation",
    "69 position",
    "Cum in face",
    "Casual photos",
    "Cum on body",
    "Golden shower",
    "Video with sex",
    "Virtual Sessions",
    "Only Fans",
  ];

  //   useEffect(() => {
  //     // setSelectedValue((previousValue) => ({
  //     //   ...previousValue,
  //     //   SensualServices: selectedTypeOfEvent,
  //     // }));
  //     setSelectedValue(selectedTypeOfEvent);
  //   }, [selectedTypeOfEvent]);

  const handleTraditionalToggle = (massage) => {
    if (selectedTypeOfEvent?.find(item => (item?.name === massage))) {
      setSelectedTypeOfEvent(
        selectedTypeOfEvent.filter((item) => item?.name !== massage)
      );
      dispatch(
        HandleSelectServices(service.filter((item) => item?.name !== massage))
      );
    } else {
      setSelectedTypeOfEvent([...selectedTypeOfEvent, { name: massage, type: "Escort" }]);
      dispatch(HandleSelectServices([...service, { name: massage, type: "Escort" }]));
    }
  };

  return (
    <div className="">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        {
          //     <div className="w-full mx-auto flex items-center justify-center mt-2">
          //   <span className="font-extrabold text-[24px] text-[#02227E]">
          //     Type of Event
          //   </span>
          // </div>
        }
        <div className="grid grid-cols-2 sm:gap-[24px] gap-[16px] w-full">
          {typeOfEvent.map((item) => (
            <div
              key={item}
              className={`p-[12px] rounded-[8px] flex items-center justify-center  relative w-full cursor-pointer
                ${selectedTypeOfEvent?.find(obj => (obj?.name === item))
                  ? "sm:bg-[#405FC4] bg-[#2F3BA480]"
                  : "bg-[#FFFFFF14]"
                }
                `}
              onClick={() => handleTraditionalToggle(item)}
            >
              {/* <div className="flex items-center justify-center absolute left-1">
                <button
                  className={`w-[20px] h-[20px] rounded-[100%] border-2 border-[#0CA36C] ${selectedTypeOfEvent?.find(obj => (obj?.name === item))
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
      </div>
    </div>
  );
}
