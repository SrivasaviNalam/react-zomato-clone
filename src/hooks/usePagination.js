import { useMemo } from 'react';

const usePagination = ({totalCount, pageSize}) => {
  const paginationRange = useMemo(() => { 
    const totalPageCount = Math.ceil(totalCount/pageSize);
    const range = (startIndex, endIndex)  => {
      let length = endIndex - startIndex + 1;
      return Array.from({length},(_,index)=>index+startIndex);
    }
    return range(1,totalPageCount);
  },[totalCount, pageSize]); 
  return paginationRange;
}

export default usePagination;
