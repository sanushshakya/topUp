import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetail.scss";
import Cookies from "js-cookie";
import config from "../../config";

const ProductDetail = () => {
  const { productId } = useParams();
  const accessToken = Cookies.get("accessToken");
  const [user, setUser] = useState([]);
  const [product, setProduct] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (productId) {
          const resProduct = await axios.get(
            `${config.apiBaseUrl}/api/product/read_by_id/${productId}`
          );
          setProduct(resProduct.data);
        }
        if (accessToken) {
          const response = await axios.post(
            `${config.apiBaseUrl}/api/auth/test-token/${accessToken}`
          );
          setUser(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${config.apiBaseUrl}/api/product/delete/${productId}`,
        {
          params: {
            token: accessToken,
          },
        }
      );
      window.location.href = `/shop`;
    } catch (error) {
      console.error(error.response.data);
    }
  };
  return (
    <div className="productDetail">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={`/${product.image_url}`} />
          </div>
          <div className="right">
            <span className="title">{product.product_name}</span>
            <span className="price">Rs. {product.price}</span>
            <span className="note">
              Note: Once the order purchased it's non refundable
            </span>
            {product.status === "pending" && (
              <span className="status">Out of Stock</span>
            )}
            {product.status === "in stock" && (
              <span>
                <Link to={`/buyproduct/${product._id}`} className="link">
                  <button className="btn-nav">Buy Now</button>
                </Link>
              </span>
            )}
            {user.role === "admin" && (
              <div className="edit">
                <Link to={`/updateproduct/${productId}`} className="link">
                  <button className="btn-nav">Update</button>
                </Link>
                <button onClick={handleDelete} className="btn-nav">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="bottom">
          <div className="left">
            <span className="desc">
              <h3>Product Description:</h3>
              {product.description}
            </span>
            <span className="purchase">
              <h3>How to Purchase ?</h3>
              <span>Step 1 : Click buy button</span>
              <span>Step 3 : Click the order button</span>
              <span>Step 4 : Your order will be sent</span>
              <span>
                Re-check if you have enough balance in your wallet for the
                purchase.
              </span>
            </span>
          </div>
          <div className="right">
            <span className="purchase">
              <h3>How to redeem Pubg Mobile UC Pins?</h3>
              <span>Step 1 : Login to your account at Midasbuy</span>
              <span>
                Step 2 : Access the "PUBG Mobile game credit top-up" page and
                enter your PUBG Mobile player ID..
              </span>
              <span>
                Step 3 : Access "Redeem Code" page, enter the redemption code
                provided on that page
              </span>
              <span>
                Step 4 : You can then redeem this code value as PUBG Mobile
                Unknown Cash
              </span>
              <span>
                Mobile UC. - This product is not applicable for Japanese /
                Korean / Taiwan / Vietnam servers
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
