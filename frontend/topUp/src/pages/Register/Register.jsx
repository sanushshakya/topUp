import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./Register.scss";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faKey,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import config from "../../config";

const Register = () => {
  const [success, setSuccess] = useState(false);
  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/user/create`,
        formData
      );
      setSuccess(true);
      window.location.href = `/login`;
      // Handle the response as needed
    } catch (error) {
      console.error(error.response?.data || error);
      // Handle the error
    }
  };
  return (
    <div className="register">
      <div className="container">
        <div className="mobile-left">
          <img src="Subject.png" />
          <Link to="/" className="link links">
            <span>eSportsCardNepal</span>
          </Link>
        </div>
        <div className="left">
          <Link to="/" className="link links">
            <span>eSportsCardNepal</span>
          </Link>
          <h1>NAMASTE</h1>
          <img src="Subject.png" />
          <h3>
            Buy Exciting
            <br />
            Token and Gifts.
          </h3>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Register Your Account.</h1>
            <div className="credentials">
              <span>
                <input
                  {...register("username")}
                  type="text"
                  placeholder="Enter your username"
                />
                <FontAwesomeIcon icon={faUser} />
              </span>
              {errors.username && (
                <span className="error-message">{errors.username.message}</span>
              )}
              <span>
                <input
                  {...register("email")}
                  type="text"
                  placeholder="Enter your email"
                />
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
              <span>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Enter your Password"
                />
                <FontAwesomeIcon icon={faKey} />
              </span>
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
              <span>
                <input
                  {...register("phone")}
                  type="text"
                  placeholder="Enter your Number"
                />
                <FontAwesomeIcon icon={faPhone} />
              </span>
              {errors.phone && (
                <span className="error-message">{errors.phone.message}</span>
              )}
            </div>
            <button type="submit" className="btn-nav">
              Register
            </button>
            {success && (
              <div className="success-message">
                <p>Your account has been created successfully.</p>
                <br />
                <Link to="/login" className="login">
                  LogIn
                </Link>
              </div>
            )}
            {!success && (
              <h3>
                Already have an account?
                <Link to="/login" className="login">
                  LogIn
                </Link>
              </h3>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
