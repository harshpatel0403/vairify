import React from "react";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  HandleDeletePost,
  HandleGetNewPost,
} from "../../redux/action/MarketplaceSearch";
import Modal from "react-modal";
import { useState } from "react";
import Loading from "../Loading/Index";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export default function ExistingPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const NewPost = useSelector((state) => state.Market.getpost);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setopen] = useState(false);
  const [inquiryData, setInquiryData] = useState({});

  const closeopen = () => {
    setopen(false);
  };

  useEffect(() => {
    dispatch(HandleGetNewPost(UserDetails?._id));
  }, []);

  const deleteButton = async () => {
    setIsLoading(true);
    const data = {
      id: inquiryData?._id,
      s3_url: import.meta.env.VITE_APP_S3_IMAGE
    }
    await dispatch(HandleDeletePost(data))
      .then((result) => {
        if (result?.payload?.status === 200) {
          toast(result?.payload?.data?.message, {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          dispatch(HandleGetNewPost(UserDetails?._id));
          setopen(false);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err, "Error");
      });
  };

  const convertToLocalTime = (utcTimeStr) => {
    const [startTime, endTime] = utcTimeStr.split(' to ');

    const startTimeUTC = moment.utc(`1970-01-01 ${startTime}`, 'YYYY-MM-DD hh:mm A');
    const endTimeUTC = moment.utc(`1970-01-01 ${endTime}`, 'YYYY-MM-DD hh:mm A');

    const localStartTime = startTimeUTC.local().format('hh:mm A');
    const localEndTime = endTimeUTC.local().format('hh:mm A');

    return `${localStartTime} - ${localEndTime}`;
  };

  return (
    <div className="overflow-auto max-h-[1334px] no-scrollbar pt-[24px] lg:pt-0 min-h-[calc(100vh-100px)]">
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
        {NewPost && NewPost.length < 0 ? (
          NewPost?.map((item, index) => {
            item.Repost = true;
            return (
              <div
                key={index}
                className="bg-[#919EAB33] flex flex-col sm:rounded-2xl rounded-xl sm:p-[16px] p-[12px]"
              >
                <div>
                  <div>
                    <img
                      className="rounded-lg h-[140px] w-full object-cover"
                      src={`${import.meta.env.VITE_APP_S3_IMAGE}/${item?.image}`}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col gap-[2px] mt-3">
                    <div className="w-full">
                      <div className="flex flex-col">
                        <div className="grid grid-cols-2">
                          <div className="text-start">
                            <h6 className="text-[14px] text-white font-normal opacity-[0.7]">
                              Location:
                            </h6>
                          </div>
                          <div className="text-start">
                            <h6 className="text-[14px] text-white font-normal">
                              {item.location}
                            </h6>
                          </div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-start">
                            <h6 className="text-[14px] text-white font-normal opacity-[0.7]">
                              Date:
                            </h6>
                          </div>
                          <div className="text-start">
                            <h6 className="text-[14px] text-white font-normal">
                              {item?.date?.from == item?.date?.to ? item?.date?.from : `From ${item?.date?.from} to ${item?.date?.to}`}
                            </h6>
                          </div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-start">
                            <h6 className="text-[14px] text-white font-normal opacity-[0.7]">
                              Time:
                            </h6>
                          </div>
                          <div className="text-start">
                            <h6 className="text-[14px] text-white font-normal">
                              {convertToLocalTime(`${item?.time?.from} to ${item?.time?.to}`)}
                            </h6>
                          </div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="text-start">
                            <h6 className="text-[14px] text-white font-normal opacity-[0.7]">
                              Frequency:
                            </h6>
                          </div>
                          <div className="text-start">
                            <h6 className="text-[14px] text-white font-normal">
                              {item.frequency}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-[#FFFFFF29] rounded-[8px] py-[7px] px-[20px] w-full max-w-[144px] text-[14px] font-medium text-white hover:scale-[0.97] transition-all duration-200"
                    onClick={() =>
                      navigate("/marketplace/post/review", {
                        state: { ...item, from: "view", Repost: false },
                      })
                    }
                  >View</button>
                  <button
                    className="bg-[#FFFFFF] rounded-[8px] py-[7px] px-[20px] w-full max-w-[144px] text-[14px] font-medium text-[#060C4D] hover:scale-[0.97] transition-all duration-200"
                    onClick={() =>
                      navigate("/my-calendar", {
                        state: item,
                      })
                    }
                  >Re-Post</button>
                  <button
                    className="h-[36px] min-w-[36px] hover:scale-[0.97] transition-all duration-200"
                    onClick={() => {
                      setInquiryData(item);
                      setopen(true);
                    }}> <img src="/images/home/bin.svg" alt="bin icon" className="h-[36px] w-[36px]" /> </button>
                </div>
              </div>
            );
          })) : (
          <>
          <div className="w-full flex flex-col justify-center items-center md:col-span-2">
                  <img src="/images/home/no-post.svg" alt="no post"/>
                  <p className="text-white font-bold text-xl mt-[24px]">There is no posts yet </p>
                </div>
          </>
        )}
        <Modal
          isOpen={open}
          onRequestClose={closeopen}
          className=" max-w-[500px] w-full h-[174px] bg-[#FFFFFF] relative rounded-2xl p-[24px]"
        >
          <button
            onClick={() => setopen(false)}
            className="absolute top-[24px] right-[24px]"
          >
            <img
              src="/images/home/modalClose.svg"
              alt="icon"
              width="20px"
              height="20px"
            />
          </button>
          <div>
            <p className="text-[20px] font-medium text-center text-black w-[70%] mx-auto">
              Are you sure you want to cancel your post
            </p>
            <div className="flex justify-around items-center w-full pt-2">
              <div className="w-[40%]">
                <Button
                  className={'secondary-btn'}
                  text={
                    !isLoading ? (
                      "Yes"
                    ) : (
                      <div className="flex items-center justify-center">
                        <Loading />
                      </div>
                    )
                  }
                  size="45px"
                  onClick={deleteButton}
                  disabled={isLoading}
                />
              </div>
              <div className="w-[40%]">
                <Button
                  text={"No"}
                  size="45px"
                  onClick={() => setopen(false)}
                  className={' hover:bg-[#060C4D]'}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
