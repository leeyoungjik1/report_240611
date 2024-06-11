import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom'
import API from '../../API'
import moment from 'moment'
import axios from 'axios'
import styles from './Create.module.css'
// import DatePicker from "../../components/DatePicker";

// URL 주소: /itinerary/create

function Create(){
    const navigate = useNavigate()

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
        e.preventDefault()
        axios.get('http://127.0.0.1:5000/api/users/getId', {
            headers: {
                'Constent-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            let postData = {...formData, userId: res.data._id}
            if(!title){
                const {userId, city, dateOfStart, dateOfEnd, description, isPublic} = postData
                postData = {userId, city, dateOfStart, dateOfEnd, description, isPublic}
            }
            axios.post('http://127.0.0.1:5000/api/itinerarys/create', postData, {
                headers: {
                    'Constent-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                setFormData({
                    title: '',
                    city: '',
                    dateOfStart: '',
                    dateOfEnd: '',
                    description: '',
                    isPublic: true
                })
                alert("새로운 여행 일정이 생성되었습니다.\n세부 여행 계획을 추가해주세요.")
                navigate(`/itinerary/details/${res.data._id}`)
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/users/getId', {
          headers: {
              'Constent-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        })
        .then((res) => console.log(res))
        .catch(err => {
            if(err.response.data.code === 401 || err.response.data.code === 419){
                alert('로그인이 필요한 페이지 입니다.')
                navigate("/login")
            }
        })
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
            <h1>새로운 여행</h1>
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

export default Create