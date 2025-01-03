import { useSelector } from "react-redux";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import Loading from "../../components/Loading/Index";
const SetupProfile = () => {
  const navigate = useNavigate();

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const UserProfile = useSelector((state) => state?.Profile);
  const CalendarSchedule = useSelector((state) => state?.Calendar?.getschedule);
  const GallaryData = useSelector((state) => state?.Gallary)
  const ServicesData = useSelector((state) => state?.Services?.getservices);
  const LanguagesData = useSelector((state) => state?.Auth?.language);
  const SocialData = useSelector((state) => state?.Social);

  const rateAndServices = useMemo(() => {
    let HourllyRate;
    let Services;

    if (UserData?.user_type == "client-hobbyist") {
      HourllyRate = true;
      Services = true;
    } else if (UserData?.user_type == "agency-business") {
      HourllyRate = ServicesData?.find((item) => item)?.hourlyRates?.length > 0;
      Services = true;
    } else if (UserData?.user_type == "companion-provider") {
      HourllyRate = ServicesData?.find((item) => item)?.hourlyRates?.length > 0;
      Services = ServicesData?.find((item) => item)?.services?.length > 0;
    } else if (UserData?.user_type == "influencer-affiliate") {
      HourllyRate = ServicesData?.find((item) => item)?.hourlyRates?.length > 0;
      Services = ServicesData?.find((item) => item)?.services?.length > 0;
    }
    return HourllyRate || Services
  }, [ServicesData, UserData]);

  console.log(
    "🚀 ~ file: SetupProfile.jsx:8 ~ SetupProfile ~ UserData:",
    UserData
  );

  const handleLanguage = () => {
    navigate("/language", { state: { from: "/setup" } });
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
    navigate("/dateguard-setup");
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
  const handelUploadProfile = () => {
    navigate("/uploadProfile");
  };

  const handelSetupFacial = () => {
    navigate("/setup-facial");
  };

  return (
    <div className="main-container pt-8 pb-3">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="congratulation-title mb-2">
          <span className="text-[#040b47] !text-[25px] font-bold">
            Congratulations!
          </span>

          <span className="text-[#0636C1] !text-[25px] font-bold ml-1">
            {UserData?.name}
          </span>
        </div>
        <div>
          <span className="text-black">Your Verification was successful</span>
        </div>
      </div>
      <div className="w-full mx-auto flex flex-col justify-center items-start mb-6">
        <div className="w-full mx-auto flex flex-col justify-center items-center cong-time-setup mt-2">
          <span className="text-black text-[22px] font-bold">
            Time to set up your profile
          </span>
        </div>
        <div className="w-full">
          <div className="w-full mt-4">
            <Button
              onClick={handleLanguage}
              text={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Language</span>
                  {UserData || LanguagesData ?
                    (
                      LanguagesData || UserData?.language ?
                        ("") :
                        (<span style={{ color: "red" }}>*</span>)

                    ) :
                    (<Loading />)
                  }
                </div>
              }
              className="btn-res max-w-[400px] mx-auto text-[20px] text-bold text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] px-5 py-2 border-2 border-gray-300"
            />
          </div>
          <div className="w-full mt-4">
            <Button
              onClick={handelPersonalProfile}
              text={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Personal Profile</span>
                  {UserProfile ?
                    (
                      UserProfile?.profiledata?.orientation && UserProfile?.profiledata?.gender ?
                        ("") :
                        (<span style={{ color: "red" }}>*</span>)

                    ) :
                    (<Loading />)
                  }
                </div>
              }
              className="btn-res max-w-[400px] mx-auto text-[20px] text-bold text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] px-5 py-2 border-2 border-gray-300"
            />
          </div>
          <div className="w-full mt-4">
            <Button
              onClick={handelUploadProfile}
              text={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Upload Profile Pic</span>
                  {UserData ?
                    (
                      UserData?.profilePic != "" && UserData?.profilePic !== undefined ?
                        ("") :
                        (<span style={{ color: "red" }}>*</span>)

                    ) :
                    (<Loading />)
                  }
                </div>
              }
              className="btn-res max-w-[400px] mx-auto text-[20px] text-bold text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] px-5 py-2 border-2 border-gray-300"
            />
          </div>
          <div className="w-full mt-4">
            <Button
              onClick={handecontract}
              text={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Mutual Consent Contract</span>
                  {UserData ?
                    (
                      UserData?.mutualContractSigned ?
                        ("") :
                        (<span style={{ color: "red" }}>*</span>)

                    ) :
                    (<Loading />)
                  }
                </div>
              }
              className="btn-res max-w-[400px] mx-auto text-[20px] text-bold text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] px-5 py-2 border-2 border-gray-300"
            />
          </div>
          <div className="w-full mt-4">
            <Button
              onClick={handelVaripays}
              text={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>VAIRIPAY</span>
                  {UserData ?
                    (
                      UserData?.varipayActivity ?
                        ("") :
                        (<span style={{ color: "red" }}>*</span>)

                    ) :
                    (<Loading />)
                  }
                </div>
              }
              className="btn-res max-w-[400px] mx-auto text-[20px] text-bold text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] px-5 py-2 border-2 border-gray-300"
            />
          </div>
          <div className="w-full mt-4">
            <Button
              onClick={handelPhotoGallery}
              text={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Gallery Photo</span>
                  {GallaryData ?
                    (
                      GallaryData?.userGallary?.images?.length > 0 ?
                        ("") :
                        (<span style={{ color: "red" }}>*</span>)

                    ) :
                    (<Loading />)
                  }
                </div>
              }
              className="btn-res max-w-[400px] mx-auto text-[20px] text-bold text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] px-5 py-2 border-2 border-gray-300"
            />
          </div>
          <div className="w-full mt-4">
            <Button
              onClick={handelSetupFacial}
              text="In-App Facial Recognition"
              className="btn-res max-w-[400px] mx-auto text-[20px] text-bold text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] flex flex-row justify-start items-center px-5 py-3 border-2 border-gray-300"
            />
          </div>
          {UserData?.user_type !== "client-hobbyist" ? (
            <>
              {" "}
              <div className="w-full mt-4">
                <Button
                  onClick={handelServices}
                  text={
                    <>
                      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
                        <span>Rates/Services</span>
                        {rateAndServices ?
                          ("") :
                          (<span style={{ color: "red" }}>*</span>)
                        }
                      </div>
                    </>
                  }
                  className="btn-res max-w-[400px] mx-auto text-[20px] text-bold text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] px-5 py-2 border-2 border-gray-300"
                />
              </div>{" "}
            </>
          ) : null}

          <div className="w-full mt-4">
            <Button
              onClick={handelCalander}
              text={
                <>
                  <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
                    <span>Calender</span>
                    {CalendarSchedule ?
                      (
                        CalendarSchedule?.schedule.length > 0 ?
                          ("") :
                          (<span style={{ color: "red" }}>*</span>)

                      ) :
                      (<Loading />)
                    }
                  </div>
                </>
              }
              className="btn-res max-w-[400px] mx-auto text-[20px] text-bold text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] px-5 py-2 border-2 border-gray-300"
            />
          </div>
          <div className="w-full mt-4">
            <Button
              onClick={handelDateGiardSetup}
              text={
                <>
                  <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
                    <span>DateGuard</span>
                    {UserData ?
                      (
                        UserData?.dateGuardActivity ?
                          ("") :
                          (<span style={{ color: "red" }}>*</span>)

                      ) :
                      (<Loading />)
                    }
                  </div>
                </>
              }
              className="btn-res max-w-[400px] mx-auto text-[20px] text-bold text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] px-5 py-2 border-2 border-gray-300"
            />
          </div>
          <div className="w-full mt-4">
            <Button
              onClick={handelSocial}
              text={
                <>
                  <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
                    <span>Social</span>
                    {SocialData ?
                      (
                        !SocialData?.socialData?.find((item) => item)?.message ?
                          ("") :
                          (<span style={{ color: "red" }}>*</span>)

                      ) :
                      (<Loading />)
                    }
                  </div>
                </>
              }
              className="btn-res max-w-[400px] mx-auto text-[20px] text-bold text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] px-5 py-2 border-2 border-gray-300"
            />
          </div>
          <div className="w-full mt-4">
            <Button
              onClick={handelIncallAddress}
              text={
                <>
                  <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
                    <span>Incall Addresses</span>
                    {UserData ?
                      (
                        UserData?.incallAddresses.length > 0 ?
                          ("") :
                          (<span style={{ color: "red" }}>*</span>)

                      ) :
                      (<Loading />)
                    }
                  </div>
                </>
              }
              className="btn-res max-w-[400px] mx-auto text-[20px] text-bold text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] px-5 py-2 border-2 border-gray-300"
            />
          </div>
          <div className="w-full mt-4">
            <div className="px-6 w-full pt-2.5 pb-3.5 mt-5">
              <button
                onClick={() => navigate("/featured")}
                className=" bg-gradient-to-t max-w-[400px] px-1 w-full from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[30px] text-[#02227E] py-1 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
              >
                HOME
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupProfile;
