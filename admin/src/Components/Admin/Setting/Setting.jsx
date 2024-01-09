import React, {useEffect, useState} from 'react';
import axios from "axios";
import {url} from "../../../Config.js";

import './setting.scss'
import {Button, Input, message} from "antd";

const Setting = () => {

    const [isSetting, setSetting] = useState([]);
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [isPassword, setPassword] = useState({
        password: '',
        repeatPassword: '',
    });

    useEffect(() => {
        const settingList = async () => {
            const {data} = await axios.get(
                `${url}/api/v1/manager/settingList`,
                {},
                {withCredentials: true}
            );

            if(data)
            {
                setSetting([...data])
            }
        }
        settingList()

    }, [])

    const updateSetting = async () => {
        const {data} = await axios.post(
            `${url}/api/v1/manager/updateSetting`,
            {setting:isSetting},
            {withCredentials: true}
        );

        if (data.success) {
            message.success(data.message);
        } else {
            message.error(data.message);
        }
    };

    const updateNewPassword = async () => {
        const {data} = await axios.post(
            `${url}/api/v1/updatePassword`,
            {isPassword},
            {withCredentials: true}
        );

        if (data.success) {
            message.success(data.message);
        } else {
            message.error(data.message);
        }
    };



    return (
        <div className='admin_container'>
            {isSetting.map((item,index) =>
                <div className='setting_list' key={index}>
                    {item?.title ?
                    <input
                        type="text"
                        value={isSetting[index].title}
                        onChange={(e) => {
                            const newSettings = [...isSetting];
                            newSettings[index] = { ...newSettings[index], title: e.target.value };
                            setSetting(newSettings);
                        }}
                    />
                        :
                        <></>
                    }
                    {item?.link ?
                    <input
                        type="text"
                        value={isSetting[index].link}
                        onChange={(e) => {
                            const newSettings = [...isSetting];
                            newSettings[index] = {...newSettings[index], link: e.target.value};
                            setSetting(newSettings);
                        }}
                    />
                        :
                        <></>
                    }
                </div>
            )}
            <Button onClick={()=>updateSetting()} className='setting_update' type='primary'>Update</Button>
            <div style={{margin: '46px auto', maxWidth: '300px', width: '100%'}}>
                <h4 style={{margin: '4px'}}>Change password</h4>
                <div style={{margin: '10px 0'}}>
                    <Input.Password
                        value={isPassword.password}
                        onChange={(e) => {
                            setPassword({...isPassword, password: e.target.value});
                        }}
                        style={{margin: '10px 0 10px'}}
                        placeholder="New password"
                    />
                    <Input.Password
                        value={isPassword.repeatPassword}
                        onChange={(e) => {
                            setPassword({...isPassword, repeatPassword: e.target.value});
                        }}
                        placeholder="Repeat new password"
                    />
                </div>
                <Button onClick={() => updateNewPassword()} className='setting_update' type='primary'>Change
                    password</Button>
            </div>
        </div>
    );
};

export default Setting;