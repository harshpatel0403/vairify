import { useEffect, useState } from "react";
import Button from "../../components/Button";
import SearchBox from "../../components/SearchBox";
import { useLocation, useNavigate } from "react-router-dom";
import SetupService from "../../services/SetupService";
import { useDispatch, useSelector } from "react-redux";
import { HandleLanguage } from "../../redux/action/Auth";
import { UpdateProfile } from "../../redux/action/Profile";
import { toast } from "react-toastify";
import VaridateService from '../../services/VaridateServices'
import Loading from "../../components/Loading/Index";
const Language = () => {
  const [languages, setLanguages] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(false);
  const [UserData, setUserData] = useState({});
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const { from } = location.state || {};

  const getLanguages = () => {
    SetupService.allLanguages()
      .then((res) => {
        setLanguages(res);
        setFilteredLanguages(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const UserData = await VaridateService?.fetchUserDetails(UserDetails?._id)
      setUserData(UserData);
    }
    getLanguages();
    fetchUserDetails();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = languages.filter((language) =>
      language.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLanguages(filtered);
  };

  const HandleValue = (value, index) => {
    dispatch(HandleLanguage(value?.name));
    setLanguage(value?.name);

    setSelectedLang(index);
  };
  const handleNext = () => {
    try {
      setIsLoading(true);
      if (UserDetails) {
        dispatch(UpdateProfile({ language: language, userId: UserDetails?._id }))
          .then((result) => {

            if (result?.payload?.status === 200) {
              toast(result?.payload?.data?.message, {
                hideProgressBar: true,
                autoClose: 1000,
                type: "success",
              });
            } else {
              toast(result?.payload?.data?.error, {
                hideProgressBar: true,
                autoClose: 1000,
                type: "error",
              });
            }
            setIsLoading(false);
            navigate(from || "/selectcategory");
          })
          .catch((err) => {
            console.error(err, "Error");
          });
      } else {
        navigate(from || "/selectcategory", { state: { language: language } });
      }

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className="language-main-container main-container pt-5 form-field-container h-[100%]">
      <div className="w-full mx-auto flex flex-col justify-between items-center h-[100%]">
        <div className="h-fit">
          <span className="text-[30px] font-bold">Select Language...</span>
        </div>
        <div className="mt-3 w-full mx-auto h-fit">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search Languages"
            classname="rounded-xl !pr-2"
            language="true"
          />
        </div>
        <div className="flex flex-col justify-start items-center mt-4 h-[100%] max-h-[100%] w-[100%] overflow-scroll">
          {filteredLanguages.map((language, i) => (
            <div
              key={i}
              className={`w-full mx-auto flex items-center justify-center cursor-pointer px-4 ${i === selectedLang
                ? "bg-[#040B47] text-white"
                : "hover:bg-[#D9D9D9] hover:border-[#D9D9D9]"
                }`}
            >
              <div
                className="w-full flex items-center justify-between py-4"
                onClick={() => HandleValue(language, i)}
              >
                <div className="w-[88px] flex-1">
                  <img
                    className="shadow-2xl w-[85px]"
                    src={
                      import.meta.env.VITE_APP_API_LANGUAGES_IMAGE_URL +
                      `/${language.image}`
                    }
                    alt={language.name}
                  />
                </div>
                <span className=" text-[21px] font-medium flex-1 text-left">
                  {language.name}
                </span>
                {UserData?.language === language.name && (
                  <img
                    className="shadow-2xl w-[35px]"
                    src={
                      '/images/VerifiedMarkIcon.png'
                    }
                    alt={language.name}
                  />
                )}
              </div>
            </div>
          ))}
          {/* 


{filteredLanguages.map((language, i) => (
            <div
              key={i}
              className="w-full mx-auto flex items-center justify-center hover:bg-[#D9D9D9] hover:border-[#D9D9D9]"
            >
              <div
                className="w-[250px] flex items-center justify-between py-4"
                onClick={() => HandleValue(language)}
              >
                <div className="w-[88px]">
                  <img
                    className="w-full shadow-2xl"
                    src={
                      import.meta.env.VITE_APP_API_LANGUAGES_IMAGE_URL +
                      `/${language.image}`
                    }
                    alt={language.name}
                  />
                </div>
                <span className=" text-[21px] font-medium">
                  {language.name}
                </span>
              </div>
            </div>
          ))}



{filteredLanguages.map((language, i) => (
            <div
              key={i}
              className="w-full mx-auto flex items-center justify-center hover:bg-[#D9D9D9] hover:border-[#D9D9D9]"
            >
              <div
                className="w-[250px] flex items-center justify-between py-4"
                onClick={() => HandleValue(language)}
              >
                <div className="w-[88px]">
                  <img
                    className="w-full shadow-2xl"
                    src={
                      import.meta.env.VITE_APP_API_LANGUAGES_IMAGE_URL +
                      `/${language.image}`
                    }
                    alt={language.name}
                  />
                </div>
                <span className=" text-[21px] font-medium">
                  {language.name}
                </span>
              </div>
            </div>
          ))}



{filteredLanguages.map((language, i) => (
            <div
              key={i}
              className="w-full mx-auto flex items-center justify-center hover:bg-[#D9D9D9] hover:border-[#D9D9D9]"
            >
              <div
                className="w-[250px] flex items-center justify-between py-4"
                onClick={() => HandleValue(language)}
              >
                <div className="w-[88px]">
                  <img
                    className="w-full shadow-2xl"
                    src={
                      import.meta.env.VITE_APP_API_LANGUAGES_IMAGE_URL +
                      `/${language.image}`
                    }
                    alt={language.name}
                  />
                </div>
                <span className=" text-[21px] font-medium">
                  {language.name}
                </span>
              </div>
            </div>
          ))}

{filteredLanguages.map((language, i) => (
            <div
              key={i}
              className="w-full mx-auto flex items-center justify-center hover:bg-[#D9D9D9] hover:border-[#D9D9D9]"
            >
              <div
                className="w-[250px] flex items-center justify-between py-4"
                onClick={() => HandleValue(language)}
              >
                <div className="w-[88px]">
                  <img
                    className="w-full shadow-2xl"
                    src={
                      import.meta.env.VITE_APP_API_LANGUAGES_IMAGE_URL +
                      `/${language.image}`
                    }
                    alt={language.name}
                  />
                </div>
                <span className=" text-[21px] font-medium">
                  {language.name}
                </span>
              </div>
            </div>
          ))} */}
        </div>
        <div className="flex-1 w-full mt-10 mb-10 h-fit">
          <Button
            className={
              "flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
            }
            text={isLoading ? (<Loading />) : from ? "Save" : "Next"}
            size="45px"
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default Language;
