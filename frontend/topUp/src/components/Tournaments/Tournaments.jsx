import React, { useEffect, useState } from "react";
import "./Tournaments.scss";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../config";

const Tournaments = ({ item }) => {
  const accessToken = Cookies.get("accessToken");
  const [user, setUser] = useState([]);

  const handleDelete = async (tourId) => {
    try {
      const response = await axios.delete(
        `${config.apiBaseUrl}/api/tournament/delete/${tourId}`,
        {
          params: {
            token: accessToken,
          },
        }
      );
      window.location.href = `/tournament`;
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    if (accessToken) {
      const fetchData = async () => {
        try {
          const resUser = await axios.post(
            `${config.apiBaseUrl}/api/auth/test-token/${accessToken}`
          );
          setUser(resUser.data);
        } catch (error) {
          console.error(error.response?.data || error);
        }
      };
      fetchData();
    }
  }, [accessToken]);

  return (
    <div className="tour">
      <div className="banner">
        <img src={`/${item.image_url}`} />
      </div>
      <div className="detail">
        <h2>Name: {item.name}</h2>
        <h3>Price: Rs. {item.price}</h3>
        <span>{item.description}</span>
      </div>
      {user?.role === "admin" && (
        <div className="btns">
          <button className="btn-nav" onClick={() => handleDelete(item._id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Tournaments;
