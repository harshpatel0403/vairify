import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleSelectServices } from "../../redux/action/Services";

export default function ExoticDance() {
  const dispatch = useDispatch();
  const service = useSelector((state) => state?.Services?.selectServices);
  const [selectedTypeOfEvent, setSelectedTypeOfEvent] = useState(service);

  const typeOfEvent = [
    "Bachelor Party",
    "Bachelorette Party",
    "Bottle Services",
    "Police Strippers",
    "Sexy Bartender",
    "Erotic Golf Caddies",
    "Pool Party",
    "Football Parties",
    "Boat Party",
    "Sexy Pizza Delivery",
    "Lap Dance",
    "Extreme Lapdance",
  ];

  const handleTraditionalToggle = (massage) => {
    if (selectedTypeOfEvent?.find(item => (item?.name === massage))) {
      setSelectedTypeOfEvent(
        selectedTypeOfEvent.filter((item) => item?.name !== massage)
      );
      dispatch(
        HandleSelectServices(service.filter((item) => item?.name !== massage))
      );
    } else {
      setSelectedTypeOfEvent([...selectedTypeOfEvent, { name: massage, type: "Exotic Dance" }]);
      dispatch(HandleSelectServices([...service, { name: massage, type: "Exotic Dance" }]));
    }
  };
  //   useEffect(() => {
  //     // setSelectedValue((previousValue) => ({
  //     //   ...previousValue,
  //     //   ExoticDance: selectedTypeOfEvent,
  //     // }));
  //     setSelectedValue(selectedTypeOfEvent)
  //   }, [selectedTypeOfEvent]);

  return (
    <div className="">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="pb-[24px] text-lg text-white font-medium">
          Type of Event
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-[24px] gap-[16px] w-full">
          {typeOfEvent.map((item) => (
            <div
              key={item}
              className={`p-[12px] rounded-[8px] flex items-center justify-center  relative w-full cursor-pointer
                ${selectedTypeOfEvent?.find(obj => (obj?.name === item))
                  ? "sm:bg-[#405FC4] bg-[#2F3BA480]"
                  : "bg-[#FFFFFF14]"
                }`}
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
