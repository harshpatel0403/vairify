import React from "react";
import Button from "../../components/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function MyVairipayOption() {
  const { state: AllApps } = useLocation();
  const navigate = useNavigate();
  const vairipayOptions = [
    {
      image: "/images/VairipayOptionVenmo.png",
      Link: "#",
    },
    {
      image: "/images/VairipayOptionZ.png",
      Link: "#",
    },
    {
      image: "/images/VairipayPaypal.png",
      Link: "#",
    },
  ];
  const uniqueLinks = new Set();

  // Filter out duplicates based on paymentLink
  const uniqueApps =
    AllApps &&
    AllApps?.filter((item) => {
      if (uniqueLinks.has(item.paymentAppName)) {
        return false; // This item is a duplicate
      }
      uniqueLinks.add(item.paymentAppName);
      return true; // This item is unique
    });

  return (
    <div className="main-container ">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-10">
        <div className="w-full mx-auto flex items-center justify-center">
          <img
            src={import.meta.env.BASE_URL + "images/VairipayRequestSecond.png"}
            alt="Vairipay Request Second Logo"
          />
        </div>
        <div className="w-full max-w-[500px] h-[500px] mx-auto flex flex-col justify-start items-center mb-10 overflow-scroll mt-4">
          {uniqueApps && uniqueApps.length > 0 ? (
            uniqueApps.map((item) => (
              <div
                key={item._id}
                className="w-full bg-[#3760CB] border-2 border-[#01195C] rounded-[30px] p-4 flex flex-row justify-between items-center mt-6"
              >
                <div>
                  <img
                    src={
                      import.meta.env.VITE_APP_API_USER_VARIPAY_IMAGE_URL +
                      `/${item?.paymentImage}`
                    }
                    className="max-w-[100px] h-[100px]"
                    alt={item.paymentAppName}
                  />
                </div>
                <a
                  href={item?.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-[23.4px] flex-grow font-extrabold rounded-full"
                >
                  Download
                </a>
              </div>
            ))
          ) : (
            <p>No payment options available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
