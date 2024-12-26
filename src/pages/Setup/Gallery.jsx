import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import React, { useEffect, useState } from "react";
import UserGalleryService from "../../services/UserGalleryService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HandleGallaryData } from "../../redux/action/Gallary";

const Gallery = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [image, setImage] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isUploaded) {
      dispatch(HandleGallaryData(UserDetails._id));
    }
  }, [isUploaded]);

  const handelUpload = () => {
    if (!image) {
      toast.error("Please select image");
      return;
    }
    let data = new FormData();
    data.append("userId", UserDetails._id);
    data.append("image", image);
    UserGalleryService.uploadImages(data)
      .then((res) => {
        setIsUploaded(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.error || err.message);
        setIsUploaded(false);
      });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handelAddMore = (e) => {
    e.preventDefault();
    setImage(null);
    setIsUploaded(false);
    setImagePreview(null);
  };

  const handleNext = () => {
    navigate("/setup");
  };

  const fileInputRef = React.useRef();

  return (
    <div className="main-container form-field-container flex flex-col justify-around h-[calc(100vh-210px)]">
      <div className="text-[27px] font-extrabold pt-7 pb-7 flex-0">
        <span>Photo Gallery</span>
      </div>
      <div className="w-full max-auto flex flex-col justify-center items-center image-upload-data flex-auto">
        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center w-[250px] h-[218px] image-upload-box overflow-hidden">
            {image ? (
              <img
                src={imagePreview}
                alt="Selected Image"
                style={{}}
                className="view-profile-image"
              />
            ) : (
              <>
                <img
                  id="imagePreview"
                  style={{ overflow: "hidden" }}
                  className="w-[130px] h-[114px]"
                  src={"/images/VectorCamera.png"}
                  alt="Vector Camera"
                />
                <p className="mt-3 text-[14px] font-bold">Photos</p>
              </>
            )}
          </div>
        </div>
        <div className="custom-select-border">
          <button
            onClick={handleBrowseClick}
            className="photo-upload-btn text-white text-[20px] font-extrabold"
          >
            Browse
          </button>
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            name="Choose Image"
            className="image-file-input"
            id="photo-upload"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
        </div>
      </div>
      {isUploaded && (
        <>
          <div className="mt-4 flex flex-col justify-center items-center">
            <img src="/images/CheckMark.png" alt="Check Mark" />
          </div>
          <div className="w-full flex justify-center mt-4 mb-6 gap-4">
            <button
              onClick={(e) => {
                handelAddMore(e);
              }}
              type="button"
              className="bg-gradient-to-b w-full rounded-[10px] text-center shadow-2xl flex justify-center  from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-extrabold text-[21.38px] py-2  h-[45px]  bg-[#05B7FD] items-center"
              style={{ height: 45 }}
            >
              Add More
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="bg-gradient-to-b w-full rounded-[10px] text-center shadow-2xl flex justify-center from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-extrabold text-[21.38px] py-2  h-[45px]  bg-[#05B7FD] items-center"
              style={{ height: 45 }}
            >
              Finished
            </button>
          </div>
        </>
      )}
      {!isUploaded && (
        <div className="mt-custom-34 flex flex-row justify-between items-center">
          <Button
            className={
              "! mx-auto px-4 flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] mt-7"
            }
            size="45px"
            onClick={handelUpload}
            text="Upload >>"
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
