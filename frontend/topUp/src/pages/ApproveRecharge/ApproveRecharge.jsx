import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import config from "../../config";
import "./ApproveRecharge.scss";
import Cookies from "js-cookie";

const ApproveRecharge = () => {
  const accessToken = Cookies.get("accessToken");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false); // State to track if processing

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          `${config.apiBaseUrl}/api/auth/test-token/${accessToken}`
        );
        setUser(response.data);
      } catch (error) {
        console.error(error.response?.data || error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [accessToken, navigate]);

  useEffect(() => {
    const handleRechargeBalance = async () => {
      if (isProcessing) return; // Prevent duplicate processing
      setIsProcessing(true); // Set processing state to true

      // Check if token exists in the database
      const tokenData = await axios.get(
        `${config.apiBaseUrl}/api/token/read/${token}`,
        { params: { token: accessToken } }
      );

      if (tokenData.data < 1) {
        setMessage("Invalid token.");
        setIsProcessing(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("token", token);
        formData.append("transaction_type", "Balance Recharge");

        await axios.delete(`${config.apiBaseUrl}/api/token/delete/${token}`, {
          params: { token: accessToken },
        });

        await axios.put(
          `${config.apiBaseUrl}/api/wallet/update_add`,
          formData,
          { params: { token: accessToken } }
        );

        await axios.post(
          `${config.apiBaseUrl}/api/transaction/create_recharge_transaction`,
          formData,
          { params: { token: accessToken } }
        );

        alert("Recharge Successful.");
        navigate("/");
      } catch (error) {
        setMessage("Failed to recharge wallet.");
      } finally {
        setIsProcessing(false); // Reset processing state
      }
    };

    if (user && user.role === "admin" && !isProcessing) {
      handleRechargeBalance();
    }
  }, [user, email, token, accessToken, navigate, isProcessing]);

  return (
    <div className="approveRecharge">
      <h2>Approve Wallet Recharge</h2>
      {message ? <p>{message}</p> : <p>Please wait a moment.</p>}
    </div>
  );
};

export default ApproveRecharge;
