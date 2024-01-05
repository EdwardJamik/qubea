import React from 'react';
import ListCategory from "./ListCategory/ListCategory.jsx";

import './product.scss'
import {useParams} from "react-router-dom";
import ListProduct from "./ListProduct/ListProduct.jsx";

const Product = () => {

    const { category_id } = useParams();

    return (
        <div className='admin_container'>
            <h3>{category_id ? `Product`: `Category`}</h3>
            {category_id ? <ListProduct id={category_id}/> : <ListCategory/>}

        </div>
    );
};

export default Product;