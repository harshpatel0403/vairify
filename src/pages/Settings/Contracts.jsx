import React from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';

export default function Contracts() {
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
                <PageTitle title={"Contract"} />
            </div>
            <div className="sm:pb-[48px] pb-[24px]">
                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/mutalconsent", { state: { from: 'settings' } })}>
                    <span className="text-[14px] text-normal text-white text-center">Consent Contract</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() =>
                    navigate("/disclosure")
                }>
                    <span className="text-[14px] text-normal text-white text-center">Law Enforcement Disclosure</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/privacy-policy")
                }>
                    <span className="text-[14px] text-normal text-white text-center">Privacy Policy</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

                <div className="mb-[30px] flex items-center justify-between">
                    <span className="text-[14px] text-normal text-white text-center">Cookie Policy</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>

                <div className="mb-[30px] flex items-center justify-between cursor-pointer" onClick={() => navigate("/terms-and-conditions")}>
                    <span className="text-[14px] text-normal text-white text-center">Term and Conditions</span>
                    <img className="" src="/images/setup/arrow.svg" />
                </div>
            </div>
        </div>

    );
}
