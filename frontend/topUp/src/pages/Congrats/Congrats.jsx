import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Congrats.scss";
import Cookies from "js-cookie";

const Congrats = () => {
  const accessToken = Cookies.get("accessToken");
  const { token } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
  {
    !isLoggedIn && (window.location.href = "/login");
  }
  return (
    <div className="congrats">
      <div className="container">
        <span>Congratulations!</span>
        <span className="desc">
          Your redeemable token: {token}
          <br />
          We've also sent you this token in your email.
        </span>
      </div>
    </div>
  );
};

export default Congrats;
