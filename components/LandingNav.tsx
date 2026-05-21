import React from "react";
import GeneralButton from "./GeneralButton";

const LandingNav = () => {
  return (
    <div className="flex items-center justify-between bg-white py-3 px-16">
      <a href="/">
        <img src={"./logo.PNG"} className="w-30" alt="Company Logo" />
      </a>
      <GeneralButton label="Start for Free" link="/auth/sign-up" />
    </div>
  );
};

export default LandingNav;
