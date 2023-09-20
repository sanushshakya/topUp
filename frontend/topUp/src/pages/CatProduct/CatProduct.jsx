import React, {useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './CatProduct.scss'

import ProductCard from '../../components/ProductCard/ProductCard'

const CatProduct = () => {
    const {catName} = useParams();
    const [products, setProduct] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try{
          const resProduct= await axios.get(`http://localhost:8000/api/product/read_products_by_cat_name/${catName}`);
          setProduct(resProduct.data)
        } catch (error){
          console.error(error);
        }
      }
    fetchData();
  }, [])

  return (
    <div className='catProduct'>
        <div className="container">
            <div className="top">
                <h1>{catName}</h1>
            </div>
            <div className="bottom">
                {products.map(pro => (
                    <ProductCard key={pro._id} item={pro}/>
                ))}
            </div>
        </div>
    </div>
  )
}

export default CatProduct
