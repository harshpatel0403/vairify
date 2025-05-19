import react, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import BusinessTab from './BusinessTab';
import IndividualTab from './IndividualTab';

const StaffSettings = () => {
    return (
        <div className='container'>
            <div className="text-[26px] font-bold text-center text-white mt-10 mb-10">
                Staff Settings
            </div>
            <IndividualTab />
        </div>
    )
}
export default StaffSettings;