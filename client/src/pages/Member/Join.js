import React, {useState} from "react";
import  "../../styles/join.css";
import { useNavigate } from 'react-router-dom'
import API from '../../API'
import styles from './Join.module.css'

// URL 주소: /join

function Join(){
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        nickName: '',
        userId: '',
        password: '',
        confirmPassword: '',
        email: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target 
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        API.post('api/users/register', formData).then((res) => {
            localStorage.setItem('token', res.data.token)
            navigate("/")
            window.location.reload()
        }).catch((err) => {
            if(err.response.data.code === 400){
                const error = err.response.data.error
                const msg = error[0].msg
                console.log(msg)
                switch (msg){
                    case "user name length must be between 2~20 characters": 
                        alert("이름을 2자리 이상 20자리 이하로 입력해주세요.")
                        break
                    case "user nick name length must be between 2~10 characters": 
                        alert("닉네임을 2자리 이상 10자리 이하로 입력해주세요.")
                        break
                    case "user nick name can not use special character": 
                        alert("닉네임에 특수문자는 사용하실 수 없습니다.")
                        break    
                    case "user email is not valid": 
                        alert("이메일 형식을 다시 확인해주세요.")
                        break    
                    case "user id length must be between 5~10 characters": 
                        alert("아이디를 5자리 이상 10자리 이하로 입력해주세요.")
                        break    
                    case "user id can not use korean": 
                        alert("아이디에 한글은 사용하실 수 없습니다.")
                        break    
                    case "user id can not use special character": 
                        alert("아이디에 특수문자는 사용하실 수 없습니다.")
                        break    
                    case "password length must be between 7~15 characters":
                        alert("비밀번호를 7자리 이상 15자리 이하로 입력해주세요.")
                        break  
                    case "password must be at least 1 alphabet": 
                        alert("비밀번호에 영문이 포함되어야 합니다.")
                        break    
                    case "password must be at least 1 number": 
                        alert("비밀번호에 숫자가 포함되어야 합니다.")
                        break    
                    case "password must be at least 1 special character": 
                        alert("비밀번호에 특수문자가 포함되어야 합니다.")
                        break    
                    case "passwords don't match": 
                        alert("비밀번호 확인이 일치하지 않습니다.")
                        break     
                }
            }
        })
    }

    const {
        name,
        nickName,
        userId,
        password,
        confirmPassword,
        email
    } = formData 

    return (
        <div className={styles.joinPage}>
            <div className={styles.joinContainer}>
                <div className={styles.logo}></div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.name}>
                        <label htmlFor="name"><span style={{color: 'red'}}>*</span> 이름</label>
                        <input type="text" name="name" id="name" required onChange={handleChange} value={name}/>
                    </div>
                    <div className={styles.nickName}>
                        <label htmlFor="nickName">닉네임</label>
                        <input type="text" name="nickName" id="nickName" placeholder="특수문자 제외 2자리 이상 10자리 이하" onChange={handleChange} value={nickName}/>
                    </div>
                    <div className={styles.userId}>
                        <label htmlFor="id"><span style={{color: 'red'}}>*</span> 아이디</label>
                        <input type="text" name="userId" id="id" placeholder="한글, 특수문자 제외 5자리 이상 10자리 이하" required onChange={handleChange} value={userId}/>
                    </div>
                    <div className={styles.password}>
                        <label htmlFor="password"><span style={{color: 'red'}}>*</span> 비밀번호</label>
                        <input type="password" name="password" id="password" placeholder="영문, 숫자, 특수문자 포함 7자리 이상" required onChange={handleChange} value={password}/>
                    </div>
                    <div className={styles.confirmPassword}>
                        <label htmlFor="confirmPassword">비밀번호 확인</label>
                        <input type="password" name="confirmPassword" id="confirmPassword" required onChange={handleChange} value={confirmPassword}/>
                    </div>
                    <div className={styles.email}>
                        <label htmlFor="email"><span style={{color: 'red'}}>*</span> 이메일</label>
                        <input type="email" name="email" id="email" required onChange={handleChange} value={email}/>
                    </div>
                    <button type="submit">회원가입</button>
                </form>
            </div>
        </div>
    )
}




export default Join