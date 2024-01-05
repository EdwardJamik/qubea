import React, {useEffect, useState} from 'react';

import './list.scss'

import {DeleteOutlined, EditOutlined, FontColorsOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {Button, Col, FloatButton, Input, message, Modal, Popconfirm, Row, Upload} from "antd";
import {url} from "../../../../Config.js";
import axios from "axios";
import {Link} from "react-router-dom";


const ListCategory = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isCategory, setCategory] = useState([]);
    const [isProductId, setProductId] = useState('');
    const [isTitle, setTitle] = useState('');
    const [fileList, setFileList] = React.useState([]);
    const [newFileName, setNewFileName] = useState(null);

    const showModal = () => {
        setIsModalOpen(!isModalOpen);
        if(!isModalOpen){
            setTitle('')
            setProductId('')
            setFileList([])
            setNewFileName(null)
        }
    };

    useEffect(() => {
        const categroyList = async () => {
            const {data} = await axios.get(
                `${url}/api/v1/manager/categoryList`,
                {},
                {withCredentials: true}
            );

            setCategory([...data.category])
        }
        categroyList()

    }, [isCategory])

    const createCategory = async () => {
        const {data} = await axios.post(
            `${url}/api/v1/manager/createCategory`,
            {title:isTitle, image:newFileName},
            {withCredentials: true}
        );

        if (data.success) {
            setTitle('')
            setProductId('')
            setFileList([])
            setNewFileName(null)
            setIsModalOpen(!open);
            message.success(data.message);
        } else {
            message.error(data.message);
        }
    };

    const editCategory = async (_id, index) => {

        if(!isModalOpen){
            setProductId(_id)
            setTitle(isCategory[index]?.title)
            setNewFileName(isCategory[index]?.image)
            setIsModalOpen(!isModalOpen);
            setFileList([{
                uid: '-1',
                name: isCategory[index]?.image,
                status: 'done',
                url: `${url}/images/${isCategory[index]?.image}`,
            },])
        } else{
            const {data} = await axios.post(
                `${url}/api/v1/manager/changeCategory`,
                {_id:isProductId, title:isTitle, image:newFileName},
                {withCredentials: true}
            );

            if (data.success) {
                setTitle('')
                setProductId('')
                setFileList([])
                setNewFileName(null)
                setIsModalOpen(false);
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        }

    };


    const removeCategory = async (_id) => {
        const {data} = await axios.post(
            `${url}/api/v1/manager/removeCategory`,
            {_id},
            {withCredentials: true}
        );

        if (data.success) {
            message.success(data.message);
        } else {
            message.error(data.message);
        }
    };

    const props = {
        action: `${url}/upload`,
        accept:".jpg, .jpeg, .png",
        listType:"picture",
        maxCount:1,
        onChange(info) {
            if (info.file.status === 'done') {
                if(newFileName !== null){
                    axios.post(`${url}/delete`, { filename: newFileName  })
                        .catch(error => {
                            console.error('Error deleting file:', error);
                        });
                    message.success(`Image ${info.file.name} successfully uploaded`);
                    setNewFileName(info.file.response.newFileName);
                } else{
                    message.success(`Image ${info.file.name} successfully uploaded`);
                    setNewFileName(info.file.response.newFileName);
                }
            } else if (info.file.status === 'error') {
                message.error(`Error, the image '${info.file.name}' was not uploaded.`);
            }
            setFileList(info.fileList);
        },
        onRemove(file) {
            console.log('Removing file:', file);
            axios.post(`${url}/delete`, { filename: newFileName  })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error deleting file:', error);
                });
        },
    };
    return (
        <>
            <ul className='cart__list_admin'>
                {isCategory.length ?
                    (isCategory.map((item, index) =>(
                        <li key={`category_${index}`}>
                            <div className="content">
                                <Link to={`/admin/product/${item._id}`}>
                                <img src={`${url}/images/${item.image}`} alt="Product image"/>
                                </Link>
                            </div>
                            <div className="link">
                                    <Link to={`/admin/product/${item._id}`}>
                                    {item.title}
                                    <svg width="21" height="14" viewBox="0 0 21 14">
                                        <path
                                            d="M14.7071 0.646447C14.5118 0.451184 14.1953 0.451184 14 0.646447C13.8047 0.841709 13.8047 1.15829 14 1.35355L14.7071 0.646447ZM14 1.35355L20 7.35355L20.7071 6.64645L14.7071 0.646447L14 1.35355Z"
                                            fill="#00205F"/>
                                        <path
                                            d="M14 13.3535C13.8047 13.5488 13.4882 13.5488 13.2929 13.3535C13.0976 13.1583 13.0976 12.8417 13.2929 12.6464L14 13.3535ZM20 7.35352L14 13.3535L13.2929 12.6464L19.2929 6.64642L20 7.35352Z"
                                            fill="#00205F"/>
                                        <path
                                            d="M1 6.35355C0.723858 6.35355 0.5 6.5774 0.5 6.85355C0.5 7.12969 0.723858 7.35355 1 7.35355V6.35355ZM20 6.35355L1 6.35355V7.35355L20 7.35355V6.35355Z"
                                            fill="#02205F"/>
                                    </svg>
                                    </Link>
                                <div style={{display:'flex'}}>
                                    <Button className='category_edited' onClick={()=>editCategory(item._id, index)}>
                                        <EditOutlined/>
                                    </Button>
                                    <Popconfirm
                                        title="Delete the category"
                                        description="Are you sure to delete this category?"
                                        onConfirm={()=>removeCategory(item._id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button className='category_deleted' danger>
                                            <DeleteOutlined/>
                                        </Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        </li>
                    )))
                    :
                    (<>Categories not found</>)}

            </ul>
            <FloatButton
                icon={<PlusOutlined/>}
                type="primary"
                tooltip={<div>Create category</div>}
                onClick={showModal}
                style={{
                    right: 56,
                    width: 56,
                    height: 56
                }}
            />

            <Modal
                title="Create category"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(!isModalOpen)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(!isModalOpen)}>Cancel</Button>,
                    <Button key="ok" type="primary" onClick={() => {
                        isProductId ? editCategory() : createCategory()
                    }}>{isProductId ? `Save` : `Create`}</Button>,
                ]}

            >
                <Col style={{margin: '30px 16px 15px'}}>
                    <Input type='text' placeholder="Title" value={isTitle} prefix={<FontColorsOutlined/>}
                           onChange={(e) => setTitle(e.target.value)}/>
                </Col>
                <Row style={{margin: '15px 16px 15px'}}>
                    <Upload
                        {...props}
                        fileList={fileList}
                    >
                        <Button icon={<UploadOutlined/>}>Upload (Max: 1)</Button>
                    </Upload>
                </Row>
            </Modal>
        </>
    );
};

export default ListCategory;