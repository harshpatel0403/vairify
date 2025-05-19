/* eslint-disable no-unreachable */
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import Loading from "../../../components/Loading/Index";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HandleGenerateCoupon } from "../../../redux/action/VAI";
import { toast } from "react-toastify";
import { instance as axios } from "../../../services/httpService";
import PaySubscriptionServices from "../../../services/PaySubscriptionServices";
import { HandleUpdateUser } from "../../../redux/action/Auth";

const VAIMembershipPayment = () => {
  const { state } = useLocation();
  console.log("🚀 ~ file: Payment.jsx:17 ~ Payment ~ Vai membership:", state);
  const strip = useStripe();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const elements = useElements();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [isLoading, setIsLoading] = useState(false);
  const [cardHolderName, setCardHolderName] = useState("");

  const handleVAIMembership = async () => {
    try {
      setIsLoading(true);
      const response = await PaySubscriptionServices.renewVAIMembership({
        userId: UserDetails?._id,
        planId: state?._id,
        days: state?.days,
        amount: `${state?.finalAmount}.00`,
        type: state?.type,
      });
      console.log("response", response);
      if (UserDetails?.user_type === "agency-business") {
        return await GenerateCoupon();
      }

      setIsLoading(false);
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
    const cardNumber = elements.getElement('cardNumber');
    const cardExpiry = elements.getElement('cardExpiry');
    const cardCvc = elements.getElement('cardCvc');


    if (cardNumber._empty || cardExpiry._empty || cardCvc._empty) {
      return toast.error("Please fill all card details.");
    }

    if (!cardHolderName) {
      return toast.error("Please fill card holder name.");
    }

    if (UserDetails?.user_type === "agency-business") {
      await GenerateCoupon();
    }
    setIsLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_APP_API_BASE_URL
        }/stripe/create-subscription/${UserDetails?._id}`,
        {
          isRenew: true,
          planId: state?._id
        }
      )
      .then(function (response) {
        console.log("Res: ", response);
        let clientSecrets = response.data.clientSecrets;
        for (let clientSecret of clientSecrets) {
          strip
            .confirmCardPayment(clientSecret, {
              payment_method: {
                card: elements.getElement(CardNumberElement),
              },
            })
            .then(async (res) => {
              console.log(res, "stripe");
              await PaySubscriptionServices.subscribeMembership({
                userId: UserDetails?._id,
                planId: state?._id,
                days: state?.days,
                amount: res?.paymentIntent?.amount,
                currency: res?.paymentIntent?.currency,
                type: state?.type,
                transactionId: res?.paymentIntent?.id,
                subscriptionId: response?.data?.subscriptionId,
                isRenew: true
              })
              // Generat coupon code
              if (UserDetails?.user_type === "agency-business") {
                return await GenerateCoupon();
              }

              navigate("/membership-payment-success");

              await dispatch(HandleUpdateUser(UserDetails?._id));
            })
            .catch((err) => {
              console.warn(err);
              setIsLoading(false);
            }).finally(() => {
              setIsLoading(false)
            });
        }
      })
      .catch(function (error) {
        console.log("error: ", error);
        setIsLoading(false);
      });
  };

  //   const handleOrder = async (e) => {
  //     e.preventDefault();
  //     if (UserDetails?.user_type === "agency-business") {
  //       await GenerateCoupon();
  //     }
  //     setIsLoading(true);
  //     axios
  //       .post(
  //         `${
  //           import.meta.env.VITE_APP_API_BASE_URL
  //         }/create-payment-intent-customers`,
  //         null,
  //         {
  //           params: {
  //             total: totalPayment?.totalAmount,
  //             currency: "PKR",
  //             name: cardHolderName,
  //             phone: "030030303033030",
  //           },
  //         }
  //       )
  //       .then(function (response) {
  //         console.log("Res: ", response);
  //         let clientSecret = response.data.clientSecret;
  //         strip
  //           .confirmCardPayment(clientSecret, {
  //             payment_method: {
  //               card: elements.getElement(CardNumberElement),
  //             },
  //           })
  //           .then(async (res) => {
  //             console.log(res, "stripe");
  //             // Generat coupon code
  //             if (UserDetails?.user_type === "agency-business") {
  //               await GenerateCoupon();
  //             }
  //             setIsLoading(false);
  //             navigate("/bussiness-vai-codes");
  //           })
  //           .catch((err) => {
  //             console.warn(err);
  //             setIsLoading(false);
  //           });
  //       })
  //       .catch(function (error) {
  //         console.log("error: ", error);
  //         setIsLoading(false);
  //       });
  //     // handlePaySubscription();
  //   };

  //   // Generate Coupon code
  //   const GenerateCoupon = async () => {
  //     setIsLoading(true);
  //     const body = {
  //       userId: UserDetails?._id,
  //       numberOfCoupons: parseFloat(totalPayment?.AdditionalVerification) + 3,
  //     };
  //     await dispatch(HandleGenerateCoupon(body))
  //       .then((result) => {
  //         if (result?.payload?.status === 200) {
  //           toast(result.payload.data.message, {
  //             hideProgressBar: true,
  //             autoClose: 1000,
  //             type: "success",
  //           });
  //           navigate("/payment-success");
  //           setIsLoading(false);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };
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
    <div className="container">
      <div className="w-full flex flex-col items-center mt-[30px] py-2 px-[10px]">
        <span className="text-[26px] text-white">
          VAIRIFY
        </span>
      </div>
      <div className="sm:mt-[64px] mt-[32px] bg-[#FFFFFF14] sm:rounded-[16px] rounded-[8px] p-[16px]">
        <div className="flex justify-between sm:flex-nowrap flex-wrap items-center sm:gap-[30px] gap-3 mb-[24px]">
          <img src={"/images/face-verification/chainpass.svg"} alt="asdf" />
          <div className="flex gap-2"><p className="sm:text-[18px] text-[14px] font-normal text-white opacity-70">{formattedDate}</p><p className="sm:text-[18px] text-[14px] font-normal text-white opacity-70">#1832-9912-7552</p></div>
        </div>
        <div className="flex justify-between items-center gap-[30px] mb-[16px]">
          <h4 className="sm:text-[18px] text-[14px] font-normal text-white">VAI Subscription :{" "}</h4>
          <h5 className="sm:text-[18px] text-[14px] font-normal text-white">{state?.finalAmount}.00</h5>
        </div>

      </div>
      <div className="flex items-center justify-center sm:flex-nowrap flex-wrap gap-[20px] w-full mt-[24px]">
        <div className="w-full flex flex-col gap-1">
          <label className="text-[14px] font-normal text-white pl-1">
            Card Number
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
            Card Holder Name
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
            Expiration Date
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
              "Make Payment"
            ) : (
              <div className="flex items-center	justify-center">
                <Loading />
              </div>
            )
          }
          disabled={isLoading}
        />
      </div>
      <p className="text-center text-[14px] font-normal opacity-70 text-white mt-[12px] flex items-center justify-center gap-1"><img src="/images/face-verification/lock.svg" alt="icon" /> Make payment securely </p>
    </div>
  );
};

export default VAIMembershipPayment;
