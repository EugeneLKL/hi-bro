import styled, { keyframes } from "styled-components";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

const rotateBackground = keyframes`
  0% {
    background-image: url('../img/trailsSearchBackground1.jpg');
  }
  25% {
    background-image: url('../img/trailsSearchBackground2.jpg');
  }
  50% {
    background-image: url('../img/trailsSearchBackground3.jpg');
  }
  75% {
    background-image: url('../img/trailsSearchBackground4.jpg');
  }
  100% {
    background-image: url('../img/trailsSearchBackground1.jpg');
  }
`;

const HikingSearchTrailsContainer = styled.div`
  width: 100%;
  height: 485px;
  animation: ${rotateBackground} 30s infinite;
  background-size: cover;
  background-position: center;
`;

const HikingSearchTrailsContainerDarkOverlay = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Heading = styled.h1`
  color: white;
  font-size: 2.5rem;
`;

const Heading2 = styled.h2`
  color: white;
  font-size: 1rem;
  text-align: center;
`;

const SearchContainer = styled.div`
  display: flex;
`;

const SearchInput = styled.input`
  width: 500px !important;
  height: 40px;
  margin-top: 15px !important;
`;

const SearchButton = styled.button`
  display: flex;
  width: 90px;
  margin-top: 15px;
  font-size: 0.8rem;
  height: 40px;
  background-color: #f9a826;
  padding: 0;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #df8c06;
  }
`;

const SearchIcon = styled(SearchOutlined)`
  font-size: 1rem;
  margin-right: 10px;
`;

const HikingSearchTrails = () => {
  //TODO - add search bar functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleInputChange = (value) => console.log(value);
  const handleKeyDown = (value) => console.log(value);

  return (
    <HikingSearchTrailsContainer>
      <HikingSearchTrailsContainerDarkOverlay>
        <Heading>Explore the Trails</Heading>
        <Heading2>
          Discover your next hiking adventure with trail guides shared by hikers
          like you
        </Heading2>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search for Trails"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <SearchButton>
            <SearchIcon />
            Search
          </SearchButton>
        </SearchContainer>
      </HikingSearchTrailsContainerDarkOverlay>
    </HikingSearchTrailsContainer>
  );
};

export default HikingSearchTrails;
