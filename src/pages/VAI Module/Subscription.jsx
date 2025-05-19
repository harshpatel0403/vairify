import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import PlansServices from "../../services/PlansServices";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BackButton from "../../components/BackButton/backArrowButton";
import InputText from "../../components/InputText";
import { HandleDiscountCoupon } from "../../redux/action/VAI";
import Loading from "../../components/Loading/Index";
import { useTranslation } from "react-i18next";

const Subscription = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [plansData, setPlansData] = useState([]);
  const [yourValueState, setYourValueState] = useState();
  const [error, setError] = useState({});
  const [applyCouponLoading, setApplyCouponLoading] = useState(false);

  const UserType = UserData?.user_type;

  const HandlrPayment = (selectedItem) => {
    navigate("/migration", {
      state: { ...selectedItem, ...state },
    });
  };

  const HandleClick = () => {
    try {

      setApplyCouponLoading(true);
      const body = {
        userId: UserData?._id,
        couponCode: yourValueState,
      };
      const validationErrors = {};

      if (!yourValueState) {
        validationErrors.coupon = "Coupon code is required";
      }

      if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors);
        setApplyCouponLoading(false);
        return;
      }
      setError({});

      dispatch(HandleDiscountCoupon(body))
        .then((result) => {
          toast.success(result?.payload?.message);
        })
        .catch((err) => {
          toast.error(err?.payload?.data?.message);
          console.error(err, "Error");
        })
        .finally(() => {
          setApplyCouponLoading(false);
          setYourValueState("");
        });
    } catch (error) {
      console.error("Error applying coupon: ", error)
    }
  };

  const fetchPlans = async () => {
    try {
      const result = await PlansServices.getPlansByUserType(UserType);
      setPlansData(result?.data);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="signup-backgound-design">
      <div className="signup-container container">
        <div className="signup-content relative">
          <div className="backnavigation"><BackButton /></div>
          <div className="logo-img-container">
            <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
            <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
          </div>
          {plansData &&
            plansData?.map((item, index) => {
              return (
                <div key={index} >
                  <div className="w-full sm:bg-transparent bg-[#FFFFFF14] rounded-[16px] p-[16px] sm:p-0 sm:mt-0 mt-[64px]">

                    <div>
                      <div className=" flex justify-center items-center gap-8 sm:mt-[64px] md:flex-row flex-col">
                        <div>
                          <img
                            src={'/images/get-vai/chainpass-id-logo.png'}
                            alt="chainpass id logo"
                            className="sm:max-w-[325px] max-w-[200px]"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <img src="/images/get-vai/vai-logo.svg" alt="vai logo" className="max-w-[300px] " />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center sm:mb-[24px] mt-[24px] sm:p-[16px] sm:bg-[#FFFFFF14] rounded-[16px]">

                      <h6 className="lg:text-[28px] sm:text-2xl text-xl font-bold text-white lg:text-left text-center mb-2">
                        {`${item?.currency} ${item?.finalAmount + ".00"}`}
                      </h6>
                      <p className=" lg:text-lg sm:text-base text-sm text-white font-normal opacity-[0.7] lg:text-left text-center sm:block hidden">
                        {t("subscription.totalAmount")}
                      </p>
                      {
                        (state?.AdditionalVerification > 0) &&
                        <>
                          <div className="mt-2">
                            <h6 className="lg:text-2xl sm:text-xl font-bold text-white lg:text-left text-center sm:mb-2 mb-[32px]">
                              {`${item?.currency} ${"25" + ".00"} * ${state?.AdditionalVerification} coupons`}
                            </h6>
                          </div>
                          <div>
                            <h6 className="lg:text-2xl sm:text-xl font-bold text-white lg:text-left text-center sm:mb-2 mb-[32px]">
                              {`Total ${item?.currency} ${(25 * state?.AdditionalVerification + item?.finalAmount).toFixed(2)}`}
                            </h6>
                          </div>
                        </>

                      }
                      <div className="mt-[24px] w-full">
                        {/* <p className="font-black text-[16.2px] pt-2 pb-2">{formattedDate}</p> */}
                        <div className="relative w-full">
                          <InputText
                            type="text"
                            className={"text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px] placeholder:text-[#ffffff] pr-[60px]"}
                            value={yourValueState}
                            onChange={(e) => setYourValueState(e.target.value)}
                            placeholder={t("subscription.couponPlaceholder")}
                          />
                          <button className="text-semibold text-[#098C00] text-sm border-0 bg-transparent absolute right-[14px] top-1/2 transform -translate-y-1/2"
                            onClick={HandleClick}>
                            {applyCouponLoading ? <Loading /> : t("subscription.applyButton")}
                          </button>
                        </div>
                        {error.coupon && (
                          <label className="text-red-500 text-sm flex items-baseline pl-[33px] pt-[2px]">
                            {error.coupon}
                          </label>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="max-w-[500px] mx-auto sm:mt-0 mt-[40px]">
                    <Button
                      text={t("subscription.submitButton")}
                      size="48px"
                      onClick={() => HandlrPayment(item)}
                    />
                    <p className="text-center text-[14px] font-normal opacity-70 text-white mt-[12px] flex items-center justify-center gap-1"><img src="/images/face-verification/lock.svg" alt="icon" /> {t("subscription.securePaymentNote")} </p>
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
                  onClick={() => HandlrCoupon(item)}
                />
              </div> */}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Subscription;


{/* <div className="grid grid-cols-1 grid-flow-col gap-4">
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
      </div> */}

{/* <div className="pt-4 mx-auto">
        <img
          className="mx-auto"
          src={import.meta.env.BASE_URL + "images/V.A.I..png"}
        />
        <p className="text-xl mt-8 font-semibold">
          Verified Anonymous Identity
        </p>
      </div> */}

