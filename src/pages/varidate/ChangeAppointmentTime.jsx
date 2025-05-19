import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import { combineDateTime, generateTimeSlots } from "../../utils";
import moment from "moment";

export default function ChangeAppointmentTime(props) {
  const navigate = useNavigate();
  const params = useParams();
  const [staff, setStaff] = useState("");
  const [varidateData, setVaridateData] = useState({});
  const [slots, setSlots] = useState([]);
  const handleClick = (props) => {
    setStaff(props);
    setVaridateData((prevValue) => ({
      ...prevValue,
      selectedSlot: props,
    }));
  };
  const navigateToSelectTime = () => {
    navigate("/varidate/verification");
  };
  const navigateToServicesRates = () => {
    console.log(
      varidateData?.selectedSlot?.split(" - ")?.[0],
      " <=== selected slot for start date  "
    );
    let startDateTime = combineDateTime(
      varidateData?.date,
      varidateData?.selectedSlot?.split(" - ")?.[0]
    );
    // let endDateTime = combineDateTime(
    //     varidateData?.date,
    //     varidateData?.selectedSlot?.split(" - ")?.[1]
    //   )
    let payload = {
      startDateTime,
      endDateTime: moment(startDateTime)
        .add(varidateData?.hours?.time, "hours")
        .toDate(),
      duration: varidateData?.hours?.time * 60,
      extras: varidateData?.extraServices?.map((item) => {
        let itemCopy = { ...item, serviceId: item?._id };
        delete itemCopy._id;
        return itemCopy;
      }),
      //   type: varidateData?.type,
      clientStatus: "Requested",
      companionStatus: "Modified",
      service: varidateData?.service,
      //   location: varidateData?.country,
    };

    if (varidateData?.type === "Incall") {
      //   payload["location"] = varidateData?.country;
    }

    console.log(payload, " <-== payload before navigate");
    //   navigate("/varidate/face-verification", { state: payload });
    navigate("/varidate/face-verification", {
      state: {
        ...payload,
        companionData: varidateData?.companionData,
        appointmentId: params.appointmentId || props?.state?.params?.appointmentId,
        from: "modify",
      },
    });
  };

  const location = useLocation();
  useEffect(() => {
    if (location?.state || props?.state) {
      setVaridateData(location?.state || props?.state);
    }
  }, [location, props]);

  useEffect(() => {
    console.log(varidateData, " <=== vairdate data...");
    if (varidateData?.hours) {
      let generatedSlots = generateTimeSlots(varidateData?.hours?.time * 60);
      setSlots(generatedSlots);
    }
  }, [varidateData]);

  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        {/* <div className="w-full mx-auto flex flex-row justify-between items-start mt-2">
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
                {varidateData?.companionData?.vaiID}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "10px", bottom: "65px" }}
              className="absolute w-full h-full"
            >
              <img
                src={
                  varidateData?.companionData?.profilePic
                    ? import.meta.env.VITE_APP_S3_IMAGE +
                    `/${varidateData?.companionData?.profilePic}`
                    : varidateData?.companionData?.gender === "Male"
                      ? "/images/male.png"
                      : "/images/female.png"
                }
                // src={
                //   varidateData?.companionData?.profilePic
                //     ? import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                //       `/${varidateData?.companionData?.profilePic}`
                //     : varidateData?.companionData?.gender === "Male"
                //     ? "/images/male.png"
                //     : "/images/female.png"
                // }
                alt="Sugar"
                className="w-[120px] h-[120px] rounded-[125px] overflow-hidden bg-[#fff] border-2 border-white"
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
              {Array.from(
                { length: varidateData?.companionData?.avgRating || 0 },
                (_, index) => index
              )?.map((rating) => (
                <FontAwesomeIcon
                  icon={faStar}
                  color="#E1AB3F"
                  className="text-[10px] margin-right-5"
                />
              ))}
              {Array.from(
                {
                  length:
                    5 - Math.floor(varidateData?.companionData?.avgRating || 0),
                },
                (_, index) => index
              )?.map((rating) => (
                <FontAwesomeIcon
                  icon={faStar}
                  color="#111"
                  className="text-[10px] margin-right-5"
                />
              ))}
              <span className="text-[15px] text-[#040C50] font-bold">
                {varidateData?.companionData?.avgRating}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full mx-auto flex flex-col justify-center items-center mt-2">
          <span className="font-bold text-[24px]">
            {varidateData?.companionData?.name}
          </span>
        </div> */}
        <div className="text-center text-lg font-medium text-white sm:mt-[48px] mt-[24px]">
          Select Slot
        </div>

        <div className="w-full grid grid-cols-2 sm:gap-[24px] gap-[16px] mt-[24px]">
          {slots?.map((slot) => (
            <div className="w-full ">
              {/* {staff == slot ? (
                <div className="w-full mx-auto flex flex-row justify-center items-center">
                  <div className="max-w-[50%] w-[100%] mr-2 mb-2">
                    <Button
                      onClick={() => handleClick("")}
                      text={slot}
                      bgColor="[#01195C]"
                      className={
                        "bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-white"
                      }
                    />
                  </div>
                  <div className="max-w-[50%] w-[100%] mb-2">
                    <Button
                      onClick={() => navigateToServicesRates()}
                      text="VAIRIDATE>>"
                      className={
                        "bg-[#05B7FD] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#01195C] px-2"
                      }
                    />
                  </div>
                </div>
              ) : ( */}
              <Button
                onClick={() => handleClick(slot)}
                text={slot}
                className={'secondary-btn !bg-[#FFFFFF14] focus:!bg-[#405FC4] hover:!bg-[#405FC4]'}
              />
              {/* )} */}
            </div>
          ))}
          {/* <div className='w-full mt-4'>
                        {
                            staff == "Second" ?
                                <div className='w-full mx-auto flex flex-row justify-center items-center'>
                                    <div className='max-w-[50%] w-[100%] mr-2 mb-2'><Button onClick={() => handleClick("")} text="10:00am" bgColor='[#01195C]' className={'bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-white'} /></div>
                                    <div className='max-w-[50%] w-[100%] mb-2'><Button onClick={() => navigateToServicesRates()} text="VAIRIDATE>>" className={'bg-[#05B7FD] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#01195C] px-2'} /></div>
                                </div>
                                :
                                <Button onClick={() => handleClick("Second")} text="10:00am" className={'bg-[#9099BB] border-2 border-[#02227E] rounded-md font-bold text-[24px] text-[#01195C]'} />
                        }
                    </div>
                    <div className='w-full mt-4'>
                        {
                            staff == "Three" ?
                                <div className='w-full mx-auto flex flex-row justify-center items-center'>
                                    <div className='max-w-[50%] w-[100%] mr-2 mb-2'><Button onClick={() => handleClick("")} text="10:30am" bgColor='[#01195C]' className={'bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-white'} /></div>
                                    <div className='max-w-[50%] w-[100%] mb-2'><Button onClick={() => navigateToServicesRates()} text="VAIRIDATE>>" className={'bg-[#05B7FD] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#01195C] px-2'} /></div>
                                </div>
                                :
                                <Button onClick={() => handleClick("Three")} text="10:30am" className={'bg-[#9099BB] border-2 border-[#02227E] rounded-md font-bold text-[24px] text-[#01195C]'} />
                        }
                    </div>
                    <div className='w-full mt-4'>
                        {
                            staff == "Four" ?
                                <div className='w-full mx-auto flex flex-row justify-center items-center'>
                                    <div className='max-w-[50%] w-[100%] mr-2 mb-2'><Button onClick={() => handleClick("")} text="11:30am" bgColor='[#01195C]' className={'bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-white'} /></div>
                                    <div className='max-w-[50%] w-[100%] mb-2'><Button onClick={() => navigateToServicesRates()} text="VAIRIDATE>>" className={'bg-[#05B7FD] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#01195C] px-2'} /></div>
                                </div>
                                :
                                <Button onClick={() => handleClick("Four")} text="11:30am" className={'bg-[#9099BB] border-2 border-[#02227E] rounded-md font-bold text-[24px] text-[#01195C]'} />
                        }
                    </div>
                    <div className='w-full mt-4'>
                        {
                            staff == "Fifth" ?
                                <div className='w-full mx-auto flex flex-row justify-center items-center'>
                                    <div className='max-w-[50%] w-[100%] mr-2 mb-2'><Button onClick={() => handleClick("")} text="1:30am" bgColor='[#01195C]' className={'bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-white'} /></div>
                                    <div className='max-w-[50%] w-[100%] mb-2'><Button onClick={() => navigateToServicesRates()} text="VAIRIDATE>>" className={'bg-[#05B7FD] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#01195C] px-2'} /></div>
                                </div>
                                :
                                <Button onClick={() => handleClick("Fifth")} text="1:30am" className={'bg-[#9099BB] border-2 border-[#02227E] rounded-md font-bold text-[24px] text-[#01195C]'} />
                        }
                    </div> */}
        </div>

        <div className="w-full d-block ">
          <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
            {/* <div className="text-center text-sm text-white mt-[24px]">
              {moment(varidateData?.date).format("dddd DD/MM/YYYY")}
            </div> */}
          </div>
          {staff != "" && (
            <div className="w-full">
              <div className="w-full mx-auto flex flex-row justify-center items-center mt-[8px]">
                <div className="text-center text-sm text-white">{`${staff}`} </div>
              </div>
              <div className="w-full mx-auto flex flex-row justify-center items-center mt-[8px]">
                <div className="text-center text-sm text-white">
                  Escort {varidateData?.type}
                </div>
              </div>
              <div className="w-full mx-auto flex flex-row justify-center items-center mt-[24px]">
                <textarea
                  rows="3"
                  className="w-full border-2 border-[#919EAB33] rounded-[8px] py-[10px] px-[14px] bg-transparent text-white font-normal text-[14px] mt-1 !placeholder-white "
                  value={varidateData?.address}
                  onChange={(event) =>
                    setVaridateData((prevValue) => ({
                      ...prevValue,
                      address: event?.target?.value,
                    }))
                  }
                  placeholder="Address"
                ></textarea>
              </div>
              <div className="mx-auto flex flex-row justify-center items-center gap-[8px] mt-[16px]">
                <div className="text-center text-base text-white opacity-[0.7]">
                  Agreed Price
                </div>
                <Button
                  // onClick={() => navigateToSelectTime()}
                  text={
                    varidateData?.hours?.[varidateData?.type?.toLowerCase()] +
                    " " +
                    varidateData?.hours?.currency
                  }
                  className={'!w-fit px-4 py-[4px] !bg-[#FFFFFF29] secondary-btn'}
                  size={'32px'}
                />
              </div>
              <div className="max-w-[500px] w-full mx-auto mb-[48px]">
                <Button onClick={() => navigateToServicesRates()} text={'Save'} size={'48px'} className={'mt-[20px]'} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
