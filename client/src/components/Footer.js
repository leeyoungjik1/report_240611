import React from 'react'
import { useLocation } from "react-router-dom";
import styles from './Footer.module.css'

const Footer = () => {
    const locationNow = useLocation()
    if(locationNow.pathname.includes('/itinerary/myitinerary/') || locationNow.pathname.includes('/itinerary/shareditinerary/')){
        return null
    }
    // console.log(locationNow)
    // console.log(window.location)
    return (
        <footer>
            <div>
                <div>
                    <address>
                        <div>
                            <p>상호: TravelNote</p>
                            <p>|</p>
                            <p>대표자명: 이영직</p>
                        </div>
                        <div>
                            <p>사업자등록번호: 000-00-00000</p>
                        </div>
                        <div>
                            <p>연락처: 00-000-0000</p>
                            <p>|</p>
                            <p>이메일: example@example.com</p>
                        </div>
                        <div>
                            <p>주소: 충청남도 공주시 반포면 제석골길 35-5</p>
                        </div>
                    </address>
                    <div>© 2024. TravelNote. all rights reserved.</div>    
                </div>
                <div className="icon footer-insta"></div>    
            </div>
        </footer>
    )
};
    
export default Footer;