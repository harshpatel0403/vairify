import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Index";
import { HandleCreateNewPost } from "../../../redux/action/MarketplaceSearch";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { HandleUser } from "../../../redux/action/Auth";

export default function PostReview() {
  const { t } = useTranslation();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const fromMoment = moment(state?.date?.from, "DD/MM/YYYY");
  const toMoment = moment(state?.date?.to, "DD/MM/YYYY");

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formattedDateRange =
    state?.date?.to !== "Invalid date"
      ? state?.date?.from == state?.date?.to ? `${fromMoment.format("MMMM D")}`
        : `${fromMoment.format("MMMM D")} - ${toMoment.format("MMMM D")}`
      : `${fromMoment.format("MMMM D")}`;

  const formattedTimeRange =
    state?.time?.from && state?.time?.to
      ? `${moment.utc(state?.time?.from, "YYYY-MM-DD hh:mm A")
        .tz(userTimezone)
        .format("hh:mm A")} - 
           ${moment.utc(state?.time?.to, "YYYY-MM-DD hh:mm A")
        .tz(userTimezone)
        .format("hh:mm A")}`
      : "Invalid Time Range";

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
          navigate("/featured");
        } else {
          setIsLoading(false);
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

  const convertToLocalTime = (utcTimeStr) => {
    const [startTime, endTime] = utcTimeStr.split(' to ');

    const startTimeUTC = moment.utc(`1970-01-01 ${startTime}`, 'YYYY-MM-DD hh:mm A');
    const endTimeUTC = moment.utc(`1970-01-01 ${endTime}`, 'YYYY-MM-DD hh:mm A');

    const localStartTime = startTimeUTC.local().format('hh:mm A');
    const localEndTime = endTimeUTC.local().format('hh:mm A');

    return `${localStartTime} to ${localEndTime}`;
  };
  return (
    <div className="container mb-[48px]">
      <div>
        <h3 className="text-white text-center text-[28px] font-medium my-[48px]">
          {t("postReview.reviewPost")}
        </h3>
      </div>
      <div className="bg-white rounded-[16px] p-[24px] max-w-[500px] mx-auto">
        <div className="flex flex-col w-full">
          {state?.image && !("Repost" in state) ? (
            <img
              src={URL.createObjectURL(state?.image)}
              alt
              className="object-cover h-[180px] w-full rounded-lg"
            />
          ) : (
            <img
              className="object-cover h-[180px] w-full rounded-lg"
              src={`${import.meta.env.VITE_APP_S3_IMAGE
                }/${state?.image}`}
              alt
            />
          )}
          <div>
            <h5 className="text-[16px] font-normal text-[#919EAB] mt-[8px]">
              {state?.message}
            </h5>
          </div>
        </div>
        <div className="w-full flex flex-col items-center bg-[#919EAB29] rounded-[16px] p-[16px] mt-[24px]">
          <div className="flex itmes-center justify-between gap-2 w-full mb-[8px]">
            <div className="text-start">
              <h5 className="text-[16px] font-normal text-[#212B36] opacity-70">{t("postReview.date")}</h5>
            </div>
            <h5 className="text-[16px] font-medium text-end text-[#212B36]">
              {formattedDateRange}
            </h5>
          </div>
          <div className="flex itmes-center justify-between gap-2 w-full mb-[8px]">
            <div className="text-start">
              <h5 className="text-[16px] font-normal text-[#212B36] opacity-70">{t("postReview.time")}</h5>
            </div>
            <h5 className="text-[16px] font-medium text-end text-[#212B36]">
              {state?.Repost ? convertToLocalTime(`${state?.time?.from?.split(' ')[1]} to ${state?.time?.to?.split(' ')[1]}`)
                : state?.from == "view" ? convertToLocalTime(`${state?.time?.from} to ${state?.time?.to}`)
                  : `${formattedTimeRange}`}

            </h5>
          </div>
          <div className="flex itmes-center justify-between gap-2 w-full mb-[8px]">
            <div className="text-start">
              <h5 className="text-[16px] font-normal text-[#212B36] opacity-70">{t("postReview.location")}</h5>
            </div>
            <h5 className="text-[16px] font-medium text-end text-[#212B36]">
              {state?.city ? `${state?.location} - ${state?.city}` : state?.location}
            </h5>
          </div>
          <div className="flex itmes-center justify-between gap-2 w-full mb-[8px]">
            <div className="text-start">
              <h5 className="text-[16px] font-normal text-[#212B36] opacity-70">{t("postReview.frequency")}</h5>
            </div>
            <h5 className="text-[16px] font-medium text-end text-[#212B36]">
              {state?.frequency}hr Intervals
            </h5>
          </div>
        </div>

        <div className="w-full flex items-center justify-between bg-[#919EAB29] rounded-[16px] p-[16px] mt-[24px]">
          <div>
            <h3 className="text-[16px] font-medium text-[#212B36]">{t("postReview.total")}</h3>
          </div>
          <h3 className="text-[16px] font-medium text-end text-[#212B36]">
            {state?.totalGRT}
          </h3>
        </div>
        {state?.from !== "view" && (
          <>
            <div className="w-full flex items-center justify-between bg-[#919EAB29] rounded-[16px] p-[16px] my-[24px]">
              <div>
                <h3 className="text-[16px] font-medium text-[#212B36]">
                  {t("postReview.credits")}
                </h3>
              </div>
              <h3 className="text-[16px] font-medium text-end text-[#212B36]">
                {UserDetails?.tokens}
              </h3>
            </div>

            <div className="flex justify-center w-full max-w-[500px] mx-auto">
              <Button
                className={'secondary-btn'}
                text={
                  !isLoading ? (
                    t("postReview.checkout")
                  ) : (
                    <div className="flex items-center justify-center">
                      <Loading />
                    </div>
                  )
                }
                onClick={HandleButton}
                disabled={isLoading}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
