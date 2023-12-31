import React, { useState, useEffect } from 'react'
import "./OrderCard.scss"
import axios from 'axios'
import Cookies from 'js-cookie';
import config from '../../config'


const OrderCard = ({ item }) => {
    const accessToken = Cookies.get('accessToken')
    const [user, setUser] = useState([]);
    const [status, setStatus] = useState(item.status);

    const handleOrderComplete = async () => {
        try {

            const response = await axios.put(`${config.apiBaseUrl}/api/order/update/${item._id}/${item.email}`,
                null, {
                params: {
                    token: accessToken
                }
            });
            setStatus('completed');
            window.location.href='/order'
        } catch (error) {
            console.error(error);
        }
    }

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
                    <span className='gname'>Game Name: {item.game_name}</span>
                    <span className='player'>Player Id: {item.player_id}</span>
                    <span className='player'>Username: {item.name}</span>
                </div>
                {item.status === 'pending' && user.role === 'admin' && (
                    <button onClick={handleOrderComplete}>Pending</button>
                )}
            </div>
        </div>
    )
}

export default OrderCard
