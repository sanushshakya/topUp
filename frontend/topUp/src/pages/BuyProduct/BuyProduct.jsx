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

    const { productId } = useParams();
    const [product, setProduct] = useState('')

    const schema = yup.object().shape({
        gname: yup.string(),
        playerid: yup.string(),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

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
                }
            }
            catch (error) {
                console.error(error);
            }

        }
        fetchData();
    }
        , [])

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', `${user.username}`);
        formData.append('email', `${user.email}`);
        formData.append('gname', data.gname);
        formData.append('playerid', data.playerid);
        formData.append('product', `${product.product_name}`)
        formData.append('user_id', `${user._id}`)
        try {
            const response = await axios.post(`${config.apiBaseUrl}/api/order/create`, formData, {
                params: {
                  token: accessToken
                }
              });
            window.location.href = `/payment`
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
                    <div className="right">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h1>{product.product_name}</h1>
                            <h1>Rs. {product.price}</h1>
                            {product.cat_name === "game" && (
                                <div className="credentials">
                                    <span>
                                        <input {...register('gname')} type="text" placeholder='Enter your InGame name' />
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                    {errors.gname && (
                                        <span className="error-message">{errors.gname.message}</span>
                                    )}
                                    <span>
                                        <input {...register('playerid')} type="text" placeholder='Enter your played id' />
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                    {errors.playerid && (
                                        <span className="error-message">{errors.playerid.message}</span>
                                    )}
                                </div>
                            )}
                            <button type="submit">Order</button>
                            <p>Please just click one time and wait.</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyProduct
