import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageTitle from "../../components/PageTitle";


export default function Permissions() {
    const navigate = useNavigate();
    const { state } = useLocation();


    return (
        <div className="container">
            <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                <PageTitle title={"Role and Permissions"} isSmall={true} />
            </div>
            <div className="sm:pb-[48px] pb-[24px]">
                {/* {state?.userType === "agency-business" && ( */}
                <>
                    <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/service-business/add-staff")}>
                        <span className="text-[14px] text-normal text-white text-center">Add Staff</span>
                        <img className="" src="/images/setup/arrow.svg" />
                    </div>

                    <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/service-business/user-list?type=adminStaff")}>
                        <span className="text-[14px] text-normal text-white text-center">Admin Permissions</span>
                        <img className="" src="/images/setup/arrow.svg" />
                    </div>

                    <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/service-business/user-list?type=serviceStaff")}>
                        <span className="text-[14px] text-normal text-white text-center">Staff Permissions</span>
                        <img className="" src="/images/setup/arrow.svg" />
                    </div>
                </>
                {/* )} */}
                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/profile-permissions")}>
                    <span className="text-[14px] text-normal text-white text-center">Profile Permissions</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>
            </div>
        </div>

    );
}
