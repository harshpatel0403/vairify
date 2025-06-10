import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Loading from "../../components/Loading/Index";
import Header from "../../components/Header/Header";
import { useTranslation } from "react-i18next";
import { HandleGetServices } from "../../redux/action/Services";
const SetupProfile = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user) || {};
  const GallaryData = useSelector((state) => state?.Gallary) || [];
  const ServicesData =
    useSelector((state) => state?.Services?.getservices) || [];
  const LanguagesData = useSelector((state) => state?.Auth?.language);
  const SocialData = useSelector((state) => state?.Social) || [];
  const GallaryDataLoading = useSelector((state) => state?.Gallary?.loading);
  const ServicesDataLoading = useSelector((state) => state?.Services?.loading);
  const UserDetailsLoading = useSelector((state) => state?.Auth?.loading);
  const SocialDataLoading = useSelector((state) => state?.Social?.loading);

  useEffect(() => {
    dispatch(HandleGetServices(UserData?._id, UserData?.user_type))
  }, [])
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

  console.log(
    "🚀 ~ file: SetupProfile.jsx:8 ~ SetupProfile ~ UserData:",
    UserData
  );

  const handleLanguage = () => {
    const sendFromState =
      (LanguagesData || UserData?.language) &&
      UserData?.gender &&
      UserData?.mutualContractSigned &&
      UserData?.varipayActivity &&
      HourllyRate &&
      Services &&
      UserData?.vaiNowAvailable?.availableFrom &&
      UserData?.dateGuardActivity &&
      GallaryData?.userGallary?.images?.length > 0 &&
      !SocialData?.socialData?.find((item) => item)?.message &&
      UserData?.incallAddresses?.length > 0;
    navigate("/language", {
      state: { from: "setup", showLayoutHeader: sendFromState ? true : false },
    });
  };
  const handelPersonalProfile = () => {
    navigate("/personal-information", {
      state: {
        parentPage: "setup",
      },
    });
  };

  const handecontract = () => {
    navigate("/mutalconsent");
  };

  const handelVaripays = () => {
    navigate("/setup-varipay");
  };
  const handelPhotoGallery = () => {
    navigate("/photogallery");
  };
  const handelServices = () => {
    navigate("/services");
  };
  const handelDateGiardSetup = () => {
    navigate("/dateguard-setup", { state: { from: "setup" } });
  };

  const handelSocial = () => {
    navigate("/search-social");
  };

  const handelIncallAddress = () => {
    navigate("/manage-incall-addresses");
  };
  const handelCalander = () => {
    navigate("/cal-setting");
  };

  const handelSetupFacial = () => {
    navigate("/setup-facial");
  };

  return (
    <>
      <div className="md:hidden block fixed top-0 sm:h-[80px] h-[70px] w-full bg-[#060C4D] z-50"></div>
      <div className="container">
        {/* <Header /> */}
        <div className="sm:py-[48px] py-[24px]">
          <div className="mb-2 flex items-center justify-center">
            <span className="text-white sm:text-[28px] text-[24px] font-semibold">
              {t("setupprofile.title")}
            </span>
            <span className="text-[#FF7913] ml-1 sm:text-[28px] text-[24px] font-semibold">
              {Object.keys(UserData).length > 0 && UserData?.name}
            </span>
          </div>
          <p className="font-normal sm:text-[18px] text-[14px] text-white text-center opacity-70">
            {t("setupprofile.subtitle")}
          </p>
          <p className="font-normal text-[16px] text-white text-center">
            {t("setupprofile.setupPrompt")}
          </p>

          <div className="sm:mt-[48px] mt-[24px] grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-[24px]">
            <div
              onClick={handleLanguage}
              className="relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
            >
              {Object.keys(UserData).length > 0 || LanguagesData ? (
                <>
                  <img
                    src="/images/setup/setup-icon1.svg"
                    alt="img"
                    className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]"
                  />
                  <div className="flex items-center">
                    <span className="text-[14px] text-normal text-white text-center">
                      {t("setupprofile.language")}
                    </span>
                    {(LanguagesData && LanguagesData) || UserData?.language ? (
                      ""
                    ) : (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </div>
                  <img
                    src="/images/setup/arrow.svg"
                    alt="icon"
                    className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden"
                  />
                </>
              ) : (
                <Loading className="!w-[20px] !h-[20px] mb-[-5px] ml-[10px] !border-2" />
              )}
            </div>
            <div onClick={handelPersonalProfile} className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]">
              {Object.keys(UserData).length > 0 ?
                (
                  <>
                    <img src="/images/setup/setup-icon2.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                    <div className="flex items-center">
                      <span className="text-[14px] text-normal text-white text-center">{t("setupprofile.personalProfile")}</span>
                      {UserData?.gender && UserData?.profilePic ?
                        ("") :
                        (<span style={{ color: "red" }}>*</span>)
                      }
                    </div>
                    <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
                  </>
                ) :
                (<Loading className="!w-[20px] !h-[20px] mb-[-5px] ml-[10px] !border-2" />)
              }
            </div>
            {/* <div onClick={handelUploadProfile} className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]">
              <img src="/images/setup/setup-icon6.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
              <div className="flex items-center">
                <span className="text-[14px] text-normal text-white text-center">Upload Profile Pic</span>
                {Object.keys(UserData).length > 0 ?
                  (
                    UserData?.profilePic != "" && UserData?.profilePic !== undefined ?
                      ("") :
                      (<span style={{ color: "red" }}>*</span>)

                  ) :
                  (<Loading className="!w-[20px] !h-[20px] mb-[-5px] ml-[10px] !border-2"  />)
                }
              </div>
              <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden"/>
            </div> */}
            <div
              onClick={handecontract}
              className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
            >
              {Object.keys(UserData).length > 0 ? (
                <>
                  <img
                    src="/images/setup/setup-icon3.svg"
                    alt="img"
                    className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]"
                  />
                  <div className="flex items-center">
                    <span className="text-[14px] text-normal text-white text-center">
                      {t("setupprofile.mutualConsent")}
                    </span>
                    {UserData?.mutualContractSigned ? (
                      ""
                    ) : (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </div>
                  <img
                    src="/images/setup/arrow.svg"
                    alt="icon"
                    className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden"
                  />
                </>
              ) : (
                <Loading className="!w-[20px] !h-[20px] mb-[-5px] ml-[10px] !border-2" />
              )}
            </div>
            <div
              onClick={handelVaripays}
              className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
            >
              {Object.keys(UserData).length > 0 ? (
                <>
                  <img
                    src="/images/setup/setup-icon4.svg"
                    alt="img"
                    className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]"
                  />
                  <div className="flex items-center">
                    <span className="text-[14px] text-normal text-white text-center">
                      {t("setupprofile.vairipay")}
                    </span>
                    {UserData?.varipayActivity ? (
                      ""
                    ) : (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </div>
                  <img
                    src="/images/setup/arrow.svg"
                    alt="icon"
                    className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden"
                  />
                </>
              ) : (
                <Loading className="!w-[20px] !h-[20px] mb-[-5px] ml-[10px] !border-2" />
              )}
            </div>
            <div
              onClick={handelPhotoGallery}
              className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
            >
              {!GallaryDataLoading ? (
                <>
                  <img
                    src="/images/setup/setup-icon5.svg"
                    alt="img"
                    className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]"
                  />
                  <div className="flex items-center">
                    <span className="text-[14px] text-normal text-white text-center">
                      {t("setupprofile.galleryPhoto")}
                    </span>
                    {GallaryData?.userGallary?.images?.length > 0 ? (
                      ""
                    ) : (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </div>
                  <img
                    src="/images/setup/arrow.svg"
                    alt="icon"
                    className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden"
                  />
                </>
              ) : (
                <Loading className="!w-[20px] !h-[20px] mb-[-5px] ml-[10px] !border-2" />
              )}
            </div>
            {/* <div onClick={handelSetupFacial} className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]">
              <img src="/images/setup/setup-icon6.svg" alt="img" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
              <div className="flex items-center">
                <span className="text-[14px] text-normal text-white text-center">In-App Facial Recognition</span>
              </div>
              <img src="/images/setup/arrow.svg" alt="icon" className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden" />
            </div> */}
            {Object.keys(UserData).length > 0 &&
              UserData?.user_type !== "client-hobbyist" ? (
              <div
                onClick={handelServices}
                className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
              >
                {!ServicesDataLoading ? (
                  <>
                    <img
                      src="/images/setup/setup-icon7.svg"
                      alt="img"
                      className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]"
                    />
                    <div className="flex items-center">
                      <span className="text-[14px] text-normal text-white text-center">
                        {t("setupprofile.ratesServices")}
                      </span>
                      {HourllyRate && Services ? (
                        ""
                      ) : (
                        <span style={{ color: "red" }}>*</span>
                      )}
                    </div>
                    <img
                      src="/images/setup/arrow.svg"
                      alt="icon"
                      className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden"
                    />
                  </>
                ) : (
                  <Loading className="!w-[20px] !h-[20px] mb-[-5px] ml-[10px] !border-2" />
                )}
              </div>
            ) : null}
            <div
              onClick={handelCalander}
              className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
            >
              {Object.keys(UserData).length > 0 ? (
                <>
                  <img
                    src="/images/setup/setup-icon8.svg"
                    alt="img"
                    className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]"
                  />
                  <div className="flex items-center">
                    <span className="text-[14px] text-normal text-white text-center">
                      {t("setupprofile.calendar")}
                    </span>
                    {UserData?.vaiNowAvailable?.availableFrom ? (
                      ""
                    ) : (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </div>
                  <img
                    src="/images/setup/arrow.svg"
                    alt="icon"
                    className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden"
                  />
                </>
              ) : (
                <Loading className="!w-[20px] !h-[20px] mb-[-5px] ml-[10px] !border-2" />
              )}
            </div>
            <div
              onClick={handelDateGiardSetup}
              className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
            >
              {Object.keys(UserData).length > 0 ? (
                <>
                  <img
                    src="/images/setup/setup-icon9.svg"
                    alt="img"
                    className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]"
                  />
                  <div className="flex items-center">
                    <span className="text-[14px] text-normal text-white text-center">
                      {t("setupprofile.dateGuard")}
                    </span>
                    {UserData?.dateGuardActivity ? (
                      ""
                    ) : (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </div>
                  <img
                    src="/images/setup/arrow.svg"
                    alt="icon"
                    className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden"
                  />
                </>
              ) : (
                <Loading className="!w-[20px] !h-[20px] mb-[-5px] ml-[10px] !border-2" />
              )}
            </div>
            <div
              onClick={handelSocial}
              className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
            >
              {!SocialDataLoading ? (
                <>
                  <img
                    src="/images/setup/setup-icon10.svg"
                    alt="img"
                    className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]"
                  />
                  <div className="flex items-center">
                    <span className="text-[14px] text-normal text-white text-center">
                      {t("setupprofile.social")}
                    </span>
                    {!SocialData?.socialData?.find((item) => item)?.message ? (
                      ""
                    ) : (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </div>
                  <img
                    src="/images/setup/arrow.svg"
                    alt="icon"
                    className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden"
                  />
                </>
              ) : (
                <Loading className="!w-[20px] !h-[20px] mb-[-5px] ml-[10px] !border-2" />
              )}
            </div>
            <div
              onClick={handelIncallAddress}
              className=" relative setup-card sm:hover:scale-[1.02] sm:hover:border-[#ffffff7a] border border-transparent transition-all duration-200 cursor-pointer sm:max-w-[384px] w-full sm:min-h-[114px] rounded-[8px] sm:bg-[#FFFFFF29] sm:py-[24px] py-[15px] flex items-center sm:justify-center sm:flex-col gap-[12px]"
            >
              {!UserDetailsLoading ? (
                <>
                  <img
                    src="/images/setup/setup-icon11.svg"
                    alt="img"
                    className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]"
                  />
                  <div className="flex items-center">
                    <span className="text-[14px] text-normal text-white text-center">
                      {t("setupprofile.incall")}
                    </span>
                    {UserData?.incallAddresses?.length > 0 ? (
                      ""
                    ) : (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </div>
                  <img
                    src="/images/setup/arrow.svg"
                    alt="icon"
                    className="absolute w-[20px] h-[20px] top-[16px] right-[0px] sm:hidden"
                  />
                </>
              ) : (
                <Loading className="!w-[20px] !h-[20px] mb-[-5px] ml-[10px] !border-2" />
              )}
            </div>
          </div>
          <div className="flex-1 w-full h-fit mx-auto max-w-[500px] sm:mt-[48px] mt-[24px]">
            <Button
              disabled={
                !UserData?.language ||
                !UserData?.gender ||
                !UserData?.mutualContractSigned ||
                !UserData?.varipayActivity ||
                !HourllyRate ||
                !Services ||
                !UserData?.vaiNowAvailable?.availableFrom ||
                !UserData?.dateGuardActivity ||
                !GallaryData?.userGallary?.images?.length > 0 ||
                SocialData?.socialData?.find((item) => item)?.message == "User socials information not found." ||
                !UserData?.incallAddresses?.length > 0
              }
              text={t("setupprofile.homeButton")}
              onClick={() => navigate("/featured")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SetupProfile;
