import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import './GoogleMap.css'

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const GoogleMap = ({handleChange}) => {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [markerRef, marker] = useAdvancedMarkerRef();

    useEffect(() => {
      if(selectedPlace){
        let country = ''
        for (let i=0;i<selectedPlace.address_components.length;i++){
          for (let j=0;j<selectedPlace.address_components[i].types.length;j++){
             if(selectedPlace.address_components[i].types[j]=="country")
                country = selectedPlace.address_components[i].long_name
          }
        }
        handleChange({...selectedPlace, country: country})
      }
    }, [selectedPlace])

    return (
        <APIProvider apiKey={API_KEY}>
            <Map
            style={{width: '100%', height: '500px'}}
            defaultCenter={{lat: 37.56793408029149, lng: 126.9795527802915}}
            defaultZoom={13}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId='DEMO_MAP_ID'
            >
                <AdvancedMarker ref={markerRef} position={null} />
            </Map>
            <MapControl position={ControlPosition.TOP}>
                <div className="autocomplete-control">
                    <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
                </div>
            </MapControl>
            <MapHandler place={selectedPlace} marker={marker} />
        </APIProvider>
    )
}
const MapHandler = ({ place, marker }) => {
    const map = useMap();
  
    useEffect(() => {
      if (!map || !place || !marker) return;
  
      if (place.geometry?.viewport) {
        map.fitBounds(place.geometry?.viewport);
      }
  
      marker.position = place.geometry?.location;
    }, [map, place, marker]);
    return null;
  };

const PlaceAutocomplete = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "place_id", "photos", "address_components", "vicinity"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);
  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);
  return (
    <div className="autocomplete-container">
      <input ref={inputRef} />
    </div>
  );
};

export default GoogleMap;