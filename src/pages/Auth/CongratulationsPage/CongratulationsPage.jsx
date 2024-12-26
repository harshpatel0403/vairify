import React, { useState } from "react";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import UserService from "../../../services/userServices";
import Loading from "../../../components/Loading/Index";

export default function CongratulationsPage() {
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [betaTesterCheck, setBetaTesterCheck] = useState(true);
  const [notifyReleaseCheck, setNotifyReleaseCheck] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await UserService.updateUserPreferences(UserData?._id, {
        isBetaTester: betaTesterCheck,
        notifyOnRelease: notifyReleaseCheck
      })
      toast.success("Preference saved!")
      navigate("/setup-face-verification");
      // navigate("/get-vai");
      // navigate("/setup");
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setLoading(false)
    }
  };
  return (
    <div className="main-container flex flex-col justify-between">
      <div className="mt-7 mx-auto">
        <div className="">
          <img src={"/images/congratulations.png"} alt="Congratulations" style={{ width: '70%' }} className="mx-auto" />
        </div>
      </div>
      <div className="flex-1 mx-auto py-2">
        <div className="flex flex-col justify-center items-center mb-custom-19">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-[27px] font-bold mr-2">Congratulations!</h2>
            <h2 className="text-[18px] font-bold">{UserData?.name}</h2>
          </div>
          <span className="text-[14.4px] font-bold mb-2">
            Your registration was successful.
          </span>
          <span className="description-congratulated text-[14.4px]">
            You are now a founding member of the most advanced sex work
            community in the world. Explore all the amazing features within this
            incredible app. Simply check the boxes below, and we will keep you
            informed
          </span>
        </div>
        <div className="mt-8 mb-4">
          <label className="flex justify-start items-center text-gray-500 font-bold">
            <input
              className="w-[20px] h-[20px] mr-4 bg-gray-300"
              type="checkbox"
              checked={betaTesterCheck}
              onChange={() => setBetaTesterCheck(!betaTesterCheck)}
            />
            <span className="text-[14.4px] font-bold text-black">
              Yes,want to be a Final stage Beta Tester
            </span>
          </label>
        </div>
        <div className="mb-4">
          <label className="flex justify-start items-center text-gray-500 font-bold">
            <input
              className="w-[20px] h-[20px] mr-4 bg-gray-300"
              type="checkbox"
              checked={notifyReleaseCheck}
              onChange={() => setNotifyReleaseCheck(!notifyReleaseCheck)}
            />
            <span className="text-[14.4px] font-bold text-black">
              Notify me when the app is released
            </span>
          </label>
        </div>
      </div>
      <div className="mb-6 justify-center max-w-[350px] form-field-container">
        <Button
          className="flex items-center justify-center font-bold bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
          size="45px"
          text={
            loading ?
              <div className="flex items-center	justify-center pt-[6px]">
                <Loading />
              </div>
              :
              "Explore"
          }
          onClick={() => handleSubmit()}
          disabled={loading}
        />
      </div>
    </div>
  );
}
