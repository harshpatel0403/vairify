/* eslint-disable react/no-unescaped-entities */

import { useState } from "react";
import Button from "../../components/Button";
import SelectBox from "../../components/SelectBox";
import { useNavigate } from "react-router-dom";

const BussinessVai = () => {
  const navigate = useNavigate();
  const [businessOptions] = useState([
    "Additional verification’s",
    "1",
    "2",
    "3",
    "4",
  ]);
  const [selectAdditional, setSelectAdditional] = useState(0);

  const HandleOnClick = () => {
    const amount = parseInt(selectAdditional) * 25;
    const totalAmount = parseInt(amount) + 199.0;
    navigate("/subscription", {
      state: {
        AdditionalVerification: selectAdditional,
        amount,
        totalAmount: totalAmount,
      },
    });
  };
  return (
    <div className="main-container flex flex-col justify-between form-field-container w-full max-w-[500px]">
      <div className="flex-1">
        <div className="mb-4">
          <div className="flex flex-row justify-center mx-auto items-center w-max-370">
            {/* <div className="w-max-175">
                    <img src={import.meta.env.BASE_URL + "/images/ChainPassId.png"} alt="Chain Pass ID" />
                </div> */}
            <div className="relative flex flex-col justify-start items-center">
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
        </div>

        <div className="">
          <div className="px-4 py-4 flex flex-col font-bold text-[14px] justify-center items-center bg-[#20a4d5] text-[#fff]">
            <p>V.A.I. For Business 3 </p>
            <p>Verification's Included Select additional</p>
            <p>V.A.I.’s $25.00 Each</p>
          </div>
        </div>
        <div className="mb-5 mt-10">
          <SelectBox className1={"!border-0"}
            value={selectAdditional}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              setSelectAdditional(newValue);
            }}
            options={businessOptions}
            className="text-[18px] font-bold"
            size={"h-[47px]"}
            textAlign={"text-left"}
            rounded={"rounded-2xl"}
            fontWeight={"font-bold"}
            textColor={"text-[#727885]"}
            textSize={"text-[18px]"}
            // border={error.typeofBusiness && `#ef4444`}
          />
        </div>
      </div>
      <Button
        className={
          "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] mt-7"
        }
        text={"Next >"}
        size="45px"
        onClick={HandleOnClick}
      />
    </div>
  );
};

export default BussinessVai;
