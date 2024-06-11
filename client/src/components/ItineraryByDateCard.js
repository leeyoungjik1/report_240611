import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment'
import { useParams, useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom'
import DestinationBox from "./DestinationBox";
import styles from './ItineraryByDateCard.module.css'
import { FaRegMoneyBillAlt } from "react-icons/fa";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

function ItineraryByDateCard({dateOfStart, itineraryByDate, changeDestinationState, isShared, number}){
    const [totalcost, setTotalcost] = useState(0)
    const [weather, setWeather] = useState({
        "weatherIconSrc": "",
        "temp": {}
    })
    const [accommodationImgSrc, setAccommodationImgSrc] = useState()

    // console.log(itineraryByDate, weather)

    const weatherSearchInDestination = (Searched) => {
        // console.log('날씨 정보 대체')
        setWeather(Searched)
        // if(!weather.weatherIconSrc){
            
        //     console.log('날씨 정보 대체2')
        // }
    }

    // 일정 총 예상 비용, 숙소 위치 기반 날씨 정보 불러오기
    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/itinerarys/bydate/totalcost/${itineraryByDate._id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res) => {
            // console.log(res)
            setTotalcost(res.data.totalcost)
        })
        
        if(itineraryByDate.accommodationInfo.location.lat){
            const lat = itineraryByDate.accommodationInfo.location.lat
            const lng = itineraryByDate.accommodationInfo.location.lng
            const APIKey = process.env.REACT_APP_OPENWEATHER_API_KEY

            // console.log(itineraryByDate, lat, weather)
            if(lat){
                axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly&units=metric&appid=${APIKey}`)
                .then((res) => {
                    // console.log(res.data)
                    const daySearched = res.data.daily.find(day => {
                        // console.log(moment(day.dt*1000).format('YYYY-MM-DD'), moment(itineraryByDate.date).format('YYYY-MM-DD'))
                        return moment(day.dt*1000).format('YYYY-MM-DD') === moment(itineraryByDate.date).format('YYYY-MM-DD')
                    })
                    if(daySearched){
                        // console.log(daySearched)
                        setWeather({
                            weatherIconSrc: `http://openweathermap.org/img/wn/${daySearched.weather[0].icon}@2x.png`,
                            temp: daySearched.temp
                        })
                    }
                })
            }
        }

        return () => {
            setWeather({
                "weatherIconSrc": "",
                "temp": {}
            })
        }
    }, [itineraryByDate])

    useEffect(() => {
        if(accommodationName){
            axios.get(`https://places.googleapis.com/v1/places/${place_id}?fields=photos&key=${API_KEY}`)
            .then((res) => {
                const {photos} = res.data
                setAccommodationImgSrc(photos && photos.length !== 0 &&
                            `https://places.googleapis.com/v1/${photos[0].name}/media?maxWidthPx=150&key=${API_KEY}` ||
                            "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        )
            })
        }else{
            setAccommodationImgSrc("https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
        }

        return () => {
            setAccommodationImgSrc()
        }
    }, [itineraryByDate])

    // D-day 설정
    const diffDate = moment(itineraryByDate.date).diff(moment(dateOfStart), 'days')

    const {
        accommodationName,
        accommodationAddress,
        accommodationCost,
        accommodationInfo: {place_id}
    } = itineraryByDate

    return (
        <div className={styles.itineraryByDateCard}>
            <div className={styles.totalInfoBox}>
                <div className={styles.totalInfoBoxTitle}>
                    <div className={styles.totalInfoBoxDate}>
                        <div>{diffDate+1}일차</div>
                        <div>{moment(itineraryByDate.date).format('YYYY-MM-DD')}</div>
                    </div>
                    <div className={styles.totalInfoBoxCost}>
                        <FaRegMoneyBillAlt size="20" color="#01796F"/>{Number(totalcost).toLocaleString()}원
                    </div>
                </div>
                {weather.weatherIconSrc &&
                    <div className={styles.totalInfoBoxWeather}>
                        <img src={weather.weatherIconSrc}></img>
                        <div>{Math.round(weather.temp && weather.temp.min)}°C / {Math.round(weather.temp && weather.temp.max)}°C</div>
                    </div>
                }
            </div>
            {accommodationName && 
                <div className={styles.accommodationInfoContainer}>
                    <h2>숙소</h2>
                    <div>
                        <div className={styles.accommodationInfoTitle}>
                            <div className={styles.accommodationName}>{accommodationName}</div>
                            <div>{accommodationAddress}</div>
                            <div className={styles.accommodationCost}><FaRegMoneyBillAlt size="20" color="#01796F"/>{Number(accommodationCost).toLocaleString()}원</div>
                        </div>
                        <img src={accommodationImgSrc} alt={accommodationName}></img>
                    </div>
                </div>
            }
            <div className={styles.destinationBoxContainer}>
                {itineraryByDate && itineraryByDate.destinationIds.map((destination, id) => {
                    return (
                        <DestinationBox
                            key={id}
                            destination={destination}
                            index={id}
                            weatherSearch={weatherSearchInDestination}
                            handleClick={changeDestinationState}
                            isShared={isShared}
                            number={number}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default ItineraryByDateCard