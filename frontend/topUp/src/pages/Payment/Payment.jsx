import React,{useState, useEffect} from 'react'
import './Payment.scss'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'

const Payment = () => {
  const accessToken = Cookies.get('accessToken')
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
  {!isLoggedIn && (
    window.location.href = '/login'
)}
  return (
    <div className='payment'>
      <div className="container">
        <h1>Payment Options</h1>
        <p>Please contact with our admin and recharge your wallet with required amount.</p>
        <div className="option">
            <span>
                <p>Esewa</p>
                <img src='esewa.jpg' />
            </span>
            <span>
                <p>Khalti</p>
                <img src='khalti.jpg' />
            </span>
            <span>
                <p>FonePay</p>
                <img src='fonepay.jpg' />
            </span>
            <span>
                <p>ImePay</p>
                <img src='imepay.jpg' />
            </span>
        </div>
      </div>
    </div>
  )
}

export default Payment
