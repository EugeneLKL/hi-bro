import { useState, useEffect, useRef } from "react";
import styled from "styled-components/macro";
import "react-toastify/dist/ReactToastify.css";
import GoogleMap from "../common/GoogleMap";

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

const ClearButton = styled.button`
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
  margin-top: 20px;
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

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
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

  h2 {
    margin-bottom: 20px;
  }
`;

const TrailForm = ({
  onTrailData,
  title,
  onLeft,
  leftButton,
  onRight,
  rightButton,
  onDataChange,
}) => {
  //TODO
  const [selectedLocation, setSelectedLocation] = useState({
    lat: "",
    lng: "",
  });
  const [tempLocation, setTempLocation] = useState({
    lat: "",
    lng: "",
  });
  const [selectedLocationCoordinates, setSelectedLocationCoordinates] =
    useState({
      lat: "",
      lng: "",
    });
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [trailData, setTrailData] = useState({
    trailName: "",
    trailLat: selectedLocation.lat,
    trailLng: selectedLocation.lng,
    trailType: "",
    trailDifficulty: "",
    trailLength: "",
    trailDescription: "",
    trailImages: [],
    estimatedDuration: "",
    amenities: [],
  });

  const [errors, setErrors] = useState({
    trailName: "",
    trailLat: "",
    trailLng: "",
    trailType: "",
    trailDifficulty: "",
    trailLength: "",
    trailDescription: "",
    trailImages: "",
  });

  useEffect(() => {
    const calculateEstimatedDuration = () => {
      const trailLength = trailData.trailLength;
      if (trailLength === "Short") {
        return "30 minutes to an hour";
      } else if (trailLength === "Moderate") {
        return "1.5 to 3 hours";
      } else if (trailLength === "Intermediate") {
        return "3 to 6 hours";
      } else if (trailLength === "Longer") {
        return "6 to 10 hours";
      } else if (trailLength === "Extended") {
        return "Multiple days";
      } else {
        return "";
      }
    };

    setTrailData((prevData) => ({
      ...prevData,
      estimatedDuration: calculateEstimatedDuration(),
    }));
  }, [trailData.trailLength]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setSelectedLocation({
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
        });

        setTempLocation({
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  useEffect(() => {
    setSelectedLocationCoordinates({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    });
  }, [selectedLocation]);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file" && files) {
      const selectedImages = Array.from(files);
      setTrailData((prevData) => ({ ...prevData, [name]: selectedImages }));

      const imagePreviewUrls = selectedImages.map((image) =>
        URL.createObjectURL(image)
      );
      setImagePreviews(imagePreviewUrls);
    } else if (type === "checkbox") {
      const selectedAmenity = e.target.value;
      setSelectedAmenities((prevSelected) =>
        toggleAmenity(prevSelected, selectedAmenity)
      );
      setTrailData((prevData) => ({
        ...prevData,
        amenities: toggleAmenity(prevData.amenities, selectedAmenity),
      }));
    } else {
      setTrailData((prevData) => ({ ...prevData, [name]: value }));
    }

    if (onDataChange) {
      onDataChange(trailData);
    }
  };

  const toggleAmenity = (amenities, amenity) => {
    if (amenities.includes(amenity)) {
      return amenities.filter((item) => item !== amenity);
    } else {
      return [...amenities, amenity];
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setSelectedAmenities((prevSelected) =>
      prevSelected.filter((item) => item !== amenity)
    );
    setTrailData((prevData) => ({
      ...prevData,
      amenities: prevData.amenities.filter((item) => item !== amenity),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onTrailData(trailData);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
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

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      trailName: "",
      trailType: "",
      trailDifficulty: "",
      trailLength: "",
      trailDescription: "",
      trailImages: "",
    };

    if (trailData.trailName.trim() === "") {
      newErrors.trailName = "Trail name is required";
      valid = false;
    } else if (trailData.trailName.trim().length < 3) {
      newErrors.trailName = "Trail name must be at least 3 characters";
      valid = false;
    } else if (trailData.trailName.trim().length > 50) {
      newErrors.trailName = "Trail name must be less than 50 characters";
      valid = false;
    }

    if (trailData.trailType === "") {
      newErrors.trailType = "Trail type is required";
      valid = false;
    }

    if (trailData.trailDifficulty === "") {
      newErrors.trailDifficulty = "Trail difficulty is required";
      valid = false;
    }

    if (trailData.trailLength === "") {
      newErrors.trailLength = "Trail length is required";
      valid = false;
    }

    if (trailData.trailDescription.trim() === "") {
      newErrors.trailDescription = "Trail description is required";
      valid = false;
    } else if (trailData.trailDescription.trim().length < 10) {
      newErrors.trailDescription =
        "Trail description must be at least 10 characters";
      valid = false;
    } else if (trailData.trailDescription.trim().length > 500) {
      newErrors.trailDescription =
        "Trail description must be less than 500 characters";
      valid = false;
    }

    if (trailData.trailImages.length === 0) {
      newErrors.trailImages = "At least one trail image is required";
      valid = false;
    } else if (trailData.trailImages.length > 10) {
      newErrors.trailImages = "Maximum of 10 trail images allowed";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  //TODO
  const openMap = () => {
  setIsMapModalOpen(true);
};

  const closeMap = () => {
    setIsMapModalOpen(false);
  };

  const handleSetLocation = () => {
    setSelectedLocation({
      lat: selectedLocationCoordinates.lat,
      lng: selectedLocationCoordinates.lng,
    });
  
    // Update the trailLat and trailLng properties in trailData
    setTrailData((prevData) => ({
      ...prevData,
      trailLat: selectedLocationCoordinates.lat,
      trailLng: selectedLocationCoordinates.lng,
    }));
  
    closeMap();
  };
  

  const handleCloseMap = () => {
    setSelectedLocation({
      lat: tempLocation.lat,
      lng: tempLocation.lng,
    });
    closeMap();
  };

  // Make current location the default marker position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setSelectedLocation({
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
        });

        setTempLocation({
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  useEffect(() => {
    setSelectedLocationCoordinates({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    });
  }, [selectedLocation]);

  const handleMarkerPositionChange = (newPosition) => {
    setSelectedLocation({
      lat: newPosition.lat.toFixed(6),
      lng: newPosition.lng.toFixed(6),
    });
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <Title>{title}</Title>
        <FormGroup>
          <Label>
            <RedAsterisk>*</RedAsterisk>Trail Name
          </Label>
          <Input
            type="text"
            name="trailName"
            value={trailData.trailName}
            onChange={handleChange}
          />
          {errors.trailName && <ErrorMsg>{errors.trailName}</ErrorMsg>}
        </FormGroup>

        <FormGroup>
          <Label>
            <RedAsterisk>*</RedAsterisk>Trail Location
          </Label>

          <MapButton type="button" onClick={openMap}>
            Open Map
          </MapButton>

          <div>
            <h4 className="mt-2">
              Selected Coordinates (Current location by Default):
            </h4>
            <p>Latitude: {selectedLocation.lat}</p>
            <p>Longitude: {selectedLocation.lng}</p>
          </div>

          {isMapModalOpen && (
            <MapModal>
              <h2 className="mb-1">Select Location on Map</h2>
              <MapContainer>
                <GoogleMap
                  trailLat={trailData.lat}
                  trailLng={trailData.lng}
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
              </MapContainer>
            </MapModal>
          )}
        </FormGroup>

        <FormGroup>
          <Label>
            <RedAsterisk>*</RedAsterisk>Trail Type
          </Label>
          <TrailSelect
            name="trailType"
            value={trailData.trailType}
            onChange={handleChange}
          >
            <option value="">Select Trail Type</option>
            <option value={"DayHike"}>Day Hike Trails</option>
            <option value={"LongDistance"}>Long-Distance Trails</option>
            <option value={"Loop"}>Loop Trails</option>
            <option value={"PointToPoint"}>Point-to-Point Trails</option>
            <option value={"Mountain"}>Mountain Trails</option>
            <option value={"Coastal"}>Coastal Trails</option>
            <option value={"Forest"}>Forest Trails</option>
            <option value={"Desert"}>Desert Trails</option>
            <option value={"Waterfall"}>Waterfall Trails</option>
            <option value={"Canyon"}>Canyon Trails</option>
            <option value={"Wilderness"}>Wilderness Trails</option>
            <option value={"Heritage"}>Heritage Trails</option>
            <option value={"FamilyFriendly"}>Family-Friendly Trails</option>
            <option value={"Themed"}>Themed Trails</option>
          </TrailSelect>
          {errors.trailType && <ErrorMsg>{errors.trailType}</ErrorMsg>}
        </FormGroup>

        <FormGroup>
          <Label>
            <RedAsterisk>*</RedAsterisk>Trail Difficulty
          </Label>
          <TrailSelect
            name="trailDifficulty"
            value={trailData.trailDifficulty}
            onChange={handleChange}
          >
            <option value="">Select Trail Difficulty</option>
            <option value={"Easy"}>Easy</option>
            <option value={"Moderate"}>Moderate</option>
            <option value={"Hard"}>Hard</option>
            <option value={"Expert"}>Very Hard</option>
          </TrailSelect>
          {errors.trailDifficulty && (
            <ErrorMsg>{errors.trailDifficulty}</ErrorMsg>
          )}
        </FormGroup>

        <FormGroup>
          <Label>
            <RedAsterisk>*</RedAsterisk>Trail Length
          </Label>
          <TrailSelect
            name="trailLength"
            value={trailData.trailLength}
            onChange={handleChange}
          >
            <option value="">Select Trail Length</option>
            <option value={"Short"}>Short (~3.2km)</option>
            <option value={"Moderate"}>Moderate (3.2 to 8km)</option>
            <option value={"Intermediate"}>Intermediate (8 to 16 km)</option>
            <option value={"Longer"}>Longer (16 to 32 km)</option>
            <option value={"Extended"}>Extended (32+ km)</option>
          </TrailSelect>
          {errors.trailLength && <ErrorMsg>{errors.trailLength}</ErrorMsg>}
        </FormGroup>

        <FormGroup>
          <Label>Estimated Duration</Label>
          <Input
            type="text"
            name="estimatedDuration"
            value={trailData.estimatedDuration}
            onChange={handleChange}
            disabled
          />
        </FormGroup>

        <FormGroup>
          <Label>
            <RedAsterisk>*</RedAsterisk>Trail Description
          </Label>
          <TextArea
            name="trailDescription"
            value={trailData.trailDescription}
            onChange={handleChange}
          />
          {errors.trailDescription && (
            <ErrorMsg>{errors.trailDescription}</ErrorMsg>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Amenities (Optional)</Label>
          <CheckboxDropdown ref={dropdownRef}>
            <DropdownToggle onClick={toggleDropdown}>
              {dropdownOpen ? "Select Amenities" : "Select Amenities ▼"}
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
                      onChange={handleChange}
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
            onChange={handleChange}
            multiple
          />
          <ImagePreviewContainer>
            {imagePreviews.map((previewUrl, index) => (
              <ImagePreview
                key={index}
                src={previewUrl}
                alt={`Trail Preview ${index + 1}`}
              />
            ))}
          </ImagePreviewContainer>
          {/* {errors.trailImages && <ErrorMsg>{errors.trailImages}</ErrorMsg>} */}
        </FormGroup>

        <FormButtons>
          <SubmitButton type="submit" onClick={onLeft}>
            {leftButton}
          </SubmitButton>
          <ClearButton onClick={onRight}>{rightButton}</ClearButton>
        </FormButtons>
      </form>
    </FormContainer>
  );
};

export default TrailForm;
