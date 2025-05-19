import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import CalendarService from "../../../services/CalendarService";
import Header from "../../../components/Header/Header";
import PageTitle from "../../../components/PageTitle";
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
    <div>
      <div className="container pb-[48px]">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"Sync Calendar"} />
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center">
          <div className="w-full mx-auto text-[#919EAB] text-lg text-center">
            Select the popular calendar you would like to sync your<br /> VAIRIFY CALENDAR
          </div>
          <div className="flex gap-[16px] mt-6">
            <div className="w-full mx-auto flex flex-col justify-center items-center ">
              <img
                onClick={() => {
                  syncApi(1);
                }}
                src={"/images/setup/google-sync.png"}
                alt="Google Sync Logo"
              />
              <p className="mt-[8px] text-lg font-normal text-white">Google</p>
            </div>
            <div className="w-full mx-auto flex flex-col justify-center items-center">
              <img
                onClick={() => {
                  syncApi(2);
                }}
                src={"/images/setup/microsoft-sync.png"}
                alt="Microsoft Sync Logo"
              />
              <p className="mt-[8px] text-lg font-normal text-white">Microsoft</p>
            </div>
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
    </div>
  );
}
