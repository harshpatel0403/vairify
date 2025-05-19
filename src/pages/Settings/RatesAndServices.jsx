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

export default function RatesAndServices() {
    const navigate = useNavigate();
    const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

    const location = useLocation();
    const appointment = location.state;
    const state = {
        parentPage: "Setting",
    };


    return (
        <div className="container">
            <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                <PageTitle title={"Services and Rates"} isSmall={true} />
            </div>
            <div className="sm:pb-[48px] pb-[24px]">
                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/services")}>
                    <span className="text-[14px] text-normal text-white text-center">Edit Services</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/cal-setting", { state: { from: 'settings' } })}>
                    <span className="text-[14px] text-normal text-white text-center">Edit Hours/Calendar</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/hourly-rates")}>
                    <span className="text-[14px] text-normal text-white text-center">Edit Rates</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>
            </div>
        </div>

    );
}
