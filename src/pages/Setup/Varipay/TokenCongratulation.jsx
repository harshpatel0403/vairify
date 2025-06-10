import { useSelector } from "react-redux";
import UserService from "../../../services/userServices";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TokenCongratulation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [token, setTokens] = useState(0);
  const UserDetails = useSelector((states) => states?.Auth?.Auth?.data?.user);

  const getTokens = () => {
    UserService.getUserTokens(UserDetails._id)
      .then((res) => {
        const data = res.tokens;
        setTokens(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTokens();
  }, []);

  const handelNavigation = (e) => {
    e.preventDefault();
    navigate("/goldentoken");
  };

  return (
    <div className="container py-[48px]">
      <div className="max-w-[500px] mx-auto">
        <div className="mt-3">
          <img className="mx-auto" src={`/images/setup/gold.svg`} alt="" />
        </div>
        <div className="my-[24px]">
          <h3 className="text-white text-xl font-medium max-w-[345px] mx-auto text-center">
            {t("grtcongrats.title", { tokens: state?.totalTokens })}
          </h3>
          <p className="text-sm text-white opacity-[72%] text-center mt-[10px]">
            {t("grtcongrats.success")}
          </p>
        </div>
        <div className="flex justify-between items-center gap-[24px] mt-[24px] bg-[#FFFFFF14] p-[16px] rounded-[16px]">
          <img src={`/images/gold waller 1.png`} alt="" className="w-[60px]" />

          <h3 className="text-white text-base flex-1 leading-10">
            {t("grtcongrats.balance")}
            <span className="font-semibold">{token}</span>
          </h3>
        </div>
        <div className="mt-[24px]">
          <button
            onClick={(e) => {
              handelNavigation(e);
            }}
            className="bg-[#008F34] text-[#01195C] font-bold text-[26px] w-full flex justify-center items-center h-[50px] rounded-lg mx-auto"
          >
            <img src={`/images/Group 1000005612.png`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenCongratulation;
