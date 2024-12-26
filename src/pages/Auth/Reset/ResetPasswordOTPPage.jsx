import React, { useState } from "react";
import InputText from "../../../components/InputText";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { VerifyOTP } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";

export default function ResetPasswordotpPage() {
  const navigate = useNavigate();
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
          toast("OTP verify successfully", {
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
    <div className="main-container flex flex-col justify-center form-field-container">
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
    </div>
  );
}
