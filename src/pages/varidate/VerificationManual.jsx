import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import moment from "moment";

export default function VerificationManual() {
  const navigate = useNavigate();
  const location = useLocation();

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const userType = UserDetails?.user_type; //'companion-provider'
  const appointment = location.state;


  const navigateToDateGuardCode = () => {
    navigate("/varidate/invitations-list");
  };
  const navigateToNextPage = (url = "/varidate/reviews") => {
    navigate(url, {
      state:
        url === "/varidate/reviews"
          ? { appointment, from: "manual", userType }
          : appointment,
    });
  };
  return (
    <div className="main-container px-0 ">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="max-w-[300px] w-[70vw] flex rounded-full flex-col justify-center items-center mt-7 bg-[#797E9E] py-2">
          <span className="font-bold text-[30px] text-[#02227E]">
            VAI<span className="font-normal">RIDATE</span>
          </span>
        </div>
        <div className="w-[80%] flex flex-col justify-center items-center mt-9 bg-[#adaeb8] py-4 rounded-xl">
          <span className="font-bold">
            {
              appointment?.[
                userType === "client-hobbyist" ? "companionId" : "clientId"
              ]?.name
            }
          </span>
          <p>
            HAS REQUESTED A DATE ON{" "}
            {moment(appointment?.startDateTime).format("DD/MM")} AT{" "}
            {moment(appointment?.startDateTime).format("hh:mm A")} FOR{" "}
            {(appointment?.duration || 0) / 60} HOUR(S)
          </p>
        </div>
        <div className="w-full mx-auto flex justify-evenly items-center mt-7 ">
          <div className="w-[150px] h-[150px] overflow-hidden">
            <img
              src={
                appointment?.[
                  userType === "client-hobbyist" ? "companionId" : "clientId"
                ]?.faceVerificationImage
                  ?
                  `${import.meta.env.VITE_APP_S3_IMAGE}/${appointment?.[
                    userType === "client-hobbyist"
                      ? "companionId"
                      : "clientId"
                  ]?.faceVerificationImage
                  }`
                  //  `${import.meta.env.VITE_APP_API_USER_FACEIMAGES_IMAGE_URL}/${appointment?.[
                  //   userType === "client-hobbyist"
                  //     ? "companionId"
                  //     : "clientId"
                  // ]?.faceVerificationImage
                  // }`
                  : appointment?.[
                    userType === "client-hobbyist"
                      ? "companionId"
                      : "clientId"
                  ]?.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
                // appointment?.[
                //   userType === "client-hobbyist" ? "companionId" : "clientId"
                // ]?.profilePic
                //   ? `${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL}/${appointment?.[
                //     userType === "client-hobbyist"
                //       ? "companionId"
                //       : "clientId"
                //   ]?.profilePic
                //   }`
                //   : appointment?.[
                //     userType === "client-hobbyist"
                //       ? "companionId"
                //       : "clientId"
                //   ]?.gender === "Male"
                //     ? "/images/male.png"
                //     : "/images/female.png"
              }
              alt="Vairidate Verification Member"
            />
          </div>
          <div className="w-[150px] h-[150px] overflow-hidden">
            {/* VITE_APP_API_USER_VARIDATE_MANUAL_SELFIE_URL */}
            <img
              src={`${import.meta.env.VITE_APP_S3_IMAGE}/${appointment?.manualSelfie?.file}`}
              // src={`${import.meta.env.VITE_APP_API_USER_VARIDATE_MANUAL_SELFIE_URL
              //   }/${appointment?.manualSelfie?.file}`}
              alt="Vairidate Verification Member"
            />
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-9 mb-9">
          <div className="max-w-[300px] w-full">
            <Button
              onClick={() => navigateToNextPage("/varidate/reviews")}
              text="View TruRevu"
              className={
                "font-bold text-[20px] text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[25px]"
              }
            />
          </div>
          <div className="max-w-[300px] w-full mt-7">
            <Button
              onClick={() => navigateToNextPage("/varidate/booking-details")}
              text="View Date Request"
              className={
                "font-bold text-[20px] text-white bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[25px]"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
