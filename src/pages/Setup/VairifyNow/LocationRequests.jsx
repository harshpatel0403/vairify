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
import Loading from "../../../components/Loading/Index";
import PageTitle from "../../../components/PageTitle";
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
    <div className="flex justify-center align-center items-center h-[50vh]">
      <Loading />
    </div>
  }

  return (
    <div className="container pb-6">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Location Requests"} isSmall={true} />
      </div>
      <div className="w-full">
        <div className="w-full grid md:grid-cols-2 gap-[24px]">
          {requests?.length > 0 ? (
            requests?.map((request) => {
              return (
                <>
                  <div className="w-full p-[16px] bg-[#919EAB33] rounded-[16px] ">

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-[8px] flex-grow">
                        <div>
                          <img
                            src={
                              request?.userId?.profilePic
                                ?
                                import.meta.env
                                  .VITE_APP_S3_IMAGE +
                                `/${request?.userId?.profilePic}`
                                : request?.userId?.gender === "Male"
                                  ? "/images/male.png"
                                  : "/images/female.png"
                            }
                            alt="profile picture"
                            className="w-[48px] h-[48px] rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="sm:text-base text-sm text-white font-medium">
                            {request?.userId?.name}
                          </div>
                          <div className="sm:text-sm text-xs font-normal text-[#919EAB] uppercase">
                            {request?.userId?.vaiID}
                          </div>

                        </div>
                      </div>
                      <div>
                        <div className="flex gap-[4px]">
                          <p className="sm:text-base text-sm text-white font-semibold">
                            {request?.userId?.averageRating}
                          </p>
                          <img src="/images/home/star.svg" alt="rating" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-[16px] w-full">
                      {request?.isApproved || request?.isRejected ? (
                        <div className="w-full">
                          {request?.isRejected ? (
                            <>
                              <div className="flex justify-between items-center gap-2">
                                <div className="text-white text-sm font-normal opacity-[0.6]">Date/Time</div>
                                <p className="text-white text-sm font-medium ">
                                  {moment(request?.rejectedAt)?.format(
                                    "DD/MM/YY h:mm a"
                                  )}
                                </p>
                              </div>
                              <div className="flex justify-between items-center gap-2 mt-1">
                                <div className="text-white text-sm font-normal opacity-[0.6]">Status</div>
                                <p className="text-[#E43530] text-sm font-medium ">
                                  Rejected
                                </p>
                              </div>
                              {/* <i className="fa fa-times text-[#ff0000]" />
                              <span className="text-[12px] leading-1 inline-block">
                                {moment(request?.rejectedAt)?.format(
                                  "DD/MM/YY h:mm a"
                                )}
                              </span> */}
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-center gap-2 w-full">
                                <div className="text-white text-sm font-normal opacity-[0.6]">Date/Time</div>
                                <p className="text-white text-sm font-medium ">
                                  {moment(request?.approvedAt)?.format(
                                    "DD/MM/YY h:mm a"
                                  )}
                                </p>
                              </div>
                              <div className="flex justify-between items-center gap-2 mt-1">
                                <div className="text-white text-sm font-normal opacity-[0.6]">Status</div>
                                <p className="text-[#008F34] text-sm font-medium ">
                                  Approved
                                </p>
                              </div>
                              {/* <i className="fa fa-check text-[#29a329]" />
                              <span className="text-[12px] leading-1 inline-block">
                                {moment(request?.approvedAt)?.format(
                                  "DD/MM/YY h:mm a"
                                )}
                              </span> */}
                            </>
                          )}
                        </div>
                      ) : (
                        <>
                          <Button
                            onClick={() =>
                              updateLocationRequest(request?._id, true)
                            }
                            className="!bg-[#008F34] secondary-btn py-[4px] hover:!bg-[#028230]"
                            text={'Approve'}
                          />
                          <Button
                            onClick={() =>
                              updateLocationRequest(request?._id, false)
                            }
                            className="!bg-[#E43530] secondary-btn py-[4px] hover:!bg-[#bc1d18]"
                            text={'Reject'}
                          />
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
            <div className="text-xl text-white font-bold text-center flex flex-col justify-center items-center my-[48px] gap-[24px] col-span-2">
              <div className="image-not">
                <img src="/images/home/result-not-found.svg" alt="not found" />
              </div>
              Result not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
