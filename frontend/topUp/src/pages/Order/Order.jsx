import React, { useState, useEffect } from 'react'
import OrderCard from '../../components/OrderCard/OrderCard';
import Cookies from 'js-cookie';
import axios from 'axios';
import './Order.scss'
import config from '../../config'

const Order = () => {
    const accessToken = Cookies.get('accessToken')
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
    const [user, setUser] = useState([]);
    const [orders, setOrder] = useState([])
    const [pendings, setPending] = useState([])
    const [orderUsers, setOrderUser] = useState([])
    const [all, setAll] = useState(true)
    const [status, setStatus] = useState(false)

    const handleAll = () => {
        setAll(true);
        setStatus(false);
    }

    const handleStatus = () => {
        setAll(false);
        setStatus(true);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (accessToken) {
                    const response = await axios.post(`${config.apiBaseUrl}/api/auth/test-token/${accessToken}`)
                    setUser(response.data)
                }
                const resAllOrder = await axios.get(`${config.apiBaseUrl}/api/order/read`, {
                    params: {
                      token: accessToken
                    }
                  })
                setOrder(resAllOrder.data)

                const resOrderStatus = await axios.get(`${config.apiBaseUrl}/api/order/read_order_by_status`, {
                    params: {
                      token: accessToken
                    }
                  })
                setPending(resOrderStatus.data)

                if (user) {
                    const resOrderUser = await axios.get(`${config.apiBaseUrl}/api/order/read_order_by_user/${user._id}`, {
                        params: {
                          token: accessToken
                        }
                      })
                    setOrderUser(resOrderUser.data)
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchData();

    }, [accessToken, user])

    {
        !isLoggedIn && (
            window.location.href = '/login'
        )
    }

    return (
        <div className='order'>
            <div className="container">
                <h1>Orders</h1>
                <div className="detail">
                    <div className="left">
                        <button onClick={handleAll}>All Orders</button>
                        {user.role === 'admin' && (
                            <button onClick={handleStatus}>Pending</button>
                        )}
                    </div>
                    {all && user.role === 'admin' && (
                        <div className="right">
                            {orders.map(ord => (
                                <OrderCard key={ord._id} item={ord} />
                            ))}
                        </div>
                    )}
                    {status && user.role === 'admin' && (
                        <div className="right">
                            {pendings.map(ord => (
                                <OrderCard key={ord._id} item={ord} />
                            ))}
                        </div>
                    )}
                    {all && user.role === 'user' && (
                        <div className="right">
                            {orderUsers.map(ordUser => (
                                <OrderCard key={ordUser._id} item={ordUser} />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Order
