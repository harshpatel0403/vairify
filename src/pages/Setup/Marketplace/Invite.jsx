import React, { useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleMyInvitation,
  HandleUpdateInvitationStatus,
} from "../../../redux/action/MarketplaceSearch";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";

export default function Invite() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const myInvitation = useSelector((state) => state?.Market?.myInvitation);
  console.log(
    "🚀 ~ file: Invite.jsx:11 ~ Invite ~ myInvitation:",
    myInvitation
  );

  useEffect(() => {
    dispatch(HandleMyInvitation(UserDetails?._id));
  }, []);

  const filteredInvites = myInvitation?.filter((item) => {
    let isCancelled = false;
    let isAcceptedOrPending = false;

    item.invitee.forEach((invitee) => {
      if (invitee.id === UserDetails?._id) {
        if (invitee.status === "cancel") isCancelled = true;
        if (invitee.status === "accept" || invitee.status === "pending") {
          isAcceptedOrPending = true;
          item.status = invitee.status; // Set status for rendering
        }
      }
    });

    return !isCancelled && isAcceptedOrPending;
  });


  return (
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Invitations"} />
      </div>
      {filteredInvites?.length ? (
        <div>
          {/* <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <p className="w-[18px] h-[17px] bg-[#0CA36C]"></p>
              <p className="text-[26px] font-bold">Accepted</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="w-[18px] h-[17px] bg-[#0247FF]"></p>
              <p className="text-[26px] font-bold">Active</p>
            </div>
          </div> */}
          <div className="grid grid-cols-1 gap-[24px] lg:grid-cols-2">
            {filteredInvites.map((item, index) => {
              item.client = true;
              const startTime = moment(item?.invitationtime.from, "hh:mm A");
              const endTime = moment(item?.invitationtime.to, "hh:mm A");
              const duration = moment.duration(endTime.diff(startTime));
              const hours = duration.hours();
              const minutes = duration.minutes();
              // item?.invitee?.map((D) => {
              //   if (D?.id === UserDetails?._id && D.status === "accept") {
              //     item.status = D.status;
              //     return item;
              //   }
              // });
              // var isCancelled = false;
              // item.invitee.map((invitee) => {
              //   if (invitee?.id === UserDetails?._id) {
              //     if (invitee.status === "cancel") {
              //       isCancelled = true;
              //     }
              //   }
              // });
              // if (isCancelled) {
              //   return <React.Fragment key={item._id}></React.Fragment>;
              // }
              return (
                <div
                  key={index}
                  // className={`
                  //   bg-${item.status === "pending" ? "[#3760CB]" : "[#0CA36C]"
                  //   } flex flex-col rounded-2xl px-3 py-1.5 border-2 border-white`}
                  className="w-full p-[16px] bg-[#919EAB33] rounded-[16px]"
                >

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-[8px] flex-grow">
                      <div>
                        {item?.userId?.profilePic ? (
                          <img
                            src={
                              import.meta.env.VITE_APP_S3_IMAGE +
                              `/${item?.userId?.profilePic}`
                            }
                            className="w-[70px] h-[70px] rounded-full object-cover"
                            alt="Hot Rod"
                          />
                        ) : (
                          <img
                            className="w-[70px] h-[70px] rounded-full object-cover"
                            src={
                              item?.userId?.gender === "Male"
                                ? "/images/male.png"
                                : "/images/female.png"
                            }
                            alt="Hot Rod"
                          />
                        )}
                      </div>
                      <div>
                        <div className="sm:text-base text-sm text-white font-medium">{item?.userId?.name}</div>
                        <div className="sm:text-sm text-xs font-normal text-[#919EAB] uppercase">{item?.userId?.vaiID}</div>
                        <div className="flex gap-[4px]">
                          <p className="sm:text-base text-sm text-white font-semibold">{item?.userId?.averageRating}</p>
                          <img src="/images/home/star.svg" alt="rating" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-white opacity-[0.48] font-normal text-sm">
                        Price Offered
                      </div>
                      <div className="font-semibold text-white text-[28px] text-right"> ${item.priceoffered}</div>
                    </div>
                  </div>
                  <div className="mt-[16px]">
                    <div className="flex justify-between gap-2">
                      <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">Request Appt/time</div>
                      <p className="text-white sm:text-sm text-xs font-medium text-right">{moment(item.createdAt).format("DD/MM/YY")}{" "} {item?.invitationtime.from} to {item?.invitationtime.to}</p>
                    </div>
                    <div className="flex justify-between gap-2 mt-[2px]">
                      <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">Requested Service/time</div>
                      <p className="text-white sm:text-sm text-xs font-medium">{hours} hr {minutes} m</p>
                    </div>
                    <div className="flex justify-between gap-2 mt-[2px]">
                      <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">Requested Location</div>
                      <p className="text-white sm:text-sm text-xs font-medium"> {item.venue}</p>
                    </div>
                    <div className="flex justify-between gap-2 mt-[2px]">
                      <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">Message</div>
                      <p className="text-white sm:text-sm text-xs font-medium text-right"> {item.specialty}</p>
                    </div>
                    <div className="flex justify-between gap-2 mt-[2px]">
                      <div className="text-white opacity-[0.6] font-normal sm:text-sm text-xs">Status</div>
                      <p className={` sm:text-sm text-xs font-medium ${item.status === "pending" ? "text-[#0085B9]" : "text-[#008F34]"}`}>
                        {item.status === "pending" ? "Pending" : "Accepted"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-[16px] flex gap-[8px]">
                    <Button
                      text={'View Profile'}
                      onClick={() =>
                        navigate("/user/profile", {
                          state: { item, market: true },
                        })}
                      size={'36px'}
                      className={'py-[4px]'}
                    />
                    <Button
                      text={'View Invitation'}
                      onClick={() =>
                        navigate("/marketplace/active/invitation", {
                          state: item,
                        })
                      }
                      size={'36px'}
                      className={'py-[4px] !bg-transparent secondary-btn border-2 border-[#919EAB33] hover:!bg-[#919EAB33]'}
                    />
                    {/* <div className="w-[103px]">
                      <Button
                        onClick={() => handleCancelInvite(item._id)}
                        text={"Cancel"}
                        className={
                          "text-[14px] text-white font-bold border-2 border-white bg-[#DB3002] leading-4 rounded-full w-[144px] mt-[3px]"
                        }
                        size={"36px"}
                      />
                    </div> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-xl text-white font-bold text-center flex flex-col justify-center items-center my-[48px] gap-[24px]">
          <div className="image-not">
            <img src="/images/home/result-not-found.svg" alt="not found" />
          </div>
          Result not found
        </div>
      )}
    </div>
  );
}
