import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBars,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import config from "../../config";

const Navbar = () => {
  const accessToken = Cookies.get("accessToken");
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
  const [user, setUser] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    Cookies.set("accessToken", null, { path: "/", expires: new Date(0) });
    Cookies.set("refreshToken", null, { path: "/", expires: new Date(0) });
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const handleWallet = async () => {
    try {
      await axios.post(`${config.apiBaseUrl}/api/wallet/create`, null, {
        params: {
          token: accessToken,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      const fetchData = async () => {
        try {
          const response = await axios.post(
            `${config.apiBaseUrl}/api/auth/test-token/${accessToken}`
          );
          setUser(response.data);
          const resWallet = await axios.get(
            `${config.apiBaseUrl}/api/wallet/read`,
            {
              params: {
                token: accessToken,
              },
            }
          );
          setWallet(resWallet.data);
        } catch (error) {
          console.error(error.response?.data || error);
        }
      };
      fetchData();
    }
  }, []);

  return (
    <div className="navbar">
      <div className="container">
        <div className="left">
          <div className="logo">
            <Link className="link" to="/">
              <img src="/Subject.png" alt="Logo" />
              <h3>eSportsCardNepal</h3>
            </Link>
          </div>
        </div>
        <div className="center">
          <div className="pages">
            <Link className="link" to="/">
              Home
            </Link>
            <Link className="link" to="/shop">
              Shop
            </Link>
            <Link className="link" to="/tournament">
              Tournaments
            </Link>
            <Link className="link" to="/aboutus">
              About Us
            </Link>
          </div>
        </div>
        <div className="right">
          {/* <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form> */}
          {isLoggedIn ? (
            <div className="icons">
              {wallet === null ? (
                <button onClick={handleWallet}>Create Wallet</button>
              ) : (
                <Link to={`/payment`} className="link btn-nav">
                  Wallet
                </Link>
              )}
              <Link to="/order/history" className="link icon">
                <FontAwesomeIcon
                  icon={faCartShopping}
                  style={{ color: "#ffffff" }}
                />
              </Link>
              <Link to="/profile" className="link icon">
                <FontAwesomeIcon icon={faUser} />
              </Link>
            </div>
          ) : (
            <div className="icons">
              <Link className="link" to="/login">
                <button className="btn-nav">Login</button>
              </Link>
              <Link className="link" to="/register">
                <button className="btn-nav">Sign Up</button>
              </Link>
            </div>
          )}
        </div>
        <div
          className="mobile-menu-icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <Link
              className="link"
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              className="link"
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              className="link"
              to="/tournament"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tournaments
            </Link>
            <Link
              className="link"
              to="/aboutus"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            {/* <form className="search-form-mobile" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form> */}
            {isLoggedIn ? (
              <div className="user icons">
                <Link
                  className={`link btn-nav ${
                    location.pathname === "/order/history" ? "active" : ""
                  }`}
                  to="/order/history"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Order
                </Link>
                {wallet === null ? (
                  <button onClick={handleWallet}>Create Wallet</button>
                ) : (
                  <Link
                    to={`/payment`}
                    className="link btn-nav"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Wallet
                  </Link>
                )}
                <Link
                  className={`link btn-nav ${
                    location.pathname === "/profile/transaction" ? "active" : ""
                  }`}
                  to="/profile/transaction"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Transaction
                </Link>
                <Link
                  className={`link btn-nav ${
                    location.pathname === "/profile/password" ? "active" : ""
                  }`}
                  to="/profile/password"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Password
                </Link>
                {user.role === "admin" && (
                  <>
                    <Link
                      className={`link btn-nav ${
                        location.pathname === "/profile/gifts" ? "active" : ""
                      }`}
                      to="/profile/gifts"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Add Gifts
                    </Link>
                    <Link
                      className={`link btn-nav ${
                        location.pathname === "/profile/banner" ? "active" : ""
                      }`}
                      to="/profile/banner"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Banners
                    </Link>
                  </>
                )}
                <Link
                  className={`link btn-nav ${
                    location.pathname === "/profile" ? "active" : ""
                  }`}
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="icons">
                <Link
                  className="link btn-nav"
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  className="link btn-nav"
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
