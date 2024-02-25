import React, { useState, useEffect } from 'react'
import "./OrderCard.scss"
import axios from 'axios'
import Cookies from 'js-cookie';
import config from '../../config'


const OrderCard = ({ item }) => {
    const accessToken = Cookies.get('accessToken')
    const [user, setUser] = useState([]);

    useEffect(() => {
        if (accessToken) {
            const fetchData = async () => {
                try {
                    const response = await axios.post(`${config.apiBaseUrl}/api/auth/test-token/${accessToken}`)
                    setUser(response.data)
                }
                catch (error) {
                    console.error(error);
                }
            }
            fetchData();
        }
    }, []);

    return (
        <div className='orderCard'>
            <div className="container">
                <div className="card">
                    <span className='title'>Product: {item.product}</span>
                    <span className='tok'>Token: {item.token}</span>
                    <span className='player'>Username: {item.name}</span>
                </div>
            </div>
        </div>
    )
}

export default OrderCard
