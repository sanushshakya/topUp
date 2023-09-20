import React from 'react'
import './Banner.scss'

const Banner = ({item}) => {
  return (
    <div className='banner'>
        <div className="container">
            <img src={`/${item.image_url}`} alt=""/>
        </div>
    </div>
  )
}

export default Banner
