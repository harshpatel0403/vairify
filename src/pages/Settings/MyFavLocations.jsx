import { useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { HandleCountry, HandleSaveLocation } from "../../redux/action/Auth";
import UserService from "../../services/userServices";
import Modal from "react-modal";
import Loading from "../../components/Loading/Index";
import { toast } from "react-toastify";
import PageTitle from "../../components/PageTitle";

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
  const [favLocations, setFavLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(
    CurrentLocation.country_name
  );
  const [loading, setLoading] = useState(false);

  const countryData = useSelector((state) => state?.Auth?.country);

  const [saveLoading, setsaveLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  }

  const openModal = () => {
    setIsOpen(true);
  }

  const fetchLocations = async () => {
    try {
      let locations = await UserService.getFavLocations(UserData?._id);
      setFavLocations(locations || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    dispatch(HandleCountry());
    fetchLocations();
  }, [UserData]);

  useEffect(() => {
    if (selectedLocation === CurrentLocation.country_name) {
      setSelectedCity(CurrentLocation.city);
    }
  }, [selectedLocation]);

  useEffect(() => {
    countryData?.map((item) => {
      if (item.name === addLocation) {
        const city = item?.cities?.map((city) => city?.name);
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
        const name = item.name;
        countryNames.push(name);
      });
    Location = countryNames;
  }, [countryData]);

  const HandleLocation = () => {
    try {

      setsaveLoading(true);
      const location = addLocation;
      if (location && selectedCity) {
        dispatch(
          HandleSaveLocation(
            { country: location, city: selectedCity },
            UserData._id
          )
        );
        toast.success("Successfully Saved Location");
      }
      setsaveLoading(false);
      closeModal();
    } catch (error) {
      console.error("Error saving location: ", error)
      toast.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    )
  }
  return (
    <>
      <div className="container">
        <div >
          <div className="sm:py-[48px] py-[24px] md:flex relative hidden items-center">
            <button
              onClick={openModal}
              className="flex justify-center items-center bg-[#ffffff] text-[#060C4D] rounded-[8px] cursor-pointer text-[14px] font-bold px-[12px] py-[6px] gap-[8px] absolute left-0"
            >
              <img src="/images/setup/plus.png" alt="img" />
              Add New Address
            </button>
            <h3 className="sm:text-[28px] text-[24px] mx-auto font-semibold text-center text-white sm:block hidden">Favourite Locations</h3>
          </div>
          <div className="md:hidden block md:mb-0 sm:mb-[30px] mb-[16px]">
            <PageTitle title={'Favourite Locations'} isSmall={true}/>
          </div>
          <div className="md:hidden block mb-[24px]">
            <button
              onClick={openModal}
              className="flex justify-center items-center bg-[#ffffff] text-[#060C4D] rounded-[8px] cursor-pointer text-[14px] font-bold px-[12px] py-[6px] gap-[8px]"
            >
              <img src="/images/setup/plus.png" alt="img" />
              Add New Address
            </button>
          </div>
          {!favLocations &&
            <div className="flex items-center justify-center">
              <img src="/images/setup/location.svg" alt="img" className="max-w-[500px]" />
            </div>}

          <div className="grid md:grid-cols-2 sm:gap-[24px] gap-[16px] mt-[24px] sm:mt-0">
            {favLocations.map((loc) => (
              <div
                key={loc._id}
                className="sm:w-[100%] bg-[#FFFFFF14] p-[16px] rounded-[8px] cursor-pointer"
              >
                <div className="flex gap-2 sm:gap-4 pl-[10px] pr-[10px] align-items-center">
                  <div className="justify-center">
                    <img
                      src="/images/location.png"
                      className="w-[32px] h-[32px]"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 text-left ml-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h6 className="text-md text-white font-roboto font-bold  mb-1">
                          {loc.country}
                        </h6>
                        <h6 className="text-sm text-white font-roboto font-normal opacity-[0.6]">
                          {loc.city}
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

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className={
          "bg-[#FFFFFF] relative mx-auto w-[360px] rounded-[16px] p-[24px] w-[90%] max-w-[548px] overflow-y-auto max-h-[80vh]"
        }
        contentLabel="#"
      >
        <button
          className=" absolute right-[26px] top-[26px] bg-transparent border border-[#919EAB] h-[18px] w-[18px] flex justify-center items-center rounded-full bg-white"
          onClick={closeModal}
        >
          <img src={"/images/close-btn.svg"} alt="cancle" className="bg-[#060C4D] rounded-full h-full w-full object-cover" />
        </button>

        <h4 className="text-[#212B36] text-bold text-xl text-center mb-[24px]">Add New Location</h4>
        <div className="select-arrow w-full mb-[24px]">
          <select
            className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-[#212B36] font-normal text-[14px]"
            style={{ color: "rgba(2, 34, 126, 0.60) !important;" }}
            onChange={(e) => {
              setAddLocation(e.target.value);
            }}
          >
            <option selected disabled>Country</option>
            {Location?.map((item, index) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              )
            })}
          </select>
        </div>

        <div className="select-arrow w-full mb-[24px]">
          <select
            className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-[#212B36] font-normal text-[14px]"
            style={{ color: "rgba(2, 34, 126, 0.60) !important;" }}
            onChange={(e) => setSelectedCity(e.target.value)}
            value={selectedCity}
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
              )
            })}
          </select>
        </div>


        <div className="w-full mx-auto flex flex-col justify-center items-center">
          <div className=" max-w-[500px] w-full mx-auto">
            <Button
              text={
                saveLoading ?
                  <Loading />
                  : "Save Location"
              }
              disabled={saveLoading}
              onClick={HandleLocation}
              type="submit"
              className='secondary-btn'
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
