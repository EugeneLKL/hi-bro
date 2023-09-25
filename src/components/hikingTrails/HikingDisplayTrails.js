import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LeftOutlined, RightOutlined, HeartFilled } from "@ant-design/icons";
import styled from "styled-components/macro";
import { useQuery, useMutation } from "react-query";
import { useAuth } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";

const ImageSwitchButtonP = styled.button`
  position: absolute;
  top: 100px;
  left: 10px;
  font-size: 14px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 30%;
  padding: 5px;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
`;

const ImageSwitchButtonN = styled.button`
  position: absolute;
  top: 100px;
  right: 20px;
  font-size: 14px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 30%;
  padding: 5px;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
`;

const CardContainer = styled.div`
  width: 300px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  padding: 16px;
  margin-bottom: 20px;
  background-color: #fff;
  transition: transform 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-5px);

    ${ImageSwitchButtonP}, ${ImageSwitchButtonN} {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px 5px 0 0;
`;

const CardTitle = styled.h3`
  margin: 8px 0;
  font-size: 18px;
`;

const CardContent = styled.p`
  font-size: 14px;
  color: #555;
  margin: 5px 0;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
`;

const NoTrailsMessage = styled.p`
  font-size: 3em;
  text-align: center;
  margin: 50px auto;
  transform: translateY(-10px);
`;

const FavoriteIcon = styled.div`
  position: absolute;
  bottom: 20px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
`;

const TrailLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const HikingDisplayTrails = ({ searchResults }) => {
  const [trailsData, setTrailsData] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { userId } = useAuth();
  const [savedTrails, setSavedTrails] = useState([]);

  const { data } = useQuery(
    ["trails"],
    async () => {
      const response = await axios.get(`/api/trails`);
      console.log(response);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setTrailsData(data);
        console.log(data);
      },
    }
  );

  const favoriteTrailMutation = useMutation(
    async (trailId) => {
      const response = await axios.post(`/api/trails/${trailId}/favorites`, {
        userId,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success("Trail saved successfully", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
          transition: toast.slideIn,
        });
        console.log(data);
      },
    }
  );

  useEffect(() => {
    if (data) {
      setTrailsData(data);

      const fetchSavedTrails = async () => {
        try {
          const response = await axios.get(`/api/user/${userId}/savedTrails`);
          setSavedTrails(response.data.savedTrailIds);
        } catch (error) {
          console.error("Error fetching saved trails:", error);
        }
      };

      fetchSavedTrails();
    }
  }, [data, userId]);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setTrailsData(searchResults);
    }
  }, [searchResults]);

  useEffect(() => {
    if (data) {
      // Initialize currentImageIndex for each trail
      const trailsWithInitializedIndex = data.map((trail) => ({
        ...trail,
        currentImageIndex: 0, // Initialize to the first image
      }));
      setTrailsData(trailsWithInitializedIndex);
    }
  }, [data]);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      const trailsWithInitializedIndex = searchResults.map((trail) => ({
        ...trail,
        currentImageIndex: 0, // Initialize to the first image
      }));
      setTrailsData(trailsWithInitializedIndex);
    }
  }, [searchResults]);

  const handleImageSwitch = (trailId, direction) => {
    setTrailsData((prevTrailsData) =>
      prevTrailsData.map((trail) => {
        if (trail.trailId === trailId) {
          const newImageIndex =
            (trail.currentImageIndex +
              direction +
              trail.trailImagesUrl.length) %
            trail.trailImagesUrl.length;

          return {
            ...trail,
            currentImageIndex: newImageIndex,
          };
        } else {
          return trail;
        }
      })
    );
  };

  const handleSavedToggle = (trailId) => {
    if (savedTrails.includes(trailId)) {
      toast.error("Trail is already saved", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
        hideProgressBar: true,
        transition: toast.slideIn,
      });
    } else {
      favoriteTrailMutation.mutate(trailId);
      // Find the index of the clicked trail in trailsData
      const index = trailsData.findIndex((trail) => trail.trailId === trailId);
      if (index !== -1) {
        // Clone the trailsData array to avoid mutating state directly
        const updatedTrailsData = [...trailsData];
        // Update the isFavorited property of the clicked trail
        updatedTrailsData[index].isFavorited = true;
        // Update the state with the updated array
        setTrailsData(updatedTrailsData);
      }
      setSavedTrails((prevSavedTrails) => [...prevSavedTrails, trailId]);
    }
  };
  
  return (
    <>
      {trailsData.length === 0 ? (
        <NoTrailsMessage>No trails found</NoTrailsMessage>
      ) : (
        <CardWrapper>
          {trailsData.map((trail) => (
            <div
              key={trail.trailId}
              onClick={(e) => {
                if (
                  e.target.matches(".image-switch-button") ||
                  e.target.matches(".favorite-icon")
                ) {
                  e.stopPropagation();
                }
              }}
            >
              <CardContainer>
                <TrailLink to={`/hikingTrails/${trail.trailId}`}>
                  <CardImageWrapper>
                    <CardImage
                      src={trail.trailImagesUrl[trail.currentImageIndex]}
                      alt={trail.trailName}
                    />
                  </CardImageWrapper>
                  <CardTitle>{trail.trailName}</CardTitle>
                  <CardContent>
                    Location: Lat({trail.trailLat}), Lng({trail.trailLng})
                  </CardContent>
                  <CardContent>Type: {trail.trailType}</CardContent>
                  <CardContent>Difficulty: {trail.trailDifficulty}</CardContent>
                </TrailLink>
                {trail.trailImagesUrl.length > 1 && (
                  <>
                    <ImageSwitchButtonP
                      className="image-switch-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageSwitch(trail.trailId, -1);
                      }}
                    >
                      <LeftOutlined />
                    </ImageSwitchButtonP>
                    <ImageSwitchButtonN
                      className="image-switch-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageSwitch(trail.trailId, 1);
                      }}
                    >
                      <RightOutlined />
                    </ImageSwitchButtonN>
                  </>
                )}
                <FavoriteIcon
                  className="favorite-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSavedToggle(trail.trailId);
                  }}
                >
                  <HeartFilled
                    style={{
                      color: trail.isFavorited ? "#FF0000" : "#ccc",
                    }}
                  />
                </FavoriteIcon>
              </CardContainer>
            </div>
          ))}
        </CardWrapper>
      )}
      <ToastContainer />
    </>
  );
};

export default HikingDisplayTrails;
