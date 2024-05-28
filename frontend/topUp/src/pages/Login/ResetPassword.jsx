import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import "./ResetPassword.scss";
import { Link } from "react-router-dom";
import config from "../../config";
import axios from "axios";

const ResetPassword = () => {
  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("email", data.email);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/user/resetpassword`,
        formData
      );
      console.log("Password reset request sent");
    } catch (error) {
      console.error(error.response?.data || error);
      setError("Invalid Username");
    }
  };
  return (
    <div className="resetpassword">
      <div className="container">
        <div className="right">
          <Link className="link" to="/">
            <div className="logo">
              <img src="Subject.png" />
              <p>EsportsCardNepal</p>
            </div>
          </Link>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Reset Password</h1>
            <div className="credentials">
              <span>
                <input
                  {...register("email")}
                  type="text"
                  placeholder="Enter your Email"
                />
                <FontAwesomeIcon icon={faUser} />
              </span>
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>
            <button type="submit">Reset</button>
            {error && <div className="reset-error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
