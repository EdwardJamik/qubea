import './App.scss'
import {lazy, Suspense, useState} from "react";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import {ProtectedRoute} from "./ProtectedRoute";
import Header from "./Components/header/Header.jsx";
import Main from "./Components/Main/Main.jsx";
import Footer from "./Components/Footer/Footer.jsx";

import Login from "./Components/Login/Login.jsx";
import AdminPanel from "./Components/Admin/AdminPanel.jsx";
import PageLoader from "./Components/Loader/PageLoader.jsx";
import Product from "./Components/Admin/Product/Product.jsx";
import Setting from "./Components/Admin/Setting/Setting.jsx";

function App() {

  const routes = [
    {
      link: '/',
      element: <Login/>,
    },
    {
      link: '/admin',
      element: <ProtectedRoute element={<AdminPanel/>}/>,
    },
    {
      link: '/admin/product',
      element: <ProtectedRoute element={<Product/>}/>,
    },
    {
      link: '/admin/product/:category_id',
      element: <ProtectedRoute element={<Product/>}/>,
    },
    {
      link: '/admin/settings',
      element: <ProtectedRoute element={<Setting/>}/>,
    },
  ]

  return (
      <Routes>
        {routes.map((route) => (
            <Route
                key={route.link}
                path={route.link}
                element={
                  <Suspense fallback={<PageLoader />}>
                    {route.element}
                  </Suspense>
                }
            />
        ))}
      </Routes>
  );
}

export default App