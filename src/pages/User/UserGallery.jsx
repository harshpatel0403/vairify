import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserGalleryService from "../../services/UserGalleryService";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../components/Loading/Index";
import PageTitle from "../../components/PageTitle";
const UserGallery = (props) => {
  const loc = useLocation();
  const userId = props?.userId || loc?.state?.userId;
  const user = props?.user || loc?.state?.user;

  const location = {
    state: {
      userId,
      user
    }
  }
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [gallery, setGallery] = useState([]);
  const [isFromProp, setIsFromProp] = useState(true);
  useEffect(() => {
    const fromProps = props?.userId;
    setIsFromProp(fromProps);
  }, [props?.userId]);

  const getGallery = (userid) => {
    setLoading(true);
    UserGalleryService.getUserGallery(`${userid}`)
      .then((res) => {
        console.log(res.images);
        setGallery(res.images);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (location.state?.userId ?? false) {
      getGallery(location.state.userId);
    }
  }, []);

  const handelImageClick = (e, item) => {
    e.preventDefault();
    navigate("/user/gallery-details", {
      state: {
        item,
        personId: location.state?.userId,
        user: location.state?.user,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className={`container ${!isFromProp ? "mb-[48px]" : "lg:p-0 "}`}>
      <div>
        {!isFromProp &&
          <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
            <PageTitle title={"Gallery"} />
          </div>
        }
      </div>

      <div className="flex flex-col justify-center items-center lg:mt-0 mt-[24px]">
        {/* <div className="w-full flex flex-col justify-center items-center ">
          <div className=" text-[27px] font-bold break-all">
            <span>Gallery</span>
          </div>
        </div> */}
        <div className={`w-full mx-auto items-center  ${isFromProp ? "lg:max-h-[70vh] overflow-auto scrollbar-hidden" : ""}`}>
          <div className="grid md:grid-cols-4 grid-cols-2 sm:gap-[20px] gap-[16px]">
            {gallery &&
              gallery?.map((image, index) => (
                <div
                  key={index}
                  className="w-full aspect-square cursor-pointer"
                  onClick={(e) => handelImageClick(e, image)}
                >
                  <img
                    src={`${import.meta.env.VITE_APP_S3_IMAGE
                      }/${image?.image}`}
                    alt={`Image ${index}`}
                    className="w-full h-full object-cover rounded-[16px]"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGallery;
