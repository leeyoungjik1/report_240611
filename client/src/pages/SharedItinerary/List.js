import React, { useState, useEffect } from "react";
import axios from 'axios'
import SharedItineraryCard from "../../components/SharedItineraryCard";
import styles from './List.module.css'
import ReactPaginate from 'react-paginate';
import { FaSearch } from "react-icons/fa";

// URL 주소: /itinerary/shareditinerary

function List(){
    const [list, setList] = useState([])
    const [formData, setFormData] = useState({
        searchFilter: 'title',
        searchWord: '',
    })
    // console.log(list)

    const handleChange = (e) => {
        const { name, value } = e.target 
        setFormData({ ...formData, [name]: value })
    }

    // 검색어 검색
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.get(`http://127.0.0.1:5000/api/itinerarys/list/sharedlist/searched?searchFilter=${searchFilter}&searchWord=${searchWord}&isDone=${formData.isDone}`)
        .then((res) => {
            // console.log(res.data)
            setList(res.data.Itinerarys)
        })
        .catch(err =>{
            // console.log(err.response.data)
            if(err.response.data.code === 404){
                alert('검색 결과가 없습니다.')
            }
        })
    }

    function PaginatedItems({ itemsPerPage }) {
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
            <div className={styles.itinerarysContainer}>
                {currentItems.length !== 0 && currentItems.map((itinerary, id) => {
                    return (
                        <SharedItineraryCard
                            key={id}
                            itinerary={itinerary}
                        />
                    )
                })}
            </div>
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
          </>
        );
    }

    // 전체 일정 리스트 가져오기
    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/itinerarys/sharedlist`)
        .then((res) => setList(res.data.Itinerarys))
    }, [])

    const {
        searchFilter,
        searchWord
    } = formData 

    return (
        <div className={styles.listPage}>
            <h1>다른 사람의 여행</h1>
            <form onSubmit={handleSubmit}>
                <select name="searchFilter" id="searchFilter" onChange={handleChange} value={searchFilter}>
                    <option value="title">제목</option>
                    <option value="city">대표 도시</option>
                    <option value="nickName">닉네임</option>
                </select>
                <input type='text' name="searchWord" id="searchWord" onChange={handleChange} value={searchWord}></input>
                <button type="submit"><FaSearch size="20" color="#828282"/></button>
            </form>
            <div className={styles.itinerarys}>
                <PaginatedItems itemsPerPage={4}/>
            </div>
        </div>
    )
}
export default List