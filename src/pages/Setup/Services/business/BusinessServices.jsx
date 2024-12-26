import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleGetServices } from "../../../../redux/action/Services";
import Button from "../../../../components/Button";

export default function BusinessServices() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const Businessservices = useSelector((state) => state.Services.getservices);

  const navigateToHotRod = () => {
    // navigate("/hot-rod");
  };

  useEffect(() => {
    dispatch(HandleGetServices(UserDetails?._id, UserDetails?.user_type));
  }, []);

  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-7">
        <span className="font-extrabold text-[27px]">Business Services</span>
      </div>
      <div className="form-field-container">
      {Businessservices &&
        Businessservices?.map((item, index) => {
          return (
            <div className="w-full mx-auto flex flex-col justify-center items-center mt-9">
              <div className="w-full mx-auto flex flex-row justify-start items-center">
                <span className="font-bold text-[18px]">{item?.title}</span>
                <button onClick={() => navigate("/services", { state: item })}>
                  <img className="pl-4" src="/images/CalendarEditIcon.png" />
                </button>
              </div>
              <div className="w-full mx-auto flex flex-row justify-start items-center mt-2">
                <span className="font-bold text-[9px]">DESCRIPTION</span>
              </div>
              <div className="w-full mx-auto flex flex-row  items-center mt-2">
                <span className="text-[9px] text-[#838282] text-left">
                  {item?.description}
                </span>
              </div>
              <div className="w-full mx-auto flex justify-between items-center mt-4 text-[9px] flex-col grid grid-cols-3 gap-1">
                {item?.businessHourlyRates?.map((rate) => {
                  return (
                    <span className="">
                      Time {rate?.hour}/Price {rate?.rate}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}

      <div className="w-full mx-auto flex flex-row justify-start items-center mt-9">
        <div className="w-[250px]">
          <Button
            text="View Description of available services"
            className={
              "font-extrabold text-[12.6px] text-[#073FE1] bg-transparent shadow-none border-b-2 border-b-[#073FE1] rounded-none"
            }
            size="20px"
          />
        </div>
      </div>
      <div className="flex items-center justify-center w-full mt-5 mb-5">
        <Button
          className={
            "flex items-center w-full mt-[20px] px-[40px] py-2 my-2 mb-5 justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] rounded-xl"
          }
          text="Edit Business Services"
          size="42px"
        />
      </div>
      </div>
    </div>
  );
}
