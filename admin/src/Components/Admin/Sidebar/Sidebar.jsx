import React from 'react';
import "./sidebar.scss";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {SettingOutlined, DropboxOutlined, BarsOutlined, PoweroffOutlined} from "@ant-design/icons";
import axios from "axios";
import {url} from "../../../Config.js";

export default function Sidebar() {

    const location = useLocation();

    const navigate = useNavigate();

    const Logout =  async () => {
        const {data} = await axios.post(
            `${url}/api/v1/logout`,
            {},
            {withCredentials: true}
        );
        if (data.success) {
            navigate('/')
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <nav className="side-navbar">
                    <div className="side-navbar-wrapper">
                        <div className="main-menu">
                            <ul className="sidebarList">
                                <Link to="/admin" className="link">
                                    <li className={`sidebarListItem ${location.pathname === '/admin' ? 'active' : ''}`}>
                                        <BarsOutlined className="sidebarIcon"/>
                                        Home
                                    </li>
                                </Link>
                                <Link to="/admin/product" className="link">
                                    <li className={`sidebarListItem ${location.pathname === '/admin/product' ? 'active' : ''}`}>
                                        <DropboxOutlined className="sidebarIcon"/>
                                        Products
                                    </li>
                                </Link>
                                <Link to="/admin/settings" className="link">
                                    <li className={`sidebarListItem ${location.pathname === '/admin/settings' ? 'active' : ''}`}>
                                        <SettingOutlined className="sidebarIcon"/>
                                        Settings
                                    </li>
                                </Link>
                                    <li onClick={Logout} className={`sidebarListItem`}>
                                        <PoweroffOutlined className="sidebarIcon"/>
                                        Log out
                                    </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}
