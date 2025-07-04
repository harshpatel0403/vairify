/* eslint-disable react/prop-types */
import { React, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCaretRight,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { Avatar, CircularProgress, Table, TableBody, TableCell, TableRow } from "@mui/material";
import InputText from "../../../components/InputText";
import IconButton from "../../../components/IconButton";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import moment from "moment";
import DateGuardService from "../../../services/DateGuardService";
import { toast } from "react-toastify";
import { withScriptjs } from "react-google-maps";
import Map from "../../../components/Map.jsx";
import { GoogleApiWrapper } from "google-maps-react";
import { ChatCenteredDots, CalendarCheck, MapPin } from "phosphor-react";
import Tabbar from "../../../components/EmergencyTabBar/EmergencyTabBar.jsx";
import Loading from "../../../components/Loading/Index.jsx";

const tabs = [
  { label: 'Chat', icon: ChatCenteredDots, value: 'chat' },
  { label: 'Details', icon: CalendarCheck, value: 'details' },
  { label: 'location', icon: MapPin, value: 'location' },
];

function DateGuardEmergencyContacts(props) {
  const socket = io(import.meta.env.VITE_APP_SOCKET_BASE_URL);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alarmDetails, setAlarmDetails] = useState({});
  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [groupDetails, setGroupDetails] = useState({});
  const [onlineMembers, setOnlineMembers] = useState([]);
  const [nearestPoliceStation, setNearestPoliceStation] = useState(null);
  const [messageLoading, setMessageLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('chat');
  const params = useParams();

  const ref = useRef(null);

  const MapLoader = withScriptjs(Map);

  useEffect(() => {
    if (messages.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages.length]);

  const getAlarmDetails = async () => {
    try {
      setLoading(true);
      const alarm = await DateGuardService.getAlarm("", "", params.alarmId);
      setAlarmDetails(alarm);
      const appointment = await DateGuardService.getAppointment(
        alarm.appointmentId
      );
      setAppointmentDetails(appointment);
      const group = await DateGuardService.getSingleGroup(alarm.groupId);
      setGroupDetails(group);
      return alarm;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    const alarmId = params.alarmId;
    const memberId = params.memberId;

    getAlarmDetails()
      .then((alarmDetails) => {
        try {

          const map = new props.google.maps.Map(document.getElementById("map"), {
            center: {
              lat: parseFloat(alarmDetails?.location?.latitude),
              lng: parseFloat(alarmDetails?.location?.longitude),
            },
            zoom: 15,
          });

          // Perform a nearby search for police stations
          const request = {
            location: {
              lat: parseFloat(alarmDetails?.location?.latitude),
              lng: parseFloat(alarmDetails?.location?.longitude),
            },
            radius: 1000,
            type: "police",
          };
          const placesService = new props.google.maps.places.PlacesService(map);
          placesService.nearbySearch(request, (results, status) => {
            if (status === props.google.maps.places.PlacesServiceStatus.OK) {
              setNearestPoliceStation(results[0]);
            }
          });
        } catch (error) {
          console.error("Error rendering map: ", error)
        }
      })
      .finally(() => {
        setLoading(false);
      });

    // Join the chat room
    socket.emit("join", { alarmId, memberId }, (data) => {
      console.log(data, " <== I am data in join..");
      if (data.error) {
        alert(data.error);
      }
      if (data && Array.isArray(data)) {
        setMessages(data);
      }
    });

    socket.on("allMessages", (message) => {
      console.log("all message occuredd...");
      setMessages(message);
    });
    socket.on("message", (message) => {
      console.log("single message occuredd...", message);
      setMessages((messages) => [...messages, message]);
    });

    socket.on("memberUpdated", (updatedMembers) => {
      console.log("member update occuredd...", message);
      setOnlineMembers(updatedMembers);
    });

    return () => {
      socket.disconnect(alarmId);
    };
  }, [params.alarmId, params.memberId]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      setMessageLoading(true)
      socket.emit(
        "sendMessage",
        { message, alarmId: params.alarmId, memberId: params.memberId },
        () => { setMessage(""); setMessageLoading(false) }
      );
    }
  };

  return (
    <div className="container h-full">
      <Tabbar color="#DB3002" tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'chat' &&
        <div className="w-full h-[calc(100vh-142px)] mt-[2rem] flex flex-col justify-between main-container shadow-[0px_5px_10px_rgba(0.5,0.5,0.5,0.1)]">
          <div className="messages-container flex flex-col gap-2 max-h-[92%] overflow-scroll">
            <div className="w-full">
              <div className="emergenct-contact-card">
                <div className="emergency-contact-data">
                  {groupDetails?.members?.map((member, index) =>
                    index > 3 ? (
                      <div key={index}></div>
                    ) : (
                      <div
                        key={member._id}
                        className={`emergecy-person 
                        ${onlineMembers.includes(member?.memberId?._id) && "online"}
                        `}
                      >
                        <Avatar>{(member?.memberId?.name?.[0] || "U").toUpperCase()}</Avatar>
                      </div>
                    )
                  )}
                  {groupDetails?.members?.length > 4 && (
                    <div className={`emergecy-person`}>
                      <p>+{groupDetails?.members?.length - 4}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
            {messages && Array.isArray(messages) ? (
              messages.map((message) => (
                <div
                  key={message?._id}
                  className={`w-fit text-black chat-in-line ml-2 ${message?.memberId?._id == params.memberId
                    ? "self-end required-user"
                    : ""
                    }`}
                >
                  <div
                    className={`user-name ${onlineMembers.includes(message?.memberId?._id)
                      ? "online"
                      : ""
                      } `}
                  >
                    <Avatar>{(groupDetails?.members?.find(
                      item => item?.memberId?._id == message?.memberId?._id
                    )?.memberId?.name?.[0])?.toUpperCase() || "U"}</Avatar>
                  </div>
                  <div className="chat-design">
                    <div className="w-fit text-black flex items-center gap-1">
                      {message?.memberId?._id != params.memberId && (
                        <div className="chat-user-name-msg">
                          <div
                            className={`w-[5px] h-[5px] ${onlineMembers.includes(message?.memberId?._id)
                              ? "bg-[#00ff00]"
                              : "bg-[#ff0000]"
                              } rounded-full`}
                          ></div>
                        </div>
                      )}
                      <div
                        className={`${message?.memberId?._id == params.memberId
                          ? "text-right"
                          : "text-left"
                          } text-[10px]`}
                      >
                        {message?.memberId?._id != params.memberId && (
                          <>
                            {message.name || message?.memberId?.name}{" "}
                            {message?.memberId?.phoneNumber}
                          </>
                        )}
                      </div>
                    </div>
                    {/* message */}
                    <div
                      className={`${message?.memberId?._id == params.memberId
                        ? "bg-[#DB3002] text-white"
                        : "bg-[#F4F4F4] text-[#919EAB]"
                        } w-fit font-roboto px-4 rounded-xl py-2 flex flex-col ${message?.memberId?._id == params.memberId
                          ? "self-end"
                          : ""
                        }`}
                    >
                      {message?.memberId?._id != params.memberId && <span>{groupDetails?.members?.find(
                        item => item?.memberId?._id == message?.memberId?._id
                      )?.memberId?.name}</span>}
                      <span className="self-start text-left">
                        {message.message}
                      </span>
                      <span className="text-xs self-end text-[10px]">
                        {moment(message.dateTime).format("HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No messages yet</p>
            )}
            <div ref={ref} />
          </div>
          <div className="send-message-form">
            <form onSubmit={sendMessage} className="flex gap-3 items-center">
              <InputText
                value={message}
                placeholder="Write a message"
                onChange={(e) => setMessage(e.target.value)}
                className="!text-black modal-input !text-[14px] !font-normal !border !border-[#919EAB33] !bg-transparent"
                disabled={messageLoading}
              />
              <div className="ml-[-65px]">
                <IconButton
                  type="submit"
                  className={"bg-blue-950  font-bold h-[40px] w-[40px] disabled:!bg-transparent"}
                  icon={messageLoading ?
                    (<div className="sm:mt-[10px] mt-[5px]">
                      <Loading className="border-black  !w-[20px] !h-[20px]" />
                    </div>)
                    // <CircularProgress size={20} color="#000000" />
                    : <img src="/images/setup/send-icon.svg" alt="icon" />}
                  disabled={messageLoading}
                />
              </div>
            </form>
          </div>
        </div>
      }
      {activeTab === 'details' && (
        (loading ? (
          <div className="text-black h-[100vh] flex items-center justify-center w-full"><Loading /></div>
        ) : (
          <div className="w-full mt-[2rem] h-[calc(100vh-142px)] px-4 shadow-[0px_5px_10px_rgba(0.5,0.5,0.5,0.1)] main-container ">
            <div className="w-full">
              <div className="emergenct-contact-card">
                <div className="emergency-contact-data">
                  {groupDetails?.members?.map((member, index) =>
                    index > 3 ? (
                      <div key={index}></div>
                    ) : (
                      <div
                        key={member._id}
                        className={`emergecy-person 
                        ${onlineMembers.includes(member?.memberId?._id) && "online"}
                        `}
                      >
                        <Avatar>{(member?.memberId?.name?.[0] || "U").toUpperCase()}</Avatar>
                      </div>
                    )
                  )}
                  {groupDetails?.members?.length > 4 && (
                    <div className={`emergecy-person`}>
                      <p>+{groupDetails?.members?.length - 4}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="flex justify-between items-center sm:flex-nowrap flex-wrap gap-5">
              <div className="w-full mt-4 max-w-md flex flex-col gap-4">
                <img
                  style={{ width: "100%", height: "auto" }}
                  src={`${import.meta.env.VITE_APP_S3_IMAGE}/${alarmDetails?.proof?.file}`}
                />
                <div className="bg-blue-950 rounded-xl text-black p-2 px-4 min-h-[80px] mt-4 text-start">
                  {alarmDetails?.proof?.message}
                </div>
              </div>

              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#919EAB",
                        border: "none",
                        padding: "0.4rem",
                      }}
                    >
                      Date/Time
                    </TableCell>
                    <TableCell
                      style={{
                        color: "black",
                        border: "none",
                        textAlign: "end",
                        padding: "0.4rem",
                      }}
                    >
                      {moment(appointmentDetails?.date).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#919EAB",
                        border: "none",
                        padding: "0.4rem",
                      }}
                    >
                      Service
                    </TableCell>
                    <TableCell
                      style={{
                        color: "black",
                        border: "none",
                        textAlign: "end",
                        padding: "0.4rem",
                      }}
                    >
                      {appointmentDetails?.service?.servicesName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#919EAB",
                        border: "none",
                        padding: "0.4rem",
                      }}
                    >
                      Extra's
                    </TableCell>
                    <TableCell
                      style={{
                        color: "black",
                        border: "none",
                        textAlign: "end",
                        padding: "0.4rem",
                      }}
                    >
                      {appointmentDetails?.extras
                        ?.map((ext) => `${ext?.name || ""} ${ext?.price || ""}`)
                        ?.join(", ") || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#919EAB",
                        border: "none",
                        padding: "0.4rem",
                      }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      style={{
                        color: "black",
                        border: "none",
                        textAlign: "end",
                        padding: "0.4rem",
                      }}
                    >
                      {appointmentDetails?.type}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#919EAB",
                        border: "none",
                        padding: "0.4rem",
                      }}
                    >
                      Gender
                    </TableCell>
                    <TableCell
                      style={{
                        color: "black",
                        border: "none",
                        textAlign: "end",
                        padding: "0.4rem",
                      }}
                    >
                      {appointmentDetails?.companionId?.gender}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#919EAB",
                        border: "none",
                        padding: "0.4rem",
                        textTransform: 'uppercase'
                      }}
                    >
                      VAI
                      <span className="logoSetupweight">rifyID</span>
                    </TableCell>
                    <TableCell
                      style={{
                        color: "black",
                        border: "none",
                        textAlign: "end",
                        padding: "0.4rem",
                      }}
                    >
                      {appointmentDetails?.companionId?.vaiID}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#919EAB",
                        border: "none",
                        padding: "0.4rem",
                      }}
                    >
                      Message
                    </TableCell>
                    <TableCell
                      style={{
                        color: "black",
                        border: "none",
                        textAlign: "end",
                        padding: "0.4rem",
                      }}
                    >
                      {appointmentDetails?.message}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      )}
      {alarmDetails?.location &&
        activeTab === 'location' &&
        <div className={`w-full h-[calc(100vh-142px)] mt-[2rem] flex flex-col relative justify-between main-container shadow-[0px_5px_10px_rgba(0.5,0.5,0.5,0.1)]`}>
          <div className="w-full">
            <div className="emergenct-contact-card">
              <div className="emergency-contact-data">
                {groupDetails?.members?.map((member, index) =>
                  index > 3 ? (
                    <div key={index}></div>
                  ) : (
                    <div
                      key={member._id}
                      className={`emergecy-person 
                        ${onlineMembers.includes(member?.memberId?._id) && "online"}
                        `}
                    >
                      <Avatar>{(member?.memberId?.name?.[0] || "U").toUpperCase()}</Avatar>
                    </div>
                  )
                )}
                {groupDetails?.members?.length > 4 && (
                  <div className={`emergecy-person`}>
                    <p>+{groupDetails?.members?.length - 4}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div id="map" />
          <MapLoader
            nearestPoliceStation={nearestPoliceStation}
            alarmDetails={alarmDetails}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_APP_GOOGLEMAPS_KEY}&libraries=places`}
            loadingElement={<div style={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} ></div>}
          />
          {/* {false && alarmDetails?.location?.latitude ? (
              <Map
                ref={mapRef}
                google={props.google}
                style={mapStyles}
                initialCenter={{
                  lat: alarmDetails?.location?.latitude,
                  lng: alarmDetails?.location?.longitude,
                }}
              >
                <Marker></Marker>
              </Map>
            ) : (
              <div className="w-full h-[65vh] mt-[1rem] flex justify-center items-center relative px-4">
            <p className="text-[#ffffff]">Location not found</p>
          </div>
            )} */}
        </div>
      }
    </div >
  );
}

export default GoogleApiWrapper({
  apiKey: import.meta.env.VITE_APP_GOOGLEMAPS_KEY,
})(DateGuardEmergencyContacts);



// import { useEffect, useRef, useState } from "react";
// import { House, Alarm, Gear } from "phosphor-react";
// import Tabbar from "../../../components/TabBar/TabBar";
// import { ChatCenteredDots, CalendarCheck, MapPin } from "phosphor-react";

// const tabs = [
//   { label: 'Chat', icon: ChatCenteredDots, value: 'chat' },
//   { label: 'Details', icon: CalendarCheck, value: 'details' },
//   { label: 'location', icon: MapPin, value: 'location' },
// ];
// function DateGuardEmergencyContacts() {
//   const [activeTab, setActiveTab] = useState('chat');
//   return (
//     <div className="container">
//       <Tabbar color="#DB3002" tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

//       {activeTab === 'chat' && <div>Chat content</div>}
//       {activeTab === 'details' && <div>Details content</div>}
//       {activeTab === 'location' && <div>Location content</div>}
//     </div>
//   )
// }

// export default DateGuardEmergencyContacts












// return (
//   <div className="container form-field-container h-full p-0 w-full">
//     <div className="w-full mx-auto flex flex-col justify-start items-center pt-4 h-full">
//       <div className="w-full">
//         <div className="emergenct-contact-card">
//           <p>Emergency Contacts</p>
//           <div className="emergency-contact-data">
//             {groupDetails?.members?.map((member, index) =>
//               index > 3 ? (
//                 <React.Fragment key={index}></React.Fragment>
//               ) : (
//                 <div
//                   key={member._id}
//                   className={`emergecy-person ${onlineMembers.includes(member?.memberId?._id) && "online"
//                     }`}
//                 >
//                   <p>{(member?.memberId?.name?.[0] || "U").toUpperCase()}</p>
//                 </div>
//               )
//             )}
//             {groupDetails?.members?.length > 4 && (
//               <div className={`emergecy-person`}>
//                 <p>+{groupDetails?.members?.length - 4}</p>
//               </div>
//             )}
//           </div>
//         </div>
//         <Button
//           text="Emergency Contacts"
//           onClick={() => setScreen("chat")}
//           className={
//             "rounded-[25px] bg-gradient-to-b from-[#0198FE] to-[#0247FF] font-bold text-[20px] text-white"
//           }
//         />
//       </div>
//       <div className="flex justify-between w-[80%]  w-full top-three-icon">
//         <div className="three-icon-inner">
//           <div
//             onClick={() => setScreen("chat")}
//             className="rounded-full cursor-pointer w-[80px] h-[80px] border-8 border-red-500 flex items-center justify-center bg-white"
//           >
//             <i className="fa fa-comment text-[30px]" aria-hidden="true"></i>
//           </div>
//           <div
//             onClick={() => setScreen("details")}
//             className="rounded-full cursor-pointer w-[80px] h-[80px] border-8 border-red-500 flex items-center justify-center  bg-white"
//           >
//             <FontAwesomeIcon
//               fontSize={"34px"}
//               color="black"
//               icon={faCalendarDays}
//             />
//           </div>
//           {
//             alarmDetails?.location &&
//             <div
//               onClick={() => setScreen("map")}
//               className="rounded-full cursor-pointer w-[80px] h-[80px] border-8 border-red-500 flex items-center justify-center bg-white"
//             >
//               <FontAwesomeIcon
//                 fontSize={"38px"}
//                 color="black"
//                 icon={faLocationDot}
//               />
//             </div>
//           }
//         </div>
//       </div>

//       {screen === "chat" && (
//         <div className="w-full h-[70vh] mt-[1rem] flex flex-col justify-between main-container">
//           <div className="messages-container flex flex-col gap-2 max-h-[85%] overflow-scroll">
//             {messages && Array.isArray(messages) ? (
//               messages.map((message) => (
//                 <div
//                   key={message?._id}
//                   className={`w-fit text-white min-w-[100px] chat-in-line ${message?.memberId?._id == params.memberId
//                     ? "self-end required-user"
//                     : ""
//                     }`}
//                 >
//                   <div
//                     className={`user-name ${onlineMembers.includes(message?.memberId?._id)
//                       ? "online"
//                       : ""
//                       } `}
//                   >
//                     {(message?.memberId?.name?.[0] || "U").toUpperCase()}
//                   </div>
//                   <div className="chat-design">
//                     <div className="w-fit text-white min-w-[100px] flex items-center gap-1">
//                       {message?.memberId?._id != params.memberId && (
//                         <div className="chat-user-name-msg">
//                           <div
//                             className={`w-[5px] h-[5px] ${onlineMembers.includes(message?.memberId?._id)
//                               ? "bg-[#00ff00]"
//                               : "bg-[#ff0000]"
//                               } rounded-full`}
//                           ></div>
//                         </div>
//                       )}
//                       <div
//                         className={`${message?.memberId?._id == params.memberId
//                           ? "text-right"
//                           : "text-left"
//                           } text-[10px]`}
//                       >
//                         {message?.memberId?._id != params.memberId && (
//                           <>
//                             {message.name || message?.memberId?.name}{" "}
//                             {message?.memberId?.phoneNumber}
//                           </>
//                         )}
//                       </div>
//                     </div>
//                     <div
//                       className={`bg-blue-950 w-fit min-w-[120px] px-4 rounded-xl py-2 flex flex-col ${message?.memberId?._id == params.memberId
//                         ? "self-end"
//                         : ""
//                         }`}
//                     >
//                       <span className="self-start text-left">
//                         {message.message}
//                       </span>
//                       <span className="text-xs self-end text-[10px]">
//                         {moment(message.dateTime).format("HH:mm")}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p>No messages yet</p>
//             )}
//             <div ref={ref} />
//           </div>
//           <div className="send-message-form">
//             <form onSubmit={sendMessage} className="flex gap-3 items-center">
//               <InputText
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 className="text-white modal-input text-[20px]"
//                 disabled={messageLoading}
//               />
//               <div>
//                 <IconButton
//                   type="submit"
//                   className={"bg-blue-950  font-bold h-[40px] w-[40px]"}
//                   icon={messageLoading ? <CircularProgress size={20} /> : <FontAwesomeIcon color="white" icon={faCaretRight} />}
//                   disabled={messageLoading}
//                 />
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {screen === "details" &&
//         (loading ? (
//           <div className="text-white">Loading...</div>
//         ) : (
//           <div className="w-full mt-[3rem] px-4">
//             <Table>
//               <TableBody>
//                 <TableRow>
//                   <TableCell
//                     style={{
//                       color: "white",
//                       border: "none",
//                       padding: "0.4rem",
//                     }}
//                   >
//                     Date/Time
//                   </TableCell>
//                   <TableCell
//                     style={{
//                       color: "white",
//                       border: "none",
//                       textAlign: "end",
//                       padding: "0.4rem",
//                     }}
//                   >
//                     {moment(appointmentDetails?.date).format(
//                       "DD/MM/YYYY HH:mm:ss"
//                     )}
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell
//                     style={{
//                       color: "white",
//                       border: "none",
//                       padding: "0.4rem",
//                     }}
//                   >
//                     Service
//                   </TableCell>
//                   <TableCell
//                     style={{
//                       color: "white",
//                       border: "none",
//                       textAlign: "end",
//                       padding: "0.4rem",
//                     }}
//                   >
//                     {appointmentDetails?.service?.servicesName}
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell
//                     style={{
//                       color: "white",
//                       border: "none",
//                       padding: "0.4rem",
//                     }}
//                   >
//                     Extra's
//                   </TableCell>
//                   <TableCell
//                     style={{
//                       color: "white",
//                       border: "none",
//                       textAlign: "end",
//                       padding: "0.4rem",
//                     }}
//                   >
//                     {appointmentDetails?.extras
//                       ?.map((ext) => `${ext?.name || ""} ${ext?.price || ""}`)
//                       ?.join(", ")}
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell
//                     style={{
//                       color: "white",
//                       border: "none",
//                       padding: "0.4rem",
//                     }}
//                   >
//                     Type
//                   </TableCell>
//                   <TableCell
//                     style={{
//                       color: "white",
//                       border: "none",
//                       textAlign: "end",
//                       padding: "0.4rem",
//                     }}
//                   >
//                     {appointmentDetails?.type}
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell
//                     style={{
//                       color: "white",
//                       border: "none",
//                       padding: "0.4rem",
//                     }}
//                   >
//                     Gender
//                   </TableCell>
//                   <TableCell
//                     style={{
//                       color: "white",
//                       border: "none",
//                       textAlign: "end",
//                       padding: "0.4rem",
//                     }}
//                   >
//                     {appointmentDetails?.companionId?.gender}
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell
//                     style={{
//                       color: "white",
//                       border: "none",
//                       padding: "0.4rem",
//                       textTransform: 'uppercase'
//                     }}
//                   >
//                     VAI
//                     <span className="logoSetupweight">rifyID</span>
//                   </TableCell>
//                   <TableCell
//                     style={{
//                       color: "white",
//                       border: "none",
//                       textAlign: "end",
//                       padding: "0.4rem",
//                     }}
//                   >
//                     {appointmentDetails?.companionId?.vaiID}
//                   </TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//             <div className="w-full mt-4 max-w-md mx-auto">
//               <img
//                 style={{ width: "100%", height: "auto" }}
//                 src={`${import.meta.env.VITE_APP_S3_IMAGE || ""
//                   }/${alarmDetails?.proof?.file}`}
//               />
//             </div>
//             <div className="bg-blue-950 rounded-xl text-white p-2 px-4 min-h-[80px] mt-4 text-start">
//               {alarmDetails?.proof?.message}
//             </div>
//           </div>
//         ))}

//       <div id="map" style={{ display: "none" }} />
//       {screen === "map" && (
//         <div
//           className={`w-full h-[80vh] flex flex-col justify-between relative`}
//         >
//           <MapLoader
//             nearestPoliceStation={nearestPoliceStation}
//             alarmDetails={alarmDetails}
//             googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_APP_GOOGLEMAPS_KEY
//               }`}
//             loadingElement={<div style={{ height: `100%` }} />}
//           />



//           {false && alarmDetails?.location?.latitude ? (
//             <Map
//               ref={mapRef}
//               google={props.google}
//               style={mapStyles}
//               initialCenter={{
//                 lat: alarmDetails?.location?.latitude,
//                 lng: alarmDetails?.location?.longitude,
//               }}
//             >
//               <Marker></Marker>
//             </Map>
//           ) : (
//             <div className="w-full h-[65vh] mt-[1rem] flex justify-center items-center relative px-4">
//               <p className="text-[#ffffff]">Location not found</p>
//             </div>
//           )}




//         </div>
//       )}
//     </div>
//   </div>
// );
// }

// export default GoogleApiWrapper({
// apiKey: import.meta.env.VITE_APP_GOOGLEMAPS_KEY,
// })(DateGuardEmergencyContacts);