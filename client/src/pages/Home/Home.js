import React, { useState, useEffect } from "react";
import axios from 'axios'
import styles from './Home.module.css'
import mainImg from '../../assets/mainPageImg.jpg'
import { NavLink } from 'react-router-dom'
import PopularityOfContryHome from "../../components/PopularityOfContryHome"

// URL 주소: / 

function Home(){
    const [list, setList] = useState([])
    const [filter, setFilter] = useState()
    const [filteredList, setFilterList] = useState([])
    const [isLoad, setIsLoad] = useState(false)
    const [isLoad2, setIsLoad2] = useState(false)
    // console.log(filteredList)
    const handleChange = (e) => {
        const { value } = e.target 
        setFilter(value)
    }

    // 나라별 인기 여행지 리스트 5개씩 가져오기
    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/itinerarys/destination/list/popularity`)
        .then((res) => {
            const result = res.data.destinations.map(destination => {
                const places = destination.place.filter((place, id) => {
                    if(id < 5){
                        return place
                    }
                })
                return (
                    {
                        contry: destination._id,
                        places: places
                    }
                )
            }).filter(res => res.contry)
            setList(result)
            setFilterList(result)
            setFilter(result[0].contry)
        })
    }, [])

    // 나라별 필터
    useEffect(() => {
        const listFiltered = list.filter(places => places.contry === filter)
        setFilterList(listFiltered)
    }, [filter])

        // 나라별 필터
    useEffect(() => {
        setTimeout(() => {
            setIsLoad(true)
        }, 100)

        setTimeout(() => {
            setIsLoad2(true)
        }, 800) 
    }, [])

    return (
        <>
            {list.length !== 0 && filteredList !== 0 &&
                <div className={styles.HomePage}>
                    <div className={styles.mainImgContainer}>
                        <img className={styles.img} src={mainImg}></img>
                        <div className={isLoad ?
                            `${styles.phrase} ${styles.sizeUp}` :
                            `${styles.phrase}`
                        }>여행을 기록하다.</div>
                        <NavLink className={isLoad2 ?
                            `${styles.createBtn} ${styles.sizeUp}` :
                            `${styles.createBtn}`
                        } to='/itinerary/create'>시작하기</NavLink>
                    </div>
                    <div className={styles.PopularityDestinationContainer}>
                        <div className={styles.filter}>
                            <select name="contry" id="contry" onChange={handleChange} value={filter}>   
                                {list.map((place, id) => 
                                    <option key={id} value={place.contry}>{place.contry}</option>
                                )}              
                            </select>
                        </div>
                            {filteredList.length !== 0 &&
                                filteredList.map((place, id) => 
                                    <PopularityOfContryHome key={id} place={place} isMain={true}/>
                                )        
                            }
                    </div>
                </div>
            }
        </>
    )
}
export default Home