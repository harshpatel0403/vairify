import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../components/Button";
import UserService from "../../services/userServices";
import FrontID from "./Includes/FrontID";
import BackID from "./Includes/BackID";
import Selfie from "./Includes/Selfie";
import KycService from "../../services/KycService";
import Loading from "../../components/Loading/Index";
import { HandleUpdateUser, isKycCompletedStatus } from "../../redux/action/Auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { countries } from "../../db/countries";
import BackButton from "../../components/BackButton/backArrowButton";

const documentTypes = [
  "Passport",
  "Driving license",
  "National iddentity card",
  "National insurance number",
  "Social security number",
  "Tax identification number",
  "Visa",
  "Polling card",
  "Health cards",
  "Residence permit",
  "Birth certificate",
  "Utility bill",
  "Bank statement",
  "Change of name",
  "Tax document",
  "Company confirmation statement",
  "Company annual accounts",
  "Company statement of capital",
  "Company change of address",
  "Company incorporation",
  "Company change of officers",
  "Company change of beneficial owners",
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
  const [classification, setClassification] = useState("");

  const [frontImageUploaded, setFrontImageUploaded] = useState(false);
  const [backImageUploaded, setBackImageUploaded] = useState(false);
  const maxVerificationAttempts = 3;

  const handleLoader = (state) => {
    setIsLoading(state);
  };

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
      if (!type || !issuingCountry || !classification) {
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
    if (!documentCheckId) {
      throw new Error(`DocumentCheckId Not Found`);
    }
    const maxAttempts = 300;
    const interval = 3000;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      try {
        const response = await KycService.DocCheckstatus(documentCheckId);
        const holderDetails = response?.result?.breakdown?.extractedData?.holderDetails;

        if (response?.status === "complete") {
          const firstName = holderDetails?.firstName;
          const lastName = holderDetails?.lastName;
          const dob = holderDetails?.dob;
          const age = holderDetails?.age;
          const isFirstNameValid = Array.isArray(firstName) && firstName.length > 0;
          const isLastNameValid = Array.isArray(lastName) && lastName.length > 0;
          const isDobValid = dob && dob.day && dob.month && dob.year;
          const isAgeValid = typeof age === 'number' || (typeof age === 'string' && age !== '');
          if (!isFirstNameValid || !isLastNameValid || (!isDobValid && !isAgeValid)) {
            throw new Error(
              "Incomplete document data: first name, last name, and either date of birth or age must be provided."
            );
          }
          return;
        } else if (response?.status === "failed") {
          localStorage.setItem('kycStatus', response?.status);
          throw new Error("Document Check Failed");
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
      } catch (error) {
        throw new Error("Document Checkstatus Error ", error.message || error);
        // console.error("Error checking document status:", error);
      }
    }
    throw new Error("Document validation timed out. Please try again.");
  };

  const pollCheckResult = async (checkId, userId) => {
    if (!checkId || !userId) {
      throw new Error(`CheckId and UserId Not Found`);
    }
    const maxAttempts = 300;
    const interval = 3000;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      try {
        const data = {
          checkId: checkId,
          userId: userId,
        }

        const response = await dispatch(isKycCompletedStatus(data));
        const livenessCheckScore = response?.kycStatus?.result?.breakdown?.authenticityAnalysis?.breakdown?.livenessCheckScore
        localStorage.setItem("kycStatus", response?.kycStatus?.status);
        if (typeof livenessCheckScore === "number" && livenessCheckScore < 30) {
          throw new Error("Liveness check score too low");
        }

        if (response?.kycStatus?.status === "complete") {
          // if (response?.kycStatus?.result?.outcome === "clear") {
          return;
          // }
        } else if (response?.kycStatus?.status === "failed") {
          throw new Error("Identity Check Failed");
        }
        else if (response?.kycStatus?.status === "pending") {
          await new Promise((resolve) => setTimeout(resolve, interval));
        }
        else {
          throw new Error("Identity Check Failed");
        }

      } catch (error) {
        throw new Error(`CheckResult Error: ${error.message || error}`);
      }
    }
    throw new Error("Polling check result timed out after maximum attempts.");
  };

  const KycResults = async () => {
    if (!LivePhotoData) {
      toast.error("Please upload all documents", { autoClose: 2000 });
      return;
    }

    if (UserDetails?.checkCount >= maxVerificationAttempts) {
      setKycStatus(true)
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
        userId: UserData?._id,
      });

      if (!validationResponse?.id) {
        throw new Error("Document validation failed. Please try again.");
      }

      await pollDocumentStatus(validationResponse.id);

      const checkResponse = await KycService.runCheck({
        clientId: UserData.complyUserId,
        documentId: documentData.id,
        livePhotoId: LivePhotoData.id,
        type: "identity_check",
        userId: UserData?._id,
      });

      await pollCheckResult(checkResponse.id, UserData?._id);

      toast.success("Verification completed successfully", { autoClose: 2000 });
      navigate('/self-verification-completed')
    } catch (error) {
      console.error("Error in KYC process:", error);
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
      let kycCheckCount = 0;
      localStorage.setItem("kycCheckCount", kycCheckCount + 1);
      //   dispatch(HandleUpdateUser(UserData?._id));
      setIsLoading(false);
    }
  };

  const RestartVerification = () => {
    setStepKyc(1);
    setIsFileUploaded(true);
    setKycStatus(false);
    setIsLoading(false);
    setTokenGenerated(false);
    setDocumentData(null);
    setLivePhotoData(null);
    setType("")
    setIssuingCountry("")
    setClassification("")
  };

  return (
    <>
      <div className="">
        <div className="container">
          <div className="relative">
            <div className="backnavigation"><BackButton /></div>
            <div className="logo-img-container mt-[20px]">
              <img src="/images/signup/logo.svg" className="sm:flex hidden" alt="img" />
              <img src="/images/signup/mobile-logo.svg" className="sm:hidden flex" alt="img" />
            </div>

            <div>
              <div className="flex flex-col justify-between sm:mt-[64px] mt-[32px]">
                <div>
                  {stepKyc === 1 && (
                    <div className="flex items-center justify-center sm:flex-nowrap flex-wrap gap-[64px]">
                      <div>
                        <img
                          className="sm:w-[100%] w-[80%] mx-auto"
                          src={"/images/face-verification/verification.svg"}
                          alt="asdf"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-center pb-[24px]">
                          <img
                            src={"/images/face-verification/VAI.svg"}
                            alt="asdf"
                          />
                        </div>
                        <h2 className="sm:text-[24px] text-[18px] text-white font-semibold text-center">
                          Verified Anonymous Identity
                        </h2>

                        <p className="text-[14px] text-white font-normal opacity-80 text-center">
                          We&apos;ll guide you through a simple process to verify your
                          identity.
                        </p>
                      </div>
                    </div>
                  )}

                  {stepKyc === 2 && (
                    <div className="mx-auto p-4 border-none">
                      <h2 className="sm:text-[24px] text-[18px] text-white font-semibold mb-2">
                        Select Document
                      </h2>
                      <p className="sm:text-[18px] text-[16px] text-white font-normal opacity-70 sm:w-[80%] w-[100%]">
                        To proceed with your application, we need to verify your information. Please choose and submit the required document to continue.
                      </p>
                      <form className="grid sm:grid-cols-2 grid-cols-1 gap-[20px] mt-[24px]">
                        <div className=" relative">
                          <select
                            id="type"
                            className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[16px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                            required
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                          >
                            <option value="" className="text-black">Select Type</option>
                            {documentTypes.map((type) => (
                              <option
                                className="text-black"
                                key={type}
                                value={type.replace(/\s+/g, "_").toLowerCase()}
                              >
                                {type}
                              </option>
                            ))}
                          </select>
                          <div
                            style={{ top: "2px" }}
                            className={` border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent`}
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.0004 12.9177C9.8057 12.9181 9.61701 12.8503 9.46708 12.726L4.46708 8.55938C4.1127 8.26482 4.06419 7.73876 4.35874 7.38438C4.6533 7.02999 5.17936 6.98149 5.53374 7.27604L10.0004 11.0094L14.4671 7.40938C14.6392 7.26957 14.86 7.20415 15.0806 7.22761C15.3011 7.25107 15.5032 7.36148 15.6421 7.53438C15.7964 7.70759 15.8715 7.93727 15.8493 8.16817C15.8272 8.39908 15.7098 8.6103 15.5254 8.75104L10.5254 12.776C10.3712 12.8806 10.1863 12.9305 10.0004 12.9177Z" fill="#919EAB" />
                            </svg>

                          </div>
                        </div>

                        <div className=" relative">
                          <select
                            id="country"
                            className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[16px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                            required
                            value={issuingCountry}
                            onChange={(e) => setIssuingCountry(e.target.value)}
                          >
                            <option value="" className="text-black">Select Country</option>
                            {countries.map((country) => (
                              <option className="text-black" key={country.code} value={country.code}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                          <div
                            style={{ top: "2px" }}
                            className={` border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent`}
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.0004 12.9177C9.8057 12.9181 9.61701 12.8503 9.46708 12.726L4.46708 8.55938C4.1127 8.26482 4.06419 7.73876 4.35874 7.38438C4.6533 7.02999 5.17936 6.98149 5.53374 7.27604L10.0004 11.0094L14.4671 7.40938C14.6392 7.26957 14.86 7.20415 15.0806 7.22761C15.3011 7.25107 15.5032 7.36148 15.6421 7.53438C15.7964 7.70759 15.8715 7.93727 15.8493 8.16817C15.8272 8.39908 15.7098 8.6103 15.5254 8.75104L10.5254 12.776C10.3712 12.8806 10.1863 12.9305 10.0004 12.9177Z" fill="#919EAB" />
                            </svg>

                          </div>
                        </div>

                        <div className=" relative">
                          <select
                            id="purpose"
                            className="appearance-none w-full border-2 border-[#919EAB33] rounded-[8px] py-[16px] px-[14px] bg-transparent text-white font-normal text-[14px]"
                            required
                            value={classification}
                            onChange={(e) => setClassification(e.target.value)}
                          >
                            <option className="text-black" value="">Select Classification</option>
                            {purposes.map((purpose) => (
                              <option
                                className="text-black"
                                key={purpose}
                                value={purpose.replace(/\s+/g, "_").toLowerCase()}
                              >
                                {purpose}
                              </option>
                            ))}
                          </select>
                          <div
                            style={{ top: "2px" }}
                            className={` border-[#CFCFCF] border-t-0 border-r-0 border-b-0 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-transparent`}
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.0004 12.9177C9.8057 12.9181 9.61701 12.8503 9.46708 12.726L4.46708 8.55938C4.1127 8.26482 4.06419 7.73876 4.35874 7.38438C4.6533 7.02999 5.17936 6.98149 5.53374 7.27604L10.0004 11.0094L14.4671 7.40938C14.6392 7.26957 14.86 7.20415 15.0806 7.22761C15.3011 7.25107 15.5032 7.36148 15.6421 7.53438C15.7964 7.70759 15.8715 7.93727 15.8493 8.16817C15.8272 8.39908 15.7098 8.6103 15.5254 8.75104L10.5254 12.776C10.3712 12.8806 10.1863 12.9305 10.0004 12.9177Z" fill="#919EAB" />
                            </svg>

                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {stepKyc === 3 && (
                    <div className="overflow-hidden mx-auto mb-[30px]">
                      <div className="px-4 relative flex flex-col justify-start items-center">
                        <h2 className="lg:text-[28px] sm:text-2xl text-xl font-bold text-white lg:text-left text-center">
                          Upload Frontside of card Photo
                        </h2>
                        <div className="mt-4">
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
                        <h2 className="lg:text-[28px] sm:text-2xl text-xl font-bold text-white lg:text-left text-center">
                          Upload backside of card Photo
                        </h2>
                        <div className="mt-4">
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
                    <div className="">
                      <div className="px-4 relative flex flex-col justify-start items-center">
                        <h2 className="lg:text-[28px] sm:text-2xl text-xl font-bold text-white lg:text-left text-center">Upload Selfie</h2>
                        <div className="">
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
                      <div>
                        <h2 className="sm:text-[24px] text-[18px] mt-3 font-semibold text-white">
                          Submit Document
                        </h2>
                        <p className="text-white sm:text-[16px] text-[14px] font-normal opacity-80">Thanks for providing your details. Please submit your verification now</p>
                      </div>

                      <div className="bg-[#FFFFFF14] sm:py-[6px] py-[4px] sm:px-[14px] px-[12px] rounded-[8px] mt-[24px] flex items-center justify-between">
                        <div className="flex items-center gap-2"><img src={"/images/face-verification/user-face.svg"} alt="asdf" /><p className="font-normal text-[14px] text-white">User Photo</p> </div>
                        <div className="py-2">
                          <img
                            width={"41px"}
                            src={"/images/kyc-done.gif"}
                            alt="asdf"
                          />
                        </div>
                      </div>
                      <div className="bg-[#FFFFFF14] sm:py-[6px] py-[4px] sm:px-[14px] px-[12px] rounded-[8px] mt-[24px] flex items-center justify-between">
                        <div className="flex items-center gap-2"><img src={"/images/face-verification/card.svg"} alt="asdf" /><p className="font-normal text-[14px] text-white">ID</p></div>
                        <div className="py-2">
                          <img
                            width={"41px"}
                            src={"/images/kyc-done.gif"}
                            alt="asdf"
                          />
                        </div>
                      </div>

                      <div id="verification-button" className="max-w-[500px] flex items-center justify-center mx-auto w-full mt-[24px]">
                        <Button
                          onClick={kycstatus ? RestartVerification : KycResults}
                          disabled={isLoading}
                          text={
                            !isLoading ? (
                              kycstatus ? (
                                "Restart Verification"
                              ) : (
                                "Submit Verification"
                              )
                            ) : (
                              <div className="flex items-center justify-center">
                                <Loading />
                              </div>
                            )
                          }
                          size="55px"
                        />
                      </div>
                    </div>
                  )}

                  {stepKyc !== 6 && (
                    <>
                      <div className="max-w-[500px] flex items-center justify-center mx-auto mt-[32px]">
                        <Button
                          onClick={UserDetails?.checkCount < maxVerificationAttempts ? stepKyc === 2 ? NextStep : NextStep : ""}
                          disabled={isLoading}
                          text={
                            !isLoading ? (
                              (stepKyc === 1 && "Start Verification" || "Next Step")
                            ) : (
                              <div className="flex items-center	justify-center">
                                <Loading />
                              </div>
                            )
                          }
                          size="55px"
                        />
                        {UserDetails?.checkCount >= maxVerificationAttempts ? (
                          <p className="text-red-500 text-center font-bold">
                            You&apos;ve reached the maximum number of attempts. Please
                            Contact us.
                          </p>) :
                          ("")
                        }

                      </div>

                    </>
                  )}

                  {stepKyc !== 1 && stepKyc !== 2 && (
                    <div
                      className={`max-w-[500px] flex items-center justify-center mx-auto mt-[24px] mb-[50px] ${stepKyc === 6 ? "mt-5" : ""
                        }`}
                    >
                      <Button
                        onClick={() => setStepKyc(stepKyc - 1)}
                        text="Back"
                      />
                    </div>
                  )}

                  <div className="mt-[20px] mb-[40px]">
                    <p className="text-[16px] text-white font-normal text-center">
                      {`Attempt${parseInt(localStorage.getItem("kycCheckCount"), 10) == 1 ? '' : 's'} - ${parseInt(localStorage.getItem("kycCheckCount") || 0, 10)} / ${maxVerificationAttempts}`}{` `}
                      {`( ${maxVerificationAttempts - (parseInt(localStorage.getItem("kycCheckCount"), 10) || 0)} Attempts left  )`}
                    </p>
                    {localStorage.getItem("kycStatus") && <p className="text-[16px] text-white font-normal text-center mt-[10px]">
                      KYC Status - {localStorage.getItem("kycStatus")}
                    </p>}
                  </div>
                </div>
              </div>
            </div>
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
