import React, { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../../components/Button";
import InputText from "../../../../components/InputText";
import SelectBox_ from "../../../../components/SelectBox_";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import VaridateService from "../../../../services/VaridateServices";

const Radius = [
  "Within 15 mi (25 km)",
  "Within 30 mi (50 km)",
  "Within 50 mi (100 km)",
  "Within 120 mi (200 km)",
  "Within 200 mi (320 km)",
];

const genderOptions = [
  "Male",
  "Female",
  "Trans Male (Pre-Op)",
  "Trans Female (Pre-Op)",
  "Trans Male (Post-Op)",
  "Trans Female (Post-Op)",
];

const Venue = ["Incall", "Outcall", "Mobile"];

export default function VairifySearchNew() {
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [selectedTruRevuStart, setSelectedTruRevuStart] = useState({
    from: "0",
    to: "5.0",
  });
  const [selectedGender, setSelectedGender] = useState("Male");
  const [orientationOptions, setOrientationOptions] = useState([
    "M4W",
    "M4M",
    "Bisexual",
  ]);
  const [selectedOrientation, setSelectedOrientation] = useState("M4W");

  const [selectedRadius, setSelectedRadius] = useState(null);
  const [category, setCategory] = useState("Escort");
  const [selectedVenue, setSelectedVenue] = useState("Incall");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedGender === "Male") {
      setOrientationOptions(["M4W", "M4M", "Bisexual"]);
      setSelectedOrientation("M4W");
    } else if (selectedGender === "Female") {
      setOrientationOptions(["W4M", "W4W", "Bisexual"]);
      setSelectedOrientation("W4M");
    } else if (selectedGender.startsWith("Trans")) {
      setOrientationOptions(["T4M", "T4W", "Bisexual"]);
      setSelectedOrientation("T4M");
    } else {
      setOrientationOptions([]);
    }
  }, [selectedGender]);
  const state = useLocation();

  const vairifyCalendar = () => {
    navigate("/vairify-calendar-setting");
  };

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    setSelectedGender(selectedGender);
  };

  const handleOrientationChange = (event) => {
    const selectedOrientation = event.target.value;
    setSelectedOrientation(selectedOrientation);
  };

  const HandleSearch = async () => {
    setLoading(true);
    try {
      const data = await VaridateService.vairifyNowSearch({
        category,
        radius: selectedRadius,
        gender: selectedGender,
        orientation: selectedOrientation,
        venue: selectedVenue,
        trurevu: selectedTruRevuStart,
        userId: UserData?._id,
      });
      toast(data.message);
      if (data?.result?.length > 0) {
        navigate(`/vairify-results`, { state: data.result });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="schedule_rules"
      className="main-container px-0 min-h-[calc(100vh-150px)]"
    >
      <div className="w-full mx-auto flex flex-col justify-center items-center p-2">
        <span className="text-[27px] change-font-family font-extrabold">
          Vai<span className="logoSetupweight">rify-now</span>
        </span>
      </div>
      <div className="w-full h-[30px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] appearance-none"></div>
      <div className="align-items-center md:max-w-[500px] max-w-[400px] mx-auto px-6 min-h-[calc(100vh-290px)] flex flex-col py-6 justify-between">
        <div className="w-full mx-auto items-center gap-2">
          <div className="flex flex-grow justify-between items-center gap-4">
            <div className="flex flex-col items-center w-[50%] w-full rounded-[10px] mt-3">
              <div className="relative w-full">
                <select
                  className="text-center w-full h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[10px] appearance-none pl-3 pr-8 text-[20px] text-[#fff] font-semibold"
                  name="savedSchedules"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option selected={category === "Escort"} value={"Escort"}>
                    Escort
                  </option>
                  <option selected={category === "Massage"} value={"Massage"}>
                    Massage
                  </option>
                  <option selected={category === "Dance"} value={"Dance"}>
                    Dance
                  </option>
                </select>
                <div className="absolute top-2 right-2">
                  <svg
                    className={`w-6 h-6 fill-current text-white`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center w-[50%] w-full rounded-[10px] mt-3">
              <div className="relative w-full">
                <select
                  className="text-center w-full h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[10px] appearance-none pl-3 pr-8 text-[20px] text-[#fff] font-semibold "
                  name="savedSchedules"
                  onChange={(e) => setSelectedRadius(e.target.value)}
                >
                  <option selected={selectedRadius === null} value={null}>
                    Radius
                  </option>
                  {Radius.map((item) => (
                    <option
                      key={item}
                      selected={selectedRadius === item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
                <div className="absolute top-2 right-2">
                  <svg
                    className={`w-6 h-6 fill-current text-white`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-grow justify-between items-center gap-4 mt-5">
            <div className="flex flex-col items-start w-[50%] ">
              <p className="text-[18px] text-[#000] text-start font-bold change-font-family w-full pb-0">
                Sex
              </p>
              <div className="relative flex flex-wrap items-center justify-between w-full gap-4 sm:gap-5   rounded-2xl">
                <select
                  className="text-center w-full h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[10px] appearance-none pl-3 pr-8 text-[20px] text-[#fff] font-semibold "
                  onChange={handleGenderChange}
                  name="gender"
                  value={selectedGender}
                  size="35px"
                >
                  {genderOptions.map((selectedGender) => (
                    <option key={selectedGender} value={selectedGender}>
                      {selectedGender}
                    </option>
                  ))}
                </select>
                <img
                  src="images/Mask group (1).png"
                  alt=""
                  className="absolute pl-1 top-1 left-1 z-10"
                />
                <div className="absolute top-2 right-2">
                  <svg
                    className={`w-6 h-6 fill-current text-white`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center w-[50%] rounded-[10px]">
              <p className="text-[18px] text-[#000] text-start font-bold change-font-family w-full pb-0">
                Orientation
              </p>
              <div className="relative w-full">
                <select
                  className="text-center w-full h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[10px] appearance-none pl-3 pr-8 text-[20px] text-[#fff] font-semibold "
                  name="savedSchedules"
                  value={selectedOrientation}
                  onChange={handleOrientationChange}
                >
                  {orientationOptions.map((orientation) => (
                    <option key={orientation} value={orientation}>
                      {orientation}
                    </option>
                  ))}
                </select>
                <div className="absolute top-2 right-2">
                  <svg
                    className={`w-6 h-6 fill-current text-white`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-grow justify-between items-center gap-4 mt-5">
            <div className="flex flex-col items-center w-[50%] rounded-[10px]">
              <p className="text-[18px] text-[#000] text-start font-bold change-font-family w-full pb-0">
                Venue
              </p>
              <div className="relative w-full">
                <select
                  className="text-center w-full h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[10px] appearance-none pl-3 pr-8 text-[20px] text-[#fff] font-semibold "
                  name="savedSchedules"
                  onChange={(e) => setSelectedVenue(e.target.value)}
                >
                  <option selected={selectedVenue === "Incall"} value="Incall">
                    Incall
                  </option>
                  <option
                    selected={selectedVenue === "Outcall"}
                    value="Outcall"
                  >
                    Outcall
                  </option>
                  <option selected={selectedVenue === "Mobile"} value="Mobile">
                    Mobile
                  </option>
                </select>
                <div className="absolute top-2 right-2">
                  <svg
                    className={`w-6 h-6 fill-current text-white`}
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start w-[50%]">
              <p className="text-[18px] text-[#000] text-start font-bold change-font-family w-full pb-0">
                TruRevu
              </p>
              <div className="w-full flex justify-center items-center gap-2 ">
                <div className="flex relative flex-wrap items-center justify-between w-full gap-2 sm:gap-5   rounded-2xl">
                  <select
                    className="w-full h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[10px] appearance-none pl-1 text-left text-[20px] text-[#fff] font-semibold "
                    onChange={(e) =>
                      setSelectedTruRevuStart({
                        ...selectedTruRevuStart,
                        from: e.target.value,
                      })
                    }
                    value={selectedTruRevuStart.from}
                    size="35px"
                  >
                    <option value="0.0">0.0</option>
                    <option value="1.0">1.0</option>
                    <option value="1.5">1.5</option>
                    <option value="2.0">2.0</option>
                    <option value="2.5">2.5</option>
                    <option value="3.0">3.0</option>
                    <option value="3.5">3.5</option>
                    <option value="4.0">4.0</option>
                    <option value="4.5">4.5</option>
                    <option value="5.0">5.0</option>
                  </select>
                  <div className="absolute top-2 right-1">
                    <svg
                      className={`w-6 h-6 fill-current text-white`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
                <p className="text-[14px] font-bold text-[#01195C] px-0">to</p>
                <div className="relative flex flex-wrap items-center justify-between w-full gap-2 sm:gap-5   rounded-2xl">
                  <select
                    className=" w-full h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-[10px] appearance-none pl-1 text-left text-[20px] text-[#fff] font-semibold "
                    onChange={(e) =>
                      setSelectedTruRevuStart({
                        ...selectedTruRevuStart,
                        to: e.target.value,
                      })
                    }
                    value={selectedTruRevuStart.to}
                    size="35px"
                  >
                    <option value="1.0">1.0</option>
                    <option value="1.5">1.5</option>
                    <option value="2.0">2.0</option>
                    <option value="2.5">2.5</option>
                    <option value="3.0">3.0</option>
                    <option value="3.5">3.5</option>
                    <option value="4.0">4.0</option>
                    <option value="4.5">4.5</option>
                    <option value="5.0">5.0</option>
                  </select>
                  <div className="absolute top-2 right-1">
                    <svg
                      className={`w-6 h-6 fill-current text-white`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto flex flex-row justify-center items-center mb-2 mt-5 ">
          <Button
            onClick={HandleSearch}
            disabled={loading}
            text={loading ? "Loading.." : "Search"}
            className={
              "max-w-[200px] font-black text-[22px] from-0% to-65% from-[#0CA36C] to-[#08FA5A] bg-gradient-to-b text-[#040C50] rounded-[10px]"
            }
            size={"40px"}
          />
        </div>
        <div className="w-full mx-auto flex flex-row justify-center items-center mb-2 mt-5 ">
          <Button
            onClick={() => {
              navigate("/vairify-advance-search", {
                state: {
                  state: {
                    category,
                    radius: selectedRadius,
                    gender: selectedGender,
                    orientation: selectedOrientation,
                    venue: selectedVenue,
                    trurevu: selectedTruRevuStart,
                    userId: UserData?._id,
                  },
                  AllData: {},
                },
              });
            }}
            text="Advance Search"
            className={
              "max-w-[200px] font-black text-[20px] from-0% to-65% from-[#02227E] to-[#0247FF] bg-gradient-to-b text-[#FFFFFF] rounded-[10px] button-border"
            }
          />
        </div>
      </div>
    </div>
  );
}
