import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import UserService from "../../services/userServices";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HandleUser } from "../../redux/action/Auth";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Index";

const UploadProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handelUpload = async () => {
    setIsLoading(true);
    if (image) {
      let data = new FormData();
      data.append("userId", UserDetails._id);
      data.append("image", image);
      await UserService.uploadProfileImage(data)
        .then((res) => {
          console.log(res);
          dispatch(HandleUser(UserDetails?._id));
          toast(t("uploadprofile.success"), {
            hideProgressBar: true,
            autoClose: 1000,
            type: "success",
          });
          navigate("/setup");
        })
        .catch((err) => {
          toast(err?.response?.data?.message || "Something went wrong", {
            type: "error",
            hideProgressBar: false,
          });
        });
    } else {
      toast(t("uploadprofile.errorNoFile"), {
        type: "error",
        hideProgressBar: false,
      });
    }

    setIsLoading(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (Math.round(file?.size / 1024 / 1024 > 1)) {
        toast(t("uploadprofile.errorTooLarge"), {
          type: "error",
          hideProgressBar: false,
        });
      } else {
        setImage(file);
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const fileInputRef = React.useRef();

  return (
    <div className="main-container form-field-container flex flex-col justify-around h-[calc(100vh-210px)]">
      <div className="text-[27px] font-extrabold pt-7 pb-7 flex-0">
        <span>{t("uploadprofile.title")}</span>
      </div>
      <div className="w-full max-auto flex flex-col justify-center items-center image-upload-data flex-auto">
        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center w-[250px] h-[218px] image-upload-box overflow-hidden">
            {image ? (
              <img className="h-full view-profile-image" src={imagePreview} />
            ) : (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="89"
                  height="75"
                  viewBox="0 0 89 75"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23.7584 9.51738C25.6194 6.37437 26.5499 4.80721 27.8465 3.66548C28.9932 2.65486 30.3422 1.89181 31.8067 1.42543C33.4604 0.900147 35.3038 0.900146 38.995 0.900146H49.601C53.2966 0.900146 55.14 0.900147 56.7937 1.42543C58.2582 1.89181 59.6072 2.65486 60.7539 3.66548C62.0504 4.80721 62.981 6.37437 64.842 9.51738L67.4527 13.9237H70.7602C76.9342 13.9237 80.0212 13.9237 82.3805 15.1045C84.4545 16.1459 86.1402 17.8069 87.1963 19.8494C88.4002 22.1719 88.4002 25.2107 88.4002 31.2884V57.3354C88.4002 63.4131 88.4002 66.4519 87.1963 68.7744C86.1395 70.8153 84.4538 72.4747 82.3805 73.515C80.0212 74.7001 76.9342 74.7001 70.7602 74.7001H17.8402C11.6662 74.7001 8.5792 74.7001 6.21985 73.515C4.14497 72.4754 2.45765 70.816 1.39972 68.7744C0.200196 66.4519 0.200195 63.4131 0.200195 57.3354V31.2884C0.200195 25.2107 0.200196 22.1719 1.39972 19.8494C2.4569 17.8062 4.1443 16.1452 6.21985 15.1045C8.5792 13.9237 11.6662 13.9237 17.8402 13.9237H21.1477L23.7584 9.51738ZM44.3002 61.8937C49.8558 61.8937 55.1839 59.7212 59.1123 55.854C63.0407 51.9869 65.2477 46.742 65.2477 41.2731C65.2477 35.8042 63.0407 30.5592 59.1123 26.6921C55.1839 22.825 49.8558 20.6525 44.3002 20.6525C38.7446 20.6525 33.4165 22.825 29.4881 26.6921C25.5597 30.5592 23.3527 35.8042 23.3527 41.2731C23.3527 46.742 25.5597 51.9869 29.4881 55.854C33.4165 59.7212 38.7446 61.8937 44.3002 61.8937ZM56.2072 41.2731C56.2072 44.3817 54.9527 47.3631 52.7197 49.5612C50.4867 51.7594 47.4581 52.9943 44.3002 52.9943C41.1423 52.9943 38.1137 51.7594 35.8807 49.5612C33.6477 47.3631 32.3932 44.3817 32.3932 41.2731C32.3932 38.1644 33.6477 35.1831 35.8807 32.985C38.1137 30.7868 41.1423 29.5519 44.3002 29.5519C47.4581 29.5519 50.4867 30.7868 52.7197 32.985C54.9527 35.1831 56.2072 38.1644 56.2072 41.2731Z"
                    fill="black"
                  />
                </svg>
              </span>
            )}
          </div>
        </div>
        <div className="custom-select-border">
          <button
            onClick={handleBrowseClick}
            className="photo-upload-btn text-white text-[20px] font-extrabold"
          >
            {t("uploadprofile.browse")}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            style={{ display: "none" }}
            accept="image/*"
          />
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <Button
          onClick={handelUpload}
          text={t("uploadprofile.browse")}
          className={
            "flex items-center max-w-sm justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
          }
        />
      )}
    </div>
  );
};

export default UploadProfile;
