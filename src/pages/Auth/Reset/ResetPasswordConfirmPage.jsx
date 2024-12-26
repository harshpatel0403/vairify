import React, { useState } from "react";
import InputText from "../../../components/InputText";
import Button from "../../../components/Button";
import InputPassword from "../../../components/InputPassword";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { VerifyResetPassword } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";

export default function ResetPasswordConfirmPage() {
  const { state: UserEmail } = useLocation();
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const dispatch = useDispatch();
  const [password, setPassword] = useState("password");
  const [confirmPassword, setConfirmPassword] = useState("password");
  const [userpass, setUserPass] = useState("");
  const [userconfirmPass, setUserConfirmPass] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState({});

  const navigate = useNavigate();

  const handleShowPassword = (type) => {
    if (type == "password") {
      if (password == "password") {
        setPassword("text");
      } else if (password == "text") {
        setPassword("password");
      }
    } else if (type == "confirmPassword") {
      if (confirmPassword == "password") {
        setConfirmPassword("text");
      } else if (confirmPassword == "text") {
        setConfirmPassword("password");
      }
    }
  };

  const handleChangePassword = () => {
    setIsLoading(true);
    const body = {
      email: UserEmail,
      newPassword: userpass,
    };

    // Validate fields
    const validationErrors = {};
    // if (!oldPassword) {
    //   validationErrors.oldPassword = "Old Password is required";
    // }
    if (!userpass) {
      validationErrors.userpass = "Password is required";
    }
    if (!userconfirmPass || userconfirmPass !== userpass) {
      validationErrors.userconfirmPass = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setIsLoading(false);
      return; // Prevent form submission if there are errors
    }

    // Clear any previous errors
    setError({});

    dispatch(VerifyResetPassword(body))
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result.payload.data.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setIsLoading(false);
          navigate("/login");
        } else {
          setIsLoading(false);
          toast(result.payload.data.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "error",
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err, "Error");
      });

    // navigate("/client-get-vai");
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
            Reset password
          </span>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between mt-8">
        <div>
          {
            // <div className="mb-12">
            //   <InputText
            //     placeholder={"Enter Old Password"}
            //     border={error.oldPassword && `#ef4444`}
            //     className="text-[20px] font-bold"
            //     onChange={(e) => setOldPassword(e.target.value)}
            //     size={"45px"}
            //   />
            //   {error.oldPassword && (
            //     <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
            //       {error.oldPassword}
            //     </label>
            //   )}{" "}
            // </div>
          }
          <div className="mb-6">
            <InputPassword
              placeholder={"New password"}
              onChange={(e) => setUserPass(e.target.value)}
              border={error.userpass && `#ef4444`}
              className="font-bold"
              size={"45px"}
              textSize="20"
              type={password}
              showPassword={() => handleShowPassword("password")}
            />
            {error.userpass && (
              <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                {error.userpass}
              </label>
            )}{" "}
          </div>

          <div className="mb-9">
            <InputPassword
              placeholder={"Confirm password"}
              onChange={(e) => setUserConfirmPass(e.target.value)}
              className="font-bold"
              size={"45px"}
              textSize="20"
              type={confirmPassword}
              showPassword={() => handleShowPassword("confirmPassword")}
              border={error.userconfirmPass && `#ef4444`}
            />
            {error.userconfirmPass && (
              <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                {error.userconfirmPass}
              </label>
            )}{" "}
          </div>
        </div>
        <div className="mt-4">
          <Button
            className={
              "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[26px] font-bold shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
            }
            text={
              !isLoading ? (
                "Change Password"
              ) : (
                <div className="flex items-center	justify-center pt-[6px]">
                  <Loading />
                </div>
              )
            }
            size={"45px"}
            onClick={() => handleChangePassword()}
          />
          <div className="w-[80%] mx-auto mt-4">
            <a className="text-blue-700 text-[15px] font-extrabold" href="#">
              If you do not receive your code in 60 seconds click this link to
              resend
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
