import React, { useState } from 'react';

export default function ImageUpload({ name, buttonName, type, onClick }) {
    const [fileName, setFileName] = useState('');

    const handleClick = () => {
        const input = document.getElementById("image-upload");

        input.click();
    }
    const handleChange = (event) => {
        event.target.files[0] ? setFileName(event.target.files[0]?.name) : setFileName('');
        // const input = document.getElementById("business-profile-image-content");
        // input.innerText = event.target.files[0] ? event.target.files[0].name : '';
    }
    return (
        <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#ffffff65] rounded-lg py-[35px] bg-[#FFFFFF14]">
            <div className="flex items-center justify-center flex-col">
                <button className="text-[14px] font-noraml text-white flex flex-col items-center justify-center gap-2" onClick={handleClick}>
                    <img src='/images/setup/upload.svg' alt='upload logo' />
                    {buttonName}
                    <p className='text-[#B5C8FF] text-center underline'>Browse</p>
                </button>
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    name={name}
                    className=" image-file-input"
                    id="image-upload"
                    onChange={(e) => {
                        handleChange(e)
                        onClick(e)
                    }}
                />
            </div>
            <div>
                {fileName &&
                    <p
                        className="text-[14px] text-white rounded-[4px] border border-[#919EAB33] bg-transparent p-[8px]"
                        id="business-profile-image-content"
                    >{fileName}</p>
                }
            </div>
        </div>
    );
}