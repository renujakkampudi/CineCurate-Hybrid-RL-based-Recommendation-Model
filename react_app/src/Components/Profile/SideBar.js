import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, Outlet } from "react-router-dom";
import "./Sidebar.css";
const SideBar = () => {
  // ... sidebar JSX and hooks
  const handleLogout = () => {
    console.log("Logout user");
    // Implement logout logic here
  };
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/profile/userinfo"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          User Info
        </NavLink>
        <NavLink
          to="/profile/favorites"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Favorites
        </NavLink>
        <NavLink
          to="/profile/preferences"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Preferences
        </NavLink>
        <NavLink
          to="/profile/watchlist"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Watchlist
        </NavLink>
      </nav>
      <button className="logout-button" onClick={handleLogout}>
        Log out
      </button>
    </aside>
  );
};

export default SideBar;
