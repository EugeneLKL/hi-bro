import React, { useState } from "react";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = ({ setPosts }) => {
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
        params: { query: searchTerm },
      });
  
      // Handle the search results from the API
      const searchResults = response.data;
      console.log("Search Results:", searchResults);
  
      setPosts(searchResults);
  
      // Update the URL with the search query
      // const searchUrl = `/search/?q=${encodeURIComponent(searchTerm)}`;
      // window.history.pushState({ searchTerm }, "", searchUrl);

      // Update URL with the search query and makes me can retrieve the search query in the url
      const searchUrl = `/search/?q=${encodeURIComponent(searchTerm)}`;
      window.history.pushState({ searchTerm }, "", searchUrl);
  
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
        <SearchOutlined />
      </button>
    </div>
  );
};

export default SearchBar;
