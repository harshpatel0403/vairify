import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { combineDateTime } from "../../utils";
import { useSelector } from "react-redux";
import VaridateService from "../../services/VaridateServices";

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
      className="main-container flex flex-col justify-start overflow-auto"
      style={{ maxHeight: "calc(100vh - 160px)" }}
    >
      <div className="inner-content-part-large">
        <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
          <div className="w-full mx-auto flex flex-col justify-center items-center mt-0">
            <span className="font-bold text-[24px]">Appointment Review</span>
          </div>
          <div className="mx-auto flex flex-col justify-around items-center mt-7 w-[90%] md:w-[70%] p-4 rounded-xl bg-[#696C88] gap-2">
            <div className="w-full mx-auto flex flex-row justify-between items-center">
              <div>
                <span className="font-bold text-[14.4px]">Type</span>
              </div>
              <div>
                <span className="font-bold text-[14.4px]">invitation</span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row justify-between items-center">
              <div>
                <span className="font-bold text-[14.4px]">Date</span>
              </div>
              <div>
                <span className="font-bold text-[14.4px]">
                  {moment(varidateData?.date).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row justify-between items-center">
              <div>
                <span className="font-bold text-[14.4px]">Service</span>
              </div>
              <div>
                <span className="font-bold text-[14.4px]">Escort</span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row justify-between items-center">
              <div>
                <span className="font-bold text-[14.4px]">Appt length</span>
              </div>
              <div>
                <span className="font-bold text-[14.4px]">
                  {varidateData?.hours?.value}
                </span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row justify-between items-center">
              <div>
                <span className="font-bold text-[14.4px]">Date location</span>
              </div>
              <div>
                <span className="font-bold text-[14.4px]">
                  {varidateData?.type}
                </span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row justify-between items-center">
              <div>
                <span className="font-bold text-[14.4px]">City</span>
              </div>
              <div>
                <span className="font-bold text-[14.4px]">
                  {varidateData?.country?.city}
                </span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row justify-between items-center">
              <div>
                <span className="font-bold text-[14.4px]">Agreed price</span>
              </div>
              <div>
                <span className="font-bold text-[14.4px]">
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
                </span>
              </div>
            </div>
          </div>
          <div className="mx-auto flex flex-col justify-around items-center mt-7 w-[90%] md:w-[70%] gap-2">
            <Button
              text={"Review Services and Extras"}
              className={
                "font-bold text-[18px] text-white rounded-[25px] border-2 border-white bg-grandient-to-b from-[#02227E] to-[#0247FF]"
              }
              onClick={() => navigate(-1)}
            />
            <div className="w-full mx-auto flex flex-col justify-center items-center mt-5">
              <span className="font-bold text-[24px]">
                Special Request/Message
              </span>
            </div>
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
              className={
                "w-full text-[20px] font-bold text-gray bg-white outline-none border-none rounded-none"
              }
              // border={}
              rows={"4"}
              value={varidateData?.message}
            />
          </div>
          <Button
            disabled={loading}
            text={"Vairify"}
            className={
              "bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] text-[26px] font-bold mt-7 max-w-[70%]"
            }
            onClick={() => handleSubmit()}
          />
        </div>
      </div>
    </div>
  );
}
