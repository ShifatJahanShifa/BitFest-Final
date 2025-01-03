import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Books } from "./index";
import { useScrollReveal } from "../utils/useScrollReveal";

const CategoryDetail = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  useScrollReveal;

  const renderComponent = () => {
    console.log("selectedOption", selectedOption);
    switch (selectedOption) {
      case "Books":
        //   return <Books />;
        // case "CH4":
        //   return <CH4 />;
        // case "Fluorinates":
        //   return <Fluorinates />;
        // case "VideoPlayer":
        //   return <VideoPlayer />;
        default:
          return <Books />;
    }
  };

  const toggleDropdown = (option) => {
    setOpenDropdown((prevOption) => (prevOption === option ? null : option));
  };

  const handleIconClick = (iconType) => {
    console.log(`Icon clicked: ${iconType}`);
    // Add specific logic here for each icon type
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: 'url("bg.jpg")',
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <aside
        className="bg-[#de755a] text-white w-64 p-4 offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <nav>
          <ul className="space-y-2">
            <li className="opcion-con-desplegable">
              <div
                className="flex items-center justify-between p-2 hover:bg-[#e09a82] cursor-pointer"
                onClick={() => toggleDropdown("contabilidad")}
              >
                <div className="flex items-center">
                  <i className="fas fa-solid fa-earth-americas mr-2"></i>
                  <span>Books</span>
                </div>
                <i
                  className={`fas fa-chevron-down transition-transform duration-200 ${
                    openDropdown === "contabilidad" ? "rotate-180" : ""
                  }`}
                ></i>
              </div>
              {openDropdown === "contabilidad" && (
                <ul className="ml-4">
                  <li
                    className="block p-2 hover:bg-[#e09a82] cursor-pointer"
                    onClick={() => setSelectedOption("VideoPlayer")}
                  >
                   More resourse
                  </li>
                </ul>
              )}
            </li>

            <li className="opcion-con-desplegable">
              <div
                className="flex items-center justify-between p-2 hover:bg-[#e09a82] cursor-pointer"
                onClick={() => toggleDropdown("agenda")}
              >
                <div className="flex items-center">
                  <i className="fas fa-solid fa-gas-pump mr-2"></i>
                  <span>Video Material</span>
                </div>
                <i
                  className={`fas fa-chevron-down transition-transform duration-200 ${
                    openDropdown === "agenda" ? "rotate-180" : ""
                  }`}
                ></i>
              </div>
              {openDropdown === "agenda" && (
                <ul className="ml-4">
                  <li
                    className="block p-2 hover:bg-[#e09a82] cursor-pointer"
                    onClick={() => setSelectedOption("CO2")}
                  >
                    Carbon Dioxide
                  </li>
                  <li
                    className="block p-2 hover:bg-[#e09a82] cursor-pointer"
                    onClick={() => setSelectedOption("CH4")}
                  >
                    Methane
                  </li>
                  <li
                    className="block p-2 hover:bg-[#e09a82] cursor-pointer"
                    onClick={() => setSelectedOption("Fluorinates")}
                  >
                    Fluorinates
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 min-h-screen overflow-hidden">{renderComponent()}</main>

      {/* Fixed Circular Icons */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-4">
        <button
          className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition duration-200"
          onClick={() => handleIconClick("icon1")}
        >
          <i className="fas fa-info"></i>
        </button>
        <button
          className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:bg-green-600 transition duration-200"
          onClick={() => handleIconClick("icon2")}
        >
          <i className="fas fa-question"></i>
        </button>
        <button
          className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition duration-200"
          onClick={() => handleIconClick("icon3")}
        >
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </div>
  );
};

export default CategoryDetail;
