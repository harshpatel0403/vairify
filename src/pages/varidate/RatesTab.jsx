import react, { useState } from "react";
import Button from "../../components/Button";
import Selecter from "../../components/Selecter/Selecter";
import { useNavigate } from "react-router-dom";

const RatesTab = ({ availableHours, selectedHours }) => {
  const [currencySelcted, setCurrencySelcted] = useState("");
  const [currency, setCurrency] = useState(["EUR", "AUD", "ARS", "AFN"]);
  const navigate = useNavigate();
  const servicesOptions = [
    {
      id: 1,
      time: "1 hr",
      incall: "300",
      outcall: "350",
      currency: ["EUR"],
    },
    {
      id: 2,
      time: "1 hr",
      incall: "300",
      outcall: "350",
      currency: ["EUR"],
    },
    {
      id: 3,
      time: "1 hr",
      incall: "300",
      outcall: "350",
      currency: ["EUR"],
    },
    {
      id: 4,
      time: "1 hr",
      incall: "300",
      outcall: "350",
      currency: ["EUR"],
    },
    {
      id: 5,
      time: "1 hr",
      incall: "300",
      outcall: "350",
      currency: ["EUR"],
    },
    {
      id: 6,
      time: "1 hr",
      incall: "300",
      outcall: "350",
      currency: ["EUR"],
    },
    {
      id: 7,
      time: "1 hr",
      incall: "300",
      outcall: "350",
      currency: ["EUR"],
    },
    {
      id: 8,
      time: "1 hr",
      incall: "300",
      outcall: "350",
      currency: ["EUR"],
    },
    {
      id: 9,
      time: "1 hr",
      incall: "300",
      outcall: "350",
      currency: ["EUR"],
    },
    {
      id: 10,
      time: "1 hr",
      incall: "300",
      outcall: "350",
      currency: ["EUR"],
    },
  ];
  return (
    <div>
      <div className="grid items-center grid-cols-4 py-4">
        <span className="font-bold text-[#0247FF]">Time</span>
        <span className="font-bold text-[#0247FF]">Incall</span>
        <span className="font-bold text-[#0247FF]">Outcall</span>
        <span className="font-bold text-[#0247FF]">Currency</span>
        {/* <div>
                    <Selecter
                        options={currency}
                        value={currencySelcted}
                        onChange={(e) => setCurrencySelcted(e.target.value)}
                        className="text-[8px] text-right font-bold text-[#026EFF] txt-custom-color-4 shadow-none focus-visible:border-0 focus-visible:border-white px-1"
                        textSize="font-bold text-[#0247FF] 8px"
                        textColor="#0247FF"
                    />
                </div> */}
      </div>

      {availableHours.map((item) => (
        <div
          key={item._id}
          className="grid items-center grid-cols-4 m-4 my-8 mx-2"
        >
          <div className="flex flex-row p-1 w-full min-w-[105px] max-w-[130px] mx-auto rounded-full  items-center bg-gradient-to-b from-[#02227E] to-[#0247FF]">
            <div
              className={`bg-[${
                selectedHours?._id === item?._id ? "#08FA5A" : "#fff"
              }] md:h-[30px] md:w-[30px] h-[20px] w-[20px] min-w-[20px] rounded-full`}
            />
            <span className="px-1 font-bold text-white whitespace-nowrap">
              {item.value}
            </span>
          </div>
          <span className="px-2 font-bold text-black">{item.incall}</span>
          <span className="px-2 font-bold text-black">{item.outcall}</span>
          <span className="px-2 font-bold text-[#02227E]">
            {item?.currency}
          </span>
        </div>
      ))}
      {/* <div className="flex items-center justify-center mx-4 mt-2 mb-3">
                <Button
                    className={
                        "flex items-center mt-4 py-2 w-[50%] my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[23.4px] rounded-xl shadow-[0px_9px_20px_rgba(0,0,0,0.5)]"
                    }
                    text={"Review"}
                    size="40px"
                    onClick={() => navigate('/varidate/appointment-review')}
                />
            </div> */}
    </div>
  );
};
export default RatesTab;
