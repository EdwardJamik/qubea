import React, {useEffect, useState} from 'react';
import axios from "axios";
import {url} from "../../../Config.js";

import './setting.scss'
import {Button, message} from "antd";

const Setting = () => {

    const [isSetting, setSetting] = useState([]);

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
        </div>
    );
};

export default Setting;