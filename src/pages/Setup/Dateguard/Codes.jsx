import { useState } from "react";
import Button from "../../../components/Button";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../components/Header/Header";
import Loading from "../../../components/Loading/Index";
import PageTitle from "../../../components/PageTitle";

const Codes = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [disarm, setDisarm] = useState("");
  const [decoy, setDecoy] = useState("");
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!decoy || !disarm) {
        throw new Error("Both codes are required");
      }
      if (decoy === disarm) {
        throw new Error("Codes cannot be the same");
      }
      // await DateGuardService.setupCodes('64f598f712862abd5beb1e4b', {
      //     decoy,
      //     disarm
      // })
      localStorage.setItem("decoy", decoy);
      localStorage.setItem("disarm", disarm);
      navigation("/dateguard/face-match");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Date Guard"} />
      </div>
      <form onSubmit={handleCodeSubmit}>
        <div className="flex items-center justify-center gap-[24px] flex-col mb-[48px]">
          <img src="/images/setup/Disarm.svg" alt="Disarm" />
          <h3 className="sm:text-[28px] text-[24px] font-semibold text-center text-white">Set Disarm Code</h3>

          <div>
            <OtpInput
              value={disarm}
              onChange={setDisarm}
              numInputs={3}
              renderSeparator={<span> </span>}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{ width: '80px', height: '80px' }}
                  className={`m-2 border rounded-[8px] border-[#919EAB] h-[80px] w-[80px] text-center  bg-transparent text-[35px] input-code-box text-white`}
                />
              )}
            />
            {/* <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="first" maxLength='1' />
                <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="second" maxLength='1' />
                <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="third" maxLength='1' /> */}
          </div>

          <h3 className="sm:text-[28px] text-[24px] font-semibold text-center text-white">Set Decoy Code</h3>

          <div>
            <OtpInput
              value={decoy}
              onChange={setDecoy}
              numInputs={3}
              renderSeparator={<span> </span>}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{ width: '80px', height: '80px' }}
                  className={`m-2 border rounded-[8px] border-[#919EAB] h-[80px] w-[80px] text-center  bg-transparent text-[35px] input-code-box text-white`}
                />
              )}
            />
            {/* <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="first" maxLength='1' />
      <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="second" maxLength='1' />
      <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="third" maxLength='1' /> */}
          </div>
          <Button
            type="submit"
            disabled={loading}
            text={loading ? <div className="flex items-center	justify-center">
              <Loading />
            </div> : "Set"}
            className={'max-w-[500px]'}
          />
        </div>
      </form>
    </div >

  );
};

export default Codes;
{/* <div className="main-container">
  <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
    <form onSubmit={handleCodeSubmit}>
      <div className="w-full mx-auto flex items-center justify-center">
        <span className="font-bold text-[30px] text-[#05B7FD] change-font-family">
          Date Guard
        </span>
      </div>
      <div className="w-full mx-auto flex items-center justify-center mt-4">
        <div className="w-[67px] h-[82px]">
          <img src={"/images/DateGuardMask.png"} alt="Date Guard Mask" />
        </div>
      </div>
      <div className="w-full mx-auto flex items-center justify-center mt-2">
        <span className="font-bold text-[30px] text-white change-font-family">
          Edit Codes
        </span>
      </div>
      <div className="w-full mx-auto flex items-center justify-center mt-6">
        <span className="font-medium text-[36px] text-white change-font-family">
          Set Disarm Code
        </span>
      </div>
      <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
        <OtpInput
          value={disarm}
          onChange={setDisarm}
          numInputs={3}
          renderSeparator={<span> </span>}
          renderInput={(props) => (
            <input
              {...props}
              style={{ width: '60px' }}
              className={`flex-1 m-2 border-2 border-[#4200FF] h-[78px] w-[60px] text-center bg-[#D9D9D9] text-[35px] input-code-box`}
            />
          )}
        />
        <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="first" maxLength='1' />
                <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="second" maxLength='1' />
                <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="third" maxLength='1' />
      </div>
      <div className="w-full mx-auto flex items-center justify-center mt-6">
        <span className="font-medium text-[36px] text-white change-font-family">
          Set Decoy Code
        </span>
      </div>
      <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
        <OtpInput
          value={decoy}
          onChange={setDecoy}
          numInputs={3}
          renderSeparator={<span> </span>}
          renderInput={(props) => (
            <input
              {...props}
              style={{ width: '60px' }}
              className={`flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box`}
            />
          )}
        />
        <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="fourth" maxLength='1' />
                <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="fifth" maxLength='1' />
                <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="sixth" maxLength='1' />
      </div>
      <div className="w-full mx-auto flex flex-col justify-center items-center mt-6">
        <div className="w-[132px]">
          <Button
            type="submit"
            disabled={loading}
            text={loading ? "Loading.." : "Set"}
            className="bg-[#05B7FD] rounded-[10px] font-bold text-[30px] h-[41px] flex items-center justify-center change-font-family px-10"
            size="41px"
          />
        </div>
      </div>
    </form>
  </div>
</div> */}