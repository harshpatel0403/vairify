import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleEditMarketPlace,
  HandleResultMarketPlace,
  HandleMyInvitation,
  HandleUpdateInvitationStatus,
} from "../../../redux/action/MarketplaceSearch";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
import PageTitle from "../../../components/PageTitle";

export default function ActiveInvitation() {
  const { state } = useLocation();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const startTime = moment(state?.invitationtime.from, "hh:mm A");
  const endTime = moment(state?.invitationtime.to, "hh:mm A");
  // Calculate the duration between the two moments
  const duration = moment.duration(endTime.diff(startTime));
  const hours = duration.hours();
  const minutes = duration.minutes();

  const HandleResult = async () => {
    await dispatch(HandleResultMarketPlace(state?._id, "accept"));
    navigate("/results");
  };

  const HandleAccept = async () => {
    setIsLoading(true);
    // const inviteeId = state.invitee.filter((a) => a?.id === UserDetails?._id);
    const body = {
      inviteeId: UserDetails?._id,
      inviteeStatus: "accept",
    };
    await dispatch(HandleEditMarketPlace(state?._id, body))
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          setIsLoading(false);
          navigate("/marketplace/invitation");
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err, "Error");
      });
  };

  var status = "";
  console.log("innnn", state?.invitee);
  state?.invitee?.map((invitee) => {
    if (invitee.id === UserDetails._id) {
      status = invitee.status;
    }
  });

  const handleCancelInvite = (invitationId) => {
    setCancelLoading(true);
    const userId = UserDetails?._id;
    dispatch(HandleUpdateInvitationStatus(invitationId, userId, "cancel"));
    dispatch(HandleMyInvitation(UserDetails?._id));
    navigate("/marketplace/invitation");
    setCancelLoading(false);
  };

  console.log(state, '<======')


  return (
    <div
      className="container pb-[48px]"
    >
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={`${state?.status} invitation`} />
      </div>
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="w-full flex flex-row sm:justify-around justify-between items-end mt-[60px] sm:p-[16px] sm:bg-[#FFFFFF0A] rounded-[16px]">
          <div className="flex flex-col items-center justify-center sm:min-w-[120px] min-w-[80px]">
            <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
              VAIRIFY ID
            </div>
            <div className="font-bold sm:text-lg text-base text-white uppercase">
              {state?.userId?.vaiID}
            </div>
          </div>
          <div className=" relative">
            <div
              className="sm:h-[120px] h-[80px] sm:w-[120px] w-[80px] rounded-full mt-[-74px] relative flex justify-center"
            >
              <img
                className="sm:w-[120px] w-[80px] sm:h-[120px] h-[80px] bg-[#fff] rounded-full border-2 overflow-hidden"
                src={
                  state?.userId?.profilePic !== ""
                    ? `${import.meta.env.VITE_APP_S3_IMAGE}/${state?.userId?.profilePic
                    }`
                    : state?.userId?.gender === "Male"
                      ? "/images/male.png"
                      : "/images/female.png"
                }
                alt={state?.userId?.name}
              />
              <div style={{ right: "0px", bottom: "0px" }} className="absolute">
                <img
                  src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
                  alt="Sugar Icon Second"
                />
              </div>
            </div>
            <div className="flex-col flex justify-center items-center mt-[24px]">
              <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
                Name
              </div>
              <span className="font-bold sm:text-lg text-base text-white">
                {state?.userId?.name}
              </span>
            </div>
          </div>
          <div className="leading-[18px] sm:min-w-[120px] min-w-[80px] flex flex-col justify-center items-center">
            <div className="text-white font-normal sm:text-base text-sm opacity-[0.6]">
              TruRevu
            </div>
            <div className="flex justify-center items-center gap-1">
              <div className="sm:text-lg text-base text-white font-bold ">
                {state?.userId?.averageRating}
              </div>
              <img src="/images/home/star.svg" alt="star" />
            </div>
          </div>
        </div>

        <div className="my-[24px] flex justify-between items-center w-full gap-3">
          <div className="text-lg text-white font-medium">
            Invitation Details
          </div>
          <div className={`py-[2px] px-[6px] rounded-[8px] text-sm font-bold ${state?.status === "pending" ? "text-[#0085B9] bg-[#0085B929]" : "text-[#008F34] bg-[#008F3429]"}`}>
            {state?.status} invitation
          </div>
        </div>

        <div className="bg-[#FFFFFF14] rounded-[16px] w-full p-[16px]">
          <div className="flex justify-between gap-2 items-center">
            <div className="text-white opacity-[0.6] font-normal text-base">Date/Time</div>
            <p className="text-white font-medium text-base">{moment(state?.createdAt).format("DD/mm/yy")} at{" "}
              {state?.invitationtime?.from} - {state?.invitationtime?.to}</p>
          </div>
          <div className="flex justify-between gap-2 items-center mt-[8px]">
            <div className="text-white opacity-[0.6] font-normal text-base">Services</div>
            <p className="text-white font-medium text-base"> {state?.service}</p>
          </div>
          <div className="flex justify-between gap-2 items-center mt-[8px]">
            <div className="text-white opacity-[0.6] font-normal text-base">Durations</div>
            <p className="text-white font-medium text-base">{hours} hr {minutes} m</p>
          </div>
          <div className="flex justify-between gap-2 items-center mt-[8px]">
            <div className="text-white opacity-[0.6] font-normal text-base">Rate</div>
            <p className="text-white font-medium text-base"> ${state?.priceoffered}</p>
          </div>
          <div className="flex justify-between gap-2 items-center mt-[8px]">
            <div className="text-white opacity-[0.6] font-normal text-base">Extra’s</div>
            <p className="text-white font-medium text-base">{state?.advancedservices?.length ? state.advancedservices.join(", ") : "-"}</p>
          </div>
          <div className="flex justify-between gap-2 items-center mt-[8px]">
            <div className="text-white opacity-[0.6] font-normal text-base">Outcall</div>
            <p className="text-white font-medium text-base">
              1439 Inverness Miami FI 34598
              {/* was static  */}
            </p>
          </div>
        </div>

        <div className="my-[24px] w-full">
          <div className="text-lg text-white font-medium text-left">
            More Details
          </div>
        </div>

        <div className="bg-[#FFFFFF14] rounded-[16px] w-full p-[16px]">
          <div className="flex justify-between gap-2 items-center">
            <div className="text-white opacity-[0.6] font-normal text-base">Gender</div>
            <p className="text-white font-medium text-base">{state?.gender}</p>
          </div>
          <div className="flex justify-between gap-2 items-center mt-[8px]">
            <div className="text-white opacity-[0.6] font-normal text-base">VAIRIFY ID</div>
            <p className="text-white font-medium text-base upppercase">{state?.userId?.vaiID}</p>
          </div>
          <div className="flex justify-between gap-2 items-center mt-[8px]">
            <div className="text-white opacity-[0.6] font-normal text-base">VAIRIDATE</div>
            <p className="text-white font-medium text-base">
              0046893490
              {/* was static  */}
            </p>
          </div>
          <div className="flex justify-between gap-2 items-center mt-[8px]">
            <div className="text-white opacity-[0.6] font-normal text-base">Total Offered for this appointment</div>
            <p className="text-white font-medium text-base">
              ${state?.priceoffered}
            </p>
          </div>
        </div>


        {/* old */}

        <div className="w-full mt-[24px]">
          {status === "pending" &&
            (state?.client ? (
              <div className="w-full mx-auto flex flex-row justify-center items-center gap-[8px]">
                <Button
                  size="48px"
                  disabled={isLoading}
                  onClick={HandleAccept}
                  text={
                    !isLoading ? (
                      "Accept and Send Profile"
                    ) : (
                      <Loading />
                    )
                  }
                  className={'secondary-btn !bg-[#008F34] hover:!bg-[#1ba44d]'}
                />
                <Button
                  size="48px"
                  disabled={cancelLoading}
                  onClick={() => handleCancelInvite(state._id)}
                  text={
                    !cancelLoading ? (
                      "Cancel"
                    ) : (
                      <Loading />
                    )
                  }
                  className={'!bg-transparent secondary-btn border-2 border-[#919EAB33] hover:!bg-[#919EAB33] py-[4px]'}
                />
              </div>
            ) : (
              <div className="w-full mx-auto flex flex-row justify-center items-center mt-7 mb-4">
                <Button
                  text="View Results"

                  size="48px"
                  onClick={HandleResult}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
