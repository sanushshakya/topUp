import React, { useEffect, useState } from "react";
import "./Tournament.scss";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Tournaments from "../../components/Tournaments/Tournaments";
import config from "../../config";

const Tournament = () => {
  const accessToken = Cookies.get("accessToken");
  const [tours, setTour] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    {
      !accessToken && (window.location.href = "/login");
    }
    const fetchData = async () => {
      try {
        const resTour = await axios.get(
          `${config.apiBaseUrl}/api/tournament/read`
        );
        setTour(resTour.data);
        const resUser = await axios.post(
          `${config.apiBaseUrl}/api/auth/test-token/${accessToken}`
        );
        setUser(resUser.data);
      } catch (error) {
        console.error(error.response?.data || error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="tournament">
      <div className="container">
        {user.role === "admin" && (
          <div className="btns">
            <Link to="/createtour" className="link btn-nav">
              Create Tournament
            </Link>
          </div>
        )}
        {tours.slice(0, 1).map((tour) => (
          <Tournaments key={tour._id} item={tour} />
        ))}
        <div className="bottom">
          <h3>Tournament Link</h3>
          <div className="card">
            <img src="discord.webp" />
            <Link
              className="link btn-nav"
              to="https://discord.com/invite/cFXFu63Mh7"
            >
              Discord
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tournament;
