import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import InputText from '../../../components/InputText';
import Selecter from '../../../components/Selecter/Selecter'; 
import { Link } from '@mui/material';
// import UserGalleryService from "../../../services/UserGalleryService";

export default function BusinessRateServices() {
    const navigate = useNavigate();
    const navigateToDateGuardCode = () => {
        navigate("/varidate/invitations-list");
    }  
    const [currencySelcted, setCurrencySelcted] = useState('')
    const [currency, setCurrency] = useState(['Currency', 'EUR', 'AUD', 'ARS', 'AFN'])
    const servicesOptions = [
        {
            id: 1,
            time: '1 hr',
            incall: '300',
            outcall: '350',
            currency: ['EUR'],
        },
        {
            id: 2,
            time: '1 hr',
            incall: '300',
            outcall: '350',
            currency: ['EUR'],
        },
        {
            id: 3,
            time: '1 hr',
            incall: '300',
            outcall: '350',
            currency: ['EUR'],
        },
        {
            id: 4,
            time: '1 hr',
            incall: '300',
            outcall: '350',
            currency: ['EUR'],
        },
        {
            id: 5,
            time: '1 hr',
            incall: '300',
            outcall: '350',
            currency: ['EUR'],
        },
        {
            id: 6,
            time: '1 hr',
            incall: '300',
            outcall: '350',
            currency: ['EUR'],
        },
        {
            id: 7,
            time: '1 hr',
            incall: '300',
            outcall: '350',
            currency: ['EUR'],
        },
        {
            id: 8,
            time: '1 hr',
            incall: '300',
            outcall: '350',
            currency: ['EUR'],
        },
        {
            id: 9,
            time: '1 hr',
            incall: '300',
            outcall: '350',
            currency: ['EUR'],
        },
        {
            id: 10,
            time: '1 hr',
            incall: '300',
            outcall: '350',
            currency: ['EUR'],
        },
    ]

    const [hourlyrateSelcted, sethourlyrateSelcted] = useState('')
    const [hourlyrate, sethourlyrate] = useState(['1 Hour', '2 Hour', '3 Hour', '4 Hour', '5 Hour'])
    const hourlyrateOptions = [
        {
            id: 1,
            time: '1 Hour',
        },
        {
            id: 2,
            time: '2 Hour',
        },
        {
            id: 3,
            time: '3 Hour',
        },
        {
            id: 4,
            time: '4 Hour',
        },
        {
            id: 5,
            time: '5 Hour',
        },
    ]

    return (
        <div className='main-container px-0 '>
            <div className='w-full mx-auto flex flex-col justify-center items-center'>

                <div className='w-full mx-auto flex flex-col justify-center items-center pt-3 pb-2 px-3'>
                    <span className='font-bold text-[30px]'> Business <br /> Rate & Services </span>
                </div>

                <div className='flex flex-row justify-center items-center mb-1'>
                    <Button 
                        className={
                            "px-5 flex items-center justify-center bg-gradient-to-b from-[#0247FF] to-[#0247FF] text-[#fff] font-bold text-[18px] py-0 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] mt-2"
                        }
                        size="35px"
                          text="View"  />
                </div>

                <div className='max-w-[350px] w-full mx-auto flex flex-row justify-center items-left mt-5'>
                    <div className='w-full flex items-center justify-left pr-[15px]'><span className='font-bold text-[15px]'>Set Currency</span></div>
                   
                    <div className="w-[180px] border-2 rounded-full flex justify-left items-center px-2 my-m-3">
                        <Selecter
                            options={currency}
                            value={currencySelcted}
                            onChange={(e) => setCurrencySelcted(e.target.value)}
                            className="text-[8px] !text-left font-bold text-[#026EFF] txt-custom-color-4 shadow-none focus-visible:border-0 focus-visible:border-white px-1 !py-0"
                            textSize="8px"
                            textColor="#026EFF" size={'35px'} style={{ padding: '0px' }}
                        />
                    </div>
                        
                </div>

                <div className='max-w-[350px] w-full mx-auto flex flex-col justify-around flex-wrap-nowrap mt-4'>
                    <div className='flex items-left justify-left mb-2'><span className='font-bold text-[16px]'>TItle of service</span></div>
                    <div className='flex items-center justify-center'>
                        <InputText
                            className="border-[#fff] rounded-md h-[26px] mb-2 bg-white"
                            placeholder="VAIRIFY ID"
                            size="35px" 
                            />
                    </div>
                </div>
                
                <div className='max-w-[350px] w-full mx-auto flex flex-col justify-around flex-wrap-nowrap mt-4'>
                    <div className='flex items-left justify-left mb-2'><span className='font-bold text-[16px]'>Description of service </span></div>
                    <textarea
                        className="w-full bg-[#fff] text-left font-[500]  p-[10px]"
                        rows={4}
                        placeholder="Enter description"
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>

                <div className='max-w-[350px] w-full flex flex-col justify-left items-left mt-5 grid grid-cols-4 divide-x'>
                    <div className="!text-[13px] w-[90px] font-bold border-2 rounded-full flex justify-left items-center px-2 my-m-3 !mr-2">
                        <Selecter
                            options={hourlyrate}
                            value={hourlyrateSelcted}
                            onChange={(e) => sethourlyrateSelcted(e.target.value)}
                            className="text-[8px] !text-left font-bold text-[#026EFF] txt-custom-color-4 shadow-none focus-visible:border-0 focus-visible:border-white px-1 !py-0"
                            textSize={'8px'}
                            textColor="#026EFF" size={'35px'}  
                        />
                    </div>
                    <div className="!text-[13px] w-[90px] font-bold border-2 rounded-full flex justify-left items-center px-2 my-m-3">
                      
                    </div> 
                </div>

                <div className='max-w-[350px] w-full mx-auto flex flex-col justify-around flex-wrap-nowrap mt-5'>
                    <div className='flex items-left justify-left mb-2'><span className='font-bold text-[14px]'>Time Hr/Price 1 .   TimeHr/Price 2  </span></div>
                    <Link className='flex items-left justify-left mb-2'>Set Discription of services </Link>
                </div>


                <div className="w-full flex flex-row justify-between items-center px-6 gap-[15px] pb-4">
                    <Button 
                    className={
                        "shadow-none px-5 flex items-left bg-none justify-center text-[#02227E] bg-[#b9bacc] font-bold text-[23px] py-2 mt-7"
                    }
                    size="42px" 
                    text="Skip>>"  />

                    <Button 
                    className={
                        "px-5 flex items-right justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#02227E] font-bold text-[23px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] mt-7"
                    }
                    size="42px" 
                    text="Finished"  />
                </div> 
            </div>
        </div>
    );
}