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
    navigate("/dateguard-setup");
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
      className={`usergreytextdisabled sidebar-part text-white flex flex-col justify-start items-center px-[16px] py-7 overflow-auto w-[269px] h-full fixed top-0 custom-left-minus-100 bg-[#060C4D]  ${toggleStatus == true ? "custom-left-0" : ""
        }`}
    >
      <div className="flex items-center w-full gap-[10px]">
        {UserDetails?.profilePic ? (
          <img
            className="w-[72px] h-[72px] object-cover bg-[#fff] rounded-full overflow-hidden"
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
            className="w-[72px] h-[72px] object-cover bg-[#fff] rounded-full overflow-hidden"
            // src={profilepic}
            src={
              UserDetails?.item?.userId?.gender === "Male"
                ? "/images/male.png"
                : "/images/female.png"
            }
            alt="Profile Sugar 2"
          />
        )}
        <div>
          <span className="text-white font-semibold text-[20px]">
            {UserDetails?.name}
          </span>
        </div>
      </div>


      <div className="flex flex-col items-start justify-center w-full mx-auto mt-[10px] h-[100%]">
        {/* <button
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
        </button> */}
        <button
          className="mt-6"
          onClick={() => {
            navigate("/vairify-search");
            CloseSideBar();
          }}
        >
          <div className="flex flex-row items-center justify-start w-full gap-[10px]">
            <div>
              <img className="" src={"/images/home/sidebar-icon1.svg"} />
            </div>
            <div className="sidebar-link-text red sidebar-link-inner-text">
              <span className="text-[14px] font-normal text-white">VAI</span>RIFY-NOW
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
          <div className="flex flex-row items-center justify-start w-full gap-[10px]">
            <div>
              <img className="" src={"/images/home/sidebar-icon2.svg"} />
            </div>
            <div className="text-[14px] font-normal text-white">
              VAI-CHECK
            </div>
          </div>
        </button>

        {/* <button
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
        </button> */}

        <button
          onClick={(e) => {
            navigateMarketplacePost(e);
            CloseSideBar();
          }}
          className="mt-6"
          disabled={!UserDetails?.marketPlaceActivity}
        >
          <div className="flex flex-row items-center justify-start w-full gap-[10px]">
            <div>
              <img className="" src={"/images/home/sidebar-icon3.svg"} />
            </div>
            <div className="text-[14px] font-normal text-white">Marketplace Post</div>
          </div>
        </button>

        {/* <button
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
        </button> */}

        <button
          onClick={(e) => {
            navigateVaripays(e);
            CloseSideBar();
          }}
          className="mt-6"
          disabled={!UserDetails?.varipayActivity}
        >
          <div className="flex flex-row items-center justify-start w-full gap-[10px]">
            <div onClick={(e) => handleClick(e)}>
              <img className="relative" src={"/images/home/sidebar-icon4.svg"} />
            </div>
            <div className="text-[14px] font-normal text-white">
              VAIRIPAY
            </div>
          </div>
        </button>
        {/* 
        <button className="mt-6" disabled={!UserDetails?.varipayActivity}>
          <div className="flex flex-row items-center justify-start w-full">
            <div className="sidebar-icon">
              <img className="" src={"/images/ProfileMyRevenue.png"} />
            </div>
            <div className="sidebar-link-text">My Revenue</div>
          </div>
        </button> */}

        <button
          onClick={(e) => {
            navigateMyVairify(e);
            CloseSideBar();
          }}
          className="mt-6"
        >
          <div className="flex flex-row items-center justify-start w-full gap-[10px]">
            <div onClick={(e) => handleClick(e)}>
              <img className="" src={"/images/home/sidebar-icon5.svg"} />
            </div>
            <div className="text-[14px] font-normal text-white">
              My VAIRIFY
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
          <div className="flex flex-row items-center justify-start w-full gap-[10px]">
            <div>
              <img className="" src={"/images/home/sidebar-icon6.svg"} />
            </div>
            <div className="text-[14px] font-normal text-white">Calendar</div>
          </div>
        </button>

        <button
          onClick={(e) => {
            navigateDateGuard(e);
            CloseSideBar();
          }}
          className="mt-6"
        >
          <div className="flex flex-row items-center justify-start w-full gap-[10px]">
            <div>
              <img className="" src={"/images/home/sidebar-icon7.svg"} />
            </div>
            <div className="text-[14px] font-normal text-white">Date Guard</div>
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
          <div className="flex flex-row items-center justify-start w-full gap-[10px]">
            <div>
              <img className="" src={"/images/home/sidebar-icon8.svg"} />
            </div>
            <div className="text-[14px] font-normal text-white">Settings</div>
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
        <button className="mt-auto flex items-center gap-[8px] px-[16px] py-[8px] bg-[#E43530] w-full rounded-[8px] text-[14px] text-white font-normal" onClick={HandleLogOut}>
          <img className="w-[16px] h-[16px]" src={"/images/logout.png"} alt="icon" />LogOut
        </button>
      </div>
    </div>
  );
}
