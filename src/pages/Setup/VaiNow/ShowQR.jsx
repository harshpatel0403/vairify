import React from "react";
import { useSelector } from "react-redux";
import QRCode from "react-qr-code";
// import { QRCode } from "react-qrcode-logo";

export default function ShowQR() {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  return (
    <div className="main-container">
      <div className="w-full mx-auto flex flex-col justify-center items-center pt-2">
        <div className="w-full mx-auto flex items-center justify-center">
          <span className="font-bold text-[30px] change-font-family">
            VAI-CHECK QR
          </span>
        </div>
        <div className="w-full mx-auto flex items-center justify-center mt-2">
          <div className="flex-1 flex items-center justify-center">
            <QRCode value={UserDetails?._id} height={400} width={400} />
          </div>
        </div>
      </div>
    </div>
  );
}
