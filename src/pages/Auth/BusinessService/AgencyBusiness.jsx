import { useState } from "react";
import InputText from "../../../components/InputText";
import Button from "../../../components/Button";
import { HandleLogIn, HandleSignUp } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loading from "../../../components/Loading/Index";
import { useLocation, useNavigate } from "react-router-dom";

export default function AgencyBusiness() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [agencyDetails, setagencyDetails] = useState({});

  const [error, setError] = useState({});

  const handleRegister = (e) => {
    setIsLoading(true);
    e.preventDefault();
    let body = {
      name: state.name,
      parentId: 0,
      email: state.email,
      password: state.password,
      country: agencyDetails?.countryOfBusiness,
      user_type: "agency-business",
      business_name: agencyDetails?.nameOfBusiness,
      business_type: state.business_type,
      address: agencyDetails?.address,
      phone: agencyDetails?.phone,
      whatsapp: agencyDetails?.whatsapp,
      gender: "Male",
      is_admin: true,
      application_type: "pwa",
      is_affiliate: false,
      user_affiliate_link: "",
    };

    // Validate fields
    const validationErrors = {};
    if (!agencyDetails?.countryOfBusiness) {
      validationErrors.countryOfBusiness = "Country Of Business is required";
    }
    if (!agencyDetails?.nameOfBusiness) {
      validationErrors.nameOfBusiness = "Name Of Your Business is required";
    }
    if (!agencyDetails?.address) {
      validationErrors.address = "Address Of Business is required";
    }
    if (!agencyDetails?.phone || !agencyDetails?.whatsapp) {
      validationErrors.contact = "Contact information is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setIsLoading(false);
      return; // Prevent form submission if there are errors
    }

    // Clear any previous errors
    setError({});

    dispatch(HandleSignUp(body))
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          dispatch(
            HandleLogIn({ email: body?.email, password: body?.password })
          ).then(async (result) => {
            navigate("/otp-verification",{state: { login: true, email: body?.email, usertype: body?.user_type },});
            setagencyDetails({});
            setIsLoading(false);
            // setIsLoading(false);
            // setagencyDetails({});
            // if (result?.payload?.data?.user?.user_type === "agency-business") {
            //   //  await navigate("/get-vai");
            //   // navigate("/business/community");
            //   navigate("/otp-verification",{state: { login: true, email: body?.email },});
            //   setIsLoading(false);
            //   setagencyDetails({});
            // }
          });
        } else {
          setIsLoading(false);
          toast(result?.payload?.data?.data, {
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
  };

  const HandleInput = (e) => {
    setagencyDetails({ ...agencyDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="main-container flex flex-col justify-between px-0">
      <div className="w-full mt-6 bg-gradient-to-b from-[#040B473D] to-[#040B473D] flex items-center justify-center flex-col">
        <span
          style={{ fontFamily: "Roboto" }}
          className="text-[30px] text-center font-extrabold text-[#040B47]"
        >
          {state.business_type.replace("Business", "").trim()}
        </span>
        <span
          style={{ fontFamily: "Roboto" }}
          className="text-[30px] mt-[-12px] text-center font-extrabold text-[#040B47]"
        >
          Agency/Business
        </span>
      </div>

      <div className="text-center text-[18px] font-bold	mb-6 text-[#02227E]">
        <span>Enter your business information</span>
      </div>
      <div className="py-2 flex-1 px-5">
        <div className="mb-3">
          <label className="text-[18px] font-bold ml-2 text-[#02227E] flex">
            Country of Business
          </label>
          <InputText
            // value={username}
            name={"countryOfBusiness"}
            onChange={(e) => HandleInput(e)}
            influencer-affiliate
            className={"h-[50px] text-[20px] font-bold text-gray"}
            border={error.countryOfBusiness && `#ef4444`}
          />
          {error.countryOfBusiness && (
            <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
              {error.countryOfBusiness}
            </label>
          )}
        </div>
        <div className="mb-3">
          <label className="text-[18px] font-bold ml-2 text-[#02227E] flex">
            Name of your business
          </label>
          <InputText
            // value={username}
            onChange={(e) => HandleInput(e)}
            influencer-affiliate
            className={`w-full text-[12px] text-[20px] font-bold text-gray border-2 border-[#3760CB] rounded-2xl py-2 px-4 h-[50px] bg-transparent `}
            border={error.nameOfBusiness && `#ef4444`}
            name={"nameOfBusiness"}
          />
          {error.nameOfBusiness && (
            <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
              {error.nameOfBusiness}
            </label>
          )}
        </div>
        <div className="mb-2">
          <label className="text-[18px] font-bold ml-2 text-[#02227E] flex">
            Address of business
          </label>
          <textarea
            id="message"
            rows="3"
            className="block p-2.5 text-[20px] font-bold text-gray w-full rounded-2xl border-2 bg-[#d5d6e0] dark:border-[#3760CB] dark:placeholder-gray-400"
            onChange={(e) => HandleInput(e)}
            name={"address"}
            style={{ borderColor: error.address ? `#ef4444` : "#0247FF" }}
          ></textarea>
          {error.address && (
            <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
              {error.address}
            </label>
          )}
        </div>

        <div className="mb-2">
          <label className="text-[18px] font-bold ml-2 text-[#02227E] flex">
            Contact information
          </label>
          <InputText
            // value={username}
            onChange={(e) => HandleInput(e)}
            influencer-affiliate
            placeholder={"Phone"}
            name={"phone"}
            className={"h-[50px] text-[20px] font-bold text-gray"}
            border={error.contact && `#ef4444`}
            type={"number"}
          />
        </div>

        <div className="mb-2">
          <InputText
            // value={businessName}
            onChange={(e) => HandleInput(e)}
            className="text-[20px] font-bold"
            placeholder={"Whatsapp"}
            name={"whatsapp"}
            border={error.contact && `#ef4444`}
            type={"number"}
          />
          {error.contact && (
            <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
              {error.contact}
            </label>
          )}
        </div>
      </div>
      <div className="mt-1 px-5 mb-5">
        <Button
          className={
            "bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[26px] font-bold shadow-2xl"
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
  );
}
