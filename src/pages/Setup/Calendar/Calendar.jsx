import React, { Children, cloneElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { views } from "react-big-calendar/lib/utils/constants"; // Import 'views' separately from the constants module
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../../../components/Button";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { Select, MenuItem } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
// import "react-big-calendar/lib/css/react-big-calendarSchedules.css";
import enUSLocale from "date-fns/locale/en-US";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { addMonths, subMonths } from "date-fns";
import { useEffect } from "react";
import {
  HandleEditCalendarSchedule,
  HandleGetCalendarSchedule,
} from "../../../redux/action/CalendarSchedule";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import DateGuardService from "../../../services/DateGuardService";
import Header from "../../../components/Header/Header";
import { IoCloseCircleOutline } from "react-icons/io5";
import PageTitle from "../../../components/PageTitle";
const locales = {
  "en-US": enUSLocale,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
const myEventsList = [
  {
    title: "Event 1",
    allDay: true,
    start: new Date(2023, 8, 10, 10, 0),
    end: new Date(2023, 8, 10, 12, 0),
  },
  {
    title: "Event 2",
    start: new Date(2023, 8, 11, 14, 0),
    end: new Date(2023, 8, 11, 16, 0),
  },
  {
    title: "Event 3",
    start: new Date(2023, 8, 11, 14, 0),
    end: new Date(2023, 8, 11, 16, 0),
  },
  {
    title: "Event 4",
    start: new Date(2023, 8, 11, 14, 0),
    end: new Date(2023, 8, 11, 16, 0),
  },
];

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     backgroundColor: "#3760CB",
//     width: "90vw",
//     // height: "421px",
//     zIndex: 20,
//     borderRadius: "30px",
//     border: "2px solid black",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "start",
//     padding: "20px 15px",
//     overflow: "auto",
//     maxWidth: "500px",
//   },
// };

// const localizer = momentLocalizer(moment);
// const DnDCalendar = withDragAndDrop(Calendar);

const TouchCellWrapper = ({ children, value, onSelectSlot }) =>
  cloneElement(Children.only(children), {
    onTouchEnd: () => onSelectSlot({ action: "click", slots: [value] }),
    style: {
      className: `${children}`,
    },
  });

Modal.setAppElement("#root");

export default function CalendarSchedules() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const userType = UserDetails?.user_type; //'companion-provider'
  const getschedule = useSelector((state) => state?.Calendar?.getschedule);

  const [selectEvent, setSelectEvent] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date()); // Initialize with the current date
  const [status, setStatus] = useState("#16A34A");
  const [events, setEvents] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [monday, setMondays] = useState(); // Define mondays state

  useEffect(() => {
    const allMondays = []; // Create an array to store all Mondays

    getschedule?.schedule?.map((item) => {
      const currentYear = new Date().getFullYear();

      // Parse the start and end date strings, adding the current year
      const startDate = new Date(`${currentYear}-${item.date.start}`);
      const endDate = new Date(`${currentYear}-${item.date.end}`);

      // Initialize the mondays array for each schedule item

      item?.days?.map((day) => {
        if (day.day === "Su") {
          day.dayindex = 0;
        } else if (day.day === "Mo") {
          day.dayindex = 1;
        } else if (day.day === "Tu") {
          day.dayindex = 2;
        } else if (day.day === "We") {
          day.dayindex = 3;
        } else if (day.day === "Th") {
          day.dayindex = 4;
        } else if (day.day === "Fr") {
          day.dayindex = 5;
        } else if (day.day === "Sa") {
          day.dayindex = 6;
        }

        // Reset currentDate to startDate for each day
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          if (currentDate.getDay() === day?.dayindex) {
            // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            const customStartTime = new Date(currentDate);
            const customEndTime = new Date(currentDate);

            // Extract hours and minutes from the backend data and set them
            const [startHours, startMinutes] = day?.start?.match(/\d+/g);
            const [endHours, endMinutes] = day?.end?.match(/\d+/g);

            customStartTime.setHours(
              parseInt(startHours),
              parseInt(startMinutes),
              0,
              0
            );
            customEndTime.setHours(
              parseInt(endHours),
              parseInt(endMinutes),
              0,
              0
            );
            const customMonday = {
              start: customStartTime,
              end: customEndTime,
              title: item.nameSchedule,
              status: day.status,
              color: item.color,
              id: item._id,
            };
            allMondays.push(customMonday);

            // setMondays(allMondays);
          }
          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
      });
    });
  }, [getschedule]);

  useEffect(() => {
    setMondays(
      appointments?.map((item) => ({
        start: moment(item?.startDateTime).toDate(),
        end: moment(item?.endDateTime).toDate(),
        title:
          item?.[userType === "client-hobbyist" ? "companionId" : "clientId"]
            ?.name,
        status: true,
        color: "",
        id: item._id,
        ...item,
      })) || []
    );
  }, [appointments]);

  // useEffect(() => {
  //   console.log("getschedule data:", getschedule);
  //   let newArr = [];
  //   if (getschedule?.schedule) {
  //     const formattedEvents = getschedule?.schedule.map((event) => {
  //       const eventDays = event.days.map((day) => {
  //         const startDate = parse(
  //           `${event.date.start} ${day.start}`,
  //           "d MMMM h:mm a",
  //           new Date()
  //         );
  //         const endDate = parse(
  //           `${event.date.end} ${day.end}`,
  //           "d MMMM h:mm a",
  //           new Date()
  //         );
  //         const data = {
  //           title: event.nameSchedule,
  //           day: day.day,
  //           start: startDate,
  //           end: endDate,
  //           status: day.status,
  //           color: event.color,
  //           id: event._id,
  //         };
  //         newArr.push(data);
  //         return {
  //           title: event.nameSchedule,
  //           day: day.day,
  //           start: startDate,
  //           end: endDate,
  //           status: day.status,
  //           color: event.color,
  //         };
  //       });
  //       return {
  //         title: event.nameSchedule,
  //         events: eventDays,
  //         color: event.color,
  //       };
  //     });

  //     setEvents(newArr);
  //   }
  // }, [getschedule]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    return {
      style: {
        backgroundColor: event.color, // Customize event color as needed
        textColor: "#ffffff",
      },
    };
  };

  const onSelectSlot = ({ action, slots /*, ...props */ }) => {
    if (action === "click") {
      openModal();
    }
    return false;
  };
  const handleSelectEvent = (props) => {
    openModal();
    setSelectEvent(props);
    setStatus(props?.color);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setSelectEvent();
  };
  const navigateToSchedule = () => {
    const data = getschedule?.schedule?.find(
      (item) => item?.nameSchedule === selectEvent?.title
    );
    navigate("/set-schedule", { state: data });
  };
  const navigateToviewall = (appointment) => {
    navigate("/varidate/appointment-details", { state: appointment });
  };
  const CustomInput = (props) => {
    return (
      <div className="input-group">
        <input
          type="text"
          className="form-control text-black"
          onClick={props.onClick}
          value={props.value}
          onChange={props.onChange}
        />
        <div className="input-group-append">
          <span className="input-group-text">
            <FontAwesomeIcon icon={faCalendar} className="!text-[#060C4D]" />
          </span>
        </div>
      </div>
    );
  };
  // const CustomToolbar = ({ view, onView }) => {
  //   return (
  //     <div className="my-custom-toolbar flex w-full">
  //       <button
  //         className="border-2 w-full min-w-fit border-[#000000] pl-3 pr-3 h-[48px] font-bold text-[23.4px] text-[#000000]"
  //         onClick={() => onView(views.MONTH)}
  //         disabled={view === views.MONTH}
  //       >
  //         Month
  //       </button>
  //       <button
  //         className="border-2 w-full min-w-fit border-[#000000] pl-3 pr-3 h-[48px] font-bold text-[23.4px] text-[#000000]"
  //         onClick={() => onView(views.WEEK)}
  //         disabled={view === views.WEEK}
  //       >
  //         Week
  //       </button>
  //       <button
  //         className="border-2 w-full min-w-fit border-[#000000] pl-3 pr-3 h-[48px] font-bold text-[23.4px] text-[#000000]"
  //         onClick={() => onView(views.DAY)}
  //         disabled={view === views.DAY}
  //       >
  //         Day
  //       </button>
  //       <button
  //         className="border-2 w-full min-w-fit border-[#000000] pl-3 pr-3 h-[48px] font-bold text-[23.4px] text-[#000000]"
  //         onClick={() => {
  //           const now = new Date(startDate);
  //           onView(views.AGENDA);
  //           setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
  //         }}
  //         disabled={view === views.AGENDA}
  //       >
  //         Agenda
  //       </button>
  //     </div>
  //   );
  // };
  const CustomToolbar = ({ view, onView, props }) => {
    const now = new Date(); // Get the current date

    const goToWeekView = () => {
      const startOfWeek = new Date(now);
      const endOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)
      endOfWeek.setDate(now.getDate() - now.getDay() + 6); // End of the week (Saturday)
      onView(views.WEEK); // Switch to Week view
      setStartDate(startOfWeek);
    };

    const goToDayView = () => {
      onView(views.DAY); // Switch to Day view
      setStartDate(now);
    };

    return (
      <div className="my-custom-toolbar flex w-full">
        <button
          className={` w-full min-w-fit border border-[#919EAB33]  pl-3 pr-3 h-[48px] font-bold text-base text-white
          ${view === views.MONTH && "bg-[linear-gradient(161.64deg,_rgba(255,_255,_255,_0.24)_0%,_rgba(255,_255,_255,_0.24)_98.85%)]"}`}
          onClick={() => {
            onView(views.MONTH);
            setStartDate(new Date()); // Reset to current month
          }}
          disabled={view === views.MONTH}
        >
          {t("calendarSchedules.month")}
        </button>
        <button
          className={` w-full min-w-fit border border-[#919EAB33]  pl-3 pr-3 h-[48px] font-bold text-base text-white
          ${view === views.WEEK && "bg-[linear-gradient(161.64deg,_rgba(255,_255,_255,_0.24)_0%,_rgba(255,_255,_255,_0.24)_98.85%)]"}`}
          onClick={() => {
            goToWeekView();
          }}
          disabled={view === views.WEEK}
        >
          {t("calendarSchedules.week")}
        </button>
        <button
          className={` w-full min-w-fit border border-[#919EAB33]  pl-3 pr-3 h-[48px] font-bold text-base text-white
          ${view === views.DAY && "bg-[linear-gradient(161.64deg,_rgba(255,_255,_255,_0.24)_0%,_rgba(255,_255,_255,_0.24)_98.85%)]"}`}
          onClick={goToDayView}
          disabled={view === views.DAY}
        >
          {t("calendarSchedules.day")}
        </button>
        <button
          className={` w-full min-w-fit border border-[#919EAB33]  pl-3 pr-3 h-[48px] font-bold text-base text-white
          ${view === views.AGENDA && "bg-[linear-gradient(161.64deg,_rgba(255,_255,_255,_0.24)_0%,_rgba(255,_255,_255,_0.24)_98.85%)]"}`}
          onClick={() => {
            const startOfMonth = new Date(startDate);
            startOfMonth.setDate(1); // Start of the current month
            onView(views.AGENDA, startDate); // Switch to Agenda view
            setStartDate(startOfMonth);
          }}
          disabled={view === views.AGENDA}
        >
          {t("calendarSchedules.agenda")}
        </button>
      </div>
    );
  };

  const changeMonth = (direction) => {
    const newDate =
      direction === "next" ? addMonths(startDate, 1) : subMonths(startDate, 1);
    setStartDate(newDate);
  };

  const fetchAppointments = async () => {
    // setLoading(true)
    try {
      const apts = await DateGuardService.getAppointments(
        UserDetails._id,
        "?all=true"
      );
      setAppointments(apts);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      // setLoading(false)
    }
  };

  useEffect(() => {
    dispatch(HandleGetCalendarSchedule(UserDetails?._id));
    fetchAppointments();
  }, []);

  // Define a common click handler function
  const handleStatusChange = async (selectEvent, statusColor) => {
    await dispatch(
      HandleEditCalendarSchedule(selectEvent?.id, {
        color: statusColor,
      })
    );
    await dispatch(HandleGetCalendarSchedule(UserDetails?._id));
    setStatus(statusColor);
  };

  return (
    <div className="min-h-[calc(100vh-[282px)]">
      <div className="container">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={t("calendarSchedules.title")} />
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center sm:my-[48px] my-[24px]">
          <div className="w-full mx-auto flex flex-row p-2 justify-center items-center gap-[24px] bg-[#FFFFFF14] border border-[#919EAB33] border-b-0">
            <div
              className="w-[30px] cursor-pointer text-white text-lg rounded-md font-[700] flex justify-center  "
              onClick={() => changeMonth("prev")}
            >
              <img src="/images/setup/prev-icon.svg" alt="prev" />
            </div>
            <div className="flex items-center py-[10px]">
              <div>
                <div className="font-semibold text-white text-xl">
                  {format(startDate, "MMMM")} {format(startDate, "yyyy")}
                </div>
              </div>
              <div className="cursor-pointer" onClick={() => navigate("/schedule")}>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  color="#fff"
                  className="text-lg pl-2"
                />
              </div>
            </div>
            <div
              className="w-[30px] cursor-pointer text-white text-lg rounded-md font-[700] flex justify-center  "
              onClick={() => changeMonth("next")}
            >
              <img src="/images/setup/next-icon.svg" alt="next" />
            </div>
          </div>
          <div className=" max-[500px]:px-0 w-full">
            <div className=" w-full">
              <Calendar
                components={{
                  dateCellWrapper: (props) => (
                    <TouchCellWrapper {...props} onSelectSlot={onSelectSlot} />
                  ),
                  toolbar: CustomToolbar,
                }}
                localizer={localizer}
                eventPropGetter={eventStyleGetter}
                events={monday}
                startAccessor="start"
                endAccessor="end"
                style={{
                  height: 600,
                  width: "100%",
                  backgroundColor: "#FFFFFF14",
                }}
                resizable
                selectable
                // onSelectSlot={onSelectSlot}
                onShowMore={(events, date) => setStartDate(date)}
                onSelectEvent={handleSelectEvent}
                views={["month", "week", "day", "agenda"]}
                defaultDate={moment().toDate()}
                defaultView="month"
                date={startDate}
              />

              <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                className={
                  "bg-[#FFFFFF] relative mx-auto  rounded-[16px] sm:p-[24px] p-[16px] w-[90%] max-w-[600px] overflow-y-auto "
                }
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute sm:right-[24px] right-[16px] sm:top-[20px] top-[12px] p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                >
                  <IoCloseCircleOutline size={26} />
                </button>
                <div className="w-full h-[100%] flex flex-col justify-between">
                  <div>
                    <div className="mb-[50px]">
                      <h3 className="font-bold text-center sm:text-[18px] text-[14px] sm:w-[90%] w-[70%] mx-auto text-black break-all text-wrap">
                        {t("calendarSchedules.appointmentId")} #{selectEvent?.id}
                        {UserDetails?.user_type}
                      </h3>

                      {/*
                   <div className="w-[100px]">
                    <Select
                      value={status}
                      className="w-[90px] h-[43px] flex justify-center items-center select-radius bg-white"
                    >
                      <MenuItem
                        onClick={() =>
                          handleStatusChange(selectEvent, "#DC2626")
                        }
                        value={"#DC2626"}
                        name="#DC2626"
                      >
                        <div className="mx-auto flex justify-center items-center w-[19px] h-[19px] rounded-full bg-red-600"></div>
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleStatusChange(selectEvent, "#16A34A")
                        }
                        value={"#16A34A"}
                        name="#16A34A"
                      >
                        <div className="mx-auto flex justify-center items-center w-[19px] h-[19px] rounded-full bg-green-600"></div>
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleStatusChange(selectEvent, "#CA8A04")
                        }
                        value={"#CA8A04"}
                        name="#CA8A04"
                      >
                        <div className="mx-auto flex justify-center items-center w-[19px] h-[19px] rounded-full bg-yellow-600"></div>
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleStatusChange(selectEvent, "#2563EB")
                        }
                        value={"#2563EB"}
                        name="#2563EB"
                      >
                        <div className="mx-auto flex justify-center items-center w-[19px] h-[19px] rounded-full bg-blue-600"></div>
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleStatusChange(selectEvent, "#000000")
                        }
                        value={"#000000"}
                        name="#000000"
                      >
                        <div className="mx-auto flex justify-center items-center w-[19px] h-[19px] rounded-full bg-black"></div>
                      </MenuItem>
                    </Select>
                      
                  </div>
                 */}
                    </div>
                    <div className="flex items-center gap-5 w-full mb-[12px]">
                      <p className="text-[#212B36] text-[14px] font-medium w-full max-w-[140px]">{t("calendarSchedules.location")}</p>
                      <h6 className="font-normal text-[14px] text-black">
                        {selectEvent?.type}
                      </h6>
                    </div>
                    <div className="flex items-center gap-5 w-full mb-[12px]">
                      <p className="text-[#212B36] text-[14px] font-medium w-full max-w-[140px]">{t("calendarSchedules.clientNameId")}</p>
                      <h6 className="font-normal text-[14px] text-black">
                        {
                          selectEvent?.[
                            userType === "client-hobbyist"
                              ? "companionId"
                              : "clientId"
                          ]?.name
                        }{" "}
                        <span className="uppercase">
                          (
                          {
                            selectEvent?.[
                              userType === "client-hobbyist"
                                ? "companionId"
                                : "clientId"
                            ]?.vaiID
                          }
                          )
                        </span>
                      </h6>
                    </div>
                    <div className="flex items-center gap-5 w-full mb-[8px]">
                      <p className="text-[#212B36] text-[14px] font-medium w-full max-w-[140px]">{t("calendarSchedules.description")}</p>
                      <h6 className="font-normal text-[14px] text-black">
                        {selectEvent?.title}
                      </h6>
                    </div>
                    <div className="flex items-center gap-5 w-full mb-[8px]">
                      <p className="text-[#212B36] text-[14px] font-medium w-full max-w-[140px]">{t("calendarSchedules.startTime")}</p>
                      <h6 className="font-normal text-[14px] text-black">
                        {new Date(selectEvent?.startDateTime).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                          timeZone: 'UTC'
                        }).replace(',', ' -')}
                      </h6>
                    </div>
                    <div className="flex items-center gap-5 w-full mb-[8px]">
                      <p className="text-[#212B36] text-[14px] font-medium w-full max-w-[140px]">{t("calendarSchedules.endTime")}</p>
                      <h6 className="font-normal text-[14px] text-black">
                        {new Date(selectEvent?.endDateTime).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                          timeZone: 'UTC'
                        }).replace(',', ' -')}
                      </h6>
                    </div>
                    {/* <div className="w-full mx-auto flex flex-row justify-between items-center gap-2 relative py-2 calendar-picker ">
                      <DatePicker
                        showIcon
                        showTimeSelect
                        dateFormat="P"
                        selected={selectEvent?.start}
                        // onChange={(date) => setStartDate(date)}
                        customInput={<CustomInput />}
                      />
                      <div className="calendar-picker-divider"></div>
                      <DatePicker
                        showIcon
                        showTimeSelect
                        dateFormat="p"
                        selected={selectEvent?.start}
                        // onChange={(date) => setStartDate(date)}
                        customInput={<CustomInput />}
                      />
                    </div> */}
                  </div>
                  <Button text={t("calendarSchedules.view")} onClick={() => navigateToviewall(selectEvent)} className={'secondary-btn !mt-[24px] sm:mt-auto'} />
                </div>
              </Modal>
            </div>
            {/* <div className="mt-6 w-[218px]">
                    <Button text="Calendar" className='font-bold text-[23.4px] text-[#040C50]'/>
                </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
