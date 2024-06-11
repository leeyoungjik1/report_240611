import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios'
import ItineraryCard from "../../components/ItineraryCard";
import { useNavigate } from 'react-router-dom'
import FilterButtons from "../../components/FilterButtons";
import styles from './ChangeList.module.css'
import ReactPaginate from 'react-paginate';
import './ReactPaginate.css'
import { FaSearch } from "react-icons/fa";

// URL 주소: /itinerary/changelist

function ChangeList(){
    const navigate = useNavigate()

    const [list, setList] = useState([])
    const [isDone, setIsDone] = useState('')
    const [formData, setFormData] = useState({
        searchFilter: 'title',
        searchWord: '',
        isDone: ''
    })
    // console.log(list)

    const handleChange = (e) => {
        const { name, value } = e.target 
        setFormData({ ...formData, [name]: value })
    }

    const handleChangeIsDone = (e) => {
        switch(e.target.innerHTML){
            case '전체':
                setIsDone('전체')
                setFormData({
                    searchFilter: 'title',
                    searchWord: '',
                    isDone: ''
                })
                break
            case '예정':
                setIsDone('schedule')
                setFormData({ ...formData, isDone: 'schedule' })
                break
            case '완료':
                setIsDone('completion')
                setFormData({ ...formData, isDone: 'completion' })
                break                         
        }
    }

    // 선택한 일정 상태(예정, 완료) 변경
    const handleisDone = (e, changeStatus) => {
        axios.get('http://127.0.0.1:5000/api/users/getId', {
            headers: {
                'Constent-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            console.log(changeStatus)
            axios.put(`http://127.0.0.1:5000/api/itinerarys/changelist/${e.target.id}`, {isDone: changeStatus}, {
                headers: {
                    'Constent-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                window.location.reload();
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    // 선택한 일정 삭제
    const handleDelete = (e) => {
        axios.get('http://127.0.0.1:5000/api/users/getId', {
            headers: {
                'Constent-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            axios.delete(`http://127.0.0.1:5000/api/itinerarys/changelist/${e.target.id}`, {
                headers: {
                    'Constent-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                window.location.reload();
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    const changeItinerary = (e) => {
        // console.dir(e.target.innerText)
        switch(e.target.innerText){
            case '수정':
                navigate(`/itinerary/details/${e.target.id}`)
                break
            case '삭제':
                if(window.confirm("일정을 삭제 하시겠습니까?")){
                    handleDelete(e)
                }else{
                    return
                }
                break
            case '완료':
                handleisDone(e, true)
                break
            case '예정':
                handleisDone(e, false)
                break
        }
    }

    // 검색어 검색
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.get(`http://127.0.0.1:5000/api/itinerarys/list/searched?searchFilter=${searchFilter}&searchWord=${searchWord}&isDone=${formData.isDone}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res) => {
            // console.log(res.data)
            setIsDone('')
            setList(res.data.Itinerarys)
        })
        .catch(err =>{
            // console.log(err.response.data)
            if(err.response.data.code === 404){
                alert('검색 결과가 없습니다.')
            }
        })
    }

    const PaginatedItems = ({ itemsPerPage }) => {
        const [itemOffset, setItemOffset] = useState(0);
      
        const endOffset = itemOffset + itemsPerPage;
        const currentItems = list.slice(itemOffset, endOffset);
        const pageCount = Math.ceil(list.length / itemsPerPage);
      
        const handlePageClick = (event) => {
          const newOffset = (event.selected * itemsPerPage) % list.length;
          setItemOffset(newOffset);
        };
      
        return (
          <>
            <div className={styles.itineraryCardBox}>
                {currentItems &&
                    currentItems.length !== 0 && currentItems.map((itinerary, id) => {
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

                        return (
                            <ItineraryCard
                                key={id}
                                city={itinerary.city}
                                dateOfEnd={itinerary.dateOfEnd}
                                dateOfStart={itinerary.dateOfStart}
                                description={itinerary.description}
                                title={itinerary.title}
                                status={itinerary.status}
                                open={itinerary.open}
                                placeId={placeIdSearched3}
                                handleClick={changeItinerary}
                            >
                                <button id={itinerary._id}>수정</button>
                                <button id={itinerary._id}>삭제</button>
                                <button id={itinerary._id}>{itinerary.isDone ? "예정" : "완료"}</button>
                            </ItineraryCard>
                        )
                    })
                }
            </div>
            <div>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    className="pagination"
                />
            </div>
          </>
        );
    }

    // 변경할 전체 일정 리스트 가져오기
    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/itinerarys/list/searched?searchFilter=${searchFilter}&searchWord=${searchWord}&isDone=${formData.isDone}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res) => {
            // console.log(res.data)
            setList(res.data.Itinerarys)
        })
        .catch(err =>{
            console.log(err.response.data)
            if(err.response.data.code === 401 || err.response.data.code === 419){
                alert('로그인이 필요한 페이지 입니다.')
                navigate("/login")
            }else if(err.response.data.code === 404){
                setList([])
            }
        })
    }, [isDone])

    const {
        searchFilter,
        searchWord
    } = formData 

    return (
        <div className={styles.changeListPage}>
            <h1>나의 여행 일정 관리</h1>
            <div className={styles.filterContronBox}>
                <FilterButtons handleClick={handleChangeIsDone}/>
                <form onSubmit={handleSubmit}>
                    <select name="searchFilter" id="searchFilter" onChange={handleChange} value={searchFilter}>
                        <option value="title">제목</option>
                        <option value="city">대표 도시</option>
                    </select>
                    <input type='text' name="searchWord" id="searchWord" onChange={handleChange} value={searchWord}></input>
                    <button type="submit"><FaSearch size="20" color="#828282"/></button>
                </form>
            </div>
            <div className={styles.itineraryCardContainer}>
                <PaginatedItems itemsPerPage={4}/>
            </div>
            
        </div>
    )
}
export default ChangeList