import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import Selecter from "../../../components/Selecter/Selecter";
import NotificationServices from "../../../services/NotificationServices";
import { useSelector } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function Notifications() {
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const [notifications, setNotifications] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");

  useEffect(() => {
    if (UserData?._id) {
      NotificationServices.getAllNotifications(UserData?._id)
        .then((res) => {
          setNotifications(res);
        })
        .catch((error) => console.log(error));
    }
  }, [UserData]);



  const navigateToDateGuardCode = () => {
    navigate("/varidate/invitations-list");
  };
  const currencyOptions = [
    "ALL",
    "VAIRIFY_NOW",
    "LOCATION_REQUEST",
    "VAIRIPAY",
    "MARKETPLACE_FEED_POST",
    "APPOINTMENT_REQUEST",
    "INVITATION_REQUEST",
    "CHAT",
    "TRUREVU"
  ];

  function organizeNotificationsByDay(notifications) {
    const organizedNotifications = [];

    notifications?.forEach((notification) => {
      const createdAt = moment(notification.createdAt);
      const dateKey = createdAt.format("YYYY-MM-DD");

      let existingEntry = organizedNotifications.find((entry) => entry.date === dateKey);
      if (!existingEntry) {
        existingEntry = {
          date: dateKey,
          notifications: [],
        };
        organizedNotifications.push(existingEntry);
      }

      const reduceNotification = (type) => {
        const senderId = notification?.senderId?._id;

        const existingNotification = existingEntry.notifications.find(
          (n) => n.type === type && n.senderId?._id === senderId
        );

        if (
          !existingNotification ||
          moment(notification.createdAt).isAfter(moment(existingNotification.createdAt))
        ) {
          if (existingNotification) {
            existingEntry.notifications = existingEntry.notifications.filter(
              (n) => !(n.type === type && n.senderId?._id === senderId)
            );
          }
          existingEntry.notifications.push(notification);
        }
      };

      if (notification.type === "CHAT") {
        reduceNotification("CHAT");
      }
      else {
        existingEntry.notifications.push(notification);
      }
    });

    organizedNotifications.forEach((entry) => {
      entry.notifications.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
    });

    organizedNotifications.sort((a, b) => {
      if (a.date === moment().format("YYYY-MM-DD")) return -1; // Today comes first
      if (b.date === moment().format("YYYY-MM-DD")) return 1;  // Today comes first
      return moment(b.date).diff(moment(a.date));
    });

    return organizedNotifications;
  }


  const getNotificationIcon = (notification) => {
    switch (notification?.type) {
      case "VAIRIFY_NOW":
        return "/images/1-varify-now.svg";
      case "LOCATION_REQUEST":
        return "/images/2-location.svg";
      case "VAIRIPAY":
        return "/images/3-vairpay.svg";
      case "MARKETPLACE_FEED_POST":
        return "/images/4-marketplace.svg";
      case "APPOINTMENT_REQUEST":
        return "/images/5-appointment-request.svg";
      case "INVITATION_REQUEST":
        return "/images/6-invitation-request.svg";
      case "CHAT":
        return "/images/7-chat.svg";
      case "TRUREVU":
        return "/images/png/find-friend.png";
      default:
        return "";
    }
  };

  useEffect(() => {
    setParsedData(organizeNotificationsByDay(notifications));
  }, [notifications]);

  useEffect(() => {
    if (filterText) {
      setParsedData(
        organizeNotificationsByDay(
          notifications?.filter(
            (item) =>
              (item?.senderId?.name
                ?.toLowerCase()
                ?.includes(filterText?.toLowerCase()) ||
                item?.senderId?.vaiID
                  ?.toLowerCase()
                  ?.includes(filterText?.toLowerCase())) &&
              (selectedType === "ALL" ? true : item?.type === selectedType)
          )
        )
      );
    } else {
      setParsedData(
        organizeNotificationsByDay(
          notifications?.filter((item) =>
            selectedType === "ALL" ? true : selectedType === item?.type
          )
        )
      );
    }
  }, [filterText, selectedType]);

  const handleNavigate = async (notification) => {
    await NotificationServices.markNotification(notification._id);
    await NotificationServices.getAllNotifications(UserData?._id)
      .then((res) => {
        setNotifications(res);
      })
      .catch((error) => console.log(error));
    if (notification?.type === "CHAT") {
      navigate(`/chat/${notification.senderId._id}`)
    }
  }

  return (
    <div className="main-container p-0 pb-6">
      <div className="flex flex-col justify-center items-center pt-custom-24 mx-auto">
        <div className="text-custom-13 text-[#000000]">
          <span>Notifications </span>
        </div>
      </div>
      <div className="max-w-[500px] flex flex-col justify-center items-center mx-auto px-6">
        <div className="w-full flex flex-row justify-between items-center border-b-[1px] border-[#000000] pb-2 mt-4">
          <div className="w-[100px] flex flex-col justify-center items-center border-[1px] border-[#000000] pl-2 pr-6 rounded-[5px] font-bold text-[14px]">
            <Selecter
              options={currencyOptions}
              className="text-[8px] text-right font-bold text-[#000000] txt-custom-color-4 shadow-none focus-visible:border-0 focus-visible:border-white px-1 !py-0"
              textSize="8px"
              textColor="#000"
              size={"20px"}
              py={"0"}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            />
          </div>
          <div className="w-[160px] flex flex-col justify-center items-center">
            <span className="text-[14px] font-bold text-[#000000]">
              Time/Date
            </span>
          </div>
          <div className="w-[100px] flex flex-col justify-center items-center">
            <input
              placeholder="Name or Id#"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="text-[14px] w-[100px] font-bold text-[#000000] border-[1px] border-[#000000] px-1 rounded-[5px]"
            />

            {/* </input> */}
          </div>
        </div>

        <div className="w-full flex flex-col justify-between items-left mt-4">
          {parsedData?.map((item) => {
            return (
              <>
                <div className="mt-2 text-[17px] font-Roboto-Serif font-bold w-[100%] g-[100px] flex flex-col text-left items-left border-b-[1px] border-[#000000] mb-1">
                  {moment().format("YYYY-MM-DD") === item?.date
                    ? "Today"
                    : item?.date}
                </div>
                {item?.notifications?.map((notification, index) => {
                  return (

                    <div
                      key={index}
                      className="mt-1 w-full gap-[15px] flex flex-row rounded-full items-center text-[#fff] bg-[#3760CB] justify-between items-left border-[3px] border-[#01195C] p-1"
                      onClick={() => handleNavigate(notification)}
                    >
                      <div className="rounded-full border-[2px] border-[#fff] min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] overflow-hidden">
                        <img
                         src={
                          notification?.senderId?.profilePic
                            ? import.meta.env
                              .VITE_APP_S3_IMAGE +
                            `/${notification?.senderId?.profilePic}`
                            : notification?.senderId?.gender === "Male"
                              ? "/images/male.png"
                              : "/images/female.png"
                        }
                          // src={
                          //   notification?.senderId?.profilePic
                          //     ? import.meta.env
                          //       .VITE_APP_API_USERPROFILE_IMAGE_URL +
                          //     `/${notification?.senderId?.profilePic}`
                          //     : notification?.senderId?.gender === "Male"
                          //       ? "/images/male.png"
                          //       : "/images/female.png"
                          // }
                          alt="Congratulations"
                        />
                      </div>
                      <div className="min-w-[150px] flex flex-col">
                        <span className="text-[12px] text-left font-bold font-Roboto-Serif">
                          {notification?.title}
                        </span>
                        <span className="text-[10px] text-left font-[400] font-Roboto-Serif">
                          {notification?.description}
                        </span>
                      </div>
                      {notification?.read === true && (
                        <div className="min-w-[0px] flex flex-col">
                          <FontAwesomeIcon icon={faCheckCircle} color="lightgreen" />
                        </div>
                      )}
                      <div className="flex flex-col pr-3  items-center">
                        <span className="text-[14px] font-bold">
                          <img
                            className="max-w-[25px] max-h-[25px] mb-1"
                            src={getNotificationIcon(notification)}
                            alt="Congratulations"
                          />
                        </span>
                        <span className="text-[10px] font-bold">
                          {" "}
                          {moment(notification?.createdAt)?.format(
                            "h:mm a"
                          )}{" "}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            );
          })}

          {/* <div className="mt-1 w-full gap-[15px] flex flex-row rounded-full items-center text-[#fff] bg-[#3760CB] justify-between items-left border-[3px] border-[#01195C] p-1">
                        <div className="rounded-full border-[2px] border-[#fff] w-[60px] h-[60px] overflow-hidden">
                            <img src={"/images/Gallery1.png"} alt="Congratulations" />
                        </div>
                        <div className="min-w-[150px] flex flex-col">
                            <span className="text-[18px] font-bold font-Roboto-Serif"> SUGAR </span>
                            <span className="text-[10px] font-[500] font-Roboto-Serif"> VAIRIFY ID 5SES168 </span>
                        </div>
                        <div className="flex flex-col pr-3">
                            <span className="text-[14px] font-bold">
                                <img className="max-w-[45px] max-h-[30px] mb-1" src={"/images/1-varify-now.svg"} alt="Congratulations" />
                            </span>
                            <span className="text-[10px] font-bold"> 1:31pm </span>
                        </div>
                    </div>

                    <div className="mt-1 w-full gap-[15px] flex flex-row rounded-full items-center text-[#fff] bg-[#3760CB] justify-between items-left border-[3px] border-[#01195C] p-1">
                        <div className="rounded-full border-[2px] border-[#fff] w-[60px] h-[60px] overflow-hidden">
                            <img src={"/images/Gallery2.png"} alt="Congratulations" />
                        </div>
                        <div className="min-w-[150px] flex flex-col">
                            <span className="text-[18px] font-bold font-Roboto-Serif"> Crystal </span>
                            <span className="text-[10px] font-[500] font-Roboto-Serif"> VAIRIFY ID 5SES168 </span>
                        </div>
                        <div className="flex flex-col pr-3">
                            <span className="text-[14px] font-bold">
                                <img className="max-w-[45px] max-h-[30px] mb-1" src={"/images/2-location.svg"} alt="Congratulations" />
                            </span>
                            <span className="text-[10px] font-bold"> 1:31pm </span>
                        </div>
                    </div>

                    <div className="mt-1 w-full gap-[15px] flex flex-row rounded-full items-center text-[#fff] bg-[#3760CB] justify-between items-left border-[3px] border-[#01195C] p-1">
                        <div className="rounded-full border-[2px] border-[#fff] w-[60px] h-[60px] overflow-hidden">
                            <img src={"/images/Gallery3.png"} alt="Congratulations" />
                        </div>
                        <div className="min-w-[150px] flex flex-col">
                            <span className="text-[18px] font-bold font-Roboto-Serif"> Melody </span>
                            <span className="text-[10px] font-[500] font-Roboto-Serif"> VAIRIFY ID 5SES168 </span>
                        </div>
                        <div className="flex flex-col pr-3">
                            <span className="text-[14px] font-bold">
                                <img className="max-w-[45px] max-h-[30px] mb-1" src={"/images/3-vairpay.svg"} alt="Congratulations" />
                            </span>
                            <span className="text-[10px] font-bold"> 1:31pm </span>
                        </div>
                    </div>

                    <div className="mt-2 text-[17px] font-Roboto-Serif font-bold w-[100%] g-[100px] flex flex-col text-left items-left border-b-[1px] border-[#000000] mb-1">
                        7/24/23
                    </div>

                    <div className="mt-1 w-full gap-[15px] flex flex-row rounded-full items-center text-[#fff] bg-[#3760CB] justify-between items-left border-[3px] border-[#01195C] p-1">
                        <div className="rounded-full border-[2px] border-[#fff] w-[60px] h-[60px] overflow-hidden">
                            <img src={"/images/Gallery4.png"} alt="Congratulations" />
                        </div>
                        <div className="min-w-[150px] flex flex-col">
                            <span className="text-[18px] font-bold font-Roboto-Serif"> Amori Love </span>
                            <span className="text-[10px] font-[500] font-Roboto-Serif"> VAIRIFY ID 5SES168 </span>
                        </div>
                        <div className="flex flex-col pr-3">
                            <span className="text-[14px] font-bold">
                                <img className="max-w-[45px] max-h-[30px] mb-1" src={"/images/4-marketplace.svg"} alt="Congratulations" />
                            </span>
                            <span className="text-[10px] font-semibold"> 3:31pm </span>
                        </div>
                    </div>

                    <div className="mt-1 w-full gap-[15px] flex flex-row rounded-full items-center text-[#fff] bg-[#3760CB] justify-between items-left border-[3px] border-[#01195C] p-1">
                        <div className="rounded-full border-[2px] border-[#fff] w-[60px] h-[60px] overflow-hidden">
                            <img src={"/images/Gallery5.png"} alt="Congratulations" />
                        </div>
                        <div className="min-w-[150px] flex flex-col">
                            <span className="text-[18px] font-bold font-Roboto-Serif"> Pedal </span>
                            <span className="text-[10px] font-[500] font-Roboto-Serif"> VAIRIFY ID 5SES168 </span>
                        </div>
                        <div className="flex flex-col pr-3">
                            <span className="text-[14px] font-bold">
                                <img className="max-w-[45px] max-h-[30px] mb-1" src={"/images/5-appointment-request.svg"} alt="Congratulations" />
                            </span>
                            <span className="text-[10px] font-semibold"> 3:31pm </span>
                        </div>
                    </div>

                    <div className="mt-1 w-full gap-[15px] flex flex-row rounded-full items-center text-[#fff] bg-[#3760CB] justify-between items-left border-[3px] border-[#01195C] p-1">
                        <div className="rounded-full border-[2px] border-[#fff] w-[60px] h-[60px] overflow-hidden">
                            <img src={"/images/Gallery6.png"} alt="Congratulations" />
                        </div>
                        <div className="min-w-[150px] flex flex-col">
                            <span className="text-[18px] font-bold font-Roboto-Serif"> Princess Stone </span>
                            <span className="text-[10px] font-[500] font-Roboto-Serif"> VAIRIFY ID 5SES168 </span>
                        </div>
                        <div className="flex flex-col pr-3">
                            <span className="text-[14px] font-bold">
                                <img className="max-w-[45px] max-h-[30px] mb-1" src={"/images/6-invitation-request.svg"} alt="Congratulations" />
                            </span>
                            <span className="text-[10px] font-semibold"> 3:31pm </span>
                        </div>
                    </div>

                    <div className="mt-1 w-full gap-[15px] flex flex-row rounded-full items-center text-[#fff] bg-[#3760CB] justify-between items-left border-[3px] border-[#01195C] p-1">
                        <div className="rounded-full border-[2px] border-[#fff] w-[60px] h-[60px] overflow-hidden">
                            <img src={"/images/Gallery7.png"} alt="Congratulations" />
                        </div>
                        <div className="min-w-[150px] flex flex-col">
                            <span className="text-[18px] font-bold font-Roboto-Serif"> Myely </span>
                            <span className="text-[10px] font-[500] font-Roboto-Serif"> VAIRIFY ID 5SES168 </span>
                        </div>
                        <div className="flex flex-col pr-3">
                            <span className="text-[14px] font-bold">
                                <img className="max-w-[45px] max-h-[30px] mb-1" src={"/images/7-chat.svg"} alt="Congratulations" />
                            </span>
                            <span className="text-[10px] font-semibold"> 3:31pm </span>
                        </div>
                    </div> */}
        </div>
      </div>
    </div>
  );
}
