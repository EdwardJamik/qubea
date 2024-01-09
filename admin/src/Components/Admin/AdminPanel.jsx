import React, {useEffect, useState} from 'react';
import {Button, message, Space, Table} from "antd";
import axios from "axios";
import {url} from "../../Config.js";
import dayjs from "dayjs";

const AdminPanel = () => {

    const [isOrderStatus, setOrderStatus] = useState(false);
    const [isOrder, setOrder] = useState([]);

    useEffect(() => {
        const orderList = async () => {
            if(isOrderStatus){
                const {data} = await axios.get(
                    `${url}/api/v1/manager/ordersHistoryList`,
                    {},
                    {withCredentials: true}
                );

                setOrder(data)
            } else{
                const {data} = await axios.get(
                    `${url}/api/v1/manager/ordersList`,
                    {},
                    {withCredentials: true}
                );

                setOrder(data)
            }
        }
        orderList()
    }, [isOrder,isOrderStatus])

    const orderListChange = async (action) => {
        setOrderStatus(action)
        if(action){
            const {data} = await axios.get(
                `${url}/api/v1/manager/ordersHistoryList`,
                {},
                {withCredentials: true}
            );

            setOrder(data)
        } else{
            const {data} = await axios.get(
                `${url}/api/v1/manager/ordersList`,
                {},
                {withCredentials: true}
            );

            setOrder(data)
        }
    }

    const declineOrder = async (_id) => {
        const {data} = await axios.post(
            `${url}/api/v1/manager/declineOrder`,
            {_id},
            {withCredentials: true}
        );

        if(data.success){
            message.success(data.message)
        }
    }

    const acceptOrder = async (_id) => {
        const {data} = await axios.post(
            `${url}/api/v1/manager/acceptOrder`,
            {_id},
            {withCredentials: true}
        );

        if(data.success){
            message.success(data.message)
        }
    }

    const endOrder = async (_id) => {
        const {data} = await axios.post(
            `${url}/api/v1/manager/endOrder`,
            {_id},
            {withCredentials: true}
        );

        if(data.success){
            message.success(data.message)
        }
    }

        const columns = [
        {
            title: 'Order #',
            dataIndex:  'orderNumber',
            key: 'orderNumber',
            render: (text) => text,
        },
        {
            title: 'Product',
            dataIndex:  'product',
            key: 'product',
            render: (text) => text,
        },
        {
            title: 'Table',
            dataIndex:  'table',
            key: 'table',
            render: (text) => text,
        },
        {
            title: 'Ingredient',
            dataIndex: 'option',
            key: 'option',
            render: (_, render) => ({
                children: (
                    <div dangerouslySetInnerHTML={{ __html: render.option.map(item => `<p>${item.option} - ${item.count}</p>`).join('') }} />
                ),
            }),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => dayjs(text).format('DD.MM.YY HH:MM'),
        },
        {
            title: '',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    {!isOrderStatus ?
                        <>
                            {!record.accepting ? <Button type='primary' onClick={() => acceptOrder(record._id)}>Accept
                                Order</Button> : <></>}
                            {!record.waiting && record.accepting ?
                                <Button type='primary' onClick={() => endOrder(record._id)}>End
                                    Order</Button> : <></>}
                            {!record.accepting ?
                                <Button danger onClick={() => declineOrder(record._id)}>Сancel order</Button> : <></>}
                        </>
                        :
                        <>
                            {record.success ? <Button style={{borderColor:'green', color:'green'}} danger disabled>Completed</Button> : <></>}
                            {record.cancel ? <Button style={{borderColor:'red', color:'red'}} danger disabled>Сancel order</Button> : <></>}
                        </>
                    }

                </Space>
            ),
        },
    ];

    return (
        <div className='admin_container' style={{display:'flex', flexDirection:'column', alignItems: 'center'}}>
            <div style={{display:'flex', marginBottom:'10px'}}>
                <Button type={isOrderStatus ? `` : `primary`} onClick={()=> {
                    orderListChange(false)
                }} style={{marginRight:'10px'}}>Active order</Button>
                <Button type={isOrderStatus ? `primary` : ``} onClick={()=> {
                    orderListChange(true)
                }}>History</Button>
            </div>
            <Table className='usersList' columns={columns} dataSource={isOrder} pagination={ isOrderStatus} />
        </div>
    );
};

export default AdminPanel;