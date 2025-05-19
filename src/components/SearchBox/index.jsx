import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchBox({onSearch,name, placeholder, classname, bgColor, rounded, language}) {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
        onSearch(value);
    };
    return (
        <div className="relative mx-auto text-gray-600">
            {
                language === 'true' &&
                <div className='relative w-full mx-auto flex flex-row justify-center items-center'>
                    <button type="submit" className="absolute left-[16px] top-[16px]">
                        <FontAwesomeIcon icon={faSearch} className="text-white"/>
                    </button>
                    <input 
                        className={`placeholder-white w-[100%] p-[16px] bg-transparent rounded-lg border max-h-[54px] border-[#919EAB33] text-[16px] font-noemal !text-white ${classname} ${bgColor?`bg-${bgColor}`:''} ${rounded?`rounded-${rounded}`:'rounded-lg'}`}
                        type="search"
                        name={name}
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder={placeholder}
                    />
                </div>
            }
            {
                language !== 'true' &&
                <div className='w-full mx-auto flex flex-row justify-center items-center'>
                    <input 
                        className={`placeholder-white w-[100%] p-[16px] bg-transparent rounded-lg border max-h-[54px] border-[#919EAB33] text-[16px] font-noemal !text-white ${classname?classname:''} ${bgColor?`bg-${bgColor}`:''} ${rounded?`rounded-${rounded}`:'rounded-lg'}`}
                        type="search"
                        name={name}
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder={placeholder}
                    />
                    <button type="submit" className="absolute right-[20px] top-[16px]">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            }
        </div>
    );
}