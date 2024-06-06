import React, { useEffect, useState } from "react";
import "./Home.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

import Banner from "../../components/Banner/Banner";
import CatCard from "../../components/CatCard/CatCard";
import ProductCard from "../../components/ProductCard/ProductCard";
import config from "../../config";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const accessToken = Cookies.get("accessToken");
  const [banners, setBanner] = useState([]);
  const [cats, setCat] = useState([]);
  const [products, setProduct] = useState([]);
  const [user, setUser] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };
  const cardSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBan = await axios.get(`${config.apiBaseUrl}/api/banner/read`);
        setBanner(resBan.data);
        const resCat = await axios.get(
          `${config.apiBaseUrl}/api/category/read`
        );
        setCat(resCat.data);
        const resProduct = await axios.get(
          `${config.apiBaseUrl}/api/product/read`
        );
        setProduct(resProduct.data);
        if (accessToken) {
          const response = await axios.post(
            `${config.apiBaseUrl}/api/auth/test-token/${accessToken}`
          );
          setUser(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home">
      <div className="container">
        <div className="banner">
          <Slider {...settings} className="hide-arrows">
            {banners.map((ban, index) => (
              <Banner item={ban} key={index} />
            ))}
          </Slider>
        </div>
        <div className="cmpTitle cat">
          <h1>Categories</h1>
          {user.role === "admin" && (
            <Link to="/createcat" className="link">
              <button className="btn-page">Create New Category</button>
            </Link>
          )}
        </div>
        <div className="slide">
          <Slider {...cardSettings}>
            {cats.map((cat) => (
              <CatCard key={cat._id} item={cat} />
            ))}
          </Slider>
        </div>
        <div className="cmpTitle">
          <h1>Products</h1>
        </div>
        <div className="slide">
          <Slider {...cardSettings}>
            {products.map((pro) => (
              <ProductCard key={pro._id} item={pro} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Home;
