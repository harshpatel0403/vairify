import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import BackButton from "../../components/BackButton/backArrowButton";
import { useTranslation } from "react-i18next";

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const HandleOnClick = () => {
    console.log(UserData);
    navigate('/setup');

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


          <div className="sm:mt-[64px] mt-[32px]">
            <div className="flex items-center justify-center flex-col gap-[32px]">
              <img src={"/images/face-verification/chainpass.svg"} alt="asdf" />
              <img src={"/images/face-verification/success.svg"} alt="asdf" />
            </div>

            <h3 className="text-white sm:text-[28px] text-[20px] font-medium text-center">{t("paymentSuccess.title")}</h3>
            <p className="text-white text-[14px] font-normal text-center opacity-70">{t("paymentSuccess.description")}</p>

            <div className="flex items-center justify-center w-full max-w-[500px] mx-auto mt-[40px]">
              <Button
                text={t("paymentSuccess.button")}
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

export default PaymentSuccess;

{/* <div className="main-container">
      <div className="flex flex-col justify-center items-center mx-auto">
        <div className="grid grid-cols-1 grid-flow-col gap-4">
          <div className="relative flex flex-col justify-start items-center">

            <div className="relative mt-5">
              <img width={'250px'} 
                src={'/images/chainpass_id_logo.png'}
                alt="asdf"
              /> 
            </div> 

            <div className="relative top-8 mb-5">
              <span className="font-semibold text-[24px] text-[#000000]">
                Your payment was successful.
              </span>
            </div>
          </div>
        </div>
        <div className="relative top-9 w-[90%] max-w-[500px]">
          <img
            src={import.meta.env.BASE_URL + "images/PaymentSuccess.png"}
            alt="Payment Success"
            className="w-[80%] mx-auto"
          />
        </div>
        <div className="w-max-370 flex-1 w-full mt-10 mb-2">
          <Button
            className={
              "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
            }
            text={"Go to V.A.I."}
            size="55px"
            onClick={HandleOnClick}
          />
        </div>
      </div>
    </div> */}