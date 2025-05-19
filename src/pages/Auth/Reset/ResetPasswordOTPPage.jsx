import React, { useState } from "react";
import InputText from "../../../components/InputText";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { VerifyOTP } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
import BackButton from "../../../components/BackButton/backArrowButton";
import { useTranslation } from "react-i18next";

export default function ResetPasswordotpPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const { state: UserEmail } = useLocation();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleOTP = () => {
    setIsLoading(true);
    const validationErrors = {};
    if (!otp) {
      validationErrors.otp = "OTP is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setIsLoading(false);
      return; // Prevent form submission if there are errors
    }
    // Clear any previous errors
    setError({});
    const body = {
      email: UserEmail,
      otpCode: otp,
    };
    dispatch(VerifyOTP(body))
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(t("resetPasswordOtp.otpSuccess"), {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setIsLoading(true);
          navigate("/confirm/password", {
            state: UserEmail,
          });
        } else {
          setIsLoading(false);
          toast(result.payload.data.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "error",
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err, "Error");
      });
  };
  return (

    <div className="signup-backgound-design">
      <div className="signup-container container">
        <div className="signup-content relative">
          <div className="backnavigation"><BackButton /></div>
          <div className="logo-img-container">
            <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
            <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
          </div>


          <div className="main-container grid grid-cols-12 w-[100%] form-field-container mt-[64px]">
            <div className="lg:col-span-5 col-span-12">
              <div className="lg:block flex justify-center items-center">
                <img src={"/images/signup/otp-img.svg"} alt="otp Image" />
              </div>
            </div>
            <div className=" lg:col-span-7 col-span-12">
              <h4 className='sm:text-[28px] text-[24px] font-semibold text-white'>{t("resetPasswordOtp.title")}</h4>
              <h5 className='text-[18px] font-normal text-white opacity-80'>{t("resetPasswordOtp.subtitle")}</h5>
              <h5 className='text-[18px] font-normal text-white my-[24px]'>{t("resetPasswordOtp.otpSentMsg")}</h5>
              <div>
                <InputText
                   placeholder={t("resetPasswordOtp.enterOtpPlaceholder")}
                  className="text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] max-w-[500px] rounded-[8px]"
                  onChange={(e) => setOtp(e.target.value)}
                  border={error.otp && `#ef4444`}
                />
                {error.otp && (
                  <level className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                    {error.otp}
                  </level>
                )}
              </div>
              <div className="flex w-full h-fit justify-center mt-[24px] max-w-[500px]">
                <Button
                disabled={isLoading}
                  text={
                    !isLoading ? (
                      t("resetPasswordOtp.submitButton")
                    ) : (
                      <div className="flex items-center	justify-center">
                        <Loading />
                      </div>
                    )
                  }
                  onClick={() => handleOTP()}
                />
              </div>
              <div className="mt-3">
                <a className="text-[14px] font-normal text-white" href="#">
                  {t("resetPasswordOtp.resendLink")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>








  );
}


{/* <div className="main-container flex flex-col justify-center form-field-container">

      <div className="relative flex flex-col justify-start items-center">
        <div className="relative top-6">
          <img src={"/images/VectorLogo1.png"} alt="Vector Logo 1" />
        </div>
        <div className="relative bottom-2 left-4">
          <img src={"/images/VectorLogo2.png"} alt="Vector Logo 2" />
        </div>
        <div className="relative">
          <span className="font-bold text-[28.8px] text-black">
            Reset password
          </span>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between max-h-[500px]">
        <div className="mt-10 mb-0">
          <InputText
            placeholder={"Enter OTP"}
            className="mb-[11px] text-[20px] font-bold"
            onChange={(e) => setOtp(e.target.value)}
            border={error.otp && `#ef4444`}
          />
          {error.otp && (
            <level className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
              {error.otp}
            </level>
          )}
        </div>
        <div className="mt-8">
          <Button
            className={
              "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[26px] font-bold mt-16 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
            }
            size={"45px"}
            text={
              !isLoading ? (
                "Enter OTP"
              ) : (
                <div className="flex items-center	justify-center pt-[6px]">
                  <Loading />
                </div>
              )
            }
            onClick={() => handleOTP()}
          />
          <div className="w-[80%] mx-auto mt-5 mb-5">
            <a className="text-blue-700 text-[15px] font-extrabold" href="#">
              If you do not receive your code in 60 seconds click this link to
              resend
            </a>
          </div>
        </div>
      </div>
    </div> */}