import React from "react";
import Escort from "./Escort";
import { useSelector } from "react-redux";
import BusinessRateServices from "../../../components/Services/business/BusinessServices";
import { useLocation } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { useTranslation } from "react-i18next";

export default function Home() {
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const { state } = useLocation();
  const { t } = useTranslation();
  return (
    <div className="container px-0">
      {UserData?.user_type === "agency-business" ? (
        <BusinessRateServices UserData={UserData} EditData={state} />
      ) : (
        <>
          <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
            <PageTitle title={t("services.pageTitle")} />
          </div>
          <Escort />
        </>
      )}
    </div>
  );
}
