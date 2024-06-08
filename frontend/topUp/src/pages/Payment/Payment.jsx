import React, { useState, useEffect } from "react";
import "./Payment.scss";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const Payment = () => {
  const accessToken = Cookies.get("accessToken");
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
  {
    !isLoggedIn && (window.location.href = "/login");
  }
  return (
    <div className="payment">
      <div className="container">
        <h2>Payment Options</h2>
        <p>
          Please complete the recharge balance in one of the following accounts
          and after successfully transfering payment click the request button
          and enter your detail there.
        </p>
        <div className="option">
          <span>
            <img src="esewa.png" />
          </span>
          <span>
            <img src="ime.png" />
          </span>
        </div>
        <Link
          className={`link btn-nav ${
            location.pathname === "/profile/wallet" ? "active" : ""
          }`}
          to="/profile/wallet"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Wallet
        </Link>
      </div>
    </div>
  );
};

export default Payment;
