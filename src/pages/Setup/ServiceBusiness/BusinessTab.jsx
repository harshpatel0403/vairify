import react, { useState } from 'react'
import Button from '../../../components/Button'

const BusinessToggle = ({ business }) => {
    const [isChecked, setIsChecked] = useState(false);
  
    const handleToggle = () => {
      setIsChecked(!isChecked);
    }; 
  
    return (
      <div className='flex flex-row pb-4 gap-4 items-center'>
        <div>
          
            <label className="cursor-pointer">
                <input
                type="checkbox"
                className="hidden"
                checked={isChecked}
                onChange={handleToggle}
                />
                    <div className={`w-7 h-7 rounded-full shadow-md ${isChecked ? 'bg-[#08FA5A]' : 'bg-[#fff]'}`}></div>
            </label>
           
        </div>
        <div className='shadow-[0px 15px 20px 0px #00000040] border-2 !border-[#ccc] text-left py-2 px-5 w-full rounded-full justify-left items-center bg-gradient-to-b from-[#02227E] to-[#0247FF]'>
          <span className='font-semibold text-white text-[20px]'>{business.title}</span>
        </div>
      </div>
    );
  };


const BusinessTab = () => {  
    
    const businessOptions = [{
        id: 1,
        title: 'Ali'
    },
    {
        id: 2,
        title: 'Brian'
    },
    {
        id: 3,
        title: 'Jay'
    },
    {
        id: 4,
        title: 'James'
    }, 
    ]

    return (
        <div className='pb-5'>  
           <div className='px-6 pt-6'>
                {businessOptions?.map((business) => (
                      <BusinessToggle key={business.id} business={business} />
                ))}
            </div>


          
            <div className="flex items-center justify-center mx-4 mt-3 mb-5">
                <Button 
                    className={
                        "flex items-center py-3 !w-auto px-10 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[23.4px] rounded-xl shadow-[0px_9px_20px_rgba(0,0,0,0.5)]"
                    }
                    text={"Submit"}
                    size="40px"
                />
            </div>
        </div>
    )
}
export default BusinessTab;