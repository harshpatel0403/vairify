import { useState } from "react";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { HandleDiscountCoupon } from "../../redux/action/VAI";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Index";
import { useTranslation } from "react-i18next";

const DiscountCoupon = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [yourValueState, setYourValueState] = useState();
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const dispatch = useDispatch();
  const [error, setError] = useState({});

  // Create a new Date object for the current date
  const currentDate = new Date();

  // Define options for formatting the date
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Format the current date using toLocaleDateString
  const formattedDate = currentDate.toLocaleDateString(undefined, dateOptions);

  const HandleClick = () => {
    setIsLoading(true);
    const body = {
      userId: UserDetails?._id,
      couponCode: yourValueState,
    };
    const validationErrors = {};

    if (!yourValueState) {
      validationErrors.coupon = "Coupon code is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setIsLoading(false);
      return; // Prevent form submission if there are errors
    }
    setError({});

    dispatch(HandleDiscountCoupon(body))
      .then((result) => {
        toast(result?.payload?.data?.message, {
          hideProgressBar: true,
          autoClose: 1000,
          type: "success",
        });
        navigate("/migration", {
          state: {...state, isCouponApplied: true },
        });
      })
      .catch((err) => {
        toast(err?.payload?.data?.message, {
          hideProgressBar: true,
          autoClose: 1000,
          type: "error",
        });
        console.error(err, "Error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="main-container flex flex-col justify-center discount-part">
      <div className="grid grid-cols-1 grid-flow-col gap-4">
        <div className="relative flex flex-col justify-center items-center">
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

      <div className="pt-4 mx-auto">
        <img
          className="mx-auto"
          src={import.meta.env.BASE_URL + "images/V.A.I..png"}
        />
        <p className="text-xl mt-8 font-semibold">
          {t("discountCoupon.title")}
        </p>
      </div>

      <div className="">
        <p className="font-black text-[16.2px] pt-2 pb-2">{formattedDate}</p>
        <input
          type="text"
          className="bg-[#CFCFCF] text-center w-[80%] p-2 border-[2px] border-gray-600 mx-auto font-extrabold text-[21px]"
          value={yourValueState}
          onChange={(e) => setYourValueState(e.target.value)}
          placeholder={t("discountCoupon.placeholder")}
        />
        {error.coupon && (
          <label className="text-red-500 text-lg flex items-baseline pl-[33px] pt-[2px]">
            {error.coupon}
          </label>
        )}
        <p className={"font-normal text-[16px] pt-px"}></p>
      </div>

      <div className="flex-1 pt-px pb-7">
        <h1 className="text-[28.8px] font-black">${state?.amount}.00</h1>
      </div>

      <div className="pb-7">
        <Button
          className={
            "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
          }
          text={
            !isLoading ? (
              t("discountCoupon.submitButton")
            ) : (
              <div className="flex items-center	justify-center">
                <Loading />
              </div>
            )
          }
          onClick={HandleClick}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default DiscountCoupon;
