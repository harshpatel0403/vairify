import { toast } from "react-toastify";
import KycService from "../../../services/KycService";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState, React } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import DateGuardService from "../../../services/DateGuardService";
import DetectRTC from "detectrtc";
import Button from "../../../components/Button";

const videoConstraints = {
  width: 720,
  height: 960,
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
      const imageSrc = webcamRef?.current?.getScreenshot();
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
            performLivenessCheck: false
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
      <div className="container py-[48px]">
        <div className="w-full mx-auto flex flex-col justify-center items-center sm:gap-[48px] gap-[24px]">
          <h6 className="text-[28px] text-center font-semibold text-white ">Camera not found</h6>
          <img src="/images/face-verification/camera-not-found.svg" alt="camera not found" />
          {/* <button onClick={handleSendRequest}>accept</button> */}
          <p className="text-[18px] max-w-[90%] md:max-w-[70%] text-center font-medium text-[#E43530]">
            You can not use face verification feature on this device, please
            retry in your mobile or a device which has working camara.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="mt-4">
          <div className="w-full mx-auto flex flex-col justify-center items-center pt-2 px-4">
            <div className="w-full mx-auto flex items-center justify-center mt-2">
              <div className="flex-1 flex items-center justify-center">
                {imgSrc ? (
                  <img src={imgSrc} alt="Date Guard Success Changed Code" className="max-w-[400px] rounded-[16px]" />
                ) : (
                  <>
                    <div className="relative max-w-[400px] w-full">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        width={400}
                        height={400}
                        screenshotFormat="image/png"
                        videoConstraints={videoConstraints}
                        screenshotQuality={1}
                        minScreenshotWidth={400}
                        minScreenshotHeight={400}
                        style={{ transform: "scaleX(-1)" }}
                        className="rounded-[16px]"
                      />
                      <img src="/images/face-verification/camera-vector.svg" className="left-[5%] top-[5%] absolute z-[100]" />
                      <img src="/images/face-verification/camera-vector.svg" className="right-[5%] top-[5%] absolute z-[100] rotate-[90deg]" />
                      <img src="/images/face-verification/camera-vector.svg" className="left-[5%] bottom-[5%] absolute z-[100] rotate-[-90deg]" />
                      <img src="/images/face-verification/camera-vector.svg" className="right-[5%] bottom-[5%] absolute z-[100]  rotate-[-180deg]" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {!faceCompareLoading ? (
          <div className="w-full px-4 justify-center mt-4 gap-4">
            <div
              className="mx-auto flex items-center justify-center mt-[-40px] relative z-[100] h-[64px] w-[64px] p-2 rounded-full bg-white cursor-pointer"
              onClick={handleCapture}
            >
              <img src="/images/face-verification/camera.svg" alt="camera img" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-[20px] px-[10px] ">
            <Button
              onClick={handleRetry}
              text='Retry'
            />

          </div>
        )}
      </div>
    </>
  );
};

export default Selfie;
