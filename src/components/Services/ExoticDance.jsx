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
      setSelectedTypeOfEvent([...selectedTypeOfEvent, {name: massage, type: "Exotic Dance"}]);
      dispatch(HandleSelectServices([...service, {name: massage, type: "Exotic Dance"}]));
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
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        <div className="w-full mx-auto flex items-center justify-center mt-2">
          <span className="font-extrabold text-[24px] text-[#02227E]">
            Type of Event
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {typeOfEvent.map((item) => (
            <div
              key={item}
              className={`bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[20px] flex flex-row items-center justify-center px-6 pl-8 py-2 h-[38px] relative`}
              onClick={() => handleTraditionalToggle(item)}
            >
              <div className="flex items-center justify-center absolute left-1">
                <button
                  className={`w-[20px] h-[20px] rounded-[100%] border-2 border-[#0CA36C] ${
                    selectedTypeOfEvent?.find(obj => (obj?.name === item))
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
      </div>
    </div>
  );
}
