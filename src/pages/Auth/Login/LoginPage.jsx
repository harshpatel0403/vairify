import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HandleLogIn } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
import InputPassword from "../../../components/InputPassword";

export default function LoginPage() {
  const dispatch = useDispatch();
  const storedEmail = localStorage.getItem("rememberedEmail") || "";
  const storedPassword = localStorage.getItem("rememberedPassword") || "";

  const [email, setEmail] = useState(storedEmail);
  const [userPassword, setUserPassword] = useState(storedPassword);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFocus = () => {
    const element = document.getElementById("border-change");
    element.classList.add("input-border-blue");
  };

  const handleBlur = () => {
    const element = document.getElementById("border-change");
    element.classList.add("input-border-blue");
  };

  const [hidden, setHidden] = useState(true);
  const [password, setPassword] = useState("password");

  const handleShowPassword = () => {
    if (password === "password") {
      setPassword("text");
      setHidden(false);
    } else {
      setPassword("password");
      setHidden(true);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogIn = () => {
    setIsLoading(true);
    let body = { email: email, password: userPassword };

    // Validate fields
    const validationErrors = {};
    if (!email) {
      validationErrors.email = "*Email is required";
    } else if (!validateEmail(email)) {
      validationErrors.email = "*Enter a valid email";
    }
    if (!userPassword) {
      validationErrors.password = "*Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setIsLoading(false);
      return;
    }

    setError({});

    if (isChecked) {
      // Store email and password in localStorage
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", userPassword);
    }
    dispatch(HandleLogIn(body))
      .then(async (result) => {
        if (result?.payload?.status === 200) {
          navigate("/otp-verification", {
            state: { login: true, email: email, password: userPassword },
          });
          // navigate("/featured", {
          //   state: { login: true },
          // })
          toast("OTP send successfully", {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setIsLoading(false);
        } else {
          setIsLoading(false);
          toast(result?.payload, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "error",
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast("Netwok Error", {
          hideProgressBar: true,
          autoClose: 1000,
          type: "error",
        });
        console.error(err, "Error");
      });
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="login-img mt-3">
          <img src={"/images/loginAvatar.png"} alt="" />
        </div>
      </div>

      <div className="login-title mb-1">
        <span>Login</span>
      </div>

      <div className="login-input-container">
        <div className="w-full mb-5">
          <label className="relative block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <img src={"images/inputUserAvatar.png"} alt="" />
            </span>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-transparent text-[20px] font-bold  border-2 py-2 pl-10 pr-12 text-black input-password rounded-2xl`}
              name="email"
              placeholder="Email"
              type="email"
              style={{ borderColor: error.email ? `#ef4444` : "#0247FF" }}
            />
          </label>
          {error.email && (
            <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
              {error.email}
            </label>
          )}
        </div>

        <div className="mb-5">
          <label className="relative block">
            <div id="border-change" className="flex flex-col border-0">
              <div className="relative input-text ">
                <span className="absolute inset-y-0 left-0  flex items-center pl-3">
                  <img src={"/images/loginPasswordInput.png"} alt="" />
                </span>
                <InputPassword
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="text-[20px] font-bold pl-6"
                  // textSize={20}
                  placeholder={"Enter Password"}
                  type={password}
                  showPassword={() => handleShowPassword("password")}
                  border={error.password && `#ef4444`}
                />
                {/* <input
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  type={password}
                  className={`w-full bg-transparent text-[16px] border-2 py-2 pl-10 pr-12 text-black input-password rounded-2xl`}
                  name="password"
                  placeholder="Enter Password"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{ borderColor: error.password ? `#ef4444` : "#0247FF" }}
                /> */}
                {/* <i
                  onClick={handleShowPassword}
                  className={`fa absolute right-5 ${
                    hidden ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i> */}
              </div>
              {error.password && (
                <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                  {error.password}
                </label>
              )}
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="md:flex md:items-center">
            <label className="flex justify-center items-center text-gray-500 font-bold">
              <input
                type="checkbox"
                className="form-checkbox bg-transparent text-indigo-600 h-[18px] w-[18px] focus:outline-none "
                onChange={(e) => setIsChecked(e.target.checked)}
                checked={isChecked}
              />
              <span className="text-sm ml-[5.2px] text-black opacity-40">
                Remember me
              </span>
            </label>
          </div>
          <Link
            className="inline-block align-baseline font-bold text-sm text-black opacity-60"
            to="/reset-password"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="bg-transparent rounded-full mt-4">
          <button
            className="text-center from-[#0CA36C] to-[#08FA5A] bg-gradient-to-b rounded-[12px] bg-opacity-[20%] border-0 w-full font-bold focus:outline-none focus:shadow-outline h-[45px] text-[26px] text-black shadow-2xl"
            type="Submit"
            onClick={handleLogIn}
          >
            {!isLoading ? (
              "LogIn"
            ) : (
              <div className="flex items-center	justify-center pt-[6px]">
                <Loading />
              </div>
            )}
          </button>
        </div>

        <div className="divider">
          <div className="divider-line"></div>
          <div className="divider-or">
            <span>OR</span>
          </div>
          <div className="divider-line"></div>
        </div>

        <div className="mx-auto mb-5 mt-3">
          <Link
            className="from-[#0CA36C] to-[#08FA5A] bg-gradient-to-b rounded-[12px] flex flex-col justify-center align-baseline font-bold text-[22px] text-black h-[45px] shadow-2xl"
            to="/language"
          >
            <span className="text-[#000000] text-[26px] font-bold">
              Sign Up
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
