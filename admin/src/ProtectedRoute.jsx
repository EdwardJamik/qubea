import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import axios from "axios";
import Topbar from "./Components/Admin/Topbar/Topbar";
import Sidebar from "./Components/Admin/Sidebar/Sidebar";
import {url} from "./Config.js";

export const ProtectedRoute = ({element}) => {

    const [cookies, removeCookie] = useCookies([]);
    const navigate = useNavigate();

    const {pathname} = useLocation()

    const [isAdmin, setAdmin] = useState(false)
    const [isLoggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const loggedIn = async () => {
            if (!cookies.token) {
                navigate("/");
            } else {
                const {data} = await axios.post(
                    `${url}/api/v1/`,
                    {},
                    {withCredentials: true}
                );
                const {root, user} = data;
                if (user) {
                    setLoggedIn(true);
                    setAdmin(root);
                } else{
                    navigate('/')
                }
            }
        };

        loggedIn();
    }, [navigate]);


    if(pathname.includes("/admin") && isLoggedIn){
        return( <>
            <Topbar/>
            <div className="container" style={{display:'flex', padding:"0"}}>
                <Sidebar/>
                {element}
            </div>
        </>)

    }

    if (isLoggedIn) {
        return element
    }
};