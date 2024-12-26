import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotificationServices from "../../services/NotificationServices";

export default function Footer({ bgColor }) {
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const AuthToken = useSelector((state) => state?.Auth?.Auth?.data?.token);
  // const notificationCount = useSelector((state) => state?.Auth?.notificationCount);
  const [notificationCount, setNotificationCount] = useState(0);
  const [tokenAvailable, setTokenAvailable] = useState(false);


  const fetchNotificationData = async () => {

    await NotificationServices.getAllNotifications(UserData?._id)
      .then((res) => {
        const notificationData = res?.filter((item) => item?.read === false)?.length;
        setNotificationCount(notificationData)
      })
      .catch((error) => console.log(error));
  }
  fetchNotificationData();
  useEffect(() => {

    setTokenAvailable(!!AuthToken);
  }, [AuthToken]);

  const navigateHome = (e) => {
    e.preventDefault();
    navigate("/featured");
  };
  const navigateNotification = (e) => {
    e.preventDefault();
    navigate("/notifications");
  };
  const navigateMarketplace = (e) => {
    e.preventDefault();
    navigate("/marketplace");
  };
  const naviageLogs = (e) => {
    e.preventDefault();
    navigate("/chat-log");
  };
  const navigateSettings = (e) => {
    e.preventDefault();
    navigate("/settings");
  };

  return (
    <div
      className={`bottom-group-container flex flex-row justify-around items-center
    bg-[${bgColor}]
    text-3xl text-white text-center
    fixed
    inset-x-0
    bottom-0
    m-0
    p-3`}
    >
      <div>
        <button disabled={!tokenAvailable}>
          <img
            onClick={(e) => navigateHome(e)}
            src={"/images/BottomNav1.png"}
            alt="Bottom Nav 1"
          />
        </button>
      </div>
      <div className="relative">
        <button
          onClick={(e) => navigateNotification(e)}
          disabled={!tokenAvailable}
        >
          <img src={"/images/BottomNav2.png"} alt="Bottom Nav 2" />
        </button>
        {tokenAvailable ? (
          <span
            className="absolute top-[-4px] right-[-8px]"
            style={{
              width: "22px",
              height: "22px",
              backgroundColor: "#fc677d",
              borderRadius: "50%",
              color: "white",
              fontSize: "12px",
              fontWeight: "700",
              lineHeight: "8.79px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        ) : (
          <></>
        )}
      </div>
      <div>
        <button
          onClick={(e) => navigateMarketplace(e)}
          disabled={!tokenAvailable}
        >
          <img src={"/images/BottomNav3.png"} alt="Bottom Nav 3" />
        </button>
      </div>
      <div>
        <button onClick={(e) => naviageLogs(e)} disabled={!tokenAvailable}>
          <img src={"/images/BottomNav4.png"} alt="Bottom Nav 4" />
        </button>
      </div>
      <div>
        <button onClick={(e) => navigateSettings(e)} disabled={!tokenAvailable}>
          <img src={"/images/BottomNav5.png"} alt="Bottom Nav 5" />
        </button>
      </div>
    </div>
  );
}
