import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../API'
import moment from 'moment'
import axios from 'axios'
import styles from './Modify.module.css'

// URL 주소: /itinerary/modify/:itineraryId

function Modify(){
    const navigate = useNavigate()
    const params = useParams()

    const [formData, setFormData] = useState({
        title: '',
        city: '',
        dateOfStart: '',
        dateOfEnd: '',
        description: '',
        isPublic: true
    })

    const handleChange = (e) => {
        const { name, value} = e.target 
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e) => {
        if(window.confirm("일정을 수정 하시겠습니까?")){
            e.preventDefault()
            axios.get('http://127.0.0.1:5000/api/users/getId', {
                headers: {
                    'Constent-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                axios.put(`http://127.0.0.1:5000/api/itinerarys/changelist/${params.itineraryId}`, formData, {
                    headers: {
                        'Constent-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res) => {
                    navigate(`/itinerary/details/${params.itineraryId}`)
                }).catch((err) => {
                    console.log(err)
                })
            })
        }else{
            navigate(`/itinerary/details/${params.itineraryId}`)
        }

    }

    useEffect(() => {
        if(params.itineraryId){
            axios.get(`http://127.0.0.1:5000/api/itinerarys/details/${params.itineraryId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((res) => {
                // console.log(res.data)
                const {title, city, dateOfStart, dateOfEnd, description, isPublic} = res.data
                setFormData({
                    title, 
                    city, 
                    dateOfStart: moment(dateOfStart).format('YYYY-MM-DD'), 
                    dateOfEnd: moment(dateOfEnd).format('YYYY-MM-DD'), 
                    description, 
                    isPublic
                })
            })
        }
    }, [])

    const {
        title,
        city,
        dateOfStart,
        dateOfEnd,
        description,
    } = formData 

    return (
        <div className={styles.createPage}>
            <h1>여행 수정</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.title}>
                    <label htmlFor="title">여행 제목</label>
                    <input type="text" name="title" id="title" onChange={handleChange} value={title}/>
                </div>
                <div className={styles.city}>
                    <label htmlFor="city">대표 도시</label>
                    <input type="text" name="city" id="city" onChange={handleChange} value={city}/>
                </div>
                <div className={styles.dates}>
                    <div>
                        <label htmlFor="dateOfStart">여행 시작일</label>
                        <input type="date" name="dateOfStart" id="dateOfStart" required onChange={handleChange} value={dateOfStart} max={dateOfEnd}/>
                    </div>
                    <div>
                        <label htmlFor="dateOfEnd">여행 종료일</label>
                        <input type="date" name="dateOfEnd" id="dateOfEnd" required onChange={handleChange} value={dateOfEnd} min={dateOfStart}/>
                    </div>
                </div>
                <div className={styles.description}>
                    <label htmlFor="description">여행 내용</label>
                    <textarea type="text" name="description" id="description" onChange={handleChange} value={description}/>
                </div>
                <div className={styles.isPublic}>
                    <label htmlFor="isPublic">공개 여부</label>
                    <div>
                        <input type="radio" name="isPublic" id="isPublic" onChange={handleChange} defaultChecked value={true}/>공개
                        <input type="radio" name="isPublic" id="isPublic" onChange={handleChange} value={false}/>비공개
                    </div>
                </div>
                <button type="submit">여행 저장</button>
            </form>
        </div>
    )
}

export default Modify