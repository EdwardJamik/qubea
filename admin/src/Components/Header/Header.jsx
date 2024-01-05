import React from 'react';

import './header.scss'

import Logo from '../../Assets/image/logo.svg'

const Header = () => {
    return (
        <header>
            <div className="container">
                <img className='qubea_logo' src={Logo} alt="QUBEA Logo"/>
                <p>
                    Сhoose a drink and the administrator will bring it to you
                </p>
            </div>

        </header>
    );
};

export default Header;