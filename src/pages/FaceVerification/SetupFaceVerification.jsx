import React, { useEffect } from "react";
import Webcam from "react-webcam";
import DateGuardService from "../../services/DateGuardService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DetectRTC from "detectrtc";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading/Index";
import UserService from "../../services/userServices";
import { HandleUser, uploadFaceVerificationImage } from "../../redux/action/Auth";
import BackButton from "../../components/BackButton/backArrowButton";
import Button from "../../components/Button";

const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user",
};

export default function SetupFaceVerification() {
    const webcamRef = React.useRef(null);
    const dispatch = useDispatch();
    const nav = useNavigate();

    const [imgSrc, setImgSrc] = React.useState(null);
    const [hasCamara, setHasCamara] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [faceCompareLoading, setFaceCompareLoading] = React.useState(false);
    const [isApproved, setIsApproved] = React.useState(false);
    const [file, setFile] = React.useState(null);

    const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

    useEffect(() => {
        if (!UserDetails) {
            nav("/login");
            return;
        }
        DetectRTC.load(() => {
            setFaceCompareLoading(true);
            if (!DetectRTC.hasWebcam) {
                setHasCamara(false);
            } else {
                setHasCamara(true);
            }
        });
    }, []);

    const capture = React.useCallback(async () => {
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);

            const userFile = await DateGuardService.dataURLtoFile(
                imageSrc,
                "userFace.jpg"
            );
            setFile(userFile);
            console.log(userFile, " <=== user file..");
        } catch (error) {
            console.log(error, " <=== Error while verifing user face");
        } finally {
            setFaceCompareLoading(true);
            setIsApproved(true);
        }
    }, [webcamRef, setImgSrc]);

    const handelUploadManualSelfie = async () => {
        setIsLoading(true);
        // if (file) {
        let data = new FormData();
        data.append("userId", UserDetails._id);
        data.append("image", file);
        await dispatch(uploadFaceVerificationImage(data))
            .then((res) => {
                // dispatch(HandleUser(UserDetails?._id));
                toast("Face Verification Completed", {
                    hideProgressBar: true,
                    autoClose: 1000,
                    type: "success",
                });
                // TODO: add checks if user has vai completed do not ask for it
                //   navigate("/setup");
                nav("/get-vai");
            })
            .catch((err) => {
                toast(err?.response?.data?.message || "Something went wrong", {
                    type: "error",
                    hideProgressBar: false,
                });
            });
        // } else {
        //     toast("Please Upload your Face picture", {
        //         type: "error",
        //         hideProgressBar: false,
        //     });
        // }
        setIsLoading(false);
    };

    const handleRetry = () => {
        setIsApproved(false);
        setFile(null);
        setImgSrc(null);
    };


    if (!hasCamara) {
        return (
            <div className="container py-[48px]">
                <div className="w-full mx-auto flex flex-col justify-center items-center sm:gap-[48px] gap-[24px]">
                    <h6 className="sm:text-[28px] text-[24px] text-center sm:font-semibold font-medium text-white ">Camera not found</h6>
                    <img src="/images/face-verification/camera-not-found.svg" alt="camera not found" className="sm:w-[300px] w-[200px]"/>
                        {/* <button onClick={handleSendRequest}>accept</button> */}
                    <p className="text-[18px] max-w-[90%] md:max-w-[70%] text-center sm:font-medium font-normal text-[#E43530]">
                        You can not use face verification feature on this device, please
                        retry in your mobile or a device which has working camara.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-6">
            <div className="sm:p-[40px] relative">
                <div className="backnavigation"><BackButton /></div>
                <div className="logo-img-container">
                    <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
                    <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
                </div>
                <div className="mt-10">
                    <h2 className="lg:text-[28px] sm:text-2xl text-xl font-bold text-white mb-2 text-center">
                        Face Verification
                    </h2>
                </div>
                <div className=" mt-4 ">
                    <div className="w-full mx-auto flex flex-col justify-center items-center pt-2 px-4">
                        <div className="w-full mx-auto flex items-center justify-center mt-2">
                            <div className="flex-1 flex items-center justify-center">
                                {imgSrc ? (
                                    <img src={imgSrc} alt="Date Guard Success Changed Code" className="rounded-[16px]" />
                                ) : (
                                    <>
                                        <div className="relative">
                                            <Webcam
                                                audio={false}
                                                height={400}
                                                ref={webcamRef}
                                                className="rounded-[16px] w-full max-w-[400]"
                                                screenshotFormat="image/jpeg"
                                                videoConstraints={videoConstraints}
                                                style={{ transform: "scaleX(-1)" }}
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
                        {faceCompareLoading && !isApproved && (
                            <button
                                disabled={!faceCompareLoading}
                                onClick={capture}
                                className="mx-auto flex items-center justify-center mt-[-40px] relative z-[100] h-[64px] w-[64px] p-2 rounded-full bg-white"
                            >
                                <img src="/images/face-verification/camera.svg" alt="camera img" />
                            </button>
                        )}
                        {!faceCompareLoading && <p className="">Please wait...</p>}

                        <div className="w-full mt-5">
                            {isApproved && (
                                <div className="flex flex-col items-center">
                                    {/* <div className="bg-[#ff0000] rounded-full mb-3">
                                    <img src="/images/close-btn.svg" className="w-[70px]" />
                                </div> */}
                                    <Button
                                        onClick={handleRetry}
                                        text='Retry'
                                        className='max-w-[500px]'
                                    />
                                    <Button
                                        onClick={handelUploadManualSelfie}
                                        disabled={isLoading}
                                        text={isLoading ? <Loading /> : "Confirm"}
                                        className='max-w-[500px] mt-4'
                                    />

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
