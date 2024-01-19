import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api";
import React from "react";

function Map(props) {
  const { portLoading, portDischarge } = props;

  if (!portLoading || !portDischarge) {
    return null;
  }

  const mapContainerStyle = {
    height: "400px",
    width: "100%",
  };

  const center = { lat: portLoading.lat, lng: portLoading.long };

  const paths = [
    { lat: portLoading.lat, lng: portLoading.long },
    { lat: portDischarge.lat, lng: portDischarge.long },
  ];

  const position = { lat: portLoading.lat, lng: portLoading.long };
  const position2 = { lat: portDischarge.lat, lng: portDischarge.long };

  const options = {
    fillColor: "lightblue",
    fillOpacity: 1,
    strokeColor: "red",
    strokeOpacity: 1,
    strokeWeight: 3,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1,
  };

  const onLoad = (polygon) => {
    console.log(polygon);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyABKKssrJTRBZBeH6BJwni5C90pff9PUbc">
      <GoogleMap
        id="google-map"
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
      >
        <Polygon onLoad={onLoad} paths={paths} options={options} />
        <Marker onLoad={onLoad} position={position} label={portLoading.name} />
        <Marker
          onLoad={onLoad}
          position={position2}
          label={portDischarge.name}
        />
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
