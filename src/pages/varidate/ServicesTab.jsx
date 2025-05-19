import { useEffect, useState } from "react";

const ServicesTab = ({
  services,
  setService,
  removeService,
  selectedExtraServices,
  setSelectedExtraServices,
  removeSelectedExtraService,
}) => {
  const [handelChangeTab, setHandelChangeTab] = useState(false);
  const [servicesOptions, setServicesOptions] = useState([]);
  const [extraServicesOptions, setExtraServicesOptions] = useState([]);

  useEffect(() => {
    if (services?.length) {
      setServicesOptions(
        services?.filter((item) => item?.service === "Included")
      );
      setExtraServicesOptions(
        services?.filter((item) => item?.service === "Extra")
      );
    }
  }, [services]);

  return (
    <div>
      <div className="" />
      <div className="text-lg text-center font-medium text-white my-[24px]">Services</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-[24px] gap-[16px]">
        {servicesOptions?.map((item) => {
          const isSelected = services
            ?.map((service) => service?._id)
            ?.includes(item?._id);

          const handleClick = () => {
            isSelected
              ? removeService(item)
              : setService(item);
          };
          // if (item?._id === selectedService?._id) {
          //     return <div key={item?._id} className='flex flex-row p-2 w-full rounded-full justify-center items-center bg-gradient-to-b from-[#02227E] to-[#0247FF]'>
          //         <span className='font-bold text-white '>{item?.servicesName}</span>
          //     </div>
          // } else {
          return (
            <div
              key={item?._id}
              onClick={handleClick}
              className={`flex p-[12px] w-full rounded-[8px] justify-center items-center font-bold text-white text-sm hover:bg-[#405FC4] cursor-pointer ${isSelected ? 'bg-[#405FC4]' : 'bg-[#FFFFFF14]'}`}
            >
              {item?.servicesName}
            </div>
          );
          // }
        })}
      </div>
      <div className="" />
      <div className="text-lg text-center font-medium text-white my-[24px]">Extra Services</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-[24px] gap-[16px]">
        {extraServicesOptions?.map((item) => {
          const isSelected = selectedExtraServices
            ?.map((service) => service?._id)
            ?.includes(item?._id);

          const handleClick = () => {
            isSelected
              ? removeSelectedExtraService(item)
              : setSelectedExtraServices(item);
          };

          return (
            <div
              onClick={handleClick}
              key={item?._id}
              className={`flex p-[12px] w-full rounded-[8px] justify-center items-center font-bold text-white text-sm hover:bg-[#405FC4] cursor-pointer  ${isSelected ? 'bg-[#405FC4]' : 'bg-[#FFFFFF14]'}`}
            >
              <div className="flex items-center gap-1">
                <span className="font-bold text-white">
                  {item.servicesName} -
                </span>
                <span className=" text-start text-white text-xs">
                  {item?.amount} {item?.currency}
                </span>
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
};
export default ServicesTab;
