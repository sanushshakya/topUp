import React from 'react'
import './Congrats.scss'

const Congrats = () => {
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
