import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarBorder } from "@fortawesome/free-regular-svg-icons";

export default function SugarAnalysis() {
  const [Puncutalityrating, setPuncutalityRating] = useState(0);
  const [Atmosphererating, setAtmosphereRating] = useState(0);
  const [Attituderating, setAttitudeRating] = useState(0);
  const [Servicerating, setServiceRating] = useState(0);
  const [Communicationrating, setCommunicationRating] = useState(0);

  const PuncutalityhandleStarClick = (Puncutalityrating) => {
    setPuncutalityRating(Puncutalityrating);
  };
  const AtmospherehandleStarClick = (Atmosphererating) => {
    setAtmosphereRating(Atmosphererating);
  };
  const AttitudehandleStarClick = (Attituderating) => {
    setAttitudeRating(Attituderating);
  };
  const ServicehandleStarClick = (Servicerating) => {
    setServiceRating(Servicerating);
  };
  const CommunicationhandleStarClick = (Communicationrating) => {
    setCommunicationRating(Communicationrating);
  };
  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="w-full mx-auto flex flex-row justify-between items-start mt-2">
          <div className="flex flex-col items-center justify-center">
            <div>
              <span className="text-[18px] text-[#040C50] font-extrabold">
                VAI
                <span className="text-[18px] text-[#040C50] font-semibold">
                  RIFY ID
                </span>
              </span>
            </div>
            <div>
              <span className="text-[15px] text-[#040C50] font-bold">
                658H39
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "10px", bottom: "65px" }}
              className="absolute w-full h-full rounded-full"
            >
              <img src={"/images/EllipseSugar.png"} alt="Hot Rod" />
            </div>
            <div style={{ right: "0px", top: "25px" }} className="absolute">
              <img
                src={"/images/SugarIcon2.png"}
                alt="Hot Rod Icon Second"
                className="rounded-full"
              />
            </div>
          </div>
          <div>
            <div>
              <span className="text-[18px] text-[#040C50] font-bold">
              TruRevu
              </span>
            </div>
            <div className="flex flex-row justify-center items-center">
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <span className="text-[15px] text-[#040C50] font-bold">5.0</span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
          <span className="font-bold text-[24px]">Sugar</span>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center my-2">
          <div>
            <span className="text-[28px] text-[#040C50] font-bold">
            TruRevu
            </span>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row justify-between items-center mt-2">
          <div>
            <span className="font-bold text-[14.4px] text-[#0247FF]">
              Reviewer
            </span>
          </div>
          <div>
            <span className="font-bold text-[14.4px] text-[#0247FF]">
              Classification
            </span>
          </div>
          <div>
            <span className="font-extrabold text-[14.4px] text-[#0247FF] uppercase">
              VAI<span className="logoSetupweight">RIFY ID</span>
            </span>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row justify-between items-center mt-2 mb-1">
          <div>
            <span className="font-extrabold text-[18px] text-[#0247FF]">
              Hot Rod
            </span>
          </div>
          <div>
            <span className="font-extrabold text-[18px] text-[#0247FF]">
              Client
            </span>
          </div>
          <div>
            <span className="font-extrabold text-[18px] text-[#0247FF]">
              89U76J
            </span>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row justify-between items-center mt-7">
          <div>
            <span className="font-bold text-[14.4px]">Puncutality</span>
          </div>
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={index < Puncutalityrating ? faStar : faStarBorder}
                style={{
                  textShadow:
                    "-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000",
                }}
                color={index < Puncutalityrating ? "#E1AB3F" : "#444"}
                className={`text-[18px] margin-right-5 ${
                  index === 0 ? "border-red-500" : ""
                }`}
                onClick={() => PuncutalityhandleStarClick(index + 1)}
              />
            ))}
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row justify-between items-center mt-5">
          <div>
            <span className="font-bold text-[14.4px]">Incall Atmosphere</span>
          </div>
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={index < Atmosphererating ? faStar : faStarBorder}
                style={{
                  textShadow:
                    "-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000",
                }}
                color={index < Atmosphererating ? "#E1AB3F" : "#444"}
                className={`text-[18px] margin-right-5 ${
                  index === 0 ? "border-red-500" : ""
                }`}
                onClick={() => AtmospherehandleStarClick(index + 1)}
              />
            ))}
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row justify-between items-center mt-5">
          <div>
            <span className="font-bold text-[14.4px]">Attitude</span>
          </div>
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={index < Attituderating ? faStar : faStarBorder}
                style={{
                  textShadow:
                    "-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000",
                }}
                color={index < Attituderating ? "#E1AB3F" : "#444"}
                className={`text-[18px] margin-right-5 ${
                  index === 0 ? "border-red-500" : ""
                }`}
                onClick={() => AttitudehandleStarClick(index + 1)}
              />
            ))}
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row justify-between items-center mt-5">
          <div>
            <span className="font-bold text-[14.4px]">Service </span>
          </div>
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={index < Servicerating ? faStar : faStarBorder}
                style={{
                  textShadow:
                    "-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000",
                }}
                color={index < Servicerating ? "#E1AB3F" : "#444"}
                className={`text-[18px] margin-right-5 ${
                  index === 0 ? "border-red-500" : ""
                }`}
                onClick={() => ServicehandleStarClick(index + 1)}
              />
            ))}
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row justify-between items-center mt-5">
          <div>
            <span className="font-bold text-[14.4px]">Communication </span>
          </div>
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={index < Communicationrating ? faStar : faStarBorder}
                style={{
                  textShadow:
                    "-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000",
                }}
                color={index < Communicationrating ? "#E1AB3F" : "#444"}
                className={`text-[18px] margin-right-5 ${
                  index === 0 ? "border-red-500" : ""
                }`}
                onClick={() => CommunicationhandleStarClick(index + 1)}
              />
            ))}
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row justify-between items-center mt-5">
          <div className="text-left">
            <span className="font-bold text-[14.4px] text-left">
              Advertising Photos Match verified photos
            </span>
          </div>
          <div className="flex flex-row justify-center items-center">
            <div className="flex items-center mr-7">
              <input
                id="default-radio-1"
                type="radio"
                value=""
                name="default-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-radio-1"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Yes
              </label>
            </div>
            <div className="flex items-center">
              <input
                checked
                id="default-radio-2"
                type="radio"
                value=""
                name="default-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-radio-2"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                No
              </label>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row justify-between items-center mt-5">
          <div>
            <span className="font-bold text-[14.4px]">Overall</span>
          </div>
          <div>
            <span className="font-bold text-[14.4px]">5.0</span>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-7">
          <div className="w-full mx-auto flex flex-row justify-start items-center">
            <span className="font-bold text-[14.4px]">Details</span>
          </div>
          <div className="w-full mx-auto flex flex-row justify-center items-center">
            <textarea
              rows="3"
              className="block p-2.5 w-full text-[15px] text-gray-900 rounded-md border-0 focus:ring-blue-500 dark:placeholder-gray-400 dark:text-white bg-[#E2E2E2] focus-visible:border-0 mt-2"
              placeholder=""
            ></textarea>
          </div>
          <div className="w-full text-center mt-3">
            <div className="px-7 rounded-[10px] bg-gradient-to-t from-lime-500 to-emerald-500 border-2 border-solid border-[#707076]">
              <span className="font-bold text-[20px] text-[#060b44]">
                Submit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
