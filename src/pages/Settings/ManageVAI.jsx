import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading/Index';
import PaySubscriptionServices from '../../services/PaySubscriptionServices';
import { HandleUpdateUser } from '../../redux/action/Auth';
import Button from '../../components/Button';
import Modal from "react-modal";
import PageTitle from '../../components/PageTitle';

export default function ManageVAI() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [modalOpenVAI, setModalOpenVAI] = useState(false);
    const KycData = state?.UserData?.kyc;
    const VaiMembershipHistoryData = state?.UserData?.kyc;


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

    const handleCancelMemberShipVAI = async () => {
        try {
            setLoading(true);
            if (!state?.UserData?.isKycCancelled) {
                const response = await PaySubscriptionServices.cancelVAIMemberShip(
                    state?.UserData?._id,
                    {
                        subscriptionId: KycData[state?.currentKycMembershipIndex]?.subscriptionId,
                    }
                );
                setLoading(false);
                setModalOpenVAI(false);
                toast.success("VAI Membership Cancelled Successfully");
            } else {
                setLoading(false);
                setModalOpenVAI(false);
                toast.error("VAI Membership cancelled already");
            }
            await dispatch(HandleUpdateUser(state?.UserData?._id));
        } catch (error) {
            console.log(error);
            toast.error(error);
            setModalOpenVAI(false);
        } finally {
            setLoading(false);
            setModalOpenVAI(false);
        }
    };

    return (
        <div className="container">
            <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                <PageTitle title={"Manage VAI"} />
            </div>
            <div className="sm:pb-[48px] pb-[24px]">
                <div className="text-white">
                    <div className="flex flex-row justify-between items-center social-border fav-follow bg-[#FFFFFF14] rounded-[12px] p-[15px] mb-5">
                        <div className="sm:text-[16px] text-sm text-left text-[#ffffff92] sub-title-class flex flex-col sm:gap-3 gap-2">
                            <span>V.A.I</span>
                            <span>Status</span>
                            <span>Days Remaining</span>
                        </div>
                        <div className="sm:text-[16px] text-sm text-lef sub-title-class flex flex-col sm:gap-3 gap-2">
                            <div className="link-part relative border-none mr-0">
                                <div
                                    className={`border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center bg-transparent`}
                                >
                                    <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className="w-5 h-5 fill-black text-[#0CA36C]"
                                    />
                                </div>
                            </div>

                            <span className='text-right'>{state?.kycRemainingDays === null ? (
                                "Inactive"
                            ) : state?.UserData.isKycCancelled === true ? "Active/Cancel" : state?.kycRemainingDays <= 0 ? (
                                "Inactive"
                            ) : (
                                "Active"
                            )}</span>
                            <span>
                                {state?.kycRemainingDays === null ? (
                                    "0 days"
                                ) : (
                                    `${state?.kycRemainingDays} days`
                                )}
                            </span>
                        </div>
                    </div>

                    {VaiMembershipHistoryData?.length > 0 && (<span className="text-white sm:text-[18px] text-[18px] font-[500]">
                        History
                    </span>)}

                    <div className={`grid grid-cols-1 gap-5 justify-center ${VaiMembershipHistoryData?.length > 1 ? "md:grid-cols-2" : ""}`}>
                        {VaiMembershipHistoryData &&
                            VaiMembershipHistoryData?.map((item, index) => {
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

                {!state?.UserData?.isKycCancelled && state?.kycRemainingDays > 0 ? (
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
                            onClick={() => setModalOpenVAI(true)}
                        />

                    </div>
                ) : (
                    <div className="flex justify-center w-full max-w-[500px] mx-auto  mt-[24px]">
                        <Button
                            text={state?.UserData?.kyc?.length > 0 ? "Renew " : "Purchase " + "VAI Membership"}
                            onClick={() => navigate("/vai-membership-plans")}
                        />
                    </div>
                )}
            </div >

            <Modal
                isOpen={modalOpenVAI}
                onRequestClose={() => setModalOpenVAI(false)}
                className={
                    "bg-white relative mx-auto w-[360px] rounded-[16px] p-[24px] w-[90%] max-w-[400px]"
                }
                contentLabel="#"
            >
                <button
                    className=" absolute right-[26px] top-[26px] bg-transparent border border-[#919EAB] h-[18px] w-[18px] flex justify-center items-center rounded-full bg-white"
                    onClick={() => setModalOpenVAI(false)}
                >
                    <img src={"/images/close-btn.svg"} alt="cancle" className="bg-[#060C4D] rounded-full h-full w-full object-cover" />
                </button>
                <div className="w-full mx-auto flex flex-col justify-center items-center">
                    <div className="font-bold text-base text-[#212B36] text-center w-[90%] mx-auto mb-3">
                        Are you sure you want to cancel your VAI membership?
                    </div>
                    <div className="w-full flex items-center mt-4 gap-[16px]">
                        <button
                            onClick={handleCancelMemberShipVAI}
                            className="bg-[#E43530] rounded-[8px] font-Roboto font-normal text-sm text-white py-2 px-2 w-full"
                        >
                            {loading ? (
                                <Loading size={24} />
                            ) : (
                                "Yes"
                            )}
                        </button>
                        <button
                            onClick={() => setModalOpenVAI(false)}
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
