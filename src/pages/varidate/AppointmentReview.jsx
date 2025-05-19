import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { combineDateTime } from "../../utils";
import { useSelector } from "react-redux";
import VaridateService from "../../services/VaridateServices";
import PageTitle from "../../components/PageTitle";

export default function AppointmentReview() {
  const navigate = useNavigate();
  const [varidateData, setVaridateData] = useState({});
  const [loading, setLoading] = useState(false);

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const location = useLocation();
  useEffect(() => {
    if (location?.state) {
      setVaridateData({ ...location?.state });
    }
  }, [location]);

  const handleSubmit = async () => {
    let payload = {
      startDateTime: combineDateTime(
        varidateData?.date,
        varidateData?.selectedSlot?.split(" - ")?.[0]
      ),
      endDateTime: combineDateTime(
        varidateData?.date,
        varidateData?.selectedSlot?.split(" - ")?.[1]
      ),
      duration: varidateData?.hours?.time * 60,
      // service: "Escort",
      extras: varidateData?.extraServices?.map((item) => {
        let itemCopy = { ...item, serviceId: item?._id };
        delete itemCopy._id;
        return itemCopy;
      }),
      type: varidateData?.type,
      clientId: UserData?._id,
      companionId: varidateData?.companionData?._id,
      clientStatus: "Requested",
      companionStatus: "Pending",
      message: varidateData?.message,
      service: varidateData?.service,
      location: varidateData?.country,
      agreedPrice:
        parseFloat(varidateData?.hours?.[varidateData?.type?.toLowerCase()]) +
        varidateData?.extraServices
          ?.map((item) => parseFloat(item?.amount))
          ?.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          ),
    };
    // console.log(payload, ' <=== varidate data...')
    // return
    navigate("/varidate/face-verification", { state: payload });
  };

  return (
    <div
      className="container"
    >
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle isSmall={true} title={"Appointment Review"} />
      </div>
      <div>
        <div className="mx-auto flex flex-col justify-around items-center mt-7 w-full p-4 rounded-xl bg-[#FFFFFF14] gap-2">
          <div className="w-full mx-auto flex flex-row justify-between items-center">
            <div className="sm:text-base text-sm text-white opacity-[0.6] font-normal">
              Type
            </div>
            <div className="sm:text-base text-sm text-white opacity font-semibold">
              invitation
            </div>
          </div>
          <div className="w-full mx-auto flex flex-row justify-between items-center">
            <div className="sm:text-base text-sm text-white opacity-[0.6] font-normal">
              Date
            </div>
            <div className="sm:text-base text-sm text-white opacity font-semibold">
              {moment(varidateData?.date).format("DD/MM/YYYY")}
            </div>
          </div>
          <div className="w-full mx-auto flex flex-row justify-between items-center">
            <div className="sm:text-base text-sm text-white opacity-[0.6] font-normal">
              Service
            </div>
            <div className="sm:text-base text-sm text-white opacity font-semibold">
              Escort
            </div>
          </div>
          <div className="w-full mx-auto flex flex-row justify-between items-center">
            <div className="sm:text-base text-sm text-white opacity-[0.6] font-normal">
              Appt length
            </div>
            <div className="sm:text-base text-sm text-white opacity font-semibold">
              {varidateData?.hours?.value}
            </div>
          </div>
          <div className="w-full mx-auto flex flex-row justify-between items-center">
            <div className="sm:text-base text-sm text-white opacity-[0.6] font-normal">
              Date location
            </div>
            <div className="sm:text-base text-sm text-white opacity font-semibold">
              {varidateData?.type}
            </div>
          </div>
          <div className="w-full mx-auto flex flex-row justify-between items-center">
            <div className="sm:text-base text-sm text-white opacity-[0.6] font-normal">
              City
            </div>
            <div className="sm:text-base text-sm text-white opacity font-semibold">
              {varidateData?.country?.city}
            </div>
          </div>
          <div className="w-full mx-auto flex flex-row justify-between items-center">
            <div className="sm:text-base text-sm text-white opacity-[0.6] font-normal">
              Agreed price
            </div>
            <div className="sm:text-base text-sm text-white opacity font-semibold">
              {parseFloat(
                varidateData?.hours?.[varidateData?.type?.toLowerCase()]
              ) +
                varidateData?.extraServices
                  ?.map((item) => parseFloat(item?.amount))
                  ?.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue,
                    0
                  )}
            </div>
          </div>
        </div>
        <div className="sm:mt-[24px] mt-[16px] ">

          <div className="w-full mx-auto flex flex-col justify-center items-center">
            <textarea
              onChange={(e) =>
                setVaridateData((prevValue) => ({
                  ...prevValue,
                  message: e.target.value,
                }))
              }
              // influencer-affiliate
              // placeholder={"Phone"}
              // name={"phone"}
              className="w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px] !placeholder-white"
              placeholder="Special Request/Message"
              // border={}
              rows={"4"}
              value={varidateData?.message}
            />
          </div>
        </div>
        <div className="flex sm:gap-[24px] gap-[16px] sm:mt-[24px] mt-[16px] mb-[48px] sm:flex-nowrap flex-wrap">

          <Button
            text={"Vairify"}
            onClick={() => handleSubmit()}
          />
          <Button
            text={"Review Services and Extras"}
            className={'secondary-btn !bg-[#FFFFFF29]'}
            onClick={() => navigate(-1)}
          />
        </div>
      </div>
    </div>
  );
}
