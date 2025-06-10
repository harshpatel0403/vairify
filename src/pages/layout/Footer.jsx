import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationServices from "../../services/NotificationServices";
import organizeNotificationsByDay from "../../Ultis/notifications";

export default function Footer({ bgColor, from }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const AuthToken = useSelector((state) => state?.Auth?.Auth?.data?.token);
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user) || {};
  const GallaryData = useSelector((state) => state?.Gallary) || [];
  const ServicesData =
    useSelector((state) => state?.Services?.getservices) || [];
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
        HourllyRate = ServicesData?.some(
          (item) => item?.businessHourlyRates?.length > 0
        );
        Services = true;
      }

      if (
        UserData?.user_type === "companion-provider" ||
        UserData?.user_type === "influencer-affiliate"
      ) {
        HourllyRate = ServicesData?.some(
          (item) => item?.hourlyRates?.length > 0
        );
        Services = ServicesData?.some((item) => item?.services?.length > 0);
      }
    }

    return { HourllyRate, Services };
  }, [UserData, ServicesData]);

  const accessFooter = (LanguagesData || UserData?.language) && UserData?.gender && UserData?.mutualContractSigned && UserData?.varipayActivity && (HourllyRate && Services)
    && UserData?.vaiNowAvailable?.availableFrom && UserData?.dateGuardActivity && GallaryData?.userGallary?.images?.length > 0 &&
    !SocialData?.socialData?.find((item) => item)?.message && UserData?.incallAddresses?.length > 0;

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

  const hideFooterRoutes = [
    "/setup-face-verification",
    "/vai",
    "/get-vai",
    "/terms",
    "/subscription",
    "/migration",
    "/payment",
    "/reset-password",
    "/bussiness-vai",
    from == "settings" && "/change-password",
    "/otp-verification",
    "/otp-congratulations",
    "/chat/:receiverId",
    "/payment-success",
    "/self-verification-completed",
    "/business/community",
    "/reset-password",
    "/reset-password-otp",
    "/confirm/password",
    "/agencybusiness"
  ];

  const shouldHideFooter =
    path.startsWith("/chat/") || hideFooterRoutes.includes(path);


  if (shouldHideFooter) {
    return null;
  }

  return (
    <div className="lg:pt-[64px] pt-[40px] pb-[48px] bg-[#000531] w-full sm:block hidden mt-auto footer">
      <div className="max-w-[1216px] w-[90%] mx-auto">
        <div className="mx-auto flex justify-center items-center">
          <img
            src="/images/signup/logo.svg"
            alt="logo"
            className="max-w-[132px]"
          />
        </div>
        <div className="flex justify-center items-center mt-[30px] gap-[32px]">

          <div>
            <button disabled={!accessFooter || !tokenAvailable} onClick={(e) => navigateHome(e)} className="lg:text-base text-sm font-semibold text-white cursor-pointer disabled:cursor-not-allowed">
              Home
            </button>
          </div>
          <div className="relative">
            <button disabled={!accessFooter || !tokenAvailable} onClick={(e) => { navigateNotification(e) }} className="lg:text-base text-sm font-semibold text-white cursor-pointer disabled:cursor-not-allowed">
              Notification
            </button>
          </div>
          <div>
            <button disabled={!accessFooter || !tokenAvailable} onClick={(e) => navigateMarketplace(e)} className="lg:text-base text-sm font-semibold text-white cursor-pointer disabled:cursor-not-allowed">
              Marketplace
            </button>
          </div>
          <div>
            <button disabled={!accessFooter || !tokenAvailable} onClick={(e) => naviageLogs(e)} className="lg:text-base text-sm font-semibold text-white cursor-pointer disabled:cursor-not-allowed">
              Message
            </button>
          </div>
          <div>
            <button disabled={!accessFooter || !tokenAvailable} onClick={(e) => navigateSettings(e)} className="lg:text-base text-sm font-semibold text-white cursor-pointer disabled:cursor-not-allowed">
              Setting
            </button>
          </div>
        </div>
        <div className="flex lg:justify-between justify-center items-center lg:mt-[48px] mt-[30px] lg:gap-[32px] gap-[16px] lg:flex-row flex-col">
          <p className="text-[#919EAB] font-normal lg:text-base text-sm">© Copyright 2025 By VAIRIFY. All Rights Reserved.</p>
          <div className="flex justify-center items-center lg:gap-[40px] gap-[20px]">
            <a href="" target="_blank" className="text-[#919EAB] font-normal lg:text-base text-sm whitespace-nowrap">Refund policy</a>
            <a href="/privacy-policy" target="_blank" className="text-[#919EAB] font-normal lg:text-base text-sm whitespace-nowrap">Privacy Policy</a>
            <a href="/terms-and-conditions" target="_blank" className="text-[#919EAB] font-normal lg:text-base text-sm whitespace-nowrap">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}
