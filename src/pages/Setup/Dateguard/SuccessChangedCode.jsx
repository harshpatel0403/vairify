import React, { useEffect } from "react";
import Webcam from "react-webcam";
import Button from "../../../components/Button";
import DateGuardService from "../../../services/DateGuardService";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import DetectRTC from "detectrtc";
import { useSelector } from "react-redux";
const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

export default function SuccessChangedCode() {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [faceCompareLoading, setFaceCompareLoading] = React.useState(false)

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const nav = useNavigate();

  const capture = React.useCallback(async () => {
    try {
      setFaceCompareLoading(true)
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);

      const userFile = await DateGuardService.dataURLtoFile(imageSrc, 'userFace.jpg')
      console.log(userFile, ' <=== user file..')
      const data = new FormData()
      data.append('file', userFile)
      const resp = await DateGuardService.verifyUserFace(UserDetails._id, data)
      console.log(resp, ' <=== I am user verify api call response')
      handleApprove()
    } catch(error) {
      console.log(error, ' <=== Error while verifing user face')
      handleReject()
    } finally {
      setFaceCompareLoading(false)
    }
  }, [webcamRef, setImgSrc]);

  useEffect(() => {
    console.log('1. coming here....')
    if(!UserDetails) {
      nav('/login')
      return
    }
    console.log('2. coming here....')
    const decoy = localStorage.getItem("decoy");
    const disarm = localStorage.getItem("disarm");
    if(!decoy || !disarm) {
      nav('/dateguard/codes')
      return 
    }
    console.log('3. coming here....')
    DetectRTC.load(() => {
      if (!DetectRTC.hasWebcam) {
        console.log('4. coming here....')
        handleReject();
      }
    });
  }, []);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const decoy = localStorage.getItem("decoy");
      const disarm = localStorage.getItem("disarm");
      await DateGuardService.setupCodes(UserDetails?._id, {
        decoy,
        disarm,
      });
      localStorage.removeItem("decoy");
      localStorage.removeItem("disarm");
      nav('/dateguard/password-success-changed')
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    nav("/dateguard/password-input");
  };

  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        <div className="w-full mx-auto flex items-center justify-center">
          <span className="font-bold text-[30px] text-[#05B7FD] change-font-family">
            Date Guard
          </span>
        </div>
        <div className="w-full mx-auto flex items-center justify-center mt-2">
          <div className="flex-1 flex items-center justify-center">
            {imgSrc ? (
              <img src={imgSrc} alt="Date Guard Success Changed Code" />
            ) : (
              <>
                <Webcam
                  audio={false}
                  height={400}
                  ref={webcamRef}
                  width={400}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </>
            )}
          </div>
        </div>
        {/* <button
          disabled={loading}
          onClick={() => setImgSrc(null)}
          className="w-full mx-auto flex items-center justify-center mt-10"
        >
          <div className="flex-1 flex items-center justify-center">
            <img src="/images/Resume.png" className="w-[50px]" />
          </div>
        </button> */}
        <button
          disabled={faceCompareLoading}
          onClick={capture}
          className="w-full mx-auto flex items-center justify-center mt-10"
        >
          <div className="flex-1 flex items-center justify-center">
            <img
              src={"/images/DateGuardCamera.png"}
              className="w-[50px]"
              alt="Verification Success Mark Icon"
            />
          </div>
        </button>
        {faceCompareLoading && (
          <p className="text-[#ffffff]">Please wait...</p>
        )}
        {false && imgSrc && (
          <div className="mt-3 flex gap-3">
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Approve"}
              className="bg-[#05B7FD] rounded-[10px] font-bold text-[30px] h-[41px] flex items-center justify-center change-font-family px-10"
              size="41px"
              onClick={handleApprove}
            />
            <Button
              disabled={loading}
              text={"Reject"}
              className="bg-[#05B7FD] rounded-[10px] font-bold text-[30px] h-[41px] flex items-center justify-center change-font-family px-10"
              size="41px"
              onClick={handleReject}
            />
          </div>
        )}
        {/* <div className='w-full mx-auto flex items-center justify-center mt-2'><span className='font-bold text-[28px] text-[#05B7FD] change-font-family'>Codes Successfully Changed</span></div> */}
      </div>
    </div>
  );
}
