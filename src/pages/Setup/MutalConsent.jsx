/* eslint-disable react/no-unescaped-entities */
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import UserService from "../../services/userServices";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { HandleUser } from "../../redux/action/Auth";

const MutalConsent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  useEffect(() => {
    if (isChecked) {
      dispatch(HandleUser(UserData._id));
    }
  }, [isChecked]);

  const HandleOnClick = async () => {
    setLoading(true);
    try {
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

      await UserService.signContract(UserData?._id).then((response) => {
        navigate("/setup");
        dispatch(HandleUser(UserData?._id));
      })
        .catch((err) => {
          toast(err?.response?.data?.error, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "error",
          });
          console.error(err, "Error");
          navigate(-1);
        });


    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="main-container flex flex-col justify-start">
      <div className="w-full flex items-center justify-center pt-5 pb-3">
        <h2 className="text-[18px] md:text-[22px] text-blue-700 font-extrabold whitespace-nowrap">
          Mutual Consent Contract
        </h2>
      </div>

      <div className="wx-full py-2 mx-auto">
        <p
          className="font-bold px-4 w-full max-w-full border-t-[12px] border-b-[12px] border-[#fff]"
          style={{
            overflowY: "auto",
            fontSize: 10.8,
            textAlign: "center",
            backgroundColor: "rgb(255 255 255 / 100%)",
            borderRadius: 0,
            minHeight: "calc(100vh - 450px)",
            maxHeight: "calc(100vh - 500px)",
          }}
        >
          <b className="text-[16px] my-2 flex justify-center">
            Welcome to Vairify.Date
          </b>
          <br />
          These Terms and Conditions constitute a legally binding agreement made
          between you, whether personally or on behalf of an entity (“you”) and
          Vairify.Date ("Company", “we”, “us”, or “our”), concerning your access
          to and use of the Vairify.Date website as well as any other media
          form, media channel, mobile website or mobile application related,
          linked, or otherwise connected thereto (collectively, the “Site”). You
          agree that by accessing the Site, you have read, understood, and
          agreed to be bound by all of these Terms and Conditions.
          <br />
          <br />
          Supplemental terms and conditions or documents that may be posted on
          the Site from time to time are hereby expressly incorporated herein by
          reference. We will alert you about any changes by updating the “Last
          updated” date of these Terms and Conditions, and you waive any right
          to receive specific notice of each such change. It is your
          responsibility to periodically review these Terms and Conditions to
          stay informed of updates. You will be subject to and will be deemed to
          have been made aware of and to have accepted, the changes in any
          revised Terms and Conditions by your continued use of the Site after
          the date such revised Terms and Conditions are posted. These Terms and
          Conditions constitute a legally binding agreement made between you,
          whether personally or on behalf of an entity (“you”) and Vairify.Date
          ("Company", “we”, “us”, or “our”), concerning your access to and use
          of the Vairify.Date website as well as any other media form, media
          channel, mobile website or mobile application related, linked, or
          otherwise connected thereto (collectively, the “Site”). You agree that
          by accessing the Site, you have read, understood, and agreed to be
          bound by all of these Terms and Conditions. Supplemental terms and
          conditions or documents that may be posted on the Site from time to
          time are hereby expressly incorporated herein by reference. We reserve
          the right, in our sole discretion, to make changes or modifications to
          these Terms and Conditions at any time and for any reason. We will
          alert you about any changes by updating the “Last updated” date of
          these Terms and Conditions, and you waive any right to receive
          specific notice of each such change. It is your responsibility to
          periodically review these Terms and Conditions to stay informed of
          updates. You will be subject to and will be deemed to have been made
          aware of and to have accepted, the changes in any revised Terms and
          Conditions by your continued use of the Site after the date such
          revised Terms and Conditions are posted. The information provided on
          the Site is not intended for distribution to or use by any person or
          entity in any y jurisdiction
        </p>
      </div>
      <div className="pb-2 mt-10">
        <div className="flex items-center justify-start">
          <input
            type="checkbox"
            className="form-checkbox text-indigo-600 h-[40px] w-[40px] focus:outline-none md:h-[20px] sm:w-[20px]"
            onChange={(e) => setIsChecked(e.target.checked)}
            checked={isChecked}
          />
          <label className="ml-4 block font-black text-[16px] text-left mt-2">
            I agree to sign this contract electronically with my Vairify #
            ___________
          </label>
        </div>
        {error.isChecked && (
          <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
            {error.isChecked}
          </label>
        )}
        <div className="">
          <Button
            className={`flex items-center justify-center ${!isChecked
              ? "bg-[#aaa]"
              : "bg-gradient-to-b from-[#0CA36C] to-[#08FA5A]"
              } text-[#01195C] font-bold text-[26px] py-2 my-4 mt-10 max-w-[400px] mx-auto`}
            text={loading ? "Please wait..." : "Next >"}
            disabled={!isChecked}
            onClick={HandleOnClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MutalConsent;
