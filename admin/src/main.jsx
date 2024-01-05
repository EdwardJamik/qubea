import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
// import swDev from './sw.js'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
);

// swDev()