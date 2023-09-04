import React from 'react';
import styled from 'styled-components';

const TrailsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 20px auto;
`;

const TrailCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: grid; 
  grid-template-rows: 200px auto;
  border: 3px double #fff;
`;

const TrailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

`;

const TrailContent = styled.div`
  padding: 20px;
  background-color: #fff;

`;

const TrailTitle = styled.h2`
  font-size: 18px;
  margin: 0;
`;

const TrailDescription = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: #777;
`;

const dummyTrails = [
    {
      trailId: '1',
      trailName: 'Forest Trail',
      trailImage: '../img/trailsSearchBackground1.jpg',
      trailDescription:
        'Enjoy a serene hike through the lush green forest with beautiful scenic views.',
    },
    {
      trailId: '2',
      trailName: 'Mountain Adventure',
      trailImage: '../img/trailsSearchBackground2.jpg',
      trailDescription:
        'Embark on an exciting mountain adventure with breathtaking landscapes.',
    },
    {
      trailId: '3',
      trailName: 'Ocean Adventure',
      trailImage: '../img/trailsSearchBackground3.jpg',
      trailDescription:
        'Embark on an exciting mountain adventure with breathtaking landscapes.',
    },
    {
      trailId: '4',
      trailName: 'Ocean Adventure',
      trailImage: '../img/trailsSearchBackground3.jpg',
      trailDescription:
        'Embark on an exciting mountain adventure with breathtaking landscapes.',
    },
    {
      trailId: '5',
      trailName: 'Ocean Adventure',
      trailImage: '../img/trailsSearchBackground3.jpg',
      trailDescription:
        'Embark on an exciting mountain adventure with breathtaking landscapes.',
    },
    {
      trailId: '6',
      trailName: 'Ocean Adventure',
      trailImage: '../img/trailsSearchBackground3.jpg',
      trailDescription:
        'Embark on an exciting mountain adventure with breathtaking landscapes.',
    },
  ];

const HikingDisplaySavedTrails = () => {
  return (
    <TrailsContainer>
      {dummyTrails.map((trail) => (
        <TrailCard key={trail.trailId}>
          <TrailImage src={trail.trailImage} alt={trail.trailName} />
          <TrailContent>
            <TrailTitle>{trail.trailName}</TrailTitle>
            <TrailDescription>{trail.trailDescription}</TrailDescription>
          </TrailContent>
        </TrailCard>
      ))}
    </TrailsContainer>
  );
};

export default HikingDisplaySavedTrails;
