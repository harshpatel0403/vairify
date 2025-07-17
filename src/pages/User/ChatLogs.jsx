import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Loading from "../../components/Loading/Index";
import BottomTabbar from "../../components/BottomTabbar/BottomTabbar";
import PageTitle from "../../components/PageTitle";

const ChatLogs = () => {
  const socket = io(import.meta.env.VITE_APP_SOCKET_BASE_URL);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const navigate = useNavigate();

  const [ChatsData, setChatsData] = useState()
  const [loading, setLoading] = useState(false)


  useEffect(() => {

    setLoading(true)
    socket.emit('fetch-all-in-app-messages', { userId: UserDetails?._id }, (data) => {
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


  if (loading) {
    return (
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
      </div>
    )
  }

  if (ChatsData?.length === 0) {
    return <div className="sm:my-[48px]">
      <div className="sm:bg-[#FFFFFF0A] mx-auto flex flex-col justify-center items-center rounded-[16px] w-[90%] h-[70vh]">
        <img src={'/images/home/no-chats.svg'} className="w-full max-w-[450px] mx-auto" alt="No Data" />
        <h2 className="text-[24px] font-medium text-white text-center">You don't have any chat</h2>
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


  const chatsGroupData = groupItemsByDay(ChatsData?.filter(item => item?.receiverId && item?.senderId && item?.messages?.length > 0) || [])

  return (
    <div className="container mb-[48px]">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Message"} />
      </div>
      <div className="mb-[16px]  chats-container">
        {Object.keys(chatsGroupData).map(item => (
          <>
            <p className="text-white text-[16px] font-medium mb-[8px]">{item}</p>
            {chatsGroupData[item]
              // ?.filter(chat => chat?.receiverId && typeof chat.receiverId === 'object' && chat?.messages?.length > 0)
              ?.map(items => {

                return (
                  <div key={items._id} onClick={() => navigate(`/chat/${items?.[items?.senderId?._id !== UserDetails?._id ? 'senderId' : 'receiverId']?._id}`)}>
                    <div className="bg-[#FFFFFF14] relative justify-between flex rounded-[8px] p-[10px] mb-[16px] cursor-pointer">
                      <div className="flex items-center gap-[16px]">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#b9bacc] overflow-hidden">
                          <img className="w-[40px] h-[40px] rounded-full object-cover"
                            src={
                              import.meta.env.VITE_APP_S3_IMAGE +
                              `/${items?.[items?.senderId?._id !== UserDetails?._id ? 'senderId' : 'receiverId']?.profilePic}`
                            }
                            // src={
                            //   import.meta.env.VITE_APP_API_USERPROFILE_IMAGE_URL +
                            //   `/${items?.[items?.senderId?._id !== UserDetails?._id ? 'senderId' : 'receiverId'] ?.profilePic}`
                            // }
                            alt={items?.[items?.senderId?._id !== UserDetails?._id ? 'senderId' : 'receiverId']?.name}
                          />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-white font-medium text-[14px]">{items?.[items?.senderId?._id !== UserDetails?._id ? 'senderId' : 'receiverId']?.name}</p>
                          <p className="text-[#919EAB] font-medium text-[14px]">VAI<span className="logoSetupweight">RIFY ID</span> {items?.[items?.senderId?._id !== UserDetails?._id ? 'senderId' : 'receiverId']?.vaiID}</p>
                        </div>
                      </div>
                      <div></div>
                    </div>
                  </div>
                )
              })}
          </>
        ))}
      </div>
      <div className="sm:pb-0 pb-[80px]"></div>
      <BottomTabbar
      />
    </div>
  );
};

export default ChatLogs;
