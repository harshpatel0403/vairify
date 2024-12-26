import React, { useState } from "react";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Index";
import { HandleCreateNewPost } from "../../../redux/action/MarketplaceSearch";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { HandleUser } from "../../../redux/action/Auth";
import BaseAPI from "../../../BaseAPI";

export default function PostReview() {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const fromMoment = moment(state?.date?.from, "DD/MM/YYYY");
  const toMoment = moment(state?.date?.to, "DD/MM/YYYY");
  // Format the date range as "Month Day - Day"
  const formattedDateRange =
    state?.date?.to !== "Invalid date"
      ? `${fromMoment.format("MMMM D")} - ${toMoment.format("D")}`
      : `${fromMoment.format("MMMM D")}`;

  const HandleButton = async () => {
    if (UserDetails?.tokens > 0 && state?.totalGRT > UserDetails?.tokens) {
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    if (state?.Repost) {
      state.userId = state?.userId.toString();
      state.createdAt = new Date();
      state.customCreatedAt = moment().format("DD/MM/YYYY, h:mm:ss");
      state.customUpdatedAt = moment().format("DD/MM/YYYY, h:mm:ss");
      delete state?._id;
    }
    for (const key in state) {
      if (state?.hasOwnProperty(key)) {
        if (key === "date" || key === "time") {
          const subData = state[key];
          for (const subKey in subData) {
            if (subData.hasOwnProperty(subKey)) {
              formData.append(`${key}.${subKey}`, subData[subKey]);
            }
          }
        } else {
          formData.append(key, state[key]);
        }
      }
    }
    await dispatch(HandleCreateNewPost(formData))
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setIsLoading(false);
          navigate("/marketplace/post");
        } else {
          setIsLoading(false);
          // setError(true);
          toast(result?.payload?.data?.message, {
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

  useEffect(() => {
    if (UserDetails) {
      dispatch(HandleUser(UserDetails?._id));
    }
  }, []);
  return (
    <div className="main-container pt-6 px-0 max-height-card-data mt-[-15px]">
      <div className="bg-[#040B476f] w-full py-2">
        <h3 className="text-[#040C50] text-[24px] font-bold">
          Marketplace Posts
        </h3>
      </div>
      <div className="mt-9 px-3 justify-center flex flex-col items-center">
        <div className="flex flex-col w-60">
          {state?.image && !state?.Repost ? (
            <img
              src={URL.createObjectURL(state?.image)}
              alt
              className="object-contain"
            />
          ) : (
            <img
              src={`${import.meta.env.VITE_APP_S3_IMAGE
                }/${state?.image}`}
              alt
            />
          )}
          <div className="bg-[#CCC] p-3 rounded-b-xl">
            <h5 className="leading-normal text-[16px] font-medium">
              {state?.message}
            </h5>
          </div>
        </div>
        <div>
          <h3 className="text-[24px] font-bold">Review</h3>
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="grid grid-cols-2 w-72">
            <div className="text-start">
              <h5 className="text-[16px] font-bold">Date:</h5>
            </div>
            <h5 className="text-[16px] font-medium text-start">
              {formattedDateRange}
            </h5>
          </div>
          <div className="grid grid-cols-2 w-72">
            <div className="text-start">
              <h5 className="text-[16px] font-bold">Time :</h5>
            </div>
            <h5 className="text-[16px] font-medium text-start">
              {state?.time?.from} - {state?.time?.to}
            </h5>
          </div>
          <div className="grid grid-cols-2 w-72">
            <div className="text-start">
              <h5 className="text-[16px] font-bold">Location:</h5>
            </div>
            <h5 className="text-[16px] font-medium text-start">
              {state?.location} - {state?.city}
            </h5>
          </div>
          <div className="grid grid-cols-2 w-72">
            <div className="text-start">
              <h5 className="text-[16px] font-bold">Frequency</h5>
            </div>
            <h5 className="text-[16px] font-medium text-start">
              {state?.frequency}hr Intervals
            </h5>
          </div>
        </div>

        <div className="grid mt-4 grid-cols-2 w-72">
          <div className="text-start">
            <h3 className="text-[#026EFF] text-[24px] font-bold">Total</h3>
          </div>
          <h3 className="text-[#026EFF] text-[24px] text-start font-bold">
            {state?.totalGRT}
          </h3>
        </div>
        {state?.from !== "view" && (
          <>
            <div className="grid grid-cols-2 w-72">
              <div className="text-start">
                <h3 className="text-[#026EFF] text-[24px] font-bold">
                  Credits:
                </h3>
              </div>
              <h3 className="text-[#026EFF] text-[24px] text-start font-bold">
                {UserDetails?.tokens}
              </h3>
            </div>

            <div className="flex justify-center w-full">
              <Button
                className={
                  "flex items-center mt-4 py-2 w-full max-w-[306px] my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] py-2 rounded-xl"
                }
                text={
                  !isLoading ? (
                    "Checkout"
                  ) : (
                    <div className="flex items-center justify-center pt-[6px]">
                      <Loading />
                    </div>
                  )
                }
                size="40px"
                onClick={HandleButton}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
