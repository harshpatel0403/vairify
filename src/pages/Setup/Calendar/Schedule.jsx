import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "../../../components/Button";
import { useEffect } from "react";
import axios from "axios";
import {
  HandleEditCalendarSchedule,
  HandleGetCalendarSchedule,
  HandleDeleteCalendarSchedule
} from "../../../redux/action/CalendarSchedule";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
import Header from "../../../components/Header/Header";
import PageTitle from "../../../components/PageTitle";

export default function Schedule() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const getschedule = useSelector((state) => state?.Calendar?.getschedule);
  const [isOpen, setIsOpen] = useState(false);
  const [staff, setStaff] = useState("schedule");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteScheduleId, setDeleteScheduleId] = useState(null);
  const [loadingIds, setLoadingIds] = useState({});


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
    const id = event?._id
    setLoadingIds((prev) => ({ ...prev, [id]: true }));

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
        }
      })
      .catch((err) => {
        console.error(err, "Error");
      })
      .finally(() => {
        setLoadingIds((prev) => ({ ...prev, [id]: false }));
      })
  };

  const HandleDelete = (id) => {
    dispatch(HandleDeleteCalendarSchedule(id))
      .then(async (result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setIsLoading(false);
          setIsDeleteOpen(false);
          setDeleteScheduleId(null);
          await dispatch(HandleGetCalendarSchedule(UserDetails?._id));
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
    <div>
      <div className="container ">
        <div className="">
          <div className="md:flex hidden justify-center items-center relative w-full mt-[48px]">
            <Button text={t("schedule.createNew")} className='!w-fit px-4 !absolute left-0 py-[6px] navy-text-btn' onClick={() => navigate("/set-schedule")} />
            <div className="sm:text-[28px] text-2xl font-semibold text-white md:block hidden">
              Schedule
            </div>
          </div>
          <div className="md:hidden block md:mb-0 sm:mb-[30px] mb-0">
            <PageTitle title={t("schedule.title")} />
          </div>
          <div className="md:hidden block">
            <Button text={t("schedule.createNew")} className='!w-fit px-4  py-[6px] navy-text-btn mt-4' onClick={() => navigate("/set-schedule")} />
          </div>
          {/* <div className="w-full mx-auto flex flex-row justify-around items-center mt-2">
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
        </div> */}
          <div className="sm:my-[48px] mt-[24px] mb-[48px]">
            <div className="grid md:grid-cols-2 sm:gap-[24px] gap-[16px]">
              {/* <div className="w-full mx-auto flex flex-row justify-around items-center bg-[#8295CB] py-2 h-[40px]">
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
            </div> */}

              {getschedule?.schedule?.length > 0 ? (
                getschedule?.schedule &&
                getschedule?.schedule?.map((event, index) => (
                  <div key={index} className="w-full p-[16px] bg-[#FFFFFF14] rounded-[16px] relative" >
                    <button className="absolute top-[23px] right-[26px]" onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}>
                      <img src="/images/setup/menu-icon.svg" alt="menu Icon" />
                    </button>
                    {activeDropdown === index && (
                      <div className="absolute top-[46px] right-[28px] bg-white rounded-[8px] shadow-lg z-10 py-1">
                        <button
                          onClick={() => {
                            navigate("/set-schedule", { state: event });
                          }}
                          className="px-[10px] py-[4px] text-[#01195C] text-sm font-semibold w-full text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteScheduleId(event._id);
                            setActiveDropdown(false);
                            setIsDeleteOpen(true);
                          }}
                          className="px-[10px] py-[4px] text-[#E43530] text-sm font-semibold w-full text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    <div className="flex gap-[8px] items-center">
                      <div className="font-semibold text-xl text-white">
                        {event?.nameSchedule}
                      </div>
                      <div
                        className={`font-medium text-xs px-[8px] py-[5px] rounded-[8px] ${event.status !== "active"
                          ? "text-[#E31D1C] bg-[#E4353029] "
                          : "text-[#08FA5A] bg-[#008F3429]"
                          }`}
                      >
                        {event.status !== "active" ? t("schedule.deactivate") :t("schedule.activate") }
                      </div>
                    </div>
                    <div className="flex gap-[10px] items-center mt-[14px]">
                      <div>
                        <img src="/images/setup/location-icon.svg" alt="location icon" />
                      </div>
                      <div className="text-sm font-normal text-white">
                        {event?.venue}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-[14px]">
                      <div className="w-full flex gap-[10px] items-center">
                        <img src="/images/setup/calender-icon.svg" alt="Calendar Icon" />
                        <p className="text-sm font-normal text-white">{event?.date?.start}</p>
                      </div>
                      <div className="w-full flex gap-[10px] items-center">
                        <img src="/images/setup/calender-icon.svg" alt="Calendar Icon" />
                        <p className="text-sm font-normal text-white">{event?.date?.end}</p>
                      </div>
                    </div>
                    <div className="w-full flex gap-2 items-center mt-[12px] justify-between">
                      <div className="flex gap-[10px] items-center">
                        <img src="/images/setup/day-icon.svg" alt="Days Icon" />
                        <span className="text-sm font-normal text-white">
                          {event?.days?.map((item) => item?.day).join(", ")}
                        </span>
                      </div>
                      <Button
                        disabled={isLoading}
                        text={
                          !loadingIds[event?._id] ? (
                            event.status !== "active" ? "Activate" : "De Activate"
                          ) : (
                            <div className="flex items-center	justify-center ">
                              {/* <Loading /> */}
                              <div className="h-[20px] w-[20px] animate-spin rounded-full border-2 bg-none border-white border-t-[#FFFFFF29]"></div>
                            </div>
                          )
                        }
                        onClick={() => handleStatus(event)}
                        className={`secondary-btn rounded-[8px] font-semibold text-xs  max-w-fit px-[20px] py-[3px] ${event.status === "active" ? "!bg-[#E43530] hover:!bg-[#E43530]" : "!bg-[#008F34] hover:!bg-[#008F34]"
                          }`}
                        size="30px"
                      />
                    </div>
                    {/* <div className="flex justify-around items-center mt-4">
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
                    </div> */}

                  </div>
                ))
              ) : (
                <div className="col-span-2 flex justify-center items-center h-[100px]">
                  <span className="text-xl text-white font-bold text-center opacity-[0.7]">
                     {t("schedule.noSchedules")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <Modal
          isOpen={isDeleteOpen}
          onRequestClose={() => setIsDeleteOpen(false)}
          className={
            "bg-white relative mx-auto w-[360px] rounded-[16px] p-[24px] w-[90%] max-w-[400px]"
          }
          contentLabel="#"
        >
          <button
            className=" absolute right-[26px] top-[26px] bg-transparent border border-[#919EAB] h-[18px] w-[18px] flex justify-center items-center rounded-full bg-white"
            onClick={() => setIsDeleteOpen(false)}
          >
            <img src={"/images/close-btn.svg"} alt="cancle" className="bg-[#060C4D] rounded-full h-full w-full object-cover" />
          </button>
          <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
            <div className="font-bold text-base text-[#212B36] text-center mt-6 w-[90%] mx-auto">
               {t("schedule.deleteConfirm")}
            </div>
            <div className="w-full flex items-center mt-4 gap-[16px]">
              <button
                onClick={() => HandleDelete(deleteScheduleId)}
                disabled={isLoading}
                className="bg-[#E43530] rounded-[8px] font-Roboto font-normal text-sm text-white py-2 px-2 w-full"
              >
                {isLoading ? (
                  <Loading size={24} />
                ) : (
                  t("common.yes")
                )}
              </button>
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="bg-[#008F34] rounded-[8px] font-Roboto font-normal text-sm text-white py-2 px-2 w-full"
              >
                {t("common.no")}
              </button>
            </div>
          </div>
        </Modal>
        {/* <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          className={
            "bg-[#3760CB] relative  mx-auto w-[360px] pt-8 pb-4 rounded-2xl"
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
        </Modal> */}
      </div>
    </div>
  );
}
