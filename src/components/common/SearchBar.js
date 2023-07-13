import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({setPosts}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };

  const handleSearch = async () => {
    try {
      if (!searchTerm) {
        return;
      }

      console.log("Performing search for:", searchTerm);

      const response = await axios.get("/api/search", {
        params: { title: searchTerm },
      });

      // Handle the search results from the database
      const searchResults = response.data;
      console.log("Search Results:", searchResults);

      setPosts(searchResults)
      // Clear the search term after performing the search
      setSearchTerm("");

    } catch (error) {
      console.error("Error occurred during search:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button className="search-button" onClick={handleSearch}>
        <img src="/img/searchIcon.png" alt="search icon" />
      </button>
    </div>
  );
};

export default SearchBar;
