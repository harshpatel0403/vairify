import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useSelector } from "react-redux";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const HandleOnClick = () => {
    console.log(UserData);
    navigate('/vai');
    
  };
  return ( 
    <div className="main-container">
      <div className="flex flex-col justify-center items-center mx-auto">
        <div className="grid grid-cols-1 grid-flow-col gap-4">
          <div className="relative flex flex-col justify-start items-center">
            {/* <div className="relative top-6">
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
            <div className="relative top-2">
              <img
                src={import.meta.env.BASE_URL + "images/V.A.I.(medium).png"}
                alt="VAI Small"
              />
            </div> */}

            <div className="relative mt-5">
              <img width={'250px'} 
                src={'/images/chainpass_id_logo.png'}
                alt="asdf"
              /> 
            </div> 

            <div className="relative top-8 mb-5">
              <span className="font-semibold text-[24px] text-[#000000]">
                Your payment was successful.
              </span>
            </div>
          </div>
        </div>
        <div className="relative top-9 w-[90%] max-w-[500px]">
          <img
            src={import.meta.env.BASE_URL + "images/PaymentSuccess.png"}
            alt="Payment Success"
            className="w-[80%] mx-auto"
          />
        </div>
        <div className="w-max-370 flex-1 w-full mt-10 mb-2">
          <Button
            className={
              "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
            }
            text={"Go to V.A.I."}
            size="55px"
            onClick={HandleOnClick}
          />
        </div>
      </div>
    </div> 
  );
};

export default PaymentSuccess;
