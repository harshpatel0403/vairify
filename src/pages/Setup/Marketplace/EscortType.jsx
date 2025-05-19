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
import { CaretDown } from "phosphor-react";
import Loading from "../../../components/Loading/Index";
import PageTitle from "../../../components/PageTitle";
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
  const [loading, setLoading] = useState(false);
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
    <div className="container mb-[48px]">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={`${state.title}`} />
      </div>
      {/*  */}
      <div className="w-full sm:mb-[24px] mb-[16px]">
        <h4 className="sm:text-[18px] text-[16px] text-white font-medium mb-[8px]">
          Type
        </h4>
        <div className="relative w-full">
          <select
            className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
            name="independant"
            onChange={handleTypeonChange}
            value={selectedType}
            size="35px"
          >
            {type.map((item) => {
              return <option value={item} className="text-black">{item}</option>;
            })}
          </select>
          <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
        </div>
      </div>
      {/*  */}
      <div className="w-full sm:mb-[24px] mb-[16px]">
        <div className="flex justify-between items-center w-full">
          <h4 className="sm:text-[18px] text-[16px] text-white font-medium mb-[8px]">
            Favorite Locations
          </h4>
          <Button
            text={"+ Add"}
            className={'!w-fit px-[8px] !py-[0px] mb-1 !text-[14px]'}
            onClick={() => setAddSearchLocation(!addSearchLocation)}
          />
        </div>
        <div className="flex items-center w-full gap-[24px] justify-center sm:flex-nowrap flex-wrap">
          <div className="relative w-full">
            <select
              className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
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
            >
              <option value={CurrentLocation?.country_name} disabled>
                Current Location ({CurrentLocation?.country_name})
              </option>
              {(UserData?.savedLocations || []).map((item) => {
                return (
                  <option key={item._id} value={item._id} className="text-black">
                    {item.country} {item.city}
                  </option>
                );
              })}
            </select>
            <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
          </div>
          <div className="relative w-full">
            <select
              className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
              name="radius"
              onChange={(e) => setSelectedRadius(e.target.value)}
              value={selectedRadius}
            >
              <option selected disabled>
                Radius
              </option>
              {Radius?.map((item) => {
                return <option value={item} className="text-black">{item}</option>;
              })}
            </select>
            <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="w-full sm:mb-[24px] mb-[16px]">
        {addSearchLocation && (
          <div className=" w-full">
            <p className="sm:text-[18px] text-[16px] text-white font-medium mb-[8px]">
              Search
            </p>
            <div className="flex items-center justify-center gap-[24px] w-full mb-2">
              <div className="relative w-full">
                <select
                  className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
                  name="location"
                  onChange={(e) => {
                    setAddLocation(e.target.value);
                    setSelectedLocation(e.target.value);
                  }}
                >
                  <option selected disabled>
                    Country
                  </option>
                  {Location?.map((item) => {
                    return <option className="text-black" key={item} selected={selectedLocation === item} value={item}>{item}</option>;
                  })}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
              </div>
              <div className="relative w-full">
                <select
                  className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
                  name="city"
                  onChange={(e) => setSelectedCity(e.target.value)}
                  value={selectedCity}
                >
                  <option selected={selectedCity === ""} disabled>City</option>
                  {City.map((item) => {
                    return (
                      <option
                        className="text-black"
                        key={item}
                        selected={selectedCity === item}
                        value={item}
                      >
                        {item}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
              </div>
            </div>
            <Button
              text={"Save location "}
              className={'!w-fit px-[8px] !py-[2px] mb-1 !text-[14px]'}
              onClick={() => {
                HandleLocation();
                setAddSearchLocation(!addSearchLocation);
              }}
            />
          </div>
        )}
      </div>
      {/*  */}
      <div className="w-full sm:mb-[24px] mb-[16px]">
        {!state.status && (
          <div className="w-full">
            <p className="sm:text-[18px] text-[16px] text-white font-medium mb-[8px]">
              Specialty
            </p>
            <div className="relative w-full">
              <select
                className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
                name="Add/Search Location"
                value={selectedSpecialtyOption}
                onChange={(e) => setSelectedSpecialtyOption(e.target.value)}
              >
                {specialtyOption?.map((item) => {
                  return <option className="text-black" value={item}>{item}</option>;
                })}
              </select>
              <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
            </div>
          </div>
        )}
      </div>
      {/*  */}
      <div className="w-full sm:mb-[24px] mb-[16px]">
        {state.status && (
          <div className="flex items-center w-full gap-[24px] justify-center">
            <div className="w-full">
              <p className="sm:text-[18px] text-[16px] text-white font-medium mb-[8px]">
                Sex
              </p>
              <div className="relative w-full">
                <select
                  className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
                  onChange={handleGenderChange}
                  name="gender"
                  value={selectedGender}
                >
                  {genderOptions.map((gender) => (
                    <option className="text-black" value={gender}>{gender}</option>
                  ))}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
              </div>
            </div>
            <div className="w-full">
              <p className="sm:text-[18px] text-[16px] text-white font-medium mb-[8px]">
                Orientation
              </p>
              <div className="relative flex flex-wrap items-center justify-between w-full gap-2 sm:gap-5   rounded-2xl">
                <select
                  className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
                  name="orientation"
                  value={selectedOrientation}
                  onChange={handleOrientationChange}
                >
                  {orientationOptions.map((orientation) => (
                    <option className="text-black" key={orientation} value={orientation}>
                      {orientation}
                    </option>
                  ))}
                </select>
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
              </div>
            </div>
          </div>
        )}
      </div>
      {state.status && (
        <div className="w-full sm:mb-[24px] mb-[16px]">
          <p className="sm:text-[18px] text-[16px] text-white font-medium mb-[8px]">
            Venue
          </p>
          <div className="flex flex-wrap relative items-center justify-between w-full gap-2 sm:gap-5   rounded-2xl">
            <select
              className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
              onChange={handleVenueonChange}
              value={selectedVenue}
            >
              {Venue.map((orientation) => (
                <option className="text-black" key={orientation} value={orientation}>
                  {orientation}
                </option>
              ))}
            </select>
            <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
          </div>
        </div>

      )}
      <div className="w-full sm:mb-[24px] mb-[16px]">
        <p className="sm:text-[18px] text-[16px] text-white font-medium mb-[8px]">
          TruRevu
        </p>
        <div className="w-full flex justify-center items-center sm:gap-[24px] gap-2">
          <div className="relative w-full">
            <select
              className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
              onChange={(e) =>
                setSelectedTruRevuStart({
                  ...selectedTruRevuStart,
                  from: e.target.value,
                })
              }
              value={selectedTruRevuStart.from}
            >
              <option value="0.0" selecterd className="text-black">
                0.0
              </option>
              <option value="1.0" selecterd className="text-black">
                1.0
              </option>
              <option className="text-black" value="1.5">1.5</option>
              <option className="text-black" value="2.0">2.0</option>
              <option className="text-black" value="2.5">2.5</option>
              <option className="text-black" value="3.0">3.0</option>
              <option className="text-black" value="3.5">3.5</option>
              <option className="text-black" value="4.0">4.0</option>
              <option className="text-black" value="4.5">4.5</option>
              <option className="text-black" value="5.0">5.0</option>
            </select>
            <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
          </div>
          <p className="sm:text-[18px] text-[14px] text-white font-medium">To</p>
          <div className="relative w-full">
            <select
              className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
              onChange={(e) =>
                setSelectedTruRevuStart({
                  ...selectedTruRevuStart,
                  to: e.target.value,
                })
              }
              value={selectedTruRevuStart.to}
            >
              <option className="text-black" value="1.0" selecterd>
                1.0
              </option>
              <option className="text-black" value="1.5">1.5</option>
              <option className="text-black" value="2.0">2.0</option>
              <option className="text-black" value="2.5">2.5</option>
              <option className="text-black" value="3.0">3.0</option>
              <option className="text-black" value="3.5">3.5</option>
              <option className="text-black" value="4.0">4.0</option>
              <option className="text-black" value="4.5">4.5</option>
              <option className="text-black" value="5.0">5.0</option>
            </select>
            <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
          </div>
        </div>
      </div>
      {state.status && (
        <div className="relative w-full sm:mb-[24px] mb-[16px]">
          <select
            className="bg-transparent appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "
            name="Invitation"
            onChange={(e) => setSelectedInvitation(e.target.value)}
            value={selectedInvitation}
          >
            {Invitation.map((item) => {
              return <option className="text-black" value={item}>{item}</option>;
            })}
          </select>
          <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
        </div>
      )}
      {state.status && (
        <div className="w-full sm:mb-[24px] mb-[16px]">
          <div className="flex sm:gap-[24px] gap-2 justify-center items-center w-full flex-wrap sm:flex-nowrap">
            <div className="flex gap-2 justify-center items-center w-full">
              <div className="relative w-full">
                <SelectBox_
                  onChange={(e) => setFromMonth(e.target.value)}
                  options={months}
                  value={fromMonth}
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                />
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
              </div>
              <div className="relative">
                <SelectBox_
                  onChange={(e) => setFromDay(e.target.value)}
                  options={days}
                  value={fromDay}
                  className={"bg-transparent min-w-[50px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}
                />
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
              </div>
            </div>
            <p className="sm:text-[18px] text-[14px] text-white font-medium">To</p>
            <div className="flex gap-2 justify-center items-center w-full">
              <div className="relative w-full">
                <SelectBox_
                  onChange={(e) => setToMonth(e.target.value)}
                  options={months}
                  value={toMonth}
                  className={"bg-transparent min-w-[100px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}

                />
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>
              </div>
              <div className="relative">
                <SelectBox_
                  onChange={(e) => setToDay(e.target.value)}
                  options={days}
                  value={toDay}
                  className={"bg-transparent min-w-[50px] appearance-none pl-2 cursor-pointer rounded-lg text-[14px] text-[#ffffff] font-normal px-0 py-2 w-full border border-[#919EAB33] focus:border-[#ffffff] "}

                />
                <div className="absolute top-[10px] right-2 text-white z-[-1]"><CaretDown size={16} /></div>

              </div>
            </div>
          </div>
        </div>
      )}
      {state.status && (
        <>
          <div className="flex w-full gap-[24px] items-center sm:mb-[24px] mb-[16px] flex-wrap sm:flex-nowrap">
            <div className="w-full">
              <Button
                text={"Review and Save To Favorites "}
                onClick={() => HandleReviewButton(true)}
              />
            </div>
            <div className="w-full">
              <Button
                text={"Review and Submit"}
                onClick={() => HandleReviewButton()}
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-full sm:mb-[24px] mb-[16px] max-w-[500px] mx-auto">
            <Button
              text={"Advanced Search"}
              onClick={HandleAdvancedSearch}
            />
          </div>
        </>
      )}
      {!state.status && (
        <>
          <div className="flex items-center justify-center gap-[24px] mb-[48px] flex-wrap sm:flex-nowrap">
            <div className="flex items-center justify-center w-full">
              <Button
                text={"Search and Save To Favorites"}
                onClick={() => {
                  setUpdate(true);
                  setFavoriteStatus(true);
                }}
              />
            </div>
            <div className="flex items-center justify-center w-full">
              <Button
                text={loading ? (<div className="flex items-center	justify-center">
                  <Loading />
                </div>) : "Search"}
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    await dispatch(HandleInvitation(AllData));
                    navigate("/results");
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            </div>
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
  );
};

export default EscortType;
