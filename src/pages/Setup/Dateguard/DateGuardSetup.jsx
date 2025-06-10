import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button";
import Header from "../../../components/Header/Header";
import PageTitle from "../../../components/PageTitle";
const DateGuardSetup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handelEditCodes = () => {
    navigate("/dateguard/codes");
  };
  const handelGroups = () => {
    navigate("/dateguard/select-group");
  };

  const handleActivate = () => {
    navigate("/dateguard/select-appointment");
  };

  return (

    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={t("dateguardsetup.pageTitle")} />
      </div>
      <div className="flex items-center justify-center">
        <img src="/images/setup/dateguard.svg" alt="guard" />
      </div>
      <div className="max-w-[500px] mx-auto mb-[48px]">
        <div className="sm:mt-[24px] mt-[16px]">
          <Button
            onClick={handleActivate}
            text={t("dateguardsetup.activateButton")}
          />
        </div>
        <div className="sm:mt-[24px] mt-[16px]">
          <Button
            onClick={handelGroups}
            text={t("dateguardsetup.editGroupsButton")}
          />
        </div>
        <div className="sm:mt-[24px] mt-[16px]">
          <Button
            onClick={handelEditCodes}
            text={t("dateguardsetup.editCodesButton")}
          />
        </div>
      </div>
    </div >


    // <div className="main-container flex flex-col justify-start form-field-container">
    //   <div className="w-full mx-auto flex justify-center items-center mt-4">
    //     <span className="font-bold text-[34px] text-[#05B7FD] change-font-family">
    //       Date Guard
    //     </span>
    //   </div>
    //   <div className="flex-1 w-full mx-auto flex items-center justify-center">
    //     <div className="w-[190px] mt-4">
    //       <img className="w-full" src={`/images/SetupBusinessProfile.png`} />
    //     </div>
    //   </div>

    // <div className="mt-10">
    //   <Button
    //     onClick={handleActivate}
    //     text={"Activate"}
    //     className="bg-gradient-to-b from-[#4200FF] to-[#4200FF] text-white border-2 border-white h-[62.1px] font-medium text-[36px] change-font-family"
    //   />
    // </div>
    // <div className="mt-10">
    //   <Button
    //     onClick={handelGroups}
    //     text={"Edit Groups"}
    //     className="bg-gradient-to-b from-[#4200FF] to-[#4200FF] text-white border-2 border-white h-[62.1px] font-medium text-[36px] change-font-family"
    //   />
    // </div>
    // <div className="mt-10">
    //   <Button
    //     onClick={handelEditCodes}
    //     text={"Edit Codes"}
    //     className="bg-gradient-to-b from-[#4200FF] to-[#4200FF] text-white border-2 border-white h-[62.1px] font-medium text-[36px] change-font-family"
    //   />
    // </div>
    // </div>
  );
};

export default DateGuardSetup;
