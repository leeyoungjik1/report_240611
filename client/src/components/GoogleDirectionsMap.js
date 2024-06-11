import React from 'react';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const GoogleDirectionsMap = ({itinerary}) => {
    // console.log(itinerary)
    const accommodationPlaceId =itinerary.itineraryByDateIds[0].accommodationInfo.place_id
    let destinationPlaceIds = []
    let destinationPlaceIdsFiltered = []
    let waypoints = ''
    let url = null
    if(itinerary.itineraryByDateIds && itinerary.itineraryByDateIds.length === 1){
        if(itinerary.itineraryByDateIds[0].destinationIds.length !== 0){
            destinationPlaceIds = itinerary.itineraryByDateIds[0].destinationIds.map(destination => {
                return destination.destinationInfo.place_id
            })
        }
    }
    if(destinationPlaceIds.length !== 0){
        destinationPlaceIdsFiltered = destinationPlaceIds.filter(destinationPlaceId => destinationPlaceId)
    }
    // console.log(destinationPlaceIdsFiltered)

    if(accommodationPlaceId){
        if(destinationPlaceIdsFiltered){
            if(destinationPlaceIdsFiltered.length === 1){
                url = `https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=place_id:${accommodationPlaceId}&destination=place_id:${destinationPlaceIdsFiltered[0]}&mode=driving&zoom=14`
            }else if(destinationPlaceIdsFiltered.length === 2){
                url = `https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=place_id:${accommodationPlaceId}&waypoints=place_id:${destinationPlaceIdsFiltered[0]}&destination=place_id:${destinationPlaceIdsFiltered[1]}&mode=driving&zoom=14`
            }else if(destinationPlaceIdsFiltered.length > 2){
                waypoints = `place_id:` + destinationPlaceIdsFiltered[0]
                for(let i = 1; i<destinationPlaceIdsFiltered.length-1; i++){
                    waypoints = waypoints + `|place_id:` + destinationPlaceIdsFiltered[i]
                }
                url = `https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=place_id:${accommodationPlaceId}&waypoints=${waypoints}&destination=place_id:${destinationPlaceIdsFiltered[destinationPlaceIdsFiltered.length-1]}&mode=driving&zoom=14`
            }
        }
    }else{
        if(destinationPlaceIdsFiltered){
            if(destinationPlaceIdsFiltered.length === 1){
                url = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=place_id:${destinationPlaceIdsFiltered[0]}&zoom=14`
            }else if(destinationPlaceIdsFiltered.length === 2){
                url = `https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=place_id:${destinationPlaceIdsFiltered[0]}&destination=place_id:${destinationPlaceIdsFiltered[1]}&mode=driving&zoom=14`
            }else if(destinationPlaceIdsFiltered.length > 2){
                waypoints = `place_id:` + destinationPlaceIdsFiltered[1]
                for(let i = 2; i<destinationPlaceIdsFiltered.length-1; i++){
                    waypoints = waypoints + `|place_id:` + destinationPlaceIdsFiltered[i]
                }
                url = `https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=place_id:${destinationPlaceIdsFiltered[0]}&waypoints=${waypoints}&destination=place_id:${destinationPlaceIdsFiltered[destinationPlaceIdsFiltered.length-1]}&mode=driving&zoom=14`
            }
        }
    }


    // console.log(url)
    return (
        <iframe
            src={url || "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
        />
    );
};


export default GoogleDirectionsMap;




