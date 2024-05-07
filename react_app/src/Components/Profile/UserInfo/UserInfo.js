import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./UserInfo.css";
import Header from "../../Header";
import Footer from "../../Footer";
import "../SideBar";
import SideBar from "../SideBar";

const UserInfo = () => {
  const navigate = useNavigate();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    const { newPassword, confirmPassword, ...updateData } = user;
    let profileUpdateSuccess = true;

    // Update profile excluding password
    const response = await fetch("http://localhost:8000/users/profile/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      profileUpdateSuccess = false;
      const errorData = await response.json();
      console.error("An error occurred during profile update:", errorData);
      alert("Failed to update profile");
    }

    // Update password if necessary
    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const passwordResponse = await fetch(
        "http://localhost:8000/users/profile/password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword, confirmPassword }),
        }
      );

      if (!passwordResponse.ok) {
        profileUpdateSuccess = false;
        const errorData = await passwordResponse.json();
        console.error("An error occurred during password update:", errorData);
        alert("Failed to update password");
      }
    }

    if (profileUpdateSuccess) {
      alert("Profile updated successfully");
    }
  };

  // Add logic to handle profile picture upload
  const handleProfilePictureChange = async (e) => {
    const token = localStorage.getItem("token");
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(
      "http://localhost:8000/users/profile/picture/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (response.ok) {
      alert("Profile picture updated successfully");
      // Optionally fetch user info again to update the UI
    } else {
      alert("Failed to update profile picture");
    }
  };

  return (
    <div className="user-info">
      <Header />
      <div className="user-info-container">
        <SideBar />
        <main className="user-details">
          <section className="user-profile">
            <img
              src={user.avatar || "/Images/Icons/profile-icon.png"}
              alt="User Profile"
              className="profile-picture"
            />
            <h2>{`${user.first_name} ${user.last_name}`}</h2>
            <span>{user.address}</span>
          </section>

          {/* Fields Section */}
          <div className="user-info-fields">
            {/* Section 1 */}
            <div className="fields-section section-left">
              <div className="field">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="first_name"
                  value={user.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="last_name"
                  value={user.last_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={user.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={user.phone_number}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="fields-section section-right">
              <div className="field">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={user.bio}
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={user.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={user.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              {/* Edit Profile Picture - Assuming you handle file upload logic */}
              <div className="field">
                <label htmlFor="profilePicture">Edit Profile Picture</label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  onChange={handleProfilePictureChange} // This now directly calls the correct handler
                />
              </div>
            </div>
          </div>
          <button onClick={handleSaveChanges}>Save Changes</button>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserInfo;
