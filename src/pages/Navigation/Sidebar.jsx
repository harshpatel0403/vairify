import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/action/logout";
import BaseAPI from "../../BaseAPI";
import { HandleUser } from "../../redux/action/Auth";
import profilepic from "../../assets/images/profilepic.png";

export default function ProfileB({ toggleStatus, setToggle }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/user/my-vairipay-request-confirm");
  };

  const HandleLogOut = () => {
    dispatch(logout());
    setToggle(false);
    navigate("/");
    // localStorage.removeItem('Flag');
    // localStorage.removeItem('Flag2');
  };

  const navigateHome = (e) => {
    e.preventDefault();
    navigate("/featured");
  };

  const navigateMarketplace = (e) => {
    e.preventDefault();
    navigate("/marketplace");
  };

  const navigateMarketplacePost = (e) => {
    e.preventDefault();
    navigate("/marketplace/post");
  };

  const naviageLogs = (e) => {
    e.preventDefault();
    navigate("/chat-log");
  };

  const navigateVaripays = (e) => {
    e.preventDefault();
    navigate("/my-vairipay");
  };

  const navigateMyVairify = (e) => {
    e.preventDefault();
    navigate("/my-vairify");
  };

  const navigateCalander = (e) => {
    e.preventDefault();
    navigate("/calendar");
  };

  const navigateDateGuard = (e) => {
    e.preventDefault();
    navigate("/dateguard/select-appointment");
  };

  const navigateNotification = (e) => {
    e.preventDefault();
    navigate("/notifications");
  };
  const navigateSettings = (e) => {
    e.preventDefault();
    navigate("/settings");
  };

  const CloseSideBar = () => {
    setToggle(false);
  };

  return (
    <div
      className={`usergreytextdisabled sidebar-part text-white flex flex-col justify-start items-center px-5 pb-10 overflow-auto w-[170px] h-[100vh] fixed top-0 custom-left-minus-100 bg-gradient-to-b from-[#01195C] to-[#073FE1]  ${toggleStatus == true ? "custom-left-0" : ""
        }`}
    >
      <div className="flex flex-col items-center justify-center w-full pt-5 mx-auto">
        <div className="font-roboto">
          <span className="text-[16px] font-bold text-white font-roboto">
            Profile
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full mx-auto mt-2">
        {UserDetails?.profilePic ? (
          <img
            className="w-[108px] h-[108px] bg-[#fff] rounded-full border-2 overflow-hidden"
            src={`${import.meta.env.VITE_APP_S3_IMAGE}/${UserDetails?.profilePic
              }`}
            // src={`${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL}/${
            //   UserDetails?.profilePic
            // }`}
            alt="Profile Sugar 1"
          />
        ) : (
          <img
            height={100}
            width={100}
            className="w-[108px] h-[108px] bg-[#fff] rounded-full border-2 overflow-hidden"
            // src={profilepic}
            src={
              UserDetails?.item?.userId?.gender === "Male"
                ? "/images/female.png"
                : "/images/male.png"
            }
            alt="Profile Sugar 2"
          />
        )}
      </div>

      <div className="flex flex-col items-center justify-center w-full mx-auto mt-4">
        <div
          style={{ border: "1px solid white" }}
          className="w-[65px] border-white"
        ></div>
        <div>
          <span className="text-white font-bold text-[18px] capitalize">
            {UserDetails?.name}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center w-full mx-auto mt-7">
        <button
          className=""
          onClick={() => {
            navigate("/featured");
            CloseSideBar();
          }}
        >
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/VectorHome.png"} />
            </div>
            <div className="sidebar-link-text">Home</div>
          </div>
        </button>
        <button
          className="mt-6"
          onClick={() => {
            navigate("/vairify-search");
            CloseSideBar();
          }}
        >
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/barClock.png"} />
            </div>
            <div className="sidebar-link-text red sidebar-link-inner-text">
              <span className="font-extrabold">VAI</span>RIFY-NOW
            </div>
          </div>
        </button>
        <button
          className="mt-6"
          onClick={() => {
            navigate("/vai-now");
            CloseSideBar();
          }}
        >
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/barCheck.png"} />
            </div>
            <div className="sidebar-link-text red">
              VAI<span className="sidebar-link-inner-text">-CHECK</span>
            </div>
          </div>
        </button>

        <button
          onClick={(e) => {
            navigateMarketplace(e);
            CloseSideBar();
          }}
          className="mt-6"
          disabled={!UserDetails?.marketPlaceActivity}
        >
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/sidebarMarket.png"} />
            </div>
            <div className="sidebar-link-text">Market Place</div>
          </div>
        </button>

        <button
          onClick={(e) => {
            navigateMarketplacePost(e);
            CloseSideBar();
          }}
          className="mt-6"
          disabled={!UserDetails?.marketPlaceActivity}
        >
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/sidebarMarket.png"} />
            </div>
            <div className="sidebar-link-text">Marketplace Post</div>
          </div>
        </button>

        <button
          onClick={(e) => {
            naviageLogs(e);
            CloseSideBar();
          }}
          className="mt-6"
          disabled={!UserDetails?.messagesActivity}
        >
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/VectorChat.png"} />
            </div>
            <div className="sidebar-link-text">Chat</div>
          </div>
        </button>

        <button
          onClick={(e) => {
            navigateVaripays(e);
            CloseSideBar();
          }}
          className="mt-6"
          disabled={!UserDetails?.varipayActivity}
        >
          <div className="flex flex-row items-center justify-start w-full">
            <div onClick={(e) => handleClick(e)} className="sidebar-icon">
              <img className="relative" src={"/images/ProfileVairipay.png"} />
            </div>
            <div className="sidebar-link-text">
              VAI<span className="sidebar-link-inner-text">RIPAY</span>
            </div>
          </div>
        </button>

        <button className="mt-6" disabled={!UserDetails?.varipayActivity}>
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/ProfileMyRevenue.png"} />
            </div>
            <div className="sidebar-link-text">My Revenue</div>
          </div>
        </button>

        <button
          onClick={(e) => {
            navigateMyVairify(e);
            CloseSideBar();
          }}
          className="mt-6"
        >
          <div className="flex flex-row items-center justify-start w-full">
            <div onClick={(e) => handleClick(e)} className="sidebar-icon">
              <img className="" src={"/images/ProfileMyVairipay.png"} />
            </div>
            <div className="sidebar-link-text">
              My VAI<span className="sidebar-link-inner-text">RIFY</span>
            </div>
          </div>
        </button>
        {/* <button className="mt-6">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/VectorForum.png"} />
            </div>
            <div className="sidebar-link-text">
              Forum
            </div>
          </div>
        </button> */}
        <button
          className="mt-6"
          disabled={!UserDetails?.calendarActivity}
          onClick={() => {
            navigate("/calendar");
            CloseSideBar();
          }}
        >
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/VectorCalendar.png"} />
            </div>
            <div className="sidebar-link-text">Calendar</div>
          </div>
        </button>

        <button
          onClick={(e) => {
            navigateDateGuard(e);
            CloseSideBar();
          }}
          className="mt-6"
        >
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/ProfileDateGuard.png"} />
            </div>
            <div className="sidebar-link-text">Date Guard</div>
          </div>
        </button>
        {/* <button className='mt-8'><div className='flex flex-row items-center justify-start w-full'><div><img className='' src={'/images/VectorRevenue.png'} /></div><div><span className='sidebar-link-text'>My Revenue</span></div></div></button> */}
        {/* <button className='mt-8'><div className='flex flex-row items-center justify-start w-full'><div><img className='' src={'/images/VectorContact.png'} /></div><div><span className='sidebar-link-text'>My Contacts</span></div></div></button> */}
        <button
          className="mt-6"
          onClick={() => {
            navigate("/settings");
            CloseSideBar();
          }}
        >
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/VectorSettings.png"} />
            </div>
            <div className="sidebar-link-text">Settings</div>
          </div>
        </button>
        {/* <button className="mt-6">
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/VectorHelp.png"} />
            </div>
            <div className="sidebar-link-text">Help
            </div>
          </div>
        </button> */}
        <button className="mt-6" onClick={HandleLogOut}>
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" width={18} src={"/images/logout.png"} />
            </div>
            <div className="sidebar-link-text">LogOut</div>
          </div>
        </button>
      </div>
    </div>
  );
}
