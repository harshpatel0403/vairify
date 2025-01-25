import { useEffect, useRef, useState } from "react";
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
import { countries } from "../../db/countries";

const documentTypes = [
  "Passport",
  "Driving license",
  "National id cards",
  "National insurance number",
  "Social security cards",
  "Tax identification number",
  "Visas",
  "Polling card",
  "Health cards",
  "Residence permits",
  "Birth certificates",
  "Utility bills",
  "Bank statements",
  "Change of name",
  "Text document",
  "Company confirmation statement",
  "Company annual accounts",
  "Company statement of capital",
  "Company change of address",
  "Company incorporation",
  "Change of officers",
  "Change of beneficial owners",
  "Unknown",
  "Other"
];

const purposes = [
  "Proof of identity",
  "Proof of address",
  "Source of wealth",
  "Source of funds",
  "Company filing",
];

const Kyc = () => {
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  const navigate = useNavigate();
  const [tokenGenerated, setTokenGenerated] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [LivePhotoData, setLivePhotoData] = useState(null);
  const [stepKyc, setStepKyc] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(true);
  const [kycstatus, setKycStatus] = useState(false);

  const [type, setType] = useState("");
  const [issuingCountry, setIssuingCountry] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [classification, setClassification] = useState("");

  const [frontImageUploaded, setFrontImageUploaded] = useState(false);
  const [backImageUploaded, setBackImageUploaded] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const maxVerificationAttempts = 3;

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

  const NextStep = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    if (stepKyc === 2) {
      if (!type || !issuingCountry || !idNumber || !classification) {
        toast.error("Please fill out all fields before proceeding", {
          autoClose: 1000,
        });
        return;
      }

      setIsLoading(true);

      try {
        await UserService.generateSdkToken({
          clientId: UserData?.complyUserId,
        });
        const response = await KycService.addDoc({
          clientId: UserData.complyUserId,
          type,
          classification,
          issuingCountry,
          idNumber,
          userId: UserData?._id,
        });
        setDocumentData(response);
        setTokenGenerated(true);
        setStepKyc(stepKyc + 1);
        setIsFileUploaded(false);
      } catch (err) {
        toast.error(
          `Error: Unable to proceed with verification. ${err?.message}`,
          {
            autoClose: 1000,
          }
        );
        console.log("Error in generateToken:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      if (isFileUploaded) {
        setStepKyc(stepKyc + 1);
        setIsFileUploaded(false);
      } else {
        toast.error("Please upload the required files before proceeding", {
          autoClose: 1000,
        });
      }
    }
  };

  const pollDocumentStatus = async (documentCheckId) => {
    const maxAttempts = 200;
    const interval = 5000;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      try {
        const { status } = await KycService.DocCheckstatus(documentCheckId);
        if (status === "complete") {
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
      } catch (error) {
        console.error("Error checking document status:", error);
      }
    }

    throw new Error("Document validation timed out. Please try again.");
  };

  const KycResults = async () => {
    if (!LivePhotoData) {
      toast.error("Please upload all documents", { autoClose: 2000 });
      return;
    }

    if (verificationAttempts >= maxVerificationAttempts) {
      toast.error(
        "You've reached the maximum number of attempts. Please restart verification.",
        { autoClose: 2000 }
      );
      return;
    }
    setIsLoading(true);

    try {
      const validationResponse = await KycService.validateDocument({
        documentType: type,
        clientId: UserData.complyUserId,
        documentId: documentData.id,
        idNumber,
        userId: UserData?._id,
      });

      if (!validationResponse?.id) {
        throw new Error("Document validation failed. Please try again.");
      }

      const [_, checkResponse] = await Promise.all([
        pollDocumentStatus(validationResponse.id),
        KycService.runCheck({
          clientId: UserData.complyUserId,
          documentId: documentData.id,
          livePhotoId: LivePhotoData.id,
          type: "identity_check",
          userId: UserData?._id,
        }),
      ]);

      await KycService.checkResult({
        checkId: checkResponse.id,
        userId: UserData?._id,
      });

      dispatch(HandleUpdateUser(UserData?._id));
      toast.success("Verification completed successfully", { autoClose: 2000 });
    } catch (error) {
      console.error("Error in KYC process:", error);
      setVerificationAttempts((prev) => prev + 1);
      toast.error(
        `Error in verification process: ${error.message || error.response?.data
        }. Please click 'Restart Verification' to try again.`,
        { autoClose: 3000 }
      );
      setKycStatus(true);
      document
        .getElementById("verification-button")
        ?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setIsLoading(false);
    }
  };

  const RestartVerification = () => {
    setVerificationAttempts(0);
    setStepKyc(1);
    setIsFileUploaded(true);
    setKycStatus(false);
    setIsLoading(false);
    setTokenGenerated(false);
    setDocumentData(null);
    setLivePhotoData(null);
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
              <div className="mx-auto p-4 border-none">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-left"
                    >
                      TYPE*
                    </label>
                    <select
                      id="type"
                      className="w-full border rounded-lg p-2"
                      required
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      {documentTypes.map((type) => (
                        <option
                          key={type}
                          value={type.replace(/\s+/g, "_").toLowerCase()}
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-left"
                    >
                      ISSUING COUNTRY
                    </label>
                    <select
                      id="country"
                      className="w-full border rounded-lg p-2"
                      required
                      value={issuingCountry}
                      onChange={(e) => setIssuingCountry(e.target.value)}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="id-number"
                      className="block text-sm font-medium text-left"
                    >
                      ID NUMBER
                    </label>
                    <input
                      id="id-number"
                      type="text"
                      placeholder="Document number"
                      className="w-full border rounded-lg p-2"
                      required
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="purpose"
                      className="block text-sm font-medium text-left"
                    >
                      PURPOSE
                    </label>
                    <select
                      id="purpose"
                      className="w-full border rounded-lg p-2"
                      required
                      value={classification}
                      onChange={(e) => setClassification(e.target.value)}
                    >
                      <option value="">Select Classification</option>
                      {purposes.map((purpose) => (
                        <option
                          key={purpose}
                          value={purpose.replace(/\s+/g, "_").toLowerCase()}
                        >
                          {purpose}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
            )}

            {stepKyc === 3 && (
              <div className="overflow-hidden max-w-[350px] mx-auto mb-[30px]">
                <div className="px-4 relative flex flex-col justify-start items-center">
                  <h2 className="text-[21px] font-bold">
                    Upload Frontside of card Photo
                  </h2>
                  <div className="bg-[#abadc3] border-2 border-dashed border-[#888ba9] mt-4">
                    <FrontID
                      documentID={documentData?.id}
                      // setIsFrontDocUploaded={setIsFrontDocUploaded}
                      setIsFileUploaded={setIsFileUploaded}
                      handleLoader={handleLoader}
                      required
                      setFrontImageUploaded={setFrontImageUploaded}
                    />
                  </div>
                </div>
              </div>
            )}

            {stepKyc === 4 && (
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
                      handleLoader={handleLoader}
                      setBackImageUploaded={setBackImageUploaded}
                    />
                  </div>
                </div>
              </div>
            )}

            {stepKyc === 5 && (
              <div className="bg-[ ] p-4 overflow-hidden">
                <div className="px-4 relative flex flex-col justify-start items-center">
                  <h2 className="text-[21px] mt-3 font-bold">Upload Selfie</h2>
                  <div className=" bg-[#abadc3] border-2 border-dashed border-[#888ba9] mt-4">
                    <Selfie
                      // setIsSelfieUplaoded={setIsSelfieUplaoded}
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

            {stepKyc === 6 && (
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

                <div id="verification-button" className="pb-2 mx-auto w-full">
                  {verificationAttempts >= maxVerificationAttempts ? (
                    <p className="text-red-500 text-center font-bold">
                      You've reached the maximum number of attempts. Please
                      restart verification.
                    </p>
                  ) : (
                    <Button
                      onClick={kycstatus ? RestartVerification : KycResults}
                      className={
                        "flex items-center justify-center bg-gradient-to-b from-[#202973] to-[#040b47] text-[#fff] font-bold text-[20px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)]"
                      }
                      text={
                        !isLoading ? (
                          kycstatus ? (
                            "Restart Verification"
                          ) : (
                            "Submit Verification"
                          )
                        ) : (
                          <div className="flex items-center justify-center pt-[6px]">
                            <Loading />
                          </div>
                        )
                      }
                      size="55px"
                    />
                  )}
                </div>
              </div>
            )}

            {stepKyc !== 6 && (
              <div className="pb-2 mx-auto w-full pb-6 px-4 py-5">
                <Button
                  onClick={stepKyc === 2 ? NextStep : NextStep}
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

            {stepKyc !== 1 && stepKyc !== 3 && (
              <div
                className={`pb-2 mx-auto w-full ${stepKyc === 6 ? "mt-5" : "pb-6 px-4"
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
