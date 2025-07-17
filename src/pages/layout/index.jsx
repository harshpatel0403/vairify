import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import LayoutHeader from "./Header";
import Content from "./Content";
import ProfileA from "../Navigation/ProfileA";
import SidebarMain from "../Navigation/Sidebar";
import ProfileC from "../Navigation/ProfileC";
import Sidebar from "../Admin/sidebar/Sidebar";
import HeaderAdmin from "../Admin/header/Header";
import AdminFooter from "../Admin/footer/Footer";
import RightSidebar from "../Admin/rightSidebar/RightSidebar";
import AdminContent from "../Admin/content/AdminContent";
import { useSelector } from "react-redux";
import Footer from "./Footer";
import Header from "../../components/Header/Header";

export default function Layout({ onClick, appComponent }) {
  const [toggle, setToggle] = useState(false);
  const [adminSideBar, setAdminSideBar] = useState(false);
  const [adminDetail, setAdminDetail] = useState(false);
  const [admin, setAdmin] = useState(false);
  const AuthToken = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user) || {};
  const GallaryData = useSelector((state) => state?.Gallary) || [];
  const ServicesData = useSelector((state) => state?.Services?.getservices) || [];
  const LanguagesData = useSelector((state) => state?.Auth?.language);
  const SocialData = useSelector((state) => state?.Social) || [];

  const { HourllyRate, Services } = useMemo(() => {
    let HourllyRate = false;
    let Services = false;

    if (Object.keys(UserData).length > 0) {
      if (UserData?.user_type === "client-hobbyist") {
        HourllyRate = true;
        Services = true;
      }

      if (UserData?.user_type === "agency-business") {
        HourllyRate = ServicesData?.some((item) => item?.businessHourlyRates?.length > 0);
        Services = true;
      }

      if (
        UserData?.user_type === "companion-provider" ||
        UserData?.user_type === "influencer-affiliate"
      ) {
        HourllyRate = ServicesData?.some((item) => item?.hourlyRates?.length > 0);
        Services = ServicesData?.some((item) => item?.services?.length > 0);
      }
    }

    return { HourllyRate, Services };
  }, [UserData, ServicesData]);

  const showLayoutHeader = (LanguagesData || UserData?.language) && UserData?.gender && UserData?.mutualContractSigned && UserData?.varipayActivity && (HourllyRate && Services)
   && UserData?.vaiNowAvailable?.availableFrom && UserData?.dateGuardActivity && GallaryData?.userGallary?.images?.length > 0 && 
   !SocialData?.socialData?.find((item) => item)?.message && UserData?.incallAddresses?.length > 0;

  const toggleSideBar = () => {
    if (AuthToken) {
      setToggle(!toggle);
      console.log("Toggle => ", toggle);
    }
  };

  const handleAdminSideBarToggle = () => {
    setAdminSideBar(!adminSideBar);
  };

  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    setAdmin(path.includes("/admin"));
    setAdminDetail(path.includes("/detail"));
  }, []);

  const bgColor = path.startsWith("/dateguard") ?
    // "#100333" : 
    "rgba(244, 244, 244, 1)" :
    "#040B47";

  const isOutsider = path.startsWith("/dateguard/emergency-contacts");

  const hideHeaderRoutes = [
    "/login",
    "/language",
    "/selectcategory",
    "/signup",
    "/otp-verification",
    "/otp-congratulations",
    "/change-password",
    "/reset-password",
    "/reset-password-otp",
    "/confirm/password",
    "/business/community",
    "/setup-face-verification",
    "/vai",
    "/get-vai",
    "/terms",
    "/subscription",
    "/migration",
    "/payment",
    "/bussiness-vai",
    "/self-verification-completed",
    "/payment-success",
    "/agencybusiness"
  ];


  const shouldHideHeader = hideHeaderRoutes.includes(path);

  if (isOutsider) {
    return (
      <div
        className={`flex flex-col justify-center items-start bg-[${bgColor}]`}
      >
        <div className="datting-layout mx-auto">
          <div className="h-full w-full">
            {/* Main Content */}
            <div className="w-full md:h-full">
              {appComponent}
            </div>

            {/* Footer */}
            <div className="bg-[#DB3002] w-full h-auto sm:block hidden">
              <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-4 px-4 gap-4 md:gap-0">
                <span className="text-white text-center md:text-left">
                  © Copyright 2025 By VAIRIFY. All Rights Reserved.
                </span>
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
                  <a className="text-white cursor-pointer" href="" target="_blank">Refund policy</a>
                  <a className="text-white cursor-pointer" href="http://localhost:5173/privacy-policy" target="_blank">Privacy policy</a>
                  <a className="text-white cursor-pointer" href="http://localhost:5173/terms-and-conditions" target="_blank">Terms of service</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="main-layout-content">
        {(admin == false && path.includes("/date-guard") == true) ||
          path.includes("/user") == true ? (
          <div className="w-full h-full">
            <SidebarMain toggleStatus={toggle} setToggle={setToggle} />
            <div
              onClick={() => setToggle(false)}
              className={`z-[9999] fixed top-0 left-0 w-[100vw] h-[100vh] sideBarOverlay ${toggle == true ? "custom-opacity-1" : ""
                }`}
            ></div>
            {(!shouldHideHeader && showLayoutHeader) ? (<LayoutHeader onClick={() => toggleSideBar()} bgColor={bgColor} />)
              : (!shouldHideHeader && !showLayoutHeader) ? (<Header onClick={() => toggleSideBar()} bgColor={bgColor} />) : null}
            <Content contentComponent={appComponent} bgColor={bgColor} shouldHideHeader={shouldHideHeader} showLayoutHeader={showLayoutHeader} />
            {/* <Footer /> */}
          </div>
        ) : admin == false &&
          path.includes("/date-guard") == false &&
          path.includes("/user") == false ? (
          <div className="h-full w-full">
            {/* <ProfileA toggleStatus={toggle} /> */}
            <SidebarMain toggleStatus={toggle} setToggle={setToggle} />
            {/* <ProfileC toggleStatus={toggle} /> */}
            <div
              onClick={() => setToggle(false)}
              className={`z-[9999] fixed top-0 left-0 w-[100vw] h-[100vh] sideBarOverlay ${toggle == true ? "custom-opacity-1" : ""
                }`}
            ></div>
            {(!shouldHideHeader && showLayoutHeader) ? (<LayoutHeader onClick={() => toggleSideBar()} bgColor={bgColor} />)
              : (!shouldHideHeader && !showLayoutHeader) ? (<Header onClick={() => toggleSideBar()} bgColor={bgColor} />) : null}

            <Content contentComponent={appComponent} bgColor={bgColor} shouldHideHeader={shouldHideHeader} showLayoutHeader={showLayoutHeader} />
          </div>
        ) : (
          <div className="h-[100vh] bg-[#040C50] admin-custom-contianer overflow-auto">
            <Sidebar sideBarStatus={adminSideBar} />
            <div
              onClick={() => setAdminSideBar(false)}
              className={`z-[9999] fixed top-0 left-0 w-[100vw] h-[100vh] sideBarOverlay ${adminSideBar == true ? "custom-opacity-1" : ""
                }`}
            ></div>
            <HeaderAdmin onClick={() => handleAdminSideBarToggle()} />
            <RightSidebar detail={adminDetail} />
            <AdminContent contentComponent={appComponent} />
            <AdminFooter />
          </div>
        )}
      </div>
  );
}
