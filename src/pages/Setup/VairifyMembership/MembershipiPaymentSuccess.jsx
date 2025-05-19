import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { useSelector } from "react-redux";

const MembershipPaymentSuccess = () => {
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const HandleOnClick = () => {
    navigate("/featured");
  };
  return (
    <div>
      <div className="md:hidden block fixed top-0 sm:h-[80px] h-[70px] w-full bg-[#060C4D] z-50"></div>
      <div className="container">
        <div className="w-full flex flex-col items-center mt-[30px] py-2 px-[10px]">
          <span className="text-[26px] text-white">
            VAIRIFY
          </span>
        </div>


        <div className="sm:mt-[64px] mt-[32px]">
          <div className="flex items-center justify-center flex-col gap-[32px]">
            <img src={"/images/face-verification/chainpass.svg"} alt="asdf" />
            <img src={"/images/face-verification/success.svg"} alt="asdf" />
          </div>

          <h3 className="text-white sm:text-[28px] text-[20px] font-medium text-center">Payment success!!</h3>
          <p className="text-white text-[14px] font-normal text-center opacity-70">Your payment has been successfully processed.</p>

          <div className="flex items-center justify-center w-full max-w-[500px] mx-auto mt-[40px] mb-[48px]">
            <Button
              text={"Go to Home"}
              size="55px"
              onClick={HandleOnClick}
            />
          </div>
        </div >
      </div >
    </div>
  );
};

export default MembershipPaymentSuccess;
