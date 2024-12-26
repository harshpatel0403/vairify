import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

const DateGuardSetup = () => {
  const navigate = useNavigate();

  const handelEditCodes = () => {
    navigate("/dateguard/codes");
  };
  const handelGroups = () => {
    navigate("/dateguard/select-group");
  };

  const handleActivate = () => {
    navigate("/dateguard/select-appointment");
  };

  return (
    <div className="main-container flex flex-col justify-start form-field-container">
      <div className="w-full mx-auto flex justify-center items-center mt-4">
        <span className="font-bold text-[34px] text-[#05B7FD] change-font-family">
          Date Guard
        </span>
      </div>
      <div className="flex-1 w-full mx-auto flex items-center justify-center">
        <div className="w-[190px] mt-4">
          <img className="w-full" src={`/images/SetupBusinessProfile.png`} />
        </div>
      </div>

      <div className="mt-10">
        <Button
          onClick={handleActivate}
          text={"Activate"}
          className="bg-gradient-to-b from-[#4200FF] to-[#4200FF] text-white border-2 border-white h-[62.1px] font-medium text-[36px] change-font-family"
        />
      </div>
      <div className="mt-10">
        <Button
          onClick={handelGroups}
          text={"Edit Groups"}
          className="bg-gradient-to-b from-[#4200FF] to-[#4200FF] text-white border-2 border-white h-[62.1px] font-medium text-[36px] change-font-family"
        />
      </div>
      <div className="mt-10">
        <Button
          onClick={handelEditCodes}
          text={"Edit Codes"}
          className="bg-gradient-to-b from-[#4200FF] to-[#4200FF] text-white border-2 border-white h-[62.1px] font-medium text-[36px] change-font-family"
        />
      </div>
    </div>
  );
};

export default DateGuardSetup;
