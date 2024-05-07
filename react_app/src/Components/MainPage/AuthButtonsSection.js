import React from "react";
import { useNavigate } from "react-router-dom";
import "./AuthButtonsSection.css";

const AuthButtonsSection = () => {
  let navigate = useNavigate();

  return (
    <div className="auth-buttons-container">
      <button className="auth-button" onClick={() => navigate("/signin")}>
        Sign In
      </button>
      <button className="auth-button" onClick={() => navigate("/signup")}>
        Sign Up
      </button>
    </div>
  );
};

export default AuthButtonsSection;
