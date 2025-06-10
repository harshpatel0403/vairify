/* eslint-disable no-unreachable */
import Button from "../../components/Button";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import InputText from "../../components/InputText";
import Loading from "../../components/Loading/Index";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HandleGenerateCoupon } from "../../redux/action/VAI";
import { toast } from "react-toastify";
import { instance as axios } from "../../services/httpService";
import PaySubscriptionServices from "../../services/PaySubscriptionServices";
import { HandleUpdateUser, membershipSubscribe } from "../../redux/action/Auth";
import BackButton from "../../components/BackButton/backArrowButton";
import { useTranslation } from "react-i18next";

const Payment = () => {
  const { state: totalPayment } = useLocation();

  const strip = useStripe();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const elements = useElements();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [cardHolderName, setCardHolderName] = useState("");

  const handlePaySubscription = async () => {
    try {
      setIsLoading(true);
      const response = await PaySubscriptionServices.paySubScription({
        userId: UserDetails?._id,
        planId: totalPayment?.planId,
        days: totalPayment?.days,
        amount: totalPayment?.totalAmount,
        type: totalPayment?.type,
      });

      if (UserDetails?.user_type === "agency-business") {
        return await GenerateCoupon();
      }

      setIsLoading(false);
      navigate("/payment-success");

      await dispatch(HandleUpdateUser(UserDetails?._id));
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    // handlePaySubscription();
    setIsLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/stripe/create-subscription/${UserDetails?._id
        }`,
        {
          planId: totalPayment?.planId,
          coupons: totalPayment?.AdditionalVerification || 0,
          isCouponApplied: totalPayment?.isCouponApplied,
          migrationPlanId: totalPayment.migrationId,
        },
        {
          // params: {
          //   total: totalPayment?.totalAmount,
          //   currency: "PKR",
          //   name: cardHolderName,
          //   phone: "030030303033030",
          // },
        }
      )
      .then(function (response) {
        let clientSecrets = response.data.clientSecrets;

        for (let clientSecret of clientSecrets) {
          strip
            .confirmCardPayment(clientSecret, {
              payment_method: {
                card: elements.getElement(CardNumberElement),
              },
            })
            .then(async (res) => {
              if (res?.error?.code) {
                toast.error(
                  `${res?.error?.message} ${res?.error?.decline_code
                    ? "Reason: " +
                    res?.error?.decline_code?.replaceAll("_", " ")
                    : ""
                  }`,
                  {
                    className: "capitalize",
                    allowHtml: true,
                  }
                );

                return;
              }

              const data = {
                userId: UserDetails?._id,
                planId: totalPayment?.planId,
                days: totalPayment?.days,
                amount: res?.paymentIntent?.amount / 100,
                currency: res?.paymentIntent?.currency,
                type: totalPayment?.type,
                transactionId: res?.paymentIntent?.id,
                subscriptionId: response?.data?.subscriptionId,
                migrationPlanId: totalPayment.migrationId,
                migrationAmount: totalPayment?.migration,
              }
              await dispatch(membershipSubscribe(data))
                .then((res) => {
                  console.log(res, "data payment");
                })
              // Generat coupon code
              if (UserDetails?.user_type === "agency-business") {
                return await GenerateCoupon();
              }
              toast.success(t("payment.successToast"), { autoClose: 2000 });
              navigate("/payment-success");

              // await dispatch(HandleUpdateUser(UserDetails?._id));
            })
            .catch((err) => {
              console.warn("strip error", err);
              setIsLoading(false);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      })
      .catch(function (error) {
        console.log("error: ", error);
        setIsLoading(false);
      });
    // handlePaySubscription();
  };

  // Generate Coupon code
  const GenerateCoupon = async () => {
    setIsLoading(true);
    const body = {
      userId: UserDetails?._id,
      numberOfCoupons: parseFloat(totalPayment?.AdditionalVerification) + 3,
    };
    await dispatch(HandleGenerateCoupon(body))
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result.payload.data.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          navigate("/payment-success");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
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

  return (
    <div className="signup-backgound-design">
      <div className="signup-container container">
        <div className="signup-content relative">
          <div className="backnavigation"><BackButton /></div>
          <div className="logo-img-container">
            <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
            <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
          </div>
          <div className="sm:mt-[64px] mt-[32px] bg-[#FFFFFF14] sm:rounded-[16px] rounded-[8px] p-[16px]">
            <div className="flex justify-between sm:flex-nowrap flex-wrap items-center sm:gap-[30px] gap-3 mb-[24px]">
              <img src={"/images/face-verification/chainpass.svg"} alt="asdf" />
              <div className="flex gap-2"><p className="sm:text-[18px] text-[14px] font-normal text-white opacity-70">{formattedDate}</p><p className="sm:text-[18px] text-[14px] font-normal text-white opacity-70">#1832-9912-7552</p></div>
            </div>
            <div className="flex justify-between items-center gap-[30px] mb-[16px]">
              <h4 className="sm:text-[18px] text-[14px] font-normal text-white"> {t("payment.vaiSubscription")}:{" "}</h4>
              <h5 className="sm:text-[18px] text-[14px] font-normal text-white">{totalPayment?.currency + totalPayment?.subscriptionAmount}.00</h5>
            </div>
            <div className="flex justify-between items-center gap-[30px] mb-[16px]">
              <h4 className="sm:text-[18px] text-[14px] font-normal text-white"> {t("payment.migrationSpecial")}:{" "}</h4>
              <h5 className="sm:text-[18px] text-[14px] font-normal text-white">{totalPayment?.currency + totalPayment?.migration}.00</h5>
            </div>
            <hr className="border border-dashed border-[#919EAB33]" />
            {totalPayment?.AdditionalVerification > 0 ? (
              <>
              <div className="flex justify-between items-center gap-[16px] mb-[16px] mt-3">
                <h1 className="col-span-2 sm:text-[18px] text-[14px] font-normal text-white text-center">
                  {`${totalPayment?.currency}${"25" + ".00"} * ${totalPayment?.AdditionalVerification
                    } coupons:`}
                </h1>
                <h1 className="sm:text-[18px] text-[14px] font-normal text-white text-start">
                  {totalPayment?.currency +
                    25 * totalPayment?.AdditionalVerification}
                  .00
                </h1>
              </div>
              <div className="flex justify-between items-center gap-[16px] mb-[16px] mt-3">
                  <h1 className="col-span-2 sm:text-[18px] text-[14px] font-normal text-white text-start">
                    Total Amount:
                  </h1>
                  <h1 className="sm:text-[18px] text-[14px] font-normal text-white text-start">
                    {`${totalPayment?.currency} ${(
                      25 * totalPayment?.AdditionalVerification +
                      totalPayment?.totalAmount
                    ).toFixed(2)}`}
                  </h1>
              </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center gap-[30px] mt-[16px]">
                  <h1 className="sm:text-[18px] text-[14px] font-normal text-white">
                    {t("payment.totalAmount")}:
                  </h1>
                  <h1 className="sm:text-[18px] text-[14px] font-normal text-white">
                    {totalPayment?.currency + totalPayment?.totalAmount}.00
                  </h1>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-center sm:flex-nowrap flex-wrap gap-[20px] w-full mt-[24px]">
            <div className="w-full flex flex-col gap-1">
              <label className="text-[14px] font-normal text-white pl-1">
                {t("payment.cardNumber")}
              </label>
              <div>
                <CardNumberElement
                  id="cardNumber"
                  options={{
                    style: {
                      base: {
                        color: "#ffffff",
                        fontSize: "16px",
                        "::placeholder": {
                          color: "#ffffff99",
                        },
                      },
                    },
                  }}
                  className={`w-full pt-[15px] text-[16px] font-normal text-white border-2 border-[#919EAB33] bg-transparent rounded-[8px] py-[16px] px-[14px] h-[50px]`}
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-1">
              <label className="text-[14px] font-normal text-white pl-1">
                {t("payment.cardHolderName")}
              </label>
              <InputText
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                placeholder={"Card Holder Name"}
                influencer-affiliate
                className={`w-full text-[16px] !placeholder-[#ffffff99] font-normal text-white border-2 border-[#919EAB33] bg-transparent rounded-[8px] py-[16px] px-[14px] h-[50px]`}
                name={"CardHolderName"}
              />
            </div>
          </div>
          <div className="flex items-center justify-center sm:flex-nowrap flex-wrap gap-[20px] w-full mt-[24px]">
            <div className="w-full flex flex-col gap-1">
              <label className="text-[14px] font-normal text-white pl-1">
                {t("payment.expirationDate")}
              </label>
              <div>
                <CardExpiryElement
                  id="expiry"
                  options={{
                    style: {
                      base: {
                        color: "#ffffff",
                        fontSize: "16px",
                        "::placeholder": {
                          color: "#ffffff99",
                        },
                      },
                    },
                  }}
                  className={`w-full pt-[15px] text-[16px] font-normal text-white border-2 border-[#919EAB33] bg-transparent rounded-[8px] py-[16px] px-[14px] h-[50px]`}
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-1">
              <label className="text-[14px] font-normal text-white pl-1">
                CVC
              </label>
              <div>
                <CardCvcElement
                  id="cvc"
                  options={{
                    style: {
                      base: {
                        color: "#ffffff",
                        fontSize: "16px",
                        "::placeholder": {
                          color: "#ffffff99",
                        },
                      },
                    },
                  }}
                  className={`w-full pt-[15px] text-[16px] font-normal text-white border-2 border-[#919EAB33] bg-transparent rounded-[8px] py-[16px] px-[14px] h-[50px] `}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-center mx-auto max-w-[500px] mt-[24px]">
            <Button
              onClick={handleOrder}
              text={
                !isLoading ? (
                  t("payment.makePayment")
                ) : (
                  <div className="flex items-center	justify-center">
                    <Loading />
                  </div>
                )
              }
              disabled={isLoading}
            />
          </div>
          <p className="text-center text-[14px] font-normal mb-[24px] opacity-70 text-white mt-[12px] flex items-center justify-center gap-1"><img src="/images/face-verification/lock.svg" alt="icon" /> {t("payment.secureNote")} </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;