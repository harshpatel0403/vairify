import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

const   ChatLogs = () => {
  const socket = io(import.meta.env.VITE_APP_SOCKET_BASE_URL);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const navigate = useNavigate();

  const [ChatsData, setChatsData] = useState()
  const [loading, setLoading] = useState(false)


  useEffect(() => {

      setLoading(true)
      socket.emit('fetch-all-in-app-messages', { userId: UserDetails?._id },(data) => {
        console.log(data, ' <=== data....')
        setLoading(false)
        setChatsData(data)
      })
      return () => {
        socket.disconnect();
      };
  }, [])


  // const ChatsData = [
  //   {
  //     id: 1,
  //     title: 'SUGAR',
  //     vairifyID: '5SES1688',
  //     img: import.meta.env.BASE_URL + "images/AdminFollowing1.png",
  //     alt: 'AdminFollowing1',
  //     chatDate: 'today'
  //   },
  //   {
  //     id: 2,
  //     title: 'Crystal',
  //     vairifyID: '908UY76',
  //     img: import.meta.env.BASE_URL + "images/AdminFollowing5.png",
  //     alt: 'AdminFollowing5',
  //     chatDate: 'today'
  //   },
  //   {
  //     id: 3,
  //     title: 'Melody',
  //     vairifyID: '084YUI8',
  //     img: import.meta.env.BASE_URL + "images/AdminFollowing4.png",
  //     alt: 'AdminFollowing4',
  //     chatDate: 'today'
  //   },
  //   {
  //     id: 4,
  //     title: 'Amori Love',
  //     vairifyID: '4508GF0',
  //     img: import.meta.env.BASE_URL + "images/AdminFollowing2.png",
  //     alt: 'AdminFollowing2',
  //     chatDate: '7/24/23'
  //   },
  //   {
  //     id: 5,
  //     title: 'Pedal',
  //     vairifyID: '2539YT5',
  //     img: import.meta.env.BASE_URL + "images/AdminFollowing3.png",
  //     alt: 'AdminFollowing3',
  //     chatDate: '7/24/23'
  //   },
  //   {
  //     id: 6,
  //     title: 'Princess Stone',
  //     vairifyID: '',
  //     img: import.meta.env.BASE_URL + "images/AdminFollowing6.png",
  //     alt: 'AdminFollowing6',
  //     chatDate: '7/24/23'
  //   },
  // ]


  if(loading) {
    return (
      <p className="w-full">Loading...</p>
    )
  }

  if (ChatsData?.length === 0) {
    return <div className="p-[40px]">
      <div className="bg-[#ffffff94] max-w-[100%] mx-auto min-h-[calc(100vh-230px)] flex flex-col justify-center rounded-[25px] w-full text-center">
        <img src={'/images/no-chat-data.png'} className="w-full max-w-[450px] mx-auto"alt="No Data" />
        <h2 className="text-[22px]">You don't have any chat</h2>
      </div>
    </div>;
  }

  console.log(ChatsData, ' <=== Iam chat data...')

  // Function to group items by day
  function groupItemsByDay(items) {
    const groupedItems = {};

    items.forEach(item => {
      const updatedAt = moment(item.updatedAt);
      const dayKey = updatedAt.format('YYYY-MM-DD');

      if (!groupedItems[dayKey]) {
        groupedItems[dayKey] = [];
      }

      groupedItems[dayKey].push(item);
    });

    return groupedItems;
  }

  
  const chatsGroupData = groupItemsByDay(ChatsData || [])


  return (
    <div className="p-0 pt-4 m-0 main-container">
      <div className="pb-1">
        <div className="bg-[#8691a6]">
          <span className="text-[#000] text-[25px] font-bold font-serif">Chat Logs</span>
        </div>
        <div className="mx-6 inner-content-part-title">
          {Object.keys(chatsGroupData).map(item => (  
            <>
              <p className="text-[#000] py-2 flex flex-row justify-start text-[18px] font-bold font-serif">{item}</p>
              <div className="border border-black" />
              {chatsGroupData[item]?.map(items => {
                return (
                  <div key={items._id} className="my-4" onClick={() => navigate(`/chat/${items?.[items?.senderId?._id !== UserDetails?._id ? 'senderId' : 'receiverId'] ?._id}`)}>
                    <div className="bg-[#3760CB] relative justify-center flex flex-row rounded-full border-[3px] border-black h-[80px]">
                      <div className="absolute m-1 w-[68px] h-[68px] rounded-full left-0 top-0 bg-[#b9bacc] overflow-hidden border-2">
                        <img className="w-full"
                          src={
                            import.meta.env.VITE_APP_S3_IMAGE +
                            `/${items?.[items?.senderId?._id !== UserDetails?._id ? 'senderId' : 'receiverId'] ?.profilePic}`
                          }
                          // src={
                          //   import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                          //   `/${items?.[items?.senderId?._id !== UserDetails?._id ? 'senderId' : 'receiverId'] ?.profilePic}`
                          // }
                          alt={items?.[items?.senderId?._id !== UserDetails?._id ? 'senderId' : 'receiverId'] ?.name}
                        />
                      </div>
                      <div className="self-center">
                        <p className="text-[#fff] text-[20px] p-0 m-0 font-bold font-serif">{items?.[items?.senderId?._id !== UserDetails?._id ? 'senderId' : 'receiverId'] ?.name}</p>
                        <p className="text-[#fff] p-0 m-0 text-[10px] font-extrabold uppercase">VAI<span className="logoSetupweight">RIFY ID</span> {items?.[items?.senderId?._id !== UserDetails?._id ? 'senderId' : 'receiverId'] ?.vaiID}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>  
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatLogs;
