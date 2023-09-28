import React, {useEffect, useState}from 'react'
import './Home.scss'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import Banner from '../../components/Banner/Banner'
import CatCard from '../../components/CatCard/CatCard';
import ProductCard from '../../components/ProductCard/ProductCard';
import config from '../../config'

const Home = () => {
  const accessToken = Cookies.get('accessToken')
  const [banners, setBanner] = useState([]);
  const [cats, setCat] = useState([]);
  const [products, setProduct] = useState([]);
  const [user, setUser] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try{
          const resBan = await axios.get(`${config.apiBaseUrl}/api/banner/read`);
          setBanner(resBan.data)
          const resCat= await axios.get(`${config.apiBaseUrl}/api/category/read`);
          setCat(resCat.data)
          const resProduct= await axios.get(`${config.apiBaseUrl}/api/product/read`);
          setProduct(resProduct.data)
          const response = await axios.post(`${config.apiBaseUrl}/api/auth/test-token/${accessToken}`)
          setUser(response.data)
        } catch (error){
          console.error(error);
        }
      }
    fetchData();
  }, [])
  
  return (
    <div className='home'>
      <div className="container">
        <div className="banner">
          <Carousel autoPlay={true} showThumbs={false}>
            {banners.slice(0, 3).map(ban => (
              <Banner item={ban} key={ban._id} />
            ))}
          </Carousel>
        </div>
        <div className="cmpTitle cat">
          <h1>Categories</h1>
          {user.role==='admin' && (
            <Link to='/createcat' className='link'><button>Create New Category</button></Link>
          )}
        </div>
        <div className="slide">
          {cats.slice(0, 4).map(cat => (
            <CatCard key={cat._id} item={cat}/>
          ))}
        </div>
        <div className="banner">
          <Carousel autoPlay={true} showThumbs={false}>
            {banners.slice(3, 6).map(ban => (
              <Banner item={ban} key={ban._id} />
            ))}
          </Carousel>
        </div>
        <div className="cmpTitle">
          <h1>Products</h1>
        </div>
        <div className="slide">
          {products.slice(0, 4).map(pro => (
            <ProductCard key={pro._id} item={pro}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
