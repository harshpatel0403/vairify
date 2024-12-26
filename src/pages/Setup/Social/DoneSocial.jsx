import { useEffect } from "react";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HandlegetUserSocial } from "../../../redux/action/Social";

export default function DoneSocial() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  useEffect(()=>{
    dispatch(HandlegetUserSocial(UserData?._id));
  },[]);

  // console.log(state, "link")
  const handleNext = () => {
    // navigate("/setup", { state: state });
    navigate("/setup");
  };
  const handleAddMore = () => {
    navigate("/search-social");
  };
  return (
    <div
      className="main-container h-full form-field-container flex flex-col justify-center"
      style={{ height: "calc(100vh - 149px)" }}
    >
      <div className="flex flex-col justify-between items-center w-full mx-auto">
        <div className="w-full flex items-center justify-center flex-1">
          <div className="flex items-center justify-center mt-5 w-full h-[300px] bg-[#3760CB] border-2 border-white rounded-xl">
            <img
              src={
                import.meta.env.VITE_APP_API_BASE_URL +
                `/images/socials/${state?.state?.image}`
              }
              alt={state?.state?.image}
              className="w-full p-20"
            />
          </div>
        </div>

        <div className="w-full flex justify-center mt-4 mb-6 gap-4">
          <Button
            onClick={handleAddMore}
            className={
              "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-extrabold text-[21.38px] py-2 "
            }
            text={"Add More"}
            size="45px"
          />
          <Button
            onClick={handleNext}
            className={
              "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-extrabold text-[21.38px] py-2 "
            }
            text={"Finished"}
            size="45px"
          />
        </div>
      </div>
    </div>
  );
}
