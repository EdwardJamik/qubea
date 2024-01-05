import React, {useEffect, useState} from 'react';

import './header.scss'

import Logo from '../../Assets/image/logo.svg'
import axios from "axios";
import {url} from "../../Config.js";

const Header = () => {

    const [isHeader, setHeader] = useState([])

    useEffect(() => {
        const getSetting = async () => {
            const {data} = await axios.get(
                `${url}/api/v1/manager/settingList`,
                {},
                {withCredentials: true}
            );
            setHeader(data[2])
        }
        getSetting()

    }, [])

    return (
        <header>
            <div className="container">
                <img className='qubea_logo' src={Logo} alt="QUBEA Logo"/>
                <p>
                    {isHeader.title}
                </p>
            </div>

        </header>
    );
};

export default Header;