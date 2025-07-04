import React, { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import SelectBox_ from "../../../components/SelectBox_";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import PageTitle from "../../../components/PageTitle";

const services = ["Escort", "Massage", "Dancer"];

export default function SetVairifySchedule() {
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const location = useLocation();
  const appointment = location.state;
  const usr = appointment?.item?.userId || {};

  // Get the current time using moment
  var currentTime = moment();

  // Set the end time to midnight
  var endTime = moment().endOf("day");

  // Initialize an array to store time values
  var timeIntervals = [];

  // Round down the current time to the nearest 15-minute interval
  currentTime
    .startOf("hour")
    .add(Math.floor(currentTime.minute() / 15) * 15, "minutes");

  // Generate time values with 15-minute intervals
  while (currentTime.isSameOrBefore(endTime)) {
    timeIntervals.push(currentTime.format("hh:mm A"));
    // Move to the next 15-minute interval
    currentTime.add(15, "minutes");
  }

  const [selectedTime, setSelectedTime] = useState(timeIntervals[0]);
  const [selectedService, setSelectedService] = useState(services[0]);
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState(30);

  const userType = UserData.user_type;

  const hiddenElement = document.getElementById("hiddenintirepag");

  if (hiddenElement) {
    hiddenElement.style.display = "none";
  }

  const vairifyFaceVerification = () => {
    let payload = {
      startDateTime: moment(selectedTime, "hh:mm A").toDate(),
      endDateTime: moment(selectedTime, "hh:mm A")
        .add(duration, "minutes")
        .toDate(),
      duration: duration,
      // service: "Escort",
      extras: [],
      type: "vairify-now",
      clientId: { ...UserData },
      companionId: { ...usr },
      clientStatus: "Requested",
      companionStatus: "Pending",
      message: notes,
      service: selectedService,
      location: "",
      agreedPrice: 0,
    };
    navigate("/varidate/face-verification", {
      state: { ...payload, from: "vairifyNow" },
    });
  };

  return (
    <div
      id="schedule_rules"
      className="container"
    >
      <div className="min-h-[calc(100vh-358px)] mb-[48px]">
        {/* <div className="w-full mx-auto flex flex-row justify-between items-start mt-2 px-[25px]">
        <div className="flex flex-col items-center justify-center">
          <div>
            <span className="text-[15px] text-[#040C50] font-extrabold  font-Roboto-Serif">
              VAI
              <span className="text-[15px] text-[#040C50] font-semibold">
                RIFY ID
              </span>
            </span>
          </div>
          <div>
            <span className="text-[15px] text-[#040C50] uppercase font-bold">
              {usr?.vaiID}
            </span>
          </div>
        </div>
        <div className="w-[120px] relative">
          <div
            style={{ left: "10px", bottom: "65px" }}
            className="absolute w-full h-full rounded-full"
          >
            <div className="w-[110px] h-[110px] border-2 rounded-full overflow-hidden">
              <img
              src={
                import.meta.env.VITE_APP_S3_IMAGE +
                `/${usr.profilePic}`
              }
                // src={
                //   import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                //   `/${usr.profilePic}`
                // }
                // src={"/images/IntimateMassage.png"}
                alt="Intimate Massage"
              />
            </div>
          </div>
          <div style={{ right: "0px", top: "18px" }} className="absolute">
            <img
              src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
              alt="Sugar Icon Second"
            />
          </div>
        </div>
        <div>
          <div>
            <span className="text-[18px] text-[#040C50] change-font-family">
              TruRevu
            </span>
          </div>
          <div className="flex flex-row justify-center items-center">
            {[1, 2, 3, 4, 5].map((index) => (
              <FontAwesomeIcon
                key={index}
                icon={faStar}
                color={
                  index <= Math.round(usr?.averageRating || 0)
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
            ))}
            <span className="text-[15px] text-[#040C50] font-bold">
              {usr?.averageRating}
            </span>
          </div>
        </div>
      </div> */}

        {/* <div className="w-full mx-auto flex flex-col justify-center items-center mb-2">
        <span className="font-bold text-[22px] mulish-font-family">
          {usr?.name}
        </span>
      </div> */}
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"VAIRIFY - NOW"} isSmall={true} />
        </div>


        <div className="w-full">
          <div className="flex flex-col sm:gap-[24px] gap-[16px]">
            <div className="flex flex-col sm:gap-[24px] gap-[16px]">
              <div className="flex flex-grow justify-between items-center sm:gap-[24px] gap-[16px] sm:flex-nowrap flex-wrap">
                <div className="w-full">
                  <label className="font-medium text-white text-xl ">
                    Venue
                  </label>
                  <div className="relative select-arrow w-full mt-[8px]">
                    <select
                      disabled
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      name="savedSchedules"
                      value={usr?.vaiNowAvailable?.venue}
                    >
                      <option disabled value={usr?.vaiNowAvailable?.venue} className="text-black">
                        {usr?.vaiNowAvailable?.venue}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="w-full">
                  <label className="font-medium text-white text-xl">
                    Service
                  </label>
                  <div className="relative select-arrow w-full mt-[8px]">
                    <select
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      name="savedSchedules"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                    >
                      {services?.map((service) => (
                        <option key={service} value={service} className="text-black">
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-grow justify-between items-center sm:gap-[24px] gap-[16px] sm:flex-nowrap flex-wrap">
                <div className="w-full">
                  <label className="font-medium text-white text-xl">
                    Appt Time
                  </label>
                  <div className="relative select-arrow w-full mt-[8px]">
                    <select
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      name="savedSchedules"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      {timeIntervals.map((time) => (
                        <option key={time} value={time} className="text-black">
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className=" w-full">
                  <label className="font-medium text-white text-xl">
                    Appt Duration
                  </label>
                  <div className="relative select-arrow w-full mt-[8px]">
                    <select
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      name="savedSchedules"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option className="text-black" value={30}>0.5 hour</option>
                      <option className="text-black" value={60}>1 hour</option>
                      <option className="text-black" value={90}>1.5 hours</option>
                      <option className="text-black" value={120}>2 hours</option>
                      <option className="text-black" value={150}>2.5 hours</option>
                      <option className="text-black" value={180}>3 hours</option>
                      <option className="text-black" value={210}>3.5 hours</option>
                      <option className="text-black" value={240}>4 hours</option>
                      <option className="text-black" value={270}>4.5 hours</option>
                      <option className="text-black" value={300}>5 hours</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* <div className="flex flex-grow justify-center items-center gap-2">

                <div className="flex flex-col items-center max-w-[80%] w-full rounded-[10px] mt-3">
                  <label className="font-medium text-white text-xl">$ For Time Requested</label>
                  <div className="relative select-arrow w-full mt-[8px]">
                    
                    <div className="flex pl-4 text-center w-full h-[37px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[10px] appearance-none py-1.5 text-[14px] text-[#fff] font-semibold">
                    <div className="absolute left-4 text-[20px] top-1">$</div> <input className="ml-4 bg-transparent text-[20px]"/>
                    </div> 
                  </div>
                </div> 

              </div> */}
            </div>
            <div>
              <div className="w-full">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px] !placeholder-white"
                  placeholder="Notes"
                ></textarea>
              </div>

              <div className="w-full mx-auto max-w-[500px] sm:mt-[24px] mt-[16px]">
                <Button
                  onClick={vairifyFaceVerification}
                  text="Send"
                  size={"48px"}
                />
              </div>
            </div>
          </div>

          {/*  
        <Modal
          isOpen={isDeleteOpen}
          onRequestClose={closeModal}
          className={
            "bg-[#3760CB] relative top-[50%] translate-y-[-50%] mx-auto py-4 w-[360px] rounded-2xl px-4"
          }
          contentLabel="#"
        >
          <button
            onClick={() => setIsDeleteOpen(false)}
            className="absolute top-2 right-2"
          >
            <img
              src="/images/Mask group-close.png"
              alt=""
              width="30px"
              height="30px"
            />
          </button>
          <div className="w-full mx-auto flex flex-col justify-center items-cener px-4">
            <div className="font-bold text-[24px] pt-3 text-white text-center leading-9">
              Are you sure you want to delete your schedule?
            </div>
            <div className="w-full mx-auto flex flex-row justify-around items-center mt-2">
              <button
                onClick={() => HandleDelete(state?._id)}
                className="w-[120px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-[10px] font-Roboto font-bold text-[23px] text-[#040C50] py-1"
              >
                Yes
              </button>
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="w-[120px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-[10px] font-Roboto font-bold text-[23px] text-[#040C50] py-1"
              >
                No
              </button>
            </div>
          </div>
        </Modal> */}
        </div>
      </div>
    </div>
  );
}
