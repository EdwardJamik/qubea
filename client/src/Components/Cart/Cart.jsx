import React, {useEffect, useState} from 'react';

import './cart.scss'
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {url} from "../../Config.js";
import {Col, message, Modal} from "antd";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const Cart = ({onTitleProductChange}) => {

    const {product_id} = useParams();
    const [isProduct, setProduct] = useState([]);
    const [isOption, setOption] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const [isTable, setTable] = useState('');
    const [subscribeId, setSubscribeId] = useState('');
    const [pushId, setPushId] = useState('');

    const navigate = useNavigate();

    const showModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const createOrder = async () => {
        if(isTable){
            let subscribeId = ''
                FingerprintJS.load()
                    .then(fp => fp.get())
                    .then(
                        async result => {
                            subscribeId = result.visitorId
                            const {data} = await axios.post(
                                `${url}/api/v1/manager/createOrder`,
                                {table: isTable, option: isOption, product: isProduct.title, subscribeId},
                                {withCredentials: true}
                            );

                            if (data.success) {
                                const timeoutId = setTimeout(() => {
                                    showModal()
                                    navigate('/')
                                }, 10000);
                                setSuccess(true)
                                return () => clearTimeout(timeoutId);
                            } else {
                                message.warning(data.message)
                            }
                        },
                        error => {
                            console.error('Error getting fingerprint:', error);
                        }
                    );

        } else{
            message.warning('Indicate your table number')
        }
    };

    useEffect(() => {
        const product = async () => {
            const {data} = await axios.post(
                `${url}/api/v1/manager/productItemSearch`,
                {id: product_id},
                {withCredentials: true}
            );
            onTitleProductChange(data.title);
            setProduct(data.product)
        }
        product()

    }, [product_id])

    const addOptions = (index, count, option, maxCount) => {
        const updatedOptions = [...isOption];
        const existingOption = updatedOptions.find(opt => opt?.index === index);

        if (existingOption !== undefined) {
            if (count) {
                setOption(prevOptions =>
                    prevOptions.map(item =>
                        item?.index === index
                            ? {
                                index: index,
                                count: item?.count < maxCount ? Number(item?.count) + 1 : Number(item?.count),
                                option: option
                            }
                            : item
                    )
                );
            } else {
                setOption(prevOptions =>
                    prevOptions
                        .map(item =>
                            item?.index === index
                                ? {index: index, count: item?.count > 0 ? Number(item?.count) - 1 : 0, option: option}
                                : item
                        )
                        .filter(item => item.count !== 0)
                );
            }
        } else {
            if (updatedOptions.length) {
                setOption(prevOptions => [...prevOptions, {index: index, count: count ? 1 : 0, option: option}]);
            } else {
                setOption([{index: index, count: count ? 1 : 0, option: option}]);
            }
        }
    };

    return (
        <div className="cart">
            <div className='content'>
                <div className='product'>
                    <div className="content">
                        <img src={`${url}/images/${isProduct?.image}`} alt={isProduct?.title}/>
                    </div>
                    <div className="name">
                        {isProduct?.title}
                    </div>
                </div>
                <p>{isProduct?.description}
                    <button className='orderButton' onClick={() => setIsModalOpen(!isModalOpen)}>Order
                        <svg width="21" height="14" viewBox="0 0 21 14" fill="none">
                            <path
                                d="M14.7071 0.646447C14.5118 0.451184 14.1952 0.451184 14 0.646447C13.8047 0.841709 13.8047 1.15829 14 1.35355L14.7071 0.646447ZM14 1.35355L20 7.35355L20.7071 6.64645L14.7071 0.646447L14 1.35355Z"
                                fill="white"/>
                            <path
                                d="M14 13.3535C13.8048 13.5488 13.4882 13.5488 13.2929 13.3535C13.0977 13.1583 13.0977 12.8417 13.2929 12.6464L14 13.3535ZM20 7.35352L14 13.3535L13.2929 12.6464L19.2929 6.64642L20 7.35352Z"
                                fill="white"/>
                            <path
                                d="M1 6.35355C0.723858 6.35355 0.5 6.5774 0.5 6.85355C0.5 7.12969 0.723858 7.35355 1 7.35355V6.35355ZM20 6.35355L1 6.35355V7.35355L20 7.35355V6.35355Z"
                                fill="white"/>
                        </svg>
                    </button>
                </p>

            </div>
            <div className="option">
                {isProduct.options ?
                    <>
                        <p className='title'> You can add another ingredient:</p>
                        <div className="option__list">
                            <ul>
                                {isProduct.options ? isProduct.options.map((option, index) =>
                                    (option.title && option.visible ?
                                            <li key={`product_option_${index}`}>
                                                <div className="plus" onClick={() => {
                                                    addOptions(index, true, option.title, option.count)
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="65" height="65"
                                                         viewBox="0 0 65 65"
                                                         fill="none">
                                                        <rect width="65" height="65" rx="7" fill="#1C3D7F"/>
                                                        <path d="M32.5 20V45" stroke="white" strokeWidth="2"
                                                              strokeLinecap="round"/>
                                                        <path d="M20 31.5H45" stroke="white" strokeWidth="2"
                                                              strokeLinecap="round"/>
                                                    </svg>
                                                </div>
                                                <div className="minus not_input" onClick={() => {
                                                    addOptions(index, false, option.title, option.count)
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="65" height="65"
                                                         viewBox="0 0 65 65"
                                                         fill="none">
                                                        <rect width="65" height="65" rx="7"
                                                              fill={isOption?.filter(item => item?.index === index)[0]?.count ? "#1C3D7F" : '#6483C0'}/>
                                                        <path d="M20 31H45" stroke="white" strokeWidth="2"
                                                              strokeLinecap="round"/>
                                                    </svg>
                                                </div>
                                                <input type="number"
                                                       value={isOption?.filter(item => item?.index === index)[0]?.count ? isOption.filter(item => item.index === index)[0]?.count : ''}
                                                       disabled/>
                                                <p className="option__title">{option?.title}</p>
                                            </li>
                                            :
                                            <></>
                                    )
                                ) : <></>}
                            </ul>
                        </div>
                    </>
                    :
                    <></>
                }
            </div>
            <Modal
                width={isSuccess ? 1008 : 820}
                open={isModalOpen}
                onCancel={() => !isSuccess && showModal() }
                closable={!isSuccess}
                centered
                footer={[]}
            >
                <div className={isSuccess ? 'indicateTable successOrder' : 'indicateTable'}>
                    {!isSuccess ?
                        (
                            <>
                                <Col><p className='modal_title'>Indicate your table number</p></Col>
                                <Col><input className='inputTable' value={isTable} placeholder='Number...' type="number" disabled/></Col>
                                <Col>
                                    <div className="keyboard">
                                        <button onClick={() => setTable(
                                            isTable + `1`
                                        )}>1
                                        </button>
                                        <button onClick={() => setTable(
                                            isTable + `2`
                                        )}>2
                                        </button>
                                        <button onClick={() => setTable(
                                            isTable + `3`
                                        )}>3
                                        </button>
                                        <button onClick={() => setTable(
                                            isTable + `4`
                                        )}>4
                                        </button>
                                        <button onClick={() => setTable(
                                            isTable + `5`
                                        )}>5
                                        </button>
                                        <button onClick={() => setTable(
                                            isTable + `6`
                                        )}>6
                                        </button>
                                        <button onClick={() => setTable(
                                            isTable + `7`
                                        )}>7
                                        </button>
                                        <button onClick={() => setTable(
                                            isTable + `8`
                                        )}>8
                                        </button>
                                        <button onClick={() => setTable(
                                            isTable + `9`
                                        )}>9
                                        </button>
                                        <button onClick={() => setTable(
                                            isTable + `0`
                                        )}>0
                                        </button>
                                    </div>
                                </Col>
                                <Col>
                                    <button className='orderButton' onClick={() => createOrder()}>Order
                                        <svg width="21" height="14" viewBox="0 0 21 14" fill="none">
                                            <path
                                                d="M14.7071 0.646447C14.5118 0.451184 14.1952 0.451184 14 0.646447C13.8047 0.841709 13.8047 1.15829 14 1.35355L14.7071 0.646447ZM14 1.35355L20 7.35355L20.7071 6.64645L14.7071 0.646447L14 1.35355Z"
                                                fill="white"/>
                                            <path
                                                d="M14 13.3535C13.8048 13.5488 13.4882 13.5488 13.2929 13.3535C13.0977 13.1583 13.0977 12.8417 13.2929 12.6464L14 13.3535ZM20 7.35352L14 13.3535L13.2929 12.6464L19.2929 6.64642L20 7.35352Z"
                                                fill="white"/>
                                            <path
                                                d="M1 6.35355C0.723858 6.35355 0.5 6.5774 0.5 6.85355C0.5 7.12969 0.723858 7.35355 1 7.35355V6.35355ZM20 6.35355L1 6.35355V7.35355L20 7.35355V6.35355Z"
                                                fill="white"/>
                                        </svg>
                                    </button>
                                </Col>
                            </>
                        )
                        :
                        (
                            <>
                                <h2>Thanks for choosing!</h2>
                                <div className='notice'>The administrator will bring your drink within 10 minutes.</div>
                            </>
                        )
                    }

                </div>
            </Modal>
        </div>
    );
};

export default Cart;