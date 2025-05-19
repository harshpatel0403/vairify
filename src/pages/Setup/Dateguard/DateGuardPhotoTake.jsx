import React, { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import DateGuardService from '../../../services/DateGuardService';
import Webcam from 'react-webcam';
import DetectRTC from 'detectrtc';
import Loading from '../../../components/Loading/Index';
import PageTitle from '../../../components/PageTitle';

export default function DateGuardPhotoTake() {

    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState('')
    const [imgSrc, setImgSrc] = React.useState(null);
    const [hasCamara, setHasCamara] = React.useState(true);
    const [faceCompareLoading, setFaceCompareLoading] = React.useState(false);
    const webcamRef = React.useRef(null);
    const videoConstraints = {
        width: 400,
        height: 400,
        facingMode: "user",
    };

    const params = useParams()
    const navigate = useNavigate()

    const handleClickPhoto = () => {
        const input = document.getElementById("photo-upload");
        input.click();
    }
    const handleChange = (event) => {
        if (!!event.target.files[0]) {
            setFile(event.target.files[0])
            const previewImage = document.getElementById("imagePreview");
            previewImage.src = URL.createObjectURL(event.target.files[0]);
            previewImage.onload = function () {
                URL.revokeObjectURL(previewImage.src);
            }
        }
    }

    const handleSubmit = async () => {
        try {
            if (!file) {
                toast.error('Please upload a file')
                return
            }
            setLoading(true)
            const formData = new FormData
            formData.append('message', message)
            formData.append('groupId', params?.groupId)
            formData.append('appointmentId', params?.appointmentId)
            formData.append('file', file)

            await DateGuardService.uploadProof(formData)
            navigate(`/dateguard/count-up/${params?.appointmentId}/${params?.groupId}`)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.error || error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        DetectRTC.load(() => {
            if (!DetectRTC.hasWebcam) {
                setHasCamara(false)
            } else {
                setHasCamara(true)
            }
        });
    }, []);

    const capture = React.useCallback(async () => {
        try {
            setFaceCompareLoading(true);
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);

            const userFile = await DateGuardService.dataURLtoFile(
                imageSrc,
                "userFace.jpg"
            );
            setFile(userFile)
        } catch (error) {
            console.log(error, " <=== Error while verifing user face");
        } finally {
            setFaceCompareLoading(false);
        }
    }, [webcamRef, setImgSrc]);

    const handleRetry = () => {
        setFile(null);
        setImgSrc(null);
    }

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
        )
    }


    return (
        <div className='container '>
            <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                <PageTitle title={"Date Guard"} />
            </div>
            <div className='w-full mx-auto flex flex-col justify-center items-center '>

                {/* <div className="w-full flex flex-col justify-center items-center mt-5">
                    <div className="w-[178px] h-[160px] flex flex-col justify-start items-center border-[#0247FF] border-2 rounded-lg">
                        <img id="imagePreview" style={{ overflow: 'hidden', width: '100%' }} className="rounded-t-lg" src={"/images/DateGuardPhotoIcon.png"} alt="Date Guard Camera" />
                    </div>
                </div> */}

                <div className="w-full mx-auto flex items-center justify-center mt-2 max-w-[400px]">
                    <div className="flex-1 flex items-center justify-center">
                        {imgSrc ? (
                            <img src={imgSrc} alt="Date Guard Success Changed Code" className="rounded-[16px]" />
                        ) : (
                            <div className='relative'>
                                <Webcam
                                    audio={false}
                                    height={400}
                                    ref={webcamRef}
                                    width={400}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                    className="rounded-[16px] w-full max-w-[400]"
                                    style={{ transform: "scaleX(-1)" }}
                                />
                                <img src="/images/face-verification/camera-vector.svg" className="left-[5%] top-[5%] absolute z-[100]" />
                                <img src="/images/face-verification/camera-vector.svg" className="right-[5%] top-[5%] absolute z-[100] rotate-[90deg]" />
                                <img src="/images/face-verification/camera-vector.svg" className="left-[5%] bottom-[5%] absolute z-[100] rotate-[-90deg]" />
                                <img src="/images/face-verification/camera-vector.svg" className="right-[5%] bottom-[5%] absolute z-[100]  rotate-[-180deg]" />
                            </div>
                        )}
                    </div>
                </div>

                {(!faceCompareLoading) && (!file) && (
                    <button
                        disabled={faceCompareLoading}
                        onClick={capture}
                        className="mx-auto flex items-center justify-center mt-[-34px] relative z-[100] h-[64px] w-[64px] p-2 rounded-full bg-white"
                    >
                        <img src="/images/face-verification/camera.svg" alt="camera img" />
                    </button>
                )}

                {file && (
                    <div className="flex flex-col items-center mt-4">
                        {/* <div className="bg-[#ff0000] rounded-full mb-3">
                            <img src="/images/close-btn.svg" className="w-[70px]" />
                        </div> */}
                        <Button
                            onClick={handleRetry}
                            text={'Retry'}
                            className='max-w-[500px] px-4 w-full'
                        />
                    </div>
                )}

                {/* <div className="relative custom-select-border w-[108px] h-[31px] mt-5">
                    <button className="w-full h-full bg-[#4200FF] rounded-md text-[#D9D9D9] text-[20px] font-bold change-font-family" onClick={handleClickPhoto}>
                        Photos
                    </button>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        name="Choose Image"
                        className="image-file-input w-full"
                        id="photo-upload"
                        capture="environment"
                        onChange={handleChange}
                    />
                </div> */}
                <div className='w-full mx-auto flex flex-col justify-center items-start mt-10 mb-10'>
                    <label className='text-white font-normal text-base mb-1'>Message</label>
                    <div className='w-full mx-auto flex flex-row justify-center items-center'>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows="3"
                            className="border-[2px] border-[#919EAB33] rounded-lg p-[14px] w-full bg-transparent !text-white text-[14px] font-normal !placeholder-white"
                            placeholder="">
                            {message}
                        </textarea>
                    </div>
                </div>
                <Button
                    disabled={loading || (!imgSrc)}
                    onClick={handleSubmit} text={loading ? <div className="flex items-center	justify-center">
                        <Loading />
                    </div> : 'Save'}
                    className={'max-w-[500px] px-4 mx-auto mb-[48px]'}
                />
            </div>
        </div>
    )
}