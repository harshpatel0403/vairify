import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import VaridateService from "../../../services/VaridateServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";

const VairifyMembershipHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const membershipHistoryData = UserDetails?.subscription;

  const handlePurchasedDate = (purchasedDate) => {
    const formattedDate = moment(purchasedDate).format("DD/M/YY HH:mm a");
    return formattedDate;
  };
  const handleStartDate = (startDate) => {
    const formattedDate = moment(startDate).format("DD/M/YY");
    return formattedDate;
  };

  const handleExpiryDate = (purchasedDate) => {
    const formattedDate = moment(purchasedDate).format("DD/M/YY");
    return formattedDate;
  };

  const handleDaysRemaining = (startDate, expiryDate, days) => {
    const currentDate = moment();
    const startDateMoment = startDate ? moment(startDate) : currentDate;
    const expiryDateMoment = moment(expiryDate);
    const expiryDateOneDayBefore = expiryDateMoment.subtract(1, "days");

    const daysRemaining = expiryDateOneDayBefore.diff(startDateMoment, "days");

    return `${daysRemaining}/${days} days`;
  };

  if (loading) {
    return (
      <div className="main-container h-full">
        <div className="h-full flex justify-center items-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  console.log("Memebrship", membershipHistoryData);

  return (
    <div
      className="main-content py-4 rounded-2xl pb-[20px] "
      style={{ maxHeight: "calc(100vh - 160px)" }}
    >
      <div className="flex flex-col justify-between">
        <div className="mt-2 bg-[#040C50]/[26%] w-full ">
          <h2 className="font-bold py-2 text-[24px] text-[#02227E] font-inter ">
            <span className="uppercase">Vairify</span> Membership History
          </h2>
        </div>
        {!membershipHistoryData?.length && (
          <div className="text-[32px] text-[#4b4b4b] font-bold text-center h-[500px] flex flex-col justify-center items-center">
            <div className="image-not">
              <img src="/images/notFound.png" alt="logo" />
            </div>
            Result not found
          </div>
        )}
        <div className="">
          <div className="mt-[20px] gap-[26px] px-2">
            <div className="grid md:grid-cols-2 gap-4">
              {membershipHistoryData &&
                membershipHistoryData?.map((item, index) => {
                  const expiryDate = moment(item.expiryDate);
                  const startDate = item.startDate
                    ? moment(item.startDate)
                    : null;
                  const daysRemaining = handleDaysRemaining(
                    startDate,
                    expiryDate,
                    item.days
                  );

                  return (
                    <div
                      className="sm:w-[100%] max-w-[440px] bg-[#3760CB]  py-[12px] rounded-[20px] border border-gray-100 h-[auto] "
                      key={index}
                    >
                      <div className="flex gap-2 sm:gap-4 pl-[10px] pr-[10px] items-center">
                        <div className="w-[20%] justify-center">
                          {UserDetails?.profilePic === "" ? (
                            <img
                              className="w-[80px] h-[80px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                              src={
                                UserDetails?.gender === "Male"
                                  ? "/images/male.png"
                                  : "/images/female.png"
                              }
                              alt="Hot Rod"
                            />
                          ) : (
                            <img
                              src={
                                import.meta.env
                                  .VITE_APP_S3_IMAGE +
                                `/${UserDetails?.profilePic}`
                              }
                              // src={
                              //   import.meta.env
                              //     .VITE_APP_API_USERPROFILE_IMAGE_URL +
                              //   `/${UserDetails?.profilePic}`
                              // }
                              className="w-[80px] h-[80px]  rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
                              alt="Hot Rod"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex-col items-center">
                            <div className="text-left">
                              <div className="flex flex-row justify-between items-center pt-1">
                                <h6 className="text-xs text-white font-roboto font-semibold mb-2">
                                  Amount -
                                </h6>
                                <h6 className="text-xs text-white font-roboto font-semibold mb-2">
                                  {`$${item.amount}.00`}
                                </h6>
                              </div>

                              <div className="flex flex-row justify-between items-center">
                                <h6 className="text-xs text-white font-roboto font-semibold mb-2">
                                  Total Days -
                                </h6>
                                <h6 className="text-xs text-white font-roboto font-semibold mb-2">
                                  {daysRemaining === null ? 0 : daysRemaining}
                                </h6>
                              </div>

                              <div className="flex flex-row justify-between items-center">
                                <h6 className="text-xs text-white font-roboto font-semibold mb-2">
                                  Purchased Date -
                                </h6>
                                <h6 className="text-xs text-white font-roboto font-semibold mb-2">
                                  {handlePurchasedDate(item.purchaseDate)}
                                </h6>
                              </div>

                              <div className="flex flex-row justify-between items-center">
                                <h6 className="text-xs text-white font-roboto font-semibold mb-2">
                                  Plan Start Date -
                                </h6>
                                <h6 className="text-xs text-white font-roboto font-semibold mb-2">
                                  {item?.startDate === null
                                    ? 0
                                    : handleStartDate(item.startDate)}
                                </h6>
                              </div>

                              <div className="flex flex-row justify-between items-center">
                                <h6 className="text-xs text-white font-roboto font-semibold mb-1">
                                  Expiry Date -
                                </h6>
                                <h6 className="text-xs text-white font-roboto font-semibold mb-1">
                                  {handleExpiryDate(item.expiryDate)}
                                </h6>
                              </div>

                              <div className="flex flex-row justify-between items-center">
                                <h6 className="text-xs text-white font-roboto font-semibold mb-2">
                                  Status -
                                </h6>
                                <h6 className="text-xs text-white font-roboto font-semibold mb-2">
                                  {UserDetails?.isMemberShipCancelled ? <h6>( Active / cancelled )</h6> : <h6>Active</h6>}
                                </h6>
                              </div>
                            </div>
                            <div className="user-information"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VairifyMembershipHistory;
