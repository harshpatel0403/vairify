import react, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import BusinessTab from './BusinessTab';
import IndividualTab from './IndividualTab';

const StaffSettings = () => {
    return (
        <div> 
            <div className='w-full mx-auto flex flex-col justify-center items-center pt-3 px-3'>
                <span className='font-bold text-[24px]'>Staff Settings</span>
            </div>
            <IndividualTab />
        </div>
    )
}
export default StaffSettings;