import React, { useState } from "react";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ResetPassword } from "../../redux/action/Auth";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Index";
import UserService from "../../services/userServices";
import BackButton from "../../components/BackButton/backArrowButton";
import LayoutHeader from "../layout/Header";
import Footer from "../layout/Footer";

export default function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const navigate = useNavigate();
  const { state } = useLocation();
  const [cpassword, setcPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rpassword, setrPassword] = useState("");

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const handleOTP = async () => {
    if (!cpassword || !password || !rpassword) {
      toast.error("Please enter all details");
      return;
    }

    if (password !== rpassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    UserService.changePassword(UserData?._id, {
      currentPassword: cpassword,
      newPassword: password,
    })
      .then(() => {
        toast("Password changed successfully", {
          hideProgressBar: true,
          autoClose: 1000,
          type: "success",
        });
        setIsLoading(false);
        navigate("/settings/manage-profile");
      })
      .catch((err) => {
        setIsLoading(false);
        toast(err?.response?.data?.error, {
          hideProgressBar: true,
          autoClose: 1000,
          type: "error",
        });
        console.error(err, "Error");
      });
  };
  return (
    <>
      {state?.from == "settings" ? (
        <>
          <div className="sm:block"><LayoutHeader /></div>
          <div className="container mb-[150px]">

            <div className=''>
              <div className=''>
                <div className='border-none'>
                  <div className="sm:my-[48px] mt-[24px] w-full">
                    <h2 className="sm:text-[28px] text-2xl text-white font-semibold text-center sm:block hidden">Change Password</h2>
                  </div>


                  <div className="mt-[64px]">
                    <h4 className='sm:text-[28px] text-[24px] font-semibold text-white'>Old Password</h4>
                    <h5 className='sm:text-[18px] text-[16px] font-normal text-white opacity-70'>Enter old password to change new password</h5>
                    <div className="my-[24px] w-full">

                      <InputText
                        className={"text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"}
                        placeholder={"Old Password"}
                        onChange={(e) => setcPassword(e.target.value)}
                        value={cpassword}
                        type={"password"}
                      />
                    </div>
                    <h4 className='sm:text-[28px] text-[24px] font-semibold text-white'>Create New Password</h4>
                    <h5 className='sm:text-[18px] text-[16px] font-normal text-white opacity-70'>Your new password must be different from any of your previous password</h5>
                    <div className="my-[24px] flex items-center lg:flex-nowrap flex-wrap gap-[20px] w-full">
                      <InputText
                        className={"text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"}
                        placeholder={"New Password"}
                        type={"password"}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                      <InputText
                        className={"text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"}
                        placeholder={"Confirm Password"}
                        type={"password"}
                        onChange={(e) => setrPassword(e.target.value)}
                        value={rpassword}
                      />
                    </div>
                    <div className="flex justify-center w-full max-w-[500px] mx-auto">
                      <Button
                        text={
                          !isLoading ? (
                            "Save Password"
                          ) : (
                            <div className="flex items-center	justify-center pt-[6px]">
                              <Loading />
                            </div>
                          )
                        }
                        disabled={isLoading}
                        onClick={() => handleOTP()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer from="settings" />
        </>
      ) : (
        <div className='signup-backgound-design'>
          <div className='signup-container container'>
            <div className='signup-content relative'>
              <div className="backnavigation"><BackButton /></div>
              <div className="logo-img-container">
                <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
                <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
              </div>


              <div className="mt-[64px]">
                <h4 className='sm:text-[28px] text-[24px] font-semibold text-white'>Change Password</h4>
                <h5 className='sm:text-[18px] text-[16px] font-normal text-white opacity-70'>Enter old password to change new password</h5>
                <div className="my-[24px] w-full">

                  <InputText
                    className={"text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"}
                    placeholder={"Current Password"}
                    onChange={(e) => setcPassword(e.target.value)}
                    value={cpassword}
                    type={"password"}
                  />
                </div>
                <h4 className='sm:text-[28px] text-[24px] font-semibold text-white'>Create New Password</h4>
                <h5 className='sm:text-[18px] text-[16px] font-normal text-white opacity-70'>Your new password must be different from any of your previous password</h5>
                <div className="my-[24px] flex items-center lg:flex-nowrap flex-wrap gap-[20px] w-full">
                  <InputText
                    className={"text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"}
                    placeholder={"New Password"}
                    type={"password"}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <InputText
                    className={"text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"}
                    placeholder={"Confirm Password"}
                    type={"password"}
                    onChange={(e) => setrPassword(e.target.value)}
                    value={rpassword}
                  />
                </div>
                <div className="flex justify-center w-full max-w-[500px] mx-auto">
                  <Button
                    text={
                      !isLoading ? (
                        "Save Password"
                      ) : (
                        <div className="flex items-center	justify-center pt-[6px]">
                          <Loading />
                        </div>
                      )
                    }
                    disabled={isLoading}
                    onClick={() => handleOTP()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </>
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
            Change password
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between mt-10">
        <div>
          <div className="mb-4">
            <InputText
              className={"text-[20px] font-bold"}
              placeholder={"Current Password"}
              onChange={(e) => setcPassword(e.target.value)}
              value={cpassword}
              // border={error.email && `#ef4444`}
              type={"password"}
            />
          </div>

          <div className="mt-4">
            <InputText
              className={"text-[20px] font-bold"}
              placeholder={"New Password"}
              type={"password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              // border={error.number && `#ef4444`}
            />
          </div>

          <div className="mt-4">
            <InputText
              className={"text-[20px] font-bold"}
              placeholder={"Confirm Password"}
              type={"password"}
              onChange={(e) => setrPassword(e.target.value)}
              value={rpassword}
              // border={error.number && `#ef4444`}
            />
          </div>
        </div>
        <Button
          className={
            "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[26px] font-bold mt-10 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
          }
          text={
            !isLoading ? (
              "Submit"
            ) : (
              <div className="flex items-center	justify-center pt-[6px]">
                <Loading />
              </div>
            )
          }
          size={"45px"}
          disabled={isLoading}
          onClick={() => handleOTP()}
        />
      </div>
    </div> */}