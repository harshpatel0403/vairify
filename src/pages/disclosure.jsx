import Button from "../components/Button";

const Disclosure = () => {
  return (
    <div
      className="bg-[#B9BBCB] rounded-3xl overflow-auto"
      style={{ maxHeight: "calc(100vh - 149px)" }}
    >
      <div className="main-container">
        <div className="w-full pt-5 pb-5">
          <h2 className="text-[20px] text-[#040b47] text-blue-700 md:text-[22px] font-extrabold whitespace-nowrap uppercase">
            Law enforcement disclosure
          </h2>
        </div>
        <h5 className="font-bold text-[18px]">
          Do you have any affiliation with law enforcement?
        </h5>
        <p className="font-bold text-[14px] mt-2">
          Do you have any affiliation with law enforcement?
        </p>
        <div className="flex justify-center font-bold my-3">
          {/* <p className="me-5">[ ] Yes </p>
          <p>[ ] No</p> */}
          <div className="flex items-center me-5">
            <input
              id="default-radio-1"
              type="radio"
              value="Incall"
              // onChange={(e) => setVenue(e.target.value)}
              // checked={venue === "Incall"}
              name="default-radio"
              className="w-[20px] h-[20px]"
            />
            <label
              htmlFor="default-radio-1"
              className="ml-2 text-[18px] font-bold"
            >
              Yes
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="default-radio-2"
              type="radio"
              value="Outcall"
              // onChange={(e) => setVenue(e.target.value)}
              // checked={venue === "Outcall"}
              name="default-radio"
              className="w-[20px] h-[20px]"
            />
            <label
              htmlFor="default-radio-2"
              className="ml-2 text-[18px] font-bold"
            >
              No
            </label>
          </div>
        </div>
        <div className="w-full flex-1 px-4 py-2 mb-4 mx-auto mt-4">
          <div
            className="w-full overflow-y-auto font-bold min-h-[calc(100vh-485px)]"
            style={{
              fontSize: 10.8,
              textAlign: "justify",
              //   height: "22rem",
              backgroundColor: "",
              borderRadius: 0,
            }}
          >
            <p className="max-w-full px-0 text-[#000]">
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
            <p className="mt-2">
              VARIFY#__________________ <br />
              Date:__________________
            </p>
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

          <label className="text-red-500 text-sm flex items-baseline"></label>
          <div>
            <Button
              className={
                "w-auto flex items-center justify-center bg-gradient-to-b from-[#0CA36C] to-[#08FA5A] text-[#01195C] font-black text-[26px] py-2 shadow-[0px_10px_22px_rgba(0,0,0,0.5)] mt-2 max-w-[400px] mx-auto"
              }
              text={"Next >"}
              size="55px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclosure;
