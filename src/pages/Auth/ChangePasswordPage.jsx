import React, { useState } from "react";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ResetPassword } from "../../redux/action/Auth";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Index";
import UserService from "../../services/userServices";

export default function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const navigate = useNavigate();

  const [cpassword, setcPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rpassword, setrPassword] = useState("");

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const handleOTP = async () => {
    if (!cpassword || !password || !rpassword) {
      toast.error("Please enter all details");
      return;
    }

    if (password !== rpassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    UserService.changePassword(UserData?._id, {
      currentPassword: cpassword,
      newPassword: password,
    })
      .then(() => {
        toast("Password changed successfully", {
          hideProgressBar: true,
          autoClose: 1000,
          type: "success",
        });
        setIsLoading(false);
        navigate("/settings");
      })
      .catch((err) => {
        setIsLoading(false);
        toast(err?.response?.data?.error, {
          hideProgressBar: true,
          autoClose: 1000,
          type: "error",
        });
        console.error(err, "Error");
      });
  };
  return (
    <div className="main-container flex flex-col justify-center form-field-container">
      <div className="relative flex flex-col justify-start items-center">
        <div className="relative top-6">
          <img src={"/images/VectorLogo1.png"} alt="Vector Logo 1" />
        </div>
        <div className="relative bottom-2 left-4">
          <img src={"/images/VectorLogo2.png"} alt="Vector Logo 2" />
        </div>
        <div className="relative">
          <span className="font-bold text-[28.8px] text-black">
            Change password
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between mt-10">
        <div>
          <div className="mb-4">
            <InputText
              className={"text-[20px] font-bold"}
              placeholder={"Current Password"}
              onChange={(e) => setcPassword(e.target.value)}
              value={cpassword}
              // border={error.email && `#ef4444`}
              type={"password"}
            />
          </div>

          <div className="mt-4">
            <InputText
              className={"text-[20px] font-bold"}
              placeholder={"New Password"}
              type={"password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              // border={error.number && `#ef4444`}
            />
          </div>

          <div className="mt-4">
            <InputText
              className={"text-[20px] font-bold"}
              placeholder={"Confirm Password"}
              type={"password"}
              onChange={(e) => setrPassword(e.target.value)}
              value={rpassword}
              // border={error.number && `#ef4444`}
            />
          </div>
        </div>
        <Button
          className={
            "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[26px] font-bold mt-10 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
          }
          text={
            !isLoading ? (
              "Submit"
            ) : (
              <div className="flex items-center	justify-center pt-[6px]">
                <Loading />
              </div>
            )
          }
          size={"45px"}
          disabled={isLoading}
          onClick={() => handleOTP()}
        />
      </div>
    </div>
  );
}
