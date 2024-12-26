import React, { useEffect, useState } from 'react';
import TimePicker from '../../../components/TimePicker';
import Button from '../../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import DateGuardService from '../../../services/DateGuardService';
import { toast } from 'react-toastify';

export default function DateGuardSetTimeAlarm() {
    const [loading, setLoading] = useState(false)
    const [range, setRange] = useState(() => 50);
    const [time, setTime] = useState({
        hours: '01',
        minutes: '00',
        meridiem: 'AM'
    })

    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        const group = params?.groupId
        const appointment = params?.appointmentId
        if(!appointment) {
            navigate('/dateguard/select-appointment')
            return
        }
        if(!group) {
            navigate(`/dateguard/select-group/${appointment}`)
            return
        }
        setLoading(true)
        DateGuardService.getAlarm(group, appointment)
        .then(data => {
            setTime({
                minutes: data?.minutes || '00',
                hours: data?.hours || '01',
                meridiem: data?.meridiem || 'AM'
            })
            setRange(data?.alarmDelay)
        })
        .catch(error => {
            console.log(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [params])

    const handleRangeChange = (e) => {
        if(e.target.value < 10) {
            setRange(() => "0" + e.target.value);
        } else {
            setRange(() => "" + e.target.value);
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const group = params?.groupId
            const appointment = params?.appointmentId
    
            await DateGuardService.setAlarm({
                groupId: group,
                appointmentId: appointment,
                ...time,
                alarmDelay: range
            })
            navigate(`/dateguard/count-up/${appointment}/${group}`);
          } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.error || error.message);
          } finally {
            setLoading(false);
          }
    }

    if (loading) {
        return (
          <div className="main-container h-full">
            <div className="text-white h-full flex justify-center items-center">
              <p>Loading...</p>
            </div>
          </div>
        );
      }

    return (
        <div className='main-container'>
            <div className='w-full mx-auto flex flex-col justify-center items-center pt-2'>
                <div className='w-full mx-auto flex items-center justify-center'><span className='font-bold text-[30px] text-[#05B7FD] change-font-family'>Date Guard</span></div>
                <div className='w-full mx-auto flex items-center justify-center mt-4'><div className='w-[67px] h-[82px]'><img src={'/images/DateGuardMask.png'} alt="Date Guard Mask" /></div></div>
                <div className='w-full mx-auto flex items-center justify-center'><span className='font-bold text-[30px] text-[#D9D9D9] change-font-family'>SET YOUR TIME</span></div>
                <div className='w-full mx-auto flex items-center justify-center mt-4'><TimePicker time={time} setTime={setTime} /></div>
                <div className='w-full mx-auto flex items-center justify-center mt-4'><span className='font-bold text-[30px] text-[#D9D9D9] change-font-family'>ALARM DELAY</span></div>
                <div className='w-full mx-auto flex items-center justify-center mt-2'><div className='w-[100px] h-[48px] flex items-center justify-center rounded-[25px] border-2 border-white'><span className='font-bold text-white text-[32px]'>{range}<span className='font-normal text-white text-[20px]'>min</span></span></div></div>
                <div className='w-full mx-auto flex flex-row items-center justify-center mt-9 overflow-auto'>
                    <div><span className='font-bold text-[14px] text-white'>1min</span></div>
                    <div className='w-full mx-auto flex items-center justify-center'>
                        {/* <input onChange={(e) => handleRangeChange(e)} type="range" min={1} max={59} value={range} className="w-full mx-5 h-3 bg-gray-200 rounded-lg cursor-pointer range-lg dark:bg-gray-700"></input> */}
                        {/* <Range
                            value={range}
                            step={10}
                            onChange={(e) => handleRangeChange(e)}
                        /> */}
                        <input onChange={(e) => handleRangeChange(e)} type="range" min="1" max="59" value={range} className='w-full mx-5' /> 
                    </div>
                    <div><span className='font-bold text-[14px] text-white'>59min</span></div>
                </div>
                <div className='w-full mx-auto flex items-center justify-center mt-9'>
                    <div className='w-[132px]'><Button onClick={handleSubmit} text="Select" className={'bg-[#05B7FD] rounded-[10px] text-[20px] font-bold change-font-family'} size="34px" /></div>
                </div>
            </div>
        </div>
    );
}