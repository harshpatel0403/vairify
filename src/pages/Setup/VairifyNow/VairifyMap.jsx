import React, { useState, useEffect, useMemo } from "react";

import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Modal from "react-modal";

import { Component } from "react";
import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  Marker,
  withScriptjs,
  InfoWindow,
} from "react-google-maps";
import { GoogleApiWrapper } from "google-maps-react";
import VaridateService from "../../../services/VaridateServices";
import { toast } from "react-toastify";
import moment from "moment";

function VairifyMap() {
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState("List");
  const results = location.state;
  // const userType = UserData.user_type;
  const [isOpen, setIsOpen] = useState(false);

  const [isOpenmap, setIsOpenmap] = useState(false);

  const [state, setState] = useState({});

  const [profilesOnMap, setProfileOnMap] = useState([]);

  const [requestLocationLoader, setRequestLocationLoader] = useState(false);

  const findAndSetProfielsForMap = () => {
    let newProfiles = results.filter((profile) => {
      return (
        profile?.profile?.userId?.vaiNowAvailable?.isPrivate === false ||
        profile?.profile?.userId?.locationRequests?.find(
          (req) => req?.userId == UserData?._id && req?.isApproved
        )
      );
    });
    setProfileOnMap(newProfiles);
  };
  useEffect(() => {
    findAndSetProfielsForMap();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setState({});
    }
  }, isOpen);

  // const center = [51.505, -0.09];
  // const zoom = 13;
  const closeModal = () => {
    setIsOpen(false);
  };

  const sourceMarkerIcon = {
    // url: "/images/user.png", // Replace with your source marker icon URL
    // scaledSize: new google.maps.Size(30, 30), // Set the size of the icon

    url: "/images/vecteezy_pin.svg",
    iconSize: [40, 40], // Adjust the size as needed
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  };

  const [mapRef, setMapRef] = useState();
  // const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();

  const onMapLoad = (map) => {
    setMapRef(map);
    const bounds = new window.google.maps.LatLngBounds();
    profilesOnMap?.forEach((user) =>
      bounds.extend({
        lat: parseFloat(user?.profile?.userId?.incallAddresses?.[0]?.lat),
        lng: parseFloat(user?.profile?.userId?.incallAddresses?.[0]?.lng),
      })
    );
    map.fitBounds(bounds);
  };

  const handleMarkerClick = (id, lat, lng, data) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, data });
    setIsOpenmap(true);
  };

  const handleRequestOrViewonMap = async () => {
    if (
      !state?.item?.userId?.vaiNowAvailable?.isPrivate ||
      state?.item?.userId?.locationRequests?.find(
        (req) =>
          req?.userId == UserData?._id &&
          req?.isApproved &&
          moment(req.rejectedAt).isAfter(
            state?.item?.userId?.vaiNowAvailable?.availableFrom
          )
      )
    ) {
      // handle view on map
      setProfileOnMap([state?.data]);
      setIsOpen(false);
      setCurrentTab("Map");
    } else {
      // handle request
      setRequestLocationLoader(true);
      try {
        await VaridateService.vairifyNowRequestLocation(
          UserData?._id,
          state?.item?.userId?._id
        );
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.error || error.message);
      } finally {
        setRequestLocationLoader(false);
      }
    }
  };

  const GoogleMapExample = withGoogleMap(() => (
    <GoogleMap
      defaultCenter={{
        lat: parseFloat(
          profilesOnMap?.[0]?.profile?.userId?.incallAddresses?.[0]?.lat
        ),
        lng: parseFloat(
          profilesOnMap?.[0]?.profile?.userId?.incallAddresses?.[0]?.lng
        ),
      }}
      onLoad={onMapLoad}
      defaultZoom={13}
    >
      {profilesOnMap.map((user, index) => (
        <Marker
          key={index}
          position={{
            lat: parseFloat(user?.profile?.userId?.incallAddresses?.[0]?.lat),
            lng: parseFloat(user?.profile?.userId?.incallAddresses?.[0]?.lng),
          }}
          icon={sourceMarkerIcon} // Apply the custom source marker icon
          onClick={() =>
            handleMarkerClick(
              index,
              parseFloat(user?.profile?.userId?.incallAddresses?.[0]?.lat),
              parseFloat(user?.profile?.userId?.incallAddresses?.[0]?.lng),
              user
            )
          }
        >
          {isOpenmap && infoWindowData?.id === index && (
            <InfoWindow
              onCloseClick={() => {
                setIsOpenmap(false);
              }}
            >
              <div className="w-full mx-auto flex flex-row justify-around items-center py-0">
                {/* <div className="w-[60px] h-[60px] overflow-hidden rounded-[45px]">
                  <img src="/images/Business.png" />
                </div> */}
                <div className="px-3 text-center">
                  <div className="font-Roboto-Serif text-[17px] font-bold text-[#040C50] leading-[25px] capitalize">
                    {user?.profile?.userId?.name}
                  </div>
                  <div className="font-Roboto-Serif text-[17px] font-bold text-[#040C50] leading-[25px] uppercase">
                    {user?.profile?.userId?.vaiID}
                  </div>
                </div>
                <div className="text-center">
                  <div>
                    <span className="font-Roboto-Serif text-[17px] text-[#040C50] font-black">
                      TruRevu
                    </span>
                  </div>
                  <div className="font-Roboto-Serif text-[17px] font-bold text-[#040C50] leading-[25px]">
                    {user?.profile?.userId?.averageRating}
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
      {/* source marker */}
    </GoogleMap>
  ));

  const MapLoader = withScriptjs(GoogleMapExample);

  return (
    <div
      id="schedule_rules"
      className="main-container px-0 min-h-[calc(100vh-150px)]"
    >
      <div className="w-full mx-auto flex flex-row justify-between items-center py-1 map-list-part px-md-8 px-4">
        <span className="text-[27px] font-bold text-[#01195C]"></span>
        <div className="flex">
          <span
            onClick={() => setCurrentTab("Map")}
            className={`text-[27px] font-bold text-[#A0A0A0] me-5 ${
              currentTab === "Map" && "mapActive"
            }`}
          >
            Map
          </span>

          <span
            onClick={() => setCurrentTab("List")}
            className={`text-[27px] font-bold text-[#A0A0A0] ${
              currentTab === "List" && "listActive"
            }`}
          >
            List
          </span>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-200px)] overflow-hidden pt-0 ">
        {currentTab === "Map" &&
          (profilesOnMap.length ? (
            <MapLoader
              containerElement={<div className="w-full h-[80vh]" />}
              mapElement={<div style={{ height: `100%`, width: "100%" }} />}
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${
                import.meta.env.VITE_APP_GOOGLEMAPS_KEY
              }`}
              loadingElement={<div style={{ height: `100%` }} />}
            />
          ) : (
            // <MapContainer
            //   center={
            //     profilesOnMap?.[0]?.profile?.userId?.incallAddresses?.[0]?.lat
            //       ? [
            //           profilesOnMap?.[0]?.profile?.userId?.incallAddresses?.[0]
            //             ?.lat,
            //           profilesOnMap?.[0]?.profile?.userId?.incallAddresses?.[0]
            //             ?.lng,
            //         ]
            //       : center
            //   }
            //   zoom={zoom}
            //   style={{ height: "100%", width: "100%" }}
            //   bounds={bounds}
            // >
            //   <TileLayer
            //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            //     //attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
            //   />

            //   {profilesOnMap.map((user) => (
            //     <Marker
            //       key={user?.profile?.userId?._id}
            //       position={[
            //         user?.profile?.userId?.incallAddresses?.[0]?.lat,
            //         user?.profile?.userId?.incallAddresses?.[0]?.lng,
            //       ]}
            //       icon={L.icon({
            //         iconUrl: "/images/vecteezy_pin.svg",
            //         iconSize: [40, 40], // Adjust the size as needed
            //         iconAnchor: [16, 32],
            //         popupAnchor: [0, -32],
            //       })}
            //     >
            //       <Popup className="mapspopup">
            //         <div className="w-full mx-auto flex flex-row justify-around items-center py-0">
            //           <div className="w-[60px] h-[60px] overflow-hidden rounded-[45px]">
            //             <img src="/images/Business.png" />
            //           </div>
            //           <div className="px-3 text-center">
            //             <div className="font-Roboto-Serif text-[17px] font-bold text-[#040C50] leading-[25px] capitalize">
            //               {user?.profile?.userId?.name}
            //             </div>
            //             <div className="font-Roboto-Serif text-[17px] font-bold text-[#040C50] leading-[25px] uppercase">
            //               {user?.profile?.userId?.vaiID}
            //             </div>
            //           </div>
            //           <div className="text-center">
            //             <div>
            //               <span className="font-Roboto-Serif text-[17px] text-[#040C50] font-black">
            //                 TRU
            //                 <span className="text-[15px] text-[#040C50] font-light">
            //                   REVU
            //                   <span className="text-[10px] text-[#040C50] font-light">
            //                     ⓒ
            //                   </span>
            //                 </span>
            //               </span>
            //             </div>
            //             <div className="font-Roboto-Serif text-[17px] font-bold text-[#040C50] leading-[25px]">
            //               {user?.profile?.userId?.averageRating}
            //             </div>
            //           </div>
            //         </div>
            //       </Popup>
            //     </Marker>
            //   ))}
            // </MapContainer>
            <p>No Profiles available on map</p>
          ))}

        {currentTab === "List" && (
          <div className="list-part mx-[20px] mt-6">
            <div className="user-card-container pt-2">
              <div className="grid md:grid-cols-2 gap-x-3">
                {results?.map((profile, index) => {
                  const usr = profile?.profile?.userId || {};
                  return (
                    <div
                      key={index}
                      className="list-card mb-2 flex justify-between items-center"
                    >
                      <div className="user-image">
                        <img
                          className="rounded-full"
                          src={`${
                            import.meta.env?.VITE_APP_S3_IMAGE
                          }/${usr?.profilePic}`}
                          // src={`${
                          //   import.meta.env?.VITE_APP_API_USERPROFILE_IMAGE_URL
                          // }/${usr?.profilePic}`}
                          alt=""
                          width="80px"
                          height="80px"
                        />
                      </div>
                      <div className="user-contnet text-center">
                        <h6 className="text-[16px] change-font-family text-white font-bold">
                          {usr?.name}
                        </h6>
                        <p className="text-[10px] uppercase text-white change-font-family font-extrabold">
                          VAI<span className="logoSetupweight">RIFY ID</span> {usr?.vaiID}
                        </p>
                        <p className="text-[14px] text-white change-font-family font-bold">
                          TruRevu
                        </p>
                        <div className="flex gap-1 justify-center">
                          <div className="flex gap-1 mt-1 text-center">
                            {[1, 2, 3, 4, 5].map((item) =>
                              item <= Math.round(usr?.averageRating) ? (
                                <img
                                  key={item}
                                  src="/images/Star.svg"
                                  className="w-[10px]  h-[10px]"
                                  alt=""
                                />
                              ) : (
                                <img
                                  key={item}
                                  src="/images/StarUnfilled.svg"
                                  className="w-[10px]  h-[10px]"
                                  alt=""
                                />
                              )
                            )}
                          </div>
                          <span className="text-white block text-center font-roboto font-bold text-[15px]">
                            {usr?.averageRating}
                          </span>
                        </div>
                      </div>
                      <div className="user-btn flex items-center">
                        {usr?.vaiNowAvailable?.isPrivate &&
                        !usr?.locationRequests?.find(
                          (req) =>
                            req?.userId == UserData?._id &&
                            req?.isApproved &&
                            moment(req.rejectedAt).isAfter(
                              usr?.vaiNowAvailable?.availableFrom
                            )
                        ) ? (
                          <img
                            src="/images/location-red.png"
                            alt="location"
                            className="me-3"
                          />
                        ) : !usr?.vaiNowAvailable?.isPrivate ? (
                          <img
                            src="/images/location-white.png"
                            alt="location"
                            className="me-3"
                          />
                        ) : (
                          <img
                            src="/images/location-green.png"
                            alt="location"
                            className="me-3"
                          />
                        )}
                        <button
                          className=" bg-gradient-to-t px-3 from-[#08FA5A] to-[#0CA36C] rounded-xl font-bold text-[23px] text-[#02227E] py-1 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
                          onClick={() => {
                            setState({
                              item: profile?.profile,
                              data: profile,
                              market: true,
                              vaiNow: true,
                            });
                            setIsOpen(true);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className={
          "bg-[#3760CB] relative top-56 mx-auto py-4 w-[360px] rounded-2xl px-4"
        }
        contentLabel="#"
      >
        <button
          className="cancel-button absolute right-2 top-2 p-1 ml-auto bg-transparent border-0 text-black cursor-pointer z-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
          onClick={closeModal}
        >
          <img src={"/images/close-btn.svg"} alt="cancle" />
        </button>
        <div className="w-full mx-auto flex flex-col justify-center items-cener px-1 text-center">
          <h6 className="text-[30px] change-font-family text-white font-bold capitalize">
            {state?.item?.userId?.name}
          </h6>
          <p className="text-[10px] text-white change-font-family font-bold uppercase">
            VAI<span className="logoSetupweight">RIFY ID</span> {state?.item?.userId?.vaiID}
          </p>
          <div className="w-full mx-auto flex flex-row justify-around items-start my-3 mt-6">
            <div className="icon-btn-part text-center flex flex-col items-center">
              <img
                src={"/images/profile-white.png"}
                alt="location"
                width={36}
              />
              <button
                onClick={() => {
                  navigate("/user/profile", { state });
                }}
                className="mt-3 w-[140px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-Roboto font-bold text-[20px] text-[#040C50] py-1 px-1"
              >
                View Profile
              </button>
            </div>
            <div className="icon-btn-part text-center flex flex-col items-center">
              <img src={"/images/location-white.png"} alt="location" />
              <button
                disabled={requestLocationLoader}
                onClick={handleRequestOrViewonMap}
                className="mt-3 w-[140px] bg-gradient-to-t from-[#08FA5A] to-[#0CA36C] rounded-xl font-Roboto font-bold text-[20px] text-[#040C50] py-1 px-1"
              >
                {!state?.item?.userId?.vaiNowAvailable?.isPrivate ||
                state?.item?.userId?.locationRequests?.find(
                  (req) =>
                    req?.userId == UserData?._id &&
                    req?.isApproved &&
                    moment(req.rejectedAt).isAfter(
                      state?.item?.userId?.vaiNowAvailable?.availableFrom
                    )
                )
                  ? "View on Map"
                  : requestLocationLoader
                  ? "Loading..."
                  : "Request"}
              </button>
            </div>
          </div>
          <div
            onClick={() => navigate(`/chat/${state?.item?.userId?._id}`)}
            className="comment-icon mt-3 text-center flex justify-center"
          >
            <img src={"/images/MessageIcon.png"} alt="chat-icon" />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: import.meta.env.VITE_APP_GOOGLEMAPS_KEY,
})(VairifyMap);
