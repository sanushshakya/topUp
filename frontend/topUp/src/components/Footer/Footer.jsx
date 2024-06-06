import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="left">
          <div className="logo">
            <Link className="link" to="/">
              <img src="/Subject.png" />
              <p>eSportsCardNepal</p>
            </Link>
          </div>
        </div>
        <div className="center">
          <h3>Follow Us On</h3>
          <div className="icons">
            <Link
              className="link"
              to="https://www.facebook.com/esportscards?mibextid=ZbWKwL"
            >
              <FontAwesomeIcon icon={faFacebook} style={{ color: "#ffffff" }} />
            </Link>
            <Link
              className="link"
              to="https://www.instagram.com/theesportscards/?igshid=OGQ5ZDc2ODk2ZA%3D%3D"
            >
              <FontAwesomeIcon
                icon={faInstagram}
                style={{ color: "#ffffff" }}
              />
            </Link>
            <Link className="link" to="https://www.tiktok.com/@_deepak_tamang">
              <FontAwesomeIcon icon={faTiktok} style={{ color: "#ffffff" }} />
            </Link>
            <Link
              className="link"
              to="https://wa.me/9827617730"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#ffffff" }} />
            </Link>
          </div>
          <p>Copyright © 2023 eSportsCardNepal | Powered by Muffin</p>
        </div>
        <div className="right">
          <div className="contact">
            <span>9827617730</span>
            <span>zonegaming405@gmail.com</span>
            <span>Sallaghari, Bhaktapur</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
