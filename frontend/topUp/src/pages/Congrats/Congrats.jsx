import React, {useState, useEffect} from 'react'
import './Congrats.scss'
import Cookies from 'js-cookie'

const Congrats = () => {
  const accessToken = Cookies.get('accessToken')
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
  {!isLoggedIn && (
    window.location.href = '/login'
)}
  return (
    <div className='congrats'>
        <div className="container">
            <span>
                Congratulations!
            </span>
            <span className='desc'>
                Your order has been received. Our team will be looking toward your detail
                and payments and will shortly add-ons your ordered token.
            </span>
        </div>
    </div>
  )
}

export default Congrats
