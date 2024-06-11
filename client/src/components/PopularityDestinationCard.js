import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment'
import { useParams, useNavigate, NavLink, Link, useSearchParams, useLocation } from 'react-router-dom'
import styles from './PopularityDestinationCard.module.css'
import { FaStar } from "react-icons/fa6";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

function PopularityDestinationCard({placeId}){
    const [place, setPlace] = useState({
        category: '',
        imgUrl: '',
        title: '',
        address: '',
        count: placeId.count,
        googleUrl: '',
        rating: ''
    })

    useEffect(() => {
        if(placeId){
            axios.get(`https://places.googleapis.com/v1/places/${placeId.destinationId}?fields=displayName.text,googleMapsUri,photos,primaryTypeDisplayName.text,shortFormattedAddress,rating&key=${API_KEY}`)
            .then((res) => {
                // console.log(res)
                const {displayName: {text: title}, googleMapsUri, photos, primaryTypeDisplayName, shortFormattedAddress, rating} = res.data
                setPlace({
                    category: primaryTypeDisplayName && primaryTypeDisplayName.text,
                    imgUrl: photos && photos.length !== 0 ?
                        `https://places.googleapis.com/v1/${photos[0].name}/media?maxHeightPx=300&key=${API_KEY}` : 
                        "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        ,
                    title: title,
                    address: shortFormattedAddress,
                    count: placeId.count,
                    googleUrl: googleMapsUri,
                    rating: rating || '없음'
                })
            })
        }

        return () => {
            setPlace({
                category: '',
                imgUrl: '',
                title: '',
                address: '',
                count: placeId.count,
                googleUrl: ''
            })
        }
    }, [placeId])

    const {
        category,
        imgUrl,
        title,
        address,
        count,
        googleUrl,
        rating
    } = place

    return (
        <>
        {place && 
            <div className={styles.popularityDestinationCard}>
                <NavLink to={googleUrl} target="_blank">
                    <img src={imgUrl} alt={title}></img>
                    <div className={styles.details}>
                        <div className={styles.text}>
                            <div>{title}</div>
                            <div className={styles.rating}><FaStar size="15" color="#FFD700"/>{rating}</div>
                        </div>
                        {/* <NavLink className={styles.detailsBtn} to={googleUrl} target="_blank">상세보기</NavLink> */}
                    </div>
                </NavLink>
                {/* <div>{category}</div> */}
                {/* <div>{address}</div>
                <div>여행지 등록 수: {count}</div> */}
            </div>
        }
        </>


    )
}

export default PopularityDestinationCard