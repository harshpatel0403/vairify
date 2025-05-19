import { useEffect, useState } from "react";
import SocialServices from "../services/SocialServices";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Loading from "../components/Loading/Index";
import PageTitle from "../components/PageTitle";

const SocialLinks = (props) => {
  const location = useLocation();
  const state = props?.state || location?.state;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isFromProp, setIsFromProp] = useState(true);
  useEffect(() => {
    const fromProps = props?.state;
    setIsFromProp(fromProps);
  }, [props?.state]);
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const targetUserId = state == null ? UserDetails?._id : state?._id;

  const getData = () => {
    setLoading(true);
    SocialServices.getUserSocial(targetUserId)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err?.response?.data?.error || err.message);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  console.log("Checking data", data);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className={`container ${!isFromProp ? "mb-[48px]" : "lg:p-0 "}`}>
      <div>
        {!isFromProp &&
          <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
            <PageTitle title={"Follow Me"} />
          </div>
        }
      </div>
      <div className=" lg:mt-0 mt-[24px]">
        {data[0]?.message ? (
          <div className="text-[24px] text-[#ffffff] font-medium text-center h-[500px] flex flex-col justify-center items-center">
            <div className="image-not">
              <img src="/images/home/notfound.svg" alt="logo" />
            </div>
            Result not found
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            {data?.map((list, index) => (
              <div key={index} className="flex items-center gap-[16px] w-full bg-[#919EAB33] p-[16px] rounded-[8px]">
                <div className="w-fit">
                  {/* <img src={"/images/vairify-logo-icon.png"} alt="logo" /> */}
                  <img
                    src={
                      list.socialAppName.toLowerCase() === 'facebook'
                        ? '/images/home/facebook-logo.svg'
                        : list.socialAppName.toLowerCase() === 'instagram'
                          ? '/images/home/instagram-logo.svg'
                          : list.socialAppName.toLowerCase() === 'twitter'
                            ? '/images/home/twitter-logo.svg'
                            : list.socialAppName.toLowerCase() === 'whatsapp'
                              ? '/images/home/whatsapp-logo.svg'
                              : '/images/home/vairify-social.svg'
                    }
                    alt={list.socialAppName}
                    className="min-w-[52px] min-h-[52px] w-[52px] h-[52px]  object-cover rounded-full"
                  />
                </div>
                <div className="">
                  <p className="text-white font-medium text-base">{list.socialAppName}</p>
                  <a href={list?.socialUrl} target="_blank" className="text-[#919EAB] text-xs font-normal">{list?.socialUrl}</a>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default SocialLinks;
