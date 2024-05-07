import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link
import "./GenrePage.css";
import Header from "../Header";
import Footer from "../Footer";

const GenrePage = () => {
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/genres/${genreId}/movies/`)
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, [genreId]);

  return (
    <div className="genre-page">
      <Header />
      <h1>{genreId.charAt(0).toUpperCase() + genreId.slice(1)} Movies</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="movie-card-link"
          >
            <div className="movie-card">
              <img
                src={movie.working_poster_url}
                alt={movie.original_title}
                className="movie-image"
              />
              <div className="movie-title">
                {movie.original_title.charAt(0).toUpperCase() +
                  movie.original_title.slice(1).toLowerCase()}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default GenrePage;
