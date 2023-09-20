import React from 'react'
import './Payment.scss'
import {Link} from 'react-router-dom'

const Payment = () => {
  {!isLoggedIn && (
    window.location.href = '/login'
)}
  return (
    <div className='payment'>
      <div className="container">
        <h1>Payment Options</h1>
        <div className="option">
            <span>
                <p>Esewa</p>
            </span>
            <span>
                <p>Khalti</p>
            </span>
            <span>
                <p>Nabil</p>
            </span>
        </div>
        <Link to='/congrats' className='link'><button>Continue</button></Link>
      </div>
    </div>
  )
}

export default Payment
