import React from "react";
import GeneralButton from "./GeneralButton";

const Hero = () => {
  return (
    <div className=" grid md:grid-cols-2 gap-5 px-10 mt-25">
      <div>
        {" "}
        <h1 className=" text-5xl max-w-sm">Start an online store for free</h1>
        <p className=" mt-5 text-gray-500 text-lg mb-3">
          Xrow is the all-in-one platform to build, run, and grow your online
          boutique. Start free, then get 3 months for $1/month.
        </p>
        <GeneralButton label="Create you store" link="/auth/sign-up" />
      </div>
      <img src={"./hero.JPG"} className="  object-cover md:-mt-25" />
    </div>
  );
};

export default Hero;
