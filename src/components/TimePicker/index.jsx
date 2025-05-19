import React from 'react';

export default function TimePicker({ time, setTime }) {

    return (
        <div className="w-full mx-auto flex items-center justify-center bg-transparent rounded-lg mt-2 p-5 ">
            <div className="flex flex-row justify-between items-center">
                <div className='flex items-center justify-center'>
                    <select value={time.hours} onChange={(e) => setTime({ ...time, hours: e.target.value })} name="hours" className="bg-[#919EAB33] py-[8px] sm:px-[32px] px-[20px] rounded-[8px] sm:w-[104px] w-[80px] appearance-none outline-none border-none text-white">
                        <option className='text-black text-[14px]' value="01">01 Hr</option>
                        <option className='text-black text-[14px]' value="02">02 Hr</option>
                        <option className='text-black text-[14px]' value="03">03 Hr</option>
                        <option className='text-black text-[14px]' value="04">04 Hr</option>
                        <option className='text-black text-[14px]' value="05">05 Hr</option>
                        <option className='text-black text-[14px]' value="06">06 Hr</option>
                        <option className='text-black text-[14px]' value="07">07 Hr</option>
                        <option className='text-black text-[14px]' value="08">08 Hr</option>
                        <option className='text-black text-[14px]' value="09">09 Hr</option>
                        <option className='text-black text-[14px]' value="10">10 Hr</option>
                        <option className='text-black text-[14px]' value="11">11 Hr</option>
                        <option className='text-black text-[14px]' value="12">12 Hr</option>
                    </select>
                </div>
                <div className='flex items-center justify-center w-[30px]'><span className="text-xl text-white">:</span></div>
                <div className='flex items-center justify-center'>
                    <select value={time.minutes} onChange={(e) => setTime({ ...time, minutes: e.target.value })}  name="minutes" className="bg-[#919EAB33] py-[8px] sm:px-[24px] px-[20px] rounded-[8px] sm:w-[104px] w-[80px] appearance-none outline-none border-none text-white">
                        <option className='text-black text-[14px]' value="00">00 Min</option>
                        <option className='text-black text-[14px]' value="05">05 Min</option>
                        <option className='text-black text-[14px]' value="10">10 Min</option>
                        <option className='text-black text-[14px]' value="15">15 Min</option>
                        <option className='text-black text-[14px]' value="20">20 Min</option>
                        <option className='text-black text-[14px]' value="25">25 Min</option>
                        <option className='text-black text-[14px]' value="30">30 Min</option>
                        <option className='text-black text-[14px]' value="35">35 Min</option>
                        <option className='text-black text-[14px]' value="40">40 Min</option>
                        <option className='text-black text-[14px]' value="45">45 Min</option>
                        <option className='text-black text-[14px]' value="50">50 Min</option>
                        <option className='text-black text-[14px]' value="55">55 Min</option>
                    </select>
                </div>
                <div className='flex items-center justify-center w-[30px]'><span className="text-xl text-white">:</span></div>
                <div className='flex items-center justify-center'>
                    <select value={time.meridiem} onChange={(e) => setTime({ ...time, meridiem: e.target.value })} name="ampm" className="bg-[#919EAB33] py-[8px] sm:px-[38px] px-[28px] rounded-[8px] sm:w-[104px] w-[80px] appearance-none outline-none border-none text-white">
                        <option className='text-black text-[14px]' value="AM">AM</option>
                        <option className='text-black text-[14px]' value="PM">PM</option>
                    </select>
                </div>
            </div>
        </div>
    );
}