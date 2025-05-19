import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import Loading from "../../../components/Loading/Index";
import { HandleDiscountCoupon } from "../../../redux/action/VAI";
import { useState } from "react";
import { toast } from "react-toastify";

const MembershipSubscription = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [applyCouponLoading, setApplyCouponLoading] = useState(false);
  const [yourValueState, setYourValueState] = useState();
  const [error, setError] = useState({});

  const HandlePayment = () => {
    navigate("/vairify-membership-payment", {
      state: state,
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

  return (
    <>
      <div className="container">
        <div className="w-full flex flex-col items-center mt-[30px] py-2 px-[10px]">
          <span className="text-[26px] text-white">
            VAIRIFY
          </span>
        </div>
        <div >
          <div className="w-full sm:bg-transparent rounded-[16px] p-[16px] sm:p-0 sm:mt-0 mt-[64px]">

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
                {`${state?.currency} ${state?.finalAmount + ".00"}`}
              </h6>
              <p className=" lg:text-lg sm:text-base text-sm text-white font-normal opacity-[0.7] lg:text-left text-center sm:block hidden">
                Total amount to pay include all taxes
              </p>
              {
                (state?.AdditionalVerification > 0) &&
                <>
                  <div className="mt-2">
                    <h6 className="lg:text-2xl sm:text-xl font-bold text-white lg:text-left text-center sm:mb-2 mb-[32px]">
                      {`${state?.currency} ${"25" + ".00"} * ${state?.AdditionalVerification} coupons`}
                    </h6>
                  </div>
                  <div>
                    <h6 className="lg:text-2xl sm:text-xl font-bold text-white lg:text-left text-center sm:mb-2 mb-[32px]">
                      {`Total ${state?.currency} ${(25 * state?.AdditionalVerification + state?.finalAmount).toFixed(2)}`}
                    </h6>
                  </div>
                </>

              }
              <div className="mt-[24px] w-full">
                <div className="relative w-full">
                  <InputText
                    type="text"
                    className={"text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px] placeholder:text-[#ffffff] pr-[60px]"}
                    value={yourValueState}
                    onChange={(e) => setYourValueState(e.target.value)}
                    placeholder="Coupon Code"
                  />
                  <button className="text-semibold text-[#098C00] text-sm border-0 bg-transparent absolute right-[14px] top-1/2 transform -translate-y-1/2"
                    onClick={HandleClick}>
                    {applyCouponLoading ? <Loading /> : "Apply"}
                  </button>
                </div>
                {error.coupon && (
                  <label className="text-red-500 text-sm flex items-baseline p-1">
                    {error.coupon}
                  </label>
                )}
              </div>
            </div>

          </div>

          <div className="max-w-[500px] mx-auto sm:mt-0 mt-[40px]">
            <Button
              text={"Submit Payment"}
              size="48px"
              onClick={HandlePayment}
            />
            <p className="text-center text-[14px] font-normal opacity-70 text-white mt-[12px] flex items-center justify-center gap-1"><img src="/images/face-verification/lock.svg" alt="icon" /> Make payment securely </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipSubscription;
