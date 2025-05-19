import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import VaripayService from "../../services/VaripayServices";
import Button from "../../components/Button";
import Loading from "../../components/Loading/Index";
import { IoCloseCircleOutline } from "react-icons/io5";
import moment from "moment";
import PageTitle from "../../components/PageTitle";

export default function ViewTransfer() {
    const [transfers, setTransfers] = useState([]);
    const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
    const [loading, setLoading] = useState(false);

    const getUserVaripayRequests = () => {
        setLoading(true);
        VaripayService.userVariapayRequests(UserDetails?._id)
            .then((res) => {
                setTransfers(res);
                console.log("res: ", res);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getUserVaripayRequests()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center align-center items-center pt-[48px] h-[50vh]">
                <Loading />
            </div>
        )
    }

    else {
        return (
            <div>
                <div className="container mb-[48px]">
                    <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                        <PageTitle title={"View Transfer"} />
                    </div>
                    {transfers?.length > 0 ?
                        <div className="grid md:grid-cols-2 sm:gap-[24px] gap-[16px]">
                            {transfers.map((item, index) => {
                                return (
                                    <div key={item.id} className="w-full p-[16px] bg-[#919EAB33] rounded-[16px]">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex gap-[8px] flex-grow">
                                                <div>
                                                    <img
                                                        className="w-[58px] h-[58px] bg-[#fff] rounded-full overflow-hidden object-cover"
                                                        src={
                                                            `${import.meta.env.VITE_APP_S3_IMAGE}/${item?.requester?.profilePic
                                                            }`
                                                        }
                                                        alt={item?.requester?.name}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="sm:text-base text-sm text-white font-medium">
                                                        {item?.requester?.name}
                                                    </div>
                                                    <div className="sm:text-sm text-xs font-normal text-[#919EAB] uppercase">ID# {' '}
                                                        {item?.requester?.vaiID}
                                                    </div>
                                                    <div className="flex gap-[4px]">
                                                        <p className="sm:text-base text-sm text-white font-semibold">
                                                            {item?.requester?.averageRating}
                                                        </p>
                                                        <img src="/images/home/star.svg" alt="rating" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between gap-[0px]">
                                                <p className="sm:text-base !text-[14px] text-right text-[#919EAB] font-[400]">
                                                    Amount Paid
                                                </p>
                                                <p className="sm:text-base !text-[28px] text-right text-white font-[600]">
                                                    ${item?.amount}
                                                </p>
                                            </div>
                                        </div>

                                        <div className=" flex flex-row justify-between mt-[16px]">
                                            <div className="flex flex-col sm:gap-[10px] gap-[4px] text-left">
                                                <div className="text-white opacity-[0.6] font-[400] text-sm sm:text-base">Payment Status</div>
                                                <div className="text-white opacity-[0.6] font-[400] text-sm sm:text-base">Request Type</div>
                                                <div className="text-white opacity-[0.6] font-[400] text-sm sm:text-base">Payment Time</div>
                                                {/* <div className="text-white opacity-[0.6] font-[400] sm:text-sm !text-[16px]">Remark</div> */}
                                            </div>

                                            <div className="flex flex-col sm:gap-[10px] gap-[4px] text-right">
                                                {item?.slug == "paid" ?
                                                    <div className="text-white font-[400] text-sm sm:text-base flex flex-row gap-x-[inherit]">
                                                        <img src="images/varipays/payment_accepted.svg" />
                                                        Payment successful
                                                    </div> :
                                                    <div className="text-white font-[400] text-sm sm:text-base flex flex-row gap-x-[inherit]">
                                                        <img src="images/varipays/payment_declined.svg" />
                                                        Payment Declined
                                                    </div>
                                                }
                                                <div className="text-white font-[400] text-sm sm:text-base">Intial</div>
                                                <div className="text-white font-[400] text-sm sm:text-base">{moment(item?.updatedAt).format('DD-MM-YYYY, HH:mm:ss')}</div>
                                                {/* <div className="text-white font-[400] sm:text-sm !text-[16px]"></div> */}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        : (
                            <div className="text-xl text-white font-bold text-center flex flex-col justify-center items-center my-[48px] gap-[24px]">
                                <div className="image-not">
                                    <img src="/images/home/result-not-found.svg" alt="not found" />
                                </div>
                                No Transfer are there
                            </div>
                        )}
                </div>
            </div>
        );
    }
}
