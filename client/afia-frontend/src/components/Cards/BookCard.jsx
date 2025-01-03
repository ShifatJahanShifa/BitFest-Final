import React from "react";
import { useNavigate } from "react-router-dom";
import { books } from './books';
import { useScrollReveal } from "../../utils/useScrollReveal";

const BookCard = () => {
  const navigate = useNavigate();
  useScrollReveal();

  const handleCardClick = (pdfUrl) => {
    window.open(pdfUrl, '_blank'); // Open the PDF in a new tab
  };

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="cursor-pointer group relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-[40rem] hover:shadow-lg transition-shadow duration-300"
          onClick={() => handleCardClick(book.pdf)}
        >
          <div className="relative h-50 m-2.5 overflow-hidden rounded-md">
            <img
              className="transition-transform duration-500 ease-in-out transform group-hover:scale-110"
              src={book.image}
              alt={book.name}
            />
          </div>

          <div className="p-4">
            <h6 className="mb-2 text-slate-800 text-xl font-semibold">
              {book.name}
            </h6>
            <p className="text-gray-600 text-sm mt-1">Topic: {book.topic}</p>
          </div>

          <div className="px-4 pb-4 pt-0 mt-2">
            <button
              className="rounded-md bg-slate-800 py-2 px-4 text-white mt-2 transition-all hover:bg-slate-700"
              type="button"
            >
              Open PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookCard;
