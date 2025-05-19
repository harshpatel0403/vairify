import { useEffect, useRef, useState } from "react";
import { ChatCenteredDots, House, BellRinging, Storefront, Gear } from "phosphor-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import NotificationServices from "../../services/NotificationServices";
import organizeNotificationsByDay from "../../Ultis/notifications";
import Loading from "../Loading/Index";

const tabbar = [
  { label: 'Home', icon: House, path: '/featured' },
  { label: 'Notification', icon: BellRinging, path: '/notifications' },
  { label: 'Market', icon: Storefront, path: '/marketplace' },
  { label: 'Chat', icon: ChatCenteredDots, path: '/chat-log' },
  { label: 'Setting', icon: Gear, path: '/settings' }
];

function BottomTabbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [notificationCount, setNotificationCount] = useState(0);
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const AuthToken = useSelector((state) => state?.Auth?.Auth?.data?.token);
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (UserDetails?._id !== undefined) {
      fetchNotificationData();
    }
  }, [])

  const fetchNotificationData = async () => {
    setLoading(true);
    await NotificationServices.getAllNotifications(UserDetails?._id)
      .then((res) => {
        const unreadNotifications = res?.filter((item) => item?.read === false)?.length;
        const { reducedCount } = organizeNotificationsByDay(res);
        const totalCount = unreadNotifications - reducedCount;
        setNotificationCount(totalCount > 0 ? totalCount : 0);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }
  useEffect(() => {

    setTokenAvailable(!!AuthToken);
    if (!!AuthToken) {

      fetchNotificationData();
    }
  }, [AuthToken]);
  const handleTabClick = (tabPath) => {
    navigate(tabPath);
  };


  return (
    <div className="md:hidden flex justify-between items-center w-full pt-[16px] pb-[24px] px-[16px] fixed bottom-0 left-0 bg-[#00053A] z-[998]">
      <div className="flex items-center justify-between w-full">
        {tabbar.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = path.startsWith(tab.path);
          const isNotificationTab = tab.path === '/notifications';

          return (
            <button
              key={index}
              onClick={() => handleTabClick(tab.path)}
              className={`
                relative flex flex-col items-center w-[68px] text-[8px] font-normal transition-all duration-200
                ${isActive ? 'text-white' : 'text-[#5D6782] before:opacity-0'}
              `}
            >
              <Icon
                weight={isActive ? 'fill' : 'regular'}
                className={`w-6 h-6 mb-1 ${isActive ? 'text-white' : 'text-[#5D6782]'}`}
              />
              {isNotificationTab && tokenAvailable && notificationCount > 0 && (
                <div
                  className="absolute top-[-2px] xl:right-[46px] lg:right-[30px] right-[20px] h-[16px] w-[16px] rounded-full bg-[#008F34] flex justify-center items-center text-[10px] text-white"
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </div>
              )}

              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  );
}

export default BottomTabbar;
