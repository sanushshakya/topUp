import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CatCard.scss";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../config";

const CatCard = ({ item }) => {
  const accessToken = Cookies.get("accessToken");
  const [user, setUser] = useState([]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${config.apiBaseUrl}/api/category/delete/${item._id}`,
        {
          params: {
            token: accessToken,
          },
        }
      );
      window.location.href = `/`;
      // Handle the response as needed
    } catch (error) {
      console.error(error.response?.data || error);
      // Handle the error
    }
  };

  useEffect(() => {
    if (accessToken) {
      const fetchData = async () => {
        try {
          const response = await axios.post(
            `${config.apiBaseUrl}/api/auth/test-token/${accessToken}`
          );
          setUser(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, []);
  return (
    <div className="catCard">
      <div className="container">
        <span>
          <Link to={`/category/${item.cat_name}`} className="link">
            <img src={item.image_url} alt="" />
          </Link>
        </span>
        <span className="title">{item.cat_name}</span>
        <span className="desc">{item.description}</span>
        {user.role === "admin" && (
          <span>
            <button className="btn-nav" onClick={handleDelete}>
              Delete
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default CatCard;
