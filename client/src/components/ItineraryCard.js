import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import styles from './ItineraryCard.module.css'
import { FaTreeCity } from "react-icons/fa6";
import { FaCalendarDays } from "react-icons/fa6";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const ItineraryCard = function ({city, dateOfEnd, dateOfStart, description, title, status, open, placeId, handleClick, children}){
    const [imgSrc, setImgSrc] = useState()

    useEffect(() => {
        console.log('카드 새로 렌더링함!')
        if(placeId){
            axios.get(`https://places.googleapis.com/v1/places/${placeId}?fields=photos&key=${API_KEY}`)
            .then((res) => {
                const {photos} = res.data
                setImgSrc(photos && photos.length !== 0 &&
                            `https://places.googleapis.com/v1/${photos[0].name}/media?maxHeightPx=300&key=${API_KEY}` ||
                            "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        )
            })
        }else{
            setImgSrc("https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
        }

        return () => {
            setImgSrc()
        }
    }, [placeId])

    return (
        <div className={styles.itineraryCardBox}>
            <div className={styles.itineraryCardState}>
                <div className={styles.isPublic}>{open}</div>
                <div className={styles.state}>{status}</div>
            </div>
            <div className={styles.itineraryCardMain}>
                <div className={styles.itineraryCardDetails}>
                    <img src={imgSrc}></img>
                    <div>
                        <div className={styles.title}>{title}</div>
                        {city &&
                            <div><FaTreeCity size='15' color='#607D8B'/> {city}</div>
                        }
                        <div>
                            <FaCalendarDays size='15' color='#2F80ED'/> {moment(dateOfStart).format('YYYY-MM-DD')} ~ {moment(dateOfEnd).format('YYYY-MM-DD')}
                        </div>
                        {description &&
                            <div className={styles.description}>{description}</div>
                        }
                    </div>
                </div>
                <div className={styles.itineraryCardBtns} onClick={handleClick}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ItineraryCard