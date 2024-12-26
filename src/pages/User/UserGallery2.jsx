import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserGalleryService from "../../services/UserGalleryService";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileTile from "../layout/ProfileTile";

const UserGallery2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const [gallery, setGallery] = useState([]);

  const getGallery = (userid) => {
    UserGalleryService.getUserGallery(`${userid}`)
      .then((res) => {
        setGallery(res.images);
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

  return (
    <div
      className="main-container relative rounded-2xl flex flex-col p-0"
      style={{ height: "calc(100vh - 149px)" }}
    >
      <ProfileTile
        userDetails={location?.state}
        currentUserDetails={UserData}
      />

      <div className="flex flex-col">
        <p className="text-[27px] font-bold break-all">
          <span>Gallery</span>
        </p>
      </div>
      <div className="w-full flex-auto overflow-scroll pb-5 rounded-b-2xl">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
          {gallery &&
            gallery?.map((image, index) => (
              <div key={index} onClick={(e) => handelImageClick(e, image)}>
                <img
                  src={`${import.meta.env.VITE_APP_S3_IMAGE}/${
                    image?.image
                  }`}
                  // src={`${import.meta.env.VITE_APP_API_USERGALLERY_IMAGE_URL}/${
                  //   image?.image
                  // }`}
                  className="aspect-square object-cover"
                  alt={`Image ${index}`}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserGallery2;
