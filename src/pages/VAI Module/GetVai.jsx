import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import BackButton from "../../components/BackButton/backArrowButton";
import { useTranslation } from "react-i18next";

const GetVai = () => {

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const navigate = useNavigate();
  const { t } = useTranslation();
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
    <div className="signup-backgound-design">
      <div className="signup-container container">
        <div className="signup-content relative flex flex-col sm:h-auto h-full sm:justify-center justify-between">
          <div className="backnavigation"><BackButton /></div>
          <div className="logo-img-container">
            <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
            <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
          </div>
          <div>

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


            <div className=" flex justify-center items-center gap-8 mt-[64px] md:flex-row flex-col">
              <div>
                <img
                  src={'/images/get-vai/chainpass-id-logo.png'}
                  alt="chainpass id logo"
                  className="sm:max-w-[325px] max-w-[200px]"
                />
              </div>
              <div className="flex items-end gap-2">
                <img src="/images/get-vai/vai-logo.svg" alt="vai logo" className="sm:max-w-[300px] max-w-[200px]" />
                <p className="text-[20px] font-semibold max-w-none text-white">
                  {UserData?.user_type === "agency-business" ? "For Business" : ""}
                </p>
              </div>
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
          <div className="mt-[64px] flex justify-center md:mb-0 mb-[48px]">
            <Button
              className='max-w-[500px]'
              text={t("getVai.vaiButton")}
              size="45px"
              onClick={HandleOnClick}
            />
          </div>
        </div>
      </div>
    </div>

  );
};

export default GetVai;
