import React from 'react';
import Header from '../../../components/Header/Header';

export default function JoinMemberToGroupSuccess() {
    return (

        <div className="container">
            <div className="sm:block hidden"><Header /></div>
            <div className="sm:hidden"><Header title="Date Guard" /></div>
            <div className="sm:py-[48px] py-[24px]">
                <h3 className="sm:text-[28px] text-[24px] font-semibold text-center text-white sm:block hidden">Date Guard</h3>

                <div className="flex items-center justify-center sm:mt-[48px] mt-[24px]">
                    <img src="/images/setup/Disarm.svg" alt="guard" />
                </div>
                <h3 className="sm:text-[28px] text-[24px] font-medium text-center text-white sm:my-[24px] my-[16px]">Joined Group <br />
                    Successfully</h3>
                <h3 className="sm:text-[24px] text-[20px] font-medium text-center text-[#008F34] flex items-center justify-center gap-1 mx-auto">Add Successfully <img src="/images/setup/confirm-check.svg" alt="icon" /></h3>
            </div>
        </div>



    );
}
{/* 
<div className='main-container form-field-container'>
            <div className='w-full mx-auto flex flex-col justify-center items-cener pt-2' style={{
                height:'100%'
            }}>
                <div className='w-full mx-auto flex items-center justify-center'><span className='font-bold text-[30px] text-[#05B7FD] change-font-family'>Date Guard</span></div>
                <div className='w-full mx-auto flex items-center justify-center mt-4'><div className='w-[67px] h-[82px]'><img src={'/images/DateGuardMask.png'} alt="Date Guard Mask" /></div></div>
                <div className='w-full mx-auto flex items-center justify-center mt-9'><span className='font-bold text-[30px] text-[#05B7FD] change-font-family'>Joined Group Succesfully</span></div>
                <div className='w-full mx-auto flex items-center justify-center mt-12 mb-20'><div className='flex-1 flex items-center justify-center'><img src={'/images/DateGuardSuccessCodeMark.png'} alt="Verification Success Mark Icon" /></div></div>
            </div>
        </div> */}