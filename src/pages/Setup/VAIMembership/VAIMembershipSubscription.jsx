import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton/backArrowButton";
import InputText from "../../../components/InputText";

const VAIMembershipSubscription = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const HandlePayment = () => {
    navigate("/vai-membership-payment", {
      state: state,
    });
  };

  return (
    <div className="container">
      <div className="w-full flex flex-col items-center mt-[30px] py-2 px-[10px]">
        <span className="text-[26px] text-white">
          VAIRIFY
        </span>
      </div>
      <div className="w-full sm:bg-transparent bg-[#FFFFFF14] rounded-[16px] p-[16px] sm:p-0">
        <div className=" flex justify-center items-center sm:gap-8 gap-2 sm:mt-[64px] md:flex-row flex-col">
          <div>
            <img
              src={'/images/get-vai/chainpass-id-logo.png'}
              alt="chainpass id logo"
              className="sm:max-w-[325px] max-w-[200px]"
            />
          </div>
          <div className="flex items-end gap-2">
            <img src="/images/get-vai/vai-logo.svg" alt="vai logo" className="sm:max-w-[300px]" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center sm:mb-[24px] mt-[24px] sm:p-[16px] sm:bg-[#FFFFFF14] rounded-[16px]">
          <h6 className="lg:text-[28px] sm:text-2xl text-xl font-bold text-white lg:text-left text-center sm:mb-2 mb-[32px]">
            {`${state?.currency} ${state?.finalAmount + ".00"}`}
          </h6>
          <p className=" lg:text-lg sm:text-base text-sm text-white font-normal opacity-[0.7] lg:text-left text-center mb-[24px] sm:block hidden">
            {`Vairify ${state?.title} Membership Plan`}
          </p>
          {/* <div className="relative w-full">
              <InputText
                placeholder={"Coupon Code"}
                className={"text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px] placeholder:text-[#ffffff] pr-[60px]"}
                type={"text"}
                name={"couponCode"}
              />
              <button className="text-semibold text-[#098C00] text-sm border-0 bg-transparent absolute right-[14px] top-1/2 transform -translate-y-1/2">
                Apply
              </button>
            </div> */}
        </div>
      </div>

      <div className="max-w-[500px] mx-auto w-full">
        <Button
          text={"Submit Payment"}
          size="48px"
          onClick={HandlePayment}
        />
        <p className="text-center text-[14px] font-normal opacity-70 text-white mt-[12px] flex items-center justify-center gap-1"><img src="/images/face-verification/lock.svg" alt="icon" /> Make payment securely </p>
      </div>

      {/* <div className="pt-5 pb-4 text-bold max-w-[500px] mx-auto">
          <hr className="border-black w-14 inline-block align-middle" />
          <span className="text-black font-bold mx-3 text-sm">OR</span>
          <hr className="border-black w-14 inline-block align-middle" />
        </div>
        <div className="pb-7 max-w-[500px] mx-auto">
          <Button
            className={
              "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
            }
            text={"Enter Coupon Code"}
            size="56px"
            // onClick={() => HandlrCoupon(item)}
          />
        </div> */}
    </div>
  );
};

export default VAIMembershipSubscription;
