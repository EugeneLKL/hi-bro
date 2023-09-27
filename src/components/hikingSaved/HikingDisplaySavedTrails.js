import React from "react";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const TrailsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

const HikingDisplaySavedTrails = () => {
  const { userId } = useAuth();
  console.log(userId);

  const { data: trails, isLoading, error } = useQuery(
    "savedTrails",
    async () => {
      const { data } = await axios.get(`/api/trails/${userId}/favorites`);
      console.log(data);
      return data;
    },
    {
      onSuccess: (data) => {
        toast.success("Trails loaded successfully!");
      },
    }
  );

  // Filter trails to display only those with the same userId
  const filteredTrails = trails ? trails.filter((trail) => trail.userId === userId) : [];

  return (
    <TrailsContainer>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        filteredTrails.map((trail) => (
          <TrailCard key={trail.trail.id}>
            <TrailImage
              src={trail.trail.trailImagesUrl[0]}
              alt={trail.trail.trailName}
            />
            <TrailContent>
              <TrailTitle>{trail.trail.trailName}</TrailTitle>
              <TrailDescription>
                {trail.trail.trailDescription}
              </TrailDescription>
            </TrailContent>
          </TrailCard>
        ))
      )}
    </TrailsContainer>
  );
};

export default HikingDisplaySavedTrails;
