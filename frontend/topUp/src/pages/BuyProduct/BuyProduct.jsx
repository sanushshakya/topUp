import React, { useState, useEffect } from "react";
import "./BuyProduct.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import config from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const BuyProduct = () => {
  const accessToken = Cookies.get("accessToken");
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
  const [user, setUser] = useState([]);
  const [balance, setBalance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false); // State to track if ordering process is ongoing
  const { productId } = useParams();
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
          const resBalance = await axios.get(
            `${config.apiBaseUrl}/api/wallet/read`,
            {
              params: {
                token: accessToken,
              },
            }
          );
          setBalance(resBalance.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [accessToken, productId]);

  const handleSubmit = async () => {
    if (isOrdering) return; // Prevent multiple orders while processing one
    setIsOrdering(true); // Set state to indicate ordering process has started
    setLoading(true);

    try {
      // Recheck balance before making the purchase
      const resBalance = await axios.get(`${config.apiBaseUrl}/api/wallet/read`, {
        params: { token: accessToken },
      });
      const currentBalance = resBalance.data.balance;

      if (currentBalance < product.price) {
        alert("Not enough balance.");
        setIsOrdering(false);
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", `${user.username}`);
      formData.append("email", `${user.email}`);
      formData.append("product", `${product.product_name}`);
      formData.append("user_id", `${user._id}`);
      formData.append("transaction_type", "Purchase Token");
      formData.append("amount", `${product.price}`);

      const resPurchase = await axios.post(
        `${config.apiBaseUrl}/api/gift/buy/${product.product_name}`,
        null,
        {
          params: { token: accessToken },
        }
      );
      const tok = resPurchase.data.token;

      await axios.put(
        `${config.apiBaseUrl}/api/wallet/update_subtract/${product.price}`,
        null,
        {
          params: { token: accessToken },
        }
      );

      await axios.post(`${config.apiBaseUrl}/api/transaction/create`, formData, {
        params: { token: accessToken },
      });

      await axios.post(`${config.apiBaseUrl}/api/order/create/${tok}`, formData, {
        params: { token: accessToken },
      });

      window.location.href = `/congrats/${resPurchase.data.token}`;
    } catch (error) {
      console.error(error.response?.data || error);
      // Handle the error
    } finally {
      setIsOrdering(false); // Reset ordering state after process completes
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    window.location.href = "/login";
    return null;
  }

  const validCategories = ["Others"];

  return (
    <div className="buy">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={`/${product.image_url}`} alt={product.product_name} />
          </div>
          <div className="center">
            <h1>{product.product_name}</h1>
            <h1>Rs. {product.price}</h1>
            {validCategories.includes(product.cat_name) ? (
              <p>Contact Admin for the Purchase.</p>
            ) : (
              <>
                {product.price <= balance.balance ? (
                  <>
                    {isOrdering ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <button onClick={handleSubmit} className="btn-nav">
                        Order
                      </button>
                    )}
                  </>
                ) : (
                  <h1>Not Enough Balance.</h1>
                )}
              </>
            )}
            <p>Note: Please just click one time and wait.</p>
          </div>
          <div className="right">
            <h1>Your Balance:</h1>
            <h1>Rs. {balance.balance}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyProduct;
