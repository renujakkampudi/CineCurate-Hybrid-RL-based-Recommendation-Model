import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css"; // Ensure this CSS file is in the same directory

// Icons imports or URLs
const socialIcons = {
  facebook: "/Images/path-to-facebook-icon.jpg",
  instagram: "/Images/path-to-instagram-icon.jpg",
  twitter: "/Images/path-to-twitter-icon.jpg",
  youtube: "/Images/path-to-youtube-icon.jpg",
};

const Footer = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="footer-division">
        <img
          src="/Images/Icons/logo-svg.svg"
          alt="Logo"
          className="footer-logo"
        />
        <h3>Cine Curate</h3>
        <p>
          Discover the heart of cinema with CineCurate - your personalized
          portal to explore, rate, and curate a world of movies tailored just
          for you. Dive into our extensive collection and let your next film
          adventure begin!.
        </p>
        <p>&copy; 2024 Cine Curate. All rights reserved.</p>
      </div>
      <div className="footer-division">
        <h4>Menu</h4>
        <ul>
          <li onClick={() => navigateTo("/")}>Home</li>
          <li onClick={() => navigateTo("/signin")}>SignIn</li>
          <li onClick={() => navigateTo("/home")}>Recommendations</li>
          <li onClick={() => navigateTo("/profile")}>Profile</li>
        </ul>
      </div>
      <div className="footer-division">
        <h4>Contact Info</h4>
        <p>
          <i className="icon-phone"></i> +91 9285670156
        </p>
        <p>
          <i className="icon-email"></i> movieWebsite@gmail.com
        </p>
        <p>
          <i className="icon-address"></i> 123 Street, City, India
        </p>
      </div>
      <div className="footer-division">
        <h4>Connect With Us</h4>
        <div className="social-icons">
          {Object.entries(socialIcons).map(([key, icon]) => (
            <img key={key} src={icon} alt={key} className={`icon-${key}`} />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
