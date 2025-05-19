import Button from "../../../components/Button";
import { Link } from "react-router-dom";
import Header from "../../../components/Header/Header";
import PageTitle from "../../../components/PageTitle";

export default function Varipay() {
  return (
    <div className="container">
      <div className="sm:pb-[48px] pb-[24px]">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"Setup Payment"} />
        </div>
        <div className="mt-[28px] grid sm:grid-cols-2 grid-cols-1 gap-[24px]">
          <div> <Link to="/vairipay-search"><img src="/images/setup/pay.svg" alt="img" /></Link></div>
          <div> <Link to="/goldentoken"><img src="/images/setup/golden-rose.svg" alt="img" /></Link></div>
        </div>
      </div>

      {/* <div className="main-container pb-2 form-field-container flex flex-col justify-around" style={{height: "100%"}}>
<div className="flex flex-col items-center">
  <div className="flex justify-center mt-7 my-pay-img-box items-center">
    <p className="text-[45px] text-[#040B47] font-bold px-2 py-0">My</p>
    <img
      src={"/images/VairipaySearchLogo.png"}
      alt="Vairipay Search Logo"
      className="h-[40px] w-auto"
    />
  </div>
  <div className="mypay-text-part mt-5 mb-3">
    <p className="text-[28px] font-bold text-center leading-[40px] py-0">
      Set up
    </p>
  </div>
  <div className="payment-block">
 
  <div className="flex justify-center items-center">
    <Link to="/vairipay-search">
      <img
        src="/images/Vairipay1.png"
        alt="Hot Rod"
        // className="h-[180px] w-[200px]"
      />
    </Link>
  </div>
  <p className="text-[22px] font-bold text-center pb-[3px]">
    Payment Apps
  </p>
  </div>
  <div className="golden-block mt-4">
 
  <div className="flex justify-center items-center">
    <Link to="/goldentoken">
      <img
        src="/images/Vairipay2.png"
        alt="Hot Rod"
        // className="h-[180px] w-[200px]"
      />
    </Link>
  </div>
  <p className="text-[22px] font-bold text-center pb-[3px]">
    Golden Rose Tokens
  </p>
  </div>
  
 
  
  <Link to="/user/profile" className="mt-3">
    <Button
      className={
        "flex items-center px-[20px] py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] mt-5 shadow-[1px_3px_10px_rgba(0,0,0,0.7)]"
      }
      text={"Next >"}
      size="45px"
    />
  </Link>
</div>
</div> */}
    </div>
  );
}


