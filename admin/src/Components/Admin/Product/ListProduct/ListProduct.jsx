import React, {useEffect, useState} from 'react';

import './list.scss'

import {
    DeleteOutlined,
    EditOutlined,
    FontColorsOutlined,
    PlusOutlined,
    UploadOutlined
} from "@ant-design/icons";
import {Button, Checkbox, Col, FloatButton, Input, message, Modal, Popconfirm, Row, Upload} from "antd";
import {url} from "../../../../Config.js";
import axios from "axios";
import TextArea from "antd/es/input/TextArea.js";


const ListProduct = ({id}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isProduct, setProduct] = useState([]);
    const [isProductId, setProductId] = useState('');
    const [isTitle, setTitle] = useState('');
    const [isDescription, setDescription] = useState('');
    const [fileList, setFileList] = React.useState([]);
    const [newFileName, setNewFileName] = useState(null);
    const [isPositions, setPositions] = useState([{title:null,count:10, visible:true}]);


    const showModal = () => {
        setIsModalOpen(!isModalOpen);
        if(!isModalOpen){
            setTitle('')
            setProductId('')
            setFileList([])
            setNewFileName(null)

        } else{
            setPositions([{title:null,count:null, visible:true}])
        }
    };

    useEffect(() => {
        const productList = async () => {
            const {data} = await axios.post(
                `${url}/api/v1/manager/productList`,
                {_id:id},
                {withCredentials: true}
            );

            setProduct([...data.product])
        }
        productList()

    }, [isProduct])

    const createProduct = async () => {
        const {data} = await axios.post(
            `${url}/api/v1/manager/createProduct`,
            {title:isTitle, description:isDescription, options:isPositions, image:newFileName, category:id},
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

    const editProduct = async (_id, index) => {

        if(!isModalOpen){
            setProductId(_id)
            setTitle(isProduct[index]?.title)
            setDescription(isProduct[index]?.description)
            setNewFileName(isProduct[index]?.image)
            setPositions(isProduct[index]?.options)
            setIsModalOpen(!isModalOpen);
            setFileList([{
                uid: '-1',
                name: isProduct[index]?.image,
                status: 'done',
                url: `${url}/images/${isProduct[index]?.image}`,
            },])
        } else{
            // setProduct()
            const {data} = await axios.post(
                `${url}/api/v1/manager/changeProduct`,
                {_id:isProductId, title:isTitle, description:isDescription, options:isPositions, image:newFileName},
                {withCredentials: true}
            );

            if (data.success) {
                showModal()
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        }

    };


    const removeCategory = async (_id) => {
        const {data} = await axios.post(
            `${url}/api/v1/manager/removeProduct`,
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

    const removeItemsOptions = (indexPosition) => {
        setPositions((prevPositions) =>
            prevPositions.filter((_, i) => i !== indexPosition)
        );
    };

    const removeItemsPosition = (indexToRemove) => {
        setPositions((prevPosition) => {
            const newPosition = prevPosition.filter((item, i) =>
                i !== indexToRemove
            );

            return newPosition;
        });

    };

    const handleInputChangePosition = (index, field, value) => {
        const newInputValues = isPositions;

        if (!newInputValues[index]) {
            newInputValues[index] = {};
        }


            setPositions(prevPositions =>
                prevPositions.map((item, i) =>
                    i === index ? { ...item, [field]: value } : item
                )
            );

    };

    const createPosition = () => {
        setPositions(prevPositions => [...prevPositions, { title: null, count: 10, visible:true }]);
    };

    const createOption = (index) => {
        setPositions(prevPositions =>
            prevPositions.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        option: [...item.option, { name: null, price: null }]
                    }
                    : item
            )
        );
    };
    return (
        <>
            <ul className='cart__list_admin'>
                {isProduct.length ?
                    (isProduct.map((item, index) =>(
                        <li key={`category_${index}`}>
                            <div className="content">
                                <img src={`${url}/images/${item.image}`} alt="Product image"/>
                            </div>
                            <div className="link">
                                    {item.title}
                                <div style={{display:'flex'}}>
                                    <Button className='category_edited' onClick={()=>editProduct(item._id, index)}>
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
                    (<>Product not found</>)}

            </ul>
            <FloatButton
                icon={<PlusOutlined/>}
                type="primary"
                tooltip={<div>Create product</div>}
                onClick={showModal}
                style={{
                    right: 56,
                    width: 56,
                    height: 56
                }}
            />

            <Modal
                title="Create product"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(!isModalOpen)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(!isModalOpen)}>Cancel</Button>,
                    <Button key="ok" type="primary" onClick={() => {
                        isProductId ? editProduct() : createProduct()
                    }}>{isProductId ? `Save` : `Create`}</Button>,
                ]}
            >
                <Col style={{margin: '30px 0 15px'}}>
                    <Input type='text' placeholder="Title" value={isTitle} prefix={<FontColorsOutlined/>}
                           onChange={(e) => setTitle(e.target.value)}/>
                </Col>
                <Col style={{margin: '30px 0 15px'}}>
                    <TextArea type='text' placeholder="Description" value={isDescription}
                           onChange={(e) => setDescription(e.target.value)}/>
                </Col>
                <Row style={{margin: '15px 0 15px'}}>
                    <Upload
                        {...props}
                        fileList={fileList}
                    >
                        <Button icon={<UploadOutlined/>}>Upload (Max: 1)</Button>
                    </Upload>
                </Row>
                <Row className="options" style={{marginBottom:'15px', display:'block'}}>
                    {isPositions.map((item, i) => {
                        return (
                            <Col key={i} style={{ marginTop: '20px' }}>
                                    <>
                                        <div style={{display:'flex'}} key={i}>
                                            <div>
                                            <Input
                                                style={{ marginRight: '10px', marginBottom: '10px' }}
                                                prefix={<p style={{color:'#6483C0'}}>Title ingredient:</p>}
                                                value={item.title}
                                                onChange={(e) => handleInputChangePosition(i, 'title', e.target.value)}
                                            />
                                            <Input
                                                prefix={<p style={{color:'#6483C0'}}>Max count:</p>}
                                                value={item.count}
                                                type='number'
                                                onChange={(e) => handleInputChangePosition(i, 'count', e.target.value)}
                                            />
                                            </div>
                                            <div style={{display:'flex', flexDirection:'column', marginLeft:'16px', justifyContent:'space-between'}}>
                                                <Checkbox checked={item.visible}
                                                          onChange={(e) => handleInputChangePosition(i, 'visible', e.target.checked)}>Visible</Checkbox>
                                                <Button style={{ marginLeft: '10px' }} danger onClick={() => removeItemsOptions(i)}><DeleteOutlined /></Button>
                                            </div>
                                            </div>
                                        {(item.length-1) === i ?  <div style={{display:'flex'}}><Button type='primary' style={{ margin: '0 auto', width:'100%' }} onClick={() => createOption(i)}><PlusOutlined /></Button><Button danger style={{ marginLeft: '5px', width:'100%' }} onClick={() => removeItemsPosition(i)}><DeleteOutlined /></Button></div> : <></> }
                                    </>
                                {(item.length) === 0 ?  <div style={{display:'flex'}}><Button type='primary' style={{ margin: '0 auto', width:'100%' }} onClick={() => createOption(i)}><PlusOutlined /></Button><Button danger style={{ marginLeft: '5px', width:'100%' }} onClick={() => removeItemsPosition(i)}><DeleteOutlined /></Button></div> : <></> }
                            </Col>
                        );
                    })}

                    <Button style={{margin:'15px auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'}} onClick={()=>createPosition()} shape="circle" icon={<PlusOutlined />} />
                </Row>
            </Modal>
        </>
    );
};

export default ListProduct;