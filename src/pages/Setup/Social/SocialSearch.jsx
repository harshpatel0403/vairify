import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/AuthService";
import SearchBox from "../../../components/SearchBox";
import { toast } from "react-toastify";

const SocialSearch = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [social, setSocial] = useState([]);
  const [filterdSocials, setFilteredSocial] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllData = () => {
    setLoading(true);
    AuthService.getAllCountries()
      .then((res) => {
        setCountries(res);

        const uniqueSocialsMap = new Map();

        res.forEach((item) => {
          const socials = item.social || [];
          socials.forEach((vairipay) => {
            uniqueSocialsMap.set(vairipay.name, vairipay);
          });
        });

        const uniqueSocialArray = Array.from(uniqueSocialsMap.values());
        setSocial(uniqueSocialArray);
        setFilteredSocial(uniqueSocialArray);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err?.response?.data?.error || err.message);
      });
  };

  useEffect(() => {
    getAllData();
  }, []);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    console.log("event: ", event);
    navigate("/add-social", {
      state: event,
    });
  };

  // const handleSearch = (searchTerm) => {
  //   const filtered = social.filter((s) =>
  //     s.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredSocial(filtered);
  // };
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === "") {
      if (selectedCountry) {
        const selectedCountryData = countries.find(
          (country) => country.name === selectedCountry
        );
        setFilteredSocial(selectedCountryData?.social || []);
      } else {
        setFilteredSocial(social);
      }
    } else {
      const filtered = social.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSocial(filtered);
    }
  };


  const handleSelectChange = (event) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);

    if (selectedCountry) {
      const selectedCountryData = countries.find(
        (country) => country.name === selectedCountry
      );
      if (selectedCountryData) {
        setFilteredSocial(selectedCountryData.social);
      } else {
        setFilteredSocial(social);
      }
    } else {
      setFilteredSocial(social);
    }
  };

  if (loading) {
    return (
      <div className="h-full min-h-[calc(100vh-230px)] flex items-center justify-center">
        <div className="text-black h-full flex justify-center items-center">
          <p className="text-[20px] text-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container form-field-container pb-0 flex flex-col justify-center pt-2 w-full max-w-[510px]">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        {/* <div className="w-full mx-auto flex items-center justify-center my-2">
          <img
            src={import.meta.env.BASE_URL + "images/VairipaySearchLogo.png"}
            alt="Vairipay Search Logo"
          />
        </div> */}
        <select
          className="w-[100%] p-2 rounded-xl my-2 font-bold text-[21px] text-[#6a7bb3]"
          style={{ color: "rgba(2, 34, 126, 0.60) !important;" }}
          value={selectedCountry}
          onChange={handleSelectChange}
        >
          <option value="">Search Country (Any)</option>
          {countries?.map((country) => (
            <option key={country._id} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
        <div className="w-full input-serach-veiripay">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search Social"
            bgColor={"gray-100"}
            className={
              "w-[100%] max-w-[297px] rounded-lg border-0 border-[#D9D9D9] text-[30px] font-bold text-[#02227E]"
            }
          />
        </div>
        <div className="social-meadia-part h-auto overflow-x-hidden">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-5 mb-3">
            {filterdSocials.length !== 0 &&
              filterdSocials?.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleSubmit(item)}
                    className="bg-[#3760CB] rounded-[30px] border-2 border-[#02227E] p-[12px] w-[90px] h-[90px] flex items-center justify-center overflow-hidden"
                  >
                    <div className="bg-[#fff] w-[65px] h-[45px] rounded-[4px] text-center flex items-center p-2">
                      <img
                        className="max-h-[36px] mx-auto"
                        src={
                          import.meta.env.VITE_APP_API_BASE_URL +
                          `/images/socials/${item?.image}`
                        }
                        alt={item.name}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSearch;
