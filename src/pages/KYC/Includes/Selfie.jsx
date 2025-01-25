import { toast } from "react-toastify";
import KycService from "../../../services/KycService";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState, React } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import DateGuardService from "../../../services/DateGuardService";
import DetectRTC from "detectrtc";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};
const Selfie = ({
  setIsFileUploaded,
  clientId,
  setLivePhotoData,
  handleLoader,
}) => {
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [faceCompareLoading, setFaceCompareLoading] = useState(true);
  const [hasCamara, setHasCamara] = useState(true);
  const nav = useNavigate();

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({ data: reader.result, fileName: file.name });
      reader.onerror = (error) => reject(error);
    });
  };

  const capture = useCallback(async () => {
    try {
      setFaceCompareLoading(true);
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);

      const userFile = await DateGuardService.dataURLtoFile(
        imageSrc,
        "selfie-image.jpg"
      );

      convertImageToBase64(userFile)
        .then((base64) => {
          let body = {
            clientId: clientId,
            data: base64.data.split(",")[1],
            userId: UserData?._id,
          };
          KycService.uploadSelfie(body)
            .then((response) => {
              setLivePhotoData(response);
              toast.success("Selfie image uploaded successfully", { autoClose: 1000, });
              setIsFileUploaded(true);
              handleLoader(false);
            })
            .catch((error) => {
              toast.error(error?.response?.data || error?.message, { autoClose: 1000 });
              handleLoader(false);
            });
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || error?.message, { autoClose: 1000 });
          handleLoader(false);
        });
    } catch (error) {
      console.log("error", error);
      handleLoader(false);
    }
  }, [webcamRef, setImgSrc]);
  const handleCapture = () => {
    handleLoader(true);
    capture();
  };

  const handleRetry = () => {
    setImgSrc(null);
    setFaceCompareLoading(false);
    setIsFileUploaded(false);
  };

  useEffect(() => {
    if (!UserData) {
      nav("/login");
      return;
    }
    setFaceCompareLoading(true);
    DetectRTC.load(() => {
      setFaceCompareLoading(false);
      if (!DetectRTC.hasWebcam) {
        setHasCamara(false);
      } else {
        setHasCamara(true);
      }
    });
  }, []);

  if (!hasCamara) {
    return (
      <div className="main-container">
        <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
          <div className="w-full mx-auto flex items-center justify-center gap-3">
            <div className="bg-[#ff0000] rounded-full w-[50px]">
              <img src="/images/close-btn.svg" className="w-full" />
            </div>
            <span className="font-bold text-[30px] text-[#05B7FD] change-font-family">
              Camara not found
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="inner-content-part mt-4">
          <div className="w-full mx-auto flex flex-col justify-center items-center pt-2 px-4">
            <div className="w-full mx-auto flex items-center justify-center mt-2">
              <div className="flex-1 flex items-center justify-center">
                {imgSrc ? (
                  <img src={imgSrc} alt="Date Guard Success Changed Code" />
                ) : (
                  <>
                    <Webcam
                      audio={false}
                      height={300}
                      ref={webcamRef}
                      width={300}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {!faceCompareLoading ? (
          <div className="w-full px-4 justify-center mt-4 mb-6 gap-4">
            <div
              className="w-[100%] leading-[50px] text-[#fff] font-semibold bg-[#3760cb] rounded-[10px] mb-4 cursor-pointer"
              onClick={handleCapture}
            >
              Take Photo
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-[20px] px-[10px] ">
            <button
              onClick={handleRetry}
              className="flex w-full items-center justify-center bg-gradient-to-b from-[#202973] to-[#040b47] text-[#fff] font-bold text-[20px] py-2 rounded-[10px]"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Selfie;
