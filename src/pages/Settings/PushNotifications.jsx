import React, { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Button from "../../components/Button";
import PaySubscriptionServices from "../../services/PaySubscriptionServices";
import { toast } from "react-toastify";
import SettingsService from "../../services/SettingsService";
import Loading from "../../components/Loading/Index";
import { HandleUpdateUser } from "../../redux/action/Auth";
import PageTitle from "../../components/PageTitle";

export default function PushNotifications() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
    const location = useLocation();
    const [pushNotification, setPushNotification] = useState(false);
    const [pushNotificationLoading, setPushNotificationLoading] = useState(false);

    useEffect(() => {
        setPushNotification(UserData?.pushNotification === false ? false : true);
    }, [UserData]);

    const togglePushNotifications = async () => {
        try {
            setPushNotificationLoading(true);
            await SettingsService.updatePushNotification({
                status: !pushNotification,
            });
            dispatch(HandleUpdateUser(UserData?._id));
            setPushNotification(!pushNotification);
            toast.success('Successfully updated push notification');
        } catch (error) {
            console.log(error);
            toast.error("Failed to update push notification");
        } finally {
            setPushNotificationLoading(false);
        }
    };


    return (
        <div className="container">
            <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                <PageTitle title={"Push Notification"} />
            </div>
            <div className="sm:pb-[48px] pb-[24px]">
                <div className="mb-[30px] flex items-center justify-center">
                    <div className="flex flex-row justify-between items-center social-border fav-follow bg-[#FFFFFF14] rounded-[12px] p-[12px] mb-5 sm:w-[80%] w-full gap-2">
                        <div className="sm:text-[18px] text-base text-white font-[500] text-lef sub-title-class">
                            Push notification all incoming message
                        </div>
                        <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="notify-post" checked={pushNotification} className="sr-only peer"
                                    onChange={togglePushNotifications} disabled={pushNotificationLoading}
                                />
                                <div className="w-[33px] h-[20px] bg-[#FFFFFF] border border-[#FFFFFF] peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#060C4D] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#060C4D] after:border-[#060C4D] after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-green-500 peer-checked:border-none peer-checked:after:bg-[#FFFFFF] peer-checked:after:border-none"></div>
                            </label>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
