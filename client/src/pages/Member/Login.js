import React, {useState} from "react";
import { NavLink, useNavigate } from 'react-router-dom'
import API from '../../API'
import styles from './Login.module.css'

// URL 주소: /login

function Login(){
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        userId: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target 
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        API.post('api/users/login', formData).then((res) => {
            localStorage.setItem('token', res.data.token)
            navigate("/")
            window.location.reload()
        }).catch((err) => {
            if(err.response.data.code === 401){
                alert('입력하신 아이디와 비밀번호를 다시 확인해주세요.')
            }
        })
    }

    const {
        userId,
        password
    } = formData 

    return (
    <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
            <div className={styles.logo}></div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">아이디</label>
                    <input type="text" name="userId" id="id" required onChange={handleChange} value={userId}/>
                </div>
                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" name="password" id="password" required onChange={handleChange} value={password}/>
                </div>
                <button type="submit">로그인</button>
                <div className={styles.find}>
                    <NavLink>아이디 찾기</NavLink>
                    <div>|</div>
                    <NavLink>비밀번호 찾기</NavLink>
                </div>
                <div className={styles.join}>
                    <div>아직 회원이 아니세요?</div>
                    <NavLink to={'../join'}>회원가입</NavLink>
                </div>
            </form>
        </div>
    </div>
    )
}
export default Login