import React, {useEffect, useState} from 'react'
import './Shop.scss'
import axios from 'axios'
import ProductCard from '../../components/ProductCard/ProductCard'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'

const Shop = () => {
    const accessToken = Cookies.get('accessToken')
    const [user, setUser] = useState([]);
    const [products, setProduct] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try{
          const resProduct= await axios.get(`http://54.221.98.143:8000/api/product/read`);
            setProduct(resProduct.data)
          const response = await axios.post(`http://54.221.98.143:8000/api/auth/test-token/${accessToken}`)
            setUser(response.data)
        } catch (error){
          console.error(error);
        }
      }
    fetchData();
  }, [])
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
                <ProductCard key={pro._id} item={pro}/>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Shop
