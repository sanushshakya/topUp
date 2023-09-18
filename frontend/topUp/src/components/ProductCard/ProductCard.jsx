import React from 'react'
import { Link } from 'react-router-dom'
import "./ProductCard.scss"


const ProductCard = ({item}) => {
  return (
    <Link to={`/productdetail/${item._id}`} className='link'>
        <div className='productCard'>
            <img src={`/${item.image_url}`} alt=""/>
            <div className="details">
                <span className='title'>{item.product_name}</span>
                <span className='price'>Rs. {item.price}</span>
                {item.status == 'pending' && (
                    <>
                        <span className='status'>Out of Stock</span>
                    </>
                )}
                {item.status === 'in stock' && (
                    <>
                        <Link to={`/buyproduct/${item._id}`} className='link'><button>Buy Now</button></Link>
                    </>
                )}
            </div>
        </div>
    </Link>
  )
}

export default ProductCard
