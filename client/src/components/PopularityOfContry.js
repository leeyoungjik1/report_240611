import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment'
import { useParams, useNavigate, NavLink, Link, useSearchParams, useLocation } from 'react-router-dom'
import styles from './PopularityOfContry.module.css'
import PopularityDestinationCard from "./PopularityDestinationCard";

function PopularityOfContry({place}){

    return (
        <div className={styles.popularityOfContryContainer}>
            <h2>{place.contry}</h2>
            <div className={styles.popularityDestinationCard}>
                {place && 
                    place.places.map((place, id) => 
                        <PopularityDestinationCard key={id} placeId={place}/>
                    )
                }
            </div>
        </div>

    )
}

export default PopularityOfContry