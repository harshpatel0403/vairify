import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleDeleteInvitation,
  HandleGetMarketPlace,
  HandleMarketplaceInvitation,
} from "../../../redux/action/MarketplaceSearch";
import moment from "moment";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
import { useNavigate } from "react-router-dom";

const Invitations = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const marketplacedata = useSelector((state) => state?.Market?.marketplacedata  );

  // let marketplacedata;
  // const fetchMarketPlaceData = async () => {
  //   marketplacedata = await useSelector(
  //     (state) => state?.Market?.marketplacedata
  //   );
  // }
  // fetchMarketPlaceData();

  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [open, setopen] = useState(false);
  const [inquiryData, setInquiryData] = useState({});
  const closeopen = () => {
    setopen(false);
  };

  useEffect(() => {
    dispatch(HandleGetMarketPlace(UserDetails?._id, "Invitation"));
  }, []);

  const deleteButton = async () => {
    setIsLoading(true);
    await dispatch(HandleDeleteInvitation(inquiryData?._id))
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          dispatch(HandleGetMarketPlace(UserDetails?._id, "Invitation"));
          setopen(false);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          // setError(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err, "Error");
      });
  };

  const handleCancel = async (item) => {
    await setInquiryData(item);
    setopen(true);
  };

  return (
    <div
      className="main-container h-full px-0 py-4 rounded-2xl pb-[45px] mt-20"
      style={{ maxHeight: "calc(100vh - 160px)" }}
    >
      <div className="flex flex-col justify-between">
        <div className="mt-2 bg-[#040C50]/[26%] w-full h-[40px]">
          <h2 className="font-bold text-[26px] text-[#02227E] font-inter ">
            Invitations
          </h2>
        </div>
        {!marketplacedata?.length && (
          <div className="text-[32px] text-[#4b4b4b] font-bold text-center h-[500px] flex flex-col justify-center items-center">
            <div className="image-not">
              <img src="/images/notFound.png" alt="logo" />
            </div>
            Result not found
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 max-card-grid">
          {marketplacedata &&
            marketplacedata?.map((item, index) => {
              const startTime = moment(item?.invitationtime?.from, "hh:mm A");
              const endTime = moment(item?.invitationtime?.to, "hh:mm A");
              // Calculate the duration between the two moments
              const duration = moment.duration(endTime.diff(startTime));
              const hours = duration.hours();
              const minutes = duration.minutes();

              const activeInvitees = item?.invitee?.filter(
                (invitee) => invitee?.status === "accept"
              );
              const activeLength = activeInvitees.length;
              return (
                <div
                  className="mt-[20px] flex flex-col gap-[26px] px-2"
                  key={index}
                >
                  <div className="bg-[#3760CB] py-[12px] rounded-[20px] border border-gray-100">
                    <div className="flex gap-2 sm:gap-4 pl-[4px] pr-[19px]">
                      <div className="flex-1">
                        <div className="flex status-details-part items-center gap-4 w-full">
                          <div className="market-place-logo">
                            <img
                              src="/images/vairify-marketpalce.png"
                              className="w-[80px] h-[80px] rounded-full "
                              alt=""
                            />
                          </div>
                          <div className="flex-1 status-part">
                            <p className="block text-[12px] font-bold font-roboto text-white whitespace-nowrap">
                              Status
                            </p>
                            <button
                              className="font-roboto font-bold text-[20px] text-white px-4 border rounded-[8px] border-white bg-[#02227E] w-full capitalize"
                              onClick={
                                () => { }
                                // navigate("/marketplace/active/invitation", {
                                //   state: item,
                                // })
                              }
                            >
                              {item.status || "Pending"}
                            </button>
                          </div>
                          <div className="flex-1 details-part relative">
                            <p className="block text-[12px] font-bold font-roboto text-white whitespace-nowrap">
                              Details
                            </p>
                            <button
                              className="font-roboto font-bold text-[20px] text-white px-4 border rounded-[8px] border-white bg-[#02227E] w-full"
                              onClick={() => {
                                dispatch(
                                  HandleMarketplaceInvitation({
                                    userIds: item?.invitee
                                      ?.filter(
                                        (item) => item?.status === "accept"
                                      )
                                      ?.map((item) => item?.id),
                                  })
                                );
                                navigate("/results");
                              }}
                            >
                              <span className="absolute top-[5px] right-0 bg-[#FFC020] rounded-full text-[12px] w-[20px] h-[20px] text-[#01195C]">
                                {activeLength}
                              </span>
                              View
                            </button>
                          </div>
                        </div>
                        <div className="flex text-block mt-5 justify-items-center">
                          <div className="block flex-1">
                            <h6 className="text-[14px] font-bold font-roboto text-white leading-5 mb-1">
                              Requested Appt/time
                            </h6>
                            <p className="text-[10px] font-bold font-roboto text-white leading-5  font-medium mb-0">
                              {/* {startTime.format("MM/DD/YYYY")} */}
                            </p>
                            <p className="text-[10px] font-bold font-roboto text-white leading-5  font-medium">
                              {startTime.format("hh:mm a")}-
                              {endTime.format("hh:mm a")}
                            </p>
                          </div>
                          <div className="block flex-1">
                            <h6 className="text-[14px] font-bold font-roboto text-white leading-5 mb-1">
                              Invitation Posting time
                            </h6>
                            <p className="text-[10px] font-bold font-roboto text-white leading-5  font-medium">
                              {moment(item.createdAt).format("MM/DD/YYYY")}
                            </p>
                            <p className="text-[10px] font-bold font-roboto text-white leading-5  font-medium">
                              {moment(item.createdAt).format("hh:mm a")}
                            </p>
                          </div>
                          <div className="block flex-1">
                            <h6 className="text-[14px] font-bold font-roboto text-white leading-5 mb-1">
                              Elapsed Time
                            </h6>
                            <p className="text-[10px] font-bold font-roboto text-white leading-5  font-medium">
                              {moment(item.createdAt).fromNow()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCancel(item)}
                          className={
                            "text-[18px] text-white font-bold border-2 border-black bg-[#DB3002] leading-4 rounded-[12px] w-[144px] h-[35px] mt-2 md:mt-5"
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <Modal
        isOpen={open}
        onRequestClose={closeopen}
        className=" w-[360px] h-[174px] bg-[#3760CB] relative center-modal rounded-2xl px-4"
      >
        <button
          onClick={() => setopen(false)}
          className="absolute top-2 right-2"
        >
          <img
            src="/images/Mask group-close.png"
            alt=""
            width="30px"
            height="30px"
          />
        </button>
        <div className="pt-8">
          <p className="text-[24px] font-bold text-center text-[#fff] leading-8">
            Are you sure you want to cancel your invitation
          </p>
          <div className="flex justify-around items-center w-full pt-2">
            <div className="w-[40%]">
              <Button
                className={
                  "flex items-center py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[23.4px]"
                }
                text={
                  !isLoading ? (
                    "Yes"
                  ) : (
                    <div className="flex items-center justify-center pt-[6px]">
                      <Loading />
                    </div>
                  )
                }
                size="45px"
                onClick={deleteButton}
              />
            </div>
            <div className="w-[40%]">
              <Button
                className={
                  "flex items-center py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[23.4px]"
                }
                text={"No"}
                size="45px"
                onClick={() => setopen(false)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Invitations;
