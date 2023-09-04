import React, { useRef, useEffect, useState } from "react";

const GoogleMap = ({
  trailLat,
  trailLng,
  streetViewControl,
  gestureHandling,
  draggable,
  clickEnabled,
  h,
  w,
  mapSearch,
  onMarkerPositionChange,
}) => {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const autocomplete = useRef(null);
  const [markerPosition, setMarkerPosition] = useState({
    lat: 0,
    lng: 0,
  });

  const updateMarkerPosition = (newPosition) => {
    setMarkerPosition(newPosition);
    if (onMarkerPositionChange) {
      onMarkerPositionChange(newPosition);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const initialMarkerPosition = {
          lat: trailLat ? parseFloat(trailLat) : latitude,
          lng: trailLng ? parseFloat(trailLng) : longitude,
        };

        const map = new window.google.maps.Map(mapRef.current, {
          center: initialMarkerPosition,
          zoom: 14,
          streetViewControl: streetViewControl,
          gestureHandling: gestureHandling,
          minZoom: 10,
          maxZoom: 18,
        });

        const marker = new window.google.maps.Marker({
          position: initialMarkerPosition,
          map: map,
          draggable: draggable,
        });

        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          const newPosition = { lat: position.lat(), lng: position.lng() };
          updateMarkerPosition(newPosition);
        });


        if (clickEnabled) { 
            map.addListener("click", (event) => {
              const newPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
              };
  
              updateMarkerPosition(newPosition);
              marker.setPosition(newPosition);
            });
          }

        autocomplete.current = new window.google.maps.places.Autocomplete(
          searchInputRef.current
        );

        autocomplete.current.bindTo("bounds", map);

        autocomplete.current.addListener("place_changed", () => {
          const place = autocomplete.current.getPlace();
          if (!place.geometry) {
            console.log("No details available for input: ", place.name);
            return;
          }

          const newPosition = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          updateMarkerPosition(newPosition);
          marker.setPosition(newPosition);
          map.setCenter(newPosition);
        });
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  }, []);

  return (
    <div>
      {mapSearch && (
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for a place..."
          style={{ marginBottom: "10px" }}
        />
      )}
      <div ref={mapRef} style={{ height: h, width: w }} />
    </div>
  );
};

export default GoogleMap;
