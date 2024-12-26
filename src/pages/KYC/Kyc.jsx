import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../components/Button";
import UserService from "../../services/userServices";
import FrontID from "./Includes/FrontID";
import BackID from "./Includes/BackID";
import Selfie from "./Includes/Selfie";
import KycService from "../../services/KycService";
import Loading from "../../components/Loading/Index";
import { HandleUpdateUser } from "../../redux/action/Auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Kyc = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState(null);
  const [tokenGenerated, setTokenGenerated] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [LivePhotoData, setLivePhotoData] = useState(null);
  const [isStartkyc, setIsStartkyc] = useState(true);
  const [isTokenExits, setIsTokenExits] = useState(false);
  const [isFrontDocUploaded, setIsFrontDocUploaded] = useState(false);
  const [isBackDocUploaded, setIsBackDocUploaded] = useState(false);
  const [isSelfieUplaoded, setIsSelfieUplaoded] = useState(false);

  const [stepKyc, setStepKyc] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(true);

  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);

  const handleLoader = (state) => {
    setIsLoading(state);
  };
  console.log("kyc", isLoading);

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({ data: reader.result, fileName: file.name });
      reader.onerror = (error) => reject(error);
    });
  };

  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const generateToken = (e) => {
    // debugger;
    e.preventDefault();
    if (isFileUploaded) {
      if (isLoading) {
        // Do nothing if a request is already in progress
        return;
      }

      if (!tokenGenerated) {
        setIsLoading(true);
        UserService.generateSdkToken({ clientId: UserData?.complyUserId })
          .then((res) => {
            setTokenData(res);

            KycService.addDoc({
              clientId: UserData.complyUserId,
              type: "passport",
              classification: "proof_of_identity",
              userId: UserData?._id,
            })
              .then((response) => {
                setDocumentData(response);

                setIsTokenExits(true);
                setIsLoading(false);
              })
              .catch((err) => {
                console.log(err);
                setIsTokenExits(false);
                setIsLoading(false);
              });
          })
          .catch((err) => {
            console.log(err);
            setIsTokenExits(false);
            setIsLoading(false);
          });

        setTokenGenerated(true); // Mark token as generated
      }

      setStepKyc(stepKyc + 1);
      setIsFileUploaded(false);
    } else {
      toast.error("File Not uploaded");
    }
  };
  const KycResults = () => {
    if (LivePhotoData) {
      KycService.runCheck({
        clientId: UserData.complyUserId,
        documentId: documentData.id,
        livePhotoId: LivePhotoData.id,
        type: "identity_check",
        userId: UserData?._id,
      })
        .then((res) => {
          KycService.checkResult({ checkId: res.id, userId: UserData?._id })
            .then((ress) => {
              dispatch(HandleUpdateUser(UserData?._id));
              navigate("/kyc-success");
            })
            .catch((Errr) => {
              console.log(Errr);
            });
        })
        .catch((err) => {
          console.log("Error on checkss: ", err);
        });
    } else {
      toast.error("Please upload all documents");
    }
  };

  return (
    <>
      <div
        className="main-content py-4 rounded-2xl pb-[0px] pt-6 px-4"
        style={{ maxHeight: "calc(100vh - 150px)" }}
      >
        <div className="flex flex-col justify-between max-w-[350px] mx-auto">
          <div>
            {stepKyc === 1 && (
              <div className="relative flex flex-col justify-start items-center">
                <h2 className="text-[21px] mt-3 font-bold">
                  Verified Anonymous Identity
                </h2>

                <p className="max-w-[400px]">
                  We'll guide you through a simple process to verify your
                  identity.
                </p>

                <div className="relative">
                  <img
                    width={"90%"}
                    className="m-auto"
                    src={"/images/kyc-main.png"}
                    alt="asdf"
                  />
                </div>
              </div>
            )}

            {stepKyc === 2 && (
              <div className="overflow-hidden max-w-[350px] mx-auto mb-[30px]">
                <div className="px-4 relative flex flex-col justify-start items-center">
                  <h2 className="text-[21px] font-bold">
                    Upload Frontside of card Photo
                  </h2>
                  <div className="bg-[#abadc3] border-2 border-dashed border-[#888ba9] mt-4">
                    <FrontID
                      setFrontImage={setFrontImage}
                      documentID={documentData?.id}
                      setIsFrontDocUploaded={setIsFrontDocUploaded}
                      setIsFileUploaded={setIsFileUploaded}
                      handleLoader={handleLoader}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {stepKyc === 3 && (
              <div className="overflow-hidden">
                <div className="px-4 relative flex flex-col justify-start items-center">
                  <h2 className="text-[21px] mt-3 font-bold">
                    Upload backside of card Photo
                  </h2>
                  <div className="bg-[#abadc3] border-2 border-dashed border-[#888ba9] mt-4">
                    <BackID
                      documentID={documentData?.id}
                      setIsFileUploaded={setIsFileUploaded}
                      required
                      setBackImage={setBackImage}
                      handleLoader={handleLoader}
                      setIsBackDocUploaded={setIsBackDocUploaded}
                    />
                  </div>
                </div>
              </div>
            )}

            {stepKyc === 4 && (
              <div className="bg-[ ] p-4 overflow-hidden">
                <div className="px-4 relative flex flex-col justify-start items-center">
                  <h2 className="text-[21px] mt-3 font-bold">Upload Selfie</h2>
                  <div className=" bg-[#abadc3] border-2 border-dashed border-[#888ba9] mt-4">
                    <Selfie
                      setSelfieImage={setSelfieImage}
                      setIsSelfieUplaoded={setIsSelfieUplaoded}
                      clientId={UserData.complyUserId}
                      handleLoader={handleLoader}
                      setLivePhotoData={setLivePhotoData}
                      setIsFileUploaded={setIsFileUploaded}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {stepKyc === 5 && (
              <div>
                <div className="px-4 relative flex flex-col justify-start items-center">
                  <h2 className="text-[21px] mt-3 font-bold">
                    Thanks for providing your details
                  </h2>
                  <p className="pl-0">Please submit your verification now</p>
                </div>

                <div className="px-4 relative mb-5">
                  <div className="flex justify-start items-center mb-2">
                    <div className="py-2">
                      <img
                        width={"50px"}
                        src={"/images/kyc-done.gif"}
                        alt="asdf"
                      />
                    </div>
                    <p className="py-2 px-2">Document uploaded</p>
                  </div>
                  <div className="flex justify-start items-center mb-2">
                    <div className="py-2">
                      <img
                        width={"50px"}
                        src={"/images/kyc-done.gif"}
                        alt="asdf"
                      />
                    </div>
                    <p className="py-2 px-2">Selfie uploaded</p>
                  </div>
                </div>

                <div className="pb-2 mx-auto w-full">
                  <Button
                    onClick={KycResults}
                    className={
                      "flex items-center justify-center bg-gradient-to-b from-[#202973] to-[#040b47] text-[#fff] font-bold text-[20px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
                    }
                    text={"Submit Verification"}
                    size="55px"
                  />
                </div>
              </div>
            )}

            {stepKyc !== 5 && (
              <div className="pb-2 mx-auto w-full pb-6 px-4 py-5">
                <Button
                  onClick={generateToken}
                  className={
                    "flex items-center justify-center bg-gradient-to-b from-[#202973] to-[#040b47] text-[#fff] font-bold text-[20px] py-2"
                  }
                  text={
                    !isLoading ? (
                      (stepKyc === 1 && "Start Verification") || "Next Step"
                    ) : (
                      <div className="flex items-center	justify-center pt-[6px]">
                        <Loading />
                      </div>
                    )
                  }
                  size="55px"
                />
              </div>
            )}

            {stepKyc !== 1 && stepKyc !== 2 && (
              <div
                className={`pb-2 mx-auto w-full ${
                  stepKyc === 5 ? "mt-5" : "pb-6 px-4"
                }`}
              >
                <Button
                  onClick={() => setStepKyc(stepKyc - 1)}
                  className={
                    "flex items-center justify-center bg-gradient-to-b from-[#202973] to-[#040b47] text-[#fff] font-bold text-[20px] py-2"
                  }
                  text="Back"
                  size="55px"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
    // <div className="bluebg_full flex items-center h-auto min-h-[calc(100vh-149px)]">
    //   <div className="yellowbg_card w-full mx-4">
    //     <div className="main-container flex flex-col justify-center">

    //     </div>
    //   </div>
    // </div>
  );
};

export default Kyc;
