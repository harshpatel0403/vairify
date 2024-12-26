import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import CalendarService from "../../../services/CalendarService";

export default function SyncCalendar() {
  const navigate = useNavigate();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const userType = UserDetails?.user_type; //'companion-provider'

  const navigateToCalendar = () => {
    navigate("/calendar");
  };
  const handleSaveRules = () => {
    navigate("/date-guard");
  };

  const syncApi = async (type) => {
    if (type == 1) {
      const syncRes = await CalendarService.syncGoogleEvents({
        userType: userType,
      });
      console.log(syncRes);
      const link = document.createElement("a");
      link.href = syncRes.authorizationUrl;
      link.target = "_blank";
      console.log(link);
      link.click();
    } else if (type == 2) {
      const syncRes = await CalendarService.syncMicrosoftEvents({
        userType: userType,
      });
      console.log(syncRes);
      const link = document.createElement("a");
      link.href = syncRes.authorizationUrl;
      link.target = "_blank";
      console.log(link);
      link.click();
    }
  };
  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-5">
        <div className="w-full mx-auto flex flex-row justify-center items-center max-w-[310px]">
          <span>
            <span className="w-full font-bold text-[18px] text-black">
              Select the popular calendar you would like to sync your
            </span>
            <br />
            <span className="font-extrabold text-[18px] text-black">VAI</span>
            <span className="font-light text-[18px] text-black">RIFY</span>
            <span className="ml-2 font-extrabold text-[18px] text-black">
              CALENDAR
            </span>
          </span>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
          <img
            onClick={() => {
              syncApi(1);
            }}
            src={"/images/GoogleSync.png"}
            width={170}
            alt="Google Sync Logo"
          />
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center">
          <img
            onClick={() => {
              syncApi(2);
            }}
            src={"/images/MicrosoftSync.png"}
            width={170}
            alt="Microsoft Sync Logo"
          />
        </div>
        {/* <div className="w-full mx-auto flex flex-col justify-center items-center">
          <img src={"/images/AppleSync.png"} width={170} alt="Apple Sync Logo" />
        </div> */}
        {/* <div className="mt-3 px-5 w-[200px] mb-5 form-field-container">
          <Button
            className={
              "bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[26px] font-bold shadow-2xl"
            }
            text={"Calendar"}
            onClick={() => navigateToCalendar()}
            size={"45px"}
          />
        </div> */}
      </div>
    </div>
  );
}
