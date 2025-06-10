import Button from "../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import PageTitle from "../../components/PageTitle";
import { useTranslation } from "react-i18next";

export default function BusinessProfileQRCode() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log("States of qr: ", state);
  const handleNext = () => {
    navigate("/my-vairipay");
  };
  const handleAddMore = () => {
    navigate("/vairipay-search");
  };
  return (
    <>
      <div className="container">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={t("businessprofileqr.pageTitle")} />
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-[24px]">
          <div className="w-full bg-white flex items-center justify-center sm:rounded-[16px] rounded-[8px] max-w-[588px] sm:h-[360px] h-[165px]">
            <img
              src={
                import.meta.env.VITE_APP_API_USER_VARIPAY_IMAGE_URL +
                `/${state?.state?.image}`
              }
              alt="Cash App"
            />
          </div>
          <div className="flex items-center justify-center flex-col w-full gap-[24px]">
            <h4 className="font-medium sm:text-[28px] text-[24px] text-white text-center">{t("businessprofileqr.qrTitle")}</h4>
            <div>
              <img
                src={`${state?.image}`}
                className="w-[200px] h-[200px]"
                alt="QR Code"
              />
            </div>
            <p className="font-medium text-[24px] text-[#008F34] text-center flex items-center gap-2 ">{t("businessprofileqr.uploadSuccess")} <img src="/images/setup/confirm-check.svg" alt="icon" /></p>
          </div>
        </div>
        <div className="flex items-center justify-center flex-col w-full max-w-[500px] gap-[24px] mx-auto my-[48px]">
          {/* <Button
            onClick={handleAddMore}
            text={t("businessprofileqr.addMore")}
            size="45px"
          /> */}
          <Button
            onClick={handleNext}
            text={t("businessprofileqr.finished")}
            size="45px"
          />
        </div>
      </div>

      {/* <div className="main-container h-full form-field-container flex flex-col justify-between">
      <div className="pt-10 flex flex-col justify-between items-center w-full mx-auto">
        <div className="w-full mx-auto flex items-center justify-center">
          <img
            src={import.meta.env.BASE_URL + "images/VairipayAddLogo.png"}
            alt="Vairipay Add Logo"
          />
        </div>
        <div className="w-full flex items-center justify-center flex-1">
          <div className="flex items-center justify-center mt-5 w-[138px] h-[125px] bg-[#3760CB] border-2 border-white rounded-xl">
            <img
              src={
                import.meta.env.VITE_APP_API_USER_VARIPAY_IMAGE_URL +
                `/${state?.state?.image}`
              }
              alt="Cash App"
            />
          </div>
        </div>
        <div className="flex-1 mt-8 w-full">
          <div className="text-custom-22 flex flex-col justify-center items-start">
            <span className="font-semibold">QR Code:</span>
          </div>
          <div className="mt-custom-10 flex flex-col justify-center items-center mt-5">
            <img
              src={`${state?.image}`}
              className="w-[190px] h-[190px] border-2 border-white rounded-md"
              alt="QR Code"
            />
          </div>
          <div className="mt-4 flex flex-col justify-center items-center">
            <img
              src={import.meta.env.BASE_URL + "images/CheckMark.png"}
              alt="Check Mark"
            />
          </div>
        </div>
        <div className="w-full flex justify-center mt-4 mb-6 gap-4">
          <Button
            onClick={handleAddMore}
            className={
              "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-extrabold text-[21.38px] py-2 "
            }
            text={"Add More"}
            size="45px"
          />
          <Button
            onClick={handleNext}
            className={
              "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-extrabold text-[21.38px] py-2 "
            }
            text={"Finished"}
            size="45px"
          />
        </div>
      </div>
    </div> */}
    </>

  );
}
