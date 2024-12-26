import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import MarketPlaceModale from "../../../components/MarketPlace/MarketPlaceModale";
import { useDispatch, useSelector } from "react-redux";
import { HandleCountry, HandleSaveLocation } from "../../../redux/action/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HandleInvitation } from "../../../redux/action/MarketplaceSearch";
import SelectBox_ from "../../../components/SelectBox_";
import moment from "moment";

const Independant = [];
const Radius = [
  "Within 15 mi (25 km)",
  "Within 30 mi (50 km)",
  "Within 50 mi (100 km)",
  "Within 120 mi (200 km)",
  "Within 200 mi (320 km)",
];
let Location = [];

const Search_location = ["Add/Search location"];

const Invitation = ["Invitation", "Search"];
const genderOptions = [
  "Male",
  "Female",
  "Trans Male (Pre-Op)",
  "Trans Female (Pre-Op)",
  "Trans Male (Post-Op)",
  "Trans Female (Post-Op)",
];
const Venue = ["Incall", "Outcall"];
const GayBathHouse = ["1", "2", "3", "4"];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const EscortType = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [open, setOpen] = useState(false);
  const [searchOpen, setsearchOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [addSearchLocation, setAddSearchLocation] = useState(false);
  const AdvanceServices = useSelector(
    (state) => state.AdvanceServices.services
  );

  const countryData = useSelector((state) => state?.Auth?.country);
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const CurrentLocation = useSelector(
    (state) => state?.CurrentLocation?.currentLocation
  );

  const [selectedGender, setSelectedGender] = useState("Male");
  const [selectedOrientation, setSelectedOrientation] = useState("M4W");
  const [orientationOptions, setOrientationOptions] = useState([
    "M4W",
    "M4M",
    "Bisexual",
  ]);
  const [type, setType] = useState([]);
  const [selectedType, setSelectedType] = useState("Independant");

  const [selectedVenue, setSelectedVenue] = useState("Incall");
  const [selectedTruRevuStart, setSelectedTruRevuStart] = useState({
    from: "3.5",
    to: "5.0",
  });
  const [selectedInvitation, setSelectedInvitation] = useState("Invitation");
  const [selectedRadius, setSelectedRadius] = useState("Radius");
  const [selectedLocation, setSelectedLocation] = useState(CurrentLocation.country_name);
  const [selectedCity, setSelectedCity] = useState(CurrentLocation.city);
  const [favoriteStatus, setFavoriteStatus] = useState(false);
  const [specialtyOption, setSpecialtyOption] = useState([]);
  const [selectedSpecialtyOption, setSelectedSpecialtyOption] = useState("");
  const [addLocation, setAddLocation] = useState("");
  const [fromMonth, setFromMonth] = useState("January");
  const [fromDay, setFromDay] = useState("01");
  const [toMonth, setToMonth] = useState("January");
  const [days, setDays] = useState([]);
  const [toDay, setToDay] = useState("10");

  const [City, setCity] = useState([]);

  let AllData = {};

  useEffect(() => {
    if (fromMonth) {
      const currentYear = moment().format("YYYY");
      const daysInMonth = moment(
        `${fromMonth} ${currentYear}`,
        "MMMM YYYY"
      ).daysInMonth();
      setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    }
  }, [fromMonth]);

  if (
    state?.title === "Escort" ||
    state?.title === "Massage" ||
    state?.title?.startsWith("Dancer")
  ) {
    AllData = {
      userId: UserData?._id,
      type: selectedType,
      location: selectedLocation,
      gender: selectedGender,
      orientation: selectedOrientation,
      venue: selectedVenue,
      service: state.title,
      inquiry: selectedInvitation,
      catagory: state?.title,
      trurevu: { from: selectedTruRevuStart.from, to: selectedTruRevuStart.to },
      radious: selectedRadius,
      city: selectedCity,
      advancedservices: state?.EditData?.advancedservices,
      favoriteStatus: favoriteStatus,
    };
  } else {
    AllData = {
      userId: UserData?._id,
      type: selectedType,
      location: selectedLocation,
      typespecialty: selectedSpecialtyOption,
      trurevu: { from: selectedTruRevuStart.from, to: selectedTruRevuStart.to },
      radious: selectedRadius,
      city: selectedCity,
      favoriteStatus: favoriteStatus,
      catagory: state?.title,
      service: state.title,
    };
  }
  const HandleSpecialtyOption = (type) => {
    if (type === "Swingers Lifestyle") {
      setSpecialtyOption([
        "Swingers Clubs or Lifestyle Clubs",
        "Swingers Resorts and Hotels",
        "Swingers Parties or House Parties",
        "Swingers Cruises",
        "Swingers Campgrounds",
        "Lifestyle Conventions and Takeovers",
        "Swingers Websites and Online",
        "Communities",
        "Swingers Bars or Meet and Greets",
        "Swinger-Friendly Travel Agencies",
        "Swingers Workshops and Seminars",
      ]);
    } else if (type === "Gay Lifestyle") {
      setSpecialtyOption([
        "Gay Bathhouses/Saunas",
        "Gay Bars & Clubs",
        "Gay Resorts",
        "Gay Bookstores",
        "Gay Cafés",
        "LGBTQ+ Community Centers",
        "Gay Beaches",
        "LGBTQ+ Film Festivals",
        "Gay Pride Parades and Festivals",
        "Gay Bed and Breakfasts/Hotels",
      ]);
    } else if (type === "Lesbian Lifestyle") {
      setSpecialtyOption([
        "Lesbian Bars & Clubs",
        "Lesbian Bookstores",
        "Women's Music Festivals",
        "Lesbian Cafés",
        "Women's Retreats and Resorts",
        "Lesbian Film Festivals",
        "Lesbian Pride Events and Parades",
        "Women-Only Dance Parties",
        "Lesbian Bed and Breakfasts/Hotels",
        "Lesbian Community Centers",
      ]);
    } else if (type === "Trans Lifestyle") {
      setSpecialtyOption([
        "Trans Bars & Clubs",
        "Trans-specific Medical Clinics and Health Centers",
        "Trans Pride Events and Parades",
        "Trans Conferences and Workshops",
        "Trans-friendly Clothing Stores and Boutiques",
        "Trans Film Festivals",
        "Trans Bookstores and Literature Events",
        "Trans Beauty Salons and Services",
      ]);
    } else if (type === "Online" || type === "Local") {
      setSpecialtyOption([
        "General Adult Stores",
        "Boutique Adult Stores",
        "Lingerie and Apparel Stores",
        "LGBTQ ",
        "Fetish and BDSM Stores",
        "Couples-Focused Stores",
        "Book/Video",
      ]);
    } else if (type === "Infiuencer") {
      setSpecialtyOption([
        "Instagram",
        "YouTube",
        "Blogs",
        "Twitter",
        "OnlyFans",
        "Snapchat",
        "TikTok",
        "Patreon",
        "Reddit Podcasts",
        "Websites & Personal Blogs",
      ]);
    } else if (type === "Forums") {
      setSpecialtyOption([
        "Gay",
        "Lesbian",
        "Sex Workers",
        "Transgender",
        "Bisexual",
        "Kink/BDSM Community",
      ]);
    } else {
      setSpecialtyOption([
        "Gay",
        "Lesbian",
        "Sex Workers",
        "Transgender",
        "Bisexual",
        "Kink/BDSM Community",
      ]);
    }
  };
  useMemo(() => {
    if (state?.EditData) {
      HandleSpecialtyOption(state?.EditData?.type);
      setSelectedType(state.EditData.type);
      setSelectedLocation(state.EditData.location);
      setSelectedRadius(state.EditData.radious);
      setSelectedGender(state.EditData.gender);
      setSelectedOrientation(state.EditData.orientation);
      setSelectedVenue(state.EditData.venue);
      setSelectedTruRevuStart({
        from: state.EditData.trurevu.from,
        to: state.EditData.trurevu.to,
      });
      setSelectedInvitation(state.EditData.inquiry);
      setSelectedCity(state.EditData.city);
      setSelectedSpecialtyOption(state?.EditData?.typespecialty);
      console.log(
        "🚀 ~ file: EscortType.jsx:126 ~ useMemo ~ state?.EditData?.typespecialty:",
        state?.EditData?.typespecialty
      );
    }
  }, [state?.EditData]);

  useMemo(() => {
    let countryNames = [];
    countryData &&
      countryData?.map((item) => {
        // console.log(item, "<=== I am coutnry and city name herer.....");
        const name = item.name;
        countryNames.push(name);
      });

    Location = countryNames;

    if (CurrentLocation?.country_name) {
      const normalizedValue = CurrentLocation?.country_name;

      // if (!FavoriteLocations?.includes(normalizedValue)) {
      //   FavoriteLocations.push(normalizedValue);
      // }
    }
  }, [countryData]);

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    setSelectedGender(selectedGender);
    updateOrientationOptions(selectedGender);
  };

  const updateOrientationOptions = (selectedGender) => {
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
  };
  const handleOrientationChange = (event) => {
    const selectedOrientation = event.target.value;
    setSelectedOrientation(selectedOrientation);
  };
  const handleTypeonChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
    HandleSpecialtyOption(type);
  };
  const handleVenueonChange = (event) => {
    const selectedOrientation = event.target.value;
    setSelectedVenue(selectedOrientation);
  };

  useEffect(() => {
    if (state?.title === "Escort") {
      setType(["Independant", "Agency"]);
    } else if (state?.title === "Massage") {
      setType(["Independant", "Agency", "Massage Parlor"]);
    } else if (state?.title?.startsWith("Dancer")) {
      setType(["Independant", "Agency", "Strip Club"]);
    } else if (state?.title?.startsWith("Life")) {
      setType([
        "Swingers Lifestyle",
        "Gay Lifestyle",
        "Lesbian Lifestyle",
        "Trans Lifestyle",
      ]);
      setSelectedType("Swingers Lifestyle");
      HandleSpecialtyOption("Swingers Lifestyle");
    } else if (state?.title === "Adult Stores/toys") {
      setType(["Online", "Local"]);
      setSelectedType("Online");
      HandleSpecialtyOption("Online");
    } else if (state?.title === "Adult Forums") {
      setType(["Infiuencer", "Forums"]);
      setSelectedType("Infiuencer");
      HandleSpecialtyOption("Infiuencer");
    } else {
      setType([
        "Charitable Organizations",
        "Educational Organizations",
        "Research Organizations",
        "Advocary Groups",
        "Professional Associations",
      ]);
      setSelectedType("Charitable Organizations");
      HandleSpecialtyOption("Charitable Organizations");
    }
  }, [state]);

  const HandleAdvancedSearch = () => {
    navigate("/advance/search", {
      state: { state, AllData, EditData: state?.EditData },
    });
  };
  useEffect(() => {
    dispatch(HandleCountry());
  }, []);

  const HandleReviewButton = (event) => {
    if (event) {
      setFavoriteStatus(true);
    } else {
      setFavoriteStatus(false);
    }
    if (selectedInvitation === "Invitation") {
      setOpen(true);
    } else {
      setsearchOpen(true);
    }
  };
  const HandleSubmitButton = () => {
    setsearchOpen(true);
  };

  const HandleLocation = () => {
    const location = addLocation;
    // selectedCity
    if (location && selectedCity) {
      // Call api service here...
      dispatch(
        HandleSaveLocation(
          { country: location, city: selectedCity },
          UserData._id
        )
      );
    }
    // if (location) {
    //   const normalizedValue = location;
    //   if (!FavoriteLocations?.includes(normalizedValue)) {
    //     FavoriteLocations.push(normalizedValue);
    //   }
    // }
    // setSelectedLocation(location);
  };

  useEffect(() => {
    countryData?.map((item) => {
      if (item.name === addLocation) {
        const city = item?.cities?.map((city) => city?.name);
        // City.push(city);
        setCity(city);
        setSelectedCity("");
        return;
      }
    });
  }, [addLocation]);

  useEffect(() => {
    if (selectedLocation === CurrentLocation.country_name) {
      setSelectedCity(CurrentLocation.city);
    }
  }, [selectedLocation]);

  return (
    <div className="flex flex-col justify-start h-full">
      <p className="max-w-full text-[30px] md:text-[33px] text-center text-[#000] change-font-family font-bold py-4">
        {state.title}
      </p>
      <div className="bg-linear-gradient h-[30px] text-[24px] text-[#fff] font-bold change-font-family flex justify-center items-center">
        {" "}
        Type
      </div>
      <div className=" flex justify-center items-center">
        <div className="relative">
          <select
            className="mb-4 pr-8 appearance-none  py-0.5 mt-4 px-5 bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[20px] text-[#fff] font-bold font-inter flex justify-center items-center"
            name="independant"
            onChange={handleTypeonChange}
            value={selectedType}
            size="35px"
          >
            {type.map((item) => {
              return <option value={item}>{item}</option>;
            })}
          </select>
          <div className="absolute right-1 top-6">
            <svg
              className={`w-6 h-6 fill-current text-white`}
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-linear-gradient h-[30px] text-[24px] text-[#fff] font-bold change-font-family flex items-center justify-center  ">
        Search
      </div>
      <div className="px-5 flex flex-col items-center">
        {
          //   <p className="text-[24px] md:text-[26px] text-center text-[#000] font-roboto-serif font-bold py-3">
          //     Location
          //   </p>
        }
        <div className="flex flex-col items-start w-full max-w-[420px] mt-2 mb-1">
          <p className="text-[18px] text-[#000] text-start font-bold font-inter">
            Favorite Locations
          </p>
          <div className="flex items-center w-full gap-2 justify-center">
            <div className="relative flex items-center rounded-xl">
              <select
                className="w-full h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl appearance-none pl-7 sm:pl-10 pr-8 text-[20px] text-[#fff] font-bold font-inter"
                name="location"
                onChange={(e) => {
                  setSelectedLocation(
                    UserData?.savedLocations.find(
                      (item) => item._id === e.target.value
                    )?.country || CurrentLocation.country_name
                  );
                  setSelectedCity(
                    UserData?.savedLocations.find(
                      (item) => item._id === e.target.value
                    )?.city || CurrentLocation.city
                  );
                }}
                // value={selectedLocation}
                size="35px"
              >
                <option value={CurrentLocation?.country_name}>
                  Current Location ({CurrentLocation?.country_name})
                </option>
                {(UserData?.savedLocations || []).map((item) => {
                  return (
                    <option key={item._id} value={item._id}>
                      {item.country} {item.city}
                    </option>
                  );
                })}
              </select>
              <img
                src="images/location.png"
                alt=""
                className="absolute w-[23px] pl-1 ml-1 z-10"
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
            <div className="relative">
              <select
                className="w-[120px] h-[35px] appearance-none px-2 pr-5 bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[20px] text-[#fff] font-bold font-inter  "
                name="radius"
                onChange={(e) => setSelectedRadius(e.target.value)}
                value={selectedRadius}
                size="35px"
              >
                <option selected disabled>
                  Radius
                </option>
                {Radius?.map((item) => {
                  return <option value={item}>{item}</option>;
                })}
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

        <div className="flex justify-center mt-2 items-center w-[80%] max-w-[250px]">
          <Button
            className={
              "flex items-center h-[35px] max-w-[420px] mt-3 py-2 my-2 justify-center bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] text-[#fff] font-bold text-[20px] rounded-xl  "
            }
            text={"Add/Search Location"}
            size="35px"
            onClick={() => setAddSearchLocation(!addSearchLocation)}
          />
        </div>
        {addSearchLocation && (
          <div className="flex flex-col items-start w-full max-w-[420px] mb-1">
            <p className="text-[18px] text-[#000] text-start font-bold font-inter">
              Search
            </p>
            <div className="flex items-center justify-center w-full gap-4 sm:gap-5">
              <div className="relative w-full">
                <select
                  className="w-full appearance-none pl-2 pr-7 h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[20px] text-[#fff] font-bold font-inter  "
                  name="location"
                  onChange={(e) => {
                    setAddLocation(e.target.value);
                    setSelectedLocation(e.target.value);
                  }}
                  size="35px"
                >
                  <option selected disabled>
                    Country
                  </option>
                  {Location?.map((item) => {
                    return <option key={item} selected={selectedLocation === item} value={item}>{item}</option>;
                  })}
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
              <div className="relative w-full">
                <select
                  className="w-full appearance-none pl-2 pr-7 h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[20px] text-[#fff] font-bold font-inter  "
                  name="city"
                  onChange={(e) => setSelectedCity(e.target.value)}
                  value={selectedCity}
                  size="35px"
                >
                  <option selected={selectedCity === ""}>City</option>
                  {City.map((item) => {
                    return (
                      <option
                        key={item}
                        selected={selectedCity === item}
                        value={item}
                      >
                        {item}
                      </option>
                    );
                  })}
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
            <div className="w-full flex justify-center items-center">
              <div className="flex justify-center items-center">
                <Button
                  className={
                    "flex items-center pr-4 pl-4 mt-4 py-2 my-2 justify-center bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] text-[#fff] font-bold text-[24px] rounded-xl  "
                  }
                  text={"Save location "}
                  size="35px"
                  onClick={() => {
                    HandleLocation();
                    setAddSearchLocation(!addSearchLocation);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {!state.status && (
          <div className="flex flex-col items-start w-[80%] max-w-[250px] mt-1">
            <p className="text-[18px] text-[#000] text-start font-bold font-roboto-serif w-full">
              Specialty
            </p>
            <div className="relative w-full">
              <select
                className="w-full pr-8 appearance-none px-2 h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[20px] text-[#fff] font-bold font-inter  "
                name="Add/Search Location"
                value={selectedSpecialtyOption}
                onChange={(e) => setSelectedSpecialtyOption(e.target.value)}
                size="35px"
              >
                {specialtyOption?.map((item) => {
                  return <option value={item}>{item}</option>;
                })}
              </select>
              <div className="absolute top-3 right-2">
                <svg
                  className={`w-6 h-6 fill-current text-white`}
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                </svg>
              </div>
            </div>
          </div>
        )}
        {state.status && (
          <div className="flex justify-between items-center w-full max-w-[420px] mt-2">
            <div className="flex flex-col items-start w-[45%] ">
              <p className="text-[18px] text-[#000] text-start font-bold change-font-family w-full pb-0">
                Sex
              </p>
              <div className="relative flex flex-wrap items-center justify-between w-full gap-2 sm:gap-5   rounded-2xl">
                <select
                  className="pl-8 h-[35px] appearance-none sm:pl-10 pr-8 bg-[#02227E] bg-gradient-to-b from-[#02227E] text-center to-[#0247FF] rounded-xl text-[20px] text-[#fff] font-bold font-inter min-w-[fit] w-full"
                  onChange={handleGenderChange}
                  name="gender"
                  value={selectedGender}
                  size="35px"
                >
                  {genderOptions.map((gender) => (
                    <option value={gender}>{gender}</option>
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
            <div className="flex flex-col items-start w-[45%]">
              <p className="text-[18px] text-[#000] text-start font-bold change-font-family w-full pl-0 pb-0">
                Orientation
              </p>
              <div className="relative flex flex-wrap items-center justify-between w-full gap-2 sm:gap-5   rounded-2xl">
                <select
                  className="pl-2 h-[35px] text-center appearance-none sm:pl-10 pr-1.5 bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[20px] text-[#fff] font-bold font-inter min-w-[fit] w-full"
                  name="orientation"
                  value={selectedOrientation}
                  onChange={handleOrientationChange} // Add this line
                  size="35px"
                >
                  {orientationOptions.map((orientation) => (
                    <option key={orientation} value={orientation}>
                      {orientation}
                    </option>
                  ))}
                </select>
                <img
                  src="images/Mask-group-icons.png"
                  alt=""
                  className="absolute top-1 left-2 z-10"
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
          </div>
        )}
        <div
          className={`w-full max-w-[420px] flex justify-${
            state.status ? "between" : "center"
          }  items-center gap-2 sm:gap-5`}
        >
          {state.status && (
            <div className="flex justify-center items-center w-[45%] max-w-[420px] mt-1">
              <div className="flex flex-col items-start w-full">
                <p className="text-[18px] text-[#000] text-start font-bold change-font-family w-full pb-0">
                  Venue
                </p>
                <div className="flex flex-wrap relative items-center justify-between w-full gap-2 sm:gap-5   rounded-2xl">
                  <select
                    className="px-2 pl-6 h-[35px] appearance-none bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[20px] text-[#fff] font-bold font-inter min-w-[fit] w-full"
                    onChange={handleVenueonChange}
                    value={selectedVenue}
                    size="35px"
                  >
                    {Venue.map((orientation) => (
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
          )}
          <div className="flex flex-col items-start w-[45%] mt-1">
            <p className="text-[18px] text-[#000] text-start font-bold change-font-family w-full pl-0 pb-0">
              TruRevu
            </p>
            <div className="w-full flex justify-center items-center gap-2 ">
              <div className="flex relative flex-wrap items-center justify-between w-full gap-2 sm:gap-5   rounded-2xl">
                <select
                  className="w-full px-2 appearance-none h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[20px] text-[#fff] font-bold font-inter min-w-[70px] w-[60px]"
                  onChange={(e) =>
                    setSelectedTruRevuStart({
                      ...selectedTruRevuStart,
                      from: e.target.value,
                    })
                  }
                  value={selectedTruRevuStart.from}
                  size="35px"
                >
                  <option value="0.0" selecterd>
                    0.0
                  </option>
                  <option value="1.0" selecterd>
                    1.0
                  </option>
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
                  className="w-full px-2 appearance-none h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[20px] text-[#fff] font-bold font-inter min-w-[70px] w-[60px]"
                  onChange={(e) =>
                    setSelectedTruRevuStart({
                      ...selectedTruRevuStart,
                      to: e.target.value,
                    })
                  }
                  value={selectedTruRevuStart.to}
                  size="35px"
                >
                  <option value="1.0" selecterd>
                    1.0
                  </option>
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
        {state.status && (
          <div className="flex justify-center items-center w-full">
            <div className="relative mb-7 mt-7">
              <select
                className="w-fit appearance-none mx-auto pl-5 pr-8 h-[35px] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-xl text-[20px] text-[#fff] font-bold font-inter   flex justify-center items-center"
                name="Invitation"
                onChange={(e) => setSelectedInvitation(e.target.value)}
                value={selectedInvitation}
                size="35px"
              >
                {Invitation.map((item) => {
                  return <option value={item}>{item}</option>;
                })}
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
        )}
        {state.status && (
          <div className="w-full max-w-[420px] flex flex-row justify-between items-center">
            <div className="flex gap-1 justify-between items-center w-full">
              <div className="flex flex-row justify-center items-center w-[45%]">
                <div className="relative w-full">
                  <SelectBox_
                    onChange={(e) => setFromMonth(e.target.value)}
                    options={months}
                    value={fromMonth}
                    className={
                      "appearance-none rounded-[10px] text-[#fff] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] border-r-2 border-[#CCCCCC] rounded-r-none text-[16px] font-bold px-0 pl-2 max-[350px]:pl-1 sm:pl-4 pr-3 py-1 w-full  h-[37px]"
                    }
                  />
                  <div className="absolute top-2 right-[5px]">
                    <svg
                      className={`w-6 h-6 fill-current text-[#fff]`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <SelectBox_
                    onChange={(e) => setFromDay(e.target.value)}
                    options={days}
                    value={fromDay}
                    className={
                      "appearance-none rounded-[10px] text-[#fff] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-l-none text-[16px] font-bold px-0 pl-1 max-[350px]:pr-4 pr-5 py-1 h-[37px]"
                    }
                  />
                  <div className="absolute top-2 max-[400px]:right-[2px] right-[5px] left-5">
                    <svg
                      className={`w-6 h-6 fill-current text-[#fff]`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center w-[45%]">
                <div className="relative w-full">
                  <SelectBox_
                    onChange={(e) => setToMonth(e.target.value)}
                    options={months}
                    value={toMonth}
                    className={
                      "appearance-none rounded-[10px] text-[#fff] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] border-r-2 border-[#CCCCCC] rounded-r-none text-[16px] font-bold px-0 pl-2 max-[350px]:pl-1 sm:pl-4 pr-3 py-1 w-full h-[35px]"
                    }
                  />
                  <div className="absolute top-2 right-[5px]">
                    <svg
                      className={`w-6 h-6 fill-current text-[#fff]`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <SelectBox_
                    onChange={(e) => setToDay(e.target.value)}
                    options={days}
                    value={toDay}
                    className={
                      "appearance-none rounded-[10px] text-[#fff] bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] rounded-l-none text-[16px] font-bold px-0 pl-1 max-[350px]:pr-4 pr-5 py-1 h-[35px]"
                    }
                  />
                  <div className="absolute top-2 max-[400px]:right-[2px] right-[5px] left-5">
                    <svg
                      className={`w-6 h-6 fill-current text-[#fff]`}
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 12l-6-6h12l-6 6z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {state.status && (
          <>
            <div className="flex items-center justify-center w-full max-w-[420px] mt-5">
              <Button
                className={
                  "flex items-center w-fit max-w-[331px] mt-4 py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[20px] rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.3)]"
                }
                text={"Review and Save To Favorites "}
                size="35px"
                onClick={() => HandleReviewButton(true)}
              />
            </div>
            <div className="flex items-center justify-center w-full max-w-[420px]">
              <Button
                className={
                  "flex items-center w-fit max-w-[331px] mt-2 py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[20px] rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.3)]"
                }
                text={"Review and Submit"}
                onClick={() => HandleReviewButton()}
                size="35px"
              />
            </div>
            <div className="flex items-center justify-center mb-4">
              <Button
                className={
                  "items-center inline-flex px-4 mt-4 w-auto py-2 my-2 justify-center bg-[#02227E] bg-gradient-to-b from-[#02227E] to-[#0247FF] text-[#fff] font-bold text-[20px] rounded-xl  "
                }
                text={"Advanced Search"}
                size="40px"
                onClick={HandleAdvancedSearch}
              />
            </div>
          </>
        )}
        {!state.status && (
          <>
            <div className="flex mt-5 items-center justify-center w-full max-w-[420px]">
              <Button
                className={
                  "flex items-center w-fit mt-4 py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] py-2 rounded-xl  "
                }
                text={"Search and Save To Favorites"}
                size="35px"
                onClick={() => {
                  setUpdate(true);
                  setFavoriteStatus(true);
                }}
              />
            </div>
            <div className="flex mt-2 items-center justify-center w-full mb-3 max-w-[420px]">
              <Button
                className={
                  "flex items-center mt-4 py-2 w-[50%] max-w-[150px] my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] py-2 rounded-xl  "
                }
                text={"Search"}
                size="35px"
                onClick={async () => {
                  await dispatch(HandleInvitation(AllData));
                  navigate("/results");
                }}
              />
            </div>
          </>
        )}
        <MarketPlaceModale
          open={open}
          setOpen={setOpen}
          setsearchOpen={setsearchOpen}
          searchOpen={searchOpen}
          EditData={state?.EditData}
          update={update}
          setUpdate={setUpdate}
          AllData={AllData}
          state={state}
          favoriteStatus={favoriteStatus}
          fromMonth={fromMonth}
          fromDay={fromDay}
          toMonth={toMonth}
          toDay={toDay}
        />
      </div>
    </div>
  );
};

export default EscortType;
