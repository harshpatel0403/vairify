import { useEffect, useState } from "react";
import InputText from "../../../components/InputText";
import Button from "../../../components/Button";
import { HandleLogIn, HandleSignUp } from "../../../redux/action/Auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loading from "../../../components/Loading/Index";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../../components/BackButton/backArrowButton";
import { useTranslation } from "react-i18next";
import AuthService from "../../../services/AuthService";

export default function AgencyBusiness() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [agencyDetails, setagencyDetails] = useState({});
  const [countries, setCountries] = useState([]);
  

  

  const [error, setError] = useState({});

  const handleRegister = (e) => {
    setIsLoading(true);
    e.preventDefault();
    let body = {
      name: state?.name,
      language: state?.language,
      parentId: 0,
      email: state?.email,
      password: state?.password,
      country: agencyDetails?.countryOfBusiness,
      user_type: "agency-business",
      business_name: agencyDetails?.nameOfBusiness,
      business_type: state?.business_type,
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
            navigate("/otp-verification", { state: { login: true, email: body?.email, usertype: body?.user_type }, });
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

  const getAllData = () => {
    AuthService.getAllCountries()
    .then((res) => {
      setCountries(res);})
    .catch((err) => {
      console.log(err);
      toast.error(err?.response?.data?.error || err.message);
    });
  };
  useEffect(() => {
    getAllData();
  }, []);
  return (
    <>
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
                {state?.business_type.replace("Business", "").trim()}{' '}{t("agencyBusiness.heading")}
              </h3>
              <p className="font-normal sm:text-[18px] text-[14px] text-white sm:mt-2 opacity-70">{t("agencyBusiness.subheading")}</p>
            </div>
            <div className="flex gap-[16px] sm:flex-nowrap flex-wrap">
              <div className="w-full">
                 <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    value={agencyDetails.countryOfBusiness || ""}
                    onChange={(e) =>
                      HandleInput({ target: { name: "countryOfBusiness", value: e.target.value } })
                    }
                  >
                    <option value="" className="text-black">{t("socialsearch.searchCountry")}</option>
                    {countries?.map((country) => (
                      <option key={country._id} value={country.name} className="text-black">
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {error.countryOfBusiness && (
                    <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                      {error.countryOfBusiness}
                    </label>
                  )}
              </div>
              <div className="w-full">
                <InputText
                  // value={username}
                  onChange={(e) => HandleInput(e)}
                  influencer-affiliate
                  className="text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"
                  border={error.nameOfBusiness && `#ef4444`}
                  placeholder={t("agencyBusiness.namePlaceholder")}
                  name={"nameOfBusiness"}
                />
                {error.nameOfBusiness && (
                  <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                    {error.nameOfBusiness}
                  </label>
                )}
              </div>
            </div>
            <div className="w-full mt-[16px]">
              <textarea
                id="message"
                rows="3"
                className="w-full border-2 border-[#919EAB33] rounded-[8px] focus-visible:border-1 focus-visible:!border-[#0247ff] py-[10px] px-[14px] bg-transparent text-white font-normal text-[14px] mt-1 !placeholder-white "
                onChange={(e) => HandleInput(e)}
                placeholder={t("agencyBusiness.addressPlaceholder")}
                name={"address"}
                style={{ borderColor: error.address ? `#ef4444` : "#919EAB33" }}
              ></textarea>
              {error.address && (
                <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                  {error.address}
                </label>
              )}
            </div>
            <div className="flex gap-[16px] sm:flex-nowrap flex-wrap mt-[16px]">
              <div className="w-full">
                <InputText
                  // value={username}
                  onChange={(e) => HandleInput(e)}
                  influencer-affiliate
                  placeholder={t("agencyBusiness.phonePlaceholder")}
                  name={"phone"}
                  className="text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"
                  border={error.contact && `#ef4444`}
                  type={"number"}
                />
              </div>
              <div className="w-full">
                <InputText
                  // value={businessName}
                  onChange={(e) => HandleInput(e)}
                  className="text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"
                  placeholder={t("agencyBusiness.whatsappPlaceholder")}
                  name={"whatsapp"}
                  border={error.contact && `#ef4444`}
                  type={"number"}
                />
                {error.contact && (
                  <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                    {error.contact}
                  </label>
                )}
              </div>
            </div>
            <div className="mt-[24px] flex justify-center">
              <Button
                text={
                  !isLoading ? (
                    t("agencyBusiness.registerButton") 
                  ) : (
                    <div className="flex items-center	justify-center pt-[6px]">
                      <Loading />
                    </div>
                  )
                }
                onClick={handleRegister}
                disabled={isLoading}
                className={'max-w-[500px] mx-auto'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container flex flex-col justify-between px-0">

        <div className="py-2 flex-1 px-5">
          {/* <div className="mb-3">
            <label className="text-[18px] font-bold ml-2 text-[#02227E] flex">
              Country of Business
            </label>
            <InputText
              // value={username}
              name={"countryOfBusiness"}
              onChange={(e) => HandleInput(e)}
              influencer-affiliate
              className="text-[14px] font-normal focus-visible:border-1 focus-visible:border-[#0247ff] border border-[#919EAB33] w-[100%] rounded-[8px]"
              border={error.countryOfBusiness && `#ef4444`}
            />
            {error.countryOfBusiness && (
              <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                {error.countryOfBusiness}
              </label>
            )}
          </div> */}
          {/* <div className="mb-3">
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
          </div> */}
          {/* <div className="mb-2">
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
          </div> */}

          {/* <div className="mb-2">
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
          </div> */}

          {/* <div className="mb-2">
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
          </div> */}
        </div>

      </div>
    </>
  );
}
