import { useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleGetProfile,
  HandleProfile,
  UpdateProfile,
} from "../../redux/action/Profile";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Index";
import { HandleCountry } from "../../redux/action/Auth";
import { useLocation, useNavigate } from "react-router-dom";

const Ethnicity = [
  "White",
  "Latina",
  "Asian",
  "African American",
  "Native American",
  "French",
  "German",
  "Italian",
  "Middle Eastern",
  "English",
  "South American",
  "Baltic",
  "Hawaiian",
  "Eastern European",
  "Spanish",
  "Indian",
  "Mixed",
];
const Nationality = [
  "American",
  "Argentinian",
  "Armenian ",
  "Australian ",
  "Austrian ",
  "Belarussian ",
  "Belgian ",
  "Brazilian ",
  "British ",
  "Bulgarian ",
  "Canadian ",
  "Chinese ",
  "Colombian ",
  "Czech ",
  "Dutch ",
  "English ",
  "Estonian ",
  "Filipino ",
  "French ",
  "German ",
  "Ghanaian ",
  "Greek ",
  "Hungarian ",
  "Indian ",
  "Indonesian ",
  "Italian ",
  "Japanese ",
  "Kazakh ",
  "Kenyan ",
  "Korean ",
  "Latvian ",
  "Lebanese ",
  "Lithuanian ",
  "Malaysian ",
  "Mexican ",
  "Moldovan ",
  "Moroccan ",
  "Nigerian ",
  "Polish ",
  "Portuguese ",
  "Romanian ",
  "Russian ",
  "Singaporean ",
  "South african ",
  "Spanish ",
  "Swedish ",
  "Tanzanian ",
  "Thai ",
  "Turkish ",
  "Ukrainian ",
  "Venezuelan ",
  "Vietnamese ",
];
const Age = [
  "18 - 20",
  "21 - 25",
  "26 - 30",
  "31 - 35",
  "36 - 40",
  "41 - 45",
  "46 - 50",
  "Over 50",
];
const Build = [
  "Average",
  "Slender",
  "Athletic",
  "Very muscular",
  "Curvy",
  "Few Extra Pounds",
  "Flabby",
  "Plus Size",
];
const HairLength = [
  "Bald ",
  "Super short",
  "Short",
  "Chin length",
  "Shoulder length",
  "Below shoulders",
  "Mid back",
  "Ass length",
  "Super long",
];
const HairColor = ["Bleached", "Blonde", "Brown", "Black", "Red", "Other"];
const HairStyle = ["Straight", "Some curls", "Curly", "Permed", "Other"];
const Eyes = ["Blue", "Brown", "Green", "Hazel", "Grey", "Black"];
let Country = [];
const Smoker = ["Yes", "No"];

const Weight = [
  "45kg / 99lbs or less",
  "46-50kg / 101-110 lbs",
  "51- 55kg / 112-121 lbs",
  "56-60kg / 123-132 lbs",
  "61-65kg / 134-143 lbs",
  "66-70kg / 146- 154 lbs",
  "71-90kg / 157 - 198 lbs",
  "91- 110kg / 201- 243 lbs",
  "111 / 245 lbs  and Over",
];
const PubicHair = ["Natural", "Partially shaved", "Shaved"];
const Piercings = [
  "None",
  "Tongue",
  "Breasts",
  "Belly button",
  "Pussy",
  "Face Tongue",
  "Tongue and breasts",
  "Breasts Tongue",
  "Pussy Breast",
  "Pussy Other",
];
const BreastCup = ["A", "B", "C", "D", "DD", "DDD", "E or higher"];

const BreastAppearance = [
  "Flat",
  "Average",
  "Youthful",
  "Perky",
  "Rock hard",
  "Super nice",
  "Droopy",
  "Really saggy",
  "Unattractive",
  "Unnatural",
];
const BreastType = ["Natural", "Augmented (Implants)"];

const DickSize = [
  "10cm / 3.94 inches",
  "11cm / 4.33 inches",
  "12cm / 4.72 inches",
  "13cm / 5.12 inches",
  "14cm / 5.51 inches",
  "15cm / 5.91 inches",
  "16cm / 6.30 inches",
  "17cm / 6.69 inches",
  "18cm / 7.09 inches",
  "19cm / 7.48 inches",
  "20cm / 7.87 inches",
  "21cm / 8.27 inches",
  "22cm / 8.66 inches",
  "23cm / 9.06 inches",
];

const Tattoos = ["None", "One", "A few", "Many", "Many"];

const Travel = ["Local", "State/Province", "Country", "Worldwide (FMTY)"];

const Venue = ["Incall", "Outcall"];

const Virtual = ["Video", "Voice", "Sexting", "Photo/Videos"];

const Pornstar = ["Yes", "No"];

const Communication = ["App Only", "Outside Number", "Both"];
const OnlyFans = ["Yes", "No"];
const SocialMedia = [
  "OnlyFans",
  "Facebook",
  "YouTube",
  "WhatsApp",
  "Instagram",
  "Twitter",
  "TikTok",
  "Snapchat",
  "LinkedIn",
  "Pinterest",
  "Reddit",
  "Telegram",
  "WeChat",
  "QQ",
  "QZone",
  "Sina Weibo",
  "Tumblr",
  "Viber",
  "Baidu Tieba",
  "Quora",
  "LINE",
  "Twitch",
  "KakaoTalk",
  "Douban",
  "Medium",
  "Vkontakte (VK)",
  "Odnoklassniki",
  "Taringa!",
  "Mixi",
  "Flickr",
  "Swarm",
  "Meetup",
  "Nextdoor",
  "Tagged",
  "Badoo",
  "MySpace",
  "Viadeo",
  "Youku",
  "Xing",
  "Twoo",
];
const Staff = [
  "1 to 5 Employees",
  "5 to 10 Employees",
  "10 to 20 Employees",
  "20 to 50 Employees",
  "50 and up Employees",
  "Virtual Employees",
];
const TypeOfBusiness = [
  "Strip Club",
  "Escort Agency",
  "Massage Parlor",
  "Organization",
  "Support",
  "Forum/Publication",
];
let Location = [];
const BreastSize = ["A", "B", "C", "D", "DD", "DDD", "E or higher"];

const PersonalInformationOrientation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const UserAuth = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const countryData = useSelector((state) => state?.Auth?.country);
  const [userProfile, setUserProfile] = useState({});
  const [optionData, setOptionDate] = useState({});
  const [City, setCity] = useState([]);
  const [genderOptions, setGenderOptions] = useState([
    "Male",
    "Female",
    "Trans Male Pre-Op",
    "Trans Female Pre-Op",
    "Trans Male Post-Op",
    "Trans Female Post-Op",
  ]);
  const [selectedGender, setSelectedGender] = useState("Male");
  const [orientationOptions, setOrientationOptions] = useState([
    "M4W",
    "M4M",
    "Bisexual",
  ]);
  const [selectedOrientation, setSelectedOrientation] = useState("M4W");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [heightOptions, setHeightOptions] = useState([]);
  const [FacialHair, setFacialHair] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  // Function to update orientation options based on selected gender
  const updateOrientationOptions = (selectedGender) => {
    if (selectedGender === "Male") {
      setOrientationOptions(["M4W", "M4M", "Bisexual"]);
      setHeightOptions([
        "5'0\" - 5'5\"",
        "5'5\" - 5'8\"",
        "5'9\" - 5'11\"",
        "6'0\" - 6'2\"",
        "6'3\" - 6'5\"",
        "6'5\" or 6'7\"",
        "6'8\" or taller",
      ]);
      setFacialHair(["clean shaven", "mustache", "Beard"]);
    } else if (selectedGender === "Female") {
      setOrientationOptions(["W4M", "W4W", "Bisexual"]);
      setHeightOptions([
        "4'9\" - 4'11\"",
        "5'0\" - 5'2\"",
        "5'3\" - 5'5\"",
        "5'6\" - 5'8\"",
        "5'9\" - 5'11\"",
        "6'0\" - 6'2\"",
        "6'3\" - 6'5\"",
        "6'5\" or Taller",
      ]);
      setFacialHair([]); // No facial hair options for females
    } else if (selectedGender.startsWith("Trans Male")) {
      setHeightOptions([
        "5'0\" - 5'5\"",
        "5'5\" - 5'8\"",
        "5'9\" - 5'11\"",
        "6'0\" - 6'2\"",
        "6'3\" - 6'5\"",
        "6'5\" or 6'7\"",
        "6'8\" or taller",
      ]);
      setFacialHair(["clean shaven", "mustache", "Beard"]);
    } else if (selectedGender.startsWith("Trans Female")) {
      setHeightOptions([
        "4'9\" - 4'11\"",
        "5'0\" - 5'2\"",
        "5'3\" - 5'5\"",
        "5'6\" - 5'8\"",
        "5'9\" - 5'11\"",
        "6'0\" - 6'2\"",
        "6'3\" - 6'5\"",
        "6'5\" or Taller",
      ]);
      setFacialHair([]); // No facial hair options for trans females
    } else if (selectedGender.startsWith("Trans")) {
      setOrientationOptions(["T4W", "T4M", "Bisexual"]);
      setHeightOptions([]);
      setFacialHair([]); // No facial hair options for trans individuals
    } else {
      setOrientationOptions([]);
      setHeightOptions([]);
      setFacialHair([]); // No facial hair options for other genders
    }
  };

  // Event handler for gender select change
  const handleGenderChange = (event) => {
    HandleOption(event);
    const selectedGender = event.target.value;
    setSelectedGender(selectedGender);
    updateOrientationOptions(selectedGender);
  };

  // Event handler for orientation select change
  const handleOrientationChange = (event) => {
    HandleOption(event);
    const selectedOrientation = event.target.value;
    setSelectedOrientation(selectedOrientation);
  };

  useEffect(() => {
    updateOrientationOptions(selectedGender);
  }, [selectedGender]);

  const HandleOption = (event) => {
    setOptionDate({ ...optionData, [event.target.name]: event.target.value });
  };

  const HandleSubmit = () => {
    setIsLoading(true);
    optionData.gender = selectedGender;
    optionData.orientation = selectedOrientation;
    optionData.userId = UserAuth?._id;
    optionData.siteId = UserAuth?.vaiID;

    state?.parentPage === "setup"
      ? dispatch(HandleProfile(optionData))
        .then((result) => {
          if (result?.payload?.status === 200) {
            toast(result?.payload?.data?.message, {
              hideProgressBar: true,
              autoClose: 1000,
              type: "success",
            });
            setIsLoading(false);
            navigate("/setup");
          } else {
            toast(result?.payload?.data?.error, {
              hideProgressBar: true,
              autoClose: 1000,
              type: "error",
            });
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err, "Error");
        })
      : dispatch(UpdateProfile(optionData))
        .then((result) => {
          if (result?.payload?.status === 200) {
            toast(result?.payload?.data?.message, {
              hideProgressBar: true,
              autoClose: 1000,
              type: "success",
            });
            setIsLoading(false);
            navigate("/settings");
          } else {
            toast(result?.payload?.data?.error, {
              hideProgressBar: true,
              autoClose: 1000,
              type: "error",
            });
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err, "Error");
        });
  };
  useMemo(() => {
    const cityNames = [];
    const countryNames = [];

    countryData?.map((item) => {
      const name = item.name;
      if (optionData?.country === name) {
        item?.cities?.map((city) => cityNames.push(city?.name));
      }
      countryNames.push(name);
    });

    Country = countryNames;
    Location = countryNames;

    setCity(cityNames?.filter(Boolean));
  }, [countryData]);

  useEffect(() => {
    const cityNames = [];
    countryData?.map((item) => {
      if (optionData?.country === item.name) {
        item?.cities?.map((city) => cityNames.push(city?.name));
      }
    });
    setCity(cityNames?.filter(Boolean));
  }, [optionData?.country]);

  useEffect(() => {
    dispatch(HandleCountry());
  }, []);

  useEffect(() => {
    if (UserAuth?._id) {
      dispatch(HandleGetProfile(UserAuth._id))
        .then((response) => {
          setUserProfile(response?.payload);
        })
        .catch((error) => console.log(error));
    }
  }, [UserAuth]);

  useEffect(() => {
    if (orientationOptions?.length) {
      setSelectedOrientation(orientationOptions[0]);
    }
  }, [orientationOptions]);

  useEffect(() => {
    if (userProfile?._id) {
      setOptionDate((prev) => ({ ...prev, ...userProfile }));

      if (userProfile?.country) {
        setSelectedCountry(userProfile?.country);
        setOptionDate((prev) => ({
          ...prev,
          country: userProfile?.country,
        }));
      } else {
        setSelectedCountry(Country?.[0]);
        setOptionDate((prev) => ({
          ...prev,
          country: Country?.[0],
        }));
      }

      if (userProfile?.gender) {
        setSelectedGender(userProfile?.gender);
      }

      if (userProfile?.orientation) {
        setSelectedOrientation(userProfile.orientation);
      }
    }
  }, [userProfile]);

  return (
    <div>
      <h1 className="text-[27px] font-black text-center font-roboto pt-2">
        Personal information
      </h1>
      {
        // Client Personal information
      }
      {UserAuth?.user_type === "client-hobbyist" && (
        <div>
          <div className="w-full bg-gradient-to-t from-[#0247FF] to-[#02227EAD] h-[10px] w-full"></div>
          {/* <h1 className="text-[27px] text-[#000] text-center font-black font-robotot pt-2">
            Personal information
          </h1> */}
          <div className="flex flex-col items-center justify-center px-5 pt-[10px]">
            <div className="flex justify-between items-center w-full max-w-[420px]">
              <div className="flex flex-col items-start w-[45%]">
                <p className="text-[16px] text-[#000] text-start font-bold font-roboto-serif w-full">
                  Gender
                </p>
                <div className="flex flex-wrap items-center justify-between w-full gap-2 sm:gap-5">
                  <select
                    className="px-2 pt-px bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[18px] text-[#fff] text-center font-bold font-inter min-w-[fit] w-full h-[35px]"
                    value={selectedGender}
                    name="gender"
                    onChange={handleGenderChange}
                  >
                    {genderOptions?.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col items-start w-[45%]">
                <p className="text-[16px] text-[#000] text-start font-bold font-roboto-serif w-full">
                  Orientation
                </p>
                <div className="flex flex-wrap items-center justify-between w-full gap-2 sm:gap-5">
                  <select
                    className="px-2 pt-px bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[18px] text-[#fff] text-center font-bold font-inter min-w-[fit] w-full h-[35px]"
                    value={selectedOrientation}
                    name="orientation"
                    onChange={handleOrientationChange} // Add this line
                  >
                    {orientationOptions?.map((orientation) => (
                      <option key={orientation} value={orientation}>
                        {orientation}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 w-full gap-x-5 gap-y-2.5 mt-5 pb-2">
              <div className="border-2 border-[#767882] rounded-3xl flex  items-center px-2 w-[100%] h-[36px]">
                <p className="text-[14.4px] text-[#000] font-bold font-roboto leading-4 px-[25px]">
                  Site ID {UserAuth?.vaiID}
                </p>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="age"
                  onChange={HandleOption}
                  value={optionData?.age}
                >
                  <option selected disabled>
                    Age
                  </option>
                  {Age?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="country"
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    HandleOption(e);
                  }}
                  value={selectedCountry}
                >
                  <option selected disabled>
                    Country
                  </option>
                  {Country?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="city"
                  onChange={HandleOption}
                  value={optionData?.city}
                >
                  {City?.length > 0 ? (
                    <>
                      <option selected disabled>
                        City
                      </option>
                      {City?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option selected disabled value="">
                      N/A
                    </option>
                  )}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="ethinicity"
                  onChange={HandleOption}
                  value={optionData?.ethinicity}
                >
                  <option selected disabled>
                    Ethinicity
                  </option>
                  {Ethnicity.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="nationality"
                  onChange={HandleOption}
                  value={optionData?.nationality}
                >
                  <option selected disabled>
                    Nationality
                  </option>
                  {Nationality?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="smoker"
                  onChange={HandleOption}
                  value={optionData?.smoker}
                >
                  <option selected disabled>
                    Smoker
                  </option>
                  {Smoker.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {UserAuth?.user_type !== "client-hobbyist" && (
                <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                  <select
                    className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                    name="languages"
                    onChange={HandleOption}
                    value={optionData?.languages}
                  >
                    <option selected disabled>
                      Languages
                    </option>
                    {Country.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {UserAuth?.user_type === "client-hobbyist" && (
                <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                  <select
                    className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                    name="communication"
                    onChange={HandleOption}
                    value={optionData?.communication}
                  >
                    <option selected disabled>
                      Communication
                    </option>
                    {Communication.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {UserAuth?.user_type === "client-hobbyist" && (
                <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                  <select
                    className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                    name="socialmedia"
                    onChange={HandleOption}
                    value={optionData?.socialmedia}
                  >
                    <option selected disabled>
                      Social Media
                    </option>
                    {SocialMedia.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {
        // Business Personal information
      }
      {UserAuth?.user_type === "agency-business" && (
        <div>
          <div className="w-full bg-gradient-to-t from-[#0247FF] to-[#02227EAD] h-[10px] w-full mt-1"></div>
          {/* <h1 className="text-[27px] text-[#000] text-center font-black font-robotot pt-2">
            Business Information
          </h1> */}
          <div className="flex flex-col items-center justify-center px-5 pt-[10px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 w-full gap-x-5 gap-y-2.5 mt-5 pb-2">
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="typeofbusiness"
                  onChange={HandleOption}
                  value={optionData?.typeofbusiness}
                >
                  <option selected disabled>
                    Type Of Business
                  </option>
                  {TypeOfBusiness.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="staff"
                  onChange={HandleOption}
                  value={optionData?.staff}
                >
                  <option selected disabled>
                    Staff
                  </option>
                  {Staff.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="virtual"
                  onChange={HandleOption}
                  value={optionData?.virtual}
                >
                  <option selected disabled>
                    Virtual
                  </option>
                  {Virtual.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="location"
                  onChange={HandleOption}
                  value={optionData?.location}
                >
                  <option selected disabled>
                    Location
                  </option>
                  {Location.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="venue"
                  onChange={HandleOption}
                  value={optionData?.venue}
                >
                  <option selected disabled>
                    Venue
                  </option>
                  {Venue.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="communication"
                  onChange={HandleOption}
                  value={optionData?.communication}
                >
                  <option selected disabled>
                    Communication/Contact
                  </option>
                  {Communication.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="socialmedia"
                  onChange={HandleOption}
                  value={optionData?.socialmedia}
                >
                  <option selected disabled>
                    Social Media
                  </option>
                  {SocialMedia.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="virtualservices"
                  onChange={HandleOption}
                  value={optionData?.virtualservices}
                >
                  <option selected disabled>
                    Virtual Services
                  </option>
                  {Virtual.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {
        // Companion Personal information
      }
      {UserAuth?.user_type === "companion-provider" && (
        <div>
          <div className="w-full bg-gradient-to-t from-[#0247FF] to-[#02227EAD] h-[10px] w-full mt-1"></div>
          {/* <h1 className="text-[27px] text-[#000] text-center font-black font-robotot pt-2">
            Personal information
          </h1> */}
          <div className="flex flex-col items-center justify-center px-5 pt-[10px]">
            <div className="flex justify-between items-center w-full max-w-[420px]">
              <div className="flex flex-col items-start w-[45%]">
                <p
                  className="text-[16px] text-[#000] text-start font-bold font-roboto-serif w-full"
                  name="gender"
                >
                  Gender
                </p>
                <div className="flex flex-wrap items-center justify-between w-full gap-2 sm:gap-5">
                  <select
                    className="px-2 pt-px bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[18px] text-[#fff] text-center font-bold font-inter min-w-[fit] w-full h-[35px]"
                    value={selectedGender}
                    name="gender"
                    onChange={handleGenderChange}
                  >
                    {genderOptions.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col items-start w-[45%]">
                <p className="text-[16px] text-[#000] text-start font-bold font-roboto-serif w-full">
                  Orientation
                </p>
                <div className="flex flex-wrap items-center justify-between w-full gap-2 sm:gap-5">
                  <select
                    className="px-2 pt-px bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[18px] text-[#fff] text-center font-bold font-inter min-w-[fit] w-full h-[35px]"
                    value={selectedOrientation}
                    name="orientation"
                    onChange={handleOrientationChange}
                  >
                    {orientationOptions.map((orientation) => (
                      <option key={orientation} value={orientation}>
                        {orientation}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 w-full gap-x-5 gap-y-2.5 mt-5 pb-2">
              <div className="border-2 border-[#767882] rounded-3xl flex  items-center px-2 w-[100%] h-[36px]">
                <p className="text-[14.4px] text-[#000] font-bold font-roboto leading-4 px-[25px]">
                  Site ID ({UserAuth?.vaiID})
                </p>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="age"
                  onChange={HandleOption}
                  value={optionData?.age}
                >
                  <option selected disabled>
                    Age
                  </option>
                  {Age?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="country"
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    HandleOption(e);
                  }}
                  value={selectedCountry}
                >
                  <option selected disabled>
                    Country
                  </option>
                  {Country.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="city"
                  onChange={HandleOption}
                  value={optionData?.city}
                >
                  {City?.length > 0 ? (
                    <>
                      <option selected disabled>
                        City
                      </option>
                      {City?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option selected value={undefined}>
                      N/A
                    </option>
                  )}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="ethinicity"
                  onChange={HandleOption}
                  value={optionData?.ethinicity}
                >
                  <option selected disabled>
                    Ethinicity
                  </option>
                  {Ethnicity.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="nationality"
                  onChange={HandleOption}
                  value={optionData?.nationality}
                >
                  <option selected disabled>
                    Nationality
                  </option>
                  {Nationality.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="smoker"
                  onChange={HandleOption}
                  value={optionData?.smoker}
                >
                  <option selected disabled>
                    Smoker
                  </option>
                  {Smoker.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="languages"
                  onChange={HandleOption}
                  value={optionData?.languages}
                >
                  <option selected disabled>
                    Languages
                  </option>
                  {Country.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      {
        // Companion Personal Appearance
      }
      {UserAuth?.user_type === "companion-provider" && (
        <div>
          <div className="w-full bg-gradient-to-t from-[#0247FF] to-[#02227EAD] h-[10px] w-full mt-4"></div>
          <h1 className="text-[27px] text-[#000] text-center font-black font-robotot pt-2">
            Personal Appearance
          </h1>

          <div className="flex flex-col items-center justify-center px-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 w-full gap-x-5 gap-y-2.5 mt-5 pb-2">
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="build"
                  onChange={HandleOption}
                  value={optionData?.build}
                >
                  <option selected disabled>
                    Build
                  </option>
                  {Build.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="height"
                  onChange={HandleOption}
                  value={optionData?.height}
                >
                  <option selected disabled>
                    Height
                  </option>
                  {heightOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="eyescolor"
                  onChange={HandleOption}
                  value={optionData?.eyescolor}
                >
                  <option selected disabled>
                    Eyes Color
                  </option>
                  {Eyes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="hairtype"
                  onChange={HandleOption}
                >
                  <option selected disabled>
                    Hair Type
                  </option>
                  {HairStyle.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute top-2 right-2">
                  <svg
                    className={`w-6 h-6 fill-current text-white`}
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 12l-6-6h12l-6 6z"
                    />
                  </svg>
                </div>
              </div>

              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="haircolor"
                  onChange={HandleOption}
                  value={optionData?.haircolor}
                >
                  <option selected disabled>
                    Hair Color
                  </option>
                  {HairColor.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="hairlength"
                  onChange={HandleOption}
                  value={optionData?.hairlength}
                >
                  <option selected disabled>
                    Hair Length
                  </option>
                  {HairLength.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="weight"
                  onChange={HandleOption}
                  value={optionData?.weight}
                >
                  <option selected disabled>
                    Weight
                  </option>
                  {Weight.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="publichair"
                  onChange={HandleOption}
                  value={optionData?.publichair}
                >
                  <option selected disabled>
                    Public Hair
                  </option>
                  {PubicHair.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="piercings"
                  onChange={HandleOption}
                  value={optionData?.piercings}
                >
                  <option selected disabled>
                    Piercings
                  </option>
                  {Piercings.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {selectedGender === "Female" ||
                selectedGender.startsWith("Trans") ? (
                <>
                  <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                    <select
                      className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                      name="breasttype"
                      onChange={HandleOption}
                      value={optionData?.breasttype}
                    >
                      <option selected disabled>
                        Breast Type
                      </option>
                      {BreastType.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                    <select
                      className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                      name="breastsize"
                      onChange={HandleOption}
                      value={optionData?.breastsize}
                    >
                      <option selected disabled>
                        Breast Size
                      </option>
                      {BreastSize.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                    <select
                      className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                      name="breastappearance"
                      onChange={HandleOption}
                      value={optionData?.breastappearance}
                    >
                      <option selected disabled>
                        Breast Appearance
                      </option>
                      {BreastAppearance.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : null}
              {selectedGender === "Male" ||
                selectedGender === "Female" ||
                selectedGender.startsWith("Trans") ? (
                <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                  <select
                    className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                    name="tattoos"
                    onChange={HandleOption}
                    value={optionData?.tattoos}
                  >
                    <option selected disabled>
                      Tattoos
                    </option>
                    {Tattoos.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              {selectedGender === "Male" ||
                selectedGender.startsWith("Trans") ? (
                <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                  <select
                    className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                    name="dicksize"
                    onChange={HandleOption}
                    value={optionData?.dicksize}
                  >
                    <option selected disabled>
                      Dick Size
                    </option>
                    {DickSize.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {
        // Companion Availability/Services
      }
      {UserAuth?.user_type === "companion-provider" && (
        <>
          <div className="w-full bg-gradient-to-t from-[#0247FF] to-[#02227EAD] h-[10px] w-full mt-4"></div>

          <h1 className="text-[27px] text-[#000] text-center font-black font-robotot pt-2">
            Availability/Services
          </h1>

          <div className="flex flex-col items-center justify-center px-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 w-full gap-x-5 gap-y-2.5 mt-5 pb-2">
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="travel"
                  onChange={HandleOption}
                  value={optionData?.travel}
                >
                  <option selected disabled>
                    Travel
                  </option>
                  {Travel.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="venue"
                  onChange={HandleOption}
                  value={optionData?.venue}
                >
                  <option selected disabled>
                    Venue
                  </option>
                  {Venue.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {selectedGender === "Male" || selectedGender === "Female" ? (
                <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                  <select
                    className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                    name="onlyfans"
                    onChange={HandleOption}
                    value={optionData?.onlyfans}
                  >
                    <option selected disabled>
                      Only Fans
                    </option>
                    {OnlyFans.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                  <select
                    className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                    name="socialmedia"
                    onChange={HandleOption}
                    value={optionData?.socialmedia}
                  >
                    <option selected disabled>
                      Social Media
                    </option>
                    {SocialMedia.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="virtualservice"
                  onChange={HandleOption}
                  value={optionData?.virtualservice}
                >
                  <option selected disabled>
                    Virtual Service
                  </option>
                  {Virtual.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="pornstar"
                  onChange={HandleOption}
                  value={optionData?.pornstar}
                >
                  <option selected disabled>
                    Pornstar
                  </option>
                  {Pornstar.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-[#767882] rounded-3xl flex justify-center items-center max-w-[319px]:px-2 max-[560px]:px-[7px] sm:px-5 w-[100%] h-[36px]">
                <select
                  className="bg-transparent px-3 py-1.5 w-full font-bold focus:outline-none"
                  name="communication"
                  onChange={HandleOption}
                  value={optionData?.communication}
                >
                  <option selected disabled>
                    Communication
                  </option>
                  {Communication.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-col items-center justify-center px-5">
        <div className="w-full mt-7">
          <div className="text-[14.4px] text-roboto text-[#000] text-start font-bold">
            {UserAuth?.user_type === "companion-provider" ? (
              <span>About Me</span>
            ) : null}
            {UserAuth?.user_type === "client-hobbyist" ? (
              <span>About Me</span>
            ) : null}
            {UserAuth?.user_type === "agency-business" ? (
              <span>About Us</span>
            ) : null}
          </div>
          <textarea
            id="profile_information_description"
            rows="3"
            className="block p-2 w-full text-[18px] text-[#000] bg-transparent rounded-lg border-2 border-[#767882] focus:ring-blue-500 focus:border-blue-500 "
            placeholder="Share something that describes you"
            name="description"
            onChange={HandleOption}
            value={optionData?.description}
          ></textarea>
        </div>
        <div className="flex items-center justify-center w-full max-w-[420px] my-5">
          <Button
            className={
              "flex items-center px-[40px] py-2 my-2 w-fit justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] py-2 rounded-xl"
            }
            text={
              !isLoading ? (
                "Submit"
              ) : (
                <div className="flex items-center	justify-center pt-[6px]">
                  <Loading />
                </div>
              )
            }
            size="42px"
            onClick={HandleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationOrientation;
