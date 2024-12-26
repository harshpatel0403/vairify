import { useSelector } from "react-redux";
import UserService from "../../../services/userServices";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TokenCongratulation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [token, setTokens] = useState(0);
  const UserDetails = useSelector((states) => states?.Auth?.Auth?.data?.user);

  const getTokens = () => {
    UserService.getUserTokens(UserDetails._id)
      .then((res) => {
        const data = res.tokens;
        setTokens(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTokens();
  }, []);

  const handelNavigation = (e) => {
    e.preventDefault();
    navigate("/goldentoken");
  };

  return (
    <div className="main-container bg-[#01195C] rounded-xl h-full min-h-[calc(100vh-149px)]">
      <div className="pt-6 form-field-container">
        <div className="mt-3">
          <img className="mx-auto" src={`/images/gold 1.png`} alt="" />
        </div>
        <div className="mt-10 mb-10 px-4">
          <h3 className="text-white text-[30px]">
            Congratulations {state?.totalTokens} GRT Tokens have been added to
            your Wallet
          </h3>
        </div>
        <div className="flex justify-between items-center gap-2 mt-5">
          <img src={`/images/gold waller 1.png`} alt="" className="w-[150px]"/>

          <h3 className="text-white text-[30px] flex-1 leading-10">
            {" "}
            GRT Balance <br />
            {token}
          </h3>
        </div>
        <div className="mt-12">
          <button
            onClick={(e) => {
              handelNavigation(e);
            }}
            className="bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] w-[240px] flex justify-center items-center h-[50px] rounded-lg mx-auto"
          >
            <img src={`/images/Group 1000005612.png`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenCongratulation;
