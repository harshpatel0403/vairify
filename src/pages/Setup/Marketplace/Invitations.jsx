import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Button from "../../../components/Button";
import { useTranslation } from "react-i18next";
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
import PageTitle from "../../../components/PageTitle";

const Invitations = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const marketplacedata = useSelector(
    (state) => state?.Market?.marketplacedata
  );

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
  const [dataLoading, setDataLoading] = useState(false);

  const closeopen = () => {
    setopen(false);
  };

  useEffect(() => {
    setDataLoading(true);
    dispatch(HandleGetMarketPlace(UserDetails?._id, "Invitation"));
    setDataLoading(false);
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

  if (dataLoading) {
    return (
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  } else {
    return (
      <div className="container pb-[48px]">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={t("invitations.pageTitle")} />
        </div>
        <div className="flex flex-col justify-between">
          {!marketplacedata?.length && (
            <div className="text-xl text-white font-bold text-center flex flex-col justify-center items-center my-[48px] gap-[24px]">
              <div className="image-not">
                <img src="/images/home/result-not-found.svg" alt="not found" />
              </div>
              {t("invitations.resultNotFound")}
            </div>
          )}
          <div className="grid gap-[24px] md:grid-cols-2">
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
                    className="w-full p-[16px] bg-[#919EAB33] rounded-[16px] cursor-pointer"
                    key={index}
                  >
                    <div className="w-full">
                      <div className="market-place-logo">
                        <img
                          src="/images/vairify-marketpalce.png"
                          className="w-[80px] h-[80px] rounded-full "
                          alt=""
                        />
                      </div>
                      <div className="mt-[16px]">
                        <div className="flex justify-between gap-2">
                          <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">
                            {t("invitations.requestedApptTime")}
                          </div>
                          <p className="text-white sm:text-sm text-xs font-medium text-right">
                            {startTime.format("hh:mm a")}-
                            {endTime.format("hh:mm a")}
                          </p>
                        </div>
                        <div className="flex justify-between gap-2 mt-[4px]">
                          <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">
                            {t("invitations.postingTime")}
                          </div>
                          <p className="text-white sm:text-sm text-xs font-medium text-right">
                            {moment(item.createdAt).format("MM/DD/YYYY")}{" "}
                            {moment(item.createdAt).format("hh:mm a")}
                          </p>
                        </div>
                        <div className="flex justify-between gap-2 mt-[4px]">
                          <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">
                            {t("invitations.elapsedTime")}
                          </div>
                          <p className="text-white sm:text-sm text-xs font-medium text-right">
                            {moment(item.createdAt).fromNow()}
                          </p>
                        </div>
                        <div className="flex justify-between gap-2 mt-[4px]">
                          <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">
                            {t("invitations.status")}
                          </div>
                          <p className="text-white sm:text-sm text-xs font-medium text-right">
                            {item.status || "Pending"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-[16px] flex gap-[8px]">
                        <Button
                          onClick={() => handleCancel(item)}
                          className={"py-[4px]"}
                          text={t("invitations.cancel")}
                          size={"36px"}
                        />
                        <div className="w-full relative">
                          <Button
                            className="py-[4px] secondary-btn !bg-transparent border-[2px] border-[#919EAB33] hover:!bg-[#FFFFFF29]"
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
                            text={t("invitations.view")}
                            size={"36px"}
                          />
                          <span className="absolute top-[7px] right-[8px] bg-[#919EAB33] rounded-full text-[12px] w-[20px] h-[20px] text-white flex justify-center items-center">
                            {activeLength}
                          </span>
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
          className="max-w-[500px] w-full h-[174px] bg-[#FFFFFF] relative rounded-2xl p-[24px]"
        >
          <button
            onClick={() => setopen(false)}
            className="absolute top-[24px] right-[24px]"
          >
            <img
              src="/images/home/modalClose.svg"
              alt="icon"
              width="20px"
              height="20px"
            />
          </button>
          <div className="">
            <p className="text-[20px] font-medium text-center text-black w-[70%] mx-auto">
              {t("invitations.cancelConfirmation")}
            </p>
            <div className="flex justify-center items-center w-full pt-2 gap-2 mt-4">
              <div className="w-[40%]">
                <Button
                  className={"secondary-btn"}
                  text={
                    !isLoading ? (
                      t("invitations.yes")
                    ) : (
                      <div className="flex items-center justify-center">
                        <Loading />
                      </div>
                    )
                  }
                  size="45px"
                  onClick={deleteButton}
                  disabled={isLoading}
                />
              </div>
              <div className="w-[40%]">
                <Button
                  text={t("invitations.no")}
                  size="45px"
                  onClick={() => setopen(false)}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
};

export default Invitations;
