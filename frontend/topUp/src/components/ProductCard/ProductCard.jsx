import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import "./ProductCard.scss";

const ProductCard = ({ item }) => {
  const [tokensCount, setTokensCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (item.product_name) {
          const resGift = await axios.get(
            `${config.apiBaseUrl}/api/gift/read_by_product_name/${item.product_name}`
          );
          setTokensCount(resGift.data.tokens ? resGift.data.tokens.length : 0);
        }
      } catch (error) {
        console.error("Error fetching gift details:", error);
      }
    };
    fetchData();
  }, [item.product_name]);

  return (
    <div className="productCard">
      <Link to={`/productdetail/${item._id}`} className="link">
        <img src={`/${item.image_url}`} alt={item.product_name} />
      </Link>
      <div className="details">
        <span className="title">{item.product_name}</span>
        <span className="price">Rs. {item.price}</span>
        {tokensCount <= 0 ? (
          <span className="status">Out of Stock</span>
        ) : (
          <span>
            <Link to={`/buyproduct/${item._id}`} className="link">
              <button className="btn-nav">Buy Now</button>
            </Link>
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
