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
        setColorStatus(res.payload?.notificationRule);
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
          setIsOpen(true);
          setIsLoading(false);
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
    <div className="main-container px-0 pb-2">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        <div className="w-full mx-auto flex justify-center items-center">
          <span className="text-[27px] font-bold">Calendar Settings</span>
        </div>
        <div className="w-full flex justify-center items-center py-2 mt-3 bg-[#3760CB6B] h-[25px]">
          <span className="w-full font-extrabold text-[20px] text-[#01195C]">
            Notification Rules
          </span>
        </div>
        <div className="w-full max-w-[420px] mx-auto flex flex-row justify-center items-center mt-3 h-[45.34px]">
          <div className="max-w-[240px] h-[45.34px]">
            <SelectBox
              rounded={"rounded-xl"}
              className1={
                "!whitespace-pre !text-[18px] !pr-[40px] rounded-xl max-h-[45.34px] px-2 leading-[20px] py-0 min-h-[44px]"
              }
              options={requestOptions}
              backgroundColor={"bg-[#01195C]"}
              textSize={"text-[18px]"}
              textColor={"text-white"}
              fontWeight={"font-semibold"}
              size="45.34px"
              setRules="true"
              iconColor="text-white"
              disabledOption="Cancellation Request"
              onChange={(e) => {
                setSelectedRequestOptions(e.target.value);
              }}
            />
          </div>
          <div className="mt-1 ml-5 w-[100px] h-[45.34px]">
            <Select
              value={status}
              rounded="rounded-xl"
              className="rounded-[8px!important] w-[90px] h-[43px] flex justify-center items-center bg-[#01195C]"
            >
              <MenuItem
                onClick={() => {
                  setColor(null);
                  setTimeout(() => setColor("red-500"), 0);
                  setStatus(1);
                }}
                value={1}
              >
                <div className="mx-auto flex justify-center items-center w-[31px] h-[31px] bg-red-500"></div>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setStatus(2);
                  setColor("green-500");
                }}
                value={2}
              >
                <div className="mx-auto flex justify-center items-center w-[31px] h-[31px] bg-green-500"></div>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setStatus(3);
                  setColor("yellow-500");
                }}
                value={3}
              >
                <div className="mx-auto flex justify-center items-center w-[31px] h-[31px] bg-yellow-500"></div>
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
                    className={`w-[18px] h-[18px] border-2 border-black bg-${item?.color}`}
                  ></div>
                  <div>
                    <span className="ml-2 font-extrabold text-[14.4px] text-black">
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
        <div className="w-full flex justify-center items-center py-2 mt-6 bg-[#3760CB6B] h-[25px]">
          <span className="w-full font-extrabold text-[20px] text-[#01195C]">
            Buffer Time
          </span>
        </div>
        <div className="w-full max-w-[420px] mx-auto flex flex-row justify-around items-center mt-4">
          <div className="flex flex-row justify-around items-end duration-row">
            <div className="flex flex-col justify-center items-center mr-2">
              <span className="text-[10.8px] font-extrabold pb-[4px]">Day</span>
              <div className="bg-[#02227E] w-[45px] h-[45px] rounded-md flex flex-col justify-center items-center">
                <span className="text-[18px] font-extrabold text-white">
                  {bufferDay}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center mr-2">
              <span className="text-[10.8px] font-extrabold pb-[4px]">Hr</span>
              <div className="bg-[#02227E] w-[45px] h-[45px] rounded-md flex flex-col justify-center items-center">
                <span className="text-[18px] font-extrabold text-white">
                  {bufferHr}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center mr-2">
              <span className="text-[10.8px] font-extrabold pb-[4px]">Min</span>
              <div className="bg-[#02227E] w-[45px] h-[45px] rounded-md flex flex-col justify-center items-center">
                <span className="text-[18px] font-extrabold text-white">
                  {bufferMin}
                </span>
              </div>
            </div>
            {parseInt(bufferDay) == 0 &&
              parseInt(bufferHr) == 0 &&
              parseInt(bufferMin) == 0 ? (
              <div className="flex flex-col justify-center items-center bg-gray-300 w-[45px] h-[45px] rounded-md border-2 border-gray-200 mr-2">
                <button
                  disabled
                  className="w-full h-full flex flex-col justify-center items-center"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}images/VectorDown.png`}
                    alt="Time Duration Down"
                  />
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center bg-white w-[45px] h-[45px] rounded-md border-2 border-gray-200 mr-2">
                <button
                  onClick={() => handleDurationDownBuffer()}
                  className="w-full h-full flex flex-col justify-center items-center"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}images/VectorDown.png`}
                    alt="Time Duration Down"
                  />
                </button>
              </div>
            )}
            <div className="flex flex-col justify-center items-center bg-white w-[45px] h-[45px] rounded-md border-2 border-gray-200">
              <button
                onClick={() => handleDurationUpBuffer()}
                className="w-full h-full flex flex-col justify-center items-center"
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/VectorUp.png`}
                  alt="Time Duration Up"
                />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center py-2 mt-6 bg-[#3760CB6B] h-[25px]">
          <span className="w-full font-extrabold text-[20px] text-[#01195C]">
            Black Out Period
          </span>
        </div>
        <div className="w-full max-w-[420px] mx-auto flex flex-col justify-around items-center">
          <div className="flex flex-row justify-around items-end mt-4">
            <div className="flex flex-col justify-center items-center mr-2">
              <span className="text-[10.8px] font-extrabold pb-[4px]">Day</span>
              <div className="bg-[#02227E] w-[45px] h-[45px] rounded-md flex flex-col justify-center items-center">
                <span className="text-[18px] font-extrabold text-white">
                  {apptDay}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center mr-2">
              <span className="text-[10.8px] font-extrabold pb-[4px]">Hr</span>
              <div className="bg-[#02227E] w-[45px] h-[45px] rounded-md flex flex-col justify-center items-center">
                <span className="text-[18px] font-extrabold text-white">
                  {apptHr}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center mr-2">
              <span className="text-[10.8px] font-extrabold pb-[4px]">Min</span>
              <div className="bg-[#02227E] w-[45px] h-[45px] rounded-md flex flex-col justify-center items-center">
                <span className="text-[18px] font-extrabold text-white">
                  {apptMin}
                </span>
              </div>
            </div>
            {parseInt(apptDay) == 0 &&
              parseInt(apptHr) == 0 &&
              parseInt(apptMin) == 0 ? (
              <div className="flex flex-col justify-center items-center bg-gray-300 w-[45px] h-[45px] rounded-md border-2 border-gray-200 mr-2">
                <button
                  disabled
                  className="w-full h-full flex flex-col justify-center items-center"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}images/VectorDown.png`}
                    alt="Time Duration Down"
                  />
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center bg-white w-[45px] h-[45px] rounded-md border-2 border-gray-200 mr-2">
                <button
                  onClick={() => handleDurationDownBlackOut()}
                  className="w-full h-full flex flex-col justify-center items-center"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}images/VectorDown.png`}
                    alt="Time Duration Down"
                  />
                </button>
              </div>
            )}
            <div className="flex flex-col justify-center items-center bg-white w-[45px] h-[45px] rounded-md border-2 border-gray-200">
              <button
                onClick={() => handleDurationUpBlackOut()}
                className="w-full h-full flex flex-col justify-center items-center"
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/VectorUp.png`}
                  alt="Time Duration Up"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center items-center py-2 mt-6 bg-[#3760CB6B] h-[25px]">
          <span className="w-full font-extrabold text-[20px] text-[#01195C]">
            Member Exemptions
          </span>
        </div>

        <div className="max-w-[400px] px-4 w-full mx-auto flex flex-col  justify-around mt-6">
          <div className="w-full flex items-end text-right">
            <Button
              onClick={handleAddExemption}
              className="ml-auto mr-[10px] mb-3   mb-1  flex items-center rounded-md py-1 justify-center bg-gradient-to-b from-[#02227e] to-[#02227e] text-[#fff] font-bold text-base"
              text={<><FontAwesomeIcon icon={faPlus} className="pr-3" /> Add </>}
              size="40px"
            />
          </div>
          <div className="w-full">
            {exemptions.map((exemption, index) => (
              <div key={exemption._id} className="w-full flex pr-2 mb-3 last:mb-0">
                <InputText
                  className="rounded-md h-[26px] mb-2"
                  placeholder="Enter Verify ID"
                  size="35px"
                  value={exemption.VIAid}
                  onChange={(e) => handleInputChange(exemption._id, e.target.value)}
                  ref={index === exemptions.length - 1 ? lastInputRef : null} // Set ref for the last input
                />
                <Button
                  onClick={() => handleRemoveExemption(exemption._id)}
                  className="ml-2 !w-[57px] flex items-center rounded-md py-1 justify-center bg-gradient-to-b from-[#FF0000] to-[#FF3333] text-[#FFFFFF] font-bold text-base"
                  size="37px"
                  text={<FontAwesomeIcon icon={faMinus} />}
                >
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-[400px] px-2 w-full mx-auto flex flex-row text-red-500">{error}</div>

        <div className="w-full max-w-[420px] mx-auto flex flex-row justify-center items-center mt-2 gap-5">
          <Button
            onClick={() => handleNavigateToCalendar()}
            className={
              "flex items-center px-[10px] py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] w-full max-w-[152px]"
            }
            text={"Calendar"}
            size="45px"
          />
          <Button
            className={
              "flex items-center px-[10px] py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] w-full max-w-[152px]"
            }
            text={
              !isLoading ? (
                "Save Rules"
              ) : (
                <div className="flex items-center	justify-center pt-[6px]">
                  <Loading />
                </div>
              )
            }
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
  );
}
