import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";

const GetVai = () => {

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const HandleOnClick = () => {
    localStorage.setItem('Flag', "VAI")
    navigate("/terms");
  };

  // const HandleOnClickWIthoutVai = () => {
  //   localStorage.setItem('Flag', "WithoutVAI")
  //   navigate("/terms")
  // }
  
  return (
    <div className="bluebg_full flex items-center">
      <div className="yellowbg_card w-full mx-4">
        <div className="main-container flex flex-col justify-center">
          {/* <div className="relative flex flex-col justify-start items-center">
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
        </div> */}

          {/* <div className="flex-1 mb-12 py-8 mx-auto">
          <img
            className="mx-auto"
            src={import.meta.env.BASE_URL + "images/V.A.I..png"}
          />
          <p className="text-xl mt-3 mb-9 font-semibold">
            Verified Anonymous Identity {UserData?.user_type === "agency-business" ? "For Business" : "" } 
          </p>
        </div> */}
          {/* THIS IS FOR THE BUSSINESS */}
          {/* <p className="text-xl mt-9">Verified Anonymous Identity</p>
          <p className="text-xl">For Business</p> */}


          <div className="relative flex flex-col justify-start items-center">
            <div className="relative">
              <img width={'250px'}
                src={'/images/chainpass_id_logo.png'}
                alt="asdf"
              />
            </div>
            <p className="text-[20px] mt-5 mb-5 font-semibold max-w-none">
              Verified Anonymous Identity {UserData?.user_type === "agency-business" ? "For Business" : ""}
            </p>
          </div>


          <div className="pb-2 w-[100%] max-w-[290px] mx-auto">
            <Button
              className={
                "flex items-center justify-center bg-gradient-to-b from-[#202973] to-[#040b47] text-[#fff] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
              }
              text={"Get V.A.I"}
              size="55px"
              onClick={HandleOnClick}
            />
          </div>
          {/* <div className="pb-1 w-[100%] max-w-[290px] mx-auto">
            <Button
              className={
                "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
              }
              text={"Without V.A.I"}
              size="55px"
              onClick={HandleOnClickWIthoutVai}
            />
          </div> */}
        </div>
      </div>
    </div>

  );
};

export default GetVai;
