import WideCarousel from "../components/Carousel/WideCarousel";
import CategoryCard from "../components/Cards/CategoryCard";
import { useScrollReveal } from "../utils/useScrollReveal";
import { categories } from "../assets/constants";
import { dine_24, d1, bill2 } from "../assets/images";
import GenButton from "../components/Buttons/GenButton";
import BarChart from "../components/Charts/BarChart";
import PieChart from "../components/Charts/PieChart";
import axios from 'axios';
import { useState } from 'react';



const Home = () => {
  

  useScrollReveal();
  return (
    <div>
      <div className="mt-[5rem]">
        <div className="slide-left">
          <WideCarousel />
        </div>
        <div className="max-container w-4/5 mx-auto mt-[2rem]">
          <hr className="my-4 h-[2px] bg-[#e3dddd] border-0" />
        </div>
        <div className="slide-left">
          <h1 className="flex mb-5 text-col xl:flex-row flex-col justify-center items-center font-palanquin lg:text-3xl sm:text-xl lg:leading-[30px] xl:leading-[40px] lg:pt-10 z-10 sm:pt-20 font-bold text-col slow-fade-in title-bold">
          পাঠকের লেখা গল্প পড়ুন
          </h1>
        </div>
        <div className="center max-container w-4/5 mx-auto mt-[5rem] fade-in-manual opacity-0">
          <CategoryCard categories={categories} />
        </div>
      </div>
      <div className="max-container w-4/5 mx-auto mt-[2rem]">
        <hr className="my-4 h-[2px] bg-[#e3dddd] border-0" />
      </div>
      <div className="relative w-full h-[30rem] mt-[3rem] slide-left slow-fade-in">
        <img
          src={bill2}
          className="w-full h-full "
          alt="Descriptive text"
        />
        <div className="absolute inset-0 flex ml-24 justify-center items-end py-24">
          <GenButton
            text="Get Started"
            bgColor="bg-black"
            textColor="text-white"
            size="py-3 px-8 "
            borderRadius="rounded-lg"
            onClick={() => console.log("Learning more!")}
          />
        </div>
      </div>
      <div className="max-container w-4/5 mx-auto mt-[4rem] flex justify-center gap-8">
      <BarChart />
      <PieChart />
      </div>  
      <div className="max-container w-4/5 mx-auto mt-[2rem]">
        <a href="/ogrobot">
          <button className="bg-black text-white py-3 px-8 rounded-lg">
            Chatbot
          </button>
        </a>
      </div>
      <div className="h-32"></div>
    </div>
  );
};

export default Home;
