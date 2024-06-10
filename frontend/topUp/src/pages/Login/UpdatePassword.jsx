import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import config from "../../config";
import "./UpdatePassword.scss";

const UpdatePassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handlePasswordUpdate = async (data) => {
    try {
      const formData = new FormData();
      formData.append("new_password", data.newPassword);

      const response = await axios.post(
        `${config.apiBaseUrl}/api/user/resetpassword/${token}`,
        formData
      );
      setMessage("Password reset successful");
      setError("");
    } catch (error) {
      setError("Failed to reset password");
      setMessage("");
      console.error(error.response?.data || error);
    }
  };

  return (
    <div className="updatePassword">
      <div className="container">
        <h1>Update Password</h1>
        <form onSubmit={handleSubmit(handlePasswordUpdate)}>
          <input
            type="password"
            placeholder="New Password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <span className="error-message">{errors.newPassword.message}</span>
          )}
          <input
            type="password"
            placeholder="Confirm New Password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="error-message">
              {errors.confirmPassword.message}
            </span>
          )}
          <button type="submit">Update Password</button>
        </form>
        {message && (
          <>
            <p>{message}</p>
            <Link className="link btn" to="/login">
              Login
            </Link>
          </>
        )}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default UpdatePassword;
