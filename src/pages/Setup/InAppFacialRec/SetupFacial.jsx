import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button";
import Header from "../../../components/Header/Header";
import PageTitle from "../../../components/PageTitle";

const SetupFacial = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/facial-recognition");
  };
  return (
    <div className="">
      <div className="container">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px] md:hidden block">
          <PageTitle title={t("setupfacial.title")} />
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center sm:my-[48px] my-[24px]">
          <p className="font-bold sm:text-[28px] text-2xl text-white sm:block hidden">{t("setupfacial.heading")}</p>
          <p className="text-white text-base font-normal mt-4 opacity-[0.7]">{t("setupfacial.description")}</p>
          <div className="w-[90%] mx-auto max-w-[300px] h-[300px] mt-[24px]">
            <img
              src={"/images/facialRecognitionLogo.png"}
              alt="Facial Recognition"
              className="w-full object-cover h-full rounded-[16px]"
            />
          </div>

          <div className="w-full mx-auto flex flex-row justify-around items-center flex-wrap mt-5">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-14 h-8 border border-[#FFFFFFB3] peer-focus:outline-none peer-focus:ring-0 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-transparent peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              {/* <div className='flex items-center justify-center w-[249px] border-2 border-white bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[25px] ml-3 shadow-2xl'></div> */}
            </label>
          </div>

          {/* <div className="w-[163.8px]">
            <Button
              onClick={() => handleSubmit()}
              text={`${t("setupfacial.skip")} >>`}
              className="font-bold text-[23.4px] text-[#01195C] bg-transparent shadow-none focus:bg-transparent"
            />
          </div> */}
          <Button
            onClick={() => handleSubmit()}
            text={`${t("setupfacial.submit")} >>`}
            className="max-w-[500px] mx-auto mt-5 mb-[48px]"
            size='48px'
          />
        </div>
      </div>
    </div>
  );
};

export default SetupFacial;
