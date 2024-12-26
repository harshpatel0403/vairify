import React from 'react';

export default function TimePicker({ time, setTime }) {

    return (
        <div className="w-full mx-auto flex items-center justify-center bg-transparent rounded-lg mt-2 p-5 ">
            <div className="flex flex-row justify-between items-center">
                <div className='flex items-center justify-center'>
                    <select value={time.hours} onChange={(e) => setTime({ ...time, hours: e.target.value })} name="hours" className="bg-transparent text-xl appearance-none outline-none text-white border-2 border-white px-2 rounded-[5px]">
                        <option className='text-black text-[14px]' value="01">01</option>
                        <option className='text-black text-[14px]' value="02">02</option>
                        <option className='text-black text-[14px]' value="03">03</option>
                        <option className='text-black text-[14px]' value="04">04</option>
                        <option className='text-black text-[14px]' value="05">05</option>
                        <option className='text-black text-[14px]' value="06">06</option>
                        <option className='text-black text-[14px]' value="07">07</option>
                        <option className='text-black text-[14px]' value="08">08</option>
                        <option className='text-black text-[14px]' value="09">09</option>
                        <option className='text-black text-[14px]' value="10">10</option>
                        <option className='text-black text-[14px]' value="11">11</option>
                        <option className='text-black text-[14px]' value="12">12</option>
                    </select>
                </div>
                <div className='flex items-center justify-center w-[30px]'><span className="text-xl text-white">:</span></div>
                <div className='flex items-center justify-center'>
                    <select value={time.minutes} onChange={(e) => setTime({ ...time, minutes: e.target.value })}  name="minutes" className="max-h-[45px] bg-transparent text-xl appearance-none outline-none text-white border-2 border-white px-2 rounded-[5px]">
                        <option className='text-black text-[14px]' value="00">00</option>
                        <option className='text-black text-[14px]' value="05">05</option>
                        <option className='text-black text-[14px]' value="10">10</option>
                        <option className='text-black text-[14px]' value="15">15</option>
                        <option className='text-black text-[14px]' value="20">20</option>
                        <option className='text-black text-[14px]' value="25">25</option>
                        <option className='text-black text-[14px]' value="30">30</option>
                        <option className='text-black text-[14px]' value="35">35</option>
                        <option className='text-black text-[14px]' value="40">40</option>
                        <option className='text-black text-[14px]' value="45">45</option>
                        <option className='text-black text-[14px]' value="50">50</option>
                        <option className='text-black text-[14px]' value="55">55</option>
                    </select>
                </div>
                <div className='flex items-center justify-center w-[30px]'><span className="text-xl text-white">:</span></div>
                <div className='flex items-center justify-center'>
                    <select value={time.meridiem} onChange={(e) => setTime({ ...time, meridiem: e.target.value })} name="ampm" className="bg-transparent text-xl appearance-none outline-none text-white border-2 border-white px-2 rounded-[5px]">
                        <option className='text-black text-[14px]' value="AM">AM</option>
                        <option className='text-black text-[14px]' value="PM">PM</option>
                    </select>
                </div>
            </div>
        </div>
    );
}