import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import "./UpdatePassword.scss";

const UpdatePassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("new_password", newPassword);

      const response = await axios.post(
        `${config.apiBaseUrl}/api/user/resetpassword/${token}`,
        formData
      );
      setMessage("Password reset successful");
    } catch (error) {
      setMessage("Failed to reset password");
      console.error(error.response?.data || error);
    }
  };

  return (
    <div className="updatePassword">
      <div className="container">
        <h1>Update Password</h1>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handlePasswordUpdate}>Update Password</button>
        {message && <p>{message}</p>}
        <Link className="link btn" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
};

export default UpdatePassword;
