import styled from "styled-components";
import { Link } from "react-router-dom";

const HikingSuggestTrailsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
`;

const BlackOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
`;

const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
`;

const Button = styled.button`
  background-color: #fabb79;
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

const ContentText = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  color: #fff;
`;

const BoldText = styled.span`
  font-weight: bold;
  color: #fabb79;
`;

const HikingSuggestTrails = () => {
  const handleMouseEnter = () => {
    const overlay = document.getElementById("overlay");
    const content = document.getElementById("content");

    overlay.style.opacity = "1";
    content.style.opacity = "1";
    content.style.transform = "translate(-50%, -50%) scale(1)";
  };

  const handleMouseLeave = () => {
    const overlay = document.getElementById("overlay");
    const content = document.getElementById("content");

    overlay.style.opacity = "0";
    content.style.opacity = "0";
    content.style.transform = "translate(-50%, -50%) scale(0)";
  };

  return (
    <HikingSuggestTrailsContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <BackgroundImage
        src="../img/trailsSuggestBackgroundMain.jpg"
        alt="Hiking Suggest Trail"
      />
      <BlackOverlay id="overlay" />
      <Content id="content">
        <ContentText>
          Are you an <BoldText>EXPERIENCED</BoldText> hiker? Help us out!
        </ContentText>
        <Link to="/hikingTrails/suggest-trail">
          <Button>Suggest a trail</Button>
        </Link>
      </Content>
    </HikingSuggestTrailsContainer>
  );
};

export default HikingSuggestTrails;
