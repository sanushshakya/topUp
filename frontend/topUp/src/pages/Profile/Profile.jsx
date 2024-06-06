import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./Profile.scss";
import config from "../../config";
import { faL } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const accessToken = Cookies.get("accessToken");
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(false);
  const [banners, setBanner] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [product, setProduct] = useState([]);
  const [tarnsactionHistory, setTransactionHistory] = useState([]);
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleProfile = () => {
    setProfile(!profile);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", e.target.username.value);
    formData.append("phone", e.target.phone.value);
    try {
      const response = await axios.put(
        `${config.apiBaseUrl}/api/user/update/${user._id}`,
        formData,
        {
          params: {
            token: accessToken,
          },
        }
      );
      setUser(response.data);
      setProfile(false);
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };
  const handleRechargeRequest = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", e.target.email.value);
    formData.append("amount", e.target.amount.value);
    formData.append("code", e.target.code.value);
    try {
      await axios.post(
        `${config.apiBaseUrl}/api/wallet/recharge_request`,
        formData,
        {
          params: {
            token: accessToken,
          },
        }
      );
      window.location.reload();
      alert("Request Sent");
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };
  const handlePassUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("password", e.target.password.value);
    try {
      const response = await axios.put(
        `${config.apiBaseUrl}/api/user/update/${user._id}`,
        formData,
        {
          params: {
            token: accessToken,
          },
        }
      );
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  const handleBanAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image_url", e.target.elements.image_url.files[0]);
    try {
      await axios.post(`${config.apiBaseUrl}/api/banner/create`, formData, {
        params: {
          token: accessToken,
        },
      });
    } catch (error) {
      console.error(error.response?.data || error);
    }
    setAddBan(false);
    setBan(true);
  };

  const handleBanDel = async (id) => {
    await axios.delete(`${config.apiBaseUrl}/api/banner/delete/${id}`, {
      params: {
        token: accessToken,
      },
    });
  };

  const handleTokenChange = (index, value) => {
    const updatedTokens = [...tokens];
    updatedTokens[index] = value;
    setTokens(updatedTokens);
  };

  const renderTokenInputs = () => {
    return tokens.map((token, index) => (
      <input
        key={index}
        type="text"
        value={token}
        onChange={(e) => handleTokenChange(index, e.target.value)}
        placeholder="Enter Token"
      />
    ));
  };

  const handleGiftsAdd = async (e) => {
    e.preventDefault();
    console.log(selectedProduct);
    const formData = new FormData();
    formData.append("product_name", selectedProduct);
    formData.append("tokens", `${tokens}`);

    try {
      await axios.post(`${config.apiBaseUrl}/api/gift/create`, formData, {
        params: {
          token: accessToken,
        },
      });
    } catch (error) {
      console.error(error.response?.data || error);
    }
    window.location.reload();
  };

  const handleTokenDelete = async (product_name) => {
    await axios.delete(`${config.apiBaseUrl}/api/gift/delete/${product_name}`, {
      params: {
        token: accessToken,
      },
    });
    window.location.reload();
  };

  const handleTokenUpdate = (product_name) => {
    setProduct(product_name);
  };

  const handleTokenAddition = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("product_name", product);
    formData.append("tokens", `${tokens}`);
    try {
      await axios.put(`${config.apiBaseUrl}/api/gift/update`, formData, {
        params: {
          token: accessToken,
        },
      });
    } catch (error) {
      console.error(error.response?.data || error);
    }
    window.location.reload();
  };
  const handleLogout = () => {
    Cookies.set("accessToken", null, { path: "/", expires: new Date(0) });
    Cookies.set("refreshToken", null, { path: "/", expires: new Date(0) });
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessToken) {
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

          const resBalance = await axios.get(
            `${config.apiBaseUrl}/api/wallet/read`,
            {
              params: {
                token: accessToken,
              },
            }
          );
          setBalance(resBalance.data);

          const resBanner = await axios.get(
            `${config.apiBaseUrl}/api/banner/read`
          );
          setBanner(resBanner.data);

          const resTransaction = await axios.get(
            `${config.apiBaseUrl}/api/transaction/read`,
            {
              params: {
                token: accessToken,
              },
            }
          );
          setTransactionHistory(resTransaction.data);
        }
      } catch (error) {
        console.error(error.response?.data || error);
      }
    };
    fetchData();
  }, [accessToken]);

  useEffect(() => {
    if (user && user.role === "admin") {
      const fetchAdminData = async () => {
        try {
          const resGift = await axios.get(
            `${config.apiBaseUrl}/api/gift/read`,
            {
              params: {
                token: accessToken,
              },
            }
          );
          setGifts(resGift.data);
          const fetchProducts = async () => {
            try {
              const response = await axios.get(
                `${config.apiBaseUrl}/api/product/read`
              );
              setProducts(response.data);
            } catch (error) {
              console.error("Error fetching products:", error);
            }
          };
          fetchProducts();
        } catch (error) {
          console.error(error.response?.data || error);
        }
      };
      fetchAdminData();
    }
  }, [user, accessToken]);

  {
    !isLoggedIn && (window.location.href = "/login");
  }

  return (
    <div className="account">
      {user && (
        <div className="container">
          <div className="detail">
            <div className="settings">
              <h2>Account Setting</h2>
              <Link
                className={`link btn-nav ${
                  location.pathname === "/profile" ? "active" : ""
                }`}
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
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
              <button className="btn-logout link" onClick={handleLogout}>
                Logout
              </button>
            </div>
            {location.pathname === "/profile" && (
              <div className="profile">
                <h2>Profile</h2>
                <div className="top">
                  <div className="left">
                    <img src="/Subject.png" />
                  </div>
                  <div className="right">
                    <button onClick={handleProfile} className="btn-nav">
                      Update
                    </button>
                  </div>
                </div>
                {!profile && (
                  <div className="bottom">
                    <span>
                      <label>Username</label>
                      <h3>{user.username}</h3>
                    </span>
                    <span>
                      <label>Email</label>
                      <h3>{user.email}</h3>
                    </span>
                    <span>
                      <label>Phone</label>
                      <h3>{user.phone}</h3>
                    </span>
                  </div>
                )}
                {profile && (
                  <div className="bottom">
                    <form
                      onSubmit={handleProfileUpdate}
                      encType="multipart/form-data"
                    >
                      <h3>Update Profile:</h3>
                      <span>
                        <input
                          name="username"
                          type="text"
                          placeholder={user.username}
                        />
                      </span>
                      <span>
                        <input
                          name="email"
                          type="text"
                          value={user.email}
                          readOnly
                        />
                      </span>
                      <span>
                        <input
                          name="phone"
                          type="text"
                          placeholder={user.phone}
                        />
                      </span>
                      <button type="submit" className="btn-nav">
                        Save
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
            {location.pathname === "/profile/wallet" && (
              <div className="profile">
                <div className="left">
                  <h3>Your Balance:</h3>
                  <h1>{balance.balance}</h1>
                </div>
                <div className="bottom">
                  <form onSubmit={handleRechargeRequest}>
                    <h3>Recharge Wallet:</h3>
                    <span>
                      <input
                        name="email"
                        type="text"
                        value={user.email}
                        readOnly
                      />
                    </span>
                    <span>
                      <input
                        name="amount"
                        type="text"
                        placeholder="Enter Transferred Amount"
                        required
                      />
                    </span>
                    <span>
                      <input
                        name="code"
                        type="text"
                        placeholder="Enter Transaction ID"
                        required
                      />
                    </span>

                    <button type="submit" className="btn-nav">
                      Request Amount
                    </button>
                  </form>

                  <p>
                    Note: Please enter amount you send before to the admin's
                    account and also enter the transaction id.
                  </p>
                </div>
              </div>
            )}
            {location.pathname === "/profile/transaction" && (
              <div className="transaction">
                <h2>Transaction History</h2>
                <div className="cards">
                  {tarnsactionHistory && tarnsactionHistory.length > 0 ? (
                    tarnsactionHistory.map((transac, index) => (
                      <div className="transac" key={index}>
                        <span>Amount: {transac.amount}</span>
                        <span>Type: {transac.transaction_type}</span>
                        <span>Email: {transac.email}</span>
                        <span>Date:{transac.created_at}</span>
                      </div>
                    ))
                  ) : (
                    <p>No transactions done.</p>
                  )}
                </div>
              </div>
            )}
            {location.pathname === "/profile/password" && (
              <div className="profile">
                <div className="bottom">
                  <form onSubmit={handlePassUpdate}>
                    <span>
                      <input
                        name="password"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </span>
                    <button type="submit" className="btn-nav">
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            )}
            {location.pathname === "/profile/gifts" &&
              user.role === "admin" && (
                <div className="gifts">
                  <div className="top">
                    <h2>Gifts</h2>
                    <Link
                      className={`link btn-nav ${
                        location.pathname === "/profile/gifts/add"
                          ? "active"
                          : ""
                      }`}
                      to="/profile/gifts/add"
                    >
                      Add Gift Lists
                    </Link>
                  </div>
                  {gifts && gifts.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>List</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gifts.map((gift, index) => (
                          <tr key={index}>
                            <td>{gift.product_name}</td>
                            <td>{gift.tokens.length}</td>
                            <td className="edit-btn">
                              <Link
                                className={`link btn-nav ${
                                  location.pathname === "/profile/gifts/update"
                                    ? "active"
                                    : ""
                                }`}
                                to="/profile/gifts/update"
                                onClick={() =>
                                  handleTokenUpdate(gift.product_name)
                                }
                              >
                                Update
                              </Link>
                              <button
                                className="btn-nav"
                                onClick={() =>
                                  handleTokenDelete(gift.product_name)
                                }
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No any gifts available.</p>
                  )}
                </div>
              )}
            {location.pathname === "/profile/gifts/add" &&
              user.role === "admin" && (
                <div className="profile">
                  <div className="bottom">
                    <form onSubmit={handleGiftsAdd}>
                      <span>
                        <select
                          name="product_name"
                          value={selectedProduct}
                          onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                          <option value="">Select a Product</option>
                          {products.map((product) => (
                            <option
                              key={product._id}
                              value={product.product_name}
                            >
                              {product.product_name}
                            </option>
                          ))}
                        </select>
                      </span>
                      {renderTokenInputs()}
                      <button
                        className="btn-nav"
                        type="button"
                        onClick={() => setTokens([...tokens, ""])}
                      >
                        Add Tokens
                      </button>
                      <button className="btn-nav" type="submit">
                        Save
                      </button>
                    </form>
                  </div>
                </div>
              )}
            {location.pathname === "/profile/gifts/update" &&
              user.role === "admin" && (
                <div className="profile">
                  <div className="bottom">
                    <form onSubmit={handleTokenAddition}>
                      <span>
                        <input
                          name="product_name"
                          type="text"
                          value={product}
                          readOnly
                        />
                      </span>
                      {renderTokenInputs()}
                      <button
                        className="btn-nav"
                        type="button"
                        onClick={() => setTokens([...tokens, ""])}
                      >
                        Add Tokens
                      </button>
                      <button className="btn-nav" type="submit">
                        Save
                      </button>
                    </form>
                  </div>
                </div>
              )}
            {location.pathname === "/profile/banner" &&
              user.role === "admin" && (
                <div className="banner">
                  <div className="top">
                    <h2>Banners</h2>
                    <Link
                      className={`link btn-nav ${
                        location.pathname === "/profile/banner/add"
                          ? "active"
                          : ""
                      }`}
                      to="/profile/banner/add"
                    >
                      Add Banner
                    </Link>
                  </div>
                  {banners && banners.length > 0 ? (
                    banners.map((ban, index) => (
                      <div className="bottom" key={index}>
                        <h3>{ban.image_url}</h3>
                        <button
                          className="btn-nav"
                          onClick={() => handleBanDel(ban._id)}
                        >
                          delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No banners to display.</p>
                  )}
                </div>
              )}
            {location.pathname === "/profile/banner/add" && (
              <div className="profile">
                <div className="bottom">
                  <form onSubmit={handleBanAdd}>
                    <span>
                      <input name="image_url" type="file" />
                    </span>
                    <button className="btn-nav" type="submit">
                      Add Banner
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
