import React, { useState, useEffect } from 'react'
import "./OrderCard.scss"
import axios from 'axios'
import Cookies from 'js-cookie';
import config from '../../config'


const OrderCard = ({ item }) => {
    const accessToken = Cookies.get('accessToken')
    const [user, setUser] = useState([]);

    const handleOrderComplete = async () => {
        try {
            await axios.put(`${config.apiBaseUrl}/api/order/update/${item._id}/${item.email}`);
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
    }, [accessToken])
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
                    <button onClick={handleOrderComplete}>Complete</button>
                )}
            </div>
        </div>
    )
}

export default OrderCard
