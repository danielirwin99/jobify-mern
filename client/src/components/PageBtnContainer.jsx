import React from "react";
import { useAppContext } from "../context/appContext";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";

const PageBtnContainer = () => {
  const { numOfPages, page, changePage } = useAppContext();

  // Using the Array.from method we can map over the array go to the next iteration
  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1;
  });

  //  Lets us click the previous page on the button
  const prevPage = () => {
    // Goes to the previous page
    let newPage = page - 1;
    // If our current page is less than the first page (1)
    if (newPage < 1) {
      newPage = numOfPages;
    }
    changePage(newPage);
  };

  //  Lets us click the next page on the button
  const nextPage = () => {
    // Lets go from page 1 - 2 - 3 and so on
    let newPage = page + 1;
    // If our page is greater than the last page
    if (newPage > numOfPages) {
      newPage = 1;
    }
    changePage(newPage);
  };

  return (
    <Wrapper>
      <button className="prev-btn" onClick={prevPage}>
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">
        {pages.map((pageNumber) => {
          return (
            <button
              type="button"
              // Check if the page = PageNumber --> change the class on that active page
              className={pageNumber === page ? "pageBtn active" : "pageBtn"}
              key={pageNumber}
              onClick={() => changePage(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
      <button className="next-btn" onClick={nextPage}>
        <HiChevronDoubleRight />
        next
      </button>
    </Wrapper>
  );
};

export default PageBtnContainer;
