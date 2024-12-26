/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { VerifyOTP } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
import OtpInput from "react-otp-input";
import { HandleGetProfile } from "../../../redux/action/Profile";
import { HandleLogIn, SendOTP } from "../../../redux/action/Auth";

export default function OTPVerificationPage() {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const OTPEmail = useSelector((state) => state?.Auth?.OTPEmail);
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   dispatch(HandleGetProfile(UserDetails?._id));
  //   console.log("otp page profile data get user id", UserDetails?._id);
  // }, [UserDetails]);

  const submitOtp = () => {
    // Validate fields
    setIsLoading(true);
    const validationErrors = {};
    if (!otp) {
      validationErrors.otp = "OTP is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage(validationErrors);
      setIsLoading(false);
      return; // Prevent form submission if there are errors
    }

    // Clear any previous errors
    setErrorMessage({});
    const body = {
      email: state?.login ? state?.email : OTPEmail,
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
          setIsLoading(false);
          if (state?.login) {
            if (state?.usertype === "agency-business") {
              navigate("/business/community");
            } else {
              if (
                !!UserDetails?.vaiNowAvailable?.availableFrom &&
                UserDetails?.personalInformation?.isPersonalInfoUpdated &&
                UserDetails?.incallAddresses?.length > 0
              ) {
                navigate("/featured");
              } else {
                toast(
                  "Please complete your profile by filling in the following information: Personal Details, Calendar, and In-call Addresses."
                );
                // navigate("/setup");
                // navigate("/get-vai");
                navigate("/setup-face-verification");
              }
            }
          } else {
            navigate("/otp-congratulations");
          }
          // navigate("/get-vai");
        } else {
          setIsLoading(false);
          setError(true);
          toast.error("Incorrect OTP!");
          setOtp("");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err, "Error");
        toast.error("Something went wrong!");
        setOtp("");
      });
  };
  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleResendOtp = () => {
    setError(false);
    let body = { email: state?.login ? state?.email : OTPEmail, password: state?.password };

    dispatch(HandleLogIn(body))
      .then(async (result) => {
        if (result?.payload?.status === 200) {
          toast("OTP send successfully", {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setIsLoading(false);
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
  }

  return (
    <div className="main-container flex flex-col form-field-container">
      <div className="mx-auto mt-20 py-2">
        <img src={"/images/loginAvatar.png"} alt="Login Image" />
      </div>
      <div className="flex-1 mx-auto">
        {!error ? (
          <div className="verification-result">
            <span className="text-[22.5px] font-light">
              "OTP has been sent to your register Email & Number"
            </span>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-red-500 verification-bad-result">
            <span className="text-[18px] font-light">
              "The Code you have entered is incorrect please try again or click
              here to"
            </span>
            {/* <a href="#" className="text-black text-[22px] font-bold">
              resend
            </a> */}
            <button className="text-black text-[22px] font-bold" onClick={handleResendOtp}>
              resend
            </button>
          </div>
        )}
        <div className="flex flex-row justify-center items-center text-center mt-12 otp-field-collection">
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            numInputs={6}
            renderSeparator={<span> </span>}
            renderInput={(props) => (
              <input
                {...props}
                className={`flex-1 mr-2 border-2 bg-[#d5d6e0] h-14 w-9 text-center form-control otp_input bg-transparent text-[30px] "
            type="text`}
                style={{
                  borderColor: errorMessage.otp ? `#ef4444` : "#0247FF",
                }}
              />
            )}
          />
        </div>
        {errorMessage.otp && (
          <label className="text-red-500 text-sm flex items-baseline  pt-[2px]">
            {errorMessage.otp}
          </label>
        )}
      </div>
      <div className="mt-8 mb-4">
        <Button
          className={
            "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
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
          size="45px"
          onClick={submitOtp}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
