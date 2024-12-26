import { useEffect, useState } from "react";
import SocialServices from "../services/SocialServices";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const SocialLinks = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
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
      <div className="h-full min-h-[calc(100vh-230px)] flex items-center justify-center">
        <div className="text-black h-full flex justify-center items-center">
          <p className="text-[20px] text-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container px-3 py-6 pb-6 gap-2 flex flex-col items-center">
      <div className="w-[100vw] flex flex-col justify-center items-center bg-[#797E9E] h-[40px]">
        <p className="font-bold text-[26px] text-[#040C50]">Follow Me</p>
      </div>

      {data[0]?.message ? (
        <div className="text-[32px] text-[#4b4b4b] font-bold text-center h-[500px] flex flex-col justify-center items-center">
          <div className="image-not">
            <img src="/images/notFound.png" alt="logo" />
          </div>
          Result not found
        </div>
      ) : (
        <div className="cardList w-full mt-5">
          {data?.map((list, index) => (
            <div key={index} className="cardData">
              <div className="cardIcon">
                <img src={"/images/vairify-logo-icon.png"} alt="logo" />
              </div>
              <div className="cardLink">
                {console.log(list?.socialUrl)}
                <a href={list?.socialUrl} target="_blank">{list?.socialUrl}</a>
              </div>
              <div className="sendIcon">
                <img src={"/images/send-vector.png"} alt="logo" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SocialLinks;
