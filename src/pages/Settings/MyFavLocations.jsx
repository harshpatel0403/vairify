import { useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { HandleCountry, HandleSaveLocation } from "../../redux/action/Auth";
import UserService from "../../services/userServices";

let Location = [];

export default function MyFavLocations() {
  const CurrentLocation = useSelector(
    (state) => state?.CurrentLocation?.currentLocation
  );
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const dispatch = useDispatch();

  const [addLocation, setAddLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState(CurrentLocation.city);
  const [City, setCity] = useState([]);
  const [addSearchLocation, setAddSearchLocation] = useState(false);
  const [favLocations, setFavLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(
    CurrentLocation.country_name
  );

  const countryData = useSelector((state) => state?.Auth?.country);

  const fetchLocations = async () => {
    try {
      let locations = await UserService.getFavLocations(UserData?._id);
      setFavLocations(locations || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(HandleCountry());
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation === CurrentLocation.country_name) {
      setSelectedCity(CurrentLocation.city);
    }
  }, [selectedLocation]);

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

  useMemo(() => {
    const countryNames = [];

    countryData &&
      countryData?.map((item) => {
        // console.log(item, "<=== I am coutnry and city name herer.....");
        const name = item.name;
        countryNames.push(name);
      });
    Location = countryNames;

    // if (CurrentLocation?.country_name) {
    //   const normalizedValue = CurrentLocation?.country_name;

    //   // if (!FavoriteLocations?.includes(normalizedValue)) {
    //   //   FavoriteLocations.push(normalizedValue);
    //   // }
    // }
  }, [countryData]);

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

  return (
    <>
      {false && (
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
                }}
                size="35px"
              >
                <option selected disabled>
                  Country
                </option>
                {Location?.map((item, index) => {
                  return (
                    <option key={index} value={item}>
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

      <div
        className="main-content py-4 rounded-2xl pb-[20px] bg-[#D5D6E0]"
        style={{ height: "calc(100vh - 149px)" }}
      >
        <div className="flex flex-col justify-between">
          <div className="mt-2 bg-[#040C50]/[26%] w-full ">
            <h2 className="font-bold py-2 text-[24px] text-[#02227E] font-inter ">
              Saved Favourite Locations
            </h2>
          </div>
          {!favLocations?.length && (
            <div className="text-[32px] text-[#4b4b4b] font-bold text-center h-[500px] flex flex-col justify-center items-center">
              <div className="image-not">
                <img src="/images/notFound.png" alt="logo" />
              </div>
              Result not found
            </div>
          )}
          <div className="">
            <div className="mt-[20px] gap-[26px] px-2">
              <div className="grid md:grid-cols-2 gap-4">
                {favLocations.map((loc) => (
                  <div
                    key={loc._id}
                    className="sm:w-[100%] max-w-[440px] bg-[#3760CB]  py-[12px] rounded-[20px] border border-gray-100 h-[auto] "
                  >
                    <div className="flex gap-2 sm:gap-4 pl-[10px] pr-[10px]">
                      {/* <div className="w-[20%] justify-center">
                        <img
                          src={"/images/male.png"}
                          className="w-[60px] h-[60px] rounded-full"
                          alt=""
                        />
                      </div> */}
                      <div className="flex-1">
                        <div className="flex justify-start gap-5 items-center">
                          <div className="text-left">
                            <h6 className="text-xs text-white font-roboto font-semibold">
                              Country
                            </h6>
                            <h6 className="text-xs text-white font-roboto font-semibold">
                              {loc?.country}
                            </h6>
                          </div>

                          <div className="text-left">
                            <h6 className="text-xs text-white font-roboto font-semibold">
                              City
                            </h6>
                            <h6 className="text-xs text-white font-roboto font-semibold">
                              {loc?.city}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
