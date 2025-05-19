/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import IconButton from "../../components/IconButton";
import { useLocation, useNavigate } from "react-router-dom";
import { HandleUser } from "../../redux/action/Auth";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../services/userServices";
import { House, BellSimple, Storefront, Gear, ChatCircleText } from "phosphor-react";
import BackButton from "../../components/BackButton/backArrowButton";
import NotificationServices from "../../services/NotificationServices";
import organizeNotificationsByDay from "../../Ultis/notifications";

import { logout } from "../../redux/action/logout";
export default function Header({ onClick, bgColor }) {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [tokens, setTokens] = useState(0);
  const AuthToken = useSelector((state) => state?.Auth?.Auth?.data?.token);
  const [showDropDown, setShowDropDown] = useState(false);
  const dropdownRef = useRef(null);
  const [isActiveSideBar, setTsActiveSideBar] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [tokenAvailable, setTokenAvailable] = useState(false);

  useEffect(() => {
    if (UserDetails?._id !== undefined) {
      fetchNotificationData();
    }
  }, [])

  const fetchNotificationData = async () => {
    await NotificationServices.getAllNotifications(UserDetails?._id)
      .then((res) => {
        const unreadNotifications = res?.filter((item) => item?.read === false)?.length;
        const { reducedCount } = organizeNotificationsByDay(res);
        const totalCount = unreadNotifications - reducedCount;
        setNotificationCount(totalCount > 0 ? totalCount : 0);
      })
      .catch((error) => console.log(error));
  }
  useEffect(() => {

    setTokenAvailable(!!AuthToken);
    if (!!AuthToken) {

      fetchNotificationData();
    }
  }, [AuthToken]);


  const goBack = () => {
    if (path.startsWith("/dateguard/password-input")) {
      return navigate("/dateguard/codes");
    }
    if (path.startsWith("/dateguard/codes")) {
      return navigate("/dateguard-setup");
    }
    if (path.startsWith("/dateguard/select-group")) {
      return navigate("/dateguard-setup");
    }
    if (path.startsWith("/dateguard/set-time-alarm")) {
      return navigate("/dateguard-setup");
    }
    if (path.startsWith("/dateguard/edit-group")) {
      return navigate("/dateguard/select-group");
    }
    if (path.startsWith("/dateguard/select-appointment")) {
      return navigate("/dateguard-setup");
    }
    if (path.startsWith('/marketplace/post/review')) {
      return navigate('/my-calendar', { state: location?.state })
    }

    navigate(-1, { state: location.state });
  };
  useEffect(() => {
    if (path.includes("/post") && UserDetails) {
      dispatch(HandleUser(UserDetails?._id));
    }
  }, []);

  useEffect(() => {
    if (UserDetails?._id) {
      getTokens()
    }
  }, [UserDetails?._id]);

  const getTokens = () => {
    UserService.getUserTokens(UserDetails?._id)
      .then((res) => {
        setTokens(res.tokens);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const pageWithHiddenLogo = [
    "/vairipay-request",
    "/service-business/add-staff",
  ];
  const hideBurgerRoutes = ["/login", "/language", "/selectcategory", "/signup"];


  const tabbar = [
    { label: 'Home', icon: House, path: '/featured' },
    { label: 'Notification', icon: BellSimple, path: '/notifications' },
    { label: 'Market', icon: Storefront, path: '/marketplace' },
    { label: 'Chat', icon: ChatCircleText, path: '/chat-log' },
    { label: 'Setting', icon: Gear, path: '/settings' }
  ];
  const handleTabClick = (tabPath) => {
    navigate(tabPath);
  };
  const handleShowDropDown = (e) => {
    // e.stopPropagation();
    setShowDropDown((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropDown(false);
    }
  };
  useEffect(() => {
    if (showDropDown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropDown]);

  const sideBarButton = [
    { title: 'VAIRIFY - NOW', icon: '/images/home/sidebar-icon1.svg', path: '/vairify-search' },
    { title: 'VAI - CHECK', icon: '/images/home/sidebar-icon2.svg', path: '/vai-now' },
    { title: 'Marketplace Post', icon: '/images/home/sidebar-icon3.svg', path: '/marketplace/post' },
    { title: 'VAIRIPAY', icon: '/images/home/sidebar-icon4.svg', path: '/my-vairipay' },
    { title: 'My VAIRIFY', icon: '/images/home/sidebar-icon5.svg', path: '/my-vairify' },
    { title: 'Calendar', icon: '/images/home/sidebar-icon6.svg', path: '/calendar' },
    { title: 'Date Guard', icon: '/images/home/sidebar-icon7.svg', path: '/dateguard-setup' },
    { title: 'Setting', icon: '/images/home/sidebar-icon8.svg', path: '/settings' },
  ]
  const handleNavigate = (activeButtonPath) => {
    handleShowDropDown(false);
    navigate(activeButtonPath, { state: { from: 'header' } });
  };

  return (
    <div className="fixed top-0 flex justify-center w-full z-[999] md:right-[7.5px] right-0">
    <div className='container'>
      <div className={`flex justify-between items-center rounded-[200px] mx-auto mt-[24px] md:py-[12px] md:px-[24px] relative z-[99] md:bg-[#1A2168] bg-transparent md:shadow-lg`}>
        <div className="md:block hidden"><img src="/images/setup/tab-logo.svg" alt="logo" className="lg:max-w-[132px] md:max-w-[90px] max-w-[100px]" /></div>
        <div className="md:hidden block"><BackButton /></div>
        <div className="md:flex items-center justify-center sm:w-auto w-full hidden">
          {tabbar.map((tab) => {
            const Icon = tab.icon;
            const isActive = path.startsWith(tab.path);
            const isNotificationTab = tab.path === '/notifications';
            return (
              <button
                key={tab.path}
                onClick={() => handleTabClick(tab.path)}
                className={`
                  relative flex flex-col items-center xl:w-[130px] lg:w-[100px] w-[80px] text-[8px] font-normal transition-all duration-200
                  ${isActive ? 'text-white before:opacity-100' : 'text-[#ffffff] before:opacity-0'}
                  before:content-[''] before:absolute before:bottom-[-14px] before:left-1/2 before:-translate-x-1/2
                  before:w-[100%] before:h-1 before:rounded-full before:bg-white before:transition-opacity before:duration-300
                `}
              >
                <Icon
                  weight={isActive ? 'fill' : 'regular'}
                  className="sm:w-7 sm:h-7 w-6 h-6 mb-1"
                />
                {isNotificationTab && tokenAvailable && notificationCount > 0 && (
                  <div
                    className="absolute top-[-2px] xl:right-[46px] lg:right-[30px] right-[20px] h-[16px] w-[16px] rounded-full bg-[#008F34] flex justify-center items-center text-[10px]"
                  >
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <div className="items-center gap-[24px] flex">
          {!hideBurgerRoutes.includes(path) && (
            <div className="flex justify-center flex-col">
              {/* desktop sidebar */}
              <div ref={dropdownRef} className="relative flex justify-center flex-col z-[99]">
                <button onClick={handleShowDropDown}><img src="/images/setup/toggle-icon.svg" alt="icon" className="w-6 h-6 md:block hidden" /></button>
                {showDropDown && (<div className="absolute top-[60px] left-[-154px] min-w-[269px]  h-[100%] py-[24px] px-[16px] rounded-[16px] bg-[#060C4D] shadow-xl z-50 min-h-[520px]">
                  <div className="px-[16px] flex items-center gap-[10px]">
                    {UserDetails?.profilePic ? (
                      <img
                        className="w-[72px] h-[72px] min-w-[72px]  bg-[#fff] rounded-full object-cover overflow-hidden"
                        src={`${import.meta.env.VITE_APP_S3_IMAGE}/${UserDetails?.profilePic
                          }`}
                        // src={`${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL}/${
                        //   UserDetails?.profilePic
                        // }`}
                        alt="Profile Sugar 1"
                      />
                    ) : (
                      <img
                        className="w-[72px] h-[72px] bg-[#fff] rounded-full object-cover overflow-hidden"
                        // src={profilepic}
                        src={
                          UserDetails?.item?.userId?.gender === "Male"
                            ? "/images/male.png"
                            : "/images/female.png"
                        }
                        alt="Profile Sugar 2"
                      />
                    )}
                    <h3 className="text-[20px] text-white font-semibold">{UserDetails?.name}</h3>
                  </div>
                  <div className="mt-[24px]">
                    {sideBarButton.map((button) => {
                      const isActiveSideBar = path.startsWith(button.path)
                      return (
                        <button onClick={() => handleNavigate(button.path)} className={`w-full mb-1 font-normal text-[14px] text-white flex items-center gap-[8px] px-[16px] py-[8px] rounded-[8px] ${isActiveSideBar ? 'bg-[#F2F2F229]' : ''} hover:bg-[#F2F2F229] `}><img src={button.icon} alt="icon" />{button.title}</button>
                      )
                    })}
                  </div>
                  <button className={`w-full font-normal text-[14px] text-white flex items-center gap-[8px] px-[16px] py-[8px] rounded-[8px] bg-[#E43530] mt-[24px]`} onClick={() => {
                    dispatch(logout());
                    navigate("/")
                  }}><img src="/images/home/logout.svg" alt="icon" />Log Out</button>
                </div>)}
              </div>
              {/* mobile dropdown */}
              <button onClick={onClick}><img src="/images/setup/toggle-icon.svg" alt="icon" className="w-6 h-6 md:hidden block" /></button>
            </div>
          )}
          <div onClick={handleShowDropDown} className="md:block hidden cursor-pointer">  {UserDetails?.profilePic ? (
            <img
              className="w-[40px] h-[40px] bg-[#fff] rounded-full object-cover overflow-hidden"
              src={`${import.meta.env.VITE_APP_S3_IMAGE}/${UserDetails?.profilePic
                }`}
              // src={`${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL}/${
              //   UserDetails?.profilePic
              // }`}
              alt="Profile Sugar 1"
            />
          ) : (
            <img
              className="w-[40px] h-[40px] bg-[#fff] rounded-full object-cover overflow-hidden"
              // src={profilepic}
              src={
                UserDetails?.item?.userId?.gender === "Male"
                  ? "/images/male.png"
                  : "/images/female.png"
              }
              alt="Profile Sugar 2"
            />
          )}</div>
        </div>
      </div>
    </div>
    </div>
  );
}



// <div
//   className={`header-part w-full flex flex-col justify-center items-start px-2 left-0  bg-[${bgColor}] z-50 ${path === "/profile-permissions" ? "header-part-profile-permission" : ""
//     }`}
// >
//   <div className="w-full mx-auto flex flex-row justify-between items-center mt-5">
//     <div className="">
//       {path != "/login" && (
//         <div className="w-[32px] h-[32px] rounded-full bg-[#FFFFFF14] flex items-center justify-center">
//           <IconButton
//             onClick={() => goBack()}
//             icon={<img src={"/images/signup/left-arrow.svg"} alt="Left Icon" />}
//           />
//         </div>
//       )}
//     </div>
//     {pageWithHiddenLogo.includes(location.pathname)
//       ? null
//       : // logo will not visible on the screens having something similar path in url
//       (!(
//         (
//           path.includes("vairify-schedule") ||
//           path.includes("/user") ||
//           path.includes("/varidate") ||
//           path.includes("/date-guard") ||
//           path.includes("/post") ||
//           path === "/vai-now" ||
//           path.includes("/marketplace/active/invitation") ||
//           path === "/marketplace" ||
//           path === "/vairipay-options" ||
//           path.includes("/vai-now/accept") ||
//           path === "/my-vairify-details" ||
//           path === "/profile-permissions" ||
//           path === "/settings/about-me" ||
//           path.includes("/public/profile")
//         )
//         // add paths here if you want to hide the logo
//       ) ||
//         // logo will appear on screens having these urls
//         path.includes("varidate/past-appointments") ||
//         path === "/login" ||
//         path === "/varidate/verification" ||
//         path === "/settings" ||
//         path === "/vairify-advance-search" ||
//         path === "/varidate/appointment-review" ||
//         path === "/varidate/face-verification" ||
//         path === "/varidate/upcoming-appointments" ||
//         path === "/varidate/invitations-list" ||
//         path === "/varidate/verification-manual" ||
//         path === "/user-payment-history" ||
//         path.includes("/vairify-results")) && (
//         // ADD paths here if you want to show the logo
//         <div
//           id="hiddenintirepag"
//           className="flex flex-col justify-center items-center relative bottom-3"
//         >
//           <div>
//             <img
//               src={"/images/signup/verify-logo.svg"}
//               alt="Varify Logo"
//             />
//           </div>
//         </div>
//       )}
//     {path.includes("/post") === true &&
//       !path.includes("/varidate/post/review") && (
//         <div className="flex bg-[#D5D6E0] mb-[-1px] items-center justify-center px-2 rounded-t-md flex-1 w-[100px] mt-[13px]">
//           <div className="flex items-center">
//             <img src="/images/tokens.png" />
//             <span className="text-[26px] font-[700] pl-1">
//               {tokens}
//             </span>
//           </div>
//         </div>
//       )}
//     <div className=" flex justify-end">
//       {!hideBurgerRoutes.includes(path) && (
//         <button onClick={onClick} className="p-4">
//           <img src={"/images/burgerVector.png"} alt="Burger Vector Icon" />
//         </button>
//       )}
//     </div>
//   </div>
// </div>