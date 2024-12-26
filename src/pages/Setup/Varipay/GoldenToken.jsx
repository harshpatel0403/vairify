/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import UserService from "../../../services/userServices";
import { useSelector } from "react-redux";
import SetupService from "../../../services/SetupService";
import { useNavigate } from "react-router-dom";

const GoldenToken = () => {
  const navigate = useNavigate();
  const [token, setTokens] = useState(0);
  const [packages, setPackages] = useState([]);

  const userId = useSelector((state) => state?.Auth?.Auth?.data?.user?._id);

  const getTokens = () => {
    UserService.getUserTokens(userId)
      .then((res) => {
        const data = res.tokens;
        setTokens(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPackages = () => {
    SetupService.getGrtPackages()
      .then((res) => {
        console.log(res);
        setPackages(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handelNavigate = (e, item) => {
    e.preventDefault();
    navigate("/grt-checkout", {
      state: item,
    });
  };

  useEffect(() => {
    getTokens();
    getPackages();
  }, []);

  return (
    <div className="main-container px-0" style={{ paddingBottom: "0px" }}>
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="bg-[#3760CB] px-4 w-full">
          <div className=" w-full mx-auto flex flex-row justify-center items-center">
            {/* Total tokens: {token} */}
            <div>
              <img
                src={"/images/GoldenRoseTokenLogo.png"}
                alt="Golden Rose Token Logo"
              />
            </div>
            <div className="relative">
              <img
                src={"/images/GoldenRoseTokensSafe2.png"}
                alt="Golden Rose Token Safe Logo"
              />
              <img
                className="absolute top-24 max-[425px]:top-30 left-18 max-[425px]:left-8 max-[440px]:w-[60px] w-[75px] max-[440px]:h-[40px] h-[45px]"
                src="/images/goldcoins.png"
              />
              <p className="absolute text-[#FFC020] top-16 max-[440px]:top-13 left-8 max-[440px]:left-8 text-[20px] font-bold p-0">
                <span className="mr-1 font-[700] text-lg sm:text-xl md:text-2xl">{token}</span>
                <span className="text-[10px] sm:text-sm md:text">GRT's</span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full h-[21px] bg-[#01195C] pb-3"></div>
        <div className=" bg-[#E1AB3F] px-4 w-full">
          <div className="pb-8 inner-content-part-country">
            {packages.map((item) => (
              <div
                key={item._id}
                className="w-full mx-auto flex flex-col justify-center items-center bg-gradient-to-b from-[#0198FE] to-[#FFFFFF] rounded-[20px] py-4 mt-3"
              >
                <div className="w-full mx-auto flex flex-row justify-center items-center">
                  <div className="flex flex-col justify-center items-center relative top-0 w-[130px]">
                    <img
                      src={"/images/GoldenRoseTokenItem1.png"}
                      height={140}
                      alt="Golden Rose Token Coin"
                    />
                  </div>
                  <div className="flex flex-col justify-between items-center">
                    <div className="">
                      <img
                        src={"/images/GoldenRoseTokensText.png"}
                        alt="Golden Rose Tokens Text"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center my-2">
                      <div className="font-bold text-[18px] leading-5">
                        <span>{item.totalTokens} GRT's</span>
                      </div>
                      <div className="font-bold text-[18px] leading-5">
                        <span>for</span>
                      </div>
                      <div className="font-bold text-[18px] leading-5">
                        <span>${item.price}</span>
                      </div>
                    </div>
                    <div className="w-[83px]">
                      <button
                        onClick={(e) => {
                          handelNavigate(e, item);
                        }}
                        className={
                          "w-full flex items-center justify-center bg-[#0247FF] rounded-[25px] font-bold text-[21.6px] text-white"
                        }
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center relative top-8 ml-4">
                    <img
                      src={"/images/GoldenRoseTokenCoins.png"}
                      width={200}
                      alt="Golden Rose Token Coin"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldenToken;
