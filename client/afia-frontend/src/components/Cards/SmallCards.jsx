// SmallCards.jsx
import React from 'react';

const SmallCards = ({ icon, percentage, value, label }) => {
  return (
    <a className="transform hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white">
      <div className="p-5">
        <div className="flex justify-between">
          <div className={`bg-orange-400 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm`}>
            <span className="flex items-center">{percentage}</span>
          </div>
        </div>
        <div className="ml-2 w-full flex-1">
          <div>
            <div className="mt-3 text-3xl font-bold leading-8">{value}</div>
            <div className="mt-1 text-base text-gray-600">{label}</div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default SmallCards;
