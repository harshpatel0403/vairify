import React, { useEffect, useMemo, useState, useRef } from "react";
import InputText from "../../../components/InputText";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import SelectBox from "../../../components/SelectBox";
import { Select, MenuItem } from "@mui/material";
import Modal from "react-modal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { HandleCreateCalendarSetting, HandleGetCalendarSettings } from "../../../redux/action/CalendarSchedule";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Header from "../../../components/Header/Header";
import PageTitle from "../../../components/PageTitle";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#3760CB",
    width: "90vw",
    height: "229px",
    zIndex: 20,
    borderRadius: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
    padding: "20px 15px",
    maxWidth: "370px",
  },
};

export default function SetRules() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [status, setStatus] = useState(1);
  const [color, setColor] = useState("red-500");
  const [isOpen, setIsOpen] = useState(false);
  const requestOptions = ["Pending", "Confirmed", "Cancellation"];
  const [selectedRequestOptions, setSelectedRequestOptions] = useState("");
  const [bufferDay, setBufferDay] = useState("00");
  const [bufferHr, setBufferHr] = useState("00");
  const [bufferMin, setBufferMin] = useState("15");
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  const [apptDay, setApptDay] = useState("00");
  const [apptHr, setApptHr] = useState("00");
  const [apptMin, setApptMin] = useState("15");
  const [requestType, setRequestType] = useState("Scheduled");
  const [exemptions, setExemptions] = useState([{ _id: 1, VIAid: "" }])
  const [error, setError] = useState("");
  const lastInputRef = useRef(null);
  const [colorStatus, setColorStatus] = useState([
    {
      title: "Pending",
      color: "yellow-500",
    },
    {
      title: "Confirmed",
      color: "green-500",
    },
    {
      title: "Cancellation",
      color: "red-500",
    },
  ]);

  const getData = () => {
    dispatch(HandleGetCalendarSettings(UserDetails?._id))
      .then((res) => {
        setColorStatus(res.payload?.notificationRule || colorStatus);
        setBufferDay(res?.payload?.bufferTime?.day);
        setBufferHr(res?.payload?.bufferTime?.hr);
        setBufferMin(res?.payload?.bufferTime?.min);
        setApptDay(res?.payload?.blackOutPeriod.day);
        setApptHr(res?.payload?.blackOutPeriod.hr);
        setApptMin(res?.payload?.blackOutPeriod.min);
        setExemptions(res?.payload?.member)
      }
      )
      .catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {
    getData();
  }, [])

  function generateUniqueId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    const uniqueId = `${timestamp}-${random}`;
    return uniqueId;
  }

  const handleAddExemption = () => {
    // Check if any of the input values are empty
    if (exemptions.some((exemption) => exemption.VIAid.trim() === "")) {
      setError("Please enter a value for all inputs.");
    } else {
      setError("");
      const newId = generateUniqueId();
      setExemptions([...exemptions, { id: newId, VIAid: "" }]);
    }
  };

  const handleRemoveExemption = (id) => {
    if (exemptions.length === 1) {
      setError("At least one input is required.");
    } else {
      setError("");
      const updatedExemptions = exemptions.filter((exemption) => exemption._id !== id);
      setExemptions(updatedExemptions);

      if (lastInputRef.current) {
        lastInputRef.current.focus();
      }
    }
  };

  const handleInputChange = (id, VIAid) => {
    setError("");
    const updatedExemptions = exemptions?.map((exemption) =>
      exemption._id === id ? { ...exemption, VIAid } : exemption
    );
    setExemptions(updatedExemptions);
  };

  const exemptionsArray =
    exemptions &&
    exemptions?.map((exemption) => ({
      VIAid: exemption?.VIAid,
    }));
  const AllData = {
    userId: UserDetails?._id,
    requestRules: requestType,
    notificationRule: colorStatus,
    bufferTime: {
      day: bufferDay,
      hr: bufferHr,
      min: bufferMin,
    },
    blackOutPeriod: {
      day: apptDay,
      hr: apptHr,
      min: apptMin,
    },
    member: exemptionsArray,
  };
  const HandleSaveButton = () => {
    setIsLoading(true);
    dispatch(HandleCreateCalendarSetting(AllData))
      .then(async (result) => {
        if (result?.payload?.status === 200) {
          // setIsOpen(true);
          setIsLoading(false);
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });

          navigate("/cal-setting")
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const handleDurationDownBuffer = () => {
    const bufferMinInt = parseInt(bufferMin);
    const bufferHrInt = parseInt(bufferHr);
    const bufferDayInt = parseInt(bufferDay);
    const decreasedBufferMinInt = bufferMinInt - 15;
    if (decreasedBufferMinInt == 0 && bufferHrInt == 0 && bufferDayInt == 0) {
      setBufferMin("00");
    } else if (decreasedBufferMinInt == 0 && bufferHrInt > 0) {
      setBufferMin("00");
    } else if (
      decreasedBufferMinInt == 0 &&
      bufferHrInt == 0 &&
      bufferDayInt > 0
    ) {
      const decreasedBufferDayInt = bufferDayInt - 1;
      if (decreasedBufferDayInt > 9) {
        setBufferDay(decreasedBufferDayInt.toString());
      } else {
        setBufferDay("0" + decreasedBufferDayInt.toString());
      }
      setBufferHr("24");
      setBufferMin("60");
    } else if (decreasedBufferMinInt <= 0 && bufferHrInt > 0) {
      setBufferMin("45");
      setBufferHr(`${(bufferHrInt - 1) > 9 ? '' : '0'}${bufferHrInt - 1}`)
    }
    else {
      if (decreasedBufferMinInt > 9) {
        setBufferMin(decreasedBufferMinInt.toString());
      } else {
        setBufferMin("0" + decreasedBufferMinInt.toString());
      }
    }
  };

  const handleDurationUpBuffer = () => {
    const bufferMinInt = parseInt(bufferMin);
    const bufferHrInt = parseInt(bufferHr);
    const bufferDayInt = parseInt(bufferDay);
    const increasedBufferMinInt = bufferMinInt + 15;
    if (increasedBufferMinInt >= 60 && bufferHrInt >= 24) {
      const increasedBufferDayInt = bufferDayInt + 1;

      if (increasedBufferDayInt > 9) {
        setBufferDay(increasedBufferDayInt.toString());
      } else {
        setBufferDay("0" + increasedBufferDayInt.toString());
      }
      setBufferHr("00");
      setBufferMin("00");
    } else if (increasedBufferMinInt >= 60 && bufferHrInt <= 24) {
      const increasedBufferHrInt = bufferHrInt + 1;

      if (increasedBufferHrInt > 9) {
        setBufferHr(increasedBufferHrInt.toString());
      } else {
        setBufferHr("0" + increasedBufferHrInt.toString());
      }
      setBufferMin("00");
    } else {
      setBufferMin(increasedBufferMinInt.toString());
    }
  };

  const handleDurationDownBlackOut = () => {
    const apptMinInt = parseInt(apptMin);
    const apptHrInt = parseInt(apptHr);
    const apptDayInt = parseInt(apptDay);
    const decreasedApptMinInt = apptMinInt - 15;
    if (decreasedApptMinInt == 0 && apptHrInt == 0 && apptDayInt == 0) {
      setApptMin("00");
    } else if (decreasedApptMinInt == 0 && apptHrInt > 0) {
      setApptMin("00");
    } else if (decreasedApptMinInt == 0 && apptHrInt == 0 && apptDayInt > 0) {
      const decreasedApptDayInt = apptDayInt - 1;
      if (decreasedApptDayInt > 9) {
        setApptDay(decreasedApptDayInt.toString());
      } else {
        setApptDay("0" + decreasedApptDayInt.toString());
      }
      setApptHr("24");
      setApptMin("60");
    } else if (decreasedApptMinInt <= 0 && apptHrInt > 0) {
      setApptMin("45");
      setApptHr(`${(apptHrInt - 1) > 9 ? '' : '0'}${(apptHrInt - 1)}`);
    } else {
      if (decreasedApptMinInt > 9) {
        setApptMin(decreasedApptMinInt.toString());
      } else {
        setApptMin("0" + decreasedApptMinInt.toString());
      }
    }
  };

  const handleDurationUpBlackOut = () => {
    const apptMinInt = parseInt(apptMin);
    const apptHrInt = parseInt(apptHr);
    const apptDayInt = parseInt(apptDay);
    const increasedApptMinInt = apptMinInt + 15;
    if (increasedApptMinInt >= 60 && apptHrInt >= 24) {
      const increasedApptDayInt = apptDayInt + 1;

      if (increasedApptDayInt > 9) {
        setApptDay(increasedApptDayInt.toString());
      } else {
        setApptDay("0" + increasedApptDayInt.toString());
      }
      setApptHr("00");
      setApptMin("00");
    } else if (increasedApptMinInt >= 60 && apptHrInt <= 24) {
      const increasedApptHrInt = apptHrInt + 1;

      if (increasedApptHrInt > 9) {
        setApptHr(increasedApptHrInt.toString());
      } else {
        setApptHr("0" + increasedApptHrInt.toString());
      }
      setApptMin("00");
    } else {
      setApptMin(increasedApptMinInt.toString());
    }
  };

  const handleNavigateToCalendar = () => {
    navigate("/calendar");
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  useMemo(() => {
    const data = colorStatus?.filter((item) => {
      if (item.title === selectedRequestOptions) {
        item.color = color;
      }
      return item;
    });
    setColorStatus(data);
  }, [color]);

  return (
    <div className="min-h-[calc(100vh - 282px)]">
      <div className="container">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"Calendar Settings"} isSmall={true} />
        </div>
        <div className="">
          <div className="sm:text-xl text-lg font-medium text-white">
            Notification Rules
          </div>
          <div className="w-full mx-auto flex flex-row justify-center items-center mt-3 gap-3">
            <div className="relative w-full">
              <SelectBox
                options={requestOptions}
                setRules="true"
                disabledOption="Cancellation Request"
                className1="text-[14px] font-normal border border-[#919EAB33] w-[100%] rounded-[8px]"
                size={"h-[47px]"}
                textAlign={"text-left"}
                rounded={"rounded-2xl"}
                fontWeight={"font-bold"}
                textColor={"text-white"}
                textSize={"text-[14px]"}
                onChange={(e) => {
                  setSelectedRequestOptions(e.target.value);
                }}
              />
            </div>
            <div className="w-fit ">
              <Select
                value={status}
                rounded={"rounded-2xl"}
                className=" w-[78px] h-[43px] flex justify-center items-center border border-[#919EAB33] border-[2px] h-[47px] !rounded-[8px]"
              >
                <MenuItem
                  onClick={() => {
                    setColor(null);
                    setTimeout(() => setColor("red-500"), 0);
                    setStatus(1);
                  }}
                  value={1}
                >
                  <div className="mx-auto flex justify-center items-center w-[22px] h-[22px] bg-red-500 rounded-[4px]"></div>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setStatus(2);
                    setColor("green-500");
                  }}
                  value={2}
                >
                  <div className="mx-auto flex justify-center items-center w-[22px] h-[22px] bg-green-500 rounded-[4px]"></div>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setStatus(3);
                    setColor("yellow-500");
                  }}
                  value={3}
                >
                  <div className="mx-auto flex justify-center items-center w-[22px] h-[22px] bg-yellow-500 rounded-[4px]"></div>
                </MenuItem>
              </Select>
            </div>
          </div>
          <div className="w-full max-w-[420px] mx-auto flex flex-row justify-center items-center mt-6 gap-5">
            {colorStatus?.map((item) => {
              return (
                <>
                  <div className="flex flex-row justify-center items-center">
                    <div
                      className={`w-[16px] h-[16px] rounded-full bg-${item?.color}`}
                    ></div>
                    <div>
                      <span className="ml-2 font-normal text-base text-white">
                        {item?.title}
                      </span>
                    </div>
                  </div>
                </>
              );
            })}
            {
              // <div className="flex flex-row justify-center items-center">
              //   <div className="w-[18px] h-[18px] border-2 border-black bg-yellow-500"></div>
              //   <div>
              //     <span className="ml-2 font-extrabold text-[14.4px] text-black">
              //       Pending
              //     </span>
              //   </div>
              // </div>
              // <div className="flex flex-row justify-center items-center">
              //   <div className="w-[18px] h-[18px] border-2 border-black bg-green-500"></div>
              //   <div>
              //     <span className="ml-2 font-extrabold text-[14.4px] text-black">
              //       Confirmed
              //     </span>
              //   </div>
              // </div>
              // <div className="flex flex-row justify-center items-center">
              //   <div className="w-[18px] h-[18px] border-2 border-black bg-red-500"></div>
              //   <div>
              //     <span className="ml-2 font-extrabold text-[14.4px] text-black">
              //       Cancellation <br />
              //       Request
              //     </span>
              //   </div>
              // </div>
            }
          </div>
          <div className="mt-[24px] sm:text-xl text-lg font-medium text-white">
            Buffer Time
          </div>
          <div className="w-full max-w-[420px] mx-auto flex flex-row justify-around items-center mt-4">
            <div className="flex flex-row justify-around items-end duration-row">
              <div className="flex flex-col justify-center items-center mr-2">
                <span className="text-[10px] font-normal pb-[4px] text-white">Day</span>
                <div className="bg-[#919EAB33] w-[45px] h-[45px] rounded-md flex flex-col justify-center items-center text-xl font-normal text-white">
                  {bufferDay}
                </div>
              </div>
              <div className="flex flex-col justify-center items-center mr-2">
                <span className="text-[10px] font-normal pb-[4px] text-white">Hr</span>
                <div className="bg-[#919EAB33] w-[45px] h-[45px] rounded-md flex flex-col justify-center items-center text-xl font-normal text-white">
                  {bufferHr}
                </div>
              </div>
              <div className="flex flex-col justify-center items-center mr-2">
                <span className="text-[10px] font-normal pb-[4px] text-white">Min</span>
                <div className="bg-[#919EAB33] w-[45px] h-[45px] rounded-md flex flex-col justify-center items-center text-xl font-normal text-white">
                  {bufferMin}
                </div>
              </div>
              {parseInt(bufferDay) == 0 &&
                parseInt(bufferHr) == 0 &&
                parseInt(bufferMin) == 0 ? (
                <div className="flex flex-col justify-center items-center bg-[#919EAB33] opacity-[0.6] w-[45px] h-[45px] rounded-md mr-2">
                  <button
                    disabled
                    className="w-full h-full flex flex-col justify-center items-center"
                  >
                    <img
                      src='/images/setup/vector-down-white.svg'
                      alt="Time Duration Down"
                    />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center bg-[#919EAB33] w-[45px] h-[45px] rounded-md mr-2">
                  <button
                    onClick={() => handleDurationDownBuffer()}
                    className="w-full h-full flex flex-col justify-center items-center"
                  >
                    <img
                      src='/images/setup/vector-down-white.svg'
                      alt="Time Duration Down"
                    />
                  </button>
                </div>
              )}
              <div className="flex flex-col justify-center items-center bg-[#919EAB33] w-[45px] h-[45px] rounded-md">
                <button
                  onClick={() => handleDurationUpBuffer()}
                  className="w-full h-full flex flex-col justify-center items-center"
                >
                  <img
                    src='/images/setup/vector-up-white.svg'
                    alt="Time Duration Up"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-[24px] sm:text-xl text-lg font-medium text-white">
            Black Out Period
          </div>
          <div className="w-full max-w-[420px] mx-auto flex flex-col justify-around items-center">
            <div className="flex flex-row justify-around items-end mt-4">
              <div className="flex flex-col justify-center items-center mr-2">
                <span className="text-[10px] font-normal pb-[4px] text-white">Day</span>
                <div className="bg-[#919EAB33] w-[45px] h-[45px] rounded-md flex flex-col justify-center items-center text-xl font-normal text-white">
                  {apptDay}
                </div>
              </div>
              <div className="flex flex-col justify-center items-center mr-2">
                <span className="text-[10px] font-normal pb-[4px] text-white">Hr</span>
                <div className="bg-[#919EAB33] w-[45px] h-[45px] rounded-md flex flex-col justify-center items-center text-xl font-normal text-white">
                  {apptHr}
                </div>
              </div>
              <div className="flex flex-col justify-center items-center mr-2">
                <span className="text-[10px] font-normal pb-[4px] text-white">Min</span>
                <div className="bg-[#919EAB33] w-[45px] h-[45px] rounded-md flex flex-col justify-center items-center text-xl font-normal text-white">
                  {apptMin}
                </div>
              </div>
              {parseInt(apptDay) == 0 &&
                parseInt(apptHr) == 0 &&
                parseInt(apptMin) == 0 ? (
                <div className="flex flex-col justify-center items-center bg-[#919EAB33] opacity-[0.6] w-[45px] h-[45px] rounded-md mr-2">
                  <button
                    disabled
                    className="w-full h-full flex flex-col justify-center items-center"
                  >
                    <img
                      src='/images/setup/vector-down-white.svg'
                      alt="Time Duration Down"
                    />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center bg-[#919EAB33] w-[45px] h-[45px] rounded-md mr-2">
                  <button
                    onClick={() => handleDurationDownBlackOut()}
                    className="w-full h-full flex flex-col justify-center items-center"
                  >
                    <img
                      src='/images/setup/vector-down-white.svg'
                      alt="Time Duration Down"
                    />
                  </button>
                </div>
              )}
              <div className="flex flex-col justify-center items-center bg-[#919EAB33] w-[45px] h-[45px] rounded-md">
                <button
                  onClick={() => handleDurationUpBlackOut()}
                  className="w-full h-full flex flex-col justify-center items-center"
                >
                  <img
                    src='/images/setup/vector-up-white.svg'
                    alt="Time Duration Up"
                  />
                </button>
              </div>
            </div>
          </div>


          <div className="flex justify-between items-center mt-[24px]">
            <div className=" sm:text-xl text-lg font-medium text-white">
              Member Exemptions
            </div>
            <div>
              <Button
                onClick={handleAddExemption}
                className="!py-0 !w-fit px-3"
                text={<><FontAwesomeIcon icon={faPlus} className="pr-1" /> Add </>}
                size="38px"
              />
            </div>
          </div>

          <div className="w-full mx-auto flex flex-col  justify-around mt-[12px]">
            <div className="w-full">
              {exemptions?.map((exemption, index) => (
                <div key={exemption._id} className="w-full flex items-center mb-2 last:mb-0">
                  <InputText
                    className="rounded-md h-[26px] border-[#919EAB33]"
                    placeholder="Enter Verify ID"
                    size="48px"
                    value={exemption.VIAid}
                    onChange={(e) => handleInputChange(exemption._id, e.target.value)}
                    ref={index === exemptions.length - 1 ? lastInputRef : null} // Set ref for the last input
                  />
                  <Button
                    onClick={() => handleRemoveExemption(exemption._id)}
                    className="ml-2 !w-[20px] flex items-center rounded-full !py-0 bg-transparent border border-[#E43530] hover:bg-transparent h-[20px] flex justify-center items-center"
                    text={<FontAwesomeIcon icon={faMinus} color="#E43530" />}
                  >
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full mx-auto flex flex-row text-red-500 text-xs mt-1" >{error}</div>

          <div className="w-full mx-auto flex flex-row justify-center items-center mt-[24px] gap-5 mb-[48px]">
            <Button
              onClick={() => handleNavigateToCalendar()}
              text={"Calendar"}
              size="45px"
            />
            <Button
              disabled={isLoading}
              text={
                !isLoading ? (
                  "Save Rules"
                ) : (
                  <div className="flex items-center	justify-center pt-[0px]">
                    <Loading />
                  </div>
                )
              }
              className='!bg-[#FFFFFF29] secondary-btn hover:brightness-105 hover:!bg-[#3660cb]'
              onClick={HandleSaveButton}
              size="45px"
            />
          </div>
        </div>
        <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
          <div className="w-full mx-auto flex flex-col justify-center items-cener ">
            <div className="font-bold text-[36px] text-white text-center leading-9">
              Rules
            </div>
            <div className="font-bold text-[36px] text-white text-center leading-9">
              Saved
            </div>
            <div className="font-bold text-[36px] text-white text-center leading-9">
              successfully
            </div>
            <div className=" flex justify-center">
              <Button
                className={
                  "mt-6 text-[#040C50] justify-center max-w-[200px] font-[800] w-full from-0% to-65% from-[#0CA36C] to-[#08FA5A] bg-gradient-to-b text-[24px]"
                }
                onClick={() => navigate("/cal-setting")}
                text="Calendar"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
