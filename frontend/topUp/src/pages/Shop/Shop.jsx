import React, { useEffect, useState } from 'react'
import './Shop.scss'
import axios from 'axios'
import ProductCard from '../../components/ProductCard/ProductCard'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import config from '../../config'

const Shop = () => {
  const accessToken = Cookies.get('accessToken')
  const [user, setUser] = useState([]);
  const [products, setProduct] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProduct = await axios.get(`${config.apiBaseUrl}/api/product/read`);
        setProduct(resProduct.data)

        if (accessToken) {
          const response = await axios.post(`${config.apiBaseUrl}/api/auth/test-token/${accessToken}`)
          setUser(response.data)
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();

  }, [accessToken])
  return (
    <div className='shop'>
      <div className="container">
        <div className="top">
          <div className="cmpTitle">
            <h1>Products</h1>
          </div>
          {user.role === 'admin' && (
            <div className="add">
              <Link to='/addproduct' className='link'><button>Add Product</button></Link>
            </div>
          )}
        </div>
        <div className="products">
          {products.map(pro => (
            <ProductCard key={pro._id} item={pro} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Shop
