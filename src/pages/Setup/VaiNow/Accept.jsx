import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import VaridateService from "../../../services/VaridateServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";

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
    <>
      <div className="md:hidden block fixed top-0 sm:h-[80px] h-[70px] w-full bg-[#060C4D] z-50"></div>
      <div className="container">
        <div className="w-full flex flex-row sm:justify-around justify-between items-end sm:mt-[50px] mt-[30px] sm:p-[16px] sm:bg-[#FFFFFF0A] rounded-[16px]">
          <div className="flex flex-col items-center justify-center sm:min-w-[120px] min-w-[80px]">
            <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
              VAIRIFY ID
            </div>
            <div className="font-bold sm:text-lg text-base text-white uppercase">
              {userType === "client-hobbyist"
                ? appointment?.["clientId"]?.vaiID
                : appointment?.["companionId"]?.vaiID}
            </div>
          </div>
          <div className="relative">
            <div className=" relative">
              <img
                className="sm:w-[100px] w-[80px] sm:h-[100px] h-[80px] rounded-full  border-2 border-white"
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
                    :
                    appointment?.[
                      userType === "client-hobbyist"
                        ? "clientId"
                        : "companionId"
                    ]?.gender === "Male"
                      ? "/images/male.png"
                      : "/images/female.png"
                }
                alt="Intimate Massage"
              />
              {
                (appointment?.[userType === "client-hobbyist" ? "clientId" : "companionId"]?._id !== UserData?._id) &&
                <div className="absolute right-0 bottom-0">
                  <img src={"/images/HotRodIcon2.png"} alt="Hot Rod Icon Second" />
                </div>
              }
            </div>
            <div className="flex-col flex justify-center items-center mt-[24px]">
              <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
                Name
              </div>
              <span className="font-bold sm:text-lg text-base text-white">
                {UserData?.name || "Name"}
              </span>
            </div>
          </div>
          <div className="leading-[18px] sm:min-w-[120px] min-w-[80px] flex flex-col justify-center items-center">
            <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
              TruRevu
            </div>
            <div className="flex justify-center items-center gap-1">
              <div className="sm:text-lg text-base text-white font-bold ">
                {appointment?.[userType === "client-hobbyist" ? "clientId" : "companionId"]?.averageRating}
              </div>
              <img src="/images/home/star.svg" alt="star" />
            </div>
          </div>
        </div>






        <div className="w-full mx-auto flex flex-col justify-center items-center mt-[24px]">
          <h3 className="font-medium text-center mb-1 text-white text-[24px]">
            {
              appointment?.[
                userType === "client-hobbyist" ? "clientId" : "companionId"
              ]?.name
            }
          </h3>
          {/* <div className='w-full mx-auto flex flex-col justify-center items-center mt-7'>
                    <div><span className='font-bold text-[25px]'>CONTRACT</span></div>
                </div> */}
          <h2 className="text-[24px] font-medium text-[#13A307] text-center flex items-center gap-1"> <img src="/images/setup/confirm-check.svg" alt="icon" /> Verified</h2>
          <p className="text-[18px] font-normal w-full text-white text-center my-2">
            {userType === "client-hobbyist"
              ? `${appointment?.["companionId"]?.name} has accepted you Quick-Date invitation. Please confirm`
              : `${appointment?.["clientId"]?.name} Has requested a date
                    with you if you agree please confirm`}
          </p>
          <p className="text-[18px] uppercase font-bold w-full text-white text-center">
            {appointment?._id}
          </p>
          {/* <div className='w-full mx-auto flex flex-col justify-center items-center mt-2'>
                    <div className='w-[200px] h-[200px]'><img src={'/images/ESignatureIcon.png'} alt="ESignature Icon" /></div>
                </div> */}

          <div className="w-full flex flex-col justify-center items-center my-[30px] max-w-[500px] mx-auto"
          >
            <Button
              disabled={loading}
              onClick={acceptConfirmAppointment}
              text={
                loading
                  ? <div className="flex items-center	justify-center">
                    <Loading />
                  </div>
                  : userType === "client-hobbyist"
                    ? "Confirm"
                    : "Accept"
              }
            />
          </div>
          {/* <div className='w-full mx-auto flex flex-row justify-center items-center'>
                    <div className='mr-14'><img src={'/images/MessageIcon.png'} alt="Message Icon" /></div>
                    <div className=''><img src={'/images/PhoneCallIcon.png'} alt="Phone Call Icon" /></div>
                </div> */}
        </div>
      </div>
    </>
  );
}
