import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import OrderCard from "../../components/OrderCard/OrderCard";
import Cookies from "js-cookie";
import axios from "axios";
import "./Order.scss";
import config from "../../config";

const Order = () => {
  const accessToken = Cookies.get("accessToken");
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
  const [user, setUser] = useState([]);
  const [orders, setOrder] = useState([]);
  const [orderUsers, setOrderUser] = useState([]);
  const [range, setRange] = useState([]);
  const location = useLocation();

  const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleAll = () => {
    setAll(true);
    setStatus(false);
    setSearch(false);
    setRange(false);
  };

  const handleStatus = () => {
    setAll(false);
    setStatus(true);
    setSearch(false);
    setRange(false);
  };

  const handleSearch = () => {
    setAll(false);
    setStatus(false);
    setSearch(true);
  };

  const handleSearchRange = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("from_date", e.target.elements.from.value);
    formData.append("to_date", e.target.elements.to.value);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/order/read_by_date_range`,
        formData,
        {
          params: {
            token: accessToken,
          },
        }
      );
      setRange(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessToken) {
          const response = await axios.post(
            `${config.apiBaseUrl}/api/auth/test-token/${accessToken}`
          );
          setUser(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [accessToken]);

  useEffect(() => {
    // This useEffect depends on the user state being updated
    const fetchOrderData = async () => {
      try {
        if (user._id) {
          const resAllOrder = await axios.get(
            `${config.apiBaseUrl}/api/order/read`,
            {
              params: {
                token: accessToken,
              },
            }
          );
          setOrder(resAllOrder.data);

          if (user.role === "user") {
            const resOrderUser = await axios.get(
              `${config.apiBaseUrl}/api/order/read_order_by_user/${user._id}`,
              {
                params: {
                  token: accessToken,
                },
              }
            );
            setOrderUser(resOrderUser.data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrderData();
  }, [accessToken, user]); // Added user as a dependency

  // Redirect if not logged in
  if (!isLoggedIn) {
    window.location.href = "/login";
    return null; // Make sure to return something, as the component will unmount due to the redirect
  }

  return (
    <div className="order">
      <div className="container">
        <div className="top">
          <Link
            className={`link btn-nav ${
              location.pathname === "/order/history" ? "active" : ""
            }`}
            to="/order/history"
          >
            Order
          </Link>
          {user.role === "admin" && (
            <Link
              className={`link btn-nav ${
                location.pathname.startsWith("/order/report") ? "active" : ""
              }`}
              to="/order/report"
            >
              Report
            </Link>
          )}
        </div>
        <div className="detail">
          {location.pathname === "/order/history" && user.role === "admin" && (
            <div className="cards">
              {orders.map((ord) => (
                <OrderCard key={ord._id} item={ord} />
              ))}
            </div>
          )}

          {location.pathname === "/order/history" && user.role === "user" && (
            <div className="cards">
              {orderUsers.map((ordUser) => (
                <OrderCard key={ordUser._id} item={ordUser} />
              ))}
            </div>
          )}
          {location.pathname === "/order/report" && user.role === "admin" && (
            <div className="report">
              <form onSubmit={handleSearchRange}>
                <span className="date">
                  <label>From:</label>
                  <input
                    type="date"
                    name="from"
                    placeholder="place date"
                    max={getCurrentDate()}
                  />
                </span>
                <span className="date">
                  <label>To:</label>
                  <input
                    type="date"
                    name="to"
                    placeholder="place date"
                    max={getCurrentDate()}
                  />
                </span>
                <button type="submit" className="btn-nav">
                  Search
                </button>
              </form>
              <div className="data">
                {range && (
                  <table>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Product</th>
                        <th>Token</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {range.map((r, index) => (
                        <tr key={index}>
                          <td>{r.name}</td>
                          <td>{r.product}</td>
                          <td>{r.token}</td>
                          <td>{r.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
