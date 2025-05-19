import { useState } from "react";
import InputText from "../../../components/InputText";
import InputPassword from "../../../components/InputPassword";
import SelectBox from "../../../components/SelectBox";
import Button from "../../../components/Button";
import Loading from "../../Loading/Index";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import BackButton from "../../BackButton/backArrowButton";
import { Link } from "react-router-dom";

export default function AgencyBusinessPage() {
  const navigate = useNavigate();
  const language = useSelector((state) => state?.Auth?.language);
  const location = useSelector(
    (state) => state?.CurrentLocation?.currentLocation?.country_name
  );
  const { state } = useLocation();
  const [username, setUsername] = useState("");
  const [typeofBusiness, setTypeofBusiness] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [userpass, setUserPass] = useState("");
  const [userconfirmPass, setUserConfirmPass] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [error, setError] = useState({});
  const [businessOptions] = useState([
    "Type of business",
    "Non Service Business",
    "Service Business",
  ]);
  const [password, setPassword] = useState("password");
  const [confirmPassword, setConfirmPassword] = useState("password");
  const handleShowPassword = (type) => {
    if (type === "password") {
      if (password === "password") {
        setPassword("text");
      } else if (password === "text") {
        setPassword("password");
      }
    } else if (type === "confirmPassword") {
      if (confirmPassword === "password") {
        setConfirmPassword("text");
      } else if (confirmPassword === "text") {
        setConfirmPassword("password");
      }
    }
  };

  const validatePhoneNumber = (inputNumber, country, isDirty, phoneLength) => {
    if (isDirty) {
      if (
        inputNumber &&
        inputNumber?.replace(country.dialCode, "")?.trim() === ""
      ) {
        return false;
      } else if (inputNumber.length < phoneLength) {
        return false;
      }
      return true;
    }
    return false;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = (e) => {
    setIsLoading(true);
    e.preventDefault();
    let body = {
      name: username,
      parentId: 0,
      email: email,
      phonenumber: `+${phoneNumber}`,
      language: state.language,
      password: userpass,
      country: location,
      user_type: "agency-business",
      business_name: businessName,
      business_type: typeofBusiness,
      gender: "Male",
      is_admin: true,
      application_type: "pwa",
      is_affiliate: false,
      user_affiliate_link: "",
      istest: true,
    };

    // Validate fields
    const validationErrors = {};
    if (!termsChecked) {
      validationErrors.termsChecked = "*Must accept terms and condition";
    }
    if (!username) {
      validationErrors.username = "*Username is required";
    }
    if (!typeofBusiness || typeofBusiness === "Type of business") {
      validationErrors.typeofBusiness = "*Please select a valid business type";
    }
    // if (!businessName) {
    //   validationErrors.businessName = "Business name is required";
    // }
    if (!phoneNumber) {
      validationErrors.phoneNumber = "*Phone number is required";
    }
    if (!isValidPhoneNumber) {
      validationErrors.phoneNumber = "*Enter a valid phone number";
    }
    if (!email) {
      validationErrors.email = "*Email is required";
    } else if (!validateEmail(email)) {
      validationErrors.email = "*Enter a valid email ";
    }
    if (!userpass) {
      validationErrors.userpass = "*Password is required";
    }
    if (!userconfirmPass || userconfirmPass !== userpass) {
      validationErrors.userconfirmPass = "*Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setIsLoading(false);
      return; // Prevent form submission if there are errors
    }

    // Clear any previous errors
    setError({});
    navigate("/agencybusiness", {
      state: body,
    });

    // dispatch(HandleSignUp(body))
    //   .then((result) => {
    //     if (result?.payload?.status === 200) {
    //       toast(result?.payload?.data?.message, {
    //         hideProgressBar: true,
    //         autoClose: 1000,
    //         type: "success",
    //       });
    //       setUsername("");
    //       setTypeofBusiness("");
    //       setBusinessName("");
    //       setPhoneNumber("");
    //       setEmail("");
    //       setUserPass("");
    //       setUserConfirmPass("");
    //       setIsLoading(false);
    //     } else {
    //       setIsLoading(false);
    //       toast(result?.payload?.data?.data, {
    //         hideProgressBar: true,
    //         autoClose: 1000,
    //         type: "error",
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     setIsLoading(false);
    //     console.error(err, "Error");
    //   });
  };

  return (
    <div className="signup-backgound-design">
      <div className="signup-container container">
        <div className="signup-content relative">
          <div className="backnavigation"><BackButton /></div>
          <div className="logo-img-container">
            <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
            <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
          </div>
          <div className="sm:mt-[64px] mt-[24px] mb-[24px]">
            <h3
              className="primary-heading"
            >
              Agency/Business
            </h3>
            <p className="font-normal sm:text-[18px] text-[14px] text-white sm:mt-2 opacity-70">Enter your business information</p>
          </div>
          <div className="flex flex-col gap-[20px] items-center justify-center">
            <div className="flex items-center sm:flex-nowrap flex-wrap gap-[20px] w-[100%]">
              <div className="w-[100%]">
                <InputText
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  influencer-affiliate
                  placeholder={"Username"}
                  className={"text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"}
                  border={error.username && `#ef4444`}
                />
                {error.username && (
                  <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                    {error.username}
                  </label>
                )}
              </div>
              <div className="w-[100%]">
                <PhoneInput
                  inputClass={`w-[100%] custom-phone-input-class ${error?.phoneNumber ? "error-border" : ""
                    } `}
                  buttonClass=""
                  searchClass=""
                  dropdownClass=""
                  containerClass="w-full h-[47px]"
                  country={"in"}
                  placeholder={"Phone number"}
                  enableSearch={true}
                  value={phoneNumber}
                  onChange={(phone) => setPhoneNumber(phone)}
                  inputStyle={{
                    width: "100%",
                    height: "100%",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "white",
                    borderStyle: "solid",
                    borderRadius: "1rem",
                  }}
                  isValid={(inputNumber, country, countries) => {
                    const phoneLength = Math.ceil(
                      countries.filter(
                        (val) => val.dialCode === country.dialCode
                      )[0]?.format.length / 2
                    );
                    let result = validatePhoneNumber(
                      inputNumber,
                      country,
                      true,
                      phoneLength
                    );
                    setIsValidPhoneNumber(result);
                    return true;
                  }}
                />
                {error.phoneNumber && (
                  <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                    {error.phoneNumber}
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center sm:flex-nowrap flex-wrap gap-[20px] w-[100%]">
              <div className="w-[100%]">
                <InputText
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"
                  placeholder={"Email"}
                  border={error.email && `#ef4444`}
                />
                {error.email && (
                  <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                    {error.email}
                  </label>
                )}
              </div>
              <div className="w-[100%]">
                <SelectBox
                  value={typeofBusiness}
                  onChange={(e) => setTypeofBusiness(e.target.value)}
                  options={businessOptions}
                  className1="text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"
                  size={"h-[47px]"}
                  textAlign={"text-left"}
                  rounded={"rounded-2xl"}
                  fontWeight={"font-bold"}
                  textColor={"text-white"}
                  textSize={"text-[14px]"}
                  border={error.typeofBusiness && `#ef4444`}
                />
                {error.typeofBusiness && (
                  <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                    {error.typeofBusiness}
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center sm:flex-nowrap flex-wrap gap-[20px] w-[100%]">
              <div className="w-[100%]">
                <InputPassword
                  value={userpass}
                  onChange={(e) => setUserPass(e.target.value)}
                  className="flex"
                  textSize={14}
                  placeholder={"Password"}
                  type={password}
                  showPassword={() => handleShowPassword("password")}
                  border={error.userpass && `#ef4444`}
                />
                {error.userpass && (
                  <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                    {error.userpass}
                  </label>
                )}

              </div>
              <div className="w-[100%]">
                <InputPassword
                  value={userconfirmPass}
                  onChange={(e) => setUserConfirmPass(e.target.value)}
                  className="flex"
                  textSize={14}
                  placeholder={"Confirm Password"}
                  type={confirmPassword}
                  showPassword={() => handleShowPassword("confirmPassword")}
                  border={error.userconfirmPass && `#ef4444`}
                />
                {error.userconfirmPass && (
                  <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                    {error.userconfirmPass}
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center w-full">
              <div>
                <div className="mb-2 flex">
                  <input
                    checked={termsChecked}
                    onChange={() => setTermsChecked(!termsChecked)}
                    type="checkbox"
                    className="mr-1 border-none"
                  />
                  <label className="text-sm font-normal text-white">Terms and conditions</label>
                </div>
                {error.termsChecked && (
                  <div className="mb-4">
                    <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                      {error.termsChecked}
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full h-fit justify-center">
              <Button
                className='max-w-[500px]'
                text={!isLoading ? ("Register") : (
                  <div className="flex items-center	justify-center">
                    <Loading />
                  </div>
                )
                }
                onClick={handleRegister}
                disabled={isLoading}
              />
            </div>
            <div className="text-[#919EAB] font-normal text-[14px] max-sm:mb-[48px]">Already have an account? <Link to="/login" className="text-white"> Login</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}
