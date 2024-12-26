/* eslint-disable react/no-unescaped-entities */
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";
import InputText from "../../../components/InputText";
import Loading from "../../../components/Loading/Index";
import { useSelector } from "react-redux";
import UserService from "../../../services/userServices";

const TokenCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const strip = useStripe();
  const elements = useElements();

  const UserDetails = useSelector((states) => states?.Auth?.Auth?.data?.user);
  const [isLoading, setIsLoading] = useState(false);
  const [cardHolderName, setCardHolderName] = useState("");

  const addTokens = () => {
    let body = { tokensToAdd: state?.totalTokens };
    UserService.addUserTokens(UserDetails._id, body)
      .then((res) => {
        console.log(res);

        navigate("/grt-congratulation", {
          state: state,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/create-payment-intent-customers`,
        null,
        {
          params: {
            email: UserDetails.email,
            name: cardHolderName,
            phone: UserDetails?.phone || "+923461117523",
            des: `${state.totalTokens} Token Purchase by ${UserDetails?.email}`,
            total: state?.price,
            currency: "USD",
          },
        }
      )
      .then(function (response) {
        console.log("Res: ", response);
        let clientSecret = response.data.clientSecret;
        strip
          .confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardNumberElement),
            },
          })
          .then(async (res) => {
            console.log(res, "stripe");
            if (res?.error) {
              toast(res?.error?.message, {
                hideProgressBar: true,
                autoClose: 1000,
                type: "error",
              });
              setIsLoading(false);
            } else {
              setIsLoading(false);
              addTokens();
            }
          })
          .catch((err) => {
            console.warn("error stripe ", err);
            setIsLoading(false);
          });
      })
      .catch(function (error) {
        console.log("error: ", error);
        setIsLoading(false);
      });
  };

  return (
    <div className="main-container bg-[#E1AB3F] h-full py-3 min-h-[calc(100vh-148px)] inner-content-part">
      <div className="max-w-[390px] mx-auto">
        <div className="pt-4">
          <div
            key={state?._id}
            className="h-[145px] w-full mx-auto flex flex-col justify-center items-center bg-gradient-to-b from-[#0198FE] to-[#FFFFFF] rounded-[20px] py-4 gt-token-card overflow-hidden"
          >
            <div className="w-full mx-auto flex flex-row justify-center items-center">
              <div className="w-[140px] flex flex-col justify-center items-center relative top-0">
                <img
                  src={"/images/GoldenRoseTokenItem1.png"}
                  height={140}
                  alt="Golden Rose Token Coin"
                />
              </div>
              <div className="flex flex-col justify-between items-center">
                <div className="">
                  <img
                    className="max-w-[250px]"
                    src={"/images/GoldenRoseTokensText.png"}
                    alt="Golden Rose Tokens Text"
                  />
                </div>
                <div className="flex flex-col justify-center items-center my-2">
                  <div className="font-bold text-[20px] leading-5 mb-1">
                    <span>{state?.totalTokens} GRT's</span>
                  </div>
                  <div className="font-bold text-[20px] leading-5 mb-1">
                    <span>for</span>
                  </div>
                  <div className="font-bold text-[20px] leading-5 mb-2">
                    <span>${state?.price}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center relative top-5 mr-4">
                <img
                  src={"/images/GoldenRoseTokenCoins.png"}
                  width={200}
                  alt="Golden Rose Token Coin"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-1 flex flex-row justify-center">
          <img
            width={"180px"}
            src={"/images/chainpass_id_logo.png"}
            alt="asdf"
          />
        </div>
        <div className="mt-2">
          <div className="w-full flex justify-between">
            <h6 className="text-[14px] text-[#4D4D4D] font-medium">
              <strong className="font-extrabold">VAI</strong>RIPAY
            </h6>
            {/* <h6 className="text-[14px] text-[#4D4D4D] font-medium">
              Order 0594829
            </h6> */}
          </div>
          <div className="w-full flex mt-2 mb-2">
            <p className="bg-transparent border-none focus:outline-none focus-within:outline-none text-[32px] font-bold leading-8 pr-12 text-left pl-0 pt-0">
              {state?.price} $
            </p>
          </div>
          <div className="mt-1 px-2">
            <p className="text-[18px] font-semibold text-[#040b47] flex mt-3">
              Card Number
            </p>
            <CardNumberElement
              id="cardNumber"
              className={`w-full pt-[15px] text-[20px] font-bold text-gray border-2 border-[#c78f20] rounded-md py-2 px-4 h-[50px] bg-white`}
            />
            <div className="flex justify-between">
              <div class="w-[66%] mb-3">
                <p className="text-[18px] font-semibold text-[#040b47] flex mt-3">
                  Expiration Date
                </p>
                <CardExpiryElement
                  id="expiry"
                  className={`w-full pt-[15px] text-[20px] font-bold text-gray border-2 border-[#c78f20] rounded-md py-2 px-4 h-[50px] bg-white`}
                />
              </div>
              <div class="w-[33%] mb-3 pl-[3%]">
                <p className="text-[18px] font-semibold text-[#040b47] flex mt-3">
                  CVC
                </p>
                <CardCvcElement
                  id="cvc"
                  className={`w-full pt-[15px] px-4 text-[20px] font-bold text-gray border-2 border-[#c78f20] rounded-md py-2 h-[50px] bg-white`}
                />
              </div>
            </div>
            <p className="text-[18px] font-semibold text-[#040b47] flex">
              Card Holder Name
            </p>
            <InputText
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              placeholder={"Card Holder Name"}
              influencer-affiliate
              className={`w-full text-[12px] text-[14px] border-2 border-[#c78f20] rounded-md py-2 px-4 h-[50px] bg-white`}
              // border={error.nameOfBusiness && `#ef4444`}
              name={"CardHolderName"}
            />
          </div>
          <div className="mt-8">
            <Button
              disabled={isLoading}
              text={
                !isLoading ? (
                  "Checkout"
                ) : (
                  <div className="flex items-center	justify-center pt-[6px]">
                    <Loading />
                  </div>
                )
              }
              onClick={handleSubmit}
              className={
                "!w-auto bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[21.38px] px-10 rounded-lg"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCheckout;
