import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import { useSelector } from "react-redux";
import { useState } from "react";
import SocialServices from "../../../services/SocialServices";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Index";

const AddSocial = () => {
  const { t } = useTranslation();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [stateData, setStateData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const HandleData = (event) => {
    setStateData({ ...stateData, [event.target.name]: event.target.value });
  };

  const isValidUrl = (url) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  const handelAddSocial = () => {
    console.log(stateData);
    console.log("UserDetails: ", UserDetails._id);

    if (!stateData?.SocailLink) {
      toast.error(t("addsocial.invalidLink"));
      return;
    }

    // You can add more specific validation criteria here if needed
    if (!isValidUrl(stateData.SocailLink)) {
      toast.error(t("addsocial.invalidUrl"));
      return;
    }
    setIsLoading(true);

    let boduData = {
      userId: UserDetails._id,
      socialAppName: state.name,
      socialUrl: stateData.SocailLink,
    };

    SocialServices.addUserSocial(boduData)
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        navigate("/social-done", {
          state: { state: state },
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.error || err.message);
      });
  };

  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-10">
        {/* <div className="w-full mx-auto flex items-center justify-center">
          <img
            src={import.meta.env.BASE_URL + "images/VairipayAddLogo.png"}
            alt="Vairipay Add Logo"
          />
        </div> */}
        <div className="w-full flex items-center justify-center flex-1">
          <div className="flex items-center justify-center mt-5 w-[199px] h-[180px] bg-[#3760CB] border-2 border-white rounded-xl">
            <img
              src={
                import.meta.env.VITE_APP_API_BASE_URL +
                `/images/socials/${state?.image}`
              }
              alt={state?.image}
              className="p-[20px]"
            />
          </div>
        </div>
        <div className="flex-1 mt-10 w-full flex flex-col justify-center items-start">
          <div className="w-full text-left text-[18px] font-extrabold">
            <span>{t("addsocial.title")}</span>
          </div>
          <div className="mt-custom-14 w-full">
            <InputText
              onChange={HandleData}
              className="text-[20px]"
              name={"SocailLink"}
            />
          </div>
        </div>
        <div className="flex-1 mt-16 w-[50%]">
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              // disabled={stateData?.SocailLink === undefined}
              onClick={handelAddSocial}
              text={t("addsocial.submit")}
              className="custom-btn-bg bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-extrabold text-[23px] cursor-pointer"
            />)}
        </div>
      </div>
    </div>
  );
};

export default AddSocial;
