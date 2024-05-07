import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css"; // Make sure you have this CSS file

const AuthPage = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  // Add state for form inputs
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const flipCard = () => setIsFlipped((prev) => !prev);
  const showSignInForm = () => setShowSignIn(true);

  // Function to handle sign-in
  const handleSignIn = async (e) => {
    e.preventDefault();

    const signInUrl = "http://localhost:8000/users/login/";

    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access); // Save the token
        navigate("/home"); // Assuming you're using react-router
      } else {
        // Handle login errors (invalid credentials, network issues, etc.)
        alert("Login failed");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error: " + error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const signUpUrl = "http://localhost:8000/users/register/";

    // Perform validation before sending to the backend (e.g., password match check)
    if (password !== confirmPassword) {
      // Alert or display a message that passwords do not match
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(signUpUrl, {
        // Replace with your actual signup endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          confirm_password: confirmPassword, // Ensure this matches the field name expected by Django
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access); // Assuming `data.token` is your new token
        navigate("/questions");
      } else {
        // If the backend returns a non-ok response, handle it
        const errorData = await response.json();
        alert(errorData.message); // Or display the error message on the page
      }
    } catch (error) {
      // Handle network errors or show a user-friendly message
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      {!showSignIn ? (
        <>
          <div className="welcome-back-content">
            <h2>Welcome Back</h2>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button onClick={showSignInForm} className="signin-welcome-button">
              Sign In
            </button>
          </div>
          <div className="welcome-back-image">
            {/* The image is set as a background in the CSS */}
          </div>
        </>
      ) : (
        <div className="form-container">
          <div className="card-container">
            <div className={`card ${isFlipped ? "flipped" : ""}`}>
              <div className="front">
                <h2>Welcome Back</h2>
                {/* <div className="social-login">
                  <img src="/path-to-fb-logo.png" alt="Facebook" />
                  <img src="/path-to-google-logo.png" alt="Google" />
                  <img src="/path-to-twitter-logo.png" alt="Twitter" />
                </div> */}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="signin-button" onClick={handleSignIn}>
                  Sign In
                </button>
                <p>
                  Need an account? <span onClick={flipCard}>Sign Up</span>
                </p>
              </div>
              <div className="back">
                <h2>Hello, Friend!</h2>
                <input
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "2px solid #dca36e",
                    width:
                      "calc(100% - 40px)" /* Subtract padding from width */,
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "2px solid #dca36e",
                    width:
                      "calc(100% - 40px)" /* Subtract padding from width */,
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "2px solid #dca36e",
                    width:
                      "calc(100% - 40px)" /* Subtract padding from width */,
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setconfirmPassword(e.target.value)}
                />
                <button className="signup-button" onClick={handleSignUp}>
                  Sign Up
                </button>
                <p>
                  Already have an account?{" "}
                  <span onClick={flipCard}>Sign In</span>
                </p>
              </div>
            </div>
          </div>
          <div className="form-image">
            {/* The image will be set as a background in the CSS */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
