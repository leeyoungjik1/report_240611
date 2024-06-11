import React, { useState, useEffect } from 'react'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";
registerLocale("ko", ko);

const DatePicker = ({handleDateChange, startDate}) => {
    return (
    <ReactDatePicker
		selected={startDate} 
        onChange={handleDateChange}
        locale="ko"
    />
    )
};
    
export default DatePicker;