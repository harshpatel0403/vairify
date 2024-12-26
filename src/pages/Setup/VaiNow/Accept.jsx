import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import VaridateService from "../../../services/VaridateServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Accept() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const location = useLocation();
  const appointment = location.state;

  const userType = UserData.user_type;

  const acceptConfirmAppointment = async () => {
    try {
      setLoading(true);
      await VaridateService.updateAppointment(UserData._id, appointment?._id, {
        vaiCheckStatus: {
          ...(appointment?.vaiCheckStatus || {}),
          [userType === "client-hobbyist" ? "clientStatus" : "companionStatus"]:
            "Verified",
        },
      });
      navigate("/vai-now/list");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }

    // try {
    //   setLoading(true);
    //   let payload = {};
    //   if (userType === "client-hobbyist") {
    //     // payload = { clientStatus: 'Accepted' }
    //     navigate("/varidate/face-verification", {
    //       state: { ...appointment, from: "vai-now" },
    //     });
    //     return;
    //   } else {
    //     payload = { companionStatus: "Accepted" };
    //   }
    //   await VaridateService.updateAppointment(
    //     UserData?._id,
    //     appointment?._id,
    //     payload
    //   );
    //   navigate("/varidate/face-verification", {
    //     state: { ...appointment, ...payload, from: "vai-now" },
    //   });
    // } catch (error) {
    //   console.log(error);
    //   toast.error(error?.response?.data?.error || error?.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="w-full mx-auto flex flex-row justify-between items-start mt-2">
          <div className="flex flex-col items-center justify-center">
            <div>
              <span className="text-[18px] text-[#040C50] font-extrabold">
                VAI
                <span className="text-[18px] text-[#040C50] font-semibold">
                  RIFY ID
                </span>
              </span>
            </div>
            <div>
              <span className="text-[15px] text-[#040C50] font-bold">
                {userType === "client-hobbyist"
                  ? appointment?.["clientId"]?.vaiID
                  : appointment?.["companionId"]?.vaiID}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "10px", bottom: "65px" }}
              className="absolute w-full h-full rounded-full"
            >
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden">
                <img
                  src={
                    appointment?.[
                      userType === "client-hobbyist"
                        ? "clientId"
                        : "companionId"
                    ]?.profilePic
                      ?
                      (import.meta.env.VITE_APP_S3_IMAGE +
                        `/${appointment?.[
                          userType === "client-hobbyist"
                            ? "clientId"
                            : "companionId"
                        ]?.profilePic
                        }`)
                      // (import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                      //   `/${appointment?.[
                      //     userType === "client-hobbyist"
                      //       ? "clientId"
                      //       : "companionId"
                      //   ]?.profilePic
                      //   }`)
                      :
                      appointment?.[
                        userType === "client-hobbyist"
                          ? "clientId"
                          : "companionId"
                      ]?.gender === "Male"
                        ? "/images/male.png"
                        : "/images/female.png"
                  }
                  // src={'/images/IntimateMassage.png'}
                  alt="Intimate Massage"
                />
              </div>
            </div>
            {
              (appointment?.[userType === "client-hobbyist" ? "clientId" : "companionId"]?._id !== UserData?._id) &&
              <div style={{ right: "0px", top: "25px" }} className="absolute">
                <img src={"/images/HotRodIcon2.png"} alt="Hot Rod Icon Second" />
              </div>
            }
          </div>
          <div>
            <div>
              <span className="text-[18px] text-[#040C50] font-bold">
                TruRevu
              </span>
            </div>
            <div className="flex flex-row justify-center items-center">
              <FontAwesomeIcon
                icon={faStar}
                color={(appointment?.[userType === "client-hobbyist" ? "clientId" : "companionId"]?.averageRating) >= 1 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={(appointment?.[userType === "client-hobbyist" ? "clientId" : "companionId"]?.averageRating) >= 2 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={(appointment?.[userType === "client-hobbyist" ? "clientId" : "companionId"]?.averageRating) >= 3 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={(appointment?.[userType === "client-hobbyist" ? "clientId" : "companionId"]?.averageRating) >= 4 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={(appointment?.[userType === "client-hobbyist" ? "clientId" : "companionId"]?.averageRating) >= 5 ? "#E1AB3F" : "#111"}
                className="text-[10px] margin-right-5"
              />
              <span className="text-[15px] text-[#040C50] font-bold">{(appointment?.[userType === "client-hobbyist" ? "clientId" : "companionId"]?.averageRating)}</span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
          <span className="font-bold text-[24px]">
            {
              appointment?.[
                userType === "client-hobbyist" ? "clientId" : "companionId"
              ]?.name
            }
          </span>
        </div>
        {/* <div className='w-full mx-auto flex flex-col justify-center items-center mt-7'>
                    <div><span className='font-bold text-[25px]'>CONTRACT</span></div>
                </div> */}
        <img src="/images/check-mark 2.png" />
        <h2 className="text-[35px] font-bold text-[#13A307]">Verified</h2>
        <p className="text-[20px] font-bold w-full">
          {userType === "client-hobbyist"
            ? `${appointment?.["companionId"]?.name} has accepted you Quick-Date invitation. Please confirm`
            : `${appointment?.["clientId"]?.name} Has requested a date
                    with you if you agree please confirm`}
        </p>
        <h2 className="text-[35px] font-bold mt-5">VAI-NOW</h2>
        <p className="text-[18px] uppercase font-bold w-full">
          {appointment?._id}
        </p>
        {/* <div className='w-full mx-auto flex flex-col justify-center items-center mt-2'>
                    <div className='w-[200px] h-[200px]'><img src={'/images/ESignatureIcon.png'} alt="ESignature Icon" /></div>
                </div> */}

        <div
          style={{ marginTop: "120px", marginBottom: "30px" }}
          className="w-full mx-auto flex flex-col justify-center items-center"
        >
          <Button
            disabled={loading}
            onClick={acceptConfirmAppointment}
            text={
              loading
                ? "Loading.."
                : userType === "client-hobbyist"
                  ? "Confirm"
                  : "Accept"
            }
            className={
              "bg-gradient-to-t from-lime-500 to-emerald-500 rounded-[10px] font-bold text-[23.4px] text-[#01195C] shadow-2xl"
            }
          />
        </div>
        {/* <div className='w-full mx-auto flex flex-row justify-center items-center'>
                    <div className='mr-14'><img src={'/images/MessageIcon.png'} alt="Message Icon" /></div>
                    <div className=''><img src={'/images/PhoneCallIcon.png'} alt="Phone Call Icon" /></div>
                </div> */}
      </div>
    </div>
  );
}
