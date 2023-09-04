import styled, { keyframes } from "styled-components";
import { useState } from "react";
import HikingSearchTrails from "../components/hikingTrails/HikingSearchTrails";
import HikingDisplayTrails from "../components/hikingTrails/HikingDisplayTrails";
import HikingSuggestTrails from "../components/hikingTrails/HikingSuggestTrails";

const fadeIn = keyframes`
  to {
    opacity: 1;
  }
`;

const HikingTrailContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease forwards;
`;

const TrailSearchContainer = styled.div`
  width: 100%;
  height: 485px;
`;

const TrailDisplayContainer = styled.div`
  display: flex;
  width: 90%;
  margin: 20px auto 0;
`;

const TrailSuggestContainer = styled.div`
  width: 100%;
  height: 215px;
`;

const HikingTrails = () => {
  const [trails, setTrails] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  return (
    <HikingTrailContainer>
      <TrailSearchContainer>
        <HikingSearchTrails setTrails={setSearchResults}/>
      </TrailSearchContainer>
      <TrailDisplayContainer>
        <HikingDisplayTrails searchResults={searchResults}/>
      </TrailDisplayContainer>
      <TrailSuggestContainer>
        <HikingSuggestTrails />
      </TrailSuggestContainer>
    </HikingTrailContainer>
  );
};

export default HikingTrails;
