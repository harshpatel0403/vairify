import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationServices from "../../../services/NotificationServices";
import { useSelector } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import organizeNotificationsByDay from "../../../Ultis/notifications";
import SelectBox from "../../../components/SelectBox";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Loading from "../../../components/Loading/Index";
import BottomTabbar from "../../../components/BottomTabbar/BottomTabbar";
import PageTitle from "../../../components/PageTitle";

export default function Notifications() {
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [notifications, setNotifications] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (UserData?._id) {
      setLoading((notifications?.length > 0 || parsedData?.length > 0) ? false : true);
      NotificationServices.getAllNotifications(UserData?._id)
        .then((res) => {
          setNotifications(res?.slice(0, 100));
          const { organizedNotifications } = organizeNotificationsByDay(res?.slice(0, 100));
          setParsedData(organizedNotifications);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  }, [UserData]);

  const currencyOptions = [
    "All",
    "VAIRIFY_NOW",
    "LOCATION_REQUEST",
    "VAIRIPAY",
    "MARKETPLACE_FEED_POST",
    "APPOINTMENT_REQUEST",
    "INVITATION_REQUEST",
    "CHAT",
    "TRUREVU"
  ];

  const getNotificationIcon = (notification) => {
    switch (notification?.type) {
      case "VAIRIFY_NOW":
        return "/images/notifications/1-varify-now.svg";
      case "LOCATION_REQUEST":
        return "/images/notifications/2-location.svg";
      case "VAIRIPAY":
        return "/images/notifications/3-vairpay.svg";
      case "MARKETPLACE_FEED_POST":
        return "/images/notifications/4-marketplace.svg";
      case "APPOINTMENT_REQUEST":
        return "/images/notifications/5-appointment-request.svg";
      case "INVITATION_REQUEST":
        return "/images/notifications/6-invitation-request.svg";
      case "CHAT":
        return "/images/home/comment.svg";
      case "TRUREVU":
        return "/images/png/find-friend.png";
      default:
        return "";
    }
  };

  useEffect(() => {
    let filtered = notifications;

    if (filterText) {
      filtered = filtered.filter(
        (item) =>
          item?.senderId?.name?.toLowerCase()?.includes(filterText.toLowerCase()) ||
          item?.senderId?.vaiID?.toLowerCase()?.includes(filterText.toLowerCase()) &&
          (selectedType === "All" ? true : item?.type === selectedType)
      );
    }

    if (selectedType !== "All") {
      filtered = filtered.filter((item) => item?.type === selectedType);
    }


    const { organizedNotifications } = organizeNotificationsByDay(filtered);
    setParsedData(organizedNotifications);
  }, [filterText, selectedType, notifications]);


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

  if (loading) {
    return (
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
      </div>
    )
  }
  else {
    return (
      <>

        <div className="container">
          <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
            <PageTitle title={"Notifications"} />
          </div>
          <div className="max-w-[800px] mx-auto">
            <div className="w-full flex flex-row justify-between items-center gap-[16px]">
              <div className="w-full relative">
                <input
                  placeholder="Name or Id#"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full border-2 border-[#919EAB33] rounded-[8px] py-[10px] pl-[40px] pr-[14px] bg-transparent text-white font-normal text-[14px]"
                />
                <FontAwesomeIcon icon={faSearch} color="#fff" className="absolute top-[15px] z-[10] left-[14px]" />
              </div>
              <div className="sm:w-fit w-[50%] relative ">
                <SelectBox
                  options={currencyOptions}
                  className1="text-[14px] font-normal border border-[#919EAB33] w-[100%] rounded-[8px] sm:!w-fit !bg-[#FFFFFF14] "
                  size={"h-[44px]"}
                  textAlign={"text-left"}
                  fontWeight={"font-bold"}
                  textColor={"text-white"}
                  textSize={"text-[14px]"}
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                />
              </div>

            </div>

            <div className="w-full flex flex-col justify-between items-left mt-4 mb-8">
              {parsedData && parsedData.length > 0 ? (
                parsedData?.map((item) => {
                  return (
                    <>
                      <div className="mt-2 text-base text-white font-medium">
                        {moment().format("YYYY-MM-DD") === item?.date
                          ? "Today"
                          : item?.date}
                      </div>
                      {item?.notifications?.map((notification, index) => {
                        return (

                          <div
                            key={index}
                            className="mt-[8px] w-full gap-[16px] flex flex-row rounded-[8px] items-center text-[#fff] bg-[#FFFFFF14] justify-between sm:p-[16px] p-[10px]"
                            onClick={() => handleNavigate(notification)}
                          >
                            <div className="flex gap-[16px] items-center w-full">
                              <div className="rounded-full sm:min-w-[46px] min-w-[40px] sm:min-h-[46px] min-h-[40px] sm:max-w-[46px] max-w-[40px] sm:max-h-[46px] max-h-[40px] overflow-hidden">
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
                                  alt="profile"
                                  className="object-cover h-[46px] w-[46px]"
                                />
                              </div>
                              <div className="w-full">
                                <div className="text-base text-white font-semibold">
                                  {notification?.title}
                                </div>
                                <div className="text-sm text-[#919EAB] font-normal">
                                  {notification?.description}
                                </div>
                              </div>
                            </div>
                            <div className="flex sm:gap-[16px] gap-[8px] items-center">
                              <div className="flex flex-col items-end sm:w-[50px] w-[45px]">
                                <div className="relative">
                                  <img
                                    className="max-w-[25px] max-h-[25px] mb-1"
                                    src={getNotificationIcon(notification)}
                                    alt="Congratulations"
                                  />
                                  {notification?.read === false && (
                                    <div className="absolute top-[0px] right-0 h-[7px] w-[7px] rounded-full bg-[#008F34]"></div>
                                  )}
                                </div>
                                <div className="text-[10px] font-bold whitespace-nowrap text-[#919EAB]">
                                  {" "}
                                  {moment(notification?.createdAt)?.format(
                                    "h:mm a"
                                  )}{" "}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                })) :
                (
                  <div className="flex flex-col items-center justify-center w-full my-[48px]">
                    <img src="/images/notifications/no-notifications.svg" alt="no notification" />
                    <p className="text-center text-lg font-medium text-white mt-[24px]">No notifications Yet</p>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className="sm:pb-0 pb-[80px]"></div>
        <BottomTabbar />
      </>
    );
  }
}
