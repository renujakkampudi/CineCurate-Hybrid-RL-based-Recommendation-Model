import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Preferences.css";
import Header from "../../Header";
import Footer from "../../Footer";
import "../SideBar";
import SideBar from "../SideBar";

const Preferences = () => {
  // Assuming 'preferences' is the state retrieved from the backend
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

  const questions = [
    {
      question:
        "Welcome! What are your preferred genres? (Can select more than one)",
      options: [
        "Fantasy",
        "Romance",
        "Action",
        "Mystery",
        "Horror",
        "Comedy",
        "Drama",
        "SciFi",
      ],
      type: "checkbox",
      key: "movieTypes",
    },
    {
      question: "Choose your favourite actors (Can select more than one)",
      options: [
        "Robert Downey Jr",
        "Matthew McConaughey",
        "Chris Evans",
        "Henry Cavill",
        "Tom Hanks",
        "Christian Bale",
        "johnny depp",
        "leonardo dicaprio",
      ],
      type: "checkbox",
      key: "languages",
    },
    {
      question: "Choose your favourite directors (Can select more than one)",
      options: [
        "Christopher Nolan",
        "James Cameroon",
        "Steven Spielberg",
        "Tim Burton",
        "david lynch",
        "peter sullivan",
      ],
      type: "checkbox",
      key: "favoriteMovies",
    },
    {
      question: "Select your favourite movies (Can select more than one)",
      options: [
        "Inside Out",
        "Toy Story Collection",
        "Interstellar",
        "Inceptin",
        "Dark Knight series",
        "Conjuring",
        "World War Z",
        "Murder Mystery series",
        "Marvel Collection",
        "Alice in Wonderland",
        "Harry Potter Collection",
      ],
      type: "checkbox",
      key: "avoidedGenres",
    },
    {
      question:
        "Choose the potential keywords that you might find interesting to watch (Can select more than one)",
      options: [
        "woman director",
        "independent film",
        "murder",
        "base on novel",
        "musical",
        "revenge",
        "biography",
      ],
      type: "checkbox",
      key: "watchFrequency",
    },
  ];

  const [preferences, setPreferences] = useState({
    movieTypes: [],
    languages: [],
    favoriteMovies: [],
    avoidedGenres: [],
    watchFrequency: [],
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:8000/interactions/preferences/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPreferences({
            movieTypes: data.preferred_genres || [],
            languages: data.preferred_actors || [],
            favoriteMovies: data.preferred_directors || [],
            avoidedGenres: data.favorite_movies || [],
            watchFrequency: data.preferred_keywords || [],
          });
        } else {
          console.error("Failed to fetch preferences");
          navigate("/signin"); // Redirect to login if unauthorized
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchPreferences();
  }, [navigate]);

  const togglePreference = (key, option) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: prev[key].includes(option)
        ? prev[key].filter((o) => o !== option)
        : [...prev[key], option],
    }));
  };

  const handleInputChange = (event, key) => {
    setPreferences({
      ...preferences,
      [key]: event.target.value,
    });
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:8000/interactions/preferences/",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            preferred_genres: preferences.movieTypes,
            preferred_actors: preferences.languages,
            preferred_directors: preferences.favoriteMovies,
            favorite_movies: preferences.avoidedGenres,
            preferred_keywords: preferences.watchFrequency,
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to update preferences");
        const errorData = await response.json();
        alert(
          "Failed to update preferences: " +
            (errorData.detail || "Unknown error")
        );
      } else {
        alert("Preferences updated successfully.");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="preferences">
      <Header />
      <div className="preferences-container">
        <SideBar />
        <main className="preferences-details">
          <section className="user-profile">
            <img
              src={user.avatar || "/Images/Icons/profile-icon.png"}
              alt="User Profile"
              className="profile-picture"
            />
            <h2>{`${user.first_name} ${user.last_name}`}</h2>
            <span>{user.address}</span>
          </section>

          <div className="preference-item">
            <h3>Favorite Genres</h3>
            <div className="current-preferences">
              {preferences.movieTypes.join(", ")}
            </div>
            <div className="preference-options">
              {/* Render buttons for the 'movieTypes' options */}
              {[
                "Fantasy",
                "Romance",
                "Action",
                "Mystery",
                "Horror",
                "Comedy",
                "Drama",
                "SciFi",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => togglePreference("movieTypes", option)}
                  className={
                    preferences.movieTypes.includes(option) ? "selected" : ""
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="preference-item">
            <h3>Favorite Actors (Select all that apply)</h3>
            <div className="current-preferences">
              {preferences.languages.join(", ")}
            </div>
            <div className="preference-options">
              {questions
                .find((q) => q.key === "languages")
                .options.map((option) => (
                  <button
                    key={option}
                    onClick={() => togglePreference("languages", option)}
                    className={
                      preferences.languages.includes(option) ? "selected" : ""
                    }
                  >
                    {option}
                  </button>
                ))}
            </div>
          </div>

          {/* Text input for favorite movies or TV shows */}
          <div className="preference-item">
            <h3>Favorite Directors</h3>
            <div className="current-preferences">
              {Array.isArray(preferences.favoriteMovies)
                ? preferences.favoriteMovies.join(", ")
                : ""}
            </div>
            <div className="preference-options">
              {questions
                .find((q) => q.key === "favoriteMovies")
                .options.map((director) => (
                  <button
                    key={director}
                    onClick={() => togglePreference("favoriteMovies", director)}
                    className={
                      preferences.favoriteMovies.includes(director)
                        ? "selected"
                        : ""
                    }
                  >
                    {director}
                  </button>
                ))}
            </div>
          </div>

          {/* Question about Genres or Themes to Avoid */}
          <div className="preference-item">
            <h3>Favorite Movies</h3>
            <div className="current-preferences">
              {Array.isArray(preferences.avoidedGenres)
                ? preferences.avoidedGenres.join(", ")
                : ""}
            </div>
            <div className="preference-options">
              {questions
                .find((q) => q.key === "avoidedGenres")
                .options.map((option) => (
                  <button
                    key={option}
                    onClick={() => togglePreference("avoidedGenres", option)}
                    className={
                      preferences.avoidedGenres.includes(option)
                        ? "selected"
                        : ""
                    }
                  >
                    {option}
                  </button>
                ))}
            </div>
          </div>

          {/* Radio buttons for movie watching frequency */}
          <div className="preference-item">
            <h3>Preferred Keywords</h3>
            <div className="current-preferences">
              {Array.isArray(preferences.watchFrequency)
                ? preferences.watchFrequency.join(", ")
                : ""}
            </div>
            <div className="preference-options">
              {questions
                .find((q) => q.key === "watchFrequency")
                .options.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => togglePreference("watchFrequency", keyword)}
                    className={
                      preferences.watchFrequency.includes(keyword)
                        ? "selected"
                        : ""
                    }
                  >
                    {keyword}
                  </button>
                ))}
            </div>
          </div>
          <button onClick={handleSaveChanges}>Save Changes</button>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Preferences;
