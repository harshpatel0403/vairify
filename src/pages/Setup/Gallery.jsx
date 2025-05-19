import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import React, { useEffect, useState } from "react";
import UserGalleryService from "../../services/UserGalleryService";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { HandleGallaryData } from "../../redux/action/Gallary";
import Loading from "../../components/Loading/Index";
import Header from "../../components/Header/Header";
import { faL } from "@fortawesome/free-solid-svg-icons";
import GalleryDetails from "../User/GalleryDetails";
import LayoutHeader from "../layout/Header";
import BackButton from "../../components/BackButton/backArrowButton";
import PageTitle from "../../components/PageTitle";

const Gallery = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [image, setImage] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setButtonLoading(true);
    let data = new FormData();
    data.append("userId", UserDetails._id);
    data.append("image", image);
    UserGalleryService.uploadImages(data)
      .then((res) => {
        setIsUploaded(true);
        setButtonLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.error || err.message);
        setIsUploaded(false);
      })
      .finally(false);
  };

  const getGallery = (userid) => {
    setIsLoading(true);
    UserGalleryService.getUserGallery(`${userid}`)
      .then((res) => {
        setGallery(res.images);

      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const id = location?.state?.userId || UserDetails?._id;
    if (id) {
      getGallery(id);
    }
  }, [location, UserDetails, isUploaded]);

  const handelImageClick = (e, item) => {
    e.preventDefault();
    navigate("/user/gallery-details", {
      state: {
        item,
        personId: UserDetails?._id,
        user: UserDetails,
      },
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
    setButtonLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fileInputRef = React.useRef();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center sm:my-[390px]">
        <Loading />
      </div>
    )
  }

  return (
    <div >
      <div className="container min-h-[calc(100vh-282px)]">

        <div className=" justify-center items-center relative w-full mt-[48px] md:flex hidden">
          <Button text={'+ Add Image'} className='!w-fit px-4 !absolute left-0 py-[6px] navy-text-btn' onClick={() => setIsModalOpen(true)} />
          <div className="sm:text-[28px] text-2xl font-semibold text-white ">
            Photo Gallery
          </div>
        </div>
        <div className="md:hidden block md:mb-0 sm:mb-[30px] mb-0">
          <PageTitle title={'Photo Gallery'} />
        </div>
        <div className="md:hidden block mb-[24px]">
          <Button text={'+ Add Image'} className='!w-fit px-4  py-[6px] navy-text-btn mt-[16px]' onClick={() => setIsModalOpen(true)} />
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 sm:z-50 z-[99999] bg-[#060C4D] bg-opacity-50 flex items-center justify-center">
            <div className="sm:bg-white bg-[#060C4D] sm:rounded-xl sm:p-6 px-[16px] py-[24px] sm:w-[90%] sm:h-fit sm:max-w-[500px] w-[100%] h-[100vh] relative z-[10000]">
              <div className="relative flex justify-center items-center mb-[24px] max-sm:mt-[24px]">
                <h6 className="sm:text-[#212B36] text-white font-bold sm:text-xl text-2xl">Add Image</h6>
                <button
                  className="absolute right-0 text-black text-xl font-bold sm:block hidden"
                  onClick={closeModal}
                >
                  &times;
                </button>
                <div className="absolute left-0 sm:hidden block" >
                  <button onClick={closeModal} className={`bg-[#FFFFFF14] sm:w-[40px] sm:h-[40px] w-[30px] h-[30px] rounded-full flex items-center justify-center border-none`}>
                    <img src="/images/signup/left-arrow.svg" className="w-[12px] sm:w-auto" alt="logo" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col ">
                <div className="w-full max-auto flex flex-col justify-center items-center image-upload-data flex-auto">
                  <div className="w-full flex flex-col justify-center items-center">

                    {image ? (
                      <img
                        src={imagePreview}
                        alt="Selected Image"
                        className="view-profile-image h-[300px] max-w-[300px] rounded-[16px]"
                      />
                    ) : (
                      <>
                        <div className="flex flex-col justify-center items-center w-full h-[250px] overflow-hidden border border-[#919EAB33] rounded-[16px] bg-[#060C4D14] max-sm:border-dashed max-sm:border-[2px]">
                          <img
                            id="imagePreview"
                            style={{ overflow: "hidden" }}
                            className="w-[28px] h-[28px] max-sm:invert"
                            src={"/images/setup/upload-icon.svg"}
                            alt="Vector Camera"
                          />
                          <p className="mt-3 text-[14px] font-bold sm:text-black text-white">Select file</p>
                        </div>
                        <div >
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
                      </>
                    )}

                  </div>
                </div>
                {isUploaded && (
                  <>
                    <div className="mt-[24px] flex justify-center items-center gap-[10px]">
                      <p className="text-[#008F34] text-xl font-medium">Upload Successfully</p>
                      <img src="/images/setup/checked.svg" alt="Check Mark" />
                    </div>
                    <div className="w-full flex justify-center mt-[24px] gap-4">
                      <Button
                        onClick={closeModal}
                        type="button"
                        size="45px"
                        text='View Gallery'
                        className={'navy-text-btn'}
                      />
                      <Button
                        onClick={(e) => {
                          handelAddMore(e);
                        }}
                        type="button"
                        text="Add More"
                        size="45px"
                        className='secondary-btn max-sm:!bg-[#FFFFFF29]'
                      />

                    </div>
                  </>
                )}
                {!isUploaded && (

                  <div className="mt-[24px] flex flex-row justify-between items-center">
                    <Button
                      className='secondary-btn sm:block hidden'
                      size="45px"
                      onClick={handelUpload}
                      text={
                        buttonLoading ?
                          <Loading />
                          : "Upload image"
                      }
                      disabled={buttonLoading}
                    />
                    <Button
                      className=' sm:hidden block'
                      size="45px"
                      onClick={handelUpload}
                      text={
                        buttonLoading ?
                          <Loading />
                          : "Upload image"
                      }
                      disabled={buttonLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {gallery?.length === 0 ? (
          <div className="flex justify-center items-center my-[90px]">
            <img src="/images/setup/no-photos.svg" alt="No Data" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 grid-cols-2 md:grid-cols-4 sm:gap-[24px] gap-[16px] overflow-scroll pb-[50px] mt-[48px]">
            {gallery &&
              gallery?.map((image, index) => (
                <div
                  key={index}
                  className="w-full aspect-square overflow-hidden "
                  onClick={(e) => handelImageClick(e, image)}
                >
                  <img
                    src={`${import.meta.env.VITE_APP_S3_IMAGE
                      }/${image?.image}`}
                    alt={`Image ${index}`}
                    className="w-full h-full object-cover rounded-[16px]"
                  />

                </div>

              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
