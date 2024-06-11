import React from 'react'
import moment from 'moment'
import styles from './ItineraryCardDetails.module.css'
import { FaTreeCity } from "react-icons/fa6";
import { FaCalendarDays } from "react-icons/fa6";

function ItineraryCardDetails({city, dateOfEnd, dateOfStart, description, title, status, open, imgSrc, handleClick, children}){
    return (
        <div className={styles.itineraryCardBox}>
            <div className={styles.itineraryCardState}>
                <div className={styles.isPublic}>{open}</div>
                <div className={styles.state}>{status}</div>
            </div>
            <div className={styles.itineraryCardMain}>
                <div className={styles.itineraryCardDetails}>
                    <img src={imgSrc}></img>
                    <div>
                        <div className={styles.title}>{title}</div>
                        {city &&
                            <div><FaTreeCity size='15' color='#607D8B'/> {city}</div>
                        }
                        <div>
                            <FaCalendarDays size='15' color='#2F80ED'/> {moment(dateOfStart).format('YYYY-MM-DD')} ~ {moment(dateOfEnd).format('YYYY-MM-DD')}
                        </div>
                        {description &&
                            <div className={styles.description}>{description}</div>
                        }
                    </div>
                </div>
                <div className={styles.itineraryCardBtns} onClick={handleClick}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ItineraryCardDetails