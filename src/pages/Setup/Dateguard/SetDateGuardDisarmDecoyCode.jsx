import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import Header from '../../../components/Header/Header';

export default function SetDateGuardDisarmDecoyCode() {
    const navigate = useNavigate();
    const navigateToSuccessChangedCode = () => {
        navigate('/date-guard/success-code-changed');
    }
    return (
        <div className="container">
            <div className="sm:block hidden"><Header /></div>
            <div className="sm:hidden"><Header title="Setup Payment" /></div>
            <div className="sm:py-[48px] py-[24px]">
                <h3 className="sm:text-[28px] text-[24px] font-semibold text-center text-white sm:block hidden">Setup Payment</h3>
            </div>


            {/* <div className='main-container form-field-container'>
            <div className='w-full mx-auto flex flex-col justify-center items-center pt-2 '>
                <div className='w-full mx-auto flex items-center justify-center'><span className='font-bold text-[30px] text-[#05B7FD] change-font-family'>Date Guard</span></div>
                <div className='w-full mx-auto flex items-center justify-center mt-4'><div className='w-[67px] h-[82px]'><img src={'/images/DateGuardMask.png'} alt="Date Guard Mask" /></div></div>
                <div className='w-full mx-auto flex items-center justify-center mt-2'><span className='font-bold text-[30px] text-white change-font-family'>Edit Codes</span></div>
                <div className='w-full mx-auto flex items-center justify-center mt-6'><span className='font-medium text-[36px] text-white change-font-family'>Set Disarm Code</span></div>
                <div className='w-full mx-auto flex flex-row justify-center items-center mt-2'>
                    <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="first" maxLength='1' />
                    <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="second" maxLength='1' />
                    <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="third" maxLength='1' />
                </div>
                <div className='w-full mx-auto flex items-center justify-center mt-6'><span className='font-medium text-[36px] text-white change-font-family'>Set Decoy Code</span></div>
                <div className='w-full mx-auto flex flex-row justify-center items-center mt-2'>
                    <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="fourth" maxLength='1' />
                    <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="fifth" maxLength='1' />
                    <input className='flex-1 m-2 border-2 border-[#4200FF] h-[78px] max-w-[61px] text-center bg-[#D9D9D9] text-[35px] input-code-box' type="text" id="sixth" maxLength='1' />
                </div>
                <div className='w-full mx-auto flex flex-col justify-center items-center mt-6'>
                    <div className='w-[132px]'><Button onClick={() => navigateToSuccessChangedCode()} text="Set" className='bg-[#05B7FD] rounded-[10px] font-bold text-[30px] h-[41px] flex items-center justify-center change-font-family' size="41px" /></div>
                </div>
            </div>
        </div> */}
        </div>


    )
}



