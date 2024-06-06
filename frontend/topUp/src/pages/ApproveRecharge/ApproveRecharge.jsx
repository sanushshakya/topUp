import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import config from "../../config";
import "./ApproveRecharge.scss";
import Cookies from "js-cookie";

const ApproveRecharge = () => {
  const accessToken = Cookies.get("accessToken");
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("accessToken"));
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          `${config.apiBaseUrl}/api/auth/test-token/${accessToken}`
        );
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error.response?.data || error);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    {
      user && user.role != "admin" && (window.location.href = "/login");
    }
    const handleRechargeBalance = async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("token", token);
      formData.append("transaction_type", "Balance Recharge");

      try {
        await axios.put(
          `${config.apiBaseUrl}/api/wallet/update_add`,
          formData,
          {
            params: { token: accessToken },
          }
        );

        await axios.post(
          `${config.apiBaseUrl}/api/transaction/create_recharge_transaction`,
          formData,
          {
            params: { token: accessToken },
          }
        );

        setMessage("Wallet recharged successfully.");
      } catch (error) {
        setMessage("Failed to recharge wallet.");
        console.error(error.response?.data || error);
      }
    };

    handleRechargeBalance();
  }, [user, email, token, accessToken]);

  return (
    <div className="approveRecharge">
      <h2>Approve Wallet Recharge</h2>
      {message && <p>{message}</p>}
      {!message && <p>Please wait a moment.</p>}
    </div>
  );
};

export default ApproveRecharge;
