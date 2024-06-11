import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment'
import styles from './DestinationCard.module.css'
import ModDestinationCard from "./ModDestinationCard";
import { IoMdTime } from "react-icons/io";
import { FaRegMoneyBillAlt } from "react-icons/fa";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

function DestinationCard({title, address, category, timeOfStart, timeOfEnd, description, cost, isDone, modDestinationCards, placeId, destinationId, changeSubmit, handleClick, children}){
    const findDestinationId = modDestinationCards.find(modDestinationCard => modDestinationCard === destinationId)
    const [imgSrc, setImgSrc] = useState()

    useEffect(() => {
        if(placeId){
            axios.get(`https://places.googleapis.com/v1/places/${placeId}?fields=photos&key=${API_KEY}`)
            .then((res) => {
                const {photos} = res.data
                setImgSrc(photos && photos.length !== 0 &&
                            `https://places.googleapis.com/v1/${photos[0].name}/media?maxWidthPx=500&key=${API_KEY}` ||
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
        <div className={styles.destinationCardContainer}>
            <div className={styles.isDone}>{isDone ? "완료" : "예정"}</div>
            <div className={styles.destinationCardMain}>
                <img src={imgSrc}></img>
                <div>
                    <div className={
                        category === '음식점' && `${styles.restaurant}` ||
                        category === '관광명소' && `${styles.spot}` ||
                        category === '카페' && `${styles.cafe}` ||
                        category === '쇼핑센터' && `${styles.shop}` ||
                        category === '바' && `${styles.bar}` ||
                        category === '기타' && `${styles.rest}` ||
                        category === '미정' && `${styles.tbd}`
                    }>{category}</div>
                    <div className={styles.time}>
                        <IoMdTime size="15" color="#2F80ED"/> {moment(timeOfStart).format('HH:mm')} ~ {moment(timeOfEnd).format('HH:mm')}
                    </div>
                    <div className={styles.title}>{title}</div>
                    <div>{address}</div>
                    <div className={styles.description}>{description}</div>
                    {cost && 
                        <div><FaRegMoneyBillAlt size="15" color="#01796F"/> {cost.toLocaleString()}원</div>
                    }
                </div>
            </div>
            <div className={styles.destinationCardBtns} onClick={handleClick}>
                {children}
            </div>
            <ModDestinationCard 
                destinationId={destinationId}
                changeSubmit={changeSubmit}
                isShow={findDestinationId ? true : false}
            />
        </div>
    )
}

export default DestinationCard