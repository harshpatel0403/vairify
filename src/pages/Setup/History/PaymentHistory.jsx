import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import VaridateService from "../../../services/VaridateServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import PaySubscriptionServices from "../../../services/PaySubscriptionServices";
import Loading from "../../../components/Loading/Index";
import PageTitle from "../../../components/PageTitle";

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState([]);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const VaiMembershipHistoryData = UserDetails?.kyc;

  const handlePurchasedDate = (purchasedDate) => {
    const formattedDate = moment(purchasedDate).format("DD/M/YY HH:mm a");
    return formattedDate;
  };

  const handleExpiryDate = (purchasedDate) => {
    const formattedDate = moment(purchasedDate).format("DD/M/YY");
    return formattedDate;
  };

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await PaySubscriptionServices.getUserTransactions(
        UserDetails?._id
      );
      setTransactionData(response?.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    )
  }

  return (
    <div className="container">
      <div className='min-h-[calc(100vh-350px)]'>
        <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
          <PageTitle title={"Payment History"} />
        </div>
        <div className="flex flex-col justify-between">
          {!transactionData?.length && (
            <div className="text-xl text-white font-bold text-center flex flex-col justify-center items-center my-[48px] gap-[24px]">
              <div className="image-not">
                <img src="/images/home/result-not-found.svg" alt="not found" />
              </div>
              Result not found
            </div>
          )}
          <div className="">
            <div className="mt-[20px] gap-[26px]">
              <div className="grid md:grid-cols-2 gap-4 mb-[48px]">
                {transactionData &&
                  transactionData?.map((item, index) => {
                    return (
                      <div key={index} className="sm:w-[100%] bg-[#FFFFFF14]  p-[16px] rounded-[15px] h-[auto] ">
                        <div className="flex gap-2 sm:gap-4 items-center">

                          <div className="flex-1">
                            <div className="flex-col items-center">
                              <div className="text-left text-[14px]">
                                <div className="flex flex-row justify-between items-center">
                                  <h6 className="text-[#ffffff82] font-roboto mb-2">
                                    Amount
                                  </h6>

                                  <h6 className="text-white font-roboto mb-2">
                                    {`$${item?.amount}.00`}
                                  </h6>
                                </div>

                                <div className="flex flex-row justify-between  items-center">
                                  <h6 className="text-[#ffffff82] font-roboto mb-2">
                                    Type
                                  </h6>

                                  <h6 className="text-white font-roboto mb-2 capitalize">
                                    {`${item?.type}`}
                                  </h6>
                                </div>
                                <div className="flex flex-row justify-between  items-center">
                                  <h6 className="text-[#ffffff82] font-roboto mb-2">
                                    Status
                                  </h6>

                                  <h6 className="text-white font-roboto mb-2 capitalize">
                                    {`${item?.status}`}
                                  </h6>
                                </div>

                                <div className="flex flex-row justify-between  items-center">
                                  <h6 className="text-[#ffffff82] font-roboto mb-2">
                                    Transaction Id
                                  </h6>
                                  <h6 className="text-white font-roboto mb-2 max-w-[200px] break-all ml-3">
                                    {item?.transactionId}
                                  </h6>
                                </div>

                                <div className="flex flex-row justify-between  items-center">
                                  <h6 className="text-[#ffffff82] font-roboto mb-2">
                                    Transaction Date
                                  </h6>
                                  <h6 className="text-white font-roboto mb-2">
                                    {handleExpiryDate(item.createdAt)}
                                  </h6>
                                </div>
                              </div>
                              <div className="user-information"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
