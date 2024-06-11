import React, { useState, useEffect } from 'react'
import styles from './FilterButtons.module.css'

const FilterButtons = ({handleClick}) => {
    return (
        <div className={styles.filterBtns} onClick={handleClick}>
            <button>전체</button>
            <button>예정</button>
            <button>완료</button>
        </div>
    )
};
    
export default FilterButtons;