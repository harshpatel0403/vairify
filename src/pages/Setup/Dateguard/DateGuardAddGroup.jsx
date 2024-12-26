import { useEffect, useMemo, useState } from "react";
import Button from "../../../components/Button";
import DateGuardService from "../../../services/DateGuardService";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import DateGuardSelectGroup from "../../../pages/Setup/Dateguard/DateGuardSelectGroup";

export default function DateGuardAddGroup() {
  const nav = useNavigate();

  const [updateNameLoading, setUpdateNameLoading] = useState(false);
  const [groupDetails, setGroupDetails] = useState({});
  const [redirectToSelectGroup, setRedirectToSelectGroup] = useState(false);
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  // Debounced search function using lodash
  const debouncedvalue = useMemo(() => {
    return debounce(async (query, otherData = {}) => {
      setUpdateNameLoading(true);
      try {
        // Simulate an API request (replace with your actual search logic)
        const newGroup = await DateGuardService.createGroup(UserDetails._id, {
          ...otherData,
          groupName: query,
          members: [],
        });

        // nav(`/dateguard/edit-group/${newGroup?._id}`);
        setRedirectToSelectGroup(true);
      } catch (error) {
        console.error("Error performing search:", error);
      } finally {
        setUpdateNameLoading(false);
      }
    }, 500); // 500ms delay
  }, []);

  useEffect(() => {
    if (!UserDetails) {
      nav("/login");
    }
    return () => {
      debouncedvalue.cancel();
    };
  }, []);

  useEffect(() => {}, []);

  const handleInputChange = (e) => {
    setGroupDetails({ ...groupDetails, name: e.target.value });
    debouncedvalue(e.target.value, groupDetails);
  };
  if (redirectToSelectGroup) {
    return <DateGuardSelectGroup />;
}

  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        <div className="w-full mx-auto flex items-center justify-center">
          <span className="font-bold text-[30px] text-[#05B7FD] change-font-family">
            Date Guard
          </span>
        </div>
        <div className="w-full mx-auto flex items-center justify-center mt-4">
          <div className="w-[67px] h-[82px]">
            <img src={"/images/DateGuardMask.png"} alt="Date Guard Mask" />
          </div>
        </div>
        <div className="w-full mx-auto flex items-center justify-center mt-4">
          <span className="font-bold text-[30px] text-[#D9D9D9] change-font-family">
            Create Group
          </span>
        </div>
        <div className="w-full mx-auto flex items-center justify-center">
          <span className="font-bold text-[24px] text-[#D9D9D9] change-font-family">
            Name Group
          </span>
        </div>
        <div
          style={{ marginBottom: "200px" }}
          className="w-full mx-auto flex flex-col justify-center items-center mt-4"
        >
          <div className="relative">
            <div style={{ left: "2px" }} className="absolute w-[44px] z-20">
              <Button
                text="+"
                className="font-bold text-[35px] rounded-[50%] bg-[#05B7FD] h-[44px] flex items-center justify-center pb-2"
                size="44px"
              />
            </div>
            <div className="relative w-[196px] h-[45px] bg-[#40355C] rounded-[25px] border-2 border-[#4200FF]">
              <input
                disabled={updateNameLoading}
                value={groupDetails.name}
                onChange={handleInputChange}
                type="text"
                className="font-bold text-[24px] text-white relative change-font-family w-full bg-transparent transparent-input"
              />
            </div>
            {updateNameLoading && (
              <p className="font-bold text-[14px] text-white change-font-family">
                Please wait..
              </p>
            )}
          </div>
          {/* <div className='relative mt-5'><div style={{ left: '2px' }} className='absolute w-[44px] z-20'><Button text="+" className='font-bold text-[35px] rounded-[50%] bg-[#05B7FD] h-[44px] flex items-center justify-center pb-2' size="44px" /></div><div className='relative w-[245px] h-[45px] bg-[#4200FF] rounded-[25px] border-2 border-[#4200FF]'><span style={{ left: '20px' }} className='font-bold text-[24px] text-white relative change-font-family'>Add/Members</span></div></div> */}
        </div>
      </div>
    </div>
  );
}
