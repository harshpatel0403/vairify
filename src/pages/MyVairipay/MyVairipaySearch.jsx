import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBox from "../../components/SearchBox";
import AuthService from "../../services/AuthService";
import Loading from "../../components/Loading/Index";

export default function MyVairipaySearch() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [varipays, setVaripays] = useState([]);
  const [filterdVaripays, setFilteredVaripays] = useState();

  function getUniqueVairipays(res) {
    const uniqueVairipaysMap = new Map();

    res.forEach((item) => {
      const vairipays = item.varipays || [];
      vairipays.forEach((vairipay) => {
        const normalizedVairipayName = vairipay.name.trim().toLowerCase();

        if (!uniqueVairipaysMap.has(normalizedVairipayName)) {
          uniqueVairipaysMap.set(normalizedVairipayName, vairipay);
        }
      });
    });

    return Array.from(uniqueVairipaysMap.values());
  }

  const getAllData = () => {
    AuthService.getAllCountries()
      .then((res) => {
        setCountries(res);
        const uniqueVairipaysArray = getUniqueVairipays(res);
        setVaripays(uniqueVairipaysArray);
        setFilteredVaripays(uniqueVairipaysArray);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllData();
  }, []);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    navigate("/vairipay-add", {
      state: event,
    });
  };

  const handleSearch = (searchTerm) => {
    const filtered = varipays.filter((varipay) =>
      varipay.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVaripays(filtered);
  };

  const handleSelectChange = (event) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);

    if (selectedCountry) {
      const selectedCountryData = countries.find(
        (country) => country.name === selectedCountry
      );
      if (selectedCountryData) {
        setFilteredVaripays(selectedCountryData.varipays);
      } else {
        setFilteredVaripays(varipays);
      }
    } else {
      setFilteredVaripays(varipays);
    }
  };

  return (
    <div className="main-container form-field-container pb-0 flex flex-col justify-center pt-2 w-full max-w-[510px]">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        <div className="w-full mx-auto flex items-center justify-center my-2">
          <img
            src={import.meta.env.BASE_URL + "images/VairipaySearchLogo.png"}
            alt="Vairipay Search Logo"
          />
        </div>
        {/* <select
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
        </select> */}
        <div className="w-full input-serach-veiripay">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search Varipay"
            bgColor={"gray-100"}
            className={
              "w-[100%] max-w-[297px] rounded-lg border-0 border-[#D9D9D9] text-[30px] font-bold text-[#02227E]"
            }
          />
        </div>
        <div className="social-meadia-part h-auto overflow-x-hidden">
          {filterdVaripays ? (
            filterdVaripays.length !== 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-5 mb-3">
                {filterdVaripays?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => handleSubmit(item)}
                      className="bg-[#3760CB] rounded-[30px] border-2 border-[#02227E] p-[12px] w-[90px] h-[90px] flex items-center justify-center overflow-hidden"
                    >
                      <div className="bg-[#fff] w-[65px] h-[45px] rounded-[4px] text-center flex items-center p-2">
                        <img
                          className="max-h-[36px] mx-auto"
                          // style={{ width: 'auto', height: '36px' }}
                          src={
                            import.meta.env
                              .VITE_APP_API_USER_VARIPAY_IMAGE_URL +
                            `/${item?.image?.toLowerCase()}`
                          }
                          alt={item.name}
                          onError={(e) => e.target.style.display = 'none'} // Hide broken images
                          onLoad={(e) => e.target.style.display = 'block'}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-[32px] text-[#4b4b4b] font-bold text-center flex flex-col justify-center items-center">
                <div className="image-not">
                  <img src="/images/notFound.png" alt="logo" />
                </div>
                Result not found
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-80">
              <Loading />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
