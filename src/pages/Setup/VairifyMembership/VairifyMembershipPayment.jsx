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

const VairifyMembershipPayment = () => {
  const { state } = useLocation();
  console.log("🚀 ~ file: Payment.jsx:17 ~ Payment ~ totalPayment:", state);
  const strip = useStripe();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const elements = useElements();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [cardHolderName, setCardHolderName] = useState("");

  const handleVairifyMembership = async () => {
    try {
      setIsLoading(true);
      const response = await PaySubscriptionServices.renewVairifyMembership({
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
      navigate("/membership-payment-success");
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
                type: state?.type,
                days: state?.days,
                amount: res?.paymentIntent?.amount,
                currency: res?.paymentIntent?.currency,
                type: state?.type,
                transactionId: res?.paymentIntent?.id,
                subscriptionId: response?.data?.subscriptionId,
                isRenew: true
              })

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

        <div className="relative flex flex-col justify-start items-center mt-9">
          <div className="relative">
            <img
              width={"250px"}
              src={"/images/chainpass_id_logo.png"}
              alt="asdf"
            />
          </div>

          <div className="pt-4 text-lg font-medium text-[#838282]">
            <p className="text-[14px]">{formattedDate}</p>
            <p className="text-[16px]">#1832-9912-7552</p>
          </div>
        </div>

        <div className="w-full yellowbg_card mb-3 pb-2 p-5 mt-12 max-w-[450px]">
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
            size="55px"
          />
        </div>
      </div>
    </div>
  );
};

export default VairifyMembershipPayment;
