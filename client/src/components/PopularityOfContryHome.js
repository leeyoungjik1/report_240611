import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment'
import { useParams, useNavigate, NavLink, Link, useSearchParams, useLocation } from 'react-router-dom'
import styles from './PopularityOfContryHome.module.css'
import PopularityDestinationCard from "./PopularityDestinationCard";

function PopularityOfContryHome({place}){
    return (
        <div className={styles.popularityOfContryContainer}>
            <div className={styles.popularityDestinationCard}>
                <div className={styles.decription}>
                    <h2>인기 여행지</h2>
                    <div>{place.contry}</div>
                </div>
                {place && 
                    place.places.map((place, id) => 
                        <PopularityDestinationCard key={id} placeId={place}/>
                    )
                }
            </div>
        </div>
    )
}

export default PopularityOfContryHome