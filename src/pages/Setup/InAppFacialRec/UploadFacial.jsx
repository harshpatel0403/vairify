import Button from "../../../components/Button"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"

const UploadFacial = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className="main-container">
            <div className="w-full mx-auto flex flex-col justify-center items-center pt-7">
                <div className='w-full mx-auto flex flex-row justify-center items-center'>
                    {/* <div><img src={process.env.PUBLIC_URL + '/images/FacialRecognition(small).png'} alt="Facial Recognition Small Logo" /></div> */}
                    <div><span className='font-extrabold text-[23.4px]'>{t("uploadfacial.title")}</span></div>
                </div>

                <div className='w-full mx-auto flex justify-center items-center mt-5 px-10'>
                    <div><img src={'/images/faceRecognition.png'} alt="Face Recognition with Camera" /></div>
                </div>

                <div className='w-full mx-auto flex justify-center items-center mt-2'>
                    <div className='relative left-4'><img src={'/images/check-mark 2.png'} alt="Check Mark" /></div>
                </div>

                <div className='w-auto mx-auto flex flex-col justify-center items-center relative mt-4'>
                    <Button text={`${t("uploadfacial.submit")} >>`} className={'font-bold text-[23.4px] px-3'} onClick={() => navigate("/setup")} />
                </div>
            </div>
        </div>
    )
}

export default UploadFacial