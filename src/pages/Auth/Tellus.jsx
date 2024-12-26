import React from "react";
import Loading from "../../components/Loading/Index";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { HandleProfile } from "../../redux/action/Profile";

export default function Tellus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [agencyDetails, setagencyDetails] = useState({});

  const [error, setError] = useState({});
  const HandleInput = (e) => {
    setagencyDetails({ ...agencyDetails, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    // navigate("/get-vai");
    navigate("/setup-face-verification");
    setIsLoading(true);
    // Validate fields
    const validationErrors = {};
    if (!agencyDetails?.address) {
      validationErrors.address = "Address is required";
    }
    if (!agencyDetails?.phone) {
      validationErrors.phone = "Contact information is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setIsLoading(false);
      return; // Prevent form submission if there are errors
    }
    // Clear any previous errors
    setError({});

    const newBody = { ...state };
    newBody.phone = agencyDetails?.phone;
    newBody.address = agencyDetails?.address;
    newBody.userId = UserDetails?._id;

    dispatch(HandleProfile(newBody))
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          if (UserDetails?.user_type === "agency-business") {
            setIsLoading(false);
            // navigate("/get-vai");
            navigate("/setup-face-verification");
          }
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
  return (
    <div className="main-container flex flex-col justify-between px-0">
      <div className="mt-10 text-center text-[27px] font-bold mb-6">
        <span>Tell us How to find you</span>
      </div>
      <div className="form-field-container">
        <div className="py-2 flex-1 px-5">
          <div className="mb-2">
            <label className="text-[18px] mb-2 font-bold ml-2 text-[#02227E] flex">
              Address
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

          <div className="mb-10 mt-10">
            <label className="text-[18px] mb-3 font-bold ml-2 text-[#02227E] flex">
              Phone #
            </label>
            <InputText
              onChange={(e) => HandleInput(e)}
              influencer-affiliate
              placeholder={"Phone"}
              name={"phone"}
              className={"h-[50px] text-[20px] font-bold text-gray"}
              border={error.phone && `#ef4444`}
              type={"number"}
            />
            {error.phone && (
              <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
                {error.phone}
              </label>
            )}
          </div>
        </div>
        <div className="mt-1 px-5">
          <Button
            className={
              "bg-gradient-to-b mb-5 from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[26px] font-bold shadow-2xl"
            }
            text={
              !isLoading ? (
                "Next"
              ) : (
                <div className="flex items-center	justify-center pt-[6px]">
                  <Loading />
                </div>
              )
            }
            onClick={handleRegister}
            size={"45px"}
          />
        </div>
      </div>
    </div>
  );
}
