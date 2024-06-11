import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import ItineraryByDateButton from '../../components/ItineraryByDateButton'
import ItineraryByDateCard from '../../components/ItineraryByDateCard'
import GoogleDirectionsMap from "../../components/GoogleDirectionsMap";
import styles from './DetailedItinerary.module.css'
import { FaRegMoneyBillAlt } from "react-icons/fa";

// URL 주소: /itinerary/shareditinerary/:itineraryId

function DetailedItinerary(){
    const params = useParams()

    const [itinerary, setItinerary] = useState([])
    const [itineraryFixed, setItineraryFixed] = useState([])
    const [day, setDay] = useState('')
    // console.log(day)

    // 일차별 버튼 선택(1일차, 2일차 ...)
    const changeDay = (e) => {
        // console.dir(e.target)
        setDay(e.target.id)
    }

    // 전체 일정 버튼 선택
    const showAllItinerary = (e) => {
        setDay('')
    }

    // url 파라미터를 이용하여 선택된 일정 데이터 가져오기
    useEffect(() => {
        if(params.itineraryId){
            axios.get(`http://127.0.0.1:5000/api/itinerarys/details/sharedlist/${params.itineraryId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((res) => {
                setItinerary(res.data)
                setItineraryFixed(res.data)
            })
        }
    }, [])

    // 일차 버튼 클릭 시 선택된 일정 데이터 가져오기
    useEffect(() => {
        if(params.itineraryId && day){
            axios.get(`http://127.0.0.1:5000/api/itinerarys/details/sharedlist/ItineraryByDate/${params.itineraryId}/${day}`)
            .then((res) => setItinerary(res.data))
        }else{
            axios.get(`http://127.0.0.1:5000/api/itinerarys/details/sharedlist/${params.itineraryId}`)
            .then((res) => {
                setItinerary(res.data)
                setItineraryFixed(res.data)
            })
        }
    }, [day])

    return (
        <div className={styles.detailedItineraryPage}>
            <div>
                <div className={styles.selectDayBtns}>
                    <button  className={styles.showAllBtn} onClick={showAllItinerary}>전체일정</button>
                    {itineraryFixed.length !== 0 && 
                        itineraryFixed.itineraryByDateIds.map((itineraryByDate, id) => {
                            return (
                                <ItineraryByDateButton 
                                    key={id}
                                    dateOfStart={itinerary.dateOfStart}
                                    itineraryByDate={itineraryByDate}
                                    handelClick={changeDay}
                                />
                            )
                        })
                    }
                </div>
                <div className={styles.itineraryByDateContainer}>
                    <div className={styles.itineraryByDateInfo}>
                        <div className={styles.itineraryByDateTitle}>
                            <div className={styles.title}>{itinerary.title}</div>
                            <div className={styles.date}>{moment(itinerary.dateOfStart).format('YYYY-MM-DD')} ~ {moment(itinerary.dateOfEnd).format('YYYY-MM-DD')}</div>
                        </div>
                        <div className={styles.totalCost}>
                            <FaRegMoneyBillAlt size="25" color="#01796F"/>
                            {itinerary.lenght !== 0 ? Number(itinerary.totalcost).toLocaleString() : 0}원
                        </div>
                    </div>
                    <div className={styles.mainContents}>
                        <div className={styles.dayContents}>
                            {itinerary.length !== 0 && 
                                itinerary.itineraryByDateIds.map((itineraryByDate, id) => {
                                    return (
                                        <ItineraryByDateCard 
                                            key={id}
                                            dateOfStart={itinerary.dateOfStart}
                                            itineraryByDate={itineraryByDate}
                                            handelClick={changeDay}
                                            isShared={true}
                                            number={id}
                                        />
                                    )
                                })
                            }
                        </div>
                        {day && 
                            <div className={styles.googleMap}>
                                <GoogleDirectionsMap itinerary={itinerary}/>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DetailedItinerary