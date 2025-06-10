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
import PageTitle from "../../../components/PageTitle";

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
  }, [currentTab]);

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

  const handleRequestOrViewonMap = async (item, fullData) => {
    const user = item?.userId;
    if (
      !user?.vaiNowAvailable?.isPrivate ||
      user?.locationRequests?.find(
        (req) =>
          req?.userId == UserData?._id &&
          req?.isApproved &&
          (req?.rejectedAt ? moment(req?.rejectedAt).isAfter(
            user?.vaiNowAvailable?.availableFrom
          ) : true)
      )
    ) {
      // View on Map
      setProfileOnMap([fullData]);
      setCurrentTab("Map");
    }
    else {
      // Request
      setRequestLocationLoader(true);
      try {
        await VaridateService.vairifyNowRequestLocation(
          UserData?._id,
          user?._id
        );
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.error || error.message);
      } finally {
        setRequestLocationLoader(false);
      }
    }
  };


  // const handleRequestOrViewonMap = async () => {
  //   if (
  //     !state?.item?.userId?.vaiNowAvailable?.isPrivate ||
  //     state?.item?.userId?.locationRequests?.find(
  //       (req) =>
  //         req?.userId == UserData?._id &&
  //         req?.isApproved &&
  //         moment(req.rejectedAt).isAfter(
  //           state?.item?.userId?.vaiNowAvailable?.availableFrom
  //         )
  //     )
  //   ) {
  //     // handle view on map
  //     setProfileOnMap([state?.data]);
  //     setIsOpen(false);
  //     setCurrentTab("Map");
  //   } else {
  //     // handle request
  //     setRequestLocationLoader(true);
  //     try {
  //       await VaridateService.vairifyNowRequestLocation(
  //         UserData?._id,
  //         state?.item?.userId?._id
  //       );
  //     } catch (error) {
  //       console.log(error);
  //       toast.error(error?.response?.data?.error || error.message);
  //     } finally {
  //       setRequestLocationLoader(false);
  //     }
  //   }
  // };

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
    <div className="container mb-[48px]">
      <div
        id="schedule_rules"
        className="min-h-[calc(100vh-280px)]"
      >
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"Search results"} isSmall={true}/>
        </div>
        <div className="w-full mx-auto flex flex-row justify-between items-center sm:mt-[48px] mt-[24px] mb-[24px]">
          <div className="flex gap-[16px]">
            <div
              onClick={() => setCurrentTab("Map")}
              className={`whitespace-nowrap px-[12px] py-[6px] text-sm font-bold text-white rounded-[8px] bg-[#FFFFFF14] cursor-pointer ${currentTab === "Map" && "bg-[#FFFFFF4D]"
                }`}
            >
              Map
            </div>

            <div
              onClick={() => setCurrentTab("List")}
              className={`whitespace-nowrap px-[12px] py-[6px] text-sm font-bold text-white rounded-[8px] bg-[#FFFFFF14] cursor-pointer ${currentTab === "List" && "bg-[#FFFFFF4D]"
                }`}
            >
              List
            </div>
          </div>
        </div>

        <div className="w-full ">
          {currentTab === "Map" &&
            (profilesOnMap.length ? (
              <MapLoader
                containerElement={<div className="w-full h-[80vh]" />}
                mapElement={<div style={{ height: `500px`, width: "100%" }} className="rounded-[16px]" />}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_APP_GOOGLEMAPS_KEY
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
            <div className="">
              <div className=" pt-2">
                <div className="grid md:grid-cols-2 sm:gap-[24px] gap-[16px]">
                  {results?.map((profile, index) => {
                    const usr = profile?.profile?.userId || {};
                    return (
                      <div
                        key={index}
                        className="list-card bg-[#919EAB33] rounded-[16px] p-[16px]"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <img
                              src={`${import.meta.env?.VITE_APP_S3_IMAGE
                                }/${usr?.profilePic}`}
                              alt=""
                              className='h-[48px] w-[48px] rounded-full object-cover'
                              width="48px"
                              height="48px"
                            />
                            <div>
                              <h6 className="text-base font-medium text-white">
                                {usr?.name}
                              </h6>
                              <p className="text-sm font-normal text-[#919EAB] uppercase">
                                {usr?.vaiID}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 items-center">
                            <p className="sm:text-[18px] text-base text-white font-bold m-0 mt-1">
                              {usr?.averageRating}
                            </p>
                            <img src="/images/home/star.svg" alt="star" />
                          </div>
                        </div>
                        <div className="mt-[16px] flex gap-[8px] items-center">
                          {/* {usr?.vaiNowAvailable?.isPrivate &&
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
                          )} */}
                          <button
                            className="bg-[#FFFFFF] p-[7px] w-full text-sm font-medium rounded-[8px] text-[#060C4D] flex gap-2 justify-center items-center border border-white"
                            onClick={() => {
                              navigate("/user/profile", {
                                state: {
                                  item: profile?.profile,
                                  data: profile,
                                  market: true,
                                  vaiNow: true,
                                },
                              });
                            }}
                          >
                            <img src="/images/home/profile.svg" alt="profile" />
                            Profile
                          </button>
                          <button className="bg-transparent p-[7px] rounded-[8px] flex justify-center items-center gap-2 text-white w-full border border-[#919EAB33] text-sm font-medium"
                            onClick={() => {
                              navigate(`/chat/${profile?.profile?.userId?._id}`);
                            }}
                          >
                            <img src="/images/home/comment.svg" alt="profile" />
                            Chat
                          </button>
                          <div className="w-max">
                            <button className={`${profilesOnMap?.find(item => item?.profile?._id == profile?.profile?._id) ? 'bg-[#008F34]' : 'bg-[#E43530]'} p-[8px] rounded-[8px] flex justify-between items-center w-[36px]`} disabled={requestLocationLoader}
                              onClick={() => {
                                handleRequestOrViewonMap(profile?.profile, profile);
                              }}>
                              <img src="/images/home/location.svg" alt="location" className="h-[20px] w-[20px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <Modal
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
        </Modal> */}
      </div>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: import.meta.env.VITE_APP_GOOGLEMAPS_KEY,
})(VairifyMap);
