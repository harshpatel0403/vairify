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
import BaseAPI from "../../BaseAPI";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export default function ExistingPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const NewPost = useSelector((state) => state.Market.getpost);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
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
          // setError(true);
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

    return `${localStartTime} to ${localEndTime}`;
  };

  return (
    <div className="mt-9 px-3 gap-6 flex flex-col extra-tab-height grid grid-cols-1 gap-0 md:grid-cols-2">
      {NewPost?.map((item, index) => {
        item.Repost = true;
        return (
          <div
            key={index}
            className="bg-[#3760CB] flex flex-col rounded-2xl p-3 border-2 border-white"
          >
            <div className="flex flex-row justify-around items-center">
              <div className="mr-4">
                <img
                  className=" min-w-[97px] h-[97px] rounded-full"
                  src={`${import.meta.env.VITE_APP_S3_IMAGE}/${item?.image}`}
                  alt=""
                />
              </div>
              <div className="flex flex-col gap-[2px]">
                <div className="w-full">
                  <div className="flex flex-col">
                    <div className="grid grid-cols-2">
                      <div className="text-start">
                        <h6 className="text-[10px] text-white font-bold">
                          Location:
                        </h6>
                      </div>
                      <div className="text-start">
                        <h6 className="text-[10px] text-white font-bold">
                          {item.location}
                        </h6>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-start">
                        <h6 className="text-[10px] text-white font-bold">
                          Category:
                        </h6>
                      </div>
                      <div className="text-start">
                        <h6 className="text-[10px] text-white font-bold">
                          {item.category}
                        </h6>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-start">
                        <h6 className="text-[10px] text-white font-bold">
                          Sub:
                        </h6>
                      </div>
                      <div className="text-start">
                        <h6 className="text-[10px] text-white font-bold">
                          Travelling
                        </h6>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-start">
                        <h6 className="text-[10px] text-white font-bold">
                          Date:
                        </h6>
                      </div>
                      <div className="text-start">
                        <h6 className="text-[10px] text-white font-bold">
                          From {item?.date?.from} to {item?.date?.to}
                        </h6>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-start">
                        <h6 className="text-[10px] text-white font-bold">
                          Time:
                        </h6>
                      </div>
                      <div className="text-start">
                        <h6 className="text-[10px] text-white font-bold">
                          {convertToLocalTime(`${item?.time?.from} to ${item?.time?.to}`)}
                          {/* {item?.time?.from} to {item?.time?.to} */}
                        </h6>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-start">
                        <h6 className="text-[10px] text-white font-bold">
                          Frequency:
                        </h6>
                      </div>
                      <div className="text-start">
                        <h6 className="text-[10px] text-white font-bold">
                          {item.frequency}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                text={"Cancel"}
                className={
                  "flex items-center justify-center rounded-full h-[23px] text-white border-[#02227E] border-[1px] from-[#FF0000] to-[#FF0000]"
                }
                size="23px"
                onClick={() => {
                  setInquiryData(item);
                  setopen(true);
                }}
              />
              <Button
                text={"Re-post"}
                className={
                  "flex items-center justify-center rounded-full h-[23px] text-white border-[#02227E] border-[1px] from-[#0C8A02] to-[#0C8A02]"
                }
                size="23px"
                onClick={() =>
                  navigate("/my-calendar", {
                    state: item,
                  })
                }
              />
              <Button
                onClick={() =>
                  navigate("/marketplace/post/review", {
                    state: { ...item, from: "view" },
                  })
                }
                text={"View"}
                className={
                  "flex items-center justify-center rounded-full h-[23px] text-white border-[#02227E] border-[1px] from-[#02227E] to-[#02227E]"
                }
                size="23px"
              />
            </div>
          </div>
        );
      })}
      <Modal
        isOpen={open}
        onRequestClose={closeopen}
        className=" w-[360px] h-[174px] bg-[#3760CB] relative center-modal rounded-2xl px-4"
      >
        <button
          onClick={() => setopen(false)}
          className="absolute top-2 right-2"
        >
          <img
            src="/images/Mask group-close.png"
            alt=""
            width="30px"
            height="30px"
          />
        </button>
        <div className="pt-8">
          <p className="text-[24px] font-bold text-center text-[#fff] leading-8">
            Are you sure you want to cancel your post
          </p>
          <div className="flex justify-around items-center w-full pt-2">
            <div className="w-[40%]">
              <Button
                className={
                  "flex items-center py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[23.4px]"
                }
                text={
                  !isLoading ? (
                    "Yes"
                  ) : (
                    <div className="flex items-center justify-center pt-[6px]">
                      <Loading />
                    </div>
                  )
                }
                size="45px"
                onClick={deleteButton}
              />
            </div>
            <div className="w-[40%]">
              <Button
                className={
                  "flex items-center py-2 my-2 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[23.4px]"
                }
                text={"No"}
                size="45px"
                onClick={() => setopen(false)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
