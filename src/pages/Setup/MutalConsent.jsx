/* eslint-disable react/no-unescaped-entities */
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import UserService from "../../services/userServices";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { HandleUser } from "../../redux/action/Auth";
import Header from "../../components/Header/Header";
import Loading from "../../components/Loading/Index";
import LayoutHeader from "../layout/Header";
import PageTitle from "../../components/PageTitle";

const MutalConsent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [isChecked, setIsChecked] = useState(false);
  const { state } = useLocation();

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
        navigate(-1);
        dispatch(HandleUser(UserData?._id));
        toast.success("Contract signed successfully")
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
    <>
      <div className="container">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"Consent Contract"} />
        </div>
        <div className="max-w-[600px] mx-auto">

          <div>
            <p className="p-6 w-full max-w-full border-t-[12px] border-b-[12px] border-[#fff] bg-white text-center text-black font-medium text-sm rounded-[16px]" >
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
          <div className="pb-2 sm:mt-10 mt-5">
            <div className="flex items-start justify-start">
              <div>
                <input
                  type="checkbox"
                  className="mr-4 appearance-none h-[18px] w-[18px] border border-[#FFFFFF] rounded-[4px] focus:outline-none checked:bg-white checked:border-white relative checked:before:content-[' '] checked:before:bg-[url('/images/login/checked.svg')] checked:before:bg-cover checked:before:bg-center checked:before:h-[18px] checked:before:w-[18px] checked:before:absolute checked:before:left-[-1px] checked:before:top-[-1px] transition transition-all duration-300"
                  onChange={(e) => setIsChecked(e.target.checked)}
                  checked={isChecked}
                />
              </div>
              <label className="text-sm font-normal text-white opacity-[0.7]">
                I agree to sign this contract electronically with my Vairify #
                <span className="underline"> {UserData?.vaiID}</span>
              </label>
            </div>
            {error.isChecked && (
              <label className="text-red-500 text-sm flex items-baseline pl-[12px] pt-[2px]">
                {error.isChecked}
              </label>
            )}
            <div className="">
              <Button
                className={` ${!isChecked
                  ? "opacity-[0.8] cursor-not-allowed"
                  : ""
                  } my-[48px]`}
                text={loading ? <Loading /> : "Next >"}
                disabled={!isChecked}
                onClick={HandleOnClick}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MutalConsent;
