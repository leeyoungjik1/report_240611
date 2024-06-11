import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './GNB.module.css'
import { NavLink, useNavigate } from 'react-router-dom'
import mainLogo from '../assets/mainLogo.png'

const menus = [
    {
        url: '/notice',
        name: '여행의 시작'
    },
    {
        url: '/itinerary/create',
        name: '새로운 여행'
    },
    {
        url: '/itinerary/changelist',
        name: '여행 관리'
    },
    {
        url: '/itinerary/myitinerary',
        name: '나의 여행'
    },
    {
        url: '/itinerary/shareditinerary',
        name: '다른 사람의 여행'
    },
    {
        url: '/itinerary/popularitydestination',
        name: '인기 여행지'
    }
]

const GNB = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState()

    const logout = () => {
        window.localStorage.removeItem("token")
        navigate('./')
        window.location.reload()
        alert('로그아웃 되었습니다.')
    }

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/users/getId', {
          headers: {
              'Constent-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        })
        .then((res) => setUser(res.data))
        .catch(err => {
          console.log(err)
        })
      }, [])

    return (
        <div className={styles.gnbContainer}>
            <nav className={styles.gnb}>
                <div className={styles.mainMenu}>
                    <NavLink name="logo" className={styles.logo} to='/'><img src={mainLogo}></img></NavLink>
                    {menus.map((menu, id) => 
                        <NavLink key={id} to={menu.url} className={({isActive}) => (isActive ? styles.active : styles.menu)}>{menu.name}</NavLink>
                    )}
                </div>
                <div className={styles.userMenu}>
                {user ? 
                    <>
                        <NavLink to='/'>내 정보</NavLink> 
                        <NavLink to='/' onClick={logout}>로그아웃</NavLink> 
                    </> :
                    <>
                        <NavLink to='/login'>로그인</NavLink>
                        <NavLink to='/join'>회원가입</NavLink>
                    </>
                }
                </div>
            </nav>
        </div>
    )
};
    
export default GNB;