import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
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

export default function Layout({ onClick, appComponent }) {
  const [toggle, setToggle] = useState(false);
  const [adminSideBar, setAdminSideBar] = useState(false);
  const [adminDetail, setAdminDetail] = useState(false);
  const [admin, setAdmin] = useState(false);
  const AuthToken = useSelector((state) => state?.Auth?.Auth?.data?.user);

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

  const bgColor = path.startsWith("/dateguard") ? "#100333" : "#040B47";

  const isOutsider = path.startsWith("/dateguard/emergency-contacts");

  if (isOutsider) {
    return (
      <div
        className={`flex flex-col justify-center items-start bg-[${bgColor}]`}
      >
        <div className="datting-layout mx-auto bg-[#DB3002]">
          {appComponent}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col justify-center items-start bg-[${bgColor}]`}>
      {(admin == false && path.includes("/date-guard") == true) ||
      path.includes("/user") == true ? (
        <div className="datting-layout mx-auto bg-[#040C50]">
          <SidebarMain toggleStatus={toggle} setToggle={setToggle} />
          <div
            onClick={() => setToggle(false)}
            className={`z-[9999] fixed top-0 left-0 w-[100vw] h-[100vh] sideBarOverlay ${
              toggle == true ? "custom-opacity-1" : ""
            }`}
          ></div>
          <Header onClick={() => toggleSideBar()} />
          <Content contentComponent={appComponent} bgColor={bgColor} />
        </div>
      ) : admin == false &&
        path.includes("/date-guard") == false &&
        path.includes("/user") == false ? (
        <div className="mx-auto datting-layout">
          {/* <ProfileA toggleStatus={toggle} /> */}
          <SidebarMain toggleStatus={toggle} setToggle={setToggle} />
          {/* <ProfileC toggleStatus={toggle} /> */}
          <div
            onClick={() => setToggle(false)}
            className={`z-[9999] fixed top-0 left-0 w-[100vw] h-[100vh] sideBarOverlay ${
              toggle == true ? "custom-opacity-1" : ""
            }`}
          ></div>
          <Header onClick={() => toggleSideBar()} bgColor={bgColor} />
          <Content contentComponent={appComponent} bgColor={bgColor} />
        </div>
      ) : (
        <div className="h-[100vh] bg-[#040C50] admin-custom-contianer overflow-auto">
          <Sidebar sideBarStatus={adminSideBar} />
          <div
            onClick={() => setAdminSideBar(false)}
            className={`z-[9999] fixed top-0 left-0 w-[100vw] h-[100vh] sideBarOverlay ${
              adminSideBar == true ? "custom-opacity-1" : ""
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
