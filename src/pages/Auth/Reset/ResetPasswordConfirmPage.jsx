import React, { useState } from "react";
import InputText from "../../../components/InputText";
import Button from "../../../components/Button";
import InputPassword from "../../../components/InputPassword";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { VerifyResetPassword } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
import BackButton from "../../../components/BackButton/backArrowButton";
import { useTranslation } from "react-i18next";

export default function ResetPasswordConfirmPage() {
  const { state: UserEmail } = useLocation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const dispatch = useDispatch();
  const [password, setPassword] = useState("password");
  const [confirmPassword, setConfirmPassword] = useState("password");
  const [userpass, setUserPass] = useState("");
  const [userconfirmPass, setUserConfirmPass] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState({});

  const navigate = useNavigate();

  const handleShowPassword = (type) => {
    if (type == "password") {
      if (password == "password") {
        setPassword("text");
      } else if (password == "text") {
        setPassword("password");
      }
    } else if (type == "confirmPassword") {
      if (confirmPassword == "password") {
        setConfirmPassword("text");
      } else if (confirmPassword == "text") {
        setConfirmPassword("password");
      }
    }
  };

  const handleChangePassword = () => {
    setIsLoading(true);
    const body = {
      email: UserEmail,
      newPassword: userpass,
    };

    // Validate fields
    const validationErrors = {};
    // if (!oldPassword) {
    //   validationErrors.oldPassword = "Old Password is required";
    // }
    if (!userpass) {
      validationErrors.userpass = "Password is required";
    }
    if (!userconfirmPass || userconfirmPass !== userpass) {
      validationErrors.userconfirmPass = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setIsLoading(false);
      return; // Prevent form submission if there are errors
    }

    // Clear any previous errors
    setError({});

    dispatch(VerifyResetPassword(body))
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result.payload.data.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setIsLoading(false);
          navigate("/login");
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

    // navigate("/client-get-vai");
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
          <div >

            <div className="grid grid-cols-12 gap-4 lg:mt-[72px] sm-mt-[40px] mt-[30px] items-center">
              <div className="lg:col-span-5 col-span-12">
                <img src="/images/signup/new-password.svg" alt="Reset Password" className="mx-auto sm:!max-w-[320px] max-w-[176px]" />
              </div>
              <div className="lg:pr-[12px] lg:col-span-6 col-span-12">
                <h6 className="lg:text-[28px] sm:text-2xl text-xl font-semibold text-white mb-2 lg:text-left text-center">
                  {t("resetPasswordConfirm.title")}
                </h6>
                <p className=" lg:text-lg sm:text-base text-sm text-white font-normal opacity-[0.7] mb-2 lg:text-left text-center ">
                   {t("resetPasswordConfirm.subtitle")}
                </p>
                <div className="flex-1 flex flex-col justify-between mt-8">
                  <div>
                    {
                      // <div className="mb-12">
                      //   <InputText
                      //     placeholder={"Enter Old Password"}
                      //     border={error.oldPassword && `#ef4444`}
                      //     className="text-[20px] font-bold"
                      //     onChange={(e) => setOldPassword(e.target.value)}
                      //     size={"45px"}
                      //   />
                      //   {error.oldPassword && (
                      //     <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                      //       {error.oldPassword}
                      //     </label>
                      //   )}{" "}
                      // </div>
                    }
                    <div className="mb-6">
                      <InputPassword
                        placeholder={t("resetPasswordConfirm.newPasswordPlaceholder")}
                        onChange={(e) => setUserPass(e.target.value)}
                        border={error.userpass && `#ef4444`}
                        className="w-full bg-transparent text-[20px] border-[1px] border-[#919EAB33] hover:!border-[#919EAB33] py-[16px] px-[0px] input-password rounded-[8px] text-sm  font-normal"
                        size={"45px"}
                        type={password}
                        showPassword={() => handleShowPassword("password")}
                      />
                      {error.userpass && (
                        <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                          {error.userpass}
                        </label>
                      )}{" "}
                    </div>

                    <div className="mb-9">
                      <InputPassword
                       placeholder={t("resetPasswordConfirm.confirmPasswordPlaceholder")}
                        onChange={(e) => setUserConfirmPass(e.target.value)}
                        className="w-full bg-transparent text-[20px] border-[1px] border-[#919EAB33] hover:!border-[#919EAB33] py-[16px] px-[0px] input-password rounded-[8px] text-sm  font-normal"
                        size={"45px"}
                        type={confirmPassword}
                        showPassword={() => handleShowPassword("confirmPassword")}
                        border={error.userconfirmPass && `#ef4444`}
                      />
                      {error.userconfirmPass && (
                        <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                          {error.userconfirmPass}
                        </label>
                      )}{" "}
                    </div>
                  </div>
                  <div>
                    <Button
                    disabled={isLoading}
                      text={
                        !isLoading ? (
                           t("resetPasswordConfirm.changePasswordButton")
                        ) : (
                          <div className="flex items-center	justify-center">
                            <Loading />
                          </div>
                        )
                      }
                      onClick={() => handleChangePassword()}
                    />
                    {/* <div className="w-[80%] mx-auto mt-4">
                  <a className="text-blue-700 text-[15px] font-extrabold" href="#">
                    If you do not receive your code in 60 seconds click this link to
                    resend
                  </a>
                </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
