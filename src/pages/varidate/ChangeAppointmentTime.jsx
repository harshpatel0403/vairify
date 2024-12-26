import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import { combineDateTime, generateTimeSlots } from "../../utils";
import moment from "moment";

export default function ChangeAppointmentTime() {
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
        appointmentId: params.appointmentId,
        from: "modify",
      },
    });
  };

  const location = useLocation();
  useEffect(() => {
    if (location?.state) {
      setVaridateData(location?.state);
    }
  }, [location]);

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
                {varidateData?.companionData?.vaiID}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "10px", bottom: "65px" }}
              className="absolute w-full h-full rounded-full"
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
                className="rounded-full"
              />
            </div>
            {/* <div style={{ right: '0px', top: '25px' }} className='absolute'><img src={'/images/SugarIcon2.png'} alt="Sugar Icon Second" /></div> */}
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
        </div>

        <div className="w-full mx-auto flex flex-col justify-center items-center mt-10 mb-10 gap-4">
          {slots?.map((slot) => (
            <div className="w-full ">
              {staff == slot ? (
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
              ) : (
                <Button
                  onClick={() => handleClick(slot)}
                  text={slot}
                  className={
                    "bg-[#9099BB] border-2 border-[#02227E] rounded-md font-bold text-[24px] text-[#01195C]"
                  }
                />
              )}
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

        <div className="w-full d-block mb-10 px-4">
          <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
            <span className="font-bold text-[20px]">
              {moment(varidateData?.date).format("dddd DD/MM/YYYY")}
            </span>
          </div>
          {staff != "" && (
            <div className="w-full">
              <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
                <span className="font-bold text-[16px]">{`${staff}`} </span>
              </div>
              <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
                <span className="font-bold text-[16px]">
                  Escort {varidateData?.type}
                </span>
              </div>
              <div className="w-full mx-auto flex flex-row justify-center items-center mt-2">
                <textarea
                  rows="3"
                  className="block p-2.5 w-full text-[15px] text-gray-900 rounded-md border-2 border-[#02227E] focus:ring-blue-500 dark:placeholder-gray-400 dark:text-white bg-[#a5adce] focus-visible:border-0 mt-2"
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
              <div className="w-full mx-auto flex flex-row justify-center items-center mt-2 flex-wrap">
                <span className="max-w-[50%] w-[100%] font-bold text-[16px] text-left">
                  Agreed Price
                </span>
                <div className="max-w-[50%] w-[100%] text-right">
                  <Button
                    onClick={() => navigateToSelectTime()}
                    text={
                      varidateData?.hours?.[varidateData?.type?.toLowerCase()] +
                      " " +
                      varidateData?.hours?.currency
                    }
                    bgColor="[#a5adce]"
                    className={
                      "w-24 bg-[#01195C] border-2 border-[#02227E] rounded-md font-bold text-[18px] text-[#000] !h-[35px]"
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
