import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

const SetupFacial = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/facial-recognition");
  };
  return (
    <div className="main-container form-field-container flex flex-col justify-around">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-4">
        <div className="w-full mx-auto flex flex-col items-center justify-center"> 
            <p className="max-w-full font-bold text-[24px] leading-9">In-App <br /> Facial Recognition</p> 
        </div>

        <div className="mx-auto flex flex-col justify-center items-center mt-2">
          <div>
            <span className="font-bold text-[17px]">Turn on</span>
          </div>
          <div>
            <span className="font-bold text-[17px]">Facial Recognition</span>
          </div>
        </div>

        <div className="w-full mx-auto flex justify-center items-center mt-4">
          <div>
            <img
              src={"/images/facialRecognitionLogo.png"}
              alt="Facial Recognition"
            />
          </div>
        </div>

        <div className="w-full mx-auto flex flex-row justify-around items-center flex-wrap mt-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            {/* <div className='flex items-center justify-center w-[249px] border-2 border-white bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[25px] ml-3 shadow-2xl'></div> */}
          </label>
        </div>

        <div className="w-full mx-auto flex justify-center items-center mt-4">
          {/* <div className="w-[163.8px]">
            <Button
              onClick={() => handleSubmit()}
              text="Skip>>"
              className="font-bold text-[23.4px] text-[#01195C] bg-transparent shadow-none focus:bg-transparent"
            />
          </div> */}
          <div className="w-[163.8px]">
            <Button
              onClick={() => handleSubmit()}
              text="Submit>>"
              className="bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupFacial;
