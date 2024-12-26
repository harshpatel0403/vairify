import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import DateGuardService from "../../../services/DateGuardService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DateGuardPasswordInput() {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const decoy = localStorage.getItem("decoy");
  const disarm = localStorage.getItem("disarm");

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  useEffect(() => {
    if(!UserDetails) {
      navigation('/login')
      return
    }
    if(!decoy || !disarm) {
      navigation('/dateguard/codes')
      return 
    }
  }, [])

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!decoy || !disarm || !password) {
        throw new Error("Codes and Password both are required");
      }
      await DateGuardService.setupCodesPassword(UserDetails?._id, {
        decoy,
        disarm,
        password,
      }, UserDetails?.email); 
      localStorage.removeItem("decoy");
      localStorage.removeItem("disarm");
      navigation("/dateguard/password-success-changed");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container form-field-container">
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
          <div className="w-full mx-auto flex items-center justify-center mt-9">
            <span className="text-center text-white font-bold text-[24px] change-font-family">
              We were not able to complete your Facial ID. please enter your
              password
            </span>
          </div>
          <div className="w-full mx-auto flex items-center justify-center mt-9 mb-10">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:outline-none focus:shadow-none border-2 border-[white] border-dashed border-t-0 border-l-0 border-r-0 h-[45px] max-w-[317px] bg-transparent text-[35px] text-center text-white"
              type="password"
              id="password"
            />
          </div>
          <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
            <div className="w-[142px]">
              <Button
                type="submit"
                text={"Enter"}
                disabled={loading}
                className="bg-[#05B7FD] rounded-[10px] font-bold text-[26px] h-[41px] flex items-center justify-center change-font-family"
                size="41px"
              />
              {loading ? <>
                <div className='mt-5 flex items-center justify-center'>
                    <span
                        data-te-loading-icon-ref
                        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ffffff7d] border-r-[#405fc4] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"></span>
                    <p className='font-bold text-[14px] text-white change-font-family ml-4'>Loading..</p>
                </div>
              </> : <></> }
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
