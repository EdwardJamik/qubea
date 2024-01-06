import './App.scss'
import {Suspense} from "react";
import {Route, Routes} from "react-router-dom";

import Header from "./Components/header/Header.jsx";
import Main from "./Components/Main/Main.jsx";
import Footer from "./Components/Footer/Footer.jsx";

import PageLoader from "./Components/Loader/PageLoader.jsx";

function App() {

  const routes = [
    {
      link:'/',
      element: (<><Header/><Main/><Footer/></>),
    },
    {
      link: '/:category_id',
      element:(<><Header/><Main/><Footer/></>),
    },
    {
      link: '/:category_id/:product_id',
      element: (<><Header/><Main/><Footer/></>),
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