import React, { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import Button from "../../components/Button";
import PaySubscriptionServices from "../../services/PaySubscriptionServices";
import { toast } from "react-toastify";
import SettingsService from "../../services/SettingsService";
import Loading from "../../components/Loading/Index";
import { HandleUpdateUser } from "../../redux/action/Auth";
import PageTitle from "../../components/PageTitle";

export default function ManageProfile() {
    const navigate = useNavigate();
    const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user) || {};
    const GallaryData = useSelector((state) => state?.Gallary) || [];
    const ServicesData = useSelector((state) => state?.Services?.getservices) || [];
    const LanguagesData = useSelector((state) => state?.Auth?.language);
    const SocialData = useSelector((state) => state?.Social) || [];
    const location = useLocation();
    const appointment = location.state;
    const state = {
        parentPage: "Setting",
    };

    const { HourllyRate, Services } = useMemo(() => {
        let HourllyRate = false;
        let Services = false;

        if (Object.keys(UserData).length > 0) {
            if (UserData?.user_type === "client-hobbyist") {
                HourllyRate = true;
                Services = true;
            }

            if (UserData?.user_type === "agency-business") {
                HourllyRate = true;
                Services = true;
                HourllyRate = ServicesData?.some((item) => item?.businessHourlyRates?.length > 0);
                Services = true;
            }

            if (
                UserData?.user_type === "companion-provider" ||
                UserData?.user_type === "influencer-affiliate"
            ) {
                // HourllyRate = true;
                // Services = true;
                HourllyRate = ServicesData?.some((item) => item?.hourlyRates?.length > 0);
                Services = ServicesData?.some((item) => item?.services?.length > 0);
            }
        }

        return { HourllyRate, Services };
    }, [UserData, ServicesData]);
    const handleLanguage = () => {
        const sendFromState = (LanguagesData || UserData?.language) && UserData?.gender && UserData?.mutualContractSigned && UserData?.varipayActivity && (HourllyRate && Services) && UserData?.vaiNowAvailable?.availableFrom && UserData?.dateGuardActivity && GallaryData?.userGallary?.images?.length > 0 && !SocialData?.socialData?.find((item) => item)?.message && UserData?.incallAddresses?.length > 0
        navigate("/language", { state: { from: "settings", showLayoutHeader: sendFromState ? true : false } });
    };


    return (
        <div className="container">
            <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                <PageTitle title={"Manage Profile"} />
            </div>
            <div className="sm:pb-[48px] pb-[24px]">

                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/user/profile")}>
                    <span className="text-[14px] text-normal text-white text-center">View Profile</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() =>
                    navigate("/personal-information", {
                        state,
                    })
                }>
                    <span className="text-[14px] text-normal text-white text-center">Change Personal Information</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={handleLanguage}>
                    <span className="text-[14px] text-normal text-white text-center">Change Language</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/settings/faviourite-locations")}>
                    <span className="text-[14px] text-normal text-white text-center">Favourite Locations</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/manage-incall-addresses", { state: { from: "settings" } })}>
                    <span className="text-[14px] text-normal text-white text-center">Edit incall/outcall location</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/cal-setting", { state: { from: "settings" } })}>
                    <span className="text-[14px] text-normal text-white text-center">Change your schedules and availability</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/change-password", { state: { from: "settings" } })}>
                    <span className="text-[14px] text-normal text-white text-center">Change Password</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

            </div>
        </div>

    );
}
