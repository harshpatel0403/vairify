import React from "react";
import IconButton from "../../../components/IconButton";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleCreateCalendarSetting,
  HandleGetCalendarSettings,
} from "../../../redux/action/CalendarSchedule";
import Loading from "../../../components/Loading/Index";
import { useEffect } from "react";

export default function VairifyCalendarSetting() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  var CalendarSettings = useSelector((state) => state?.Calendar?.getsettings);
  // FOR TEST
  // CalendarSettings.availableStatus = false
  console.log(
    "🚀 ~ file: CalendarSetting.jsx:20 ~ CalendarSetting ~ CalendarSettings:",
    CalendarSettings
  );

  
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenVenue, setIsOpenVenue] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [isShownLocation, setIsShownLocation] = useState(false);
  const handleClick = event => {
    setIsShown(current => !current);
  };
const handleClickLocation = event => {
  setIsShownLocation(current => !current);
};

  const closeModal = () => {
    setIsOpen(false);
  };
  const closeVenueModal= () => {
    setIsOpenVenue(false);
  };

  const submit = () => {
    
  }

  const HandleSaveButton = () => {

  }
   
  return (
    <div className="flex flex-col justify-between main-container px-0 min-h-[calc(100vh-150px)]">
      <div>
        <h2 className="text-[28px] font-black my-2">Calendar</h2>
        <div className="w-full bg-gradient-to-t from-[#0247FF] to-[#02227EAD] h-[10px] w-full"></div>
        <h2 className="text-[22px] font-extrabold my-1 uppercase">VAI<span className="logoSetupweight">RIFY- NOW</span></h2>
        <div className="px-6 flex flex-col justify-center form-field-container">
        <div
          className="rounded-full bg-[#02227E] h-[50px] items-center justify-center w-full"
          onClick={() => {
            if (!CalendarSettings?.availableStatus) {
              // setIsOpen(true);
              setIsOpenVenue(true);
            }
          }}
        >
          <div
            className={`w-[50px] h-[50px] border-4 border-${
              CalendarSettings?.availableStatus ? "[#02227E]" : "[#0C8A02]"
            } rounded-full bg-${
              CalendarSettings?.availableStatus ? "[#0C8A02]" : "gradient-to-t"
            } from-[#8387E0] to-[#0A44A0] relative left-0`}
          ></div>
          <h2 className="text-white text-[24px] font-semibold relative -top-11">
            Available Now
          </h2>
        </div>
      </div>
        <p className="text-[#DB3002] font-bold text-[14px] mt-1">Activating Available the now feature will<br/> overide schedules during designated time</p>
      </div>
     
      <div className="px-6 bg-[#0247FF7F] mt-3">
        <div className="w-full  h-[66px]  flex justify-center items-center mt-2">
          <h4 className="text-bold max-[425px]:text-[24px] max-[425px]:mr-4 text-[27px] font-bold mr-6">
            Duration
          </h4>
          <div className="flex gap-2 mb-3">
            <div>
              <h6 className="font-bold text-[10px]">Hr</h6>
              <div className="bg-[#02227E] w-[45px] h-[45px] rounded-md flex justify-center items-center">
                <h6 className="text-white font-[700] text-[14px]">
                  {/* {bufferHr} */}01
                </h6>
              </div>
            </div>
            <div>
              <h6 className="font-bold text-[10px]">Min</h6>
              <div className="bg-[#02227E] w-[45px] h-[45px] rounded-md flex justify-center items-center">
                <h6 className="text-white font-[700] text-[14px]">
                  {/* {bufferMin} */}20
                </h6>
              </div>
            </div>
          </div>
          <div className="mx-2 flex gap-2">
            <IconButton
              //onClick={() => handleDurationUpBuffer()}
              icon={
                <>
                  <img
                    className="w-[20px] h-[20px]"
                    src={`/images/VectorUp.png`}
                    alt=""
                  />
                </>
              }
              className={"w-[45px] h-[45px] bg-white rounded-md"}
            />
            <IconButton
              //disabled={parseInt(bufferMin) == 0}
              //onClick={() => handleDurationDownBuffer()}
              icon={
                <>
                  <img
                    className="w-[20px] h-[20px]"
                    src={`/images/VectorDown.png`}
                    alt=""
                  />
                </>
              }
              className={"w-[45px] h-[45px] bg-white rounded-md"}
            />
          </div>
        </div>
      </div>
      <div className="justify-center form-field-container mt-3 px-6 flex flex-col gap-4">
        <div
          className="bg-[#3760CB] h-[70px] border-[3px] border-[#040C50] rounded-2xl flex justify-center items-center"
          //onClick={handle2Calendar}
        >
          <h2
            className="text-[22px] font-semibold text-white leading-[28px]"
          >
            View/Edit
            <br />
            Calendar
          </h2>
        </div>
        <div
          className="bg-[#3760CB] h-[70px] border-[3px] border-[#040C50] rounded-2xl flex justify-center items-center"
          //onClick={handle2Schedule}
        >
          <h2
            className="text-[22px] font-semibold text-white leading-[28px]"
          >
            View/Edit
            <br />
            Schedules
          </h2>
        </div>
        <div
          className="bg-[#3760CB] h-[70px] border-[3px] border-[#040C50] rounded-2xl flex justify-center items-center"
          //onClick={handle2Rule}
        >
          <h2
            className="text-[22px] font-semibold text-white leading-[28px]"
          >
            View/Edit
            <br />
            Rules
          </h2>
        </div>
        <div
          className="bg-[#3760CB] h-[70px] border-[3px] border-[#040C50] rounded-2xl flex justify-center items-center"
          //onClick={handle2SyncCalendar}
        >
          <h2
            className="text-[22px] font-semibold text-white leading-[28px]"
          >
            Sync Calendar
          </h2>
        </div>
      </div>
      <div className="mt-6 pb-5 px-6">
        <Button
          onClick={submit}
          text={"Submit"}
          className="w-[145px] max-w-[163px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-Roboto font-bold text-[23px] text-[#040C50] py-1"
        />
      </div>


      

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className={
          "bg-[#3760CB] relative top-56 mx-auto py-4 w-[360px] rounded-2xl px-4"
        }
        contentLabel="#"
      >
        <div className="w-full mx-auto flex flex-col justify-center items-cener px-4">
          <div className="font-bold text-[24px] text-white text-center leading-9">
            Your Black Out will be suspended during this period
          </div>
          <div className="w-full mx-auto flex flex-row justify-around items-center mt-2">
            <button
            disabled={isLoading}
              onClick={HandleSaveButton}
              className="w-[120px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-Roboto font-bold text-[23px] text-[#040C50] py-1"
            >
              {!isLoading ? (
                "Yes"
              ) : (
                <div className="flex items-center	justify-center">
                  <Loading />
                </div>
              )}
            </button>
            <button
              onClick={closeModal}
              className="w-[120px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-Roboto font-bold text-[23px] text-[#040C50] py-1"
            >
              No
            </button>
          </div>
        </div>
      </Modal>


      <Modal
        isOpen={isOpenVenue}
        onRequestClose={closeVenueModal}
        className={
          "bg-[#3760CB] relative top-56 mx-auto py-4 w-[360px] rounded-2xl px-4"
        }
        contentLabel="#"
      >
         <button
                  className="cancel-button absolute right-2 top-2 p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={closeVenueModal}
                >
                  <img src={"/images/close-btn.svg"} alt="cancle" />
                </button>
        <div className="w-full mx-auto flex flex-col justify-center items-cener px-1 mt-5">
          <div className="font-bold text-[24px] text-white text-center leading-9">
            Please Select Your Venue
          </div>

          <div className="flex flex-grow justify-between items-center gap-2 modal-radio-btn">

              <div class="flex items-center mt-3">
                  <input id="default-radio-1" type="radio" value={true} name="default-radio" class="w-[20px] h-[20px]" />
                  <label for="default-radio-1" class="ml-2 text-white text-[18px] font-bold">Incall</label>
              </div>
              <div class="flex items-center mt-3">
                  <input id="default-radio-2" type="radio" value={false} name="default-radio" class="w-[20px] h-[20px]" />
                  <label for="default-radio-2" class="ml-2 text-white text-[18px] font-bold">Outcall</label>
              </div> 
              <div class="flex items-center mt-3">
                  <input id="default-radio-2" type="radio" value={false} name="default-radio" class="w-[20px] h-[20px]" />
                  <label for="default-radio-2" class="ml-2 text-white text-[18px] font-bold">Mobile</label>
              </div> 

          </div> 
          
          <div className="font-bold text-[24px] text-white text-center leading-9 mt-6">
            How Would you like to Share your location 
          </div>

          <div className="w-full mx-auto flex flex-row justify-around items-start my-3">
            <div className="text-center">
              <button
                onClick={HandleSaveButton}
                disabled={isLoading}
                className="w-[140px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-Roboto font-bold text-[20px] text-[#040C50] py-1 px-1"
              >
                {!isLoading ? (
                  "Request only"
                ) : (
                  <div className="flex items-center	justify-center">
                    <Loading />
                  </div>
                )}
              </button>
              <img className="w-[40px] mx-auto mt-3" src={"/images/info.svg"} alt="Pin" onClick={handleClickLocation} />
              {isShownLocation && (
                 <p className="info-text">Members must request to see your location</p>
              )}
             
            </div>
            <div className="text-center">
            <button
              onClick={closeModal}
              className="w-[140px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-Roboto font-bold text-[20px] text-[#040C50] py-1 px-1"
            >
              Public
            </button>
              <img className="w-[40px] mx-auto mt-3" src={"/images/info.svg"} alt="Pin" onClick={handleClick}/>
              {isShown && (
                <p className="info-text">Members can see your location in map view</p>
              )}
          
          </div>


          </div>
        </div>
      </Modal>

    </div>
  );
}
