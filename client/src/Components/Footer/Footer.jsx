import React, {useEffect, useState} from 'react';

import './footer.scss'
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {url} from "../../Config.js";

const Footer = () => {
    const { category_id } = useParams();

    const [isWatch, setWatch] = useState([])
    const [isRules, setRules] = useState([])

    const goBack = () => {
        window.history.go(-1);
    };

    useEffect(() => {
        const getSetting = async () => {
            const {data} = await axios.get(
                `${url}/api/v1/manager/settingList`,
                {},
                {withCredentials: true}
            );
            console.log(data)
            setWatch(data[0])
            setRules(data[1])
        }
        getSetting()

    }, [])

    return (
        <footer style={category_id ? {zIndex:'999'} : {}}>
            <div className="container">
                {category_id ? <button onClick={()=>goBack()} className='back_button'>Come back</button> : <></>}
                <a href={isRules.link} rel='noopener noreferrer' target='_blank' className='button__read'>{isRules.title}</a>
                <a href={isWatch.link} rel='noopener noreferrer' target='_blank' className='button__watch'>{isWatch.title}</a>
            </div>
        </footer>
    );
};

export default Footer;