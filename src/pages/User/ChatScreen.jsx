import "./Styles.css";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Index";
import moment from "moment";
import PageTitle from "../../components/PageTitle";

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
    if (message == "" || message == undefined || message == null || message.trim() == "") {
      toast.error("Please Enter Message")
      return
    }

    const newMessage = {
      message,
      userId: UserDetails?._id,
      dateTime: new Date().toISOString(),
    };

    setCurrentChat((prev) => ({
      ...prev,
      messages: [...(prev?.messages || []), newMessage],
    }));

    setMessage("");
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
    return (
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
      </div>
    )
  }

  return (
    <div className="container">
      <div className="max-h-screen">
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


        {/* <div className="flex flex-col items-center justify-center bg-[#e7b73b]">
          <p className="text-[#000] text-[20px] font-bold p-2">
            Intimate Massage
          </p>
        </div> */}

        <div className="flex flex-col items-center justify-center md:h-[calc(100vh-80px)] h-[calc(100vh-140px)]">
          <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
            <PageTitle title={`${currentChat?.[isSender ? 'receiverId' : 'senderId']?.name || "User"}`} />
          </div>
          <div ref={chatContainerRef} className="w-full flex flex-col overflow-y-auto scrollbar-hidden last-p-space flex-grow h-full relative" >
            {currentChat?.messages?.map((msg) => (
              <>
                <p
                  className={`my-2 text-white text-base py-[4px] px-[8px] font-normal rounded-[8px] w-fit lg:max-w-[700px] max-w-[84%]  ${msg?.userId === UserDetails?._id ? "send bg-[#405FC4] ml-auto " : "receive bg-[#F4F4F429] mr-auto"
                    }`}
                >
                  {msg?.message}
                  <p className="text-right font-[400] text-[12px]">{moment(msg?.dateTime).local().fromNow()}</p>
                </p>
              </>

            ))}
          </div>
          <form
            className="w-full pt-[20px]"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(chat);
            }}
          >
            <div className="w-full border-2 border-[#919EAB33] rounded-[38px] p-[2px] flex items-center justify-center mb-[20px]">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border-0 w-full height-[46px]  break-normal pl-2 bg-transparent ml-4 text-white"
                placeholder="Write a message"
                rows={4}
              />
              <div className="w-[75px]">
                <button
                  className={
                    "w-[75px] text-[20px] font-bold shadow-2xl rounded-[0] p-[10px]"
                  }
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
      </div>
    </div>
  );
};

export default ChatLogs;
