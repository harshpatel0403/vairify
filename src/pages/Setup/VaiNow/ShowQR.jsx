import React from "react";
import { useSelector } from "react-redux";
import QRCode from "react-qr-code";
import PageTitle from "../../../components/PageTitle";
// import { QRCode } from "react-qrcode-logo";

export default function ShowQR() {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  return (
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"QR Code"} />
      </div>
      <div className="w-full mx-auto flex items-center justify-center">
        <div className="flex-1 flex items-center justify-center">
          <QRCode value={UserDetails?._id} height={250} width={250} />
        </div>
      </div>
    </div>
  );
}
