import React, { useState, useEffect } from "react";
import axios from 'axios'
import { useParams, useNavigate, NavLink, useSearchParams, useLocation } from 'react-router-dom'
import moment from 'moment'
import GoogleMap from "./GoogleMap";
import styles from './ModDestinationCard.module.css'

// URL 주소: /itinerary/details/:itineraryId

function ModDestinationCard({destinationId, changeSubmit, isShow}){
    const navigate = useNavigate()
    const params = useParams()

    // ItineraryByDate 모델에 대한 서버로 전송할 최종 데이터
    const [formData, setFormData] = useState({
        title: '',
        address: '',
        category: '',
        timeOfStart: '',
        timeOfEnd: '',
        description: '',
        cost: '',
        destinationInfo: {}
    })

    // 목적지 데이터 가져오기
    useEffect(() => {
        if(params.itineraryId){
            axios.get(`http://127.0.0.1:5000/api/itinerarys/destination/${destinationId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((res) => {
                // console.log(res)
                setFormData({
                    title: res.data.title,
                    address: res.data.address,
                    category: res.data.category,
                    timeOfStart: moment(res.data.timeOfStart).format('YYYY-MM-DD HH:mm'),
                    timeOfEnd: moment(res.data.timeOfEnd).format('YYYY-MM-DD HH:mm'),
                    description: res.data.description,
                    cost: res.data.cost
                })
            })
        }

        return () => {
            setDestinationGoogleData({
                name: '',
                address: '',
                country: '',
                location: {
                    lat: '',
                    lng: ''
                },
                photoUrl: '',
                place_id: '',
            })
        }
    }, [destinationId])

    const [destinationGoogleData, setDestinationGoogleData] = useState({
        name: '',
        address: '',
        country: '',
        location: {
            lat: '',
            lng: ''
        },
        photoUrl: '',
        place_id: '',
    })

    // 구글 지도에서 위치를 선택하였을때 숙소 정보에 대한 데이터 저장
    const getDestinationSearched = (data) => {
        if(data && data.geometry){
            const {name, geometry:{location}, vicinity, photos, place_id, country} = data
            setDestinationGoogleData({
                name: name,
                address: vicinity,
                country: country,
                location: {
                    lat: location.lat(),
                    lng: location.lng()
                },
                photoUrl: photos ? photos[0].getUrl() : '',
                place_id: place_id
            })
        }
    }

    const handleChange = (e) => {
        const { name, value} = e.target 
        setFormData({ ...formData, [name]: value })
    }

    // 최종 Destination 모델에 대한 데이터 서버로 전송
    const handleSubmit = (e) => {
        if(e.target.type === 'button'){
            changeSubmit({name: 'cancleModDes', id: destinationId})
        }else{
            if(window.confirm("여행지 일정을 수정하시겠습니까?")){
                e.preventDefault()
                axios.get('http://127.0.0.1:5000/api/users/getId', {
                    headers: {
                        'Constent-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res) => {
                    axios.put(`http://127.0.0.1:5000/api/itinerarys/destination/${destinationId}`, formData, {
                        headers: {
                            'Constent-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("token")}`
                        }
                    }).then((res) => {
                        // console.log(res)
                        changeSubmit({name: 'submitModDes', res: res})
                    }).catch((err) => {
                        console.log(err)
                    })
                })
            }else{
                e.preventDefault()
                changeSubmit({name: 'cancleModDes', id: destinationId})
            }
        }
    }
    

    // 구글 지도 선택 시 서버로 전송할 데이터 변경
    useEffect(() => {
        setFormData({
            ...formData, 
            title: destinationGoogleData.name,
            address: destinationGoogleData.address,
            destinationInfo: destinationGoogleData
        })
    }, [destinationGoogleData])

    // 시작 시간 < 종료 시간
    useEffect(() => {
        if(moment(timeOfEnd).isBefore(moment(timeOfStart))){
            console.log('시간 선택 오류')
            // alert('시간 선택 오류')
            setFormData({ ...formData, timeOfEnd: timeOfStart})
        }
    }, [formData])

    const {
        title,
        address,
        category,
        timeOfStart,
        timeOfEnd,
        description,
        cost
    } = formData 

    return (
        <div className={isShow ?
            `${styles.addDestinationContainer} ${styles.show}` :
            `${styles.addDestinationContainer}`
        }>
            <form onSubmit={handleSubmit}>
                <div className={styles.addDestinationInfoContainer}>
                    {destinationGoogleData.photoUrl && <img src={destinationGoogleData.photoUrl}></img>}
                    <div>
                        <div>
                            <label htmlFor="title">여행지명</label>
                            <input type="text" name="title" id="title" onChange={handleChange} value={title || ''} required/>
                        </div>
                        <div>
                            <label htmlFor="address">여행지 주소</label>
                            <input type="text" name="address" id="address" onChange={handleChange} value={address || ''}/>
                        </div>
                    </div>
                </div>
                <GoogleMap handleChange={getDestinationSearched}/>
                <div className={styles.addDestinationInfo}>
                    <label htmlFor="category">카테고리</label>
                    <select name="category" id="category" onChange={handleChange} value={category}>
                        <option value="음식점">음식점</option>
                        <option value="관광명소">관광명소</option>
                        <option value="카페">카페</option>
                        <option value="쇼핑센터">쇼핑센터</option>
                        <option value="바">바</option>
                        <option value="기타">기타</option>
                        <option value="미정">미정</option>
                    </select>
                    <div className={styles.times}>
                        <div>
                            <label htmlFor="timeOfStart">일정 시작 시작</label>
                            <input type="datetime-local" name="timeOfStart" id="timeOfStart" required onChange={handleChange} value={timeOfStart} min={moment(timeOfStart).startOf("day").format("YYYY-MM-DD HH:mm")} max={moment(timeOfStart).endOf("day").format("YYYY-MM-DD HH:mm")}/>
                        </div>
                        <div>
                            <label htmlFor="timeOfEnd">일정 종료 시간</label>
                            <input type="datetime-local" name="timeOfEnd" id="timeOfEnd" required onChange={handleChange} value={timeOfEnd} min={moment(timeOfStart).format("YYYY-MM-DD HH:mm")} max={moment(timeOfStart).endOf("day").format("YYYY-MM-DD HH:mm")}/>
                        </div>
                    </div>
                    <label htmlFor="description">여행지 내용</label>
                    <input type="text" name="description" id="description" onChange={handleChange} value={description || ''}/>
                    <label htmlFor="cost">예상 비용</label>
                    <input type="number" name="cost" id="cost" onChange={handleChange} value={cost || ''}/>
                </div>
                <button type="submit">여행지 수정</button>
                <button type="button" id='cancleModDes' onClick={handleSubmit}>취소</button>
            </form>
        </div>
    )
}
export default ModDestinationCard