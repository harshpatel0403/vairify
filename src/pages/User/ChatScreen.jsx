import "./Styles.css";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const ChatLogs = () => {
  const socket = io(import.meta.env.VITE_APP_SOCKET_BASE_URL);
  const [chat, setChat] = useState({});
  const [allChat, setAllChat] = useState([]);
  const [currentChat, setCurrentChat] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  const params = useParams();

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const profileSelectedHandler = (data) => {
    navigate(`/chat/${data._id}`);
  };

  const handleMessageUpdate = (data) => {
    setAllChat(data);
    setLoading(false);
  };

  useEffect(() => {
    if (allChat && Array.isArray(allChat)) {
      let selectedChat = allChat.find((item) => item._id === chat?._id);
      setCurrentChat(selectedChat);
    }
  }, [allChat]);

  useEffect(() => {
    setLoading(true);
    socket.on("allMessages-in-app", (data) => handleMessageUpdate(data, chat));
    socket.emit(
      "join-in-app-chat",
      { userId: UserDetails?._id, receiverId: params?.receiverId },
      (joinData) => {
        if (joinData.error) {
          alert(joinData.error);
        }
        setChat(joinData);
        socket.emit(
          "fetch-all-in-app-messages",
          { userId: UserDetails?._id },
          (data) => handleMessageUpdate(data, joinData)
        );
      }
    );
  }, [params]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [currentChat?.messages]);

  const isSender = currentChat?.senderId?._id === UserDetails?._id;
  const sendMessage = async (chat) => {
    socket.emit(
      "sendMessage-in-app-chat",
      {
        message,
        senderId: UserDetails?._id,
        receiverId: params?.receiverId,
      },
      (data) => {
        console.log(data, " <==  I am data...");
      }
    );
    setMessage("");
  };

  const getUniqueChats = () => {
    let ids = {};
    allChat.forEach((item) => {
      if (UserDetails?._id !== item?.senderId?._id)
        ids[item?.senderId?._id] = item?.senderId;
      if (UserDetails?._id !== item?.receiverId?._id)
        ids[item?.receiverId?._id] = item?.receiverId;
    });
    let uniqueChats = [];
    Object.keys(ids).forEach((item) => {
      uniqueChats.push(ids[item]);
    });
    return uniqueChats;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-[calc(100vh-149px)] p-0 m-0 bg-white main-container chat-p">
      {/* <div className="flex flex-row items-start justify-between w-full px-8 mt-2">
          <div className="flex flex-col items-center justify-center">
            <div className="z-50">
              <span className="text-[18px] text-[#FFF] font-extrabold">
                VAI
                <span className="text-[18px] text-[#040C50] font-semibold">
                  RIFY ID
                </span>
              </span>
            </div>
            <div className="z-50">
              <span className="text-[15px] text-[#040C50] font-bold">
                {currentChat?.[isSender ? 'senderId' : 'receiverId']?.vaiID}
              </span>
            </div>
          </div>
          <div className="w-[120px] relative">
            <div
              style={{ left: "10px", bottom: "65px" }}
              className="absolute w-full h-full rounded-full"
            >
              <img
                // src={"/images/AdminAboutMe2.png"}
                src={
                  import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                  `/${currentChat?.[isSender ? 'senderId' : 'receiverId']?.profilePic}`
                }
                alt="Profile"
              />
            </div>
            <div style={{ right: "0px", top: "25px" }} className="absolute">
              <div className="h-[30px] w-[30px] rounded-full bg-black flex flex-col justify-center items-center">
                <img src={"/images/add-profile.png"} alt="add-profil" />
              </div>
            </div>
          </div>
          <div>
            <div>
              <span className="text-[18px] text-[#040C50] font-bold">
                 TruRevu
              </span>
            </div>
            <div className="flex flex-row items-center justify-center">
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <FontAwesomeIcon
                icon={faStar}
                color="#E1AB3F"
                className="text-[10px] margin-right-5"
              />
              <span className="text-[15px] text-[#040C50] font-bold">5.0</span>
            </div>
          </div>
        </div> */}

      <div className="w-[calc(100%-63px)] ml-[63px]">
        <div className="flex flex-col items-center justify-center bg-[#e7b73b]">
          {/* <p className="text-[#000] text-[20px] font-bold p-2">
            Intimate Massage
          </p> */}
        </div>

        <div className="">
          <div className="flex flex-col items-center justify-center">
            <div ref={chatContainerRef} className="w-full bg-[#b9bbcb] flex flex-col items-center h-[calc(100vh-204px)] overflow-y-auto px-[30px] last-p-space pt-4">
              {currentChat?.messages?.map((msg) => (
                <p
                  className={`my-2 ${msg?.userId === UserDetails?._id ? "send" : "receive"
                    }`}
                >
                  {msg?.message}
                </p>
              ))}
            </div>
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(chat);
              }}
            >
              <div className="w-full bg-[#405fc4] p-[2px] flex items-center justify-center">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-2 w-full height-[46px] leading-[46px] break-normal pl-2"
                  placeholder="Type here..."
                  rows={4}
                />
                <div className="w-[75px]">
                  <button
                    className={
                      "w-[75px] bg-gradient-to-b from-[#405fc4] to-[#405fc4] text-[#fff] text-[20px] font-bold shadow-2xl rounded-[0] p-[10px]"
                    }
                    //text={'Send'}
                    // onClick={() => sendMessage(chat)}
                    type="submit"
                    size={"45px"}
                  >
                    <img
                      src={"/images/sendicon.png"}
                      alt="send"
                      className="mx-auto"
                      width={"30px"}
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div></div>
        </div>

        <div className="absolute rounded-l-2xl left-0 top-0 bottom-0 bg-[#313EB4] w-[63px] flex flex-col items-center justify-center">
          <div className="h-[290px] overflow-y-scroll no-scrollbar">
            {getUniqueChats()?.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => profileSelectedHandler(item)}
                  className="m-2 relative h-[50px] w-[50px] rounded-full overflow-hidden"
                  style={
                    item?._id === params.receiverId
                      ? { borderColor: "white", borderWidth: 3 }
                      : {}
                  }
                >
                  {item?._id === params.receiverId && (
                    <div className="absolute top-4 bottom-0 right-[-14px]">
                      <img
                        height={12}
                        width={12}
                        src={import.meta.env.BASE_URL + "images/Polygon-2.png"}
                        alt={"Polygon-2"}
                      />
                    </div>
                  )}
                  <div>
                    <img
                      height={48}
                      width={48}
                      src={
                        import.meta.env.VITE_APP_S3_IMAGE +
                        `/${item?.profilePic}`
                      }
                      // src={
                      //   import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                      //   `/${item?.profilePic}`
                      // }
                      alt={item?.name}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLogs;
