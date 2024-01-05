import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import './main.scss';
import List from '../List/List.jsx';
import Cart from '../Cart/Cart.jsx';

const Main = () => {
    const [isTitle, setTitle] = useState('Drinks');
    const { category_id, product_id } = useParams();

    useEffect(() => {
        if (category_id === undefined) {
            setTitle('Drinks');
        }

        if (product_id === undefined && category_id !== undefined) {
            const lastIndex = isTitle.lastIndexOf('-');
            const modifiedText = isTitle.substring(0, lastIndex);
            setTitle(modifiedText);
        }
    }, [category_id, product_id]);

    const handleChildValueChange = (value) => {
        if (product_id === undefined) {
            setTitle('Drinks - ' + value.toLowerCase());
        } else {
            setTitle('Drinks - ' + value.toLowerCase());
        }
    };

    const contentAnimation = useSpring({
        position:`${product_id ? 'absolute' : 'relative'}`,
        transform: `translateX(${product_id ? '-120%' : '0%'})`,
        width:'100%',
        reset: true,
    });

    const contentCartAnimation = useSpring({
        position:`${product_id ? 'relative' : 'absolute'}`,
        transform: `translateX(${product_id ? '0%' : '100%'})`,
        width:'100%',
        reset: true,
    });

    return (
        <>
            <main>
                <div className="container">
                    <h2>{isTitle}</h2>

                    <div className="qubea__list">
                        <animated.div style={contentAnimation}>
                            <List onTitleChange={handleChildValueChange}/>
                        </animated.div>
                        <animated.div style={contentCartAnimation}>
                            {product_id !== undefined ? (
                                <Cart onTitleProductChange={handleChildValueChange}/>
                            ) : (<></>)}
                        </animated.div>
                        <span className="qubea__list-background">drinks</span>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Main;
