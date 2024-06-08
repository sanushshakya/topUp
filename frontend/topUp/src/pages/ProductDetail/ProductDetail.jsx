import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetail.scss";
import Cookies from "js-cookie";
import config from "../../config";

const ProductDetail = () => {
  const { productId } = useParams();
  const accessToken = Cookies.get("accessToken");
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [tokensCount, setTokensCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product details by ID
        if (productId) {
          const resProduct = await axios.get(
            `${config.apiBaseUrl}/api/product/read_by_id/${productId}`
          );
          setProduct(resProduct.data);

          // Fetch gift details by product name
          if (resProduct.data.product_name) {
            const resGift = await axios.get(
              `${config.apiBaseUrl}/api/gift/read_by_product_name/${resProduct.data.product_name}`
            );
            setTokensCount(
              resGift.data.tokens ? resGift.data.tokens.length : 0
            );
          }
        }

        // Fetch user details if access token is available
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
  }, [productId, accessToken]);

  const handleDelete = async () => {
    try {
      await axios.delete(
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
            {product && (
              <img src={`/${product.image_url}`} alt={product.product_name} />
            )}
          </div>
          <div className="right">
            {product && (
              <>
                <span className="title">{product.product_name}</span>
                <span className="price">Rs. {product.price}</span>
                <span className="note">
                  Note: Once the order is purchased, it's non-refundable
                </span>
                {product.cat_name === "Others" ? (
                  <span>
                    <Link to={`/buyproduct/${product._id}`} className="link">
                      <button className="btn-nav">Buy Now</button>
                    </Link>
                  </span>
                ) : tokensCount <= 0 ? (
                  <span className="status">Out of Stock</span>
                ) : (
                  <span>
                    <Link to={`/buyproduct/${product._id}`} className="link">
                      <button className="btn-nav">Buy Now</button>
                    </Link>
                  </span>
                )}
                {user?.role === "admin" && (
                  <div className="edit">
                    <Link to={`/updateproduct/${productId}`} className="link">
                      <button className="btn-nav">Update</button>
                    </Link>
                    <button onClick={handleDelete} className="btn-nav">
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="bottom">
          <div className="left">
            {product && (
              <>
                <span className="desc">
                  <h3>Product Description:</h3>
                  {product.description}
                </span>
                <span className="purchase">
                  <h3>How to Purchase?</h3>
                  <span>Step 1: Click the buy button</span>
                  <span>Step 2: Click the order button</span>
                  <span>Step 3: Your order will be sent</span>
                  <span>Re-check if you have enough balance.</span>
                </span>
              </>
            )}
          </div>
          {product?.cat_name === "PUBG MOBILE" && (
            <div className="right">
              <span className="purchase">
                <h3>How to redeem Pubg Mobile UC Pins?</h3>
                <span>Step 1: Login to your account at Midasbuy</span>
                <span>
                  Step 2: Access the "PUBG Mobile game credit top-up" page and
                  enter your PUBG Mobile player ID.
                </span>
                <span>
                  Step 3: Access "Redeem Code" page, enter the redemption code
                  provided on that page
                </span>
                <span>
                  Step 4: You can then redeem this code value as PUBG Mobile
                  Unknown Cash
                </span>
                <span>
                  This product is not applicable for Japanese / Korean / Taiwan
                  / Vietnam servers
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
