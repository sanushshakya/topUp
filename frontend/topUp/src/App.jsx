import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import './App.scss'

//import components
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer';

//import pages
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import CatProduct from './pages/CatProduct/CatProduct';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import BuyProduct from './pages/BuyProduct/BuyProduct';
import Payment from './pages/Payment/Payment';
import About from './pages/AboutUs/About';
import Congrats from './pages/Congrats/Congrats';
import Login from './pages/Login/Login';
import AddProduct from './pages/AddProduct/AddProduct';
import UpdateProduct from './pages/UpdateProduct/UpdateProduct';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Order from './pages/Order/Order';
import CreateCat from './pages/CreateCat/CreateCat';
import Tournament from './pages/Tournament/Tournament';
import CreateTour from './pages/CreateTour/CreateTour';
import ResetPassword from './pages/Login/ResetPassword';


function App() {
  const Layout = () => {
    return (
      <div className="layout">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path:'/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/shop',
          element: <Shop />
        },
        {
          path: '/category/:catName',
          element: <CatProduct />
        },
        {
          path: '/productdetail/:productId',
          element: <ProductDetail />
        },
        {
          path: '/buyproduct/:productId',
          element: <BuyProduct />
        },
        {
          path: '/payment',
          element: <Payment />
        },
        {
          path: '/aboutus',
          element: <About />
        },
        {
          path: '/congrats',
          element: <Congrats />
        },
        {
          path: '/addproduct',
          element: <AddProduct />
        },
        {
          path: '/updateproduct/:productId',
          element: <UpdateProduct />
        },
        {
          path: '/profile/:userId',
          element: <Profile />
        },
        {
          path: '/order',
          element: <Order />
        },
        {
          path: '/createcat',
          element: <CreateCat />
        },
        {
          path: '/tournament',
          element: <Tournament />
        },
        {
          path: '/createtour',
          element: <CreateTour />
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/resetpassword',
      element: <ResetPassword/>
    }
  ])

  return (
    <div className="App">
        <RouterProvider router={router} />
    </div>
  )
}

export default App
