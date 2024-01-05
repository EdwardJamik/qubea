import React, {useState} from "react";
import "./topbar.scss";
import '../style.scss'
import {
    BarsOutlined,
    PoweroffOutlined,
    MenuOutlined,
    CloseOutlined, DropboxOutlined, SettingOutlined
} from "@ant-design/icons";
import axios from "axios";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {url} from "../../../Config.js";

export default function Topbar() {

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

    const [isOpen, setOpen] = useState(false)

    return (
        <>
            <div className="topbar">
                <div className="topbarWrapper">

                    <div className="topLeft">
                        <div className='mobile_menu'>
                            {isOpen ? <CloseOutlined style={{fontSize:'20px'}} onClick={()=>setOpen(false)} /> : <MenuOutlined style={{fontSize:'20px'}} onClick={()=>setOpen(true)} /> }
                        </div>
                        <span className="logo">QUBEA Dashboard</span>
                    </div>
                </div>
                <div className={isOpen ? "main-menu open" : "main-menu"}>
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

        </>
    )
}
