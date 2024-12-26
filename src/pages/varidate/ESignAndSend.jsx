import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import VaridateService from "../../services/VaridateServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ESignAndSend() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const location = useLocation();
  const appointment = location.state;

  const userType = UserData.user_type;
  const signAppointment = async () => {
    try {
      setLoading(true);
      if (appointment?.from === "vai-check" && !appointment?._id) {
        await VaridateService.createAppointment({
          data: JSON.stringify({
            ...appointment,
            clientId: appointment?.clientId?._id,
            companionId: appointment?.companionId?._id,
          }),
        });
        return navigate('/varidate/last-mile-instruction', { state: appointment })
        // return navigate("/vai-check/list");
      } else if (appointment?.from === "vai-check" && appointment?._id) {
        await VaridateService.updateAppointment(
          UserData._id,
          appointment?._id,
          {
            [userType === "client-hobbyist"
              ? "clientStatus"
              : "companionStatus"]:
              appointment?.["companionStatus"] === "Signed" ||
                appointment?.["clientStatus"] === "Signed"
                ? "Scheduled"
                : "Signed",
            [userType === "client-hobbyist"
              ? "companionStatus"
              : "clientStatus"]:
              appointment?.["companionStatus"] === "Signed" ||
                appointment?.["clientStatus"] === "Signed"
                ? "Scheduled"
                : "Sign Pending",
          }
        );
        return navigate('/varidate/last-mile-instruction', { state: appointment })
        // return navigate("/vai-check/list");
      }
      if (appointment?.from === "vairifyNow") {
        if (userType !== "client-hobbyist") {
          await VaridateService.updateAppointment(
            UserData._id,
            appointment?._id,
            {
              clientStatus: "Scheduled",
              companionStatus: "Scheduled",
            }
          );
        }
      } else {
        await VaridateService.updateAppointment(
          UserData._id,
          appointment?._id,
          {
            [userType === "client-hobbyist"
              ? "clientStatus"
              : "companionStatus"]: "Scheduled",
            // appointment?.["companionStatus"] === "Signed" ||
            //   appointment?.["clientStatus"] === "Signed"
            //   ? "Scheduled"
            //   : "Signed",
            [userType === "client-hobbyist"
              ? "companionStatus"
              : "clientStatus"]: "Scheduled",
            // appointment?.["companionStatus"] === "Signed" ||
            //   appointment?.["clientStatus"] === "Signed"
            //   ? "Scheduled"
            //   : "Sign Pending",
          }
        );
      }
      if (
        appointment?.from === "vai-now" ||
        appointment?.from === "vairifyNow"
      ) {
        navigate('/varidate/last-mile-instruction', { state: appointment })
        // navigate("/vai-now/list");
        return;
      }
      if (appointment?.["companionStatus"] === "Signed") {
        navigate('/varidate/last-mile-instruction', { state: appointment })
        // navigate("/varidate/upcoming-appointments");
        return;
      }
      navigate('/varidate/last-mile-instruction', { state: appointment })
      // navigate("/varidate/invitations-list");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
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
              <span className="text-[15px] text-[#040C50] font-bold uppercase">
                {appointment?.from === "modify"
                  ? appointment?.companionData?.vaiID
                  : userType === "client-hobbyist"
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
                      appointment?.from === "modify"
                        ? "companionData"
                        : userType === "client-hobbyist"
                          ? "clientId"
                          : "companionId"
                    ]?.profilePic
                      ?
                      import.meta.env.VITE_APP_S3_IMAGE +
                      `/${appointment?.[
                        appointment.from === "modify"
                          ? "companionData"
                          : userType === "client-hobbyist"
                            ? "clientId"
                            : "companionId"
                      ]?.profilePic
                      }`
                      //  import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                      // `/${appointment?.[
                      //   appointment.from === "modify"
                      //     ? "companionData"
                      //     : userType === "client-hobbyist"
                      //       ? "clientId"
                      //       : "companionId"
                      // ]?.profilePic
                      // }`
                      : appointment?.[
                        appointment.from === "modify"
                          ? "companionData"
                          : userType === "client-hobbyist"
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
            {(userType === "client-hobbyist"
              ? appointment?.["clientId"]?._id
              : appointment?.["companionId"]?._id) === UserData?._id ||
              appointment.from === "modify" ? null : (
              <div style={{ right: "0px", top: "25px" }} className="absolute">
                <img
                  src={"/images/HotRodIcon2.png"}
                  alt="Hot Rod Icon Second"
                />
              </div>
            )}
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
                color={
                  appointment?.[
                    appointment.from === "modify"
                      ? "companionData"
                      : userType === "client-hobbyist"
                        ? "clientId"
                        : "companionId"
                  ]?.averageRating > 1
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    appointment.from === "modify"
                      ? "companionData"
                      : userType === "client-hobbyist"
                        ? "clientId"
                        : "companionId"
                  ]?.averageRating > 2
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    appointment.from === "modify"
                      ? "companionData"
                      : userType === "client-hobbyist"
                        ? "clientId"
                        : "companionId"
                  ]?.averageRating > 3
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    appointment.from === "modify"
                      ? "companionData"
                      : userType === "client-hobbyist"
                        ? "clientId"
                        : "companionId"
                  ]?.averageRating > 4
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color={
                  appointment?.[
                    appointment.from === "modify"
                      ? "companionData"
                      : userType === "client-hobbyist"
                        ? "clientId"
                        : "companionId"
                  ]?.averageRating > 5
                    ? "#E1AB3F"
                    : "#111"
                }
                className="text-[10px] margin-right-5"
              />
              <span className="text-[15px] text-[#040C50] font-bold">
                {
                  appointment?.[
                    appointment.from === "modify"
                      ? "companionData"
                      : userType === "client-hobbyist"
                        ? "clientId"
                        : "companionId"
                  ]?.averageRating
                }
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
          <span className="font-bold text-[24px] capitalize">
            {
              appointment?.[
                appointment.from === "modify"
                  ? "companionData"
                  : userType === "client-hobbyist"
                    ? "clientId"
                    : "companionId"
              ]?.name
            }
          </span>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-7">
          <div>
            <span className="font-bold text-[25px]">CONTRACT</span>
          </div>
        </div>
        <div className="inner-content-part mt-6 max-h-[450px] flex flex-col items-center">
          <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
            <div className="w-[200px] h-[200px]">
              <img src={"/images/ESignatureIcon.png"} alt="ESignature Icon" />
            </div>
          </div>
          <div
            style={{ marginTop: "20px", marginBottom: "30px" }}
            className="w-full mx-auto flex flex-col justify-center items-center"
          >
            <Button
              disabled={loading}
              onClick={() => signAppointment()}
              text={loading ? "Loading.." : "E-Sign & Send"}
              className={
                "bg-gradient-to-t from-lime-500 to-emerald-500 rounded-[10px] font-bold text-[23.4px] text-[#01195C]"
              }
            />
          </div>
        </div>

        {/* <div className='w-full mx-auto flex flex-row justify-center items-center'>
                    <div className='mr-14'><img src={'/images/MessageIcon.png'} alt="Message Icon" /></div>
                    <div className=''><img src={'/images/PhoneCallIcon.png'} alt="Phone Call Icon" /></div>
                </div> */}
      </div>
    </div>
  );
}
