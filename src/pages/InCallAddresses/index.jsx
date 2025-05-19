import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
} from "@react-google-maps/api";
import UserService from "../../services/userServices";
import { toast } from "react-toastify";
import { HandleUpdateUser } from "../../redux/action/Auth";
import Header from "../../components/Header/Header";
import Loading from "../../components/Loading/Index";
import PageTitle from "../../components/PageTitle";
const libs = ["places"];

const IncallManage = () => {
  const dispatch = useDispatch();
  // const MapLoader = withScriptjs(AddressMap);

  // const navigate = useNavigate();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [currentLocation, setCurrentLocation] = useState({});

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setsaveLoading] = useState(false);

  const [id, setId] = useState("");

  // FOR MAP
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default center
  const [pinLocation, setPinLocation] = useState(null);
  const [addressText, setAddressText] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [landmark, setLandmark] = useState("");
  const searchInputRef = useRef(null);
  const [searchResult, setSearchResult] = useState("Result: none");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLEMAPS_KEY,
    libraries: libs,
  });

  const onLoad = (map) => {
    setMap(map);
  };

  function onACLoad(autocomplete) {
    setSearchResult(autocomplete);
  }

  const onMapClick = async (event) => {
    const geocode = new window.google.maps.Geocoder();

    const geocoderesp = await geocode.geocode({
      location: { lat: event.latLng.lat(), lng: event.latLng.lng() },
    });
    searchInputRef.current.value = geocoderesp?.results?.[0]?.formatted_address;
    setAddressText(geocoderesp?.results?.[0]?.formatted_address);
    setPinLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handlePlaceSelect = () => {
    const place = searchResult?.getPlace();
    if (place.geometry) {
      setAddressText(searchInputRef.current.value);
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      setPinLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const fetLocations = () => {
    setLoading(true);
    UserService.getIncallAddresses(UserDetails?._id)
      .then((res) => {
        setAddresses(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetLocations();
  }, []);

  const saveAddress = async () => {
    try {
      if (
        !pinLocation.lat ||
        !pinLocation.lng ||
        !addressText ||
        !addressLine1
      ) {
        return toast.error(
          "Please fill up all the details or select a valid location."
        );
      }

      setsaveLoading(true);
      const payload = {
        lat: pinLocation.lat,
        lng: pinLocation.lng,
        address: addressText,
        addressLine1: addressLine1,
        landmark: landmark,
      };

      await UserService.saveIncallAddresses(UserDetails?._id, payload);
      await dispatch(HandleUpdateUser(UserDetails?._id));
      fetLocations();
      setPinLocation({});
      setAddressLine1("");
      setLandmark("");
      setAddressText("");
      setShowModal(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.message);
    } finally {
      setsaveLoading(false);
    }
  };

  const updateAddress = async (id) => {
    try {
      if (
        !pinLocation.lat ||
        !pinLocation.lng ||
        !addressText ||
        !addressLine1
      ) {
        return toast.error(
          "Please fill up all the details or select a valid location."
        );
      }
      setsaveLoading(true);
      const payload = {
        lat: pinLocation.lat,
        lng: pinLocation.lng,
        address: addressText,
        addressLine1: addressLine1,
        landmark: landmark,
      };

      await UserService.updateIncallAddresses(UserDetails?._id, id, payload);
      await dispatch(HandleUpdateUser(UserDetails?._id));
      fetLocations();
      setPinLocation({});
      setAddressLine1("");
      setLandmark("");
      setAddressText("");
      setId("");
      setShowModal(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.message);
    } finally {
      setsaveLoading(false);
    }
  };

  const handleEdit = (addr) => {
    setShowModal(true);
    setId(addr._id);
    setPinLocation({
      lat: Number(addr.lat),
      lng: Number(addr.lng),
    });
    setCenter({
      lat: Number(addr.lat),
      lng: Number(addr.lng),
    });

    setAddressLine1(addr.addressLine1);
    setLandmark(addr.landmark);
    setAddressText(addr.address);
    // searchInputRef.current.value = addr.address;
  };

  // console.log(UserDetails);

  const fetchLocation = async () => {
    if (navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // success(position)
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setCenter({ lat: latitude, lng: longitude });
            resolve({ lat: latitude, lng: longitude });
          },
          () => {
            // error();
            resolve({});
          }
        );
      });
    } else {
      console.log("Geolocation not supported");
      return Promise.resolve({});
    }
  };

  useEffect(() => {
    fetchLocation()
      .then((res) => setCurrentLocation(res))
      .catch((err) => console.log(err));
  }, []);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
      </div>
    )
  }

  return (
    <div className="container">
      {showModal ? (
        <>
          <div>
            <div className="md:mb-0 sm:mb-[30px] mb-[16px] md:hidden block">
              <PageTitle title={"Add New Addresses"} />
            </div>
        
            <div className="my-[48px]">
              <h3 className="sm:text-[28px] text-[24px] mx-auto font-semibold text-center text-white md:block hidden">Add New Addresses</h3>
              <div className="py-5 flex-auto">
                <div
                  style={{ height: "352px", width: "100%" }}
                >
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%", borderRadius: '8px' }}
                    center={center}
                    zoom={10}
                    onLoad={onLoad}
                    onClick={onMapClick}
                  >
                    {pinLocation && <Marker position={pinLocation} />}
                  </GoogleMap>
                </div>
                <div className="form-part mt-5">
                  <div className="pb-3">
                    <Autocomplete
                      onLoad={onACLoad}
                      onPlaceChanged={handlePlaceSelect}
                    >
                      <input
                        type="text"
                        placeholder="Search location"
                        ref={searchInputRef}
                        className="w-full p-3 border border-[#919EAB33] bg-transparent text-white rounded-lg text-[14px] font-normal py-[16px] px-[14px]"
                        value={addressText}
                        onChange={(e) => setAddressText(e.target.value)}
                      />
                    </Autocomplete>
                  </div>
                </div>
                <div className="form-part inner-field mt-5">
                  <div className="pb-3">
                    <input
                      className="w-full p-3 border border-[#919EAB33] bg-transparent text-white rounded-lg text-[14px] font-normal py-[16px] px-[14px]"
                      type="text"
                      placeholder="Line 1"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                    />
                  </div>
                  <div className="pb-3">
                    <input
                      className="w-full p-3 border border-[#919EAB33] bg-transparent text-white rounded-lg text-[14px] font-normal py-[16px] px-[14px]"
                      type="text"
                      placeholder="Landmark"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full mx-auto flex flex-col justify-center items-center">
                  <div className=" max-w-[500px] w-full mx-auto">
                    <Button
                      text={saveLoading ? <Loading /> : "Add New Address"}
                      disabled={saveLoading}
                      onClick={() => (id ? updateAddress(id) : saveAddress())}
                      type="submit"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) :
        <div>
          <div className="sm:py-[48px] py-[24px] md:flex relative items-center hidden">
            <button
              onClick={() => setShowModal(true)}
              className="flex justify-center items-center bg-[#ffffff] text-[#060C4D] rounded-[8px] cursor-pointer text-[14px] font-bold px-[12px] py-[6px] gap-[8px] absolute left-0"
            >
              <img src="/images/setup/plus.png" alt="img" />
              Add Address
            </button>
            <h3 className="sm:text-[28px] text-[24px] mx-auto font-semibold text-center text-white md:block hidden">Incall Addresses</h3>
          </div>
          <div className="md:hidden block md:mb-0 sm:mb-[30px] mb-0">
            <PageTitle title={'Incall Addresses'} />
          </div>
          <div className="md:hidden block mb-[24px]">
            <button
              onClick={() => setShowModal(true)}
              className="flex justify-center items-center bg-[#ffffff] text-[#060C4D] rounded-[8px] cursor-pointer text-[14px] font-bold px-[12px] py-[6px] gap-[8px] mt-[24px]"
            >
              <img src="/images/setup/plus.png" alt="img" />
              Add Address
            </button>
          </div>
          {!addresses &&
            <div className="flex items-center justify-center">
              <img src="/images/setup/location.svg" alt="img" className="max-w-[500px]" />
            </div>}

          <div className="grid md:grid-cols-2 sm:gap-[24px] gap-[16px] mt-[24px] sm:mt-0">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="sm:w-[100%] bg-[#FFFFFF14] p-[16px] rounded-[8px] cursor-pointer"
                onClick={() => handleEdit(addr)}
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
                          {addr.addressLine1}
                        </h6>
                        <h6 className="text-sm text-white font-roboto font-normal opacity-[0.6]">
                          {addr.address}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
};

export default IncallManage;


{/* <div className="main-content py-4 rounded-2xl pb-[45px]">
      <div className="flex flex-col justify-between">
        <div className="mt-2 bg-[#040C50]/[26%] w-full ">
          <h2 className="font-bold py-2 text-[24px] text-[#02227E] font-inter ">
            Incall Addresses
          </h2>
        </div>
        <div className="inner-content-part">
          <div className="mt-[20px] flex sm:flex-row flex-col gap-[26px] px-2">
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="sm:w-[100%] max-w-[440px] bg-[#3760CB] shadow-2xl py-[12px] rounded-[20px] border border-gray-100 h-[auto] "
                  onClick={() => handleEdit(addr)}
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
                            {addr.addressLine1}
                          </h6>
                          <h6 className="text-sm text-white font-roboto">
                            {addr.address}
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
      <button
        onClick={() => setShowModal(true)}
        className="h-[50px] w-[50px] flex justify-center items-center bg-[#02227E] text-white rounded-full fab cursor-pointer"
      >
        <i className="fa fa-plus"></i>
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none add-member-modal">
            <div
              className="relative w-auto mx-auto max-w-5xl"
              style={{ width: "25rem" }}
            >
              <div className="modal-body-part white-border border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <button
                  className="cancel-button absolute right-2 top-2 p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  <img src={"/images/close-btn.svg"} alt="cancle" />
                </button>
                <div className="relative py-5 flex-auto px-5">
                  <h2>Add Address</h2>
                  <div
                    className="map-part bg-white"
                    style={{ height: "200px", width: "100%" }}
                  >
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={center}
                      zoom={10}
                      onLoad={onLoad}
                      onClick={onMapClick}
                    >
                      {pinLocation && <Marker position={pinLocation} />}
                    </GoogleMap>
                  </div>
                  <div className="form-part mt-5">
                    <div className="pb-3">
                      <Autocomplete
                        onLoad={onACLoad}
                        onPlaceChanged={handlePlaceSelect}
                      >
                        <input
                          type="text"
                          placeholder="Search location"
                          ref={searchInputRef}
                          className="w-full p-3 modal-input"
                          value={addressText}
                          onChange={(e) => setAddressText(e.target.value)}
                        />
                      </Autocomplete>
                    </div>
                  </div>
                  <div className="form-part inner-field mt-5">
                    <div className="pb-3">
                      <input
                        className="w-full p-3 modal-input"
                        type="text"
                        placeholder="Line 1"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                      />
                    </div>
                    <div className="pb-3">
                      <input
                        className="w-full p-3 modal-input"
                        type="text"
                        placeholder="Landmark"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full mx-auto flex flex-col justify-center items-center mt-4">
                    <div className="w-[142px]">
                      <Button
                        text={saveLoading ? "Loading.." : "Submit"}
                        disabled={saveLoading}
                        className="bg-[#05B7FD] rounded-[10px] font-bold text-[24px] h-[41px] flex items-center justify-center change-font-family"
                        size="41px"
                        onClick={() => (id ? updateAddress(id) : saveAddress())}
                        type="submit"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div> */}