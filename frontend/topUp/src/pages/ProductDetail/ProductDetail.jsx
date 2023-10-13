import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.scss'
import Cookies from 'js-cookie'
import config from '../../config'

const ProductDetail = () => {
    const { productId } = useParams();
    const accessToken = Cookies.get('accessToken')
    const [user, setUser] = useState([]);
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
                }
            }
            catch (error) {
                console.error(error);
            }

        }
        fetchData();

    }, [])

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${config.apiBaseUrl}/api/product/delete/${productId}`, {
                params: {
                  token: accessToken
                }
              });
            window.location.href = `/categories`
        } catch (error) {
            console.error(error.response.data);
        }
    }
    return (
        <div className='productDetail'>
            <div className="container">
                <div className="top">
                    <div className="left">
                        <img src={`/${product.image_url}`} />
                    </div>
                    <div className="right">
                        <span className='title'>{product.product_name}</span>
                        <span className='price'>Rs. {product.price}</span>
                        <span className='note'>Note: Once the order purchased it's non refundable</span>
                        {product.status === 'pending' && (
                            <span className='status'>Out of Stock</span>
                        )}
                        {product.status === 'in stock' && (
                            <span>
                                <Link to={`/buyproduct/${product._id}`} className='link'><button>Buy Now</button></Link>
                            </span>

                        )}
                        {user.role === 'admin' && (
                            <div className="edit">
                                <Link to={`/updateproduct/${productId}`} className="link"><button>Update</button></Link>
                                <button onClick={handleDelete}>Delete</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bottom">
                    <span className='desc'>
                        <h3>Product Description:</h3>
                        {product.description}
                    </span>
                    <span className='purchase'>
                        <h3>How to Purchase ?</h3>
                        <span>Step 1 : Click buy button</span>
                        <span>Step 2 : Fill in the form if any</span>
                        <span>Step 3 : Click the order button</span>
                        <span>Step 4 : Your order will be sent</span>
                        <span>Step 5 : Scan the payment and pay the due amount</span>
                        <span>Step 6 : Wait for 5 minutes</span>
                        <span>Step 7 : You'll receive and email</span>
                    </span>

                </div>
            </div>
        </div>
    )
}

export default ProductDetail
