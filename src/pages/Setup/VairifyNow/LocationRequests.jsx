import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import Selecter from "../../../components/Selecter/Selecter";
import NotificationServices from "../../../services/NotificationServices";
import { useSelector } from "react-redux";
import moment from "moment";
import VaridateService from "../../../services/VaridateServices";
import { toast } from "react-toastify";
// import UserGalleryService from "../../../services/UserGalleryService";

export default function LocationRequests() {
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const [notifications, setNotifications] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [filterText, setFilterText] = useState("");

  const [loading, setLoading] = useState(false);
  const [locationUploadLoading, setLocationUploadLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    setLoading(true);
    VaridateService.vairifyNowFetchLocationRequests(UserData?._id)
      .then((data) => {
        setRequests(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.error || error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useState(() => {
    fetchRequests();
  }, []);

  const updateLocationRequest = async (id, approve) => {
    setLocationUploadLoading(true);
    try {
      await VaridateService.vairifyNowUpdateLocationRequest(id, {
        type: approve ? "approve" : "reject",
      });
      fetchRequests();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLocationUploadLoading(false);
    }
  };

  if (loading) {
    return <p>Please wait...</p>;
  }

  return (
    <div className="main-container p-0 pb-6">
      <div className="flex flex-col justify-center items-center pt-custom-24 mx-auto">
        <div className="text-custom-13 text-[#000000]">
          <span>Location Requests </span>
        </div>
      </div>
      <div className="max-w-[500px] flex flex-col justify-center items-center mx-auto px-6">
        <div className="w-full flex flex-col justify-between items-left mt-4">
          {requests?.length > 0 ? (
            requests?.map((request) => {
              return (
                <>
                  <div className="mt-1 w-full gap-[15px] flex flex-row rounded-full items-center text-[#fff] bg-[#3760CB] justify-between items-left border-[3px] border-[#01195C] p-1 pr-3">
                    <div className="rounded-full border-[2px] border-[#fff] min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] overflow-hidden">
                      <img
                        src={
                          request?.userId?.profilePic
                            ?
                            import.meta.env
                            .VITE_APP_S3_IMAGE +
                          `/${request?.userId?.profilePic}`
                            //  import.meta.env
                            //     .VITE_APP_API_USERPROFILE_IMAGE_URL +
                            //   `/${request?.userId?.profilePic}`
                            : request?.userId?.gender === "Male"
                            ? "/images/male.png"
                            : "/images/female.png"
                        }
                        alt="Congratulations"
                      />
                    </div>
                    <div className="min-w-[150px] flex flex-col">
                      <span className="text-[18px] font-bold font-Roboto-Serif">
                        {" "}
                        {request?.userId?.name}{" "}
                      </span>
                      <span className="text-[10px] font-[500] font-Roboto-Serif uppercase font-extrabold">
                        {" "}
                        VAI
                        <span className="logoSetupweight">
                          RIFY ID {request?.userId?.vaiID}{" "}
                        </span>
                      </span>
                    </div>
                    <div className="flex gap-3 pr-3">
                      {request?.isApproved || request?.isRejected ? (
                        <div>
                          {request?.isRejected ? (
                            <>
                              <i className="fa fa-times text-[#ff0000]" />
                              <span className="text-[12px] leading-1 inline-block">
                                {moment(request?.rejectedAt)?.format(
                                  "DD/MM/YY h:mm a"
                                )}
                              </span>
                            </>
                          ) : (
                            <>
                              <i className="fa fa-check text-[#29a329]" />
                              <span className="text-[12px] leading-1 inline-block">
                                {moment(request?.approvedAt)?.format(
                                  "DD/MM/YY h:mm a"
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              updateLocationRequest(request?._id, false)
                            }
                            className="bg-[#ff0000] w-[30px] h-[30px] rounded-full"
                          >
                            <i className="fa fa-times" />
                          </button>
                          <button
                            onClick={() =>
                              updateLocationRequest(request?._id, true)
                            }
                            className="bg-[#29a329] w-[30px] h-[30px] rounded-full"
                          >
                            <i className="fa fa-check" />
                          </button>
                        </>
                      )}
                      {/* <span className="text-[14px] font-bold">
                      <img
                        className="max-w-[45px] max-h-[30px] mb-1"
                        src={getNotificationIcon(notification)}
                        alt="Congratulations"
                      />
                    </span> */}
                      {/* <span className="text-[10px] font-bold">
                      {" "}
                      {moment(request?.createdAt)?.format("h:mm a")}{" "}
                    </span> */}
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <div className="text-[32px] text-[#4b4b4b] font-bold text-center flex flex-col justify-center items-center">
              <div className="image-not">
                <img src="/images/notFound.png" alt="logo" />
              </div>
              Result not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
