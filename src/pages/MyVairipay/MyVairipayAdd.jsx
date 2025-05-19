import { useState } from "react";
import InputText from "../../components/InputText";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import Button from "../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import VaripayService from "../../services/VaripayServices";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Index";
import Header from "../../components/Header/Header";
import PageTitle from "../../components/PageTitle";

export default function MyVairipayAdd() {
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [stateData, setStateData] = useState();
  const [qrimage, setQrImage] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpload, setIsUpload] = useState(false);

  const HandleData = (event) => {
    setStateData({ ...stateData, [event.target.name]: event.target.value });
  };

  const UploadImage = (event) => {
    setIsUpload(true)
    setQrImage(event.target.files[0]);
    console.log(event.target.files[0]);
    setStateData({
      ...stateData,
      [event.target.name]: URL.createObjectURL(event.target.files[0]),
    });

    if (event.target.files[0]) {
      const imageURL = URL.createObjectURL(event.target.files[0]);
      setShowImage(imageURL);
    }
    setIsUpload(false)
  };

  console.log(state);
  const handelAddVaripay = () => {
    const validationErrors = {};
    if (!stateData?.PaymentID) {
      validationErrors.PaymentID = "PaymentID is required";
    }
    if (!qrimage) {
      validationErrors.qrimage = "QR is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return; // Prevent form submission if there are errors
    }
    // Clear any previous errors
    setError({});
    setIsLoading(true);
    let data = new FormData();
    data.append("userId", UserDetails._id);
    data.append("paymentAppName", state.name);
    data.append("image", qrimage);
    data.append("paymentImage", state.image);
    data.append("paymentLink", state.link);

    VaripayService.addUserVaripay(data)
      .then((res) => {
        console.log(res);
        navigate("/vairipay-qr", {
          state: { image: showImage, state: state },
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  };

  return (
    <div className="container">
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"My Mpay"} />
      </div>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-[24px] mb-[50px]">
        <div className="w-full bg-white flex items-center justify-center sm:rounded-[16px] mx-auto rounded-[8px] sm:h-auto h-[135px]">
          <img
            src={
              import.meta.env.VITE_APP_API_USER_VARIPAY_IMAGE_URL +
              `/${state?.image}`
            }
            alt="Cash App"
          />
        </div>
        <div>
          <InputText
            className="text-[14px] font-normal text-white rounded-[8px] px-[14px] py-[16px] max-h-[54px] !border-[#919EAB33]"
            onChange={HandleData}
            name={"PaymentID"}
            placeholder={' Enter your Payment ID'}
            border={error.PaymentID ? '#ef4444' : '#02227E'}
          />
          {error.PaymentID && (
            <label className="text-red-500 text-xs flex items-baseline pt-[2px]">
              {error.PaymentID}
            </label>
          )}
          <div className="mt-custom-14 w-full">
            <ImageUpload className=""
              type="text"
              buttonName={isUpload ? <Loading /> : "Upload file here"}
              onClick={UploadImage}
              name={"QRCode"}
            />

            {error.qrimage && (
              <label className="text-red-500 text-xs flex items-baseline pt-[2px]">
                {error.qrimage}
              </label>
            )}
          </div>
          <div className="flex-1 mt-8 w-full justify-center flex">
            <Button
              text={
                !isLoading ? (
                  "Upload"
                ) : (
                  <div className="flex items-center	justify-center">
                    <Loading />
                  </div>
                )
              }
              disabled={isLoading}
              onClick={handelAddVaripay}
            />
          </div>
        </div>
      </div>
    </div>
    // <div className="main-container h-full form-field-container flex flex-col justify-between max-w-[510px]">
    //   <div className="w-full mx-auto flex flex-col justify-center items-center pt-10">
    //     <div className="w-full mx-auto flex items-center justify-center mb-5">
    //       <img
    //         src={import.meta.env.BASE_URL + "images/VairipayAddLogo.png"}
    //         alt="Vairipay Add Logo"
    //       />
    //     </div>
    //     <div className="w-full flex items-center justify-center">
    //       <div className="flex items-center justify-center mt-3 w-[199px] h-[180px] bg-[#3760CB] border-2 border-white rounded-xl">
    //         <img
    //           src={
    //             import.meta.env.VITE_APP_API_USER_VARIPAY_IMAGE_URL +
    //             `/${state?.image}`
    //           }
    //           alt="Cash App"
    //         />
    //       </div>
    //     </div>
    //     <div className="flex-1 mt-10 w-full flex flex-col justify-center items-start">
    //       <div className="w-full text-left text-[18px] font-bold">
    //         <span>Enter your Payment ID</span>
    //       </div>
    //       <div className="mt-1 w-full">
    //         <InputText
    //           className="text-[20px] mt-custom-10 rounded-full"
    //           onChange={HandleData}
    //           name={"PaymentID"}
    //           border={error.PaymentID ? '#ef4444' : '#02227E'}
    //         />
    //         {error.PaymentID && (
    //           <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
    //             {error.PaymentID}
    //           </label>
    //         )}
    //       </div>
    //       <div className="mt-custom-25 w-full text-left text-[18px] font-bold">
    //         <span>Upload Your QR Code</span>
    //       </div>
    //       <div className="mt-custom-14 w-full">
    //         <ImageUpload className="rounded-full"
    //           type="text"
    //           buttonName={isUpload ? <Loading /> : "Upload"}
    //           onClick={UploadImage}
    //           name={"QRCode"}
    //         />

    //         {error.qrimage && (
    //           <label className="text-red-500 text-lg flex items-baseline pl-[12px] pt-[2px]">
    //             {error.qrimage}
    //           </label>
    //         )}
    //       </div>
    //     </div>
    //     <div className="flex-1 mt-8 w-full">
    //       {isLoading ? (
    //         <Loading />
    //       ) : (
    //         <Button
    //           onClick={handelAddVaripay}
    //           text="Submit"
    //           className="custom-btn-bg mb-6 bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-bold text-[24px] shadow-[1px_3px_10px_rgba(0,0,0,0.7)]"
    //         />)}
    //     </div>
    //   </div>
    // </div>
  );
}
