import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {Button, message, Form, Input, Row} from "antd";

import './login.scss'
import Logo from '../../Assets/image/logo.svg'
import {useCookies} from "react-cookie";
import {url} from "../../Config.js";

const Login = () => {

    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState({
        username: "",
        password: "",
    });
    const {username, password} = inputValue;
    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    const warnings = (info) => {
        message.warning(info);
    };

    const [cookies, removeCookie] = useCookies([]);

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
                const {user} = data;
                if (user) {
                    navigate('/admin')
                    setLoggedIn(true);
                } else{
                    navigate('/')
                }
            }
        };

        loggedIn();
    }, [navigate]);

    const handleSubmit = async () => {
        try {
            const {data} = await axios.post(
                `${url}/api/v1/login`,
                {
                    ...inputValue,
                },
                {withCredentials: true}
            );
            const {success, message} = data;
            if (success) {
                setTimeout(() => {
                    navigate("/admin");
                }, 1000);
            } else {
                warnings(message)
            }
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <Row className='login_container' style={{display:'flex', justifyContent:'center', alignItems: 'center'}}>
            <img style={{maxWidth:'250px', marginBottom:'25px'}} src={Logo} alt="QUBEA Logo"/>
            <Form
                className='formLogin'
                name="basic"
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={handleSubmit}
                onFinishFailed={handleSubmit}
                onSubmit={handleSubmit}
                autoComplete="off"
            >
                <Form.Item>
                    <Input placeholder='Login' name="username" value={username} onChange={handleOnChange}/>
                </Form.Item>

                <Form.Item>
                    <Input.Password placeholder='Password' name="password" value={password} onChange={handleOnChange}/>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary" htmlType="submit" className='login_button'>
                        Sign in
                    </Button>
                </Form.Item>
            </Form>
        </Row>
    );
};

export default Login;
