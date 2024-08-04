import React from 'react'
import usePagination from '../hooks/usePagination';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft
} from "@fortawesome/free-solid-svg-icons";

const Pagination = (props) => {
  let {totalCount,pageSize,currentPage, className, onPageChange} = props;
  const paginationRange  = usePagination({totalCount,pageSize});
  if(currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  let onPrevious = () => {
    onPageChange(currentPage - 1);
  }

  let onNext = () => {
    onPageChange(currentPage + 1);
  }

  let onClickPaginationNumber = (page) => {
    onPageChange(page);
  }

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className={`pagination-container ${className}`}>
      {/* left arrow*/}
      <li onClick={onPrevious} className={`pagination-item${currentPage === 1 ? " disabled" : ""}`}><FontAwesomeIcon icon={faAngleLeft} /></li>
      {paginationRange.map((page,index) => {
        return (
          <li className={`pagination-item${currentPage === page ? " active":""}`} key={index} onClick={() => onClickPaginationNumber(page)}>{page}</li>
        )
      })}
      {/* Right Arrow */}
      <li onClick={onNext}className={`pagination-item${currentPage === lastPage ? " disabled" : ""}`}><FontAwesomeIcon icon={faAngleRight}/></li>
    </ul>
  )
}

export default Pagination;
