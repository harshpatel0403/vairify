import React from 'react';
import DigitalTimer from '../../../components/DigitalTimer';

export default function DateGuardCountUp() {
    return (
        <div className='min-h-[calc(100vh-150px)]'>
            <div className='w-full h-full mx-auto flex flex-col justify-center items-center pt-2'>
                <div className='w-full mx-auto flex flex-row justify-center items-center'>
                    <div className='mr-4'><span className='font-bold text-[30px] text-[#4200FF] change-font-family'>Date Guard</span></div>
                    <div className='w-[28px] h-[33px]'><img src={'/images/Mask2.png'} alt="Mark Second Logo" /></div>
                </div>
                <div className='w-full mx-auto flex items-center justify-center mt-4'>
                    <DigitalTimer />
                </div>
            </div>
        </div>
    );
}