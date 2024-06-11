import React, { useState, useEffect } from "react";
import axios from 'axios'
import { NavLink } from "react-router-dom";
import PopularityOfContry from "../../components/PopularityOfContry";
import styles from './List.module.css'

// URL 주소: /itinerary/popularitydestination

function PopularityDestination(){
    const [list, setList] = useState([])
    const [filter, setFilter] = useState('all')
    const [filteredList, setFilterList] = useState([])
    // console.log(list)
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
        })
    }, [])

    // 나라별 필터
    useEffect(() => {
        if(filter === 'all'){
            setFilterList(list)
        }else{
            const listFiltered = list.filter(places => places.contry === filter)
            setFilterList(listFiltered)
        }
    }, [filter])
    
    return (
        <>
            {list.length !== 0 && filteredList !== 0 &&
                <div className={styles.listPage}>
                    <h1>인기 여행지</h1>
                    <div className={styles.contents}>
                        {filteredList.length !== 0 &&
                            <div className={styles.filter}>
                                <label htmlFor="contry">나라별 보기</label>
                                <select name="contry" id="contry" onChange={handleChange} value={filter}>   
                                    <option value="all">전체보기</option>
                                    {list.map((place, id) => 
                                        <option key={id} value={place.contry}>{place.contry}</option>
                                    )}              
                                </select>
                            </div>
                        }
                        <div className={styles.popularityOfContry}>
                            {filteredList.length !== 0 &&
                                filteredList.map((place, id) => 
                                    <PopularityOfContry key={id} place={place}/>
                                )        
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
export default PopularityDestination