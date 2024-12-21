import React, { useEffect, useState } from 'react';
import './home.css'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaCalendarAlt, FaShoppingBag, FaGift, FaSyncAlt ,FaArrowLeft, FaArrowRight  } from "react-icons/fa";
import { PayPalButtons } from "@paypal/react-paypal-js";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true); 
  const [cart, setCart] = useState([]); 
  const [selectedProduct, setSelectedProduct] = useState(null); 

  const categories = ['All', "men's clothing", "women's clothing", 'jewelery', 'electronics'];
  const [isPaying, setIsPaying] = useState(false);
  const totalAmount = cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1); 
    setCart(updatedCart); 
  };
  useEffect(() => {
      const fetchProducts = async () => {
          setIsLoading(true);
          try {
              const url = selectedCategory === 'All'
                  ? 'https://fakestoreapi.com/products'
                  : `https://fakestoreapi.com/products/category/${encodeURIComponent(selectedCategory)}`;
              const response = await fetch(url);
              const data = await response.json();
              setProducts(data);
          } catch (error) {
              console.error('Error fetching products:', error);
          } finally {
              setIsLoading(false);
          }
      };

      fetchProducts();
  }, [selectedCategory]);

  const addToCart = (product) => {
      setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (index) => {
      setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };
  const handlePaymentSuccess = (paymentDetails) => {
    // Handle successful payment
    console.log('Payment Successful:', paymentDetails);
    // Clear cart, show success message, etc.
    setCart([]);
  };

  const handlePaymentError = (error) => {
    // Handle payment error
    console.error('Payment Error:', error);
    // Show error message to user
  };
    return (
        <>
<body className="homepage" >
  

  <div className="preloader text-white fs-6 text-uppercase overflow-hidden"></div>

  <div className="search-popup">
    <div className="search-popup-container">

      <form role="search" method="get" className="form-group" action="">
        <input type="search" id="search-form" className="form-control border-0 border-bottom"
          placeholder="Type and press enter" value="" name="s" />
        <button type="submit" className="search-submit border-0 position-absolute bg-white"
          ><svg className="search" width="24" height="24">
            <use href="#search"></use>
          </svg></button>
      </form>

      <h5 className="cat-list-title">Browse Categories</h5>

      <ul className="cat-list">
        <li className="cat-list-item">
          <a href="#" title="Jackets">Jackets</a>
        </li>
        <li className="cat-list-item">
          <a href="#" title="T-shirts">T-shirts</a>
        </li>
        <li className="cat-list-item">
          <a href="#" title="Handbags">Handbags</a>
        </li>
        <li className="cat-list-item">
          <a href="#" title="Accessories">Accessories</a>
        </li>
        <li className="cat-list-item">
          <a href="#" title="Cosmetics">Cosmetics</a>
        </li>
        <li className="cat-list-item">
          <a href="#" title="Dresses">Dresses</a>
        </li>
        <li className="cat-list-item">
          <a href="#" title="Jumpsuits">Jumpsuits</a>
        </li>
      </ul>

    </div>
  </div>

  <div
  className="offcanvas offcanvas-end"
  data-bs-scroll="true"
  tabIndex="-1"
  id="offcanvasCart"
  aria-labelledby="My Cart"
>
  <div className="offcanvas-header justify-content-center">
    <button
      type="button"
      className="btn-close"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    ></button>
  </div>
  <div className="offcanvas-body">
    <div className="order-md-last">
      <h4 className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-primary">Your cart</span>
        <span className="badge bg-primary rounded-pill">{cart.length}</span>
      </h4>
      <ul className="list-group mb-3">
        {cart.map((item, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center">
              <img
                src={item.image}
                alt={item.title}
                className="img-thumbnail me-3"
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                }}
              />
              <div>
                <h6 className="my-0">{item.title}</h6>
               
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="text-body-secondary me-3">
                ${item.price.toFixed(2)}
              </span>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleRemoveFromCart(index)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
        {cart.length > 0 && (
          <li className="list-group-item d-flex justify-content-between">
            <span>Total (USD)</span>
            <strong>
              ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
            </strong>
          </li>
        )}
      </ul>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : isPaying ? (
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalAmount,
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              alert(`Transaction completed by ${details.payer.name.given_name}`);
              setIsPaying(false);
            });
          }}
          onCancel={() => {
            alert("Payment cancelled");
            setIsPaying(false);
          }}
          onError={(err) => {
            console.error("Error in payment:", err);
            setIsPaying(false);
          }}
        />
      ) : (
        <button
          className="w-100 btn btn-primary btn-lg"
          type="button"
          onClick={() => setIsPaying(true)}
        >
          Continue to Checkout
        </button>
      )}
    </div>
  </div>
</div>

  <nav className="navbar navbar-expand-lg bg-light text-uppercase fs-6 p-3 border-bottom align-items-center">
    <div className="container-fluid">
      <div className="row justify-content-between align-items-center w-100">

        <div className="col-auto">
          <a className="navbar-brand text-white" href="index.html">
            <svg width="112" height="45" viewBox="0 0 112 45" xmlns="http://www.w3.org/2000/svg" fill="#111">
              <path
                d="M2.51367 34.9297C2.58398 34.6836 2.64844 34.3789 2.70703 34.0156C2.77734 33.6523 2.83594 33.2012 2.88281 32.6621C2.92969 32.123 2.96484 31.4844 2.98828 30.7461C3.01172 29.9961 3.02344 29.123 3.02344 28.127V16.6836C3.02344 15.6875 3.01172 14.8203 2.98828 14.082C2.96484 13.332 2.92969 12.6875 2.88281 12.1484C2.83594 11.5977 2.77734 11.1406 2.70703 10.7773C2.64844 10.4141 2.58398 10.1094 2.51367 9.86328V9.79297H6.73242V9.86328C6.66211 10.1094 6.5918 10.4141 6.52148 10.7773C6.46289 11.1406 6.41016 11.5977 6.36328 12.1484C6.32812 12.6875 6.29297 13.332 6.25781 14.082C6.23438 14.8203 6.22266 15.6875 6.22266 16.6836V20.6035L16.4883 12.2188C17.6367 11.2813 18.2109 10.4727 18.2109 9.79297H23.1504V9.86328C22.459 10.0273 21.7559 10.3437 21.041 10.8125C20.3379 11.2695 19.5879 11.832 18.791 12.5L9.7207 20.0938L20.6367 32.082C21.0938 32.5508 21.4805 32.9434 21.7969 33.2598C22.125 33.5645 22.4121 33.8223 22.6582 34.0332C22.9043 34.2324 23.127 34.4023 23.3262 34.543C23.5371 34.6719 23.7539 34.8008 23.9766 34.9297V35H18.8262C18.7793 34.8945 18.6973 34.7598 18.5801 34.5957C18.4746 34.4316 18.3457 34.2617 18.1934 34.0859C18.0527 33.9102 17.8945 33.7285 17.7188 33.541C17.5547 33.3535 17.3965 33.1777 17.2441 33.0137L6.22266 20.9199V28.127C6.22266 29.123 6.23438 29.9961 6.25781 30.7461C6.29297 31.4844 6.32812 32.123 6.36328 32.6621C6.41016 33.2012 6.46289 33.6523 6.52148 34.0156C6.5918 34.3789 6.66211 34.6836 6.73242 34.9297V35H2.51367V34.9297ZM45.3846 35V34.9297C45.408 34.8711 45.4256 34.7832 45.4373 34.666C45.4491 34.5488 45.4549 34.4434 45.4549 34.3496C45.4549 33.9863 45.4022 33.5879 45.2967 33.1543C45.203 32.709 45.0155 32.1582 44.7342 31.502L42.6073 26.7207C41.951 26.6973 41.078 26.6855 39.9881 26.6855C38.8983 26.6855 37.7205 26.6855 36.4549 26.6855C35.5291 26.6855 34.6327 26.6855 33.7655 26.6855C32.91 26.6855 32.1366 26.6973 31.4452 26.7207L29.4237 31.3613C29.2479 31.7949 29.0604 32.2695 28.8612 32.7852C28.662 33.3008 28.5623 33.8223 28.5623 34.3496C28.5623 34.502 28.5741 34.6309 28.5975 34.7363C28.6209 34.8301 28.6444 34.8945 28.6678 34.9297V35H25.0819V34.9297C25.2928 34.707 25.5565 34.3145 25.8729 33.752C26.1893 33.1777 26.535 32.4629 26.91 31.6074L36.9823 9.26562H38.3885L47.9334 30.7461C48.1561 31.25 48.3846 31.7422 48.619 32.2227C48.8651 32.6914 49.0936 33.1133 49.3045 33.4883C49.5155 33.8633 49.703 34.1797 49.867 34.4375C50.0311 34.6953 50.1424 34.8594 50.201 34.9297V35H45.3846ZM33.994 25.1738C34.6737 25.1738 35.3709 25.1738 36.0858 25.1738C36.8006 25.1621 37.4979 25.1562 38.1776 25.1562C38.869 25.1445 39.5311 25.1387 40.1639 25.1387C40.7967 25.127 41.3709 25.1152 41.8866 25.1035L36.9471 13.9414L32.0955 25.1738H33.994ZM54.6989 34.9297C54.7692 34.6836 54.8337 34.3789 54.8923 34.0156C54.9509 33.6523 55.0036 33.2012 55.0505 32.6621C55.0973 32.123 55.1325 31.4844 55.1559 30.7461C55.1794 29.9961 55.1911 29.123 55.1911 28.127V16.6836C55.1911 15.6875 55.1794 14.8203 55.1559 14.082C55.1325 13.332 55.0973 12.6875 55.0505 12.1484C55.0036 11.5977 54.9509 11.1406 54.8923 10.7773C54.8337 10.4141 54.7692 10.1094 54.6989 9.86328V9.79297H58.9001V9.86328C58.8298 10.1094 58.7595 10.4141 58.6891 10.7773C58.6305 11.1406 58.5778 11.5977 58.5309 12.1484C58.4958 12.6875 58.4606 13.332 58.4255 14.082C58.402 14.8203 58.3903 15.6875 58.3903 16.6836V28.127C58.3903 29.123 58.402 29.9961 58.4255 30.7461C58.4606 31.4844 58.4958 32.123 58.5309 32.6621C58.5778 33.2012 58.6305 33.6523 58.6891 34.0156C58.7595 34.3789 58.8298 34.6836 58.9001 34.9297V35H54.6989V34.9297ZM69.9722 28.127C69.9722 29.123 69.9839 29.9961 70.0073 30.7461C70.0425 31.4844 70.0777 32.123 70.1128 32.6621C70.1597 33.2012 70.2124 33.6523 70.271 34.0156C70.3413 34.3789 70.4116 34.6836 70.482 34.9297V35H66.2632V34.9297C66.3335 34.6836 66.398 34.3789 66.4566 34.0156C66.5269 33.6523 66.5796 33.2012 66.6148 32.6621C66.6616 32.123 66.6968 31.4844 66.7202 30.7461C66.7554 30.0078 66.773 29.1348 66.773 28.127V16.6836C66.773 15.6875 66.7554 14.8203 66.7202 14.082C66.6968 13.332 66.6616 12.6875 66.6148 12.1484C66.5796 11.6094 66.5269 11.1582 66.4566 10.7949C66.398 10.4199 66.3335 10.1094 66.2632 9.86328V9.79297L67.0015 9.86328C67.2241 9.88672 67.4702 9.9043 67.7398 9.91602C68.021 9.91602 68.3081 9.91602 68.6011 9.91602C69.0581 9.91602 69.6734 9.86328 70.4468 9.75781C71.232 9.64062 72.228 9.58203 73.4351 9.58203C74.5601 9.58203 75.5972 9.73438 76.5464 10.0391C77.5073 10.3437 78.3394 10.7891 79.0425 11.375C79.7456 11.9609 80.2905 12.6816 80.6773 13.5371C81.0757 14.3809 81.2749 15.3418 81.2749 16.4199C81.2749 17.2637 81.1636 18.0488 80.9409 18.7754C80.73 19.4902 80.4253 20.1406 80.0269 20.7266C79.6402 21.3125 79.1714 21.834 78.6206 22.291C78.0698 22.7363 77.4546 23.1113 76.7749 23.416L82.9448 32.082C83.2495 32.5156 83.5308 32.8906 83.7886 33.207C84.0581 33.5234 84.3101 33.7988 84.5445 34.0332C84.7905 34.2559 85.0249 34.4434 85.2476 34.5957C85.4702 34.7363 85.6987 34.8477 85.9331 34.9297V35H80.853C80.8179 34.7773 80.7007 34.4844 80.5015 34.1211C80.314 33.7461 80.0913 33.377 79.8335 33.0137L73.6109 24.2422C73.3413 24.2656 73.0718 24.2891 72.8023 24.3125C72.5327 24.3242 72.2573 24.3301 71.9761 24.3301C71.648 24.3301 71.314 24.3184 70.9741 24.2949C70.646 24.2715 70.312 24.2305 69.9722 24.1719V28.127ZM69.9722 22.8008C70.2886 22.8711 70.6109 22.9238 70.939 22.959C71.2671 22.9824 71.5835 22.9941 71.8882 22.9941C72.7671 22.9941 73.5698 22.8652 74.2964 22.6074C75.023 22.3379 75.6382 21.9336 76.1421 21.3945C76.6577 20.8555 77.0562 20.1875 77.3374 19.3906C77.6187 18.582 77.7593 17.6387 77.7593 16.5605C77.7593 15.6816 77.6597 14.8848 77.4605 14.1699C77.2612 13.4551 76.9624 12.8516 76.564 12.3594C76.1773 11.8555 75.6851 11.4687 75.0874 11.1992C74.4898 10.918 73.7925 10.7773 72.9956 10.7773C72.187 10.7773 71.5425 10.8184 71.062 10.9004C70.5816 10.9824 70.2183 11.0703 69.9722 11.1641V22.8008ZM107.13 35V34.9297C107.154 34.8711 107.171 34.7832 107.183 34.666C107.195 34.5488 107.201 34.4434 107.201 34.3496C107.201 33.9863 107.148 33.5879 107.042 33.1543C106.949 32.709 106.761 32.1582 106.48 31.502L104.353 26.7207C103.697 26.6973 102.824 26.6855 101.734 26.6855C100.644 26.6855 99.4662 26.6855 98.2005 26.6855C97.2748 26.6855 96.3783 26.6855 95.5111 26.6855C94.6556 26.6855 93.8822 26.6973 93.1908 26.7207L91.1693 31.3613C90.9935 31.7949 90.806 32.2695 90.6068 32.7852C90.4076 33.3008 90.308 33.8223 90.308 34.3496C90.308 34.502 90.3197 34.6309 90.3431 34.7363C90.3666 34.8301 90.39 34.8945 90.4134 34.9297V35H86.8275V34.9297C87.0384 34.707 87.3021 34.3145 87.6185 33.752C87.9349 33.1777 88.2806 32.4629 88.6556 31.6074L98.7279 9.26562H100.134L109.679 30.7461C109.902 31.25 110.13 31.7422 110.365 32.2227C110.611 32.6914 110.839 33.1133 111.05 33.4883C111.261 33.8633 111.449 34.1797 111.613 34.4375C111.777 34.6953 111.888 34.8594 111.947 34.9297V35H107.13ZM95.7396 25.1738C96.4193 25.1738 97.1166 25.1738 97.8314 25.1738C98.5462 25.1621 99.2435 25.1562 99.9232 25.1562C100.615 25.1445 101.277 25.1387 101.91 25.1387C102.542 25.127 103.117 25.1152 103.632 25.1035L98.6927 13.9414L93.8412 25.1738H95.7396Z" />
            </svg>
          </a>
        </div>

        <div className="col-auto">
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"
                aria-label="Close"></button>
            </div>

            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 gap-1 gap-md-5 pe-3">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle active" href="#" id="dropdownHome" data-bs-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">Home</a>
                  <ul className="dropdown-menu list-unstyled" aria-labelledby="dropdownHome">
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Home Layout 1</a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Home Layout 2 </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Home Layout 3 </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Home Layout 4 </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="dropdownShop" data-bs-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">Shop</a>
                  <ul className="dropdown-menu list-unstyled" aria-labelledby="dropdownShop">
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Shop Sidebar </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Shop Three Column </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Shop Three Column Wide </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Shop Four Column </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Shop Four Column Wide </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Shop Six Column </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Shop Six Column Wide </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Single Product </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Single Product V2 </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="dropdownBlog" data-bs-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">Blog</a>
                  <ul className="dropdown-menu list-unstyled" aria-labelledby="dropdownBlog">
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Blog ClassNameic </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Blog Grid with Sidebar </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Blog Grid Four Column </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Blog No Sidebar </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Blog Right Sidebar </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Single Post </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Single Post No Sidebar </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="dropdownPages" data-bs-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">Pages</a>
                  <ul className="dropdown-menu list-unstyled" aria-labelledby="dropdownPages">
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">About </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Cart </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Checkout </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Coming Soon </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Contact </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Error Page </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">FAQs </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">My Account </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Order Tracking </a>
                    </li>
                    <li>
                      <a href="index.html" className="dropdown-item item-anchor">Wishlist </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Blog</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-3 col-lg-auto">
          <ul className="list-unstyled d-flex m-0">
   
            <li className="d-lg-block ">
                <a
                    href="#"
                    className="text-uppercase mx-3 d-flex"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCart"
                    aria-controls="offcanvasCart"
                >
                    Cart <span className="cart-count">({cart.length})</span>
                </a>
            </li>
            
        
            <li className="d-lg-none">
              <a href="#" className="mx-2">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <use href="#heart"></use>
                </svg>
              </a>
            </li>
            <li className="d-lg-none">
              <a href="#" className="mx-2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart"
                aria-controls="offcanvasCart">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <use href="#cart"></use>
                </svg>
              </a>
            </li>
            <li className="search-box mx-2" >
              <a href="#search" className="search-button">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <use href="#search"></use>
                </svg>
              </a>
            </li>
          </ul>
        </div>

      </div>

    </div>
  </nav>

  <section className="bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <h1 className="section-title text-center mt-4" data-aos="fade-up">
            New Collections
          </h1>
          <div
            className="col-md-6 text-center"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
              voluptas ut dolorum consequuntur, adipisci repellat! Eveniet
              commodi voluptatem voluptate, eum minima, in suscipit explicabo
              voluptatibus harum, quibusdam ex repellat eaque!
            </p>
          </div>
        </div>
        
      <div className="row">
        <Swiper
          className="swiper main-swiper py-4"
          data-aos="fade-up"
          data-aos-delay="600"
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={20} // Adjust spacing between slides
          loop={true}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 }, // Mobile
            576: { slidesPerView: 2, spaceBetween: 15 }, // Tablets
            768: { slidesPerView: 3, spaceBetween: 20 }, // Small Desktops
            1200: { slidesPerView: 4, spaceBetween: 30 }, // Large Desktops
          }}
        >
          {[
            "/assets/images/banner-image-6.jpg",
            "/assets/images/banner-image-1.jpg",
            "/assets/images/banner-image-2.jpg",
            "/assets/images/banner-image-3.jpg",
            "/assets/images/banner-image-4.jpg",
            "/assets/images/banner-image-5.jpg",
          ].map((imageSrc, index) => (
            <SwiperSlide key={index} className="swiper-slide">
              <div className="banner-item image-zoom-effect">
                {/* Image Holder */}
                <div className="image-holder">
                  <a href="#">
                    <img src={imageSrc} alt="product" className="img-fluid" />
                  </a>
                </div>
                {/* Banner Content */}
                <div className="banner-content py-3">
                  <h5 className="element-title text-uppercase">
                    <a href="index.html" className="item-anchor">
                      Soft leather jackets
                    </a>
                  </h5>
                  <p className="d-none d-md-block">
                    Scelerisque duis aliquam qui lorem ipsum dolor amet,
                    consectetur adipiscing elit.
                  </p>
                  <div className="btn-left">
                    <a
                      href="#"
                      className="btn-link fs-6 text-uppercase item-anchor text-decoration-none"
                    >
                      Discover Now
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      </div>
    </section>

    <section className="features py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-3 text-center" data-aos="fade-in" data-aos-delay="0">
            <div className="py-5">
              <FaCalendarAlt size={38} />
              <h4 className="element-title text-capitalize my-3">Book An Appointment</h4>
              <p>At imperdiet dui accumsan sit amet nulla risus est ultricies quis.</p>
            </div>
          </div>
          <div className="col-md-3 text-center" data-aos="fade-in" data-aos-delay="300">
            <div className="py-5">
              <FaShoppingBag size={38} />
              <h4 className="element-title text-capitalize my-3">Pick up in store</h4>
              <p>At imperdiet dui accumsan sit amet nulla risus est ultricies quis.</p>
            </div>
          </div>
          <div className="col-md-3 text-center" data-aos="fade-in" data-aos-delay="600">
            <div className="py-5">
              <FaGift size={38} />
              <h4 className="element-title text-capitalize my-3">Special packaging</h4>
              <p>At imperdiet dui accumsan sit amet nulla risus est ultricies quis.</p>
            </div>
          </div>
          <div className="col-md-3 text-center" data-aos="fade-in" data-aos-delay="900">
            <div className="py-5">
              <FaSyncAlt size={38} />
              <h4 className="element-title text-capitalize my-3">free global returns</h4>
              <p>At imperdiet dui accumsan sit amet nulla risus est ultricies quis.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  <section className="categories overflow-hidden">
    <div className="container">
      <div className="open-up" data-aos="zoom-out">
        <div className="row">
          <div className="col-md-4">
            <div className="cat-item image-zoom-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/cat-item1.jpg" alt="categories" className="product-image img-fluid"/>
                </a>
              </div>
              <div className="category-content">
                <div className="product-button">
                  <a href="index.html" className="btn btn-common text-uppercase">Shop for men</a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="cat-item image-zoom-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/cat-item2.jpg" alt="categories" className="product-image img-fluid"/>
                </a>
              </div>
              <div className="category-content">
                <div className="product-button">
                  <a href="index.html" className="btn btn-common text-uppercase">Shop for women</a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="cat-item image-zoom-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/cat-item3.jpg" alt="categories" className="product-image img-fluid"/>
                </a>
              </div>
              <div className="category-content">
                <div className="product-button">
                  <a href="index.html" className="btn btn-common text-uppercase">Shop accessories</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  (
    <section
      id="new-arrival"
      className="new-arrival product-carousel py-5 position-relative overflow-hidden"
    >
      <div className="container">
        {/* Section Header */}
        <div className="row align-items-center mb-4">
          <div className="col-8 col-md-6">
            <h4 className="text-uppercase mb-0">Our New Arrivals</h4>
          </div>
          <div className="col-4 col-md-6 text-end">
            <a href="index.html" className="btn btn-link text-uppercase">
              View All Products
            </a>
          </div>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          navigation={{
            nextEl: ".icon-arrow-right",
            prevEl: ".icon-arrow-left",
          }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          loop={true}
          className="product-swiper"
          breakpoints={{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
          }}
        >
          {/* Swiper Slides */}
          {[...Array(5)].map((_, index) => (
            <SwiperSlide key={index} className="d-flex justify-content-center">
              <div className="card product-item shadow-sm border-0">
                <div className="image-holder position-relative">
                  <a href="index.html" className="d-block">
                    <img
                      src={`/assets/images/product-item-${index + 1}.jpg`}
                      alt="categories"
                      className="card-img-top img-fluid"
                    />
                  </a>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title text-uppercase fs-6 mb-2">
                    <a
                      href="index.html"
                      className="text-decoration-none text-dark"
                    >
                      Product Title {index + 1}
                    </a>
                  </h5>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Swiper Navigation */}
        <div className="icon-arrow icon-arrow-left position-absolute start-0 top-50 translate-middle-y">
          <FaArrowLeft size={30} />
        </div>
        <div className="icon-arrow icon-arrow-right position-absolute end-0 top-50 translate-middle-y">
          <FaArrowRight size={30} />
        </div>
      </div>
    </section>

  <section className="collection bg-light position-relative py-5">
    <div className="container">
      <div className="row">
        <div className="title-xlarge text-uppercase txt-fx domino">Collection</div>
        <div className="collection-item d-flex flex-wrap my-5">
          <div className="col-md-6 column-container">
            <div className="image-holder">
              <img src="/assets/images/single-image-2.jpg" alt="collection" className="product-image img-fluid"/>
            </div>
          </div>
          <div className="col-md-6 column-container bg-white">
            <div className="collection-content p-5 m-0 m-md-5">
              <h3 className="element-title text-uppercase">ClassNameic winter collection</h3>
              <p>Dignissim lacus, turpis ut suspendisse vel tellus. Turpis purus, gravida orci, fringilla a. Ac sed eu
                fringilla odio mi. Consequat pharetra at magna imperdiet cursus ac faucibus sit libero. Ultricies quam
                nunc, lorem sit lorem urna, pretium aliquam ut. In vel, quis donec dolor id in. Pulvinar commodo mollis
                diam sed facilisis at cursus imperdiet cursus ac faucibus sit faucibus sit libero.</p>
              <a href="#" className="btn btn-dark text-uppercase mt-3">Shop Collection</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* <section id="best-sellers" className="best-sellers product-carousel py-5 position-relative overflow-hidden">
    <div className="container">
      <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3">
        <h4 className="text-uppercase">Best Selling Items</h4>
        <a href="index.html" className="btn-link">View All Products</a>
      </div>
      <div className="swiper product-swiper open-up" data-aos="zoom-out">
        <div className="swiper-wrapper d-flex">
          <div className="swiper-slide">
            <div className="product-item image-zoom-effect link-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/product-item-4.jpg" alt="categories" className="product-image img-fluid"/>
                </a>
                <a href="index.html" className="btn-icon btn-wishlist">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#heart"></use>
                  </svg>
                </a>
                <div className="product-content">
                  <h5 className="text-uppercase fs-5 mt-3">
                    <a href="index.html">Dark florish onepiece</a>
                  </h5>
                  <a href="index.html" className="text-decoration-none" data-after="Add to cart"><span>$95.00</span></a>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="product-item image-zoom-effect link-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/product-item-3.jpg" alt="product" className="product-image img-fluid"/>
                </a>
                <a href="index.html" className="btn-icon btn-wishlist">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#heart"></use>
                  </svg>
                </a>
                <div className="product-content">
                  <h5 className="text-uppercase fs-5 mt-3">
                    <a href="index.html">Baggy Shirt</a>
                  </h5>
                  <a href="index.html" className="text-decoration-none" data-after="Add to cart"><span>$55.00</span></a>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="product-item image-zoom-effect link-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/product-item-5.jpg" alt="categories" className="product-image img-fluid"/>
                </a>
                <a href="index.html" className="btn-icon btn-wishlist">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#heart"></use>
                  </svg>
                </a>
                <div className="product-content">
                  <h5 className="text-uppercase fs-5 mt-3">
                    <a href="index.html">Cotton off-white shirt</a>
                  </h5>
                  <a href="index.html" className="text-decoration-none" data-after="Add to cart"><span>$65.00</span></a>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="product-item image-zoom-effect link-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/product-item-6.jpg" alt="categories" className="product-image img-fluid"/>
                </a>
                <a href="index.html" className="btn-icon btn-wishlist">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#heart"></use>
                  </svg>
                </a>
                <div className="product-content">
                  <h5 className="text-uppercase fs-5 mt-3">
                    <a href="index.html">Handmade crop sweater</a>
                  </h5>
                  <a href="index.html" className="text-decoration-none" data-after="Add to cart"><span>$50.00</span></a>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="product-item image-zoom-effect link-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/product-item-9.jpg" alt="categories" className="product-image img-fluid"/>
                </a>
                <a href="index.html" className="btn-icon btn-wishlist">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#heart"></use>
                  </svg>
                </a>
                <div className="product-content">
                  <h5 className="text-uppercase fs-5 mt-3">
                    <a href="index.html">Dark florish onepiece</a>
                  </h5>
                  <a href="index.html" className="text-decoration-none" data-after="Add to cart"><span>$70.00</span></a>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="product-item image-zoom-effect link-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/product-item-10.jpg" alt="categories" className="product-image img-fluid"/>
                </a>
                <a href="index.html" className="btn-icon btn-wishlist">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#heart"></use>
                  </svg>
                </a>
                <div className="product-content">
                  <h5 className="text-uppercase fs-5 mt-3">
                    <a href="index.html">Cotton off-white shirt</a>
                  </h5>
                  <a href="index.html" className="text-decoration-none" data-after="Add to cart"><span>$70.00</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="swiper-pagination"></div>
      </div>
      <div className="icon-arrow icon-arrow-left"><svg width="50" height="50" viewBox="0 0 24 24">
          <use href="#arrow-left"></use>
        </svg></div>
      <div className="icon-arrow icon-arrow-right"><svg width="50" height="50" viewBox="0 0 24 24">
          <use href="#arrow-right"></use>
        </svg></div>
    </div>
  </section> */}

  {/* <section className="video py-5 overflow-hidden">
    <div className="container-fluid">
      <div className="row">
        <div className="video-content open-up" data-aos="zoom-out">
          <div className="video-bg">
            <img src="/assets/images/video-image.jpg" alt="video" className="video-image img-fluid"/>
          </div>
          <div className="video-player">
            <a className="youtube" href="https://www.youtube.com/embed/pjtsGzQjFM4">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <use href="#play"></use>
              </svg>
              <img src="/assets/images/text-pattern.png" alt="pattern" className="text-rotate"/>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section> */}

  <section className="testimonials py-5 bg-light">
    <div className="section-header text-center mt-5">
      <h3 className="section-title">WE LOVE GOOD COMPLIMENT</h3>
    </div>
    <div className="swiper testimonial-swiper overflow-hidden my-5">
      <div className="swiper-wrapper d-flex">
        <div className="swiper-slide">
          <div className="testimonial-item text-center">
            <blockquote>
              <p>“More than expected crazy soft, flexible and best fitted white simple denim shirt.”</p>
              <div className="review-title text-uppercase">casual way</div>
            </blockquote>
          </div>
        </div>
        <div className="swiper-slide">
          <div className="testimonial-item text-center">
            <blockquote>
              <p>“Best fitted white denim shirt more than expected crazy soft, flexible</p>
              <div className="review-title text-uppercase">uptop</div>
            </blockquote>
          </div>
        </div>
        <div className="swiper-slide">
          <div className="testimonial-item text-center">
            <blockquote>
              <p>“Best fitted white denim shirt more white denim than expected flexible crazy soft.”</p>
              <div className="review-title text-uppercase">Denim craze</div>
            </blockquote>
          </div>
        </div>
        <div className="swiper-slide">
          <div className="testimonial-item text-center">
            <blockquote>
              <p>“Best fitted white denim shirt more than expected crazy soft, flexible</p>
              <div className="review-title text-uppercase">uptop</div>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
    <div className="testimonial-swiper-pagination d-flex justify-content-center mb-5"></div>
  </section>
  <div className="container my-5">
            <h1 className="text-center mb-4">Product Store</h1>
            <div className="mb-3">
                <label htmlFor="category" className="form-label">
                    Choose a category:
                </label>
                <select
                    id="category"
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div className="col-md-4 col-lg-3" key={product.id}>
                                <div className="card h-100">
                                    <img
                                        src={product.image}
                                        className="card-img-top"
                                        alt={product.title}
                                        style={{ height: '200px', objectFit: 'contain' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title text-truncate">{product.title}</h5>
                                        <p className="card-text fw-bold">Price: ${product.price}</p>
                                        <button
                                          className="btn btn-primary btn-sm me-2"
                                          onClick={() => setSelectedProduct(product)}
                                          data-bs-toggle="modal"
                                          data-bs-target="#productDetailModal"
                                        >
                                          View Details
                                        </button>

                                        <a
                                            href="#"    
                                            className="btn btn-success btn-sm"
                                            onClick={() => addToCart(product)}
                                        >
                                            Add to Cart
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products available in this category.</p>
                    )}
                </div>
            )}

            <div
              className="modal fade"
              id="productDetailModal"
              tabIndex="-1"
              aria-labelledby="productDetailModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="productDetailModalLabel">
                      Product Details
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    {selectedProduct ? (
                      <div>
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.title}
                          className="img-fluid mb-3"
                        />
                        <h6>{selectedProduct.title}</h6>
                        <p>{selectedProduct.description}</p>
                        <p>
                          <strong>Price:</strong> ${selectedProduct.price.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p>No product selected.</p>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        addToCart(selectedProduct);
                        document.querySelector('[data-bs-dismiss="modal"]').click();
                    }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
          

  {/* <section id="related-products" className="related-products product-carousel py-5 position-relative overflow-hidden">
    <div className="container">
      <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3">
        <h4 className="text-uppercase">You May Also Like</h4>
        <a href="index.html" className="btn-link">View All Products</a>
      </div>
      <div className="swiper product-swiper open-up" data-aos="zoom-out">
        <div className="swiper-wrapper d-flex">
          <div className="swiper-slide">
            <div className="product-item image-zoom-effect link-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/product-item-5.jpg" alt="product" className="product-image img-fluid"/>
                </a>
                <a href="index.html" className="btn-icon btn-wishlist">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#heart"></use>
                  </svg>
                </a>
                <div className="product-content">
                  <h5 className="text-uppercase fs-5 mt-3">
                    <a href="index.html">Dark florish onepiece</a>
                  </h5>
                  <a href="index.html" className="text-decoration-none" data-after="Add to cart"><span>$95.00</span></a>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="product-item image-zoom-effect link-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/product-item-6.jpg" alt="product" className="product-image img-fluid"/>
                </a>
                <a href="index.html" className="btn-icon btn-wishlist">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#heart"></use>
                  </svg>
                </a>
                <div className="product-content">
                  <h5 className="text-uppercase fs-5 mt-3">
                    <a href="index.html">Baggy Shirt</a>
                  </h5>
                  <a href="index.html" className="text-decoration-none" data-after="Add to cart"><span>$55.00</span></a>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="product-item image-zoom-effect link-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/product-item-7.jpg" alt="product" className="product-image img-fluid"/>
                </a>
                <a href="index.html" className="btn-icon btn-wishlist">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#heart"></use>
                  </svg>
                </a>
                <div className="product-content">
                  <h5 className="text-uppercase fs-5 mt-3">
                    <a href="index.html">Cotton off-white shirt</a>
                  </h5>
                  <a href="index.html" className="text-decoration-none" data-after="Add to cart"><span>$65.00</span></a>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="product-item image-zoom-effect link-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/product-item-8.jpg" alt="product" className="product-image img-fluid"/>
                </a>
                <a href="index.html" className="btn-icon btn-wishlist">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#heart"></use>
                  </svg>
                </a>
                <div className="product-content">
                  <h5 className="text-uppercase fs-5 mt-3">
                    <a href="index.html">Handmade crop sweater</a>
                  </h5>
                  <a href="index.html" className="text-decoration-none" data-after="Add to cart"><span>$50.00</span></a>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="product-item image-zoom-effect link-effect">
              <div className="image-holder">
                <a href="index.html">
                  <img src="/assets/images/product-item-1.jpg" alt="product" className="product-image img-fluid"/>
                </a>
                <a href="index.html" className="btn-icon btn-wishlist">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <use href="#heart"></use>
                  </svg>
                </a>
                <div className="product-content">
                  <h5 className="text-uppercase fs-5 mt-3">
                    <a href="index.html">Handmade crop sweater</a>
                  </h5>
                  <a href="index.html" className="text-decoration-none" data-after="Add to cart"><span>$70.00</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="swiper-pagination"></div>
      </div>
      <div className="icon-arrow icon-arrow-left"><svg width="50" height="50" viewBox="0 0 24 24">
          <use href="#arrow-left"></use>
        </svg></div>
      <div className="icon-arrow icon-arrow-right"><svg width="50" height="50" viewBox="0 0 24 24">
          <use href="#arrow-right"></use>
        </svg></div>
    </div>
  </section> */}

  <section className="blog py-5">
    <div className="container">
      <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3">
        <h4 className="text-uppercase">Read Blog Posts</h4>
        <a href="index.html" className="btn-link">View All</a>
      </div>
      <div className="row">
        <div className="col-md-4">
          <article className="post-item">
            <div className="post-image">
              <a href="index.html">
                <img src="/assets/images/post-image1.jpg" alt="image" className="post-grid-image img-fluid"/>
              </a>
            </div>
            <div className="post-content d-flex flex-wrap gap-2 my-3">
              <div className="post-meta text-uppercase fs-6 text-secondary">
                <span className="post-category">Fashion /</span>
                <span className="meta-day"> jul 11, 2022</span>
              </div>
              <h5 className="post-title text-uppercase">
                <a href="index.html">How to look outstanding in pastel</a>
              </h5>
              <p>Dignissim lacus,turpis ut suspendisse vel tellus.Turpis purus,gravida orci,fringilla...</p>
            </div>
          </article>
        </div>
        <div className="col-md-4">
          <article className="post-item">
            <div className="post-image">
              <a href="index.html">
                <img src="/assets/images/post-image2.jpg" alt="image" className="post-grid-image img-fluid"/>
              </a>
            </div>
            <div className="post-content d-flex flex-wrap gap-2 my-3">
              <div className="post-meta text-uppercase fs-6 text-secondary">
                <span className="post-category">Fashion /</span>
                <span className="meta-day"> jul 11, 2022</span>
              </div>
              <h5 className="post-title text-uppercase">
                <a href="index.html">Top 10 fashion trend for summer</a>
              </h5>
              <p>Turpis purus, gravida orci, fringilla dignissim lacus, turpis ut suspendisse vel tellus...</p>
            </div>
          </article>
        </div>
        <div className="col-md-4">
          <article className="post-item">
            <div className="post-image">
              <a href="index.html">
                <img src="/assets/images/post-image3.jpg" alt="image" className="post-grid-image img-fluid"/>
              </a>
            </div>
            <div className="post-content d-flex flex-wrap gap-2 my-3">
              <div className="post-meta text-uppercase fs-6 text-secondary">
                <span className="post-category">Fashion /</span>
                <span className="meta-day"> jul 11, 2022</span>
              </div>
              <h5 className="post-title text-uppercase">
                <a href="index.html">Crazy fashion with unique moment</a>
              </h5>
              <p>Turpis purus, gravida orci, fringilla dignissim lacus, turpis ut suspendisse vel tellus...</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>

  <section className="logo-bar py-5 my-5">
    <div className="container">
      <div className="row">
        <div className="logo-content d-flex flex-wrap justify-content-between">
          <img src="/assets/images/logo1.png" alt="logo" className="logo-image img-fluid"/>
          <img src="/assets/images/logo2.png" alt="logo" className="logo-image img-fluid"/>
          <img src="/assets/images/logo3.png" alt="logo" className="logo-image img-fluid"/>
          <img src="/assets/images/logo4.png" alt="logo" className="logo-image img-fluid"/>
          <img src="/assets/images/logo5.png" alt="logo" className="logo-image img-fluid"/>
        </div>
      </div>
    </div>
  </section>

  <section className="newsletter bg-light" >
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 py-5 my-5">
          <div className="subscribe-header text-center pb-3">
            <h3 className="section-title text-uppercase">Sign Up for our newsletter</h3>
          </div>
          <form id="form" className="d-flex flex-wrap gap-2">
            <input type="text" name="email" placeholder="Your Email Addresss" className="form-control form-control-lg"/>
            <button className="btn btn-dark btn-lg text-uppercase w-100">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <section className="instagram position-relative">
    <div className="d-flex justify-content-center w-100 position-absolute bottom-0 z-1">
      <a href="https://www.instagram.com/templatesjungle/" className="btn btn-dark px-5">Follow us on Instagram</a>
    </div>
    <div className="row g-0">
      <div className="col-6 col-sm-4 col-md-2">
        <div className="insta-item">
          <a href="https://www.instagram.com/templatesjungle/" target="_blank">
            <img src="/assets/images/insta-item1.jpg" alt="instagram" className="insta-image img-fluid"/>
          </a>
        </div>
      </div>
      <div className="col-6 col-sm-4 col-md-2">
        <div className="insta-item">
          <a href="https://www.instagram.com/templatesjungle/" target="_blank">
            <img src="/assets/images/insta-item2.jpg" alt="instagram" className="insta-image img-fluid"/>
          </a>
        </div>
      </div>
      <div className="col-6 col-sm-4 col-md-2">
        <div className="insta-item">
          <a href="https://www.instagram.com/templatesjungle/" target="_blank">
            <img src="/assets/images/insta-item3.jpg" alt="instagram" className="insta-image img-fluid"/>
          </a>
        </div>
      </div>
      <div className="col-6 col-sm-4 col-md-2">
        <div className="insta-item">
          <a href="https://www.instagram.com/templatesjungle/" target="_blank">
            <img src="/assets/images/insta-item4.jpg" alt="instagram" className="insta-image img-fluid"/>
          </a>
        </div>
      </div>
      <div className="col-6 col-sm-4 col-md-2">
        <div className="insta-item">
          <a href="https://www.instagram.com/templatesjungle/" target="_blank">
            <img src="/assets/images/insta-item5.jpg" alt="instagram" className="insta-image img-fluid"/>
          </a>
        </div>
      </div>
      <div className="col-6 col-sm-4 col-md-2">
        <div className="insta-item">
          <a href="https://www.instagram.com/templatesjungle/" target="_blank">
            <img src="/assets/images/insta-item6.jpg" alt="instagram" className="insta-image img-fluid"/>
          </a>
        </div>
      </div>
    </div>
  </section>

  <footer id="footer" className="mt-5">
    <div className="container">
      <div className="row d-flex flex-wrap justify-content-between py-5">
        <div className="col-md-3 col-sm-6">
          <div className="footer-menu footer-menu-001">
            <div className="footer-intro mb-4">
              <a href="index.html">
                <img src="/assets/images/main-logo.png" alt="logo"/>
              </a>
            </div>
            <p>Gravida massa volutpat aenean odio. Amet, turpis erat nullam fringilla elementum diam in. Nisi, purus
              vitae, ultrices nunc. Sit ac sit suscipit hendrerit.</p>
            <div className="social-links">
              <ul className="list-unstyled d-flex flex-wrap gap-3">
                <li>
                  <a href="#" className="text-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <use href="#facebook"></use>
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <use href="#twitter"></use>
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <use href="#youtube"></use>
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <use href="#pinterest"></use>
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <use href="#instagram"></use>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="footer-menu footer-menu-002">
            <h5 className="widget-title text-uppercase mb-4">Quick Links</h5>
            <ul className="menu-list list-unstyled text-uppercase border-animation-left fs-6">
              <li className="menu-item">
                <a href="index.html" className="item-anchor">Home</a>
              </li>
              <li className="menu-item">
                <a href="index.html" className="item-anchor">About</a>
              </li>
              <li className="menu-item">
                <a href="blog.html" className="item-anchor">Services</a>
              </li>
              <li className="menu-item">
                <a href="styles.html" className="item-anchor">Single item</a>
              </li>
              <li className="menu-item">
                <a href="#" className="item-anchor">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="footer-menu footer-menu-003">
            <h5 className="widget-title text-uppercase mb-4">Help & Info</h5>
            <ul className="menu-list list-unstyled text-uppercase border-animation-left fs-6">
              <li className="menu-item">
                <a href="#" className="item-anchor">Track Your Order</a>
              </li>
              <li className="menu-item">
                <a href="#" className="item-anchor">Returns + Exchanges</a>
              </li>
              <li className="menu-item">
                <a href="#" className="item-anchor">Shipping + Delivery</a>
              </li>
              <li className="menu-item">
                <a href="#" className="item-anchor">Contact Us</a>
              </li>
              <li className="menu-item">
                <a href="#" className="item-anchor">Find us easy</a>
              </li>
              <li className="menu-item">
                <a href="index.html" className="item-anchor">Faqs</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="footer-menu footer-menu-004 border-animation-left">
            <h5 className="widget-title text-uppercase mb-4">Contact Us</h5>
            <p>Do you have any questions or suggestions? <a href="mailto:contact@yourcompany.com"
                className="item-anchor">contact@yourcompany.com</a></p>
            <p>Do you need support? Give us a call. <a href="tel:+43 720 11 52 78" className="item-anchor">+43 720 11 52
                78</a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="border-top py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6 d-flex flex-wrap">
            <div className="shipping">
              <span>We ship with:</span>
              <img src="/assets/images/arct-icon.png" alt="icon"/>
              <img src="/assets/images/dhl-logo.png" alt="icon"/>
            </div>
            <div className="payment-option">
              <span>Payment Option:</span>
              <img src="/assets/images/visa-card.png" alt="card"/>
              <img src="/assets/images/paypal-card.png" alt="card"/>
              <img src="/assets/images/master-card.png" alt="card"/>
            </div>
          </div>
          <div className="col-md-6 text-end">
            <p>© Copyright 2022 Kaira. All rights reserved. Design by <a href="https://templatesjungle.com"
                target="_blank">TemplatesJungle</a> Distribution By <a href="https://themewagon.com"
              target="blank">ThemeWagon</a></p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</body>
</>

    );
  }
  
  export default Home;