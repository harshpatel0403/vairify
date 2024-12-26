import SearchBox from "../../../components/SearchBox";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ sideBarStatus }) {
  const navigate = useNavigate();

  const navigateHome = (e) => {
    e.preventDefault();
    navigate("/featured");
  };

  const navigateMarketplace = (e) => {
    e.preventDefault();
    navigate("/marketplace");
  };

  const naviageLogs = (e) => {
    e.preventDefault();
    navigate("/chat-log");
  };

  const navigateNotification = (e) => {
    e.preventDefault();
    navigate("/notifications");
  };
  const navigateSettings = (e) => {
    e.preventDefault();
    navigate("/settings");
  };

  return (
    <div
      className={`text-white flex flex-col justify-start items-center px-5 py-10 overflow-auto w-[290px] h-[100vh] fixed top-0 bg-gradient-to-b from-[#0247FF] to-[#0247FF] custom-left-admin-0 ${
        sideBarStatus && "custom-left-0"
      }`}
    >
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full">
          <img
            src={import.meta.env.BASE_URL + "/images/AdminLogo.png"}
            alt="Admin Sidebar"
          />
        </div>
        <div className="w-full mt-10 flex flex-row justify-center items-center">
          <SearchBox
            placeholder={"Search"}
            classname={"w-[170px] text-white"}
            bgColor="transparent"
          />
          <div className="w-[28px] h-[28px] ml-3 flex flex-col justify-center items-center mt-2">
            <img
              className="w-full h-full"
              src={import.meta.env.BASE_URL + "/images/Vector.png"}
              alt="Vector"
            />
          </div>
        </div>
        <div className="w-full mx-auto mt-20">
          <button
            onClick={(e) => navigateHome(e)}
            className="w-full hover:bg-[#D9D9D9] rounded-2xl px-2"
          >
            <div className="flex flex-row justify-start items-center">
              <div className="w-[25px] h-[25px]">
                <img
                  className="w-full h-full"
                  src={import.meta.env.BASE_URL + "/images/HomeAd.png"}
                  alt="Home Admin"
                />
              </div>
              <span className="text-[22px] font-bold text-white ml-5">
                Home
              </span>
            </div>
          </button>
        </div>
        <div className="w-full mx-auto mt-5">
          <button
            onClick={(e) => navigateMarketplace(e)}
            className="w-full hover:bg-[#D9D9D9] rounded-2xl px-2"
          >
            <div className="flex flex-row justify-start items-center">
              <div className="w-[25px] h-[25px] relative">
                <img
                  className="w-full h-full"
                  src={import.meta.env.BASE_URL + "/images/MarketplaceO.png"}
                  alt="Home Admin"
                />
                <img
                  className="w-[15px] h-[15px] absolute"
                  style={{ top: "2px", left: "5px" }}
                  src={import.meta.env.BASE_URL + "/images/MarketplaceI.png"}
                  alt="Home Admin"
                />
              </div>
              <span className="text-[22px] font-bold text-white ml-5">
                Market Place
              </span>
            </div>
          </button>
        </div>
        <div className="w-full mx-auto mt-5">
          <button
            onClick={(e) => navigateNotification(e)}
            className="w-full hover:bg-[#D9D9D9] rounded-2xl px-2"
          >
            <div className="flex flex-row justify-start items-center">
              <div className="w-[25px] h-[25px]">
                <img
                  className="w-full h-full"
                  src={import.meta.env.BASE_URL + "/images/SpeakerAd.png"}
                  alt="Home Admin"
                />
              </div>
              <span className="text-[22px] font-bold text-white ml-5">
                Notifications
              </span>
            </div>
          </button>
        </div>
        <div className="w-full mx-auto mt-5">
          <button
            onClick={(e) => naviageLogs(e)}
            className="w-full hover:bg-[#D9D9D9] rounded-2xl px-2"
          >
            <div className="flex flex-row justify-start items-center">
              <div className="w-[25px] h-[25px]">
                <img
                  className="w-full h-full"
                  src={import.meta.env.BASE_URL + "/images/AdChat.png"}
                  alt="Home Admin"
                />
              </div>
              <span className="text-[22px] font-bold text-white ml-5">
                Chat
              </span>
            </div>
          </button>
        </div>
        <div className="w-full mx-auto mt-5">
          <button className="w-full hover:bg-[#D9D9D9] rounded-2xl px-2">
            <div className="flex flex-row justify-start items-center">
              <div className="w-[25px] h-[25px]">
                <img
                  className="w-full h-full"
                  src={import.meta.env.BASE_URL + "/images/RevenueAd.png"}
                  alt="Home Admin"
                />
              </div>
              <span className="text-[22px] font-bold text-white ml-5">
                My Revenue
              </span>
            </div>
          </button>
        </div>
        <div className="w-full mx-auto mt-5">
          <button className="w-full hover:bg-[#D9D9D9] rounded-2xl px-2">
            <div className="flex flex-row justify-start items-center">
              <div className="w-[25px] h-[25px]">
                <img
                  className="w-full h-full"
                  src={import.meta.env.BASE_URL + "/images/ForumAd.png"}
                  alt="Home Admin"
                />
              </div>
              <span className="text-[22px] font-bold text-white ml-5">
                Forum
              </span>
            </div>
          </button>
        </div>
        <div className="w-full mx-auto mt-5">
          <button className="w-full hover:bg-[#D9D9D9] rounded-2xl px-2">
            <div className="flex flex-row justify-start items-center">
              <div className="w-[25px] h-[25px]">
                <img
                  className="w-full h-full"
                  src={import.meta.env.BASE_URL + "/images/ContactAd.png"}
                  alt="Home Admin"
                />
              </div>
              <span className="text-[22px] font-bold text-white ml-5">
                My Contacts
              </span>
            </div>
          </button>
        </div>
        <div className="w-full mx-auto mt-5">
          <button
            onClick={(e) => navigateSettings(e)}
            className="w-full hover:bg-[#D9D9D9] rounded-2xl px-2"
          >
            <div className="flex flex-row justify-start items-center">
              <div className="w-[25px] h-[25px]">
                <img
                  className="w-full h-full"
                  src={import.meta.env.BASE_URL + "/images/SettingsAd.png"}
                  alt="Home Admin"
                />
              </div>
              <span className="text-[22px] font-bold text-white ml-5">
                Settings
              </span>
            </div>
          </button>
        </div>
        <div className="w-full mx-auto mt-5">
          <button className="w-full hover:bg-[#D9D9D9] rounded-2xl px-2">
            <div className="flex flex-row justify-start items-center">
              <div className="w-[25px] h-[25px]">
                <img
                  className="w-full h-full"
                  src={import.meta.env.BASE_URL + "/images/HelpAd.png"}
                  alt="Home Admin"
                />
              </div>
              <span className="text-[22px] font-bold text-white ml-5">
                Help
              </span>
            </div>
          </button>
        </div>
        <div className="w-full mx-auto mt-40 mb-20">
          <Button
            text="Logout"
            className={
              "bg-gradient-to-b from-[#0198FE] to-[#0247FF] focus:from-[#0247FF]"
            }
            size="40px"
          />
        </div>
      </div>
    </div>
  );
}
