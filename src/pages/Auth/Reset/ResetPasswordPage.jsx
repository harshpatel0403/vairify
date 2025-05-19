import React, { useState } from "react";
import InputText from "../../../components/InputText";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ResetPassword } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
import BackButton from "../../../components/BackButton/backArrowButton";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [details, setDetails] = useState({});
  const [error, setError] = useState("");

  const handleOTP = () => {
    setIsLoading(true);
    // Validate fields
    const validationErrors = {};
    if (!details?.email && !details?.number) {
      validationErrors.email = t("resetPassword.emailRequired");
      validationErrors.number = t("resetPassword.emailOrPhoneRequired");
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setIsLoading(false);
      return; // Prevent form submission if there are errors
    }
    // Clear any previous errors
    setError({});

    dispatch(ResetPassword(details))
      .then(async (result) => {
        if (result?.payload?.status === 200) {
          toast(t("resetPassword.otpSent"), {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setIsLoading(false);
          navigate("/reset-password-otp", {
            state: details?.email,
          });
        } else {
          setIsLoading(false);
          toast(result?.payload?.data?.message, {
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
        <div className="signup-content  relative">
          <div className="backnavigation"><BackButton /></div>
          <div className="logo-img-container">
            <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
            <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
          </div>
          <div className="grid grid-cols-12 gap-4 lg:mt-[72px] sm-mt-[40px] mt-[30px] items-center">
            <div className="lg:col-span-5 col-span-12">
              <img src="/images/signup/reset-password.svg" alt="Reset Password" className="mx-auto sm:!max-w-[320px] max-w-[176px]" />
            </div>
            <div className="lg:pr-[12px] lg:col-span-6 col-span-12">
              <div className="">
                <h6 className="lg:text-[28px] sm:text-2xl text-xl font-semibold text-white mb-2 lg:text-left text-center">
                  {t("resetPassword.title")}
                </h6>
                <p className=" lg:text-lg sm:text-base text-sm text-white font-normal opacity-[0.7] mb-2 lg:text-left text-center ">
                  {t("resetPassword.subtitle")}
                </p>
              </div>
              <div className="flex flex-col justify-between mt-10">
                <div>
                  <div className="mb-4">
                    <InputText
                      className="text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"
                      placeholder={t("resetPassword.emailPlaceholder")}
                      onChange={(e) =>
                        setDetails({ ...details, email: e.target.value })
                      }
                      border={error.email && `#ef4444`}
                      type={"email"}
                    />

                  </div>

                  <div className="divider">
                    <div className="divider-line"></div>
                    <div className="divider-or flex justify-center">
                      <span className="text-white text-center">{t("resetPassword.or")}</span>
                    </div>
                    <div className="divider-line"></div>
                  </div>

                  <div className="mt-4">
                    <InputText
                      className="text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"
                      placeholder={t("resetPassword.phonePlaceholder")}
                      type={"number"}
                      onChange={(e) =>
                        setDetails({ ...details, number: e.target.value })
                      }
                      border={error.number && `#ef4444`}
                    />
                    {error.number && (
                      <label className="text-red-500 mt-3 text-lg flex items-baseline pl-[12px] pt-[2px]">
                        {error.number}
                      </label>
                    )}
                  </div>
                </div>
                <Button
                disabled={isLoading}
                  className='w-full mt-[24px]'
                  text={
                    !isLoading ? (
                      t("resetPassword.sendOtp")
                    ) : (
                      <div className="flex items-center	justify-center">
                        <Loading />
                      </div>
                    )
                  }
                  onClick={() => handleOTP()}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
