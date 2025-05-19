import React, { useEffect } from "react";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../../components/BackButton/backArrowButton";
import AOS from 'aos';
import { useTranslation } from "react-i18next";
import 'aos/dist/aos.css';
export default function ChainPassIDPage() {
    const { t } = useTranslation();
  useEffect(() => {
    AOS.init({
      duration: 1400,
      once: true,
      offset: 200,
    });
  }, []);
  const navigate = useNavigate();
  const { state } = useLocation();
  const handleCompanion = () => {
    navigate("/signup", {
      state: { type: "companion-provider", language: state.language }
    });
  };
  const handleAgency = () => {
    navigate("/signup", {
      state: { type: "agency-business", language: state.language }
    });
  };
  const handleClient = () => {
    navigate("/signup", {
      state: { type: "client-hobbyist", language: state.language }
    });
  };
  const handleInfluencer = () => {
    navigate("/signup", {
      state: { type: "influencer-affiliate", language: state.language }
    });
  };

  return (
    <div className="signup-backgound-design">
      <div className="signup-container container">
        <div className="signup-content relative">
          <div className="backnavigation"><BackButton /></div>
          <div className="logo-img-container">
            <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
            <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
          </div>
          <div className="sm:mt-[64px] mt-[30px] mb-[24px]">
            <h3
              className="primary-heading text-center"
            >
              {t("chainpass.selectCategory")}
            </h3>
          </div>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-[20px]">
            <div data-aos="flip-left" className="rounded-[8px]  cursor-pointer sm:p-[20px] p-[16px] flex flex-col justify-center items-center gap-[8px] bg-white category-box" onClick={handleClient}><img src="/images/signup/category-img1.svg" alt="img" /><h4 className="gredient-text lg:text-[20px] sm:text-[16px] xs:text-[14px] font-semibold text-center">{t("chainpass.clientHobbyist")}</h4></div>
            <div data-aos="flip-left" className="rounded-[8px]   cursor-pointer sm:p-[20px] p-[16px] flex flex-col justify-center items-center gap-[8px] bg-white category-box" onClick={handleCompanion}><img src="/images/signup/category-img2.svg" alt="img" /><h4 className="gredient-text lg:text-[20px] sm:text-[16px] xs:text-[14px] font-semibold text-center">{t("chainpass.companionProvider")}</h4></div>
            <div data-aos="flip-right" className="rounded-[8px]   cursor-pointer sm:p-[20px] p-[16px] flex flex-col justify-center items-center gap-[8px] bg-white category-box" onClick={handleAgency}><img src="/images/signup/category-img3.svg" alt="img" /><h4 className="gredient-text lg:text-[20px] sm:text-[16px] xs:text-[14px] font-semibold text-center">{t("chainpass.agencyBusiness")}</h4></div>
            <div data-aos="flip-right" className="rounded-[8px]   cursor-pointer sm:p-[20px] p-[16px] flex flex-col justify-center items-center gap-[8px] bg-white category-box" onClick={handleInfluencer}><img src="/images/signup/category-img4.svg" alt="img" /><h4 className="gredient-text lg:text-[20px] sm:text-[16px] xs:text-[14px] font-semibold text-center">{t("chainpass.influencerAffiliate")}</h4></div>
          </div>
        </div>
      </div>
    </div>
  )
}


