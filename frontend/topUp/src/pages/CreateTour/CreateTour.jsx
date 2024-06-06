import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./CreateTour.scss";
import config from "../../config";
const CreateTour = () => {
  const accessToken = Cookies.get("accessToken");
  const [user, setUser] = useState([]);
  useEffect(() => {
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
  }, []);

  const schema = yup.object().shape({
    name: yup.string().required("Name required"),
    price: yup.string().required("Price required"),
    description: yup.string().required("Description is required"),
    image_url: yup.mixed().required("Profile image is required"),
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
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("image_url", data.image_url[0]);
    try {
      await axios.post(`${config.apiBaseUrl}/api/tournament/create`, formData, {
        params: {
          token: accessToken,
        },
      });
      window.location.href = `/tournament`;
      // Handle the response as needed
    } catch (error) {
      console.error(error.response?.data || error);
      // Handle the error
    }
  };
  return (
    <div className="createTour">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Create New Tournament</h2>
          <div className="credentials">
            <span>
              <input
                {...register("name")}
                type="text"
                placeholder="Enter tournament name "
              />
            </span>
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
            <span>
              <input
                {...register("price")}
                type="text"
                placeholder="Enter tournament price "
              />
            </span>
            {errors.price && (
              <span className="error-message">{errors.price.message}</span>
            )}
            <span>
              <input
                {...register("description")}
                type="text"
                placeholder="Enter about this tournament"
              />
            </span>
            {errors.description && (
              <span className="error-message">
                {errors.description.message}
              </span>
            )}
            <h4>Upload Profile:</h4>
            <input {...register("image_url")} type="file" />
            {errors.image_url && (
              <span className="error-message">{errors.image_url.message}</span>
            )}
          </div>
          <button className="btn-nav" type="submit">
            Add Tournament
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTour;
