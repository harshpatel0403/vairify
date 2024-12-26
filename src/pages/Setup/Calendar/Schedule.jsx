import React, { useState } from "react";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { useEffect } from "react";
import axios from "axios";
import {
  HandleEditCalendarSchedule,
  HandleGetCalendarSchedule,
} from "../../../redux/action/CalendarSchedule";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";

export default function Schedule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const getschedule = useSelector((state) => state?.Calendar?.getschedule);

  const [isOpen, setIsOpen] = useState(false);
  const [staff, setStaff] = useState("schedule");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleEdit = () => {
    navigate("/set-schedule", {
      state: selectedEvent,
    });
  };

  const toggle = (props) => {
    setStaff(props);
    if (props == "createNew") {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    dispatch(HandleGetCalendarSchedule(UserDetails?._id));
  }, []);

  const handleStatus = (event) => {
    setIsLoading(true);
    const body = {};
    if (event.status === "active") {
      body.status = "in-active";
    } else {
      body.status = "active";
    }
    dispatch(HandleEditCalendarSchedule(event?._id, body))
      .then(async (result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          await dispatch(HandleGetCalendarSchedule(UserDetails?._id));
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err, "Error");
      });
  };

  return (
    <div className="main-container px-0 sm:py-5">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        <div clasName="w-full mx-auto flex justify-center items-center">
          <span className="font-extrabold text-[27px] text-black">
            Schedule
          </span>
        </div>
        <div className="w-full mx-auto flex flex-row justify-around items-center mt-2">
          {staff == "schedule" ? (
            <div
              onClick={() => toggle("schedule")}
              className="px-1 w-full rounded-tr-md  bg-[#A0AACD] border-b-4 border-b-[#0247FF]"
            >
              <span className="font-semibold text-[20px] text-[#02227E]">
                View Schedule
              </span>
            </div>
          ) : (
            <div onClick={() => toggle("schedule")} className="px-1 w-full">
              <span className="font-semibold text-[20px] text-[#02227E]">
                View Schedule
              </span>
            </div>
          )}
          {staff == "createNew" ? (
            <div className="px-1 w-full  rounded-tl-md bg-[#A0AACD] border-b-4 border-b-[#0247FF]">
              <Link
                to={"/set-schedule"}
                className="font-semibold text-[20px] text-[#02227E]"
              >
                Create New +
              </Link>
            </div>
          ) : (
            <div className="px-1 w-full">
              <Link
                to={"/set-schedule"}
                className="font-semibold text-[20px] text-[#02227E]"
              >
                Create New +
              </Link>
            </div>
          )}
        </div>
        <div style={{ border: "1px solid black" }} className="w-full"></div>
        <div className=" flex w-full justify-center items-center mt-4 bg-[#8295CB] py-2">
          <span className="font-bold text-[32px] text-black">
             Schedules
          </span>
        </div>
        <div className="px-3 sm:px-5 w-full mx-auto flex justify-center">
          <div className="w-full max-w-[420px] mx-auto flex flex-col justify-center items-center shadow-2xl rounded-[25px] bg-[#3760CB] my-4 pt-8 pb-8 gap-2">
            <div className="w-full mx-auto flex flex-row justify-around items-center bg-[#8295CB] py-2 h-[40px]">
              <div className="max-w-[95px]">
                <span className="font-bold text-[18px] text-center">
                  Name
                </span>
              </div>
              <div className="max-w-[95px]">
                <span className="font-bold text-[18px] text-center">
                  Status
                </span>
              </div>
              <div className="max-w-[95px]">
                <span className="font-bold text-[18px] text-center ">
                  Days
                </span>
              </div>
            </div>

            {getschedule?.schedule?.length > 0 ? (
              getschedule?.schedule &&
              getschedule?.schedule?.map((event, index) => (
                <div key={index} className="w-full pb-4 px-5">
                  <div className="w-full mx-auto flex flex-row justify-around items-end mt-2">
                    <div className="w-full flex flex-col justify-center items-center text-left">
                      <div className="w-full">
                        <span className="font-semibold text-[17px] text-white">
                          {event?.nameSchedule}
                        </span>
                      </div>
                    </div>
                    <div className="w-full flex flex-col justify-center items-center">
                      <div className="w-full">
                        <span
                          className={`font-semibold text-[17px] ${
                            event.status !== "active"
                              ? "text-[#E31D1C]"
                              : "text-[#08FA5A]"
                          }`}
                        >
                          {event.status !== "active" ? "In active" : "Active"}
                        </span>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full">
                        <span className="font-semibold text-[17px] text-white">
                          {event?.days?.map((item) => item?.day).join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-around items-center mt-4">
                    <div className="pr-3 w-full">
                      <Button
                        text="View Edit"
                        bgColor={" from-[#02227E] to-[#0247FF]"}
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsOpen(true);
                        }}
                        className="rounded-[8px] font- semibold text-[20px] text-white py-2 px-4 bg-calendar-edit flex items-cener justify-center shadow-[1px_5px_10px_rgba(0,0,0,0.4)]"
                        size="35px"
                      />
                    </div>
                    <div className="pl-3 w-full">
                      <Button
                        text={
                          !isLoading ? (
                            event.status !== "active" ? (
                              "Activate"
                            ) : (
                              "De Activate"
                            )
                          ) : (
                            <div className="flex items-center	justify-center pt-[6px]">
                              <Loading />
                            </div>
                          )
                        }
                        bgColor={
                          event.status !== "active"
                            ? " from-[#0CA36C] to-[#0CA36C] text-white"
                            : " from-[#DB3002] to-[#DB3002] "
                        }
                        onClick={() => handleStatus(event)}
                        className="rounded-[8px] font-semibold text-[18px] text-white py-2 px-2 bg-calendar-deactivate flex items-cener justify-center shadow-[1px_5px_10px_rgba(0,0,0,0.3)]"
                        size="35px"
                      />
                    </div>
                  </div>
                  <div></div>
                </div>
              ))
            ) : (
              <span className="text-[22px] text-[#02227E] font-bold text-center">
                Schedules not found
              </span>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className={
          "bg-[#3760CB] relative top-[50%] translate-y-[-50%] mx-auto w-[360px] pt-8 pb-4 rounded-2xl"
        }
        contentLabel="Example Modal"
      >
        <div className="py-[2px] bg-[#D9D9D936] text-center h-[31px] flex items-center justify-center">
          <h4 className="text-[#01195C] font-black text-[26px]">View</h4>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-start px-4 py-2">
          <div className="flex justify-between w-full items-center">
            <span className="font-semibold text-[18px] text-white">
              Name of schedule:
            </span>
            <span className="text-center font-semibold text-[18px] text-white">
              {selectedEvent?.nameSchedule}
            </span>
          </div>
          <div className="font-semibold text-[18px] text-white mt-2 flex justify-between w-full">
            <span>Date:</span>
            <span className="ml-12 text-center">
              {selectedEvent?.date?.start?.slice(0, 5)} -{" "}
              {selectedEvent?.date?.end?.slice(0, 5)}
            </span>
          </div>
          <div className="w-full mx-auto flex flex-col justify-start items-start mt-2">
            <div className="mb-2">
              <span className="font-semibold text-[18px] text-white">Days:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedEvent?.days?.map((item, index) => {
                return (
                  <button key={index} className="w-[42px] h-[42px] bg-[#01195C] rounded-md font-bold text-[18px] leading-3 text-white">
                    {item?.day}
                  </button>
                );
              })}
            </div>
            <div className="w-full flex flex-wrap gap-1 mt-2">
              {selectedEvent?.days?.map((item, index) => {
                return (
                  <button key={index} className="w-[42px] h-[42px] bg-[#01195C] rounded-md font-semibold text-[8px] leading-3 text-white">
                    {item?.start && item?.end ? (
                      <>
                        {item?.start}
                        <br />
                        To
                        <br />
                        {item?.end}
                      </>
                    ) : (
                      <div className="text-base">Off</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
          <button
            onClick={() => handleEdit()}
            className="w-[144px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[18px] text-[#040C50] py-1 border-gray-100 border-2"
          >
            Edit
          </button>
        </div>
      </Modal>
    </div>
  );
}
