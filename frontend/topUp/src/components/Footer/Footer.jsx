import React from 'react'
import {Link} from 'react-router-dom'
import './Footer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <div className='footer'>
        <div className="container">
            <div className="left">
              <div className="logo">
                <Link className='link' to='/'>TopUp</Link>
              </div>
            </div>
            <div className="center">
              <h3>Follow Us On</h3>
              <div className="icons">
                <Link className='link' to='/'><FontAwesomeIcon icon={faFacebook} style={{color: "#ffffff",}} /></Link>
                <Link className='link' to='/'><FontAwesomeIcon icon={faInstagram} style={{color: "#ffffff",}} /></Link>
                <Link className='link' to='/'><FontAwesomeIcon icon={faTiktok} style={{color: "#ffffff",}} /></Link>
                <Link className='link' to='/'><FontAwesomeIcon icon={faWhatsapp} style={{color: "#ffffff",}} /></Link>
              </div>
              <p>Copyright © 2023 Gaming Zone | Powered by Gaming Zone</p>
            </div>
            <div className="right">
              <div className="contact">
                <span>
                  9861359639
                </span>
                <span>
                  topup@email.com
                </span>
                <span>
                  Sallaghari, Bhaktapur
                </span>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Footer
