/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const UserData = useSelector((state) => state?.Auth?.Auth?.data);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState({});
  const HandleOnClick = () => {
    const validationErrors = {};

    if (!isChecked) {
      validationErrors.isChecked = "Terms and conditions is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return; // Prevent form submission if there are errors
    }
    // Clear any previous errors
    setError({});
    if (UserData?.user?.user_type === "agency-business") {
      navigate("/bussiness-vai");
    } else {
      navigate("/subscription", {
        state: {
          AdditionalVerification: "",
          totalAmount: 149,
        },
      });
    }
  };
  return (
    <div
      className="bg-[#B9BBCB] flex items-center rounded-3xl"
      style={{ maxHeight: "calc(100vh - 149px)" }}
    >
      <div className="main-container flex flex-col justify-start">
        <div className="w-full flex items-center justify-center pt-10 pb-5">
          <h2 className="text-[18px] text-[#040b47] md:text-[22px] text-blue-700 font-extrabold whitespace-nowrap">
            TERMS AND CONDITIONS
          </h2>
        </div>

        <div className="w-full flex-1 px-4 py-2 mb-4 mx-auto">
          <div
            className="w-full overflow-y-auto font-bold min-h-[calc(100vh-450px)]"
            style={{
              fontSize: 10.8,
              textAlign: "justify",
              height: "22rem",
              backgroundColor: "",
              borderRadius: 0,
            }}
          >
            <p className="max-w-full px-0 text-[#000]">
              Welcome to <span className="font-extrabold uppercase">Vai<span className="logoSetupweight">rify</span></span>.Date
              <br />
              <br />
              These Terms and Conditions constitute a legally binding agreement
              made between you, whether personally or on behalf of an entity
              (“you”) and <span className="font-extrabold uppercase">Vai<span className="logoSetupweight">rify</span></span>.Date ("Company", “we”, “us”, or “our”),
              concerning your access to and use of the <span className="font-extrabold uppercase">Vai<span className="logoSetupweight">rify</span></span>.Date website as
              well as any other media form, media channel, mobile website or
              mobile application related, linked, or otherwise connected thereto
              (collectively, the “Site”). You agree that by accessing the Site,
              you have read, understood, and agreed to be bound by all of these
              Terms and Conditions.
              <br />
              <br />
              Supplemental terms and conditions or documents that may be posted
              on the Site from time to time are hereby expressly incorporated
              herein by reference. We will alert you about any changes by
              updating the “Last updated” date of these Terms and Conditions,
              and you waive any right to receive specific notice of each such
              change. It is your responsibility to periodically review these
              Terms and Conditions to stay informed of updates. You will be
              subject to and will be deemed to have been made aware of and to
              have accepted, the changes in any revised Terms and Conditions by
              your continued use of the Site after the date such revised Terms
              and Conditions are posted. These Terms and Conditions constitute a
              legally binding agreement made between you, whether personally or
              on behalf of an entity (“you”) and <span className="font-extrabold uppercase">Vai<span className="logoSetupweight">rify</span></span>.Date ("Company", “we”,
              “us”, or “our”), concerning your access to and use of the
              <span className="font-extrabold uppercase">Vai<span className="logoSetupweight">rify</span></span>.Date website as well as any other media form, media
              channel, mobile website or mobile application related, linked, or
              otherwise connected thereto (collectively, the “Site”). You agree
              that by accessing the Site, you have read, understood, and agreed
              to be bound by all of these Terms and Conditions. Supplemental
              terms and conditions or documents that may be posted on the Site
              from time to time are hereby expressly incorporated herein by
              reference. We reserve the right, in our sole discretion, to make
              changes or modifications to these Terms and Conditions at any time
              and for any reason. We will alert you about any changes by
              updating the “Last updated” date of these Terms and Conditions,
              and you waive any right to receive specific notice of each such
              change. It is your responsibility to periodically review these
              Terms and Conditions to stay informed of updates. You will be
              subject to and will be deemed to have been made aware of and to
              have accepted, the changes in any revised Terms and Conditions by
              your continued use of the Site after the date such revised Terms
              and Conditions are posted. The information provided on the Site is
              not intended for distribution to or use by any person or entity in
              any y jurisdiction
            </p>
          </div>
        </div>
        <div className="pb-4 mx-0 px-4">
          <div className="flex items-center justify-left mb-1 relative">
            <input
              type="checkbox"
              className="form-checkbox text-indigo-600 h-[28px] w-[28px] focus:outline-none accent-[#50d71e]"
              onChange={(e) => setIsChecked(e.target.checked)}
              checked={isChecked}
            />
            <label className="ml-4 block font-black text-[12px] text-left text-[#000]">
              I have read the terms and conditions, cookie, and privacy policies
            </label>
          </div>
          {error.isChecked && (
            <label className="text-red-500 text-sm flex items-baseline">
              {error.isChecked}
            </label>
          )}
          <div>
            <Button
              className={
                "w-auto flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] mt-7 max-w-[400px] mx-auto"
              }
              text={"Next >"}
              size="55px"
              onClick={HandleOnClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
