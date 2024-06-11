import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment'
import { useParams, useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom'
import styles from './SharedItineraryCard.module.css'
import { FaTreeCity } from "react-icons/fa6";
import { FaCalendarDays } from "react-icons/fa6";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { FaShareNodes } from "react-icons/fa6";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

function SharedItineraryCard({itinerary}){
    const navigate = useNavigate()

    const [totalcost, setTotalcost] = useState(0)
    // console.log(itinerary)

    const [imgSrc, setImgSrc] = useState()

    // 해당 일정 이미지 불러오기
    useEffect(() => {
        // 해당 일정의 imgSrc 불러오기
        if(itinerary.length !== 0){
            const placeIdSearched1 = itinerary.itineraryByDateIds.map((itineraryByDateId) => {
                return (
                    itineraryByDateId.destinationIds.map((destinationId) => {
                        return destinationId.destinationInfo.place_id
                    })
                )
            })
            const placeIdSearched2 = placeIdSearched1.find(res => {
                return res.length !== 0 && res[0] !== ''
            })
            let placeIdSearched3 = undefined
            if(placeIdSearched2){
                placeIdSearched3 = placeIdSearched2.find(res => {
                    return res
                })
            }
            if(placeIdSearched3){
                axios.get(`https://places.googleapis.com/v1/places/${placeIdSearched3}?fields=photos&key=${API_KEY}`)
                .then((res) => {
                    console.log(res)
                    const {photos} = res.data
                    setImgSrc(photos && photos.length !== 0 &&
                                `https://places.googleapis.com/v1/${photos[0].name}/media?maxWidthPx=500&key=${API_KEY}` ||
                                "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            )
                })
                // console.log(placeIdSearched3)
            }else{
                setImgSrc("https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
            }
        }

        return () => {
            setImgSrc()
        }
    }, [itinerary])

    const changePage = (e) => {
        // console.dir(e.target.id)
        if(e.target.tagName !== 'BUTTON'){
            if(e.target.id){
                navigate(`/itinerary/shareditinerary/${e.target.id}`)
            }
        }
    }

    // 일정 총 예상 비용 불러오기
    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/itinerarys/totalcost/${itinerary._id}`)
        .then((res) => {
            // console.log(res)
            setTotalcost(res.data.totalcost)
        })
    }, [])

    const {title, city, dateOfStart, dateOfEnd, description, _id, lastModifiedAt} = itinerary
    return (
        <div className={styles.container} onClick={changePage}>
            <div className={styles.user}>{`${itinerary.userId.nickName}님의 여행 계획`}</div>
            <div className={styles.details} id={_id}>
                <img src={imgSrc} alt={title} id={_id}></img>
                <div className={styles.infomation} id={_id}>
                    <div className={styles.infoTop} id={_id}>
                        <div>{title}</div>
                        <button><FaShareNodes size='25'/></button>
                    </div>
                    <div className={styles.infoMain} id={_id}>
                        {city &&
                            <div><FaTreeCity size='15' color='#607D8B'/> {city}</div>
                        }
                        <div>
                            <FaCalendarDays size='15' color='#2F80ED'/>  {moment(dateOfStart).format('YYYY-MM-DD')} ~ {moment(dateOfEnd).format('YYYY-MM-DD')}
                        </div>
                        {totalcost !== 0 &&
                            <div><FaRegMoneyBillAlt size="15" color="#01796F"/>{Number(totalcost).toLocaleString()}원</div>
                        }
                        <div className={styles.description}>{description}</div>
                    </div>
                </div>
            </div>
            <div className={styles.createdAt}>작성일자: {moment(lastModifiedAt).format('YYYY-MM-DD')}</div>
        </div>
    )
}

export default SharedItineraryCard