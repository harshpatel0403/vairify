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
import BackButton from "../../components/BackButton/backArrowButton";
import LayoutHeader from "../layout/Header";
import Footer from "../layout/Footer";
import Header from "../../components/Header/Header";
import PageTitle from "../../components/PageTitle";

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
  const [loadingLanguages, setLoadingLanguages] = useState(false);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const { from, showLayoutHeader } = location.state || {};

  const getLanguages = async () => {
    setLoadingLanguages(true);
    await SetupService.allLanguages()
      .then((res) => {
        setLanguages(res);
        setFilteredLanguages(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() =>
        setLoadingLanguages(false)
      )

  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (UserDetails?._id) {

        const UserData = await VaridateService?.fetchUserDetails(UserDetails?._id)
        setUserData(UserData);
      }
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

  if (loadingLanguages) {
    return (
      <div className="flex justify-center align-center items-center h-[50vh]">
        <Loading />
      </div>
    )
  }
  return (
    <>
      {from?.includes("settings") || from?.includes("setup") ? (
        <>
          {showLayoutHeader ? (
            <div className=""><LayoutHeader /></div>
          ) : (
            <div className=""><Header /></div>
          )}
          <div className="container mt-[50px]">
            <div className="mx-auto">
              <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
                <PageTitle title={"Select Your Language"} isSmall={true} />
              </div>
              <div className="sm:mt-[64px] mt-[30px] flex flex-col items-center justify-center sm:gap-[32px] gap-[24px]">
                <div className="w-full">
                  <SearchBox
                    onSearch={handleSearch}
                    placeholder="Search"
                    classname="border-[2px] border-[#919EAB33] !rounded-[8px] !pl-[46px] !px-[14px] !py-[16px] !input-text !bg-transparent !w-[100%] !text-white"
                    language="true"
                  />
                </div>
                <div className=" w-[100%] grid sm:grid-cols-3 grid-cols-1 justify-center sm:gap-[20px] gap-[10px] items-center overflow-scroll ">

                  {filteredLanguages.map((language, i) => (
                    <div
                      key={i}
                      className={`w-full mx-auto flex h-full justify-center cursor-pointer`}
                    >
                      <div
                        className={`w-full flex sm:flex-col items-center sm:justify-start justify-center sm:py-[16px] py-[12px] gap-[8px] bg-[#2F3BA4] rounded-[8px] border border-transparent hover:border hover:border-white transition-all duration-500 ${i === selectedLang
                          ? "border border-white"
                          : ""
                          }`}
                        onClick={() => HandleValue(language, i)}
                      >
                        <div>
                          <img
                            className="sm:w-[60px] sm:h-[60px] w-[30px] h-[30px] rounded-full object-cover"
                            src={
                              import.meta.env.VITE_APP_API_LANGUAGES_IMAGE_URL +
                              `/${language.image}`
                            }
                            alt={language.name}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-medium text-white leading-[26px]">
                            {language.name}
                          </span>
                          {UserData?.language === language.name && (
                            <img
                              className="shadow-2xl w-[20px]"
                              src={
                                '/images/VerifiedMarkIcon.png'
                              }
                              alt={language.name}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="max-w-[500px] w-full md:mt-[100px] mt-0 h-fit">
                  <Button
                    text={isLoading ? (<Loading />) : from ? "Save" : "Select Language"}
                    disabled={isLoading}
                    onClick={handleNext}
                  />
                </div>
              </div>
            </div>
          </div>
          <Footer from={from} />
        </>
      ) : (
        <div className="signup-backgound-design">
          <div className="signup-container container">
            <div className="signup-content relative">
              <div className="backnavigation"><BackButton /></div>
              <div className="max-w-[500px] mx-auto">
                <div className="logo-img-container">
                  <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
                  <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
                </div>
                <div className="sm:mt-[64px] mt-[30px] flex flex-col items-center justify-center sm:gap-[32px] gap-[24px]">
                  <h3 className="primary-heading text-center">Select Your Language</h3>
                  <div className="w-full">
                    <SearchBox
                      onSearch={handleSearch}
                      placeholder="Search Languages"
                      classname="border-[2px] border-[#919EAB33] !rounded-[8px] !pl-[46px] !px-[14px] !py-[16px] !input-text !bg-transparent !w-[100%] !text-white"
                      language="true"
                    />
                  </div>
                  <div className="sm:w-[500px] w-[100%] grid sm:grid-cols-3 grid-cols-1 justify-center sm:gap-[20px] gap-[10px] items-center overflow-scroll ">
                    {loadingLanguages && (
                      <Loading />
                    )}
                    {filteredLanguages.map((language, i) => (
                      <div
                        key={i}
                        className={`w-full mx-auto flex h-full justify-center cursor-pointer`}
                      >
                        <div
                          className={`w-full flex sm:flex-col items-center sm:justify-start justify-center sm:py-[16px] py-[12px] gap-[8px] bg-[#2F3BA4] rounded-[8px] border border-transparent hover:border hover:border-white transition-all duration-500 ${i === selectedLang
                            ? "border border-white"
                            : ""
                            }`}
                          onClick={() => HandleValue(language, i)}
                        >
                          <div>
                            <img
                              className="sm:w-[60px] sm:h-[60px] w-[30px] h-[30px] rounded-full object-cover"
                              src={
                                import.meta.env.VITE_APP_API_LANGUAGES_IMAGE_URL +
                                `/${language.image}`
                              }
                              alt={language.name}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-medium text-white leading-[26px]">
                              {language.name}
                            </span>
                            {UserData?.language === language.name && (
                              <img
                                className="shadow-2xl w-[20px]"
                                src={
                                  '/images/VerifiedMarkIcon.png'
                                }
                                alt={language.name}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 w-full h-fit">
                    <Button
                      text={isLoading ? (<Loading />) : from ? "Save" : "Select Language"}
                      disabled={isLoading}
                      onClick={handleNext}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default Language;
