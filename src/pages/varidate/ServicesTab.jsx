import { useEffect, useState } from "react";

const ServicesTab = ({
  services,
  selectedService,
  setService,
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
      <div className="bg-gradient-to-b from-[#02227E] to-[#0247FF] p-3" />
      <span className="font-bold text-[#01195C] text-2xl">Services</span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {servicesOptions?.map((item) => {
          // if (item?._id === selectedService?._id) {
          //     return <div key={item?._id} className='flex flex-row p-2 w-full rounded-full justify-center items-center bg-gradient-to-b from-[#02227E] to-[#0247FF]'>
          //         <span className='font-bold text-white '>{item?.servicesName}</span>
          //     </div>
          // } else {
          return (
            <div
              key={item?._id}
              className="flex flex-row p-2 w-full rounded-full justify-center items-center bg-[#9099BB] border-2 border-[#02227E] font-bold text-[#01195C]"
            >
              <span className="font-bold">{item?.servicesName}</span>
            </div>
          );
          // }
        })}
      </div>
      <div className="bg-gradient-to-b from-[#02227E] to-[#0247FF] p-3" />
      <span className="font-bold text-[#01195C] text-2xl">Extra Services</span>
      <div className="grid grid-cols-1 md:grid-cols-3  gap-4 p-4">
        {extraServicesOptions?.map((item) => {
          if (
            selectedExtraServices
              ?.map((service) => service?._id)
              ?.includes(item?._id)
          ) {
            return (
              <div
                onClick={() => removeSelectedExtraService(item)}
                key={item?._id}
                className="flex flex-row p-1 w-full rounded-full items-center bg-gradient-to-b from-[#02227E] to-[#0247FF]"
              >
                <div
                  className={`bg-[#08FA5A] h-[30px] w-[30px] rounded-full px-2`}
                />
                <div className="flex flex-col">
                  <span className="px-2 font-bold text-white">
                    {item.servicesName}
                  </span>
                  <span className="ps-2 text-start text-white text-xs">
                    {item?.amount} {item?.currency}
                  </span>
                </div>
              </div>
            );
          } else {
            return (
              <div
                onClick={() => setSelectedExtraServices(item)}
                key={item?._id}
                className="flex flex-row p-1 w-full rounded-full items-center bg-gradient-to-b from-[#02227E] to-[#0247FF]"
              >
                <div
                  className={`bg-[#ffffff] h-[30px] w-[30px] rounded-full px-2`}
                />
                <div className="flex flex-col">
                  <span className="px-2 font-bold text-white">
                    {item.servicesName}
                  </span>
                  <span className="ps-2 text-start text-white text-xs">
                    {item?.amount} {item?.currency}
                  </span>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
export default ServicesTab;
