import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/AuthService";
import SearchBox from "../../../components/SearchBox";
import { toast } from "react-toastify";
import Header from "../../../components/Header/Header";
import InputText from "../../../components/InputText";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading/Index";
import SocialServices from "../../../services/SocialServices";
import { useSelector } from "react-redux";
import PageTitle from "../../../components/PageTitle";

const SocialSearch = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [social, setSocial] = useState([]);
  const [filterdSocials, setFilteredSocial] = useState([]);
  const [loading, setLoading] = useState(false);
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    whatsapp: "",
    twitter: "",
  });

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

  const handleSubmit = () => {

    const platforms = ['facebook', 'instagram', 'whatsapp', 'twitter'];
    const filledLinks = platforms.filter((platform) => socialLinks[platform]);

    if (filledLinks.length === 0) {
      toast.error("Please enter a valid social link");
      return;
    }
    setLoading(true);
    const promises = filledLinks.map((platform) => {
      const bodyData = {
        userId: UserDetails._id,
        socialAppName: platform.charAt(0).toUpperCase() + platform.slice(1),
        socialUrl: socialLinks[platform],
      };

      return SocialServices.addUserSocial(bodyData);
    });

    Promise.all(promises)
      .then(() => {
        toast.success("Social links added successfully");
        setLoading(false);
        navigate(-1);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.response?.data?.error || err.message);
        setLoading(false);
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
      <div className="flex justify-center m-auto align-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Social"} />
      </div>
      <div className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="select-arrow w-full mb-[24px]">
          <select
            className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[14px] px-[14px] bg-transparent text-white font-normal text-[14px]"
            style={{ color: "rgba(2, 34, 126, 0.60) !important;" }}
            value={selectedCountry}
            onChange={handleSelectChange}
          >
            <option value="" className="text-black">Search Country (Any)</option>
            {countries?.map((country) => (
              <option key={country._id} value={country.name} className="text-black">
                {country.name}
              </option>
            ))}
          </select>
        </div>
        {/* <div className="w-full input-serach-veiripay">
            <SearchBox
              onSearch={handleSearch}
              placeholder="Search Social"
              bgColor={'transparent'}
              className={
                "!placeholder-white !placeholder:opacity-1"
              }
            />
          </div> */}
        {/* <div className="social-meadia-part h-auto overflow-x-hidden">
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
          </div> */}
      </div>

      {/* development needs to be done here */}
      <div className="grid sm:grid-cols-2 sm:gap-[24px] gap-[16px]">
        <div>
          <div className="flex gap-2 items-center mb-2">
            <img src="/images/setup/facebook.svg" alt="facebook" />
            <p className="text-sm font-normal text-white">Facebook</p>
          </div>
          <InputText placeholder='Facebook URL' className='rounded-[8px] border-[#919EAB33]' value={socialLinks?.facebook} onChange={(e) => {
            setSocialLinks((prevVal) => ({
              ...prevVal,
              facebook: e.target.value
            }))
          }} />
        </div>
        <div>
          <div className="flex gap-2 items-center mb-2">
            <img src="/images/setup/instagram.svg" alt="Instagram" />
            <p className="text-sm font-normal text-white">Instagram</p>
          </div>
          <InputText placeholder='Instagram URL' className='rounded-[8px] border-[#919EAB33]' value={socialLinks?.instagram} onChange={(e) => {
            setSocialLinks((prevVal) => ({
              ...prevVal,
              instagram: e.target.value
            }))
          }} />
        </div>
        <div>
          <div className="flex gap-2 items-center mb-2">
            <img src="/images/setup/whatsapp.svg" alt="whatsapp" />
            <p className="text-sm font-normal text-white">WhatsApp</p>
          </div>
          <InputText placeholder='WhatsApp URL' className='rounded-[8px] border-[#919EAB33]' value={socialLinks?.whatsapp} onChange={(e) => {
            setSocialLinks((prevVal) => ({
              ...prevVal,
              whatsapp: e.target.value
            }))
          }} />
        </div>
        <div>
          <div className="flex gap-2 items-center mb-2">
            <img src="/images/setup/twitter.svg" alt="Twitter" />
            <p className="text-sm font-normal text-white">Twitter</p>
          </div>
          <InputText placeholder='Twitter URL' className='rounded-[8px] border-[#919EAB33]' value={socialLinks?.twitter} onChange={(e) => {
            setSocialLinks((prevVal) => ({
              ...prevVal,
              twitter: e.target.value
            }))
          }} />
        </div>
      </div>
      <div className='flex justify-center items-center mt-[24px]'>
        <Button disabled={loading} text={loading ? (
          <div className="flex justify-center items-center">
            <Loading />
          </div>
        ) : 'Save'} className='max-w-[500px] mb-[48px]' size='48px' onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default SocialSearch;
