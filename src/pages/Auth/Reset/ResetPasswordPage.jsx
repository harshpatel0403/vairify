import React, { useState } from "react";
import InputText from "../../../components/InputText";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ResetPassword } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [details, setDetails] = useState({});
  const [error, setError] = useState("");

  const handleOTP = () => {
    setIsLoading(true);
    // Validate fields
    const validationErrors = {};
    if (!details?.email && !details?.number) {
      validationErrors.email = "Email is required";
      validationErrors.number = "Email OR Numbar is required";
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
          toast("OTP send successfully", {
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
      <div className="flex flex-col justify-between mt-10">
        <div>
          <div className="mb-4">
            <InputText
              className={"text-[20px] font-bold"}
              placeholder={"Enter Email"}
              onChange={(e) =>
                setDetails({ ...details, email: e.target.value })
              }
              border={error.email && `#ef4444`}
              type={"email"}
            />
            
          </div>

          <div className="divider">
            <div className="divider-line"></div>
            <div className="divider-or">
              <span>OR</span>
            </div>
            <div className="divider-line"></div>
          </div>

          <div className="mt-4">
            <InputText
              className={"text-[20px] font-bold"}
              placeholder={"Enter Phone"}
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
          className={
            "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[26px] font-bold mt-10 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
          }
          text={
            !isLoading ? (
              "Send OTP"
            ) : (
              <div className="flex items-center	justify-center pt-[6px]">
                <Loading />
              </div>
            )
          }
          size={"45px"}
          onClick={() => handleOTP()}
        />
      </div>
    </div>
  );
}
