import React, {useEffect, useState} from 'react'
import './Navbar.scss'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons';


const Navbar = () => {
    const accessToken = Cookies.get('accessToken')
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
    const [user, setUser] = useState([]);

    useEffect(()=>{
        const fetchData = async() => {
            try{
                const response = await axios.post(`http://localhost:8000/api/auth/test-token/${accessToken}`)
                setUser(response.data)
            } catch (error){
                console.error(error.response?.data || error);
            }
        }
        fetchData()
    }, [])
  return (
    <div className='navbar'>
        <div className="container">
            <div className="left">
                <div className="logo">
                    <Link className='link' to='/'>TopUp</Link>
                </div>
            </div>
            <div className="center">
                <div className="pages">
                    <Link className='link' to='/'>Home</Link>
                    <Link className='link' to='/shop'>Shop</Link>
                    <Link className='link' to='/aboutus'>About Us</Link>
                </div>
            </div>
            <div className="right">
                {isLoggedIn ? (
                    <div className="user icons">
                        <Link to='/order' className='link'><FontAwesomeIcon icon={faCartShopping} style={{color: "#ffffff",}} /></Link>
                        <Link to={`/profile/${user._id}`} className='link'>{user.username}</Link>
                    </div>
                ): (
                    <div className="icons">
                        <Link className='link' to='/login'><button>Login</button></Link>
                        <Link className='link' to='/register'><button>Sign Up</button></Link>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Navbar
