import WideCarousel from "../components/Carousel/WideCarousel";
import CategoryCard from "../components/Cards/CategoryCard";
import { useScrollReveal } from "../utils/useScrollReveal";
import { categories } from "../assets/constants";
import { dine_24, d1, bill2 } from "../assets/images";
import GenButton from "../components/Buttons/GenButton";
import BarChart from "../components/Charts/BarChart";
import PieChart from "../components/Charts/PieChart";
import axios from 'axios';
import { useState } from "react";
import ShowPdfContent from "./ShowPdfContent";
import ShowPubPost from "./ShowPubPost";



const Home = () => {
  
  // added by me
  const [ searchQuery, setSearchQuery ]=useState('')
  const handleSubmission=async (e)=>{
    e.preventDefault()
    
    if(!searchQuery.trim()) return
    if(isLoading) return
    setIsLoading(true)
  
    try{
        const results=await searchMovies(searchQuery)
        setMovies(results)
    }
    catch(err){
        setError(err.message)
    }
    finally
    {
        setIsLoading(false)
        setSearchQuery("")
        setError(null)
    }
  }


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

        {/* // added by me   */}
          <div className="w-fit p-4 mx-auto">
            <form className="flex flex-row gap-3" onSubmit={handleSubmission}>
              <input type="text" 
              placeholder="search for a PDF and user" 
              className="bg-slate-100 p-2 border border-black rounded-lg"
              value={searchQuery}
              onChange={(e)=>{
                  setSearchQuery(e.target.value)
              }}
              />
              <button type="submit" className="p-2 bg-black text-white rounded-lg">search</button>
              {/* <p>{searchQuery}</p> */}
            </form>
          </div>


        </div>
        <div className="center max-container w-4/5 mx-auto mt-[5rem] fade-in-manual opacity-0">
          <ShowPubPost />
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
          <a href="/achat">
           <button className="bg-black text-white py-3 px-8 rounded-lg">
            Get Started</button>
          </a>
        </div>
      </div>
      {/* <div className="max-container w-4/5 mx-auto mt-[4rem] flex justify-center gap-8">
      <BarChart />
      <PieChart />
      </div>  
      <div className="max-container w-4/5 mx-auto mt-[2rem]">
        <a href="/ogrobot">
          <button className="bg-black text-white py-3 px-8 rounded-lg">
            Chatbot
          </button>
        </a>
      </div> */}
      <div className="h-32"></div>
    </div>
  );
};

export default Home;
