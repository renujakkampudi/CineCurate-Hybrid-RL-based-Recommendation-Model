import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search?query=${searchTerm}`);
  };
  return (
    <header className="header">
      <div className="logo-container">
        <img src="/Images/Icons/logo-svg.svg" alt="Logo" className="logo" />
        <h1 className="website-name">CineCurate</h1>
      </div>
      <nav className="navigation">
        <Link to="/" className="nav-link">
          <img src="/Images/Icons/home.png" alt="Home" />
        </Link>
        <Link to="/home" className="nav-link">
          <img src="/Images/Icons/star.png" alt="Recommendations" />
        </Link>
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by movie name, description, actor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </form>
        <div className="profile-dropdown-container">
          <button onClick={toggleProfileDropdown} className="profile-button">
            <img src="/Images/Icons/user.png" alt="Profile" />
          </button>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <Link to="/Profile/userinfo" className="dropdown-item">
                User Info
              </Link>
              <Link to="/Profile/preferences" className="dropdown-item">
                Preferences
              </Link>
              <Link to="/Profile/favorites" className="dropdown-item">
                Favorites
              </Link>
              <Link to="/Profile/watchlist" className="dropdown-item">
                Watchlist
              </Link>
              <Link to="/Profile/subscription" className="dropdown-item">
                Subscription
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
