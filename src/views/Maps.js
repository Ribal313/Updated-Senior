import React, { useEffect, useRef, useState } from "react";

function Maps() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const google = window.google;

    if (!google || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLatLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        const mapOptions = {
          zoom: 14,
          center: userLatLng,
          scrollwheel: true,
        };

        const gMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(gMap);

        new google.maps.Marker({
          position: userLatLng,
          map: gMap,
          title: "You are here",
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Location access is required to show your position on the map.");
      }
    );
  }, []);

  return (
    <div className="map-container" style={{ height: "500px" }}>
      <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
}

export default Maps;
