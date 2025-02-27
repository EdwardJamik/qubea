import React, { useEffect, useState } from 'react';
import './list.scss';
import axios from 'axios';
import { url } from '../../Config.js';
import { Link, useParams } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';

const List = ({ onTitleChange }) => {
    const [isCategory, setCategory] = useState([]);
    const [isProducts, setProducts] = useState([]);
    const { category_id, product_id } = useParams();

    useEffect(() => {
        const categoryList = async () => {
            if (category_id === undefined) {
                const { data } = await axios.get(`${url}/api/v1/manager/categoryList`, {}, { withCredentials: true });
                setProducts([])
                setCategory([...data?.category]);
            } else {
                const { data } = await axios.post(
                    `${url}/api/v1/manager/productSearch`,
                    { id: category_id },
                    { withCredentials: true }
                );
                if(product_id === undefined){
                    onTitleChange(data?.title);
                }

                setProducts([...data?.product]);
            }
        };
        categoryList();
    }, [category_id, onTitleChange]);

    const listAnimation = useSpring({
        position:`${category_id === undefined ? 'relative' : 'absolute'}`,
        top:'0',
        width:'100%',
        transform: `translateX(${category_id ? '-120%' : '0%'})`,
        reset: true,
    });

    const contentCartAnimation = useSpring({
        position:`${category_id ? 'relative' : 'absolute'}`,
        top:'0',
        transform: `translateX(${category_id ? '0%' : '100%'})`,
        width:'100%',
        reset: true,
    });

    return (
        <>
                    <animated.ul className="cart__list" style={listAnimation}>
                        {isCategory.map((item, index) => (
                            <li key={`categories_${index}`}>
                                <Link to={category_id ? `/${category_id}/${item._id}` : `/${item._id}`}>
                                    <div className="content">
                                        <img src={`${url}/images/${item.image}`} alt={item?.title}/>
                                        <div className="name">{item?.title}</div>
                                    </div>
                                    <div className="link">Choose</div>
                                </Link>
                            </li>

                        ))} </animated.ul>
                <animated.ul className="cart__list" style={contentCartAnimation}>
                {
                    isProducts.map((item, index) => (
                        <li key={`categories_${index}`}>
                            <Link to={category_id ? `/${category_id}/${item._id}` : `/${item._id}`}>
                                <div className="content">
                                    <img src={`${url}/images/${item.image}`} alt={item?.title}/>
                                    <div className="name">{item?.title}</div>
                                </div>
                                <div className="link">Choose</div>
                            </Link>
                        </li>
                    ))
                }
                </animated.ul>
        </>
    );
};

export default List;
