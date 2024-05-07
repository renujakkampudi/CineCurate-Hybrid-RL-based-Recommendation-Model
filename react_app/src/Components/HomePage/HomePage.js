import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import MovieCarousel from "./MovieCarousel";
import MovieSection from "./MovieSection";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [userPreferences, setUserPreferences] = useState({
    preferred_genres: [],
    preferred_languages: [],
  });

  const [exploreThemes] = useState([
    { name: "Explore New Themes", path: "/home/genre/explorenewthemes" },
  ]);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:8000/interactions/preferences/",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`, // Use the token for authentication
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Fetched preferences:", data);
            setUserPreferences(data);
          } else {
            console.error("Failed to fetch user preferences");
            // Optionally, handle user redirection to login if token is invalid or expired
          }
        } catch (error) {
          console.error("Error fetching user preferences:", error);
        }
      } else {
        console.log("No token found. User might not be logged in.");
        // Handle redirection to login or show message
      }
    };

    fetchUserPreferences();
  }, []);

  return (
    <div className="home-container">
      <Header />
      <div className="dynamic-container">
        <MovieCarousel />
        <div className="blocks-container">
          {userPreferences.preferred_genres.length > 0 && (
            <MovieSection
              title="Preferred Genres"
              items={userPreferences.preferred_genres.map((genre) => ({
                name: genre,
                path: `/genre/${genre.toLowerCase()}`,
              }))}
            />
          )}

          {/* Explore New Themes Card */}
          <MovieSection title="Explore New Themes" items={exploreThemes} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
