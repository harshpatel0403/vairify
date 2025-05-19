import { useSelector } from "react-redux";
import Button from "../components/Button";
import moment from "moment";
import PageTitle from "../components/PageTitle";

const Disclosure = () => {
  const UserData = useSelector((state) => state?.Auth?.Auth?.data?.user);
  return (
    <div
      className="container"
    >
      <div className="md:mb-0 sm:mb-[30px] mb-[16px]">
        <PageTitle title={"Law Enforcement"} />
      </div>
      <h5 className="text-[16px] text-white">
        Do you have any affiliation with law enforcement?
      </h5>
      <div className="flex sm:justify-center font-bold sm:my-10 my-[16px] text-white">
        <div className="flex items-center gap-[30%]">
          <label class="flex items-center gap-[10px]">
            <input
              id="default-radio-1"
              type="radio"
              value="Incall"
              name="default-radio"
              class="peer hidden"
            // checked={staff?.userType === "admin"}
            // onChange={() => handleChange("userType", "admin")}
            />
            <div class="w-5 h-5 rounded-full border-2 border-white peer-checked:after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-transparent peer-checked:after:bg-[#ffffff] after:mx-auto after:my-auto after:mt-[3px]"></div>
            <span className="text-base font-normal text-white">Yes</span>
          </label>

          <label class="flex items-center gap-[10px]">
            <input
              id="default-radio-2"
              type="radio"
              name="default-radio"
              class="peer hidden"
            // checked={staff?.userType === "staff"}
            // onChange={() => handleChange("userType", "staff")}
            />
            <div class="w-5 h-5 rounded-full border-2 border-white peer-checked:after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-transparent peer-checked:after:bg-[#ffffff] after:mx-auto after:my-auto after:mt-[3px]"></div>
            <span className="text-base font-normal text-white">No</span>
          </label>

        </div>
      </div>
      <div className="w-full flex-1 sm:px-4 py-2 mb-4 mx-auto mt-4 text-white">
        <div
          className="w-full overflow-y-auto min-h-[calc(100vh-485px)]"
          style={{
            fontSize: 10.8,
            textAlign: "justify",
            //   height: "22rem",
            backgroundColor: "",
            borderRadius: 0,
          }}
        >
          <p className="max-w-full text-[14px] px-0 text-white sm:text-center text-left opacity-[0.7]">
            By checking "Yes" on this form, I acknowledge that I am related to
            or affiliated with law enforcement in some capacity. I understand
            that law enforcement affiliation is not prohibited on this dating
            site. In the interest of transparency, I will disclose my
            affiliation to the site and to other users.
            <br />
            By checking "No" on this form, I acknowledge that I have no
            affiliation with law enforcement. By signing this form, I
            acknowledge and agree to the Following:
            <br />
            <ul>
              <li className="flex gap-2">
                <p>1.</p>
                <p>
                  understand that my affiliation or lack thereof may affect
                  how other users perceive me and may impact my ability to
                  connect with others on this VAIRIFY.io site.
                </p>
              </li>
              <li className="flex gap-2">
                <p>2.</p>
                <p>
                  I will conduct myself with honesty and integrity while using
                  this dating site, and I will not use my affiliation (if
                  applicable) for any unlawful or unethical purposes.
                </p>
              </li>
              <li className="flex gap-2">
                <p>3.</p>
                <p>
                  I understand that the dating site has the right to suspend
                  or terminate my account if I violate any terms of this
                  agreement.
                </p>
              </li>
            </ul>
            I hereby acknowledge that I have read and understand the terms of
            this agreement and agree to comply with them.
            <br />
          </p>
          <div className="mt-10 flex flex-col gap-[5%] text-[14px] text-white opacity-[0.7]">
            <p>Vairify #<span className="underline"> {UserData?.vaiID}</span></p>
            <p>Date : <span className="underline"> {moment().format('DD/MM/YYYY')}</span></p>
          </div>
        </div>
      </div>
      <div className="pb-4 mx-0 px-4">
        {/* <div className="flex items-center justify-left mb-1 relative">
            <input
              type="checkbox"
              className="form-checkbox text-indigo-600 h-[28px] w-[28px] focus:outline-none accent-[#50d71e]"
            />
            <label className="ml-4 block font-black text-[12px] text-left text-[#000]">
              I have read the terms and conditions, cookie, and privacy policies
            </label>
          </div> */}

        {/* <label className="text-red-500 text-sm flex items-baseline"></label> */}
        {/* <div>
          <Button
            className={
              "w-auto flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] mt-2 max-w-[400px] mx-auto"
            }
            text={"Next >"}
            size="55px"
          />
        </div> */}
      </div>
    </div>
  );
};

export default Disclosure;
