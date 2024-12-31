import { useState } from "react";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import InputPassword from "../../../components/InputPassword";
import SelectBox from "../../../components/SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { HandleLogIn, HandleSignUp, SendOTP } from "../../../redux/action/Auth";
import { toast, ToastContainer } from "react-toastify";
import Loading from "../../Loading/Index";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";

export default function ClientHobbyistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector((state) => state?.Auth?.language);
  const location = useSelector(
    (state) => state?.CurrentLocation?.currentLocation?.country_name
  );
  const { state } = useLocation();
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [userpass, setUserPass] = useState("");
  const [userconfirmPass, setUserconfirmPass] = useState("");
  const [gender, setGender] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);

  const [password, setPassword] = useState("password");
  const [confirmPassword, setConfirmPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const [genderOptions] = useState([
    "Gender",
    "Male",
    "Female",
    "Trans Male Pre-Op",
    "Trans Female Pre-Op",
    "Trans Male Post-Op",
    "Trans Female Post-Op",
  ]);
  const [error, setError] = useState({});

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
    e.preventDefault();
    setIsLoading(true);

    let body = {
      name: username,
      language: state.language,
      phonenumber: `+${phoneNumber}`,
      parentId: 0,
      email: email,
      password: userpass,
      country: location,
      user_type: "client-hobbyist",
      gender: gender,
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

    if (!gender || gender === "Gender") {
      validationErrors.gender = "*Please select a valid gender";
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

    dispatch(HandleSignUp(body))
      .then(async (result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          let body = {
            email: result?.payload?.data?.user?.email,
            password: result?.payload?.data?.user?.epassword,
          };

          dispatch(HandleLogIn(body));
          await dispatch(SendOTP(body?.email));
          navigate("/otp-verification");

          setIsLoading(false);
          setUsername("");
          setPhoneNumber("");
          setEmail("");
          setUserPass("");
          setUserconfirmPass("");
          setGender("");
          // navigate("/get-vai");
        } else {
          toast(result?.payload?.data?.data, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "error",
          });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);

        console.error(err, "Error");
      });
  };

  return (
    <div className="main-container flex flex-col justify-between px-0">
      <ToastContainer />
      <div className="w-full mt-6 mb-6 bg-gradient-to-b from-[#040B473D] to-[#040B473D] h-[47px] flex items-center justify-center">
        <span
          style={{ fontFamily: "Roboto" }}
          className="text-[25px] text-center font-extrabold text-[#040C50]"
        >
          Client/Hobbyist
        </span>
      </div>
      <div className="inner-content-part">
        <div className="py-2 flex-1 px-5 form-field-container">
          <div className="mb-4">
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-[18px] font-bold focus-visible:border-2 focus-visible:border-[#3760CB]"
              placeholder={"Username"}
              size="47px"
              border={error.username && `#ef4444`}
            />
            {error.username && (
              <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                {error.username}
              </label>
            )}
          </div>
          <div className="mb-4">
            {/* <InputText
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-[18px] font-bold"
                placeholder={"Phone number"}
                size="47px"
                type={"number"}
                border={error.phoneNumber && `#ef4444`}
              /> */}
            <PhoneInput
              inputClass={`custom-phone-input-class ${error?.phoneNumber ? "error-border" : ""
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
                fontSize: "18px",
                fontWeight: "bold",
                color: "#000",
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
          <div className="mb-4">
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-[18px] font-bold"
              placeholder={"Email"}
              size="47px"
              border={error.email && `#ef4444`}
            />
            {error.email && (
              <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                {error.email}
              </label>
            )}
          </div>
          <div className="mb-4">
            <SelectBox
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="Gender"
              options={genderOptions}
              className1="text-[18px] font-bold !border-0"
              size={"h-[47px]"}
              textAlign={"text-left"}
              rounded={"rounded-2xl"}
              fontWeight={"font-bold"}
              textColor={"text-[#727885]"}
              textSize={"text-[18px]"}
              border={error.gender && `#ef4444`}
            />
            {error.gender && (
              <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                {error.gender}
              </label>
            )}
          </div>
          <div className="mb-4">
            <InputPassword
              value={userpass}
              onChange={(e) => setUserPass(e.target.value)}
              className="text-[20px] font-bold"
              textSize={20}
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
          <div className="mb-4">
            <InputPassword
              value={userconfirmPass}
              onChange={(e) => setUserconfirmPass(e.target.value)}
              className="text-[20px] font-bold"
              textSize={20}
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
          <div className="mb-2 flex">
            <input
              checked={termsChecked}
              onChange={() => setTermsChecked(!termsChecked)}
              type="checkbox"
              className="mr-1"
            />
            <label className="text-sm  font-bold">Terms and conditions</label>
          </div>
          {error.termsChecked && (
            <div className="mb-4">
              <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                {error.termsChecked}
              </label>
            </div>
          )}
        </div>
        <div className="mt-0 mb-4 px-5 form-field-container">
          <Button
            className={
              "bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[26px] font-bold"
            }
            text={
              !isLoading ? (
                "Register"
              ) : (
                <div className="flex items-center	justify-center pt-[6px]">
                  <Loading />
                </div>
              )
            }
            onClick={handleRegister}
            size={"45px"}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
