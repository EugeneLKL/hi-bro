import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components/macro";
import HikingImageSlider from "../components/hikingTrailsPage/HikingImageSlider";
import { StarFilled } from "@ant-design/icons";
import GoogleMap from "../components/common/GoogleMap";
import TrailForm from "../components/common/TrailForm";
import { useQueryClient } from "react-query";
import HikingForm from "../components/common/HikingForm";
import HikingTrailReviews from "../components/hikingTrailsPage/HikingTrailReviews";
import Confirmation from "../components/common/HikingConfirmation";
import SideBar from "../components/common/SideBar";
import { useAuth } from "../AuthContext";

const MainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom right, #ffc480, #e5e5e5);
  padding: 20px;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ImageSliderContainer = styled.div`
  width: 100%;
  max-height: 450px;
  overflow: hidden;
  border-radius: 8px;
`;

const BottomContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const ContentContainer = styled.div`
  flex: 3;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
`;

const FunctionContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
`;

const MapContainer = styled.div`
  flex: 3;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
`;

const ReviewContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
`;

const TrailName = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  border-bottom: 1px solid #000;
`;

const TrailContent = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 10px;
`;

const AmenityList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
`;

const AmenityItem = styled.ul`
  font-size: 14px;
  color: black;
  margin-bottom: 5px;
  padding: 5px 10px;
  border-radius: 8px;
  background-color: #87d79c;
  margin-right: 10px;
`;

const ActionButton = styled.button`
  background-color: #007bff;
  width: 100%;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 5px 0;

  &:hover {
    background-color: #0056b3;
  }
`;

const ToastBox = styled(ToastContainer)`
  top: 20px;
  right: auto;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledRatingStar = styled(StarFilled)`
  color: ${({ selected }) => (selected ? "#FFD700" : "#ccc")};
  margin-right: 5px;
  cursor: pointer;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const EditFormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
`;

const FormContainer = styled.div`
  width: 660px;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
  z-index: 1;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: fit-content;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 47px;
  max-height: 200px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 18px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 18px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
    transform: scale(1.05);
  }
`;

const CloseMapButton = styled.button`
  width: 200px;
  padding: 12px;
  font-size: 18px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 10px 0;

  &:hover {
    background-color: #c82333;
  }
`;

const SetLocationButton = styled.button`
  width: 200px;
  padding: 12px;
  font-size: 18px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 10px 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  margin: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 32px;
  text-align: center;
  margin-bottom: 30px;
`;

const FormButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TrailSelect = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;

  option {
    font-size: 14px;
    opacity: 0.6;
  }
`;

const CheckboxDropdown = styled.div`
  position: relative;
  max-width: 100%;
`;

const DropdownToggle = styled.div`
  max-width: 100%;
  padding: 12px 0 12px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  width: 100%;
  font-size: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  max-height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #ccc #fff;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #fff;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 20px;
    border: 3px solid #fff;
  }
`;

const CheckboxLabel = styled.label`
  display: block;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const CheckboxInput = styled.input`
  margin-right: 8px;
`;

const SelectedAmenitiesBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const SelectedAmenity = styled.div`
  background-color: #007bff;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;

const RemoveIcon = styled.span`
  margin-left: 8px;
  font-weight: bold;
  cursor: pointer;
`;

const ErrorMsg = styled.p`
  color: red;
  margin-top: 5px;
`;

const RedAsterisk = styled.span`
  color: red;
  margin-right: 5px;
`;

const MapButton = styled.button`
  margin-top: 5px;
  margin-left: 0;
  padding: 8px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;

  &:hover {
    background-color: #0056b3;
  }
`;

const InnerMapContainer = styled.div`
  // position: relative;
  width: 100%;
  height: 200px;
`;

const MapButtonContainer = styled.div`
  display: flex;
  justify-content: right;
`;

const MapModal = styled.div`
  z-index: 999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 90%;
  height: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
`;

const TrailPage = () => {
  const { trailId } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [receivedTrailData, setReceivedTrailData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [tempLocation, setTempLocation] = useState({});
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [trailImagesUrl, setTrailImagesUrl] = useState([]);
  const [makeReview, setMakeReview] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const dropdownRef = useRef(null);
  const [ratingAverage, setRatingAverage] = useState(0);
  const [rating, setRating] = useState(0);
  const { userId } = useAuth();
  const [reviews, setReviews] = useState(undefined);
  const [isCreator, setIsCreator] = useState(false);
  const [trailUserId, setTrailUserId] = useState(false);

  const queryClient = useQueryClient();

  // const mapRef = useRef(null); // Create a ref for the map element

  // useEffect(() => {
  //   if (mapRef.current && window.google) {
  //     const map = new window.google.maps.Map(mapRef.current, {
  //       center: { lat: 3.0069899559020996, lng: 101.43297576904297 }, // Replace with actual latitude and longitude
  //       zoom: 14, // Adjust the zoom level as needed
  //     });

  //     new window.google.maps.Marker({
  //       position: { lat: 3.0069899559020996, lng: 101.43297576904297 },
  //       map: map,
  //     });
  //   }
  // });

  const [selectedRating, setSelectedRating] = useState(0);

  const { data: trailData, isLoading } = useQuery(
    ["trail", trailId],
    async () => {
      const response = await axios.get(`/api/trails/${trailId}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log(data);
        // Calculate average rating
        const ratings = data.trailRating;
        console.log(ratings);
        let total = 0;
        for (let i = 0; i < ratings.length; i++) {
          total += ratings[i].rating;
        }
        const average = total / ratings.length;
        setRatingAverage(average.toFixed(1));
        //set seleted rating based on user id
        for (let i = 0; i < ratings.length; i++) {
          if (ratings[i].userId === userId) {
            setSelectedRating(ratings[i].rating);
          }
        }

        setTempLocation({
          lat: data.trailLat,
          lng: data.trailLng,
        });
        setSelectedLocation({
          lat: data.trailLat,
          lng: data.trailLng,
        });
        setSelectedAmenities(data.amenities);
        setEstimatedDuration(data.estimatedDuration);
        setTrailUserId(data.userId);
      },
    }
  );

  const deleteMutation = useMutation(
    async () => {
      const response = await axios.delete(`/api/trails/${trailId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success("Trail deleted successfully!");
        navigate("/hikingTrails");
      },
    }
  );

  const updateMutation = useMutation(
    async (editedData) => {
      const response = await axios.put(`/api/trails/${trailId}`, editedData);
      console.log(response);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success("Trail updated successfully!");
        setIsEditMode(false);
      },
    }
  );

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery(
    ["reviews", trailId],
    async () => {
      const response = await axios.get(`/api/trails/${trailId}/reviews`);
      return response.data;
    }
  );

  // Post rating with user id
  const rateTrailMutation = useMutation(
    async (rating) => {
      const response = await axios.post(`/api/trails/${trailId}/rating`, {
        ...rating,
        userId,
      });
      console.log(response);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success("Trail rated successfully!");
      },
    }
  );

  useEffect(() => {
    if (reviewsData) {
      setReviews(reviewsData);
    }
  }, [reviewsData]);

  useEffect(() => {
    console.log(userId, trailUserId);
    if (userId === trailUserId) {
      setIsCreator(true);
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handlers
  const handleDelete = () => {
    setIsDelete(true);
  };

  // TODO - Create receive api for rating
  const handleRatingSelect = (rating) => {
    console.log(rating);
    setSelectedRating(rating);
    rateTrailMutation.mutateAsync({ rating: rating });
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  // const handleEditFormSubmit = () => {
  //   console.log(receivedTrailData)
  //   setEditedData(receivedTrailData);
  //   console.log(editedData)
  //   updateMutation.mutate(editedData);
  // };

  const handleOverlayClick = (event) => {
    // Close the form when clicking outside of it
    if (event.target.classList.contains("overlay")) {
      setMakeReview(false);
      setIsEditMode(false);
    }
  };

  const openMap = () => {
    setIsMapModalOpen(true);
  };

  const closeMap = () => {
    setIsMapModalOpen(false);
  };

  const handleSetLocation = () => {
    setTempLocation({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    });

    closeMap();
  };

  const handleCloseMap = () => {
    setSelectedLocation({
      lat: trailData.trailLat,
      lng: trailData.trailLng,
    });
    closeMap();
  };

  // Make current location the default marker position
  // const handleCurrentLocation = () => {
  //   setSelectedLocation({
  //     lat: latitude,
  //     lng: longitude,
  //   });
  // };

  // useEffect(() => {
  //   setSelectedLocationCoordinates({
  //     lat: selectedLocation.lat,
  //     lng: selectedLocation.lng,
  //   });
  // }, [selectedLocation]);

  const handleMarkerPositionChange = (newPosition) => {
    setSelectedLocation({
      lat: newPosition.lat.toFixed(6),
      lng: newPosition.lng.toFixed(6),
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleCancel = () => {
    setSelectedLocation({
      lat: trailData.trailLat,
      lng: trailData.trailLng,
    });
    setIsEditMode(false);
  };

  const calculateEstimatedDuration = (length) => {
    if (length === "Short") {
      return "30 minutes to an hour";
    } else if (length === "Moderate") {
      return "1.5 to 3 hours";
    } else if (length === "Intermediate") {
      return "3 to 6 hours";
    } else if (length === "Longer") {
      return "6 to 10 hours";
    } else if (length === "Extended") {
      return "Multiple days";
    } else {
      return "";
    }
  };

  const handleTrailFormChange = (field, value) => {
    setReceivedTrailData((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    if (field === "trailLength") {
      setEstimatedDuration(calculateEstimatedDuration(value));
    }

    if (field === "trailImages") {
      const previews = [];

      for (let i = 0; i < value.length; i++) {
        previews.push(URL.createObjectURL(value[i]));
      }

      setImagePreviews(previews);
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setSelectedAmenities((prevAmenities) =>
      prevAmenities.filter((item) => item !== amenity)
    );
  };

  const amenityOptions = [
    "Parking",
    "Toilets",
    "Water",
    "Camping",
    "Picnic Tables",
    "BBQ",
    "Shelter",
    "Lookout",
    "Wheelchair Accessible",
    "Pets Allowed",
    "Bikes Allowed",
    "Horses Allowed",
    "Swimming",
    "Fishing",
    "Boating",
    "Cafe",
    "Restaurant",
    "Bar",
    "Shop",
    "Cellphone Reception",
    "Wifi",
    "Education Boards",
  ];

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const editedData = {
        trailName: receivedTrailData.trailName,
        trailLat: selectedLocation.lat,
        trailLng: selectedLocation.lng,
        trailType: receivedTrailData.trailType,
        trailDifficulty: receivedTrailData.trailDifficulty,
        trailLength: receivedTrailData.trailLength,
        trailDescription: receivedTrailData.trailDescription,
        trailImagesUrl: imagePreviews,
        estimatedDuration: estimatedDuration,
        amenities: selectedAmenities,
      };

      console.log(editedData);

      await updateMutation.mutateAsync(editedData);

      queryClient.invalidateQueries(["trail", trailId]);

      //refresh page if location updated
      if (
        selectedLocation.lat !== trailData.trailLat ||
        selectedLocation.lng !== trailData.trailLng
      ) {
        window.location.reload(1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openReview = () => {
    setMakeReview(true);
  };

  const closeReview = () => {
    setMakeReview(false);
  };

  const handleTitleChange = (e) => {
    setReceivedTrailData((prevState) => ({
      ...prevState,
      reviewTitle: e.target.value,
    }));
  };

  const handleContentChange = (e) => {
    setReceivedTrailData((prevState) => ({
      ...prevState,
      reviewContent: e.target.value,
    }));
  };

  const handleReview = () => {
    const reviewData = {
      reviewTitle: receivedTrailData.reviewTitle,
      reviewContent: receivedTrailData.reviewContent,
      userId,
    };

    axios
      .post(`/api/trails/${trailId}/reviews`, reviewData)
      .then((response) => {
        console.log(response);
        toast.success("Review submitted successfully!");
        setMakeReview(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
    setIsDelete(false);
  };

  const cancelDelete = () => {
    setIsDelete(false);
  };

  const handleSave = () => {
    axios
      .post(`/api/trails/${trailId}/favorites`, {
        userId,
      })
      .then((response) => {
        console.log(response);
        toast.success("Trail saved successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-row w-full">
      <SideBar />
      <MainContainer>
        <ToastBox />
        <PageContent>
          <ImageSliderContainer>
            {trailData.trailImagesUrl && (
              <HikingImageSlider images={trailData.trailImagesUrl} />
            )}
          </ImageSliderContainer>
          <BottomContainer>
            <ContentContainer>
              <TrailName>{trailData.trailName}</TrailName>
              <TrailContent>{trailData.trailDescription}</TrailContent>
              <TrailContent>
                Location: {trailData.trailLat}, {trailData.trailLng}
              </TrailContent>
              <TrailContent>Type: {trailData.trailType}</TrailContent>
              <TrailContent>
                Difficulty: {trailData.trailDifficulty}
              </TrailContent>
              <TrailContent>Length: {trailData.trailLength}</TrailContent>
              <TrailContent>
                Duration: {trailData.estimatedDuration}
              </TrailContent>
              <TrailContent>Amenities:</TrailContent>
              <AmenityList>
                {trailData.amenities.map((amenity, index) => (
                  <AmenityItem key={index}>{amenity}</AmenityItem>
                ))}
              </AmenityList>
            </ContentContainer>
            <FunctionContainer>
              <div>
                <span>Trail rating:</span>
                <div className="flex align-middle mb-2">
                  <div>({ratingAverage})</div>
                  <div className="mt-0.5 ml-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <StyledRatingStar
                        key={rating}
                        selected={rating <= selectedRating}
                        onClick={() => handleRatingSelect(rating)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <ActionButton onClick={handleSave}>Save trail</ActionButton>
              {isCreator && (
                <div>
                  <ActionButton onClick={handleEdit}>Edit Trail</ActionButton>
                  <ActionButton onClick={handleDelete}>
                    Delete trail
                  </ActionButton>
                </div>
              )}
              <ActionButton onClick={openReview}>Write a review</ActionButton>
            </FunctionContainer>
            <MapContainer>
              <GoogleMap
                key={trailData.trailId}
                trailLat={trailData.trailLat}
                trailLng={trailData.trailLng}
                mapSearch={false}
                w="100%"
                h="315px"
                streetViewControl={false}
                onMarkerPositionChange={handleMarkerPositionChange}
                draggable={false}
                clickEnabled={false}
              />
            </MapContainer>
          </BottomContainer>
          <ReviewContainer>
            <Title>Reviews</Title>
            <HikingTrailReviews trailId={trailId} reviews={reviews} />
          </ReviewContainer>
        </PageContent>
        {isDelete && (
          <Confirmation
            message="Are you sure you want to delete this trail?"
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          ></Confirmation>
        )}
        {makeReview && (
          <Overlay className="overlay" onClick={handleOverlayClick}>
            <HikingForm
              formTitle={"Write a review"}
              onCancel={closeReview}
              onSubmit={handleReview}
              leftBtn={"Submit"}
              contentPlaceholder={"Write your review here..."}
              handleTitleChange={handleTitleChange}
              handleContentChange={handleContentChange}
            ></HikingForm>
          </Overlay>
        )}
        {isEditMode && (
          <Overlay className="overlay" onClick={handleOverlayClick}>
            <EditFormContainer>
              <FormContainer>
                <form onSubmit={handleEditFormSubmit}>
                  <Title>Edit Trail</Title>
                  <FormGroup>
                    <Label>
                      <RedAsterisk>*</RedAsterisk>Trail Name
                    </Label>
                    <Input
                      type="text"
                      name="trailName"
                      defaultValue={trailData.trailName}
                      onChange={(e) =>
                        handleTrailFormChange("trailName", e.target.value)
                      }
                    />
                    {/* {errors.trailName && <ErrorMsg>{errors.trailName}</ErrorMsg>} */}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <RedAsterisk>*</RedAsterisk>Trail Location
                    </Label>

                    <MapButton type="button" onClick={openMap}>
                      Open Map
                    </MapButton>

                    <div>
                      <h4 className="mt-2">Selected Coordinates:</h4>
                      <p>Latitude: {selectedLocation.lat}</p>
                      <p>Longitude: {selectedLocation.lng}</p>
                    </div>

                    {isMapModalOpen && (
                      <MapModal>
                        <h2 className="mb-1">Select Location on Map</h2>
                        <InnerMapContainer>
                          <GoogleMap
                            trailLat={selectedLocation.lat}
                            trailLng={selectedLocation.lng}
                            mapSearch={true}
                            w="100%"
                            h="670px"
                            streetViewControl={false}
                            onMarkerPositionChange={handleMarkerPositionChange}
                            draggable={true}
                            clickEnabled={true}
                          />
                          <MapButtonContainer>
                            <SetLocationButton onClick={handleSetLocation}>
                              Set Location
                            </SetLocationButton>
                            <CloseMapButton onClick={handleCloseMap}>
                              Close Map
                            </CloseMapButton>
                          </MapButtonContainer>
                        </InnerMapContainer>
                      </MapModal>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <RedAsterisk>*</RedAsterisk>Trail Type
                    </Label>
                    <TrailSelect
                      name="trailType"
                      defaultValue={trailData.trailType}
                      onChange={(e) =>
                        handleTrailFormChange("trailType", e.target.value)
                      }
                    >
                      <option value="">Select Trail Type</option>
                      <option value={"Day Hike Trail"}>Day Hike Trail</option>
                      <option value={"Long-Distance Trail"}>
                        Long-Distance Trail
                      </option>
                      <option value={"Loop Trail"}>Loop Trail</option>
                      <option value={"Point-to-Point Trail"}>
                        Point-to-Point Trail
                      </option>
                      <option value={"Mountain Trail"}>Mountain Trail</option>
                      <option value={"Coastal Trail"}>Coastal Trail</option>
                      <option value={"Forest Trail"}>Forest Trail</option>
                      <option value={"Desert Trail"}>Desert Trail</option>
                      <option value={"Waterfall Trail"}>Waterfall Trail</option>
                      <option value={"Canyon Trail"}>Canyon Trail</option>
                      <option value={"Wilderness Trail"}>
                        Wilderness Trail
                      </option>
                      <option value={"Heritage Trail"}>Heritage Trail</option>
                      <option value={"Family Friendly Trail"}>
                        Family-Friendly Trail
                      </option>
                      <option value={"Themed Trail"}>Themed Trail</option>
                    </TrailSelect>
                    {/* {errors.trailType && <ErrorMsg>{errors.trailType}</ErrorMsg>} */}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <RedAsterisk>*</RedAsterisk>Trail Difficulty
                    </Label>
                    <TrailSelect
                      name="trailDifficulty"
                      defaultValue={trailData.trailDifficulty}
                      onChange={(e) =>
                        handleTrailFormChange("trailDifficulty", e.target.value)
                      }
                    >
                      <option value="">Select Trail Difficulty</option>
                      <option value={"Easy"}>Easy</option>
                      <option value={"Moderate"}>Moderate</option>
                      <option value={"Hard"}>Hard</option>
                      <option value={"Expert"}>Expert</option>
                    </TrailSelect>
                    {/* {errors.trailDifficulty && (
                    <ErrorMsg>{errors.trailDifficulty}</ErrorMsg>
                  )} */}
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <RedAsterisk>*</RedAsterisk>Trail Length
                    </Label>
                    <TrailSelect
                      name="trailLength"
                      defaultValue={trailData.trailLength}
                      onChange={(e) => {
                        const selectedTrailLength = e.target.value;
                        const newEstimatedDuration =
                          calculateEstimatedDuration(selectedTrailLength);
                        setReceivedTrailData((prevData) => ({
                          ...prevData,
                          trailLength: selectedTrailLength,
                          estimatedDuration: newEstimatedDuration,
                        }));
                        setEstimatedDuration(newEstimatedDuration);
                      }}
                    >
                      <option value="">Select Trail Length</option>
                      <option value={"Short"}>Short (~3.2km)</option>
                      <option value={"Moderate"}>Moderate (3.2 to 8km)</option>
                      <option value={"Intermediate"}>
                        Intermediate (8 to 16 km)
                      </option>
                      <option value={"Longer"}>Longer (16 to 32 km)</option>
                      <option value={"Extended"}>Extended (32+ km)</option>
                    </TrailSelect>
                    {/* {errors.trailLength && (
                    <ErrorMsg>{errors.trailLength}</ErrorMsg>
                  )} */}
                  </FormGroup>

                  <FormGroup>
                    <Label>Estimated Duration</Label>
                    <Input
                      type="text"
                      name="estimatedDuration"
                      value={estimatedDuration}
                      onChange={() => {}}
                      disabled
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <RedAsterisk>*</RedAsterisk>Trail Description
                    </Label>
                    <TextArea
                      name="trailDescription"
                      defaultValue={trailData.trailDescription}
                      onChange={(e) =>
                        handleTrailFormChange(
                          "trailDescription",
                          e.target.value
                        )
                      }
                    />
                    {/* {errors.trailDescription && (
                    <ErrorMsg>{errors.trailDescription}</ErrorMsg>
                  )} */}
                  </FormGroup>

                  <FormGroup>
                    <Label>Amenities (Optional)</Label>
                    <CheckboxDropdown ref={dropdownRef}>
                      <DropdownToggle onClick={toggleDropdown}>
                        {dropdownOpen
                          ? "Select Amenities"
                          : "Select Amenities ▼"}
                      </DropdownToggle>
                      {dropdownOpen && (
                        <DropdownContent>
                          {amenityOptions.map((amenity) => (
                            <CheckboxLabel key={amenity}>
                              <CheckboxInput
                                type="checkbox"
                                name="amenities"
                                value={amenity}
                                checked={selectedAmenities.includes(amenity)}
                                onChange={(e) => {
                                  const { checked, value } = e.target;
                                  if (checked) {
                                    setSelectedAmenities((prevAmenities) => [
                                      ...prevAmenities,
                                      value,
                                    ]);
                                  } else {
                                    setSelectedAmenities((prevAmenities) =>
                                      prevAmenities.filter(
                                        (amenity) => amenity !== value
                                      )
                                    );
                                  }
                                  handleTrailFormChange("amenities", [
                                    ...selectedAmenities,
                                    value,
                                  ]);
                                }}
                              />
                              {amenity}
                            </CheckboxLabel>
                          ))}
                        </DropdownContent>
                      )}
                    </CheckboxDropdown>
                    <SelectedAmenitiesBox>
                      {selectedAmenities.map((selectedAmenity, index) => (
                        <SelectedAmenity key={index}>
                          {selectedAmenity}
                          <RemoveIcon
                            onClick={() => handleRemoveAmenity(selectedAmenity)}
                          >
                            x
                          </RemoveIcon>
                        </SelectedAmenity>
                      ))}
                    </SelectedAmenitiesBox>
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <RedAsterisk>*</RedAsterisk>Trail Images
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      name="trailImages"
                      onChange={(e) =>
                        handleTrailFormChange("trailImages", e.target.files)
                      }
                      multiple
                    />
                    <ImagePreviewContainer>
                      {imagePreviews.map((imagePreview, index) => (
                        <ImagePreview
                          key={index}
                          src={imagePreview}
                          alt="Trail Image"
                        />
                      ))}
                    </ImagePreviewContainer>
                  </FormGroup>

                  <FormButtons>
                    <SubmitButton type="submit">Edit</SubmitButton>
                    <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                  </FormButtons>
                </form>
              </FormContainer>
            </EditFormContainer>
          </Overlay>
        )}
      </MainContainer>
    </div>
  );
};

export default TrailPage;
