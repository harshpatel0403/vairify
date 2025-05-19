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
import Loading from "../../../../components/Loading/Index";
import PageTitle from "../../../../components/PageTitle";

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

      data?.result?.length > 0 ? toast.success(data.message) : toast.warning(data.message);
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
      className="container pb-[48px]"
    >
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"VAIRIFY - NOW"} isSmall={true}/>
      </div>
      <div className="w-full">
        <div className="flex flex-col sm:gap-[24px] gap-[16px] ">
          <div className="flex items-center sm:gap-[24px] gap-[16px] sm:flex-nowrap flex-wrap">
            <div className="relative select-arrow w-full">
              <select
                className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                name="savedSchedules"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option selected={category === "Escort"} value={"Escort"} className="text-black">
                  Escort
                </option>
                <option selected={category === "Massage"} value={"Massage"} className="text-black">
                  Massage
                </option>
                <option selected={category === "Dance"} value={"Dance"} className="text-black">
                  Dance
                </option>
              </select>
            </div>
            <div className="relative select-arrow w-full">
              <select
                className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                name="savedSchedules"
                onChange={(e) => setSelectedRadius(e.target.value)}
              >
                <option selected={selectedRadius === null} value={null} className="text-black">
                  Radius
                </option>
                {Radius.map((item) => (
                  <option
                    key={item}
                    selected={selectedRadius === item}
                    value={item}
                    className="text-black"
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center sm:gap-[24px] gap-[16px] sm:flex-nowrap flex-wrap">
            <div className="relative select-arrow w-full">
              <select
                className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                onChange={handleGenderChange}
                name="gender"
                value={selectedGender}
                size="35px"
              >
                {genderOptions.map((selectedGender) => (
                  <option key={selectedGender} value={selectedGender} className="text-black">
                    {selectedGender}
                  </option>
                ))}
              </select>
              {/* <img
                src="images/Mask group (1).png"
                alt=""
                className="absolute pl-1 top-1 left-1 z-10"
              /> */}
            </div>
            <div className="relative select-arrow w-full">
              <select
                className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                name="savedSchedules"
                value={selectedOrientation}
                onChange={handleOrientationChange}
              >
                {orientationOptions.map((orientation) => (
                  <option key={orientation} value={orientation} className="text-black">
                    {orientation}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-grow justify-between items-center sm:gap-[24px] gap-[16px] sm:flex-nowrap flex-wrap">
            <div className="flex flex-col items-center sm:w-[50%] w-full rounded-[10px]">
              <p className="text-[18px] text-white text-start font-bold w-full">
                Venue
              </p>
              <div className="relative select-arrow w-full">
                <select
                  className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                  name="savedSchedules"
                  onChange={(e) => setSelectedVenue(e.target.value)}
                >
                  <option selected={selectedVenue === "Incall"} value="Incall" className="text-black">
                    Incall
                  </option>
                  <option
                    selected={selectedVenue === "Outcall"}
                    value="Outcall"
                    className="text-black"
                  >
                    Outcall
                  </option>
                  <option selected={selectedVenue === "Mobile"} value="Mobile" className="text-black">
                    Mobile
                  </option>
                </select>

              </div>
            </div>
            <div className="flex flex-col items-start sm:w-[50%] w-full">
              <p className="text-[18px] text-white text-start font-bold w-full">
                TruRevu
              </p>
              <div className="w-full flex justify-center items-center sm:gap-[24px] gap-[16px]">
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    onChange={(e) =>
                      setSelectedTruRevuStart({
                        ...selectedTruRevuStart,
                        from: e.target.value,
                      })
                    }
                    value={selectedTruRevuStart.from}
                    size="35px"
                  >
                    <option value="0.0" className="text-black">0.0</option>
                    <option value="1.0" className="text-black">1.0</option>
                    <option value="1.5" className="text-black">1.5</option>
                    <option value="2.0" className="text-black">2.0</option>
                    <option value="2.5" className="text-black">2.5</option>
                    <option value="3.0" className="text-black">3.0</option>
                    <option value="3.5" className="text-black">3.5</option>
                    <option value="4.0" className="text-black">4.0</option>
                    <option value="4.5" className="text-black">4.5</option>
                    <option value="5.0" className="text-black">5.0</option>
                  </select>

                </div>
                <div className="relative select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    onChange={(e) =>
                      setSelectedTruRevuStart({
                        ...selectedTruRevuStart,
                        to: e.target.value,
                      })
                    }
                    value={selectedTruRevuStart.to}
                    size="35px"
                  >
                    <option value="1.0" className="text-black">1.0</option>
                    <option value="1.5" className="text-black">1.5</option>
                    <option value="2.0" className="text-black">2.0</option>
                    <option value="2.5" className="text-black">2.5</option>
                    <option value="3.0" className="text-black">3.0</option>
                    <option value="3.5" className="text-black">3.5</option>
                    <option value="4.0" className="text-black">4.0</option>
                    <option value="4.5" className="text-black">4.5</option>
                    <option value="5.0" className="text-black">5.0</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex sm:gap-[24px] gap-[16px] mt-[24px]">
          <Button
            onClick={HandleSearch}
            disabled={loading}
            text={loading ? <Loading /> : "Search"}
          />
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
            className='!bg-[#FFFFFF29] secondary-btn'
          />
        </div>

      </div>
    </div>
  );
}
