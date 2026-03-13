import React from "react";

const Pagination = ({
  postsPerPage,
  totalPosts,
  paginate,
  currentPage,
  setpostPerPage,
  perPageOptions = [5, 10, "all"],
}) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const pageGroupSize = 5;

  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const goToPreviousGroup = () => {
    if (startPage > 1) paginate(startPage - 1);
  };

  const goToNextGroup = () => {
    if (endPage < totalPages) paginate(endPage + 1);
  };

  const handlePerPageChange = (e) => {
    const value = e.target.value;
    const perPage = value === "all" ? totalPosts : parseInt(value);
    setpostPerPage(perPage);
    paginate(1); // reset to page 1
  };

  return (
    <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
      {/* Pagination Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={goToPreviousGroup}
          disabled={startPage === 1}
          className={`px-3 py-2 rounded-md ${
            startPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          &lt;-
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 rounded-md ${
              number === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={goToNextGroup}
          disabled={endPage === totalPages}
          className={`px-3 py-2 rounded-md ${
            endPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >-&gt;</button>
      </div>

      {/* Items per page dropdown */}
      <div className="text-sm text-white flex items-center">
        <label className="flex items-center">
          Items per page:{" "}
          <select
            className="ml-1 border border-white bg-gray-700 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={postsPerPage >= totalPosts ? "all" : postsPerPage}
            onChange={handlePerPageChange}
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All" : option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default Pagination;