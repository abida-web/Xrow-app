import React from "react";
import GeneralButton from "./GeneralButton";

const LandingNav = () => {
  return (
    <div className=" flex items-center justify-between bg-white py-3 px-25 ">
      <h1 className=" font-semibold text-gray-700 text-lg">Xrow</h1>
      <GeneralButton label="Start for Free" link="/auth/sign-up" />
    </div>
  );
};

export default LandingNav;
