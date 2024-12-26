import React, { Children, cloneElement, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { views } from "react-big-calendar/lib/utils/constants"; // Import 'views' separately from the constants module
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../../components/Button";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { Select, MenuItem } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
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

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#3760CB",
    width: "90vw",
    // height: "421px",
    zIndex: 20,
    borderRadius: "30px",
    border: "2px solid black",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
    padding: "20px 15px",
    overflow: "auto",
    maxWidth: "500px",
  },
};

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
          className="form-control"
          onClick={props.onClick}
          value={props.value}
          onChange={props.onChange}
        />
        <div className="input-group-append">
          <span className="input-group-text">
            <FontAwesomeIcon icon={faCalendar} />
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
          className={`border-2 w-full min-w-fit border-[#000000] pl-3 pr-3 h-[48px] font-bold text-[23.4px] text-[#000000]
          ${view === views.MONTH && "bg-[#D9D9D9]"}`}
          onClick={() => {
            onView(views.MONTH);
            setStartDate(new Date()); // Reset to current month
          }}
          disabled={view === views.MONTH}
        >
          Month
        </button>
        <button
          className={`border-2 w-full min-w-fit border-[#000000] pl-3 pr-3 h-[48px] font-bold text-[23.4px] text-[#000000]
          ${view === views.WEEK && "bg-[#D9D9D9]"}`}
          onClick={() => {
            goToWeekView();
          }}
          disabled={view === views.WEEK}
        >
          Week
        </button>
        <button
          className={`border-2 w-full min-w-fit border-[#000000] pl-3 pr-3 h-[48px] font-bold text-[23.4px] text-[#000000]'
          ${view === views.DAY && "bg-[#D9D9D9]"}`}
          onClick={goToDayView}
          disabled={view === views.DAY}
        >
          Day
        </button>
        <button
          className={`border-2 w-full min-w-fit border-[#000000] pl-3 pr-3 h-[48px] font-bold text-[23.4px] text-[#000000]
          ${view === views.AGENDA && "bg-[#D9D9D9]"}`}
          onClick={() => {
            const startOfMonth = new Date(startDate);
            startOfMonth.setDate(1); // Start of the current month
            onView(views.AGENDA, startDate); // Switch to Agenda view
            setStartDate(startOfMonth);
          }}
          disabled={view === views.AGENDA}
        >
          Agenda
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
    <div className="main- px-0">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="w-full mx-auto flex flex-row p-2 justify-between items-center">
          <div
            className="w-[30px] cursor-default text-white text-lg rounded-md font-[700] grid place-items-center border-2 border-white"
            onClick={() => changeMonth("prev")}
          >
            &lt;
          </div>
          <div className="flex items-center">
            <div>
              <div className="font-[700] text-white text-[24px]">
                {format(startDate, "MMMM")}
              </div>
              <div className="font-[700] text-white text-[24px]">
                {format(startDate, "yyyy")}
              </div>
            </div>
            <Link to={"/schedule"}>
              <FontAwesomeIcon
                icon={faPenToSquare}
                color="#fff"
                className="text-3xl pl-2"
              />
            </Link>
          </div>
          <div
            className="w-[30px] cursor-default text-white text-lg rounded-md font-[700] grid place-items-center border-2 border-white"
            onClick={() => changeMonth("next")}
          >
            &gt;
          </div>
        </div>
        <div className="bg-[#3760CB] px-4 max-[500px]:px-0 w-full">
          <div className="bg-white w-full">
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
                height: 650,
                width: "100%",
                backgroundColor: "white",
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
              style={customStyles}
              contentLabel="Example Modal"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2"
              >
                <img
                  src="/images/Mask group-close.png"
                  alt=""
                  width="30px"
                  height="30px"
                />
              </button>
              <div className="w-full mx-auto flex flex-col justify-start items-center">
                <div className="w-full mx-auto flex flex-row justify-between items-center px-8 gap-[7px]">
                  <div className="flex flex-col justify-center items-start">
                    <div>
                      <span className="font-bold text-[18px] text-white">
                        Appt ID# {selectEvent?.id}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-[18px] text-white">
                        {UserDetails?.user_type}
                      </span>
                    </div>
                  </div>
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
                <div className="w-full mx-auto h-[3px] bg-[#F5F6F7] mt-6"></div>
                <div className="w-full mx-auto flex flex-row justify-start items-center px-8 py-4">
                  <button>
                    <div className="flex justify-start items-center">
                      <img
                        src={"/images/CalendarModalLocation.png"}
                        alt="Calendar Modal Location"
                      />
                    </div>
                  </button>
                  <div className="ml-6">
                    <span className="font-bold text-[16px] text-white">
                      {selectEvent?.type}
                    </span>
                  </div>
                </div>
                <div className="w-full mx-auto h-[3px] bg-[#F5F6F7]"></div>
                <div className="w-full mx-auto flex flex-row justify-between items-center relative px-7 py-2">
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
                </div>
                <div className="w-full mx-auto h-[3px] bg-[#F5F6F7]"></div>
                <div className="w-full mx-auto flex flex-row justify-start items-center relative px-7 py-2">
                  <img
                    src={"/images/CalendarPersons.png"}
                    alt="Calendar Persons"
                  />
                  <span className="ml-6 font-bold text-[16px] text-white">
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
                  </span>
                </div>
                <div className="w-full mx-auto h-[3px] bg-[#F5F6F7]"></div>
                <div className="w-full mx-auto flex flex-row justify-start items-center relative px-7 py-3">
                  <img
                    src={"/images/CalendarEditIcon.png"}
                    alt="Calendar Edit Icons"
                  />
                  <span className="ml-6 font-bold text-[16px] text-white">
                    {selectEvent?.title}
                  </span>
                </div>
                <div className="w-full mx-auto flex flex-row justify-around items-center mt-2">
                  <button
                    onClick={() => navigateToviewall(selectEvent)}
                    className="w-[144px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[18px] text-[#040C50] py-1 border-gray-100 border-2"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </Modal>
          </div>
          {/* <div className="mt-6 w-[218px]">
                    <Button text="Calendar" className='font-bold text-[23.4px] text-[#040C50]'/>
                </div> */}
        </div>
      </div>
    </div>
  );
}
