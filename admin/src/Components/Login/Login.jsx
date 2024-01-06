import React, {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Button, message, Form, Input, Row} from "antd";
// import FingerprintJS from '@fingerprintjs/fingerprintjs';
import './login.scss'
import Logo from '../../Assets/image/logo.svg'
import {useCookies} from "react-cookie";
import {url} from "../../Config.js";
import {useSubscribe} from "../../hooks/notification.jsx";
// import * as FingerprintJS from "react-dom/test-utils";
const PUBLIC_KEY = 'BJjiKLISnJg2MOAzy0HrmQWQEzMUkVhqK--HZQt7iOQxp5NrB1JKnJihmx0MN5Z_Fcuv_phKal4xab3YFD8f82w';



const Login =  () => {
    const [subscribeId, setSubscribeId] = useState('');
    const [pushId, setPushId] = useState('');
    const navigate = useNavigate();
    const [loadingSubscribe, setLoadingSubscribe] = useState(false)

    const [inputValue, setInputValue] = useState({
        username: "",
        password: "",
    });

    // useEffect(() => {
    //     FingerprintJS.load()
    //         .then(fp => fp.get())
    //         .then(
    //             result => {
    //                 setSubscribeId(result.visitorId);
    //                 setPushId(result.visitorId);
    //             },
    //             error => {
    //                 console.error('Error getting fingerprint:', error);
    //             }
    //         );
    // }, []);


    // const { getSubscription } = useSubscribe({publicKey: PUBLIC_KEY});
    //
    // const onSubmitSubscribe = useCallback(async (e) => {
    //     e.preventDefault();
    //     setLoadingSubscribe(true)
    //     try {
    //         // Get the subscription object using the getSubscription function
    //         const subscription = await getSubscription();
    //
    //         // Send the subscription object and ID to the server for registration
    //         await axios.post(`${url}/api/v1/notification/subscribe`, {
    //             subscription: subscription,
    //             id: subscribeId
    //         });
    //
    //         // Log a message in case of successful subscription
    //         alert('Subscribe success')
    //         console.log('Subscribe success');
    //     } catch (e) {
    //         // Log a warning in case of an error
    //         console.warn(e);
    //     } finally {
    //         setLoadingSubscribe(false)
    //     }
    // }, [getSubscription]);
    //
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
            {/*<button onClick={(e)=>onSubmitSubscribe(e)}>NOTIFICATION</button>*/}
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
