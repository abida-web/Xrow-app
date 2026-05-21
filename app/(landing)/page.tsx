import Hero from "@/components/Hero";
import LandingNav from "@/components/LandingNav";
import React from "react";
import { boutiqueLogos } from "../constants/logos";
import Services from "@/components/Services";
import {
  Headphones,
  AppWindow,
  GraduationCap,
  Users,
  type LucideIcon,
} from "lucide-react";
import { serviceCards } from "../constants/services";
import FAQ from "@/components/FAQ";
import GeneralButton from "@/components/GeneralButton";
const Home = () => {
  const iconMap: Record<string, LucideIcon> = {
    Headphones: Headphones,
    AppWindow: AppWindow,
    GraduationCap: GraduationCap,
    Users: Users,
  };
  return (
    <div>
      <LandingNav />
      <div className="lg:px-15">
        <Hero />
        <section>
          <h1 className="mt-5 text-xl sm:text-3xl  text-center">
            Powering millions of businesses worldwide
          </h1>
          <div className="flex items-center gap-5 flex-wrap mt-7 justify-center">
            {boutiqueLogos.map((logo) => (
              <div
                key={logo.name}
                className="opacity-70 hover:opacity-100 transition-opacity duration-300"
                dangerouslySetInnerHTML={{ __html: logo.svg }}
              />
            ))}
          </div>
        </section>
      </div>
      <Services />
      <section className="my-25 px-5 md:px-15">
        <h1 className="text-2xl sm:text-3xl md:text-5xl max-w-lg md:max-w-2xl  mb-10">
          The global platform for reliable commerce
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-gray-100 p-6 md:p-8 rounded-xl hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-3xl md:text-4xl mb-2 text-[#06102c]">
              $1.1+ trillion
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Total sales through Xrow worldwide.
            </p>
          </div>

          <div className="bg-gray-100 p-6 md:p-8 rounded-xl hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-3xl md:text-4xl  mb-2 text-[#06102c]">
              175+ countries
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              With businesses powered by Shopify.
            </p>
          </div>
        </div>
      </section>
      <section className=" md:px-15 mb-15">
        {" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.map((card) => {
            const Icon = iconMap[card.iconName];
            return (
              <div
                key={card.id}
                className="flex flex-col items-center text-center rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-blue-400"
              >
                <div className="w-16 h-1bg-[#3a4665] rounded-full flex items-center justify-center mb-4  transition-colors duration-300">
                  <Icon className="w-8 h-8 text-gray-400 hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold mb-2 ">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      <FAQ />
      <section className=" flex flex-col items-center">
        <h1 className=" text-center mt-15 text-2xl sm:text-3xl md:text-5xl">
          Xrow. Where Brands Grow
        </h1>
        <div className="mt-5 pl-10 py-2 pr-2 rounded-full border border-gray-400">
          <input type="text" placeholder="Enter Your Email" />
          <GeneralButton label="Subscribe" />
        </div>
        <p className=" p-3 text-sm text-gray-500">
          you agree to receive Shopify marketing emails.
        </p>
      </section>

      <footer className="bg-[#06102c] text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} Your Company Name. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
