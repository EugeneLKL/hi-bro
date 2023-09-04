import React, { useState } from "react";
import styled from "styled-components/macro";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const SliderWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const SlideContainer = styled.div`
  display: flex;
  height: 100%;
  transition: transform 0.3s ease-in-out;
`;

const Slide = styled.div`
  flex: 0 0 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const ImageDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  position: absolute;
  transform: translateY(385px);
`;

const DisplayDot = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20%;
  background-image: ${({ imageurl }) => `url(${imageurl})`};
  background-size: cover;
  background-position: center;
  margin: 0 5px;
  cursor: pointer;
  border: 1px solid #fff;
  box-shadow: ${({ active }) => (active ? '0 0 2px 2px #000' : 'none')};
`;

const SlideImageCount = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 5px;
  color: white;
`;

const ArrowButton = styled.button`
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 10px;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: background-color 0.2s ease-in-out;
  margin-right: 10px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }
`;

const ArrowIcon = styled.div`
  font-size: 24px;
`;

const HikingImageSlider = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide > 0 ? prevSlide - 1 : images.length - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide < images.length - 1 ? prevSlide + 1 : 0
    );
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <SliderContainer>
      <SliderWrapper>
        <SlideContainer
          style={{
            transform: `translateX(-${
              currentSlide * ((100 * images.length) / images.length)
            }%)`,
          }}
        >
          {images.map((image, index) => (
            <Slide key={index}>
              <SlideImage src={image} alt={`Slide ${index + 1}`} />
            </Slide>
          ))}
        </SlideContainer>
        <ArrowButton onClick={handlePrevSlide} style={{ left: 0 }}>
          <ArrowIcon>
            <LeftOutlined />
          </ArrowIcon>
        </ArrowButton>
        <ArrowButton onClick={handleNextSlide} style={{ right: 0 }}>
          <ArrowIcon>
            <RightOutlined />
          </ArrowIcon>
        </ArrowButton>
        <SlideImageCount>{`Image ${currentSlide + 1} of ${
          images.length
        }`}</SlideImageCount>
      </SliderWrapper>
      <ImageDisplay>
        {images.map((image, index) => (
          <DisplayDot
            key={index}
            imageurl={image}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </ImageDisplay>
    </SliderContainer>
  );
};

export default HikingImageSlider;
