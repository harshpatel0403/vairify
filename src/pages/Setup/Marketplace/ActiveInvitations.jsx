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
} from "../../../redux/action/MarketplaceSearch";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";

export default function ActiveInvitation() {
  const { state } = useLocation();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false); // State to track loading

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
  return (
    <div
      className="main-container py-0 px-5 min-[385px]:px-7"
      style={{ maxHeight: "calc(100vh - 160px)" }}
    >
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="w-full mx-auto flex flex-row justify-between items-start mt-2">
          <div className="flex flex-col items-center justify-center">
            <div>
              <span className="text-[18px] text-[#040C50] font-extrabold">
                VAI
                <span className="text-[18px] text-[#040C50] font-semibold">
                  RIFY ID
                </span>
              </span>
            </div>
            <div>
              <span className="text-[15px] text-[#040C50] font-bold">
                {state?.userId?.vaiID}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative z-[5000000000]">
            <div
              style={{ left: "10px", bottom: "72px" }}
              className="absolute w-full h-full rounded-full"
            >
              <img
                className="w-[120px] h-[120px] bg-[#fff] rounded-full border-2 overflow-hidden"
                src={
                  state?.userId?.profilePic !== ""
                    ? `${import.meta.env.VITE_APP_S3_IMAGE}/${
                        state?.userId?.profilePic
                      }`
                    : state?.userId?.gender === "Male"
                    ? "/images/male.png"
                    : "/images/female.png"
                }
                // src={
                //   state?.userId?.profilePic !== ""
                //     ? `${import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL}/${
                //         state?.userId?.profilePic
                //       }`
                //     : state?.userId?.gender === "Male"
                //     ? "/images/male.png"
                //     : "/images/female.png"
                // }
                alt={state?.userId?.name}
              />
            </div>
            <div style={{ right: "0px", top: "25px" }} className="absolute">
              <img
                src={import.meta.env.BASE_URL + "images/SugarIcon2.png"}
                alt="Sugar Icon Second"
              />
            </div>
          </div>
          <div>
            <div>
              <span className="text-[18px] text-[#040C50] font-bold">
                TruRevu
              </span>
            </div>
            <div className="flex flex-row justify-center items-center">
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <span className="text-[15px] text-[#040C50] font-bold">5.0</span>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col justify-center items-center mt-0">
          <span className="font-bold text-[24px]">{state?.userId?.name}</span>
        </div>
        <div className="w-[100vw] flex flex-col justify-center items-center mt-2 bg-[#797E9E] py-2 h-[51px]">
          <span className="font-bold text-[26px] text-[#040C50]">
            Active Invitations
          </span>
        </div>
        <div className="inner-content-part-country w-full">
          <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
            <div className="w-full mx-auto flex flex-row justify-center items-center">
              <span className="font-extrabold text-[16px]">
                {state?.status} invitation
              </span>
            </div>
            <div className="w-full mx-auto flex flex-row justify-start gap-5 items-center px-5 mt-2">
              <div>
                <span className="font-bold text-[14px] text-[#0247FF]">
                  Date/Time
                </span>
              </div>
              <div>
                <span className="font-normal text-[14px]">
                  {moment(state?.createdAt).format("DD/mm/yy")} at{" "}
                  {state?.invitationtime?.from} - {state?.invitationtime?.to}
                </span>
              </div>
            </div>
            <div
              style={{ border: "1px solid white" }}
              className="w-full mt-2"
            ></div>
            <div className="w-full mx-auto flex flex-row justify-between items-center px-2 mt-2">
              <div className="flex flex-row justify-center items-center">
                <div>
                  <span className="font-bold text-[16px] text-[#0247FF] mr-2">
                    Service
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[14px]">
                    {state?.service}
                  </span>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center">
                <div>
                  <span className="font-bold text-[14px] text-[#0247FF] mr-2">
                    Duration
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[14px]">
                    {hours} hr {minutes} m
                  </span>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center">
                <div>
                  <span className="font-bold text-[14px] text-[#0247FF] mr-2">
                    Rate
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[14px]">
                    ${state?.priceoffered}
                  </span>
                </div>
              </div>
            </div>
            <div
              style={{ border: "1px solid white" }}
              className="w-full mt-2"
            ></div>
            <div className="w-full mx-auto flex flex-row justify-start gap-5 items-center px-5 mt-2">
              <div>
                <span className="font-bold text-[14px] text-[#0247FF]">
                  Service
                </span>
              </div>
              <div>
                <span className="font-bold text-[14px]">
                  {state?.advancedservices?.join(", ")}
                </span>
              </div>
            </div>
            <div
              style={{ border: "1px solid white" }}
              className="w-full mt-2"
            ></div>
            <div className="w-full mx-auto flex flex-row justify-start gap-5 items-center px-5 mt-2">
              <div>
                <span className="font-bold text-[14px] text-[#0247FF]">
                  {state?.venue}
                </span>
              </div>
              <div>
                <span className="font-bold text-[14px]">
                  1439 Inverness Miami FI 34598
                </span>
              </div>
            </div>
            <div
              style={{ border: "1px solid white" }}
              className="w-full mt-2"
            ></div>
          </div>
          <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
            <div className="w-full mx-auto flex flex-row justify-start items-center">
              <span className="font-extrabold text-[13.68px]">
                Hot Rod Details
              </span>
            </div>
            <div className="w-full mx-auto flex flex-row justify-between items-center px-2 mt-2 mb-2">
              <div>
                <span className="font-bold text-[16px] text-[#0247FF]">
                  Gender
                </span>
              </div>
              <div>
                <span className="font-bold text-[16px]">{state?.gender}</span>
              </div>
            </div>
            <div
              style={{ border: "1px solid white" }}
              className="w-full mt-2"
            ></div>
            <div className="w-full mx-auto flex flex-row justify-between items-center px-2 mt-2">
              <div>
                <span className="font-bold text-[16px] text-[#0247FF]">
                  VAI<span className="logoSetupweight">RIFY ID</span>
                </span>
              </div>
              <div>
                <span className="font-bold text-[17px] text-[#0247FF]">
                  ID# {state?.userId?.vaiID}
                </span>
              </div>
            </div>
            <div
              style={{ border: "1px solid white" }}
              className="w-full mt-2"
            ></div>
            <div className="w-full mx-auto flex flex-row justify-between items-center px-2 mt-2">
              <div>
                <span className="font-extrabold text-[16px] text-[#0247FF] uppercase">
                  VAI<span className="logoSetupweight">RIDATE</span> #
                </span>
              </div>
              <div>
                <span className="font-bold text-[16px] text-[#0247FF]">
                  0046893490
                </span>
              </div>
            </div>
            <div
              style={{ border: "1px solid white" }}
              className="w-full mt-2"
            ></div>
            <div className="w-full mx-auto flex flex-row justify-between items-center px-2 mt-2">
              <div>
                <span className="font-extrabold text-[12.83px]">
                  Total offered for this appointment.
                </span>
              </div>
              <div>
                <span className="font-bold text-[16px]">
                  ${state?.priceoffered}
                </span>
              </div>
            </div>
          </div>
          {status === "pending" &&
            (state?.client ? (
              <div className="w-full mx-auto flex flex-row justify-center items-center mt-7 mb-4">
                <Button
                  className={
                    "flex items-center w-fit mt-4 py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] py-2 rounded-xl "
                  }
                  size="36px"
                  bgColor={"[#02227E]"}
                  onClick={HandleAccept}
                  text={
                    !isLoading ? (
                      "Accept and Send Profile"
                    ) : (
                      <div className="flex items-center	justify-center pt-[6px]">
                        <Loading />
                      </div>
                    )
                  }
                />
              </div>
            ) : (
              <div className="w-full mx-auto flex flex-row justify-center items-center mt-7 mb-4">
                <Button
                  text="View Results"
                  className={
                    "rounded-[20px] bg-[#02227E] border-2 border-[#02227E] font-bold text-[26px] text-white w-[70%] text-center "
                  }
                  size="36px"
                  bgColor={"[#02227E]"}
                  onClick={HandleResult}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
