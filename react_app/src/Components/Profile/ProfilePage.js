import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, Outlet } from "react-router-dom";
import UserInfo from "./UserInfo/UserInfo";
import Preferences from "./Preferences/Preferences";
import Favorites from "./Favorites/Favorites";
import Watchlist from "./Watchlist/Watchlist";
import "./ProfilePage.css";
import "../Header";
import "../Footer";
import Header from "../Header";
import Footer from "../Footer";
import "./SideBar";
import SideBar from "./SideBar";

const ProfilePage = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    bio: "",
    username: "",
    avatar: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/users/profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser({
          ...user,
          ...data,
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        // Handle fetch error or redirect to login
        console.error("Failed to fetch user info");
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <div className="Profile-Page">
      <Header />
      <div className="profile-page-container">
        <SideBar />
        <main className="profile-content">
          <div className="profile-header">
            <div className="profile-image-placeholder">
              <img src={"/Images/Icons/profile-icon.png"} alt="User Profile" />
            </div>
            <div className="user-bio">
              <p>{user.first_name}</p>
              <p>{user.last_name}</p>
            </div>
          </div>
          <nav className="profile-nav">
            <NavLink to="userinfo" className="profile-nav-link">
              Edit Profile
            </NavLink>
            <NavLink to="preferences" className="profile-nav-link">
              Preferences
            </NavLink>
            <NavLink to="your-activity" className="profile-nav-link">
              Your Activity
            </NavLink>
            <NavLink to="your-activity" className="profile-nav-link">
              Watchlist
            </NavLink>
          </nav>
          <Outlet /> {/* Render child routes */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
