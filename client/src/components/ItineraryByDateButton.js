import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment'
import styles from './ItineraryByDateButton.module.css'


function ItineraryByDateButton({dateOfStart, itineraryByDate, handelClick}){
    const diffDate = moment(itineraryByDate.date).diff(moment(dateOfStart), 'days')

    return (
        <button className={styles.selectDayBtns} id={itineraryByDate._id} onClick={handelClick}>{diffDate+1}일차</button>
    )
}

export default ItineraryByDateButton