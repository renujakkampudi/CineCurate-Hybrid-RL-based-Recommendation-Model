import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDescriptionPage.css";
import Header from "./Header";

const MovieDescription = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [userInteraction, setUserInteraction] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/movies/${movieId}/`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError(`Failed to load movie details: ${error.message}`);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (error) {
    return (
      <div className="error-message">
        <p>Sorry, there was an error fetching the movie details: {error}</p>
        <button onClick={() => navigate("/home")}>Go Back to Home</button>
      </div>
    );
  }

  if (!movie) {
    return <div>Loading...</div>; // Display a loading message or spinner until the movie data is available
  }

  const handleUserAction = (action) => {
    console.log(`User selected: ${action}`);
    setUserInteraction(action); // Update the state with the user's action
    // Here you would typically make an API call to save the user's response
  };
  // Render the movie description page with the fetched data
  return (
    <div className="movie-description-page">
      <div
        className="movie-poster-desc"
        style={{ backgroundImage: `url(${movie.working_poster_url})` }}
      />
      <div className="movie-title-vertical">{movie.original_title}</div>
      <div className="movie-content">
        <div className="movie-info">
          <h1 className="movie-title-desc">{movie.original_title}</h1>
          <p className="movie-description">{movie.overview}</p>
          <div className="movie-genres">
            {movie.genres.map((genre) => (
              <div key={genre.name} className="genre-bubble">
                {genre.name}
              </div>
            ))}
          </div>
          <div className="user-interactions">
            {[
              "Like",
              "Dislike",
              "One-time Watch",
              "Watched Completely",
              "Watch Again",
              "Did Not Complete",
            ].map((action) => (
              <button
                key={action}
                onClick={() => handleUserAction(action)}
                className={userInteraction === action ? "selected" : ""}
              >
                {action}
              </button>
            ))}
          </div>
          <div className="movie-cast">
            <h2>Cast</h2>
            <div className="cast-list">
              {movie.actors.map((actor) => (
                <div key={actor.name} className="cast-member">
                  <p>{actor.name}</p>
                  <p>{actor.role}</p>
                </div>
              ))}
            </div>
            <h2>Director</h2>
            <p>{movie.director ? movie.director : "None"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDescription;
