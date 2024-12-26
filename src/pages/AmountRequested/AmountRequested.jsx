import React from 'react'

export default function AmountRequested() {
    return (
        <div className="main-container">
            <div className='h-[223px] bg-[#3760CBD4] rounded-2xl border-2 border-[#fff] p-[7px_7px_2px_10px]'>
                <div className='flex gap-3'>
                    <div className='flex flex-col justify-between items-center w-[30%]'>
                        <img src="images/gallery-peofile.png" alt="" className='w-[74px] sm:w-[84px] h-[74px] sm:h-[84px]' />
                        <p className='text-[12px] text-[#fff] font-bold pt-2'>TruRevu</p>
                        <p className='text-[12px] text-[#fff] font-bold'>Crystal 98UY778</p>
                        <div className="flex gap-1 items-start">
                            <div className="flex gap-1 mt-1">
                                {[0, 1, 2, 3, 4].map((rating, index) => (
                                    <img key={index}
                                        src="/images/Star.svg"
                                        className="w-[10px]  h-[10px]"
                                        alt=""
                                    />
                                ))}
                            </div>
                            <span className="text-white block text-center  font-roboto font-bold text-[15px]">
                                5.0
                            </span>
                        </div>
                        <p className='text-[14px] text-[#fff] font-bold rounded-2xl border-2 border-[#fff] bg-[#02227E] px-4 py-px'>View Profile</p>
                    </div>
                    <div className='w-[74%]'>
                        <div className='flex items-center justify-between gap-5'>
                            <div>
                                <p className='text-[14px] font-bold text-[#fff]'>Amount Requested</p>
                                <p className='text-[24px] font-bold text-[#01195C]'>$500.00</p>
                            </div>
                            <div>
                                <p className='text-[14px] font-bold text-[#fff]'>Request Type </p>
                                <p className='text-[18px] font-extrabold text-[#fff] uppercase'>VAI<span className='logoSetupweight'>RIDATE</span></p>
                            </div>
                        </div>
                        <div className='pb-px'>
                            <p className='text-[10px] font-bold text-center text-[#fff]'>Comments</p>
                            <div className='bg-[#D9D9D97D] border-2 border-[#02227E] h-[59px] rounded-2xl' />
                        </div>
                        <div className='my-1 flex justify-center'>
                            <p className='text-[#FFFFFF] text-[20px] font-bold px-7 py-2 rounded-2xl bg-gradient-to-b from-[#A30C30] to-[#DB3002] max-w-[150px] text-center'>
                                Deny
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
