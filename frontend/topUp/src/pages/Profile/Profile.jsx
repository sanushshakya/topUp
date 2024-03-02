import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import './Profile.scss'
import config from '../../config'
import { faL } from '@fortawesome/free-solid-svg-icons'

const Profile = () => {
    const accessToken = Cookies.get('accessToken')
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(false)
    const [settings, setSettings] = useState(true)
    const [pass, setPass] = useState(false)
    const [ban, setBan] = useState(false)
    const [banners, setBanner] = useState([])
    const [addBan, setAddBan] = useState(false)
    const [wallet, setWallet] = useState(false)
    const [balance, setBalance] = useState([])
    const [recharge, setRecharge] = useState(false)
    const [tokens, setTokens] = useState([])
    const [gifts, setGifts] = useState([])
    const [gList, setGList] = useState(false)
    const [addGift, setAddGift] = useState(false)
    const [updateToken, setUpdateToken] = useState(false)
    const [product, setProduct] = useState([])
    const [transaction, setTransaction] = useState(false)
    const [tarnsactionHistory, setTransactionHistory] = useState([])


    const handleLogout = () => {
        Cookies.set("accessToken", null, { path: "/", expires: new Date(0) });
        Cookies.set("refreshToken", null, { path: "/", expires: new Date(0) });
        setIsLoggedIn(false);
        window.location.href = '/'
    };

    const handleSettings = () => {
        setUpdateToken(false)
        setAddGift(false);
        setGList(false);
        setRecharge(false);
        setWallet(false);
        setBan(false);
        setSettings(true);
        setPass(false);
        setAddBan(false);
        setTransaction(false);
    }

    const handleProfile = () => {
        setProfile(true);
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', e.target.username.value);
        formData.append('phone', e.target.phone.value);
        try {
            const response = await axios.put(`${config.apiBaseUrl}/api/user/update/${user._id}`, formData, {
                params: {
                    token: accessToken
                }
            })
            setUser(response.data);
            setProfile(false);
        } catch (error) {
            console.error(error.response?.data || error);
        }
    };

    const handlePassword = () => {
        setUpdateToken(false)
        setAddGift(false);
        setGList(false);
        setRecharge(false);
        setWallet(false);
        setBan(false);
        setSettings(false);
        setPass(true);
        setAddBan(false);
        setTransaction(false);
    }

    const handlePassUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('password', e.target.password.value);
        try {
            const response = await axios.put(`${config.apiBaseUrl}/api/user/update/${user._id}`, formData, {
                params: {
                    token: accessToken
                }
            })
            setUpdateToken(false)
            setAddGift(false);
            setGList(false);
            setRecharge(false);
            setWallet(false);
            setBan(false);
            setSettings(true);
            setPass(false);
            setAddBan(false);
            setTransaction(false);
        } catch (error) {
            console.error(error.response?.data || error);
        }
    };

    const handleBan = () => {
        setUpdateToken(false)
        setAddGift(false);
        setGList(false);
        setRecharge(false);
        setWallet(false);
        setBan(true);
        setSettings(false);
        setPass(false);
        setAddBan(false);
        setTransaction(false);
    }
    const handleBanUpdate = () => {
        setBan(false);
        setAddBan(true);
        setTransaction(false);
    }

    const handleBanAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image_url', e.target.elements.image_url.files[0]);
        try {
            await axios.post(`${config.apiBaseUrl}/api/banner/create`, formData, {
                params: {
                    token: accessToken
                }
            })
        } catch (error) {
            console.error(error.response?.data || error);
        }
        setAddBan(false);
        setBan(true);
    };

    const handleBanDel = async (id) => {
        await axios.delete(`${config.apiBaseUrl}/api/banner/delete/${id}`, {
            params: {
                token: accessToken
            }
        })
    }
    const handleWallet = () => {
        setUpdateToken(false)
        setAddGift(false);
        setGList(false);
        setRecharge(false);
        setWallet(true);
        setBan(false);
        setSettings(false);
        setPass(false);
        setAddBan(false);
        setTransaction(false);
    }
    const handleRecharge = () => {
        setUpdateToken(false)
        setAddGift(false);
        setGList(false);
        setRecharge(true);
        setWallet(false);
        setBan(false);
        setSettings(false);
        setPass(false);
        setAddBan(false);
        setTransaction(false);
    }

    const handleRechargeBalance = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', e.target.email.value);
        formData.append('balance', e.target.balance.value);
        formData.append('transaction_type', 'Balance Recharge')
        formData.append('amount', e.target.balance.value)
        try {
            await axios.put(`${config.apiBaseUrl}/api/wallet/update_add`, formData, {
                params: {
                    token: accessToken
                }
            });
            await axios.post(`${config.apiBaseUrl}/api/transaction/create`, formData, {
                params: {
                    token: accessToken
                }
            });
        } catch (error) {
            console.error(error.response?.data || error);
        }
        window.location.reload();
    }

    const handleGList = () => {
        setUpdateToken(false)
        setAddGift(false);
        setGList(true);
        setRecharge(false);
        setWallet(false);
        setBan(false);
        setSettings(false);
        setPass(false);
        setAddBan(false);
        setTransaction(false);
    }

    const handleGiftAdd = () => {
        setUpdateToken(false)
        setAddGift(true);
        setGList(false);
        setRecharge(false);
        setWallet(false);
        setBan(false);
        setSettings(false);
        setPass(false);
        setAddBan(false);
        setTransaction(false);
    }

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
            />
        ));
    };

    const handleGiftsAdd = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('product_name', e.target.product_name.value);
        formData.append('tokens', `${tokens}`);

        try {
            await axios.post(`${config.apiBaseUrl}/api/gift/create`, formData, {
                params: {
                    token: accessToken
                }
            });
        } catch (error) {
            console.error(error.response?.data || error);
        }

        window.location.reload();
        console.log('hello')
        setGList(false);
        setTransaction(false);
    };

    const handleTokenDelete = async (product_name) => {
        await axios.delete(`${config.apiBaseUrl}/api/gift/delete/${product_name}`, {
            params: {
                token: accessToken,
            },
        });
        window.location.reload();
    }

    const handleTokenUpdate = (product_name) => {
        setProduct(product_name)
        setUpdateToken(true)
        setAddGift(false);
        setGList(false);
        setRecharge(false);
        setWallet(false);
        setBan(false);
        setSettings(false);
        setPass(false);
        setAddBan(false);
        setTransaction(false);
    }
    const handleTransaction = () => {
        setTransaction(true)
        setUpdateToken(false)
        setAddGift(false);
        setGList(false);
        setRecharge(false);
        setWallet(false);
        setBan(false);
        setSettings(false);
        setPass(false);
        setAddBan(false);
    }

    const handleTokenAddition = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product_name', product);
        formData.append('tokens', e.target.tokens.value);

        try {
            await axios.put(`${config.apiBaseUrl}/api/gift/update`, formData, {
                params: {
                    token: accessToken
                }
            });
        } catch (error) {
            console.error(error.response?.data || error);
        }
        window.location.reload();
        setGList(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (accessToken) {
                    const response = await axios.post(`${config.apiBaseUrl}/api/auth/test-token/${accessToken}`)
                    setUser(response.data)

                    const resBalance = await axios.get(`${config.apiBaseUrl}/api/wallet/read`, {
                        params: {
                            token: accessToken,
                        },
                    });
                    setBalance(resBalance.data);

                    const resBanner = await axios.get(`${config.apiBaseUrl}/api/banner/read`)
                    setBanner(resBanner.data)

                    const resTransaction = await axios.get(`${config.apiBaseUrl}/api/transaction/read`, {
                        params: {
                            token: accessToken,
                        },
                    });
                    setTransactionHistory(resTransaction.data)
                }


            } catch (error) {
                console.error(error.response?.data || error);
            }
        }
        fetchData()
    }, [accessToken]);

    useEffect(() => {
        if (user && user.role === 'admin') {
            const fetchAdminData = async () => {
                try {
                    const resGift = await axios.get(`${config.apiBaseUrl}/api/gift/read`, {
                        params: {
                            token: accessToken,
                        },
                    });
                    setGifts(resGift.data);
                } catch (error) {
                    console.error(error.response?.data || error);
                }
            };
            fetchAdminData();
        }
    }, [user, accessToken]);

    {
        !isLoggedIn && (
            window.location.href = '/login'
        )
    }

    return (
        <div className='profile'>
            {user && (
                <div className="container">
                    <h1>Account Settings</h1>
                    <div className="detail">
                        <div className="left">
                            <button onClick={handleSettings}>Profile Settings</button>
                            <button onClick={handleWallet}>Wallet</button>
                            {user.role === 'admin' && (
                                <>
                                    <button onClick={handleRecharge}>Recharge</button>
                                    <button onClick={handleGList}>Gifts</button>
                                    <button onClick={handleBan}>Banners</button>
                                </>
                            )}
                            <button onClick={handleTransaction}>Transaction</button>
                            <button onClick={handlePassword}>Password</button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                        {settings && (
                            <div className="right">
                                <div className="top">
                                    <div className="left">
                                        <img src='/Subject.png' />
                                    </div>
                                    <div className="right">
                                        <button onClick={handleProfile}>Update</button>
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
                                        <form onSubmit={handleProfileUpdate} encType="multipart/form-data">
                                            <h1>Update Profile:</h1>
                                            <span>
                                                <input name="username" type="text" placeholder={user.username} />
                                            </span>
                                            <span>
                                                <input name="email" type="text" value={user.email} />
                                            </span>
                                            <span>
                                                <input name="phone" type="text" placeholder={user.phone} />
                                            </span>
                                            <button type='submit'>Update</button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}
                        {wallet && (
                            <div className="right wallet">
                                <div className="top">
                                    <div className="left">
                                        <h3>Your Balance:</h3>
                                        <h1>{balance.balance}</h1>
                                    </div>
                                    <div className="right">
                                        <Link className='link' to='/payment'><button>Recharge</button></Link>
                                    </div>
                                </div>
                            </div>
                        )}
                        {recharge && user.role === 'admin' && (
                            <div className="right">
                                <div className="bottom">
                                    <form onSubmit={handleRechargeBalance}>
                                        <h1>Recharge Wallet:</h1>
                                        <span>
                                            <input name="email" type="text" placeholder='User email' />
                                        </span>
                                        <span>
                                            <input name="balance" type="text" placeholder='Recharge Amount' />
                                        </span>
                                        <button type='submit'>Update</button>
                                    </form>
                                </div>
                            </div>
                        )}
                        {gList && user.role === 'admin' && (
                            <div className="right banner">
                                <div className="top">
                                    <h1>Gifts</h1>
                                    <button onClick={handleGiftAdd}>Add Gift Lists</button>
                                </div>
                                {gifts && gifts.length > 0 ? (
                                    gifts.map((gift, index) => (
                                        <div className="gift bans" key={index}>
                                            <span>
                                                <h3>{gift.product_name}</h3>
                                                <p>{gift.tokens.length}</p>
                                                <button onClick={() => handleTokenUpdate(gift.product_name)}>Update</button>
                                                <button onClick={() => handleTokenDelete(gift.product_name)}>Delete</button>
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No any gifts available.</p>
                                )}
                            </div>
                        )}
                        {addGift && (
                            <div className="right">
                                <form onSubmit={handleGiftsAdd}>
                                    <input name='product_name' type="text" placeholder='Enter your Product' />
                                    {renderTokenInputs()}
                                    <button type="button" onClick={() => setTokens([...tokens, ''])}>
                                        Add Tokens
                                    </button>
                                    <button type='submit'>Add Gift</button>
                                </form>
                            </div>
                        )}
                        {updateToken && (
                            <div className="right">
                                <form onSubmit={handleTokenAddition}>
                                    <input name='product_name' type="text" value={product} />
                                    <input name='tokens' type="text" placeholder='Enter New Token' />
                                    <button type='submit'>Update</button>
                                </form>
                            </div>
                        )}
                        {pass && (
                            <div className="right pass">
                                <form onSubmit={handlePassUpdate}>
                                    <input name="password" type="password" placeholder='Enter new password' />
                                    <button type='submit'>Change Password</button>
                                </form>
                            </div>
                        )}
                        {transaction && (
                            <div className="right transaction">
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
                                <div className="top">
                                    <h1>Transaction History</h1>
                                </div>
                            </div>
                        )}
                        {ban && (
                            <div className="right banner">
                                <div className="top">
                                    <h1>Banners</h1>
                                    <button onClick={handleBanUpdate}>Add New Banners</button>
                                </div>
                                {banners && banners.length > 0 ? (
                                    banners.map((ban, index) => (
                                        <div className="bans" key={index}>
                                            <span>
                                                <h3>{ban.image_url}</h3>
                                                <button onClick={() => handleBanDel(ban._id)}>delete</button>
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No banners to display.</p>
                                )}
                            </div>
                        )}
                        {addBan && (
                            <div className="right addBan">
                                <form onSubmit={handleBanAdd}>
                                    <input name='image_url' type="file" />
                                    <button type='submit'>Add Banner</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile
