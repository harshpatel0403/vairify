import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import VaridateService from "../../services/VaridateServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import SettingsService from "../../services/SettingsService";
import Loading from "../../components/Loading/Index";
import PageTitle from "../../components/PageTitle";

const DateHistory = () => {
  const navigate = useNavigate();
  const navigateToviewall = (appointment) => {
    navigate("/varidate/appointment-details", { state: appointment });
  };

  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  console.log(UserDetails, " logged in user");

  const userType = UserDetails?.user_type; //'companion-provider'

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const apts = await SettingsService.getDateHistory();
      console.log(apts, " <=== apts...");
      setAppointments(apts);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      await VaridateService.updateAppointment(UserDetails._id, appointmentId, {
        [userType === "client-hobbyist" ? "clientStatus" : "companionStatus"]:
          "Cancel",
      });
      await fetchAppointments();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChatIcon = (id) => {
    navigate(`/chat/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    )
  }

  const navigateToViewPage = (appointment) => {
    if (appointment.manualSelfie) {
      // /varidate/verification-manual
      // /varidate/verification
      navigate("/varidate/verification-manual", { state: appointment });
    } else {
      navigate("/varidate/verification", { state: appointment });
    }
  };

  return (
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Date History"} />
      </div>
      <div className="flex flex-col justify-between">
        {!appointments?.length && (
          <div className="text-xl text-white font-bold text-center flex flex-col justify-center items-center my-[48px] gap-[24px]">
            <div className="image-not">
              <img src="/images/home/result-not-found.svg" alt="not found" />
            </div>
            Result not found
          </div>
        )}
        <div className="gap-[26px]">
          <div className="grid md:grid-cols-2 gap-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="sm:w-[100%] bg-[#FFFFFF14] p-[16px] rounded-[15px] h-[auto] "
              >
                <div className="flex gap-2 sm:gap-4">
                  <div className="justify-center">
                    <img
                      src={
                        appointment?.[
                          userType == "client-hobbyist"
                            ? "companionId"
                            : "clientId"
                        ]?.profilePic
                          ?
                          `${import.meta.env
                            .VITE_APP_S3_IMAGE
                          }/${appointment?.[
                            userType == "client-hobbyist"
                              ? "companionId"
                              : "clientId"
                          ]?.profilePic
                          }`
                          : appointment?.[
                            userType == "client-hobbyist"
                              ? "companionId"
                              : "clientId"
                          ]?.gender === "Male"
                            ? "/images/male.png"
                            : "/images/female.png"
                      }
                      className="w-[45px] h-[45px] rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        <h6 className="text-[16px] text-white font-roboto font-semibold">
                          {
                            appointment?.[
                              userType == "client-hobbyist"
                                ? "companionId"
                                : "clientId"
                            ]?.name
                          }
                        </h6>
                        <h6 className="text-[14px] text-[#ffffff82] font-roboto font-semibold">
                          ID #$
                          {
                            appointment?.[
                              userType == "client-hobbyist"
                                ? "companionId"
                                : "clientId"
                            ]?.vaiID
                          }
                        </h6>


                      </div>
                      <div>
                        <div className="flex gap-1 items-start">
                          <span className="text-white block text-center  font-roboto font-bold text-[15px]">
                            {appointment?.[
                              userType == "client-hobbyist"
                                ? "companionId"
                                : "clientId"
                            ]?.averageRating || 0}
                          </span>
                          <div className="flex gap-1">
                            <img
                              src="/images/home/star.svg"
                              className="h-[20px] w-[20px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-[10px] text-[14px]">
                  <div className="text-[#ffffff82]">
                    <h6>Date/Time</h6>
                    <h6>Type</h6>
                  </div>
                  <div className="text-white text-right">
                    <h6>{moment(appointment?.startDateTime).format(
                      "DD/MM/YY"
                    )} {moment(appointment?.startDateTime).format(
                      "hh.mma"
                    )}</h6>
                    <h6>{appointment?.type}</h6>
                  </div>
                </div>
                <div className="flex justify-center w-full mt-[20px]">
                  <Button
                    text={"View"}
                    onClick={() => navigateToviewall(appointment)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateHistory;
