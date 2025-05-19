/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import UserService from "../../../services/userServices";
import { useSelector } from "react-redux";
import SetupService from "../../../services/SetupService";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import PageTitle from "../../../components/PageTitle";

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
    <div>
      <div className="container">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"Setup Payment"} />
        </div>
      </div>
      <div className="container sm:p-[30px] p-0">
        <div className="sm:rounded-[18px] bg-[linear-gradient(279.9deg,_#342C00_15.45%,_#624900_84.15%)] flex justify-between sm:mb-[48px] mb-[24px]">
          <div className="p-[16px]">
            <div className="sm:flex hidden">
              <img src="/images/setup/rose.svg" alt="rose" />
              <h3 className="text-[18px] font-normal text-white">Golden Rose <br />
                Token</h3>
            </div>
            <h4 className="text-[14px] font-normal text-white">Available Point</h4>
            <h4 className="text-[32px] font-bold text-white">{token}</h4>
          </div>
          <img src="/images/setup/rose-file.svg" alt="file" className="mr-[20px] mt-[20px]" />
        </div>
      </div>
      <div className="container">
        <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-[24px] gap-[16px] mb-[48px]">
          {packages.map((item, index) => {
            const bgClasses = [
              "bg-[linear-gradient(279.9deg,_#003234_15.45%,_#004B62_84.15%)]",
              "bg-[linear-gradient(279.9deg,_#093400_15.45%,_#006221_84.15%)]",
              "bg-[linear-gradient(279.9deg,_#2A0034_15.45%,_#600062_84.15%)]",
              "bg-[linear-gradient(279.9deg,_#34000C_15.45%,_#620031_84.15%)]",
            ];

            const background = index < 4 ? bgClasses[index] : bgClasses[0];

            return (
              <div
                key={item._id}
                className={`${background} rounded-[18px] p-[16px] flex justify-between`}
              >
                <div>
                  <h4 className="text-[18px] font-normal text-white opacity-50">Golden Rose</h4>
                  <h5 className="text-[20px] font-medium text-white">
                    {item.totalTokens} GTR’s for ${item.price}
                  </h5>
                  <button
                    onClick={(e) => handelNavigate(e, item)}
                    className="bg-white px-[24px] py-1 rounded-[100px] border text-[#060C4D] border-white text-[14px] font-medium mt-[16px] shadow-2xl hover:scale-[0.95] transition-all duration-300"
                  >
                    Buy
                  </button>
                </div>
                <img src="/images/setup/gold-coins.svg" alt="gold" className="mt-auto" />
              </div>
            );
          })}
        </div>
      </div>
    </div>




    // <div className="main-container px-0" style={{ paddingBottom: "0px" }}>
    // <div className="w-full mx-auto flex flex-col justify-center items-center">
    //   <div className="bg-[#3760CB] px-4 w-full">
    //     <div className=" w-full mx-auto flex flex-row justify-center items-center">
    //       {/* Total tokens: {token} */}
    //       <div>
    //         <img
    //           src={"/images/GoldenRoseTokenLogo.png"}
    //           alt="Golden Rose Token Logo"
    //         />
    //       </div>
    //       <div className="relative">
    //         <img
    //           src={"/images/GoldenRoseTokensSafe2.png"}
    //           alt="Golden Rose Token Safe Logo"
    //         />
    //         <img
    //           className="absolute top-24 max-[425px]:top-30 left-18 max-[425px]:left-8 max-[440px]:w-[60px] w-[75px] max-[440px]:h-[40px] h-[45px]"
    //           src="/images/goldcoins.png"
    //         />
    //         <p className="absolute text-[#FFC020] top-16 max-[440px]:top-13 left-8 max-[440px]:left-8 text-[20px] font-bold p-0">
    //           <span className="mr-1 font-[700] text-lg sm:text-xl md:text-2xl">{token}</span>
    //           <span className="text-[10px] sm:text-sm md:text">GRT's</span>
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="w-full h-[21px] bg-[#01195C] pb-3"></div>
    //   <div className=" bg-[#E1AB3F] px-4 w-full">
    //     <div className="pb-8 inner-content-part-country">
    //       {packages.map((item) => (
    //         <div
    //           key={item._id}
    //           className="w-full mx-auto flex flex-col justify-center items-center bg-gradient-to-b from-[#0198FE] to-[#FFFFFF] rounded-[20px] py-4 mt-3"
    //         >
    //           <div className="w-full mx-auto flex flex-row justify-center items-center">
    //             <div className="flex flex-col justify-center items-center relative top-0 w-[130px]">
    //               <img
    //                 src={"/images/GoldenRoseTokenItem1.png"}
    //                 height={140}
    //                 alt="Golden Rose Token Coin"
    //               />
    //             </div>
    //             <div className="flex flex-col justify-between items-center">
    //               <div className="">
    //                 <img
    //                   src={"/images/GoldenRoseTokensText.png"}
    //                   alt="Golden Rose Tokens Text"
    //                 />
    //               </div>
    //               <div className="flex flex-col justify-center items-center my-2">
    //                 <div className="font-bold text-[18px] leading-5">
    //                   <span>{item.totalTokens} GRT's</span>
    //                 </div>
    //                 <div className="font-bold text-[18px] leading-5">
    //                   <span>for</span>
    //                 </div>
    //                 <div className="font-bold text-[18px] leading-5">
    //                   <span>${item.price}</span>
    //                 </div>
    //               </div>
    //               <div className="w-[83px]">
    //                 <button
    //                   onClick={(e) => {
    //                     handelNavigate(e, item);
    //                   }}
    //                   className={
    //                     "w-full flex items-center justify-center bg-[#0247FF] rounded-[25px] font-bold text-[21.6px] text-white"
    //                   }
    //                 >
    //                   Buy
    //                 </button>
    //               </div>
    //             </div>
    //             <div className="flex flex-col justify-center items-center relative top-8 ml-4">
    //               <img
    //                 src={"/images/GoldenRoseTokenCoins.png"}
    //                 width={200}
    //                 alt="Golden Rose Token Coin"
    //               />
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
    // </div>
  );
};

export default GoldenToken;
