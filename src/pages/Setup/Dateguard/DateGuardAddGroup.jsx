import { useEffect, useMemo, useState } from "react";
import Button from "../../../components/Button";
import DateGuardService from "../../../services/DateGuardService";
import { useLocation, useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import DateGuardSelectGroup from "../../../pages/Setup/Dateguard/DateGuardSelectGroup";
import Header from "../../../components/Header/Header";
import PageTitle from "../../../components/PageTitle";

export default function DateGuardAddGroup() {
  const nav = useNavigate();

  const [updateNameLoading, setUpdateNameLoading] = useState(false);
  const [groupDetails, setGroupDetails] = useState({});
  const [redirectToSelectGroup, setRedirectToSelectGroup] = useState(false);
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const { state } = useLocation();
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

  useEffect(() => { }, []);

  const handleInputChange = (e) => {
    setGroupDetails({ ...groupDetails, name: e.target.value });
    debouncedvalue(e.target.value, groupDetails);
  };
  if (redirectToSelectGroup) {
    return <DateGuardSelectGroup />;
  }

  return (

    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Date Guard"} />
      </div>
      <div className="flex items-center justify-center">
        <img src="/images/setup/Disarm.svg" alt="guard" />
      </div>
      <div>
        <h3 className="sm:text-[28px] text-[24px] font-semibold text-center text-white my-[24px]">Create New Group</h3>
      </div>

      <div className='flex justify-center w-full'>
        <input
          disabled={updateNameLoading}
          value={groupDetails.name}
          onChange={handleInputChange}
          placeholder='New Group Name'
          type="text"
          className=" border border-[#919EAB33] p-[16px] text-white text-[14px] font-normal bg-transparent rounded-lg w-full max-w-[500px]"
        />
      </div>
      {updateNameLoading && (
        <p className="font-bold text-[14px] text-white text-center mt-4">
          Creating Group...
        </p>
      )}
      {/* <div className='relative mt-5'><div style={{ left: '2px' }} className='absolute w-[44px] z-20'><Button text="+" className='font-bold text-[35px] rounded-[50%] bg-[#05B7FD] h-[44px] flex items-center justify-center pb-2' size="44px" /></div><div className='relative w-[245px] h-[45px] bg-[#4200FF] rounded-[25px] border-2 border-[#4200FF]'><span style={{ left: '20px' }} className='font-bold text-[24px] text-white relative change-font-family'>Add/Members</span></div></div> */}
    </div>
  );
}
