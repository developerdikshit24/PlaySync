import { createContext, useContext, useEffect, useState } from 'react';

const SearchPageContext = createContext();

export const SearchPageProvider = ({ children }) => {
    const [page, setPage] = useState(1);
    const [hasMoreSearchVideo, setHasMoreSearchVideo] = useState(true);
    return (
        <SearchPageContext.Provider value={{ page, setPage, hasMoreSearchVideo, setHasMoreSearchVideo }}>
            {children}
        </SearchPageContext.Provider>
    )
}
export const useSearchPage = () => useContext(SearchPageContext);