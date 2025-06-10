import React, { useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleGetProfile,
  HandleProfile,
  UpdateProfile,
} from "../../redux/action/Profile";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Index";
import { HandleCountry, HandleUser } from "../../redux/action/Auth";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import UserService from "../../services/userServices";
import PageTitle from "../../components/PageTitle";

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
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const UserAuth = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const countryData = useSelector((state) => state?.Auth?.country);
  const [userProfile, setUserProfile] = useState({});
  const [optionData, setOptionDate] = useState({});
  const [City, setCity] = useState([]);
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [image, setImage] = useState(`${import.meta.env.VITE_APP_S3_IMAGE}/${UserDetails?.profilePic}` || null);
  const [imagePreview, setImagePreview] = useState(`${import.meta.env.VITE_APP_S3_IMAGE}/${UserDetails?.profilePic}` || null);

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
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [show, setShow] = useState(false);

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
    setIsLoadingSubmit(true);
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
            navigate(-1);
          } else {
            toast(result?.payload?.data?.error, {
              hideProgressBar: true,
              autoClose: 1000,
              type: "error",
            });
            setIsLoadingSubmit(false);
          }
        })
        .catch((err) => {
          setIsLoadingSubmit(false);
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
            setIsLoadingSubmit(false);
            navigate("/settings");
          } else {
            toast(result?.payload?.data?.error, {
              hideProgressBar: true,
              autoClose: 1000,
              type: "error",
            });
            setIsLoadingSubmit(false);
          }
        })
        .catch((err) => {
          setIsLoadingSubmit(false);
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

  const handelUpload = async () => {
    setIsLoading(true);
    if (image) {
      let data = new FormData();
      data.append("userId", UserDetails._id);
      data.append("image", image);
      await UserService.uploadProfileImage(data)
        .then((res) => {
          console.log(res);
          dispatch(HandleUser(UserDetails?._id));
          toast("Profile Pic Uplaoded Successfully", {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          navigate(-1);
        })
        .catch((err) => {
          toast(err?.response?.data?.message || "Something went wrong", {
            type: "error",
            hideProgressBar: false,
          });
        });
    } else {
      toast("Please Upload your profile picture", {
        type: "error",
        hideProgressBar: false,
      });
    }

    setIsLoading(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (Math.round(file?.size / 1024 / 1024 > 1)) {
        toast("Too Large File", {
          type: "error",
          hideProgressBar: false,
        });
      } else {
        setImage(file);
        setShow(true);
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const fileInputRef = React.useRef();

  return (
    <div>
      <div className="container">
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={t("personalinformation.personalinformations")} isSmall={true} />
        </div>
        <div className="mt-[48px]">
          <div className="w-full max-auto flex flex-col justify-center items-center image-upload-data flex-auto">
            <div className="w-full flex flex-col justify-center items-center">
              <div className="flex flex-col justify-center items-center sm:w-[200px] sm:h-[200px] h-[120px] w-[120px] border border-[#ffffff2d] rounded-full !bg-[#FFFFFF14] overflow-hidden">
                {image ? (
                  <img className="h-full view-profile-image " src={imagePreview} />
                ) : (
                  <span className="invert">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="89"
                      height="75"
                      viewBox="0 0 89 75"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M23.7584 9.51738C25.6194 6.37437 26.5499 4.80721 27.8465 3.66548C28.9932 2.65486 30.3422 1.89181 31.8067 1.42543C33.4604 0.900147 35.3038 0.900146 38.995 0.900146H49.601C53.2966 0.900146 55.14 0.900147 56.7937 1.42543C58.2582 1.89181 59.6072 2.65486 60.7539 3.66548C62.0504 4.80721 62.981 6.37437 64.842 9.51738L67.4527 13.9237H70.7602C76.9342 13.9237 80.0212 13.9237 82.3805 15.1045C84.4545 16.1459 86.1402 17.8069 87.1963 19.8494C88.4002 22.1719 88.4002 25.2107 88.4002 31.2884V57.3354C88.4002 63.4131 88.4002 66.4519 87.1963 68.7744C86.1395 70.8153 84.4538 72.4747 82.3805 73.515C80.0212 74.7001 76.9342 74.7001 70.7602 74.7001H17.8402C11.6662 74.7001 8.5792 74.7001 6.21985 73.515C4.14497 72.4754 2.45765 70.816 1.39972 68.7744C0.200196 66.4519 0.200195 63.4131 0.200195 57.3354V31.2884C0.200195 25.2107 0.200196 22.1719 1.39972 19.8494C2.4569 17.8062 4.1443 16.1452 6.21985 15.1045C8.5792 13.9237 11.6662 13.9237 17.8402 13.9237H21.1477L23.7584 9.51738ZM44.3002 61.8937C49.8558 61.8937 55.1839 59.7212 59.1123 55.854C63.0407 51.9869 65.2477 46.742 65.2477 41.2731C65.2477 35.8042 63.0407 30.5592 59.1123 26.6921C55.1839 22.825 49.8558 20.6525 44.3002 20.6525C38.7446 20.6525 33.4165 22.825 29.4881 26.6921C25.5597 30.5592 23.3527 35.8042 23.3527 41.2731C23.3527 46.742 25.5597 51.9869 29.4881 55.854C33.4165 59.7212 38.7446 61.8937 44.3002 61.8937ZM56.2072 41.2731C56.2072 44.3817 54.9527 47.3631 52.7197 49.5612C50.4867 51.7594 47.4581 52.9943 44.3002 52.9943C41.1423 52.9943 38.1137 51.7594 35.8807 49.5612C33.6477 47.3631 32.3932 44.3817 32.3932 41.2731C32.3932 38.1644 33.6477 35.1831 35.8807 32.985C38.1137 30.7868 41.1423 29.5519 44.3002 29.5519C47.4581 29.5519 50.4867 30.7868 52.7197 32.985C54.9527 35.1831 56.2072 38.1644 56.2072 41.2731Z"
                        fill="black"
                      />
                    </svg>
                  </span>
                )}
              </div>
            </div>
            <div className="custom-select-border">
              <p className="text-white text-center mt-4">Profile Picture <span style={{ color: "red" }}>*</span></p>
              <button
                onClick={handleBrowseClick}
                className="photo-upload-btn text-white text-[20px] font-extrabold"
              >
                {t("personalinformation.browse")}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                style={{ display: "none" }}
                accept="image/*"
              />
            </div>
          </div>
          {show ? (<div className="flex justify-center sm:mb-[24px] mb-[16px]">
            <Button
              onClick={handelUpload}
              disabled={isLoading}
              text={isLoading ? <Loading /> : "Upload"}
              className='!w-fit px-8 mt-[28px] !py-3'
            />
          </div>) :
            (
              <div className="flex justify-center sm:mb-[24px] mb-[16px]">
                <Button
                  text={'Browse'}
                  onClick={handleBrowseClick}
                  className="!w-fit px-8 mt-[28px] !py-3"
                />
              </div>
            )
          }
        </div>
        {
          // Client Personal information
        }
        {UserAuth?.user_type === "client-hobbyist" && (
          <div>
            {/* <h1 className="text-[27px] text-[#000] text-center font-black font-robotot pt-2">
            Personal information
          </h1> */}
            <div className="flex flex-col items-center justify-center  pt-[40px]">
              <div className="flex items-center w-full gap-[16px] sm:flex-row flex-col">
                <div className="flex flex-col items-start w-full">
                  {/* <p className="text-[16px] text-[#000] text-start font-bold font-roboto-serif w-full">
                    Gender
                  </p> */}
                  <div className="select-arrow w-full">
                    <select
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      value={selectedGender}
                      name="gender"
                      onChange={handleGenderChange}
                      placeholder={"Gender *"}
                    >
                      <option selected disabled>Gender *</option>
                      {genderOptions?.map((gender) => (
                        <option key={gender} value={gender} className="text-black">
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col items-start w-full">
                  {/* <p className="text-[16px] text-[#000] text-start font-bold font-roboto-serif w-full">
                    Orientation
                  </p> */}
                  <div className="select-arrow w-full">
                    <select
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      value={selectedOrientation}
                      name="orientation"
                      onChange={handleOrientationChange}
                      placeholder="Orientation"
                    >
                      {orientationOptions?.map((orientation) => (
                        <option key={orientation} value={orientation} className="text-black">
                          {orientation}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 w-full gap-[16px] mt-[16px] pb-2">
                <div className="border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]">
                  Site ID {UserAuth?.vaiID}
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="age"
                    onChange={HandleOption}
                    value={optionData?.age}
                  >
                    <option selected disabled>
                      Age
                    </option>
                    {Age?.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>

                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
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
                      <option key={option} value={option} className="text-black" >
                        {option}
                      </option>
                    ))}
                  </select>

                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
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
                          <option key={option} value={option} className="text-black" >
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
                <div className="select-arrow w-full]">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="ethinicity"
                    onChange={HandleOption}
                    value={optionData?.ethinicity}
                  >
                    <option selected disabled>
                      Ethinicity
                    </option>
                    {Ethnicity.map((option) => (
                      <option key={option} value={option} className="text-black" >
                        {option}
                      </option>
                    ))}
                  </select>

                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="nationality"
                    onChange={HandleOption}
                    value={optionData?.nationality}
                  >
                    <option selected disabled>
                      Nationality
                    </option>
                    {Nationality?.map((option) => (
                      <option key={option} value={option} className="text-black" >
                        {option}
                      </option>
                    ))}
                  </select>

                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="smoker"
                    onChange={HandleOption}
                    value={optionData?.smoker}
                  >
                    <option selected disabled>
                      Smoker
                    </option>
                    {Smoker.map((option) => (
                      <option key={option} value={option} className="text-black" >
                        {option}
                      </option>
                    ))}
                  </select>

                </div>
                {UserAuth?.user_type !== "client-hobbyist" && (
                  <div className="select-arrow w-full">
                    <select
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      name="languages"
                      onChange={HandleOption}
                      value={optionData?.languages}
                    >
                      <option selected disabled>
                        Languages
                      </option>
                      {Country.map((option) => (
                        <option key={option} value={option} className="text-black">
                          {option}
                        </option>
                      ))}
                    </select>

                  </div>
                )}
                {UserAuth?.user_type === "client-hobbyist" && (
                  <div className="select-arrow w-full">
                    <select
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      name="communication"
                      onChange={HandleOption}
                      value={optionData?.communication}
                    >
                      <option selected disabled>
                        Communication
                      </option>
                      {Communication.map((option) => (
                        <option key={option} value={option} className="text-black" >
                          {option}
                        </option>
                      ))}
                    </select>

                  </div>
                )}
                {UserAuth?.user_type === "client-hobbyist" && (
                  <div className="select-arrow w-full">
                    <select
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      name="socialmedia"
                      onChange={HandleOption}
                      value={optionData?.socialmedia}
                    >
                      <option selected disabled >
                        Social Media
                      </option>
                      {SocialMedia.map((option) => (
                        <option key={option} value={option} className="text-black" >
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

            {/* <h1 className="text-[27px] text-[#000] text-center font-black font-robotot pt-2">
            Business Information
          </h1> */}
            <div className="flex flex-col items-center justify-center  pt-[10px]">
              <div className="grid sm:grid-cols-2 w-full gap-[16px] mt-[16px] pb-2">
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="typeofbusiness"
                    onChange={HandleOption}
                    value={optionData?.typeofbusiness}
                  >
                    <option selected disabled>
                      Type Of Business
                    </option>
                    {TypeOfBusiness.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="staff"
                    onChange={HandleOption}
                    value={optionData?.staff}
                  >
                    <option selected disabled>
                      Staff
                    </option>
                    {Staff.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="virtual"
                    onChange={HandleOption}
                    value={optionData?.virtual}
                  >
                    <option selected disabled>
                      Virtual
                    </option>
                    {Virtual.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="location"
                    onChange={HandleOption}
                    value={optionData?.location}
                  >
                    <option selected disabled>
                      Location
                    </option>
                    {Location.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="venue"
                    onChange={HandleOption}
                    value={optionData?.venue}
                  >
                    <option selected disabled>
                      Venue
                    </option>
                    {Venue.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="communication"
                    onChange={HandleOption}
                    value={optionData?.communication}
                  >
                    <option selected disabled>
                      Communication/Contact
                    </option>
                    {Communication.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="socialmedia"
                    onChange={HandleOption}
                    value={optionData?.socialmedia}
                  >
                    <option selected disabled>
                      Social Media
                    </option>
                    {SocialMedia.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="virtualservices"
                    onChange={HandleOption}
                    value={optionData?.virtualservices}
                  >
                    <option selected disabled>
                      Virtual Services
                    </option>
                    {Virtual.map((option) => (
                      <option key={option} value={option} className="text-black">
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

            {/* <h1 className="text-[27px] text-[#000] text-center font-black font-robotot pt-2">
            Personal information
          </h1> */}
            <div className="flex flex-col items-center justify-center  pt-[10px] ">
              <div className="flex items-center w-full gap-[16px] sm:flex-row flex-col">
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
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
                <div className="select-arrow w-full w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
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
              <div className="grid sm:grid-cols-2 w-full gap-[16px] mt-[16px]">

                <div className="border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]">
                  Site ID ({UserAuth?.vaiID})
                </div>

                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="age"
                    onChange={HandleOption}
                    value={optionData?.age}
                  >
                    <option selected disabled>
                      Age
                    </option>
                    {Age?.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
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
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
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
                          <option key={option} value={option} className="text-black">
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
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="ethinicity"
                    onChange={HandleOption}
                    value={optionData?.ethinicity}
                  >
                    <option selected disabled>
                      Ethinicity
                    </option>
                    {Ethnicity.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="nationality"
                    onChange={HandleOption}
                    value={optionData?.nationality}
                  >
                    <option selected disabled>
                      Nationality
                    </option>
                    {Nationality.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="smoker"
                    onChange={HandleOption}
                    value={optionData?.smoker}
                  >
                    <option selected disabled>
                      Smoker
                    </option>
                    {Smoker.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="languages"
                    onChange={HandleOption}
                    value={optionData?.languages}
                  >
                    <option selected disabled>
                      Languages
                    </option>
                    {Country.map((option) => (
                      <option key={option} value={option} className="text-black">
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

            {/* <h1 className="text-[27px] text-[#000] text-center font-black font-robotot pt-2">
              Personal Appearance
            </h1> */}

            <div className="flex flex-col items-center justify-center ">
              <div className="grid sm:grid-cols-2 w-full gap-[16px] mt-[16px] pb-2">
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="build"
                    onChange={HandleOption}
                    value={optionData?.build}
                  >
                    <option selected disabled>
                      Build
                    </option>
                    {Build.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="height"
                    onChange={HandleOption}
                    value={optionData?.height}
                  >
                    <option selected disabled>
                      Height
                    </option>
                    {heightOptions.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="eyescolor"
                    onChange={HandleOption}
                    value={optionData?.eyescolor}
                  >
                    <option selected disabled>
                      Eyes Color
                    </option>
                    {Eyes.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="hairtype"
                    onChange={HandleOption}
                  >
                    <option selected disabled>
                      Hair Type
                    </option>
                    {HairStyle.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>

                </div>

                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="haircolor"
                    onChange={HandleOption}
                    value={optionData?.haircolor}
                  >
                    <option selected disabled>
                      Hair Color
                    </option>
                    {HairColor.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="hairlength"
                    onChange={HandleOption}
                    value={optionData?.hairlength}
                  >
                    <option selected disabled>
                      Hair Length
                    </option>
                    {HairLength.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="weight"
                    onChange={HandleOption}
                    value={optionData?.weight}
                  >
                    <option selected disabled>
                      Weight
                    </option>
                    {Weight.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="publichair"
                    onChange={HandleOption}
                    value={optionData?.publichair}
                  >
                    <option selected disabled>
                      Public Hair
                    </option>
                    {PubicHair.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="piercings"
                    onChange={HandleOption}
                    value={optionData?.piercings}
                  >
                    <option selected disabled>
                      Piercings
                    </option>
                    {Piercings.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedGender === "Female" ||
                  selectedGender.startsWith("Trans") ? (
                  <>
                    <div className="select-arrow w-full">
                      <select
                        className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                        name="breasttype"
                        onChange={HandleOption}
                        value={optionData?.breasttype}
                      >
                        <option selected disabled>
                          Breast Type
                        </option>
                        {BreastType.map((option) => (
                          <option key={option} value={option} className="text-black">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="select-arrow w-full">
                      <select
                        className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                        name="breastsize"
                        onChange={HandleOption}
                        value={optionData?.breastsize}
                      >
                        <option selected disabled>
                          Breast Size
                        </option>
                        {BreastSize.map((option) => (
                          <option key={option} value={option} className="text-black">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="select-arrow w-full">
                      <select
                        className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                        name="breastappearance"
                        onChange={HandleOption}
                        value={optionData?.breastappearance}
                      >
                        <option selected disabled>
                          Breast Appearance
                        </option>
                        {BreastAppearance.map((option) => (
                          <option key={option} value={option} className="text-black">
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
                  <div className="select-arrow w-full">
                    <select
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      name="tattoos"
                      onChange={HandleOption}
                      value={optionData?.tattoos}
                    >
                      <option selected disabled>
                        Tattoos
                      </option>
                      {Tattoos.map((option) => (
                        <option key={option} value={option} className="text-black">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
                {selectedGender === "Male" ||
                  selectedGender.startsWith("Trans") ? (
                  <div className="select-arrow w-full">
                    <select
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      name="dicksize"
                      onChange={HandleOption}
                      value={optionData?.dicksize}
                    >
                      <option selected disabled>
                        Dick Size
                      </option>
                      {DickSize.map((option) => (
                        <option key={option} value={option} className="text-black">
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
            {/* <div className="w-full bg-gradient-to-t from-[#0247FF] to-[#02227EAD] h-[10px] w-full mt-4"></div> */}

            {/* <h1 className="text-[27px] text-[#000] text-center font-black font-robotot pt-2">
              Availability/Services
            </h1> */}

            <div className="flex flex-col items-center justify-center ">
              <div className="grid sm:grid-cols-2 w-full gap-[16px] mt-[16px] pb-2">
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="travel"
                    onChange={HandleOption}
                    value={optionData?.travel}
                  >
                    <option selected disabled>
                      Travel
                    </option>
                    {Travel.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="venue"
                    onChange={HandleOption}
                    value={optionData?.venue}
                  >
                    <option selected disabled>
                      Venue
                    </option>
                    {Venue.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedGender === "Male" || selectedGender === "Female" ? (
                  <div className="select-arrow w-full">
                    <select
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      name="onlyfans"
                      onChange={HandleOption}
                      value={optionData?.onlyfans}
                    >
                      <option selected disabled>
                        Only Fans
                      </option>
                      {OnlyFans.map((option) => (
                        <option key={option} value={option} className="text-black">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="select-arrow w-full">
                    <select
                      className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                      name="socialmedia"
                      onChange={HandleOption}
                      value={optionData?.socialmedia}
                    >
                      <option selected disabled>
                        Social Media
                      </option>
                      {SocialMedia.map((option) => (
                        <option key={option} value={option} className="text-black">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="virtualservice"
                    onChange={HandleOption}
                    value={optionData?.virtualservice}
                  >
                    <option selected disabled>
                      Virtual Service
                    </option>
                    {Virtual.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="pornstar"
                    onChange={HandleOption}
                    value={optionData?.pornstar}
                  >
                    <option selected disabled>
                      Pornstar
                    </option>
                    {Pornstar.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-arrow w-full">
                  <select
                    className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                    name="communication"
                    onChange={HandleOption}
                    value={optionData?.communication}
                  >
                    <option selected disabled>
                      Communication
                    </option>
                    {Communication.map((option) => (
                      <option key={option} value={option} className="text-black">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col items-center justify-center ">
          <div className="w-full mt-7">
            <label className="text-sm text-start font-normal text-white">
              {UserAuth?.user_type === "companion-provider" ? (
                <span>About Me</span>
              ) : null}
              {UserAuth?.user_type === "client-hobbyist" ? (
                <span>About Me</span>
              ) : null}
              {UserAuth?.user_type === "agency-business" ? (
                <span>About Us</span>
              ) : null}
            </label>
            <textarea
              id="profile_information_description"
              rows="3"
              className="w-full border-2 border-[#919EAB33] rounded-[8px] py-[10px] px-[14px] bg-transparent text-white font-normal text-[14px] mt-1 !placeholder-white "
              placeholder="Share something that describes you"
              name="description"
              onChange={HandleOption}
              value={optionData?.description}
            ></textarea>
          </div>
          <div className="flex items-center justify-center w-full max-w-[500px] mt-[24px] mb-[48px]">
            <Button
              text={
                !isLoadingSubmit ? (
                  "Submit"
                ) : (
                  <div className="flex items-center	justify-center">
                    <Loading />
                  </div>
                )
              }
              size="48px"
              className='max-w-[500px]'
              onClick={HandleSubmit}
              disabled={isLoadingSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationOrientation;
