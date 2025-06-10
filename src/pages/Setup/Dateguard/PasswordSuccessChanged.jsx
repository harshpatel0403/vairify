import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import PageTitle from '../../../components/PageTitle';

export default function PasswordSuccessChanged() {
    const { t } = useTranslation();
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
                <PageTitle title={t("passwordsuccess.pageTitle")} />
            </div>
            <div className="flex items-center justify-center">
                <img src="/images/setup/Disarm.svg" alt="guard" />
            </div>
            <h3 className="sm:text-[28px] text-[24px] font-semibold text-center text-white my-[24px]">{t("passwordsuccess.heading")}</h3>
            <h4 className="text-[#008F34] sm:text-[24px] text-[20px] font-semibold text-center flex items-center justify-center gap-1">{t("passwordsuccess.successMessage")}<img src="/images/setup/confirm-check.svg" alt="guard" /></h4>
        </div >
    );
}