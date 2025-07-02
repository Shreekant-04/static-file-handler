import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const Pagination = ({ totalPage, setpage, page }) => {
  const pages = [...Array(totalPage).keys()].map((n) => n + 1);

  const handlePageClick = (num) => {
    if (num >= 1 && num <= totalPage) setpage(num);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6 text-sm font-medium">
      {/* Prev Button */}
      <button
        onClick={() => handlePageClick(page - 1)}
        disabled={page === 1}
        className={`px-3 py-1 rounded-md ${
          page === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-white text-gray-700 border hover:bg-gray-100"
        }`}
      >
        <ChevronLeft />
      </button>

      {/* Page Numbers */}
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => handlePageClick(num)}
          className={`px-3 py-1 rounded-md border ${
            page === num
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {num}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageClick(page + 1)}
        disabled={page === totalPage}
        className={`px-3 py-1 rounded-md ${
          page === totalPage
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-white text-gray-700 border hover:bg-gray-100"
        }`}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
