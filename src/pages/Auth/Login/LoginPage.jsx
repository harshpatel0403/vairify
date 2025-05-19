import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HandleLogIn } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
// import Loading from "../../../components/Loading/Index";
import InputPassword from "../../../components/InputPassword";
import Loading from "../../../components/Loading/Index";
import Button from "../../../components/Button";

import { useTranslation } from "react-i18next";


export default function LoginPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const storedEmail = localStorage.getItem("rememberedEmail") || "";
  const storedPassword = localStorage.getItem("rememberedPassword") || "";

  const [email, setEmail] = useState(storedEmail);
  const [userPassword, setUserPassword] = useState(storedPassword);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoginClicked, setIsLoginClicked] = useState(false);

  const handleLoginClick = () => {
    setIsLoginClicked(true);
  };

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const handleFocus = () => {
  //   const element = document.getElementById("border-change");
  //   element.classList.add("input-border-blue");
  // };

  // const handleBlur = () => {
  //   const element = document.getElementById("border-change");
  //   element.classList.add("input-border-blue");
  // };

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
          toast(result?.payload?.response?.data?.message, {
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
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#fff] w-full h-full">
        <div className={`login-page h-full ${isLoginClicked ? 'animate' : ''}`}>
          <div className='image-container'>
            <div className='logo-img'><img src='/images/login/vairify-logo.svg' alt='object' /></div>
            <div className='img1'><img src='/images/login/img1.png' alt='object' /></div>
            <div className='img2'><img src='/images/login/img2.png' alt='object' /></div>
            <div className='img3'><img src='/images/login/img3.png' alt='object' /></div>
            <div className='img4'><img src='/images/login/img4.png' alt='object' /></div>
            <div className='img5'><img src='/images/login/img5.png' alt='object' /></div>
            <div className='img6'><img src='/images/login/img6.png' alt='object' /></div>
            <div className='img7'><img src='/images/login/img7.png' alt='object' /></div>
            <div className='img8'><img src='/images/login/img8.png' alt='object' /></div>
            <div className='img9'><img src='/images/login/img9.png' alt='object' /></div>
          </div>
          <div className='button-container'>
            <h2 className='sm:text-[28px] text-2xl font-semibold text-[#FFFFFF] text-center'>{t("login.joinUs")}</h2>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p className="sm:text-lg text-sm mt-1 font-normal text-[#FFFFFF] text-center">{t("login.makeFriends")}</p>
            <button className='p-[12px] bg-[#303BA2] rounded-[8px] cursor-pointer w-full  text-center mt-[16px]  font-bold sm:text-base text-sm text-[#ffffff] hover:bg-[#3f4bbd] transition-all duration-300' onClick={() => navigate('/language')}>{t("global.signUp")}</button>
            <button className='login-btn p-[12px] bg-[#E8EBF0] rounded-[8px] cursor-pointer w-full text-center mt-[16px] hover:bg-[#3660cb] group transition-all duration-300' onClick={handleLoginClick} > <p className='bg-gradient-to-b from-[#02227E] to-[#0247FF] bg-clip-text text-transparent font-bold sm:text-base text-sm group-hover:text-white'>{t("global.login")}</p> </button>
          </div>

          {/* <div className='form-container'></div> */}
          <div className="login-container">

            <div className="login-input-container">
              <div className="flex justify-center w-full">
                <img src="/images/login/vairify-logo.svg" alt="logo" className="lg:hidden block sm:max-w-auto max-w-[170px] sm:mb-0 mb-[-130px]" />
              </div>
              <div className="sm:mt-0 mt-[60px]">
                <h4 className="text-[#FFFFFF] font-semibold sm:text-[28px] text-2xl mb-1">{t("global.login")}</h4>
                <p className="text-[#FFFFFF] font-normal sm:text-lg text-sm mb-4">{t("login.welcomeBack")}</p>
                <div className="w-full mb-5">
                  <label className="relative block">

                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-transparent text-[20px] border-[2px] focus:!border-[#0247ff] xl:py-[14px] py-[13px] px-[14px] input-password rounded-[8px] text-sm text-[#FFFFFF] font-normal`}
                      name="email"
                      placeholder="Email"
                      type="email"
                      style={{ borderColor: error.email ? `#ef4444` : "#919EAB33" }}
                    />
                  </label>
                  {error.email && (
                    <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                      {error.email}
                    </label>
                  )}
                </div>

                <div className="mb-5">
                  <label className="relative block">
                    <div id="border-change" className="flex flex-col border-0">
                      <div className="relative input-text ">

                        <InputPassword
                          value={userPassword}
                          onChange={(e) => setUserPassword(e.target.value)}
                          className="w-full bg-transparent text-[20px] border-[1px] border-[#919EAB33] hover:!border-[#919EAB33] py-[16px] px-[0px] input-password rounded-[8px] text-sm  font-normal"
                          placeholder={"Password"}
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
                        <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                          {error.password}
                        </label>
                      )}
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="md:flex md:items-center">
                    <div className="flex justify-center items-center text-gray-500 font-bold">
                      <input
                        type="checkbox"
                        className="appearance-none h-[18px] w-[18px] border border-[#919EAB33] rounded-[4px] focus:outline-none checked:bg-white checked:border-white relative checked:before:content-[' '] checked:before:bg-[url('/images/login/checked.svg')] checked:before:bg-cover checked:before:bg-center checked:before:h-[18px] checked:before:w-[18px] checked:before:absolute checked:before:left-[-1px] checked:before:top-[-1px] transition transition-all duration-300 cursor-pointer"
                        onChange={(e) => setIsChecked(e.target.checked)}
                        checked={isChecked}
                      />
                      <label className="text-sm ml-2 text-white opacity-60 font-normal">
                        {t("login.rememberMe")}
                      </label>
                    </div>
                  </div>
                  <Link
                    className="inline-block align-baseline font-normal text-sm text-white opacity-60"
                    to="/reset-password"
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>
              </div>

              <div>
                <div className="bg-transparent rounded-full mt-4">
                  <Button
                    className='max-w-[500px]'
                    text={!isLoading ? ("Login") : (
                      <div className="flex items-center	justify-center">
                        <Loading />
                      </div>
                    )
                    }
                    onClick={handleLogIn}
                    disabled={isLoading}
                  />
                </div>

                <div className="mx-auto mt-4 flex justify-center">
                  <span className="text-[#919EAB] font-normal text-sm"> {t("login.dontHaveAccount")}</span>
                  <Link
                    className="text-sm font-semibold text-white ml-1"
                    to="/language"
                  >
                    {t("global.signUp")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
