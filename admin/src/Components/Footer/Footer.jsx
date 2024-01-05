import React from 'react';

import './footer.scss'
import {useParams} from "react-router-dom";

const Footer = () => {
    const { category_id } = useParams();

    const goBack = () => {
        window.history.go(-1);
    };

    return (
        <footer style={category_id ? {zIndex:'999'} : {}}>
            <div className="container">
                {category_id ? <button onClick={()=>goBack()} className='back_button'>Come back</button> : <></>}
                <a href='#' className='button__read'>Read the salon rules</a>
                <a href='#' className='button__watch'>Watch the video</a>
            </div>
        </footer>
    );
};

export default Footer;