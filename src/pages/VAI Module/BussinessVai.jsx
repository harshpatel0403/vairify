/* eslint-disable react/no-unescaped-entities */

import { useState } from "react";
import Button from "../../components/Button";
import SelectBox from "../../components/SelectBox";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/backArrowButton";
import { useTranslation } from "react-i18next";

const BussinessVai = () => {
  const navigate = useNavigate();
   const { t } = useTranslation();
  const [businessOptions] = useState([
    t("businessVai.dropdownDefault"),
    "1",
    "2",
    "3",
    "4",
  ]);
  const [selectAdditional, setSelectAdditional] = useState(0);

  const HandleOnClick = () => {
    const amount = parseInt(selectAdditional) * 25;
    const totalAmount = parseInt(amount) + 199.0;
    navigate("/subscription", {
      state: {
        AdditionalVerification: selectAdditional,
        amount,
        totalAmount: totalAmount,
      },
    });
  };
  return (
    <div className="container sm:py-0 py-[24px]">
      <div className="sm:p-[40px]  relative ">
        <div className="backnavigation"><BackButton /></div>
        <div className="logo-img-container">
          <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
          <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
        </div>
        <div className="flex-1">
          {/* <div className="mb-4">
          <div className="flex flex-row justify-center mx-auto items-center w-max-370">
            <div className="w-max-175">
                    <img src={import.meta.env.BASE_URL + "/images/ChainPassId.png"} alt="Chain Pass ID" />
                </div>
            <div className="relative flex flex-col justify-start items-center">
              <div className="relative top-6">
                <img
                  src={import.meta.env.BASE_URL + "images/VectorLogo1.png"}
                  alt="Vector Logo 1"
                />
              </div>
              <div className="relative bottom-2 left-4">
                <img
                  src={import.meta.env.BASE_URL + "images/VectorLogo2.png"}
                  alt="Vector Logo 2"
                />
              </div>
            </div>
          </div>
        </div> */}

          <div className="sm:mt-[64px] mt-[30px]">
            <div className="flex flex-col justify-center items-center p-[16px] bg-[#FFFFFF14] rounded-[16px]">
              <h6 className="lg:text-[28px] sm:text-2xl text-xl font-bold text-white mb-2 lg:text-left text-center"> {t("businessVai.title")}</h6>
            <p className=" lg:text-lg sm:text-base text-sm text-white font-normal opacity-[0.7] lg:text-left text-center ">{t("businessVai.included")}</p>
            <p className=" lg:text-lg sm:text-base text-sm text-white font-normal opacity-[0.7] lg:text-left text-center "> {t("businessVai.selectAdditional")}</p>
            </div>
          </div>
          <div className="mb-5 mt-[24px]">
            <SelectBox
              className1="text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"
              size={"h-[47px]"}
              textAlign={"text-left"}
              rounded={"rounded-2xl"}
              fontWeight={"font-bold"}
              textColor={"!text-white"}
              textSize={"!text-[14px]"}
              value={selectAdditional}
              onChange={(e) => {
                const newValue = parseInt(e.target.value) || 0;
                setSelectAdditional(newValue);
              }}
              options={businessOptions}

            // border={error.typeofBusiness && `#ef4444`}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            text={"Next >"}
            size="45px"
            onClick={HandleOnClick}
            className="max-w-[500px]"
          />
        </div>
      </div>
    </div>
  );
};

export default BussinessVai;
