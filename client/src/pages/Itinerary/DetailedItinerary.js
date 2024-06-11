import React, { useState, useEffect } from "react";
import axios from 'axios'
import { useParams, useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom'
import ItineraryCardDetails from "../../components/ItineraryCardDetails";
import DestinationCard from "../../components/DestinationCard";
import AddDestinationCard from "../../components/AddDestinationCard";
import moment from 'moment'
import GoogleMap from "../../components/GoogleMap";
import styles from './DetailedItinerary.module.css'

// URL 주소: /itinerary/details ,/itinerary/details/:itineraryId

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

function DetailedItinerary(){
    const navigate = useNavigate()
    const params = useParams()

    // 해당 사용자의 선택된 일정
    const [itinerary, setItinerary] = useState([])

    // 선택된 일정의 메인 imgSrc, 숙소 imgSrc
    const [mainImgSrc, setMainImgSrc] = useState(undefined)
    const [accommodationImgSrc, setAccommodationImgSrc] = useState(undefined)

    // 하나의 일정 중 선택한 일자 : 1일차, 2일차...
    const [day, setDay] = useState({
        date: '', 
        message: '여행 일자를 선택하세요.'
    })

    // 선택한 일차에 대한 데이터
    const [itineraryByDate, setItineraryByDate] = useState()
    const [accommodationGoogleData, setAccommodationGoogleData] = useState({
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

    // 날짜선택 여부
    const [selectDay, setSelectDay] = useState(null)

    // 서버 전송 여부
    const [submitServer, setSubmitServer] = useState(null)

    // AddDestinationCard 보여짐 여부
    const [isDestinationCard, setIsDestinationCard] = useState(false)

    // DestinationCard 수정 여부
    const [modDestinationCards, setModDestinationCards] = useState([])

    // ItineraryByDate 모델에 대한 서버로 전송할 최종 데이터
    const [formData, setFormData] = useState({
        date: '',
        accommodationName: '',
        accommodationAddress: '',
        accommodationCost: null,
        accommodationInfo: {}
    })

    // console.log(itinerary)
    // console.log(itineraryByDate)
    // console.log(accommodationGoogleData)
    // console.log(day)
    // console.log(formData)

    // 메인 일정 카드 수정 버튼
    const changeItinerary = (e) => {
        if(e.target.innerHTML === '수정'){
            navigate(`../modify/${e.target.id}`)
        }
    }

    // 전체 일정 중 달력에서 날짜를 선택
    const selectDayeDate = (e) => {
        const diffDate = moment(e.target.value).diff(moment(itinerary.dateOfStart), 'days')

        setDay({
            date: e.target.value,
            message: `${diffDate+1}일차 ${e.target.value}`
        })
    }

    // 구글 지도에서 위치를 선택하였을때 숙소 정보에 대한 데이터 저장
    const getAccommodationSearched = (data) => {
        if(data){
            const {name, geometry:{location}, vicinity, photos, place_id, country} = data
            setAccommodationGoogleData({
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

    // input 데이터가 변경될때마다 formData 변경
    const handleChange = (e) => {
        const { name, value} = e.target 
        setFormData({ ...formData, [name]: value })
    }

    // 여행지 일정 추가, 일정 전체 삭제 버튼
    const handleDestination = (e) => {
        // console.log(e.target.innerHTML)
        switch(e.target.innerHTML){
            case '여행지 추가':
                setIsDestinationCard(true)
                break
            case '여행지 전체 삭제':

                if(itineraryByDate.destinationIds.length !== 0){
                    if(window.confirm("여행지 일정을 전체 삭제 하시겠습니까?")){
                        deleteAllDestination(e)
                    }else{
                        return
                    }  
                }
                break
        }
    }

    // 달력에서 날짜를 선택하면 선택된 날짜정보만 ItineraryByDate 모델에 대한 데이터 서버로 전송
    function initSubmit(){
        axios.get('http://127.0.0.1:5000/api/users/getId', {
            headers: {
                'Constent-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            axios.post(`http://127.0.0.1:5000/api/itinerarys/bydate/create/${params.itineraryId}`, formData, {
                headers: {
                    'Constent-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res)
                setSubmitServer(res)
                setItineraryByDate(res.data.newItineraryByDate)
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    // 최종 ItineraryByDate 모델에 대한 데이터 서버로 전송
    function handleSubmit(e){
        if(window.confirm("숙소 정보를 저장하시겠습니까?")){
            e.preventDefault()
            axios.get('http://127.0.0.1:5000/api/users/getId', {
                headers: {
                    'Constent-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                axios.put(`http://127.0.0.1:5000/api/itinerarys/bydate/${itineraryByDate._id}`, formData, {
                    headers: {
                        'Constent-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res) => {
                    console.log(res)
                    setSubmitServer(res)
                    setItineraryByDate(res.data.updateditineraryByDate)
                }).catch((err) => {
                    console.log(err)
                })
            })
            alert('숙소 정보가 저장되었습니다.')
        }else{
            e.preventDefault()
        }

    }

    // AddDestinationCard에서 서버 전송 시 setSubmitServer
    const changeSubmitServer = (res) => {
        if(res === 'cancleAddDes'){
            setIsDestinationCard(false)
        }else if(res.name && res.name === 'cancleModDes'){
            const modDestinationCardsDeleted = modDestinationCards.filter(id => id !== res.id)
            setModDestinationCards(modDestinationCardsDeleted)
        }else{
            if(res.name === 'submitAddDes'){
                setIsDestinationCard(false)
            }else if(res.name === 'submitModDes'){
                const modDestinationCardsDeleted = modDestinationCards.filter(id => id !== res.res.data.updatedDestination._id)
                setModDestinationCards(modDestinationCardsDeleted)
            }
            setSubmitServer(res)
        }  
    }

    // 선택한 일차의 목적지 전체 삭제
    const deleteAllDestination = (e) => {
        console.log(e.target)
        axios.get('http://127.0.0.1:5000/api/users/getId', {
            headers: {
                'Constent-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            axios.delete(`http://127.0.0.1:5000/api/itinerarys/destination/${e.target.id}`, {
                headers: {
                    'Constent-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res)
                window.location.reload();
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    // 선택한 목적지 삭제
    const deleteDestination = (e) => {
        axios.get('http://127.0.0.1:5000/api/users/getId', {
            headers: {
                'Constent-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            axios.delete(`http://127.0.0.1:5000/api/itinerarys/destination/${itineraryByDate._id}/${e.target.id}`, {
                headers: {
                    'Constent-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res)
                setSubmitServer(res)
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    // 선택한 목적지 상태(예정, 완료) 변경
    const handleisDone = (e, changeStatus) => {
        axios.get('http://127.0.0.1:5000/api/users/getId', {
            headers: {
                'Constent-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            console.log(changeStatus)
            axios.put(`http://127.0.0.1:5000/api/itinerarys/destination/${e.target.id}`, {isDone: changeStatus}, {
                headers: {
                    'Constent-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res)
                setSubmitServer(res)
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    // DestinationCard 버튼(수정, 삭제, 완료)
    const changeDestination = (e) => {
        // console.dir(e.target)
        switch(e.target.innerText){
            case '수정':
                setModDestinationCards([...modDestinationCards, e.target.id])
                // navigate(`/itinerary/details/${e.target.id}`)
                break
            case '삭제':
                if(window.confirm("여행지 일정을 삭제 하시겠습니까?")){
                    deleteDestination(e)
                }else{
                    e.preventDefault()
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
    
    // url 파라미터를 이용하여 선택된 일정 데이터 가져오기
    useEffect(() => {
        if(params.itineraryId){
            axios.get(`http://127.0.0.1:5000/api/itinerarys/details/${params.itineraryId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((res) => setItinerary(res.data))
            .catch(err =>{
                console.log(err.response.data)
                if(err.response.data.code === 401 || err.response.data.code === 419){
                    alert('로그인이 필요한 페이지 입니다.')
                    navigate("/login")
                }
            })
        }
    }, [])

    // 일정 데이터 로드 시 메인 이미지 로드
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
                    const {photos} = res.data
                    setMainImgSrc(photos && photos.length !== 0 &&
                                `https://places.googleapis.com/v1/${photos[0].name}/media?maxWidthPx=500&key=${API_KEY}`
                            )
                })
            }else{
                setMainImgSrc("https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
            }
        }
    }, [itinerary])

    // 숙소 이미지 로드
    useEffect(() => {
        if(formData.accommodationInfo.place_id){
            axios.get(`https://places.googleapis.com/v1/places/${formData.accommodationInfo.place_id}?fields=photos&key=${API_KEY}`)
            .then((res) => {
                const {photos} = res.data
                setAccommodationImgSrc(photos && photos.length !== 0 &&
                            `https://places.googleapis.com/v1/${photos[0].name}/media?maxWidthPx=500&key=${API_KEY}` ||
                            "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        )
            })
        }

        return () => {
            setAccommodationImgSrc()
        }
    }, [selectDay])

    // 구글 지도 선택 시 서버로 전송할 데이터 변경
    useEffect(() => {
        setFormData({
            ...formData, 
            accommodationName: accommodationGoogleData.name,
            accommodationAddress: accommodationGoogleData.address,
            accommodationInfo: accommodationGoogleData
        })
        setSelectDay(accommodationGoogleData)
    }, [accommodationGoogleData])

    // 달력에서 날짜를 선택하면 선택된 날짜의 일차 데이터 변경 저장
    useEffect(() => {
        if(day.date){
            const itineraryByDateSearched = itinerary.itineraryByDateIds.find(itineraryByDate => {
                return moment(itineraryByDate.date).format() === moment(day.date).format()
            })
            // console.log(itineraryByDateSearched)
            if(itineraryByDateSearched){
                setFormData({
                    ...formData,
                    date: itineraryByDateSearched.date,
                    accommodationName: itineraryByDateSearched.accommodationName,
                    accommodationAddress: itineraryByDateSearched.accommodationAddress,
                    accommodationCost: itineraryByDateSearched.accommodationCost,
                    accommodationInfo: itineraryByDateSearched.accommodationInfo
                })
            }else{
                setFormData({
                    ...formData,
                    date: day.date,
                    accommodationName: '',
                    accommodationAddress: '',
                    accommodationCost: null,
                    accommodationInfo: {
                        name: '',
                        address: '',
                        location: {
                            lat: '',
                            lng: ''
                        },
                        photoUrl: '',
                        place_id: '',
                    }
                })
            }
        }
        setSelectDay(day.date)
    }, [day])

    
    // 달력에서 날짜를 선택하면 선택된 날짜정보만 ItineraryByDate 모델에 대한 데이터 서버로 전송
    useEffect(() => {
        if(day.date){
            const itineraryByDateSearched = itinerary.itineraryByDateIds.find(itineraryByDate => {
                return moment(itineraryByDate.date).format() === moment(day.date).format()
            })
            if(itineraryByDateSearched){
                setItineraryByDate(itineraryByDateSearched)
            }else{
                initSubmit()
                setItineraryByDate()
            }
        }
    }, [selectDay])

    // 서버로 데이터 전송이 완료된 이후 데이터 갱신
    useEffect(() => {
        if(params.itineraryId){
            axios.get(`http://127.0.0.1:5000/api/itinerarys/details/${params.itineraryId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((res) => {
                const itineraryByDateSearched = res.data.itineraryByDateIds.find(itineraryByDate => {
                    return moment(itineraryByDate.date).format() === moment(day.date).format()
                })
                setItinerary(res.data)
                setItineraryByDate(itineraryByDateSearched)
            })
        }
    }, [submitServer])


    const {
        accommodationName,
        accommodationAddress,
        accommodationCost
    } = formData 

    return (
        <div className={styles.detailedItineraryPage}>
            <div className={styles.itineraryCardContainer}>
                <ItineraryCardDetails
                    city={itinerary.city}
                    dateOfEnd={itinerary.dateOfEnd}
                    dateOfStart={itinerary.dateOfStart}
                    description={itinerary.description}
                    title={itinerary.title}
                    status={itinerary.status}
                    open={itinerary.open}
                    imgSrc={mainImgSrc}
                    handleClick={changeItinerary}
                >
                    <button id={itinerary._id}>수정</button>
                </ItineraryCardDetails>
                <div className={styles.selectDay}>
                    <label htmlFor="date">일자 선택</label>
                    <input type="date" name="date" id="date" onChange={selectDayeDate} min={moment(itinerary.dateOfStart).format("YYYY-MM-DD")} max={moment(itinerary.dateOfEnd).format("YYYY-MM-DD")}/>
                </div>
            </div>
            <div className={styles.message}>
                {day.message}
            </div>
            {day.date &&
                <div className={styles.itineraryByDateCardContainer}>
                    <div className={styles.accommodationContainer}>
                        <h2>숙소</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.accommodationInfoContainer}>
                                {accommodationImgSrc &&
                                    <img src={accommodationImgSrc}></img>
                                }
                                <div>
                                    <div>
                                        <label htmlFor="accommodationName">숙소명</label>
                                        <input type="text" name="accommodationName" id="accommodationName" onChange={handleChange} value={accommodationName || ''} required/>
                                    </div>
                                    <div>
                                        <label htmlFor="accommodationAddress">숙소 주소</label>
                                        <input type="text" name="accommodationAddress" id="accommodationAddress" onChange={handleChange} value={accommodationAddress || ''}/>
                                    </div>
                                    <div>
                                        <label htmlFor="accommodationCost">숙박 비용</label>
                                        <input type="number" name="accommodationCost" id="accommodationCost" onChange={handleChange} value={accommodationCost || ''}/>
                                    </div>
                                </div>
                            </div>
                            <GoogleMap handleChange={getAccommodationSearched}/>
                            <button type="submit">숙소 저장</button>
                        </form>
                    </div>
                    <div className={styles.destinationContainer}>
                        <h2>여행지</h2>
                        <div>
                            <div className={styles.destinationBtns} onClick={handleDestination}>
                                <button id={itineraryByDate && itineraryByDate._id}>여행지 전체 삭제</button>
                                <button>여행지 추가</button>
                            </div>
                            {itineraryByDate && 
                            <AddDestinationCard 
                                selectedDate={itineraryByDate.date}
                                itineraryByDateId={itineraryByDate._id}
                                changeSubmit={changeSubmitServer}
                                isShow={isDestinationCard}
                            />
                            }
                            <div className={styles.destinationCardContainer}>
                                {itineraryByDate && itineraryByDate.destinationIds.length !== 0 &&
                                    itineraryByDate.destinationIds.map((destinationId, id) => {
                                        return (
                                            <DestinationCard
                                                key={id}
                                                title={destinationId.title}
                                                address={destinationId.address}
                                                description={destinationId.description}
                                                category={destinationId.category}
                                                timeOfStart={destinationId.timeOfStart}
                                                timeOfEnd={destinationId.timeOfEnd}
                                                cost={destinationId.cost}
                                                isDone={destinationId.isDone}
                                                placeId={destinationId.destinationInfo.place_id}
                                                modDestinationCards={modDestinationCards}
                                                destinationId={destinationId._id}
                                                handleClick={changeDestination}
                                                changeSubmit={changeSubmitServer}
                                            >
                                                <button id={destinationId._id}>수정</button>
                                                <button id={destinationId._id}>삭제</button>
                                                <button id={destinationId._id}>{destinationId.isDone ? "예정" : "완료"}</button>
                                            </DestinationCard>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default DetailedItinerary