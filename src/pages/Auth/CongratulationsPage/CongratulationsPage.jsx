import React, { useState } from "react";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import UserService from "../../../services/userServices";
import Loading from "../../../components/Loading/Index";
import BackButton from "../../../components/BackButton/backArrowButton";
import { useTranslation } from "react-i18next";

export default function CongratulationsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [betaTesterCheck, setBetaTesterCheck] = useState(true);
  const [notifyReleaseCheck, setNotifyReleaseCheck] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await UserService.updateUserPreferences(UserData?._id, {
        isBetaTester: betaTesterCheck,
        notifyOnRelease: notifyReleaseCheck
      })
      toast.success(t("congratulations.preferencesSaved"));
      navigate("/setup-face-verification");
      // navigate("/get-vai");
      // navigate("/setup");
    } catch (error) {
      toast.error(t("congratulations.preferencesError"));
    } finally {
      setLoading(false)
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
          <div className="grid grid-cols-12 gap-4 lg:mt-[72px] sm-mt-[40px] mt-[30px] items-center">
            <div className="lg:col-span-5 col-span-12">
              <div className="">
                <img src={"/images/signup/congratulations.svg"} alt="Congratulations" className="mx-auto sm:!max-w-[320px] max-w-[176px]" />
              </div>
            </div>
            <div className="lg:pr-[12px] lg:col-span-6 col-span-12">
              <div className="py-2 ">
                <div className="flex flex-col mb-custom-19">
                  {/* <div className="flex flex-col ">
                    <h2 className="text-[28px] font-bold mr-2 text-white">Your registration was successful!</h2>
                    <h2 className="text-[18px] font-bold">{UserData?.name}</h2>
                  </div> */}
                  <h6 className="lg:text-[28px] sm:text-2xl text-xl font-bold text-white mb-2 lg:text-left text-center">
                    {t("congratulations.title")}
                  </h6>
                  <p className=" text-sm text-white font-normal opacity-[0.7] mb-2 lg:text-left text-center ">
                    {t("congratulations.paragraph1")}
                  </p>
                  <p className=" text-sm text-white font-normal opacity-[0.7] mb-2 lg:text-left text-center">{t("congratulations.paragraph2")}</p>
                </div>
                <div className="mb-4">
                  <div className="flex justify-start items-center ">
                    <input
                      className="mr-4 appearance-none h-[18px] w-[18px] border border-[#919EAB33] rounded-[4px] focus:outline-none checked:bg-white checked:border-white relative checked:before:content-[' '] checked:before:bg-[url('/images/login/checked.svg')] checked:before:bg-cover checked:before:bg-center checked:before:h-[18px] checked:before:w-[18px] checked:before:absolute checked:before:left-[-1px] checked:before:top-[-1px] transition transition-all duration-300"
                      type="checkbox"
                      checked={betaTesterCheck}
                      onChange={() => setBetaTesterCheck(!betaTesterCheck)}
                    />
                    <label className="text-sm font-normal text-white opacity-[0.7]">
                      {t("congratulations.betaTester")}
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-start items-center">
                    <input
                      className="mr-4 appearance-none h-[18px] w-[18px] border border-[#919EAB33] rounded-[4px] focus:outline-none checked:bg-white checked:border-white relative checked:before:content-[' '] checked:before:bg-[url('/images/login/checked.svg')] checked:before:bg-cover checked:before:bg-center checked:before:h-[18px] checked:before:w-[18px] checked:before:absolute checked:before:left-[-1px] checked:before:top-[-1px] transition transition-all duration-300"
                      type="checkbox"
                      checked={notifyReleaseCheck}
                      onChange={() => setNotifyReleaseCheck(!notifyReleaseCheck)}
                    />
                    <label className="text-sm font-normal text-white opacity-[0.7]">
                      {t("congratulations.notifyOnRelease")}
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <Button
                  className="w-full"
                  size="45px"
                  text={
                    loading ?
                      <div className="flex items-center	justify-center">
                        <Loading />
                      </div>
                      :
                      `${t("congratulations.exploreButton")}`
                  }
                  onClick={() => handleSubmit()}
                  disabled={loading}
                />
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
