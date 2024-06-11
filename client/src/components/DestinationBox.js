import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment'
import { useParams, useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom'
import styles from './DestinationBox.module.css'
import { IoMdTime } from "react-icons/io";
import { FaRegMoneyBillAlt } from "react-icons/fa";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

function DestinationBox({destination, index, weatherSearch, handleClick, isShared, number}){
    const [weather, setWeather] = useState({
        "weatherIconSrc": "",
        "temp": {}
    })
    const [imgSrc, setImgSrc] = useState()

    useEffect(() => {
        if(place_id){
            axios.get(`https://places.googleapis.com/v1/places/${place_id}?fields=photos&key=${API_KEY}`)
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
    }, [destination])

    // console.log(weather, destination)
    // console.log(weather)
    // console.log(`${moment(destination.timeOfStart).format('MM-DD')} ${weather}`)

    // 위치 기반 날씨 정보 불러오기
    useEffect(() => {
        const lat = destination.destinationInfo.location.lat
        const lng = destination.destinationInfo.location.lng
        const APIKey = process.env.REACT_APP_OPENWEATHER_API_KEY

        if(lat){
            axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly&units=metric&appid=${APIKey}`)
            .then((res) => {
                const daySearched = res.data.daily.find(day => {
                    return moment(day.dt*1000).format('YYYY-MM-DD') === moment(destination.date).format('YYYY-MM-DD')
                })
                if(daySearched){
                    setWeather({
                        weatherIconSrc: `http://openweathermap.org/img/wn/${daySearched.weather[0].icon}@2x.png`,
                        temp: daySearched.temp
                    })
                    // console.log('목적지 날씨 정보를 숙소 날씨로 전송')
                    weatherSearch({
                        weatherIconSrc: `http://openweathermap.org/img/wn/${daySearched.weather[0].icon}@2x.png`,
                        temp: daySearched.temp
                    })
                }
            })
        }

        return () => {
            setWeather({
                "weatherIconSrc": "",
                "temp": {}
            })
        }
    }, [destination])

    const {
        timeOfStart,
        timeOfEnd,
        isDone,
        category,
        title,
        address,
        description,
        destinationInfo: {place_id},
        cost,
        _id
    } = destination
    console.log((number+1) % 7)
    return (
        <div className={styles.destinationBox}>
            <div className={styles.order}>
                <div className={`${styles.number}
                    ${
                        (number+1) % 7 === 1 && styles.red ||
                        (number+1) % 7 === 2 && styles.orange ||
                        (number+1) % 7 === 3 && styles.yellow ||
                        (number+1) % 7 === 4 && styles.green ||
                        (number+1) % 7 === 5 && styles.blue ||
                        (number+1) % 7 === 6 && styles.indigo ||
                        (number+1) % 7 === 0 && styles.purple
                    }
                `}>{index+1}</div>
                <div className={styles.line}></div>
            </div>
            <div className={styles.destinationInfoBox}>
                <div className={styles.destinationInfoTop}>
                    <div>
                        <div className={styles.time}>
                            <IoMdTime size="15" color="#2F80ED"/>
                            {moment(timeOfStart).format('HH:mm')} ~ {moment(timeOfEnd).format('HH:mm')}
                        </div>
                        {weather.weatherIconSrc &&
                            <div className={styles.destinationWeather}>
                                <img src={weather.weatherIconSrc}></img>
                                <div>{Math.round(weather.temp.min)}°C / {Math.round(weather.temp.max)}°C</div>
                            </div>
                        }
                    </div>
                    {!isShared && 
                        <button id={_id} onClick={handleClick}>{isDone ? '완료' : '예정'}</button>
                    }
                </div>
                <div className={styles.destinationInfoMain}>
                    <div className={styles.destinationInfoTitle}>
                        <div className={
                            category === '음식점' && `${styles.restaurant}` ||
                            category === '관광명소' && `${styles.spot}` ||
                            category === '카페' && `${styles.cafe}` ||
                            category === '쇼핑센터' && `${styles.shop}` ||
                            category === '바' && `${styles.bar}` ||
                            category === '기타' && `${styles.rest}` ||
                            category === '미정' && `${styles.tbd}`
                        }>{category}</div>
                        <div className={styles.title}>{title}</div>
                        <div>{address}</div>
                        <div className={styles.description}>{description}</div>
                        {cost && 
                            <div className={styles.cost}><FaRegMoneyBillAlt size="15" color="#01796F"/> {cost.toLocaleString()}원</div>
                        }
                    </div>
                    <img src={imgSrc} alt={title}></img>
                </div>
            </div>
        </div>
    )
}

export default DestinationBox