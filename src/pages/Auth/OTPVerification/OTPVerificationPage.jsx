/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ResendOTP, VerifyOTP } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Loading from "../../../components/Loading/Index";
import OtpInput from "react-otp-input";
import moment from "moment";
import BackButton from "../../../components/BackButton/backArrowButton";


export default function OTPVerificationPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { state } = useLocation();
  const OTPEmail = useSelector((state) => state?.Auth?.OTPEmail);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [currentSubscriptionIndex, setCurrentSubscriptionIndex] = useState(0);

  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  function calculateDays(expiryDate) {
    const updatedExpiryDate = moment(expiryDate);
    const currentDate = moment();
    const daysRemaining = updatedExpiryDate.diff(currentDate, "days");
    return daysRemaining;
  }
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
              const usr = result?.payload?.data?.user;
              if (
                !!usr?.vaiNowAvailable?.availableFrom &&
                usr?.personalInformation?.isPersonalInfoUpdated &&
                usr?.incallAddresses?.length > 0
              ) {
                navigate("/featured");
              } else {
                toast(
                  "Please complete your profile by filling in the following information: Personal Details, Calendar, and In-call Addresses."
                );

                const latestMembershipSubscription = usr?.subscription[currentSubscriptionIndex];
                const latestKycSubscription = usr?.kyc[currentSubscriptionIndex];

                const membershipDaysRemaining = calculateDays(latestMembershipSubscription?.expiryDate)
                const kycDaysRemaining = calculateDays(latestKycSubscription?.expiryDate)

                // TODO: rewrite this logic if needed
                if (usr?.faceVerificationImage !== "") {
                  if (membershipDaysRemaining && kycDaysRemaining) {
                    if (usr?.isKycCompleted) {
                      navigate("/featured");
                    } else {
                      // navigate("/vai");
                      navigate('/setup')
                    }
                  } else {
                    navigate("/get-vai")
                  }
                  if (kycDaysRemaining <= 0 && membershipDaysRemaining <= 0) {
                    setCurrentSubscriptionIndex((prevIndex) => prevIndex + 1);
                  }
                  // if(usr?.isKycCompleted){}
                } else {
                  navigate("/setup-face-verification");
                }
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
    let body = { email: state?.login ? state?.email : OTPEmail, login: state?.login };

    dispatch(ResendOTP(body))
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
              <h4 className='sm:text-[28px] text-[24px] font-semibold text-white'> {t("otp.verifyTitle")}</h4>
              <h5 className='text-[18px] font-normal text-white opacity-80'>{t("otp.verifySubtitle")}</h5>
              {!error ? (
                <div className="text-[14px] sm:text-[18px] font-normal text-white mt-[24px]">
                  <span className=''>
                    {t("otp.otpSentMsg")}
                  </span>
                </div>
              ) : (
                <div className="text-red-500">
                  <div className="text-[14px] sm:text-[18px] font-normal mt-[24px] w-[70%]">
                    {t("otp.incorrectCode")}
                  </div>
                  {/* <a href="#" className="text-black text-[22px] font-bold">
              resend
            </a> */}
                  <button className="text-[16px] sm:!text-[18px] font-normal w-full text-white mt-[10px] text-center underline" onClick={handleResendOtp}>
                    {t("otp.resend")}
                  </button>
                </div>
              )}
              <div className="mt-[24px] otp-field-collection max-w-[500px]">
                <OtpInput
                  value={otp}
                  onChange={handleOtpChange}
                  numInputs={6}
                  renderSeparator={<span> </span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className={`flex-1 rounded-[8px] mr-2 border-2 border-[#919EAB] w-full sm:!h-[67px] h-[50px] h-[40px] max-w-[76px] text-center form-control otp_input bg-transparent sm:text-[30px] text-[18px] text-white "
                    type="text`}
                      style={{
                        borderColor: errorMessage.otp ? `#ef4444` : "#919EAB",
                      }}
                    />
                  )}
                />
              </div>
              {errorMessage.otp && (
                <label className="text-red-500 text-sm flex items-baseline pt-[2px]">
                  {errorMessage.otp}
                </label>
              )}
              <div className="flex w-full h-fit justify-center mt-[24px] max-w-[500px] mb-4">
                <Button
                  text={!isLoading ? ("Verify now") : (
                    <div className="flex items-center	justify-center">
                      <Loading />
                    </div>
                  )
                  }
                  onClick={submitOtp}
                  disabled={isLoading}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
