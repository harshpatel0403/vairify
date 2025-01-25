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
import { HandleUpdateUser } from "../../redux/action/Auth";

const Payment = () => {
  const { state: totalPayment } = useLocation();

  const strip = useStripe();
  const dispatch = useDispatch();
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
        `${import.meta.env.VITE_APP_API_BASE_URL}/stripe/create-subscription/${
          UserDetails?._id
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
                  `${res?.error?.message} ${
                    res?.error?.decline_code
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

              await PaySubscriptionServices.subscribeMembership({
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
              });
              // Generat coupon code
              if (UserDetails?.user_type === "agency-business") {
                return await GenerateCoupon();
              }

              navigate("/payment-success");

              await dispatch(HandleUpdateUser(UserDetails?._id));
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
    <div className="bg-[#B9BBCB] rounded-3xl items-center">
      <div className="flex flex-col justify-start main-container">
        {/* <div className="grid grid-flow-col grid-cols-1 gap-4">
        <div className="relative flex flex-col items-center justify-start">
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
        <div className="max-w-[500px] w-full yellowbg_card mb-10 pb-4 px-0 bg-[#ededf7] mt-9">
          <div className="relative flex flex-col justify-start items-center">
            <div className="relative mb-4">
              <img
                width={"250px"}
                src={"/images/chainpass_id_logo.png"}
                alt="asdf"
              />
            </div>
          </div>
          <div className="pt-4 text-lg font-medium text-[#838282]">
            <p className="text-[14px]">{formattedDate}</p>
            <p className="text-[16px]">#1832-9912-7552</p>
          </div>

          <div className="flex justify-center items-center">
            <div className="mt-4 mb-7 py-2 grid grid-cols-3 gap-x-4 ">
              <h1 className="col-span-2 font-bold text-xl text-[#01195C] w-auto table rounded-lg text-start">
                VAI Subscription:{" "}
              </h1>
              <h1 className="font-bold text-xl text-[#01195C] w-auto table rounded-lg text-start">
                {totalPayment?.currency + totalPayment?.subscriptionAmount}.00
              </h1>
              <h1 className="col-span-2 font-bold text-xl text-[#01195C] w-auto table rounded-lg text-start">
                Migration Special:{" "}
              </h1>
              <h1 className="font-bold text-xl text-[#01195C] w-auto table rounded-lg text-start">
                {totalPayment?.currency + totalPayment?.migration}.00
              </h1>
              {totalPayment?.AdditionalVerification > 0 ? (
                <>
                  <h1 className="col-span-2 font-bold text-xl text-[#01195C] w-auto table rounded-lg text-center">
                    {`${totalPayment?.currency}${"25" + ".00"} * ${
                      totalPayment?.AdditionalVerification
                    } coupons:`}
                  </h1>
                  <h1 className="font-bold text-xl text-[#01195C] w-auto table rounded-lg text-start">
                    {totalPayment?.currency +
                      25 * totalPayment?.AdditionalVerification}
                    .00
                  </h1>

                  <h1 className="col-span-2 font-bold text-xl text-[#01195C] w-auto table rounded-lg text-start">
                    Total Amount:
                  </h1>
                  <h1 className="font-bold text-xl text-[#01195C] w-auto table rounded-lg text-start">
                    {`${totalPayment?.currency} ${(
                      25 * totalPayment?.AdditionalVerification +
                      totalPayment?.totalAmount
                    ).toFixed(2)}`}
                  </h1>
                </>
              ) : (
                <>
                  <h1 className="col-span-2 font-bold text-xl text-[#01195C] w-auto table rounded-lg text-start">
                    Total Amount:
                  </h1>
                  <h1 className="font-bold text-xl text-[#01195C] w-auto table rounded-lg text-start">
                    {totalPayment?.currency + totalPayment?.totalAmount}.00
                  </h1>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-full yellowbg_card mb-3 pb-2 p-5  max-w-[450px]">
          <div className="flex-1">
            <div className="mb-3">
              <label className="text-[18px] font-bold ml-2 text-[#040b47] flex">
                Card Number
              </label>
              <CardNumberElement
                id="cardNumber"
                className={`w-full pt-[15px] text-[20px] font-bold text-gray border-2 border-[#8f92a7] bg-[#fffefc] rounded-2xl py-2 px-4 h-[50px] bg-transparent `}
              />
            </div>
            <div className="flex justify-between">
              <div className="w-[66%] mb-3">
                <label className="text-[18px] font-bold ml-2 text-[#040b47] flex">
                  Expiration Date
                </label>
                <CardExpiryElement
                  id="expiry"
                  className={`w-full pt-[15px] text-[20px] font-bold text-gray border-2 border-[#8f92a7] bg-[#fffefc] rounded-2xl py-2 px-4 h-[50px] bg-transparent `}
                />
              </div>
              <div className="w-[33%] mb-3 pl-[3%]">
                <label className="text-[18px] font-bold ml-2 text-[#040b47] flex">
                  CVC
                </label>
                <CardCvcElement
                  id="cvc"
                  className={`w-[100%] pt-[15px] px-4 text-[20px] font-bold text-gray border-2 border-[#8f92a7] bg-[#fffefc] rounded-2xl py-2 h-[50px] bg-transparent `}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="text-[18px] font-bold ml-2 text-[#040b47] flex">
                Card Holder Name
              </label>
              <InputText
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                placeholder={"Card Holder Name"}
                influencer-affiliate
                className={`w-full text-[12px] text-[20px] border-2 border-[#8f92a7] bg-[#fffefc] rounded-2xl py-2 px-4 h-[50px] bg-transparent `}
                // border={error.nameOfBusiness && `#ef4444`}
                name={"CardHolderName"}
              />
            </div>
          </div>
        </div>

        <div className="pb-2 mt-5 px-5 max-w-[450px] mx-auto w-[100%]">
          <Button
            onClick={handleOrder}
            className={
              "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
            }
            text={
              !isLoading ? (
                "Submit"
              ) : (
                <div className="flex items-center	justify-center pt-[6px]">
                  <Loading />
                </div>
              )
            }
            disabled={isLoading}
            size="55px"
          />
        </div>
      </div>
    </div>
  );
};

export default Payment;
