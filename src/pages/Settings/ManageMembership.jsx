import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading/Index';
import PaySubscriptionServices from '../../services/PaySubscriptionServices';
import { HandleUpdateUser } from '../../redux/action/Auth';
import Button from '../../components/Button';
import Modal from "react-modal";
import PageTitle from '../../components/PageTitle';

export default function ManageMembership() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const subscription = state?.UserData?.subscription;


    const membershipHistoryData = state?.UserData?.subscription;

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

    const handleDaysOneDayBefore = (startDate, expiryDate, days) => {
        const currentDate = moment();
        const startDateMoment = startDate ? moment(startDate) : currentDate;
        const expiryDateMoment = moment(expiryDate);
        const expiryDateOneDayBefore = expiryDateMoment.subtract(1, "days");

        const daysRemaining = expiryDateOneDayBefore.diff(startDateMoment, "days");

        return `${daysRemaining}/${days} days`;
    };

    const handleDaysRemaining = (expiryDate) => {
        const currentDate = moment();
        const daysRemaining = moment(expiryDate).diff(currentDate, "days");
        return daysRemaining;
    }

    const handleCancelVairifyMemberShip = async () => {
        try {
            if (!state?.UserData?.isMemberShipCancelled) {
                setLoading(true);
                const response = await PaySubscriptionServices.cancelVairifyMemberShip(
                    state?.UserData?._id,
                    {
                        transactionId:
                            subscription[state?.currentMembershipIndex]?.transactionId?.transactionId,
                    }
                );
                setLoading(false);
                setModalOpen(false);
                toast.success("VAIRIFY Membership Cancelled Successfully");
            } else {
                setLoading(false);
                setModalOpen(false);
                toast.error("VAIRIFY Membership cancelled already");
            }
            await dispatch(HandleUpdateUser(state?.UserData?._id));
        } catch (error) {
            console.log(error);
            toast.error(error);
            setModalOpen(false);
        } finally {
            setLoading(false);
            setModalOpen(false);
        }
    };

    return (
        <div className="container">
              <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                <PageTitle title={"Manage Membership"} />
            </div>
            <div className="sm:pb-[48px] pb-[24px]">
                <div className="text-white">
                    <div className="flex flex-row justify-between items-center social-border fav-follow bg-[#FFFFFF14] rounded-[12px] p-[15px] mb-5">
                        <div className="sm:text-[16px] text-sm text-left text-[#ffffff92] sub-title-class flex flex-col sm:gap-3 gap-2">
                            <span>Status</span>
                            <span>Days Remaining</span>
                        </div>
                        <div className="sm:text-[16px] text-sm text-lef sub-title-class flex flex-col sm:gap-3 gap-2">


                            <span className='text-right'>{state?.remainingDays === null ? (
                                "Inactive"
                            ) : state?.UserData.isMemberShipCancelled === true ? "Active/Cancel" : state?.remainingDays <= 0 ? (
                                "Inactive"
                            ) : (
                                "Active"
                            )}</span>
                            <span>
                                {state?.remainingDays === null ? (
                                    "0 days"
                                ) : (
                                    `${state?.remainingDays} days`
                                )}
                            </span>
                        </div>
                    </div>

                    {membershipHistoryData?.length > 0 && (<span className="text-white sm:text-[18px] text-[18px] font-[500]">
                        History
                    </span>)}

                    <div className={` grid gap-5 ${membershipHistoryData?.length > 1 ? "md:grid-cols-2" : ""}`}>
                        {membershipHistoryData &&
                            membershipHistoryData?.map((item, index) => {
                                const expiryDate = moment(item.expiryDate);
                                const startDate = item.startDate
                                    ? moment(item.startDate)
                                    : null;
                                const daysOneDayBefore = handleDaysOneDayBefore(
                                    startDate,
                                    expiryDate,
                                    item.days
                                );
                                const daysRemaining = handleDaysRemaining(item.expiryDate)
                                return (
                                    <div key={index} className="flex flex-row justify-between items-center social-border fav-follow bg-[#FFFFFF14] rounded-[12px] p-[15px] mt-5">
                                        <div className="sm:text-[16px] text-sm text-left text-[#ffffff92] sub-title-class flex flex-col sm:gap-3 gap-2">
                                            <span>Amount</span>
                                            <span>Total Days</span>
                                            <span>Purchased Date</span>
                                            <span>Plan Start Date</span>
                                            <span>Expiry Date</span>
                                            <span>Status</span>
                                        </div>
                                        <div className="sm:text-[16px] text-sm text-right sub-title-class flex flex-col sm:gap-3 gap-2">
                                            <span>{`$${item.amount}.00`}</span>
                                            <span>{daysOneDayBefore === null ? 0 : daysOneDayBefore}</span>
                                            <span>{handlePurchasedDate(item.purchaseDate)}</span>
                                            <span>{item?.startDate === null
                                                ? 0
                                                : handleStartDate(item.startDate)}</span>
                                            <span>{handleExpiryDate(item.expiryDate)}</span>
                                            <span>
                                                {daysRemaining <= 0
                                                    ? state?.UserData?.isMemberShipCancelled
                                                        ? "Expired / Cancelled"
                                                        : "Expired"
                                                    : state?.UserData?.isMemberShipCancelled
                                                        ? "Active / Cancelled"
                                                        : "Active"}
                                            </span>

                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>

                {!state?.UserData?.isMemberShipCancelled && state?.remainingDays > 0 ? (
                    <div className="flex justify-center w-full max-w-[500px] mx-auto mt-[24px]">
                        <Button
                            text={
                                !loading ? (
                                    "Cancel Membership"
                                ) : (
                                    <div className="flex items-center	justify-center pt-[6px]">
                                        <Loading />
                                    </div>
                                )
                            }
                            onClick={() => setModalOpen(true)}
                        />

                    </div>
                ) : (
                    <div className="flex justify-center w-full max-w-[500px] mx-auto mt-[24px]">
                        <Button
                            text={state?.UserData?.subscription?.length > 0 ? "Renew " : "Purchase " + "VAI Membership"}
                            onClick={() => navigate("/vairify-membership-plans")}
                        />
                    </div>
                )}
            </div >

            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                className={
                    "bg-white relative mx-auto w-[360px] rounded-[16px] p-[24px] w-[90%] max-w-[400px]"
                }
                contentLabel="#"
            >
                <button
                    className=" absolute right-[26px] top-[26px] bg-transparent border border-[#919EAB] h-[18px] w-[18px] flex justify-center items-center rounded-full bg-white"
                    onClick={() => setModalOpen(false)}
                >
                    <img src={"/images/close-btn.svg"} alt="cancle" className="bg-[#060C4D] rounded-full h-full w-full object-cover" />
                </button>
                <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
                    <div className="font-bold text-base text-[#212B36] text-center mt-6 w-[90%] mx-auto">
                        Are you sure you want to cancel your VAI membership?
                    </div>
                    <div className="w-full flex items-center mt-4 gap-[16px]">
                        <button
                            onClick={handleCancelVairifyMemberShip}
                            className="bg-[#E43530] rounded-[8px] font-Roboto font-normal text-sm text-white py-2 px-2 w-full"
                        >
                            {loading ? (
                                <Loading size={24} />
                            ) : (
                                "Yes"
                            )}
                        </button>
                        <button
                            onClick={() => setModalOpen(false)}
                            className="bg-[#008F34] rounded-[8px] font-Roboto font-normal text-sm text-white py-2 px-2 w-full"
                        >
                            No
                        </button>
                    </div>
                </div>
            </Modal>
        </div >
    )
}
