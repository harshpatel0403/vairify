import React from 'react';
import Button from '../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import Carousel from '../../components/Carousel';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function MyVairipayRequestSecond() {
    const { t } = useTranslation();
    const vairipayOptions = ['/images/VairipayPaypal.png', '/images/VairipayApplePay.png', '/images/VairipayVenmo.png', '/images/VairipayPaypal.png', '/images/VairipayApplePay.png', '/images/VairipayVenmo.png']
    const navigate = useNavigate()


    const handleSubmit = () => {
        navigate('/vairipay-add')
    }
    return (
        <div className="main-container">
            <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
                <div className='w-full mx-auto flex flex-row justify-center items-start'>
                    <div className='flex flex-col items-center justify-center'>
                        <div><span className='text-[18px] text-[#040C50] font-extrabold'>{t("vairipayrequestsecond.vai")}<span className='text-[18px] text-[#040C50] font-medium'>{t("vairipayrequestsecond.RIFYID")}</span></span></div>
                        <div><span className='text-[15px] text-[#040C50] font-bold'>658H39</span></div>
                    </div>
                    <div className='w-[120px] relative'>
                        <div style={{ left: '0px', bottom: '80px' }} className='absolute w-full h-full rounded-full'><img src={import.meta.env.BASE_URL + 'images/Ellipse 121.png'} alt="Sugar" className='rounded-full'/></div>
                        <div style={{ right: '4px', top: '6px' }} className='absolute'><img src={import.meta.env.BASE_URL + 'images/SugarIcon2.png'} alt="Sugar Icon Second" /></div>
                    </div>
                    <div>
                        <div><span className='text-[18px] text-[#040C50] font-bold'>TRU<span className='text-[18px] text-[#040C50] font-light'>{t("vairipayrequestsecond.revu")}</span></span></div>
                        <div className='flex flex-row justify-center items-center'><FontAwesomeIcon icon={faStar} color="#E1AB3F" className='text-[10px] margin-right-5' /><FontAwesomeIcon icon={faStar} color="#E1AB3F" className='text-[10px] margin-right-5' /><FontAwesomeIcon icon={faStar} color="#E1AB3F" className='text-[10px] margin-right-5' /><FontAwesomeIcon icon={faStar} color="#E1AB3F" className='text-[10px] margin-right-5' /><FontAwesomeIcon icon={faStar} color="#E1AB3F" className='text-[10px] margin-right-5' /><span className='text-[15px] text-[#040C50] font-bold'>5.0</span></div>
                    </div>
                </div>
                <div><span className='font-bold text-[24px]'>Sugar</span></div>
                <div className='inner-content-part mt-3 pb-8 '>
                    <div className='w-full mx-auto flex flex-col justify-center items-center relative bottom-3'>
                        
                        <div className='my-3'><img src={import.meta.env.BASE_URL + 'images/MaskGroup.png'} alt="Mask Group" /></div>
                        <button>
                            <div className='w-[150px] h-[47px] rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#0C8A02] flex flex-col justify-center items-center'>
                                <div className='font-bold text-[10px]'>{t("vairipayrequestsecond.requestedLabel", { name: "Sugar" })}</div>
                                <div className='font-bold text-[20px]'>{t("vairipayrequestsecond.amount")}</div>
                            </div>
                        </button>
                    </div>
                    <div style={{ width: '100vw' }} className='flex flex-col justsify-center items-center mt-2 bg-[#040C50] px-4 shadow-2xl'>
                        <Carousel images={vairipayOptions} vairipay={'true'} />
                    </div>
                    <div className='w-full mx-auto flex flex-col justify-center items-center mt-8 bg-[#3760CB] h-[98px] rounded-3xl px-10 leading-5 shadow-2xl mx-4'>
                        <span className='text-center'>
                            <span className='font-bold text-[16px] text-white'><span className='font-bold text-[16px] text-white'>{t("vairipayrequestsecond.sharedApps", { name: "Sugar" })} </span></span>
                            <span className='font-extrabold text-[16px] text-white'>{t("vairipayrequestsecond.vai")}</span>
                            <span className='font-light text-[16px] text-white'>{t("vairipayrequestsecond.ripay")} </span>
                            <span className='font-bold text-[16px] text-white'>{t("vairipayrequestsecond.clickIcon")}</span>
                        </span>
                    </div>
                    <div className='w-full mx-auto flex flex-row justify-between items-start mt-10'>
                        <div className='flex flex-col justify-center items-center w-[48%]'>
                            <div className='relative top-0'><img src={import.meta.env.BASE_URL + 'images/VAIRIPAYⓒ.png'} alt="Vairipay ext" /></div>
                            <div ><img src={import.meta.env.BASE_URL + 'images/Vairipay1.png'} alt="Vairipay First" className='w-[100px]'/></div>
                            <div className='relative '><span className='text-[18px] font-bold'>{t("vairipayrequestsecond.p2pApps")}</span></div>
                        </div>
                        <div className='flex flex-col justify-center items-center  w-[48%]'>
                            <div className='relative top-0'><img src={import.meta.env.BASE_URL + 'images/VAIRIPAYⓒ.png'} alt="Vairipay ext" /></div>
                            <div><img src={import.meta.env.BASE_URL + 'images/Vairipay2.png'} alt="Vairipay Second" className='w-[100px]'/></div>
                            <div className='relative '><span className='text-[18px] font-bold'>{t("vairipayrequestsecond.tokens")}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}