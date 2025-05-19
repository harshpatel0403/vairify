/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/backArrowButton";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const UserData = useSelector((state) => state?.Auth?.Auth?.data);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState({});
  const HandleOnClick = () => {
    const validationErrors = {};

    if (!isChecked) {
      validationErrors.isChecked = "Terms and conditions is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return; // Prevent form submission if there are errors
    }
    // Clear any previous errors
    setError({});
    if (UserData?.user?.user_type === "agency-business") {
      navigate("/bussiness-vai");
    } else {
      navigate("/subscription", {
        state: {
          AdditionalVerification: "",
          totalAmount: 149,
        },
      });
    }
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
          <div className="md:mt-[64px] mt-[24px]">
            <h2 className="lg:text-[28px] sm:text-2xl text-xl font-bold text-white mb-2 lg:text-left text-center">
              {t("terms.title")}
            </h2>
          </div>

          <div className="mt-4">
            <p className="font-normal text-white text-sm opacity-[0.7] mb-4">
              {t("terms.welcome")}
            </p>
            <p className="font-normal text-white text-sm opacity-[0.7] mb-4">
              {t("terms.para1")}
            </p>
            <p className="font-normal text-white text-sm opacity-[0.7] ">
              {t("terms.para2")}
            </p>
          </div>
          <div className="mt-4">
            <div className="flex sm:items-center items-start justify-start">
              <div className="h-fit sm:mt-0 mt-[4px]">
                <input
                  type="checkbox"
                  className="appearance-none h-[18px] w-[18px] border border-white rounded-[4px] focus:outline-none checked:bg-white checked:border-white relative checked:before:content-[' '] checked:before:bg-[url('/images/login/checked.svg')] checked:before:bg-cover checked:before:bg-center checked:before:h-[18px] checked:before:w-[18px] checked:before:absolute checked:before:left-[-1px] checked:before:top-[-1px] transition transition-all duration-300"
                  onChange={(e) => setIsChecked(e.target.checked)}
                  checked={isChecked}
                />
              </div>
              <label className="ml-4 font-normal text-white text-sm opacity-[0.7] sm:mb-2">
                {t("terms.checkboxLabel")}
              </label>
            </div>
            {error.isChecked && (
              <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                {error.isChecked}
              </label>
            )}
            <div className="w-full max-w-[500px] mx-auto sm:mt-[24px] mt-[16px] md:mb-0 mb-[48px]">
              <Button
                text={t("terms.nextButton")}
                size="55px"
                onClick={HandleOnClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default Terms;