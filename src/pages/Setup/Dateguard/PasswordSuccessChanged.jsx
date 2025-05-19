import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import PageTitle from '../../../components/PageTitle';

export default function PasswordSuccessChanged() {

    const navigate = useNavigate()
    useEffect(() => {
        const redirectTimeout = setTimeout(() => {
            navigate('/dateguard-setup');
        }, 3000);

        return () => clearTimeout(redirectTimeout);
    }, []);

    return (
        <div className="container pb-[48px]">
            <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                <PageTitle title={"Date Guard"} />
            </div>
            <div className="flex items-center justify-center">
                <img src="/images/setup/Disarm.svg" alt="guard" />
            </div>
            <h3 className="sm:text-[28px] text-[24px] font-semibold text-center text-white my-[24px]">Codes Successfully <br />
                Changed</h3>
            <h4 className="text-[#008F34] sm:text-[24px] text-[20px] font-semibold text-center flex items-center justify-center gap-1">Change Successfully <img src="/images/setup/confirm-check.svg" alt="guard" /></h4>
        </div >
    );
}