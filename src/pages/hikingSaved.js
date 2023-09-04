import React from "react";
import styled, { keyframes } from "styled-components";
import HikingDisplaySavedTrails from "../components/hikingSaved/HikingDisplaySavedTrails";

const fadeIn = keyframes`
  to {
    opacity: 1;
  }
`;

const BackgroundContainer = styled.div`
  position: relative;
  min-height: 100vh;
  background-image: url("../img/trailsSavedBackground.jpg");
  background-size: cover;
  width: 100%;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 1;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease forwards;
`;

const SavedTitle = styled.h1`
  font-size: 32px;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  padding: 10px 20px;
  background-color: rgba(60, 179, 113, 0.7);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const HikingSaved = () => {
  return (
    <BackgroundContainer>
      <BackgroundOverlay />
      <ContentContainer>
        <SavedTitle>Saved Trails</SavedTitle>
        <HikingDisplaySavedTrails />
      </ContentContainer>
    </BackgroundContainer>
  );
};

export default HikingSaved;
