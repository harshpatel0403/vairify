import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';

export default function MyVairipayRequestConfirm() {
    const navigate = useNavigate()

    const handleSubmit = () => {
        navigate('/vairipay-options')
    }
    
    return (
        <div className="main-container">
            <div className="w-full mx-auto flex flex-col justify-center  pt-2">
                <div className='w-full mx-auto flex flex-row justify-center items-start'>
                    <div className='flex flex-col items-center justify-center'>
                        <div><span className='text-[18px] text-[#040C50] font-extrabold'>VAI<span className='text-[18px] text-[#040C50] font-medium'>RIFY ID</span></span></div>
                        <div><span className='text-[15px] text-[#040C50] font-bold'>658H39</span></div>
                    </div>
                    <div className='w-[120px] relative'>
                        <div style={{left: '0px', bottom: '80px'}} className='absolute w-full h-full rounded-full'><img src={import.meta.env.BASE_URL + 'images/Ellipse 121.png'} alt="Sugar" className='rounded-full'/></div>
                        <div style={{right: '4px', top: '6px'}} className='absolute'><img src={import.meta.env.BASE_URL + 'images/SugarIcon2.png'} alt="Sugar Icon Second" /></div>
                    </div>
                    <div>
                        <div><span className='text-[18px] text-[#040C50] font-bold'>TRU<span className='text-[18px] text-[#040C50] font-light'>REVU</span></span></div>
                        <div className='flex flex-row justify-center items-center'><FontAwesomeIcon icon={faStar} color="#E1AB3F" className='text-[10px] margin-right-5' /><FontAwesomeIcon icon={faStar} color="#E1AB3F" className='text-[10px] margin-right-5' /><FontAwesomeIcon icon={faStar} color="#E1AB3F" className='text-[10px] margin-right-5' /><FontAwesomeIcon icon={faStar} color="#E1AB3F" className='text-[10px] margin-right-5' /><FontAwesomeIcon icon={faStar} color="#E1AB3F" className='text-[10px] margin-right-5' /><span className='text-[15px] text-[#040C50] font-bold'>5.0</span></div>
                    </div>
                </div>
                <div><span className='font-bold text-[24px]'>Sugar</span></div>
                <div className='inner-content-part mt-3 pb-8'>
                <div className='w-full mx-auto flex flex-col  items-center relative bottom-3'>
                   
                    <div className='mt-4'><img src={import.meta.env.BASE_URL + 'images/MaskGroup.png'} alt="Mask Group" /></div>
                    <button>
                        <div className='w-[150px] h-[47px] rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#0C8A02] flex flex-col justify-center items-center'>
                            <div className='font-bold text-[10px]'>Sugar has requested</div>
                            <div className='font-bold text-[20px]'>$25.00</div>
                        </div>
                    </button>
                </div>
                <button className='w-full mx-auto' onClick={() => handleSubmit()}>
                    <div className='w-full mx-auto flex items-center justify-center mt-2'>
                        <img src={import.meta.env.BASE_URL + 'images/MyVairipayRequestConfirmLogo.png'} alt="Vairipay Request Confirm Logo" />
                    </div>
                </button>                
                <div className='w-full mx-auto flex flex-col justify-center items-center mt-2 bg-[#3760CB] rounded-3xl px-12 py-2 shadow-2xl'>
                    <span className='text-center leading-6'>
                        <span className='font-bold text-[16px] text-white'>Our system has not detected shared apps with Sugar, click the wallet above to see the active apps in Sugars </span>
                        <span className='font-black text-[18px] text-white'>VAI</span>
                        <span className='font-light text-[18px] text-white'>RIPAYⓒ</span>
                    </span>
                </div>
                <div className='w-full mx-auto flex flex-row justify-between items-start mt-5'>
                    <button onClick={() => navigate('/vairipay-search')} className='w-[48%]'>
                        <div className='flex flex-col justify-center items-center'>
                            <div><img src={import.meta.env.BASE_URL + 'images/VAIRIPAYⓒ.png'} alt="Vairipay text"/></div>
                            <div><img src={import.meta.env.BASE_URL + 'images/Vairipay1.png'} alt="Vairipay First" className='w-[100px]'/></div>
                            <div><span className='text-[18px] font-bold'>P2P APPS</span></div>
                        </div>
                    </button>
                    <button onClick={() => navigate('/godlen-rose-tokens')} className='w-[48%]'>
                        <div className='flex flex-col justify-center items-center'>
                            <div><img src={import.meta.env.BASE_URL + 'images/VAIRIPAYⓒ.png'} alt="Vairipay text"/></div>
                            <div><img src={import.meta.env.BASE_URL + 'images/Vairipay2.png'} alt="Vairipay Second" className='w-[100px]'/></div>
                            <div><span className='text-[18px] font-bold'>Golden Rose Tokens</span></div>
                        </div>
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}