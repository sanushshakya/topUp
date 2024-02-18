import React, { useState, useEffect } from 'react'
import './BuyProduct.scss'
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios'
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import config from '../../config'

const BuyProduct = () => {
    const accessToken = Cookies.get('accessToken')
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
    const [user, setUser] = useState([]);
    const [balance, setBalance] = useState([]);

    const { productId } = useParams();
    const [product, setProduct] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (productId) {
                    const resProduct = await axios.get(`${config.apiBaseUrl}/api/product/read_by_id/${productId}`)
                    setProduct(resProduct.data)
                }
                if (accessToken) {
                    const response = await axios.post(`${config.apiBaseUrl}/api/auth/test-token/${accessToken}`)
                    setUser(response.data)
                    const resBalance = await axios.get(`${config.apiBaseUrl}/api/wallet/read`, {
                        params: {
                          token: accessToken,
                        },
                      });
                    setBalance(resBalance.data);
                }
            }
            catch (error) {
                console.error(error);
            }

        }
        fetchData();
    }
        , [accessToken])

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('name', `${user.username}`);
        formData.append('email', `${user.email}`);
        formData.append('product', `${product.product_name}`)
        formData.append('user_id', `${user._id}`)
        formData.append('transaction_type', 'Purchase Token')
        formData.append('amount', `${product.price}`)
        try {
            const resOrder = await axios.post(`${config.apiBaseUrl}/api/order/create`, formData, {
                params: {
                  token: accessToken
                }
            });

            const resPurchase = await axios.post(`${config.apiBaseUrl}/api/gift/buy/${product.product_name}`, null, {
                params: {
                  token: accessToken
                }
            });

            await axios.put(`${config.apiBaseUrl}/api/wallet/update_subtract/${product.price}`, null, {
                params: {
                  token: accessToken
                }
            });

            await axios.post(`${config.apiBaseUrl}/api/transaction/create`, formData, {
                params: {
                  token: accessToken
                }
            });

            window.location.href = `/congrats/${resPurchase.data.token}`
            
            // Handle the response as needed
        } catch (error) {
            console.error(error.response?.data || error);
            // Handle the error
        }
    }
    {
        !isLoggedIn && (
            window.location.href = '/login'
        )
    }

    return (
        <div className='buy'>
            <div className="container">
                <div className="top">
                    <div className="left">
                        <img src={`/${product.image_url}`} />
                    </div>
                    <div className="center">
                        <h1>{product.product_name}</h1>
                        <h1>Rs. {product.price}</h1>
                        {product.cat_name === "Game" && (
                            <>
                            {product.price < balance.balance ? (
                                <button onClick={handleSubmit}>Order</button>
                            ):(
                                <h1>Not Enough Balance.</h1>
                            )}
                            </>
                        )}
                        <p>Please just click one time and wait.</p>
                    </div>
                    <div className="right">
                        <h1>Your Balance:</h1>
                        <h1>Rs. {balance.balance}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyProduct
