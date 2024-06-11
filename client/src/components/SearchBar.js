import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment'
import { useParams, useNavigate, NavLink, Link, useSearchParams, useLocation } from 'react-router-dom'
import styles from './PopularityOfContry.module.css'

function SearchBar({handleChange, searchWord}){

    return (
        <input type='text' name="searchWord" id="searchWord" onChange={handleChange} value={searchWord}></input>
    )
}

export default React.memo(SearchBar)