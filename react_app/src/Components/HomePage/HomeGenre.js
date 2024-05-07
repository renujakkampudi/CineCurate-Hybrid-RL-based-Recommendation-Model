import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import "./HomeGenre.css";

const HomeGenre = () => {
  const { genreName } = useParams();
  const [movies, setMovies] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user might not be logged in.");
      return;
    }

    // const bookUrl = `http://localhost:8000/api/recommendations/books/genre/${genreName}/`;
    const fetchGenreRecommendations = async () => {
      let url = `http://localhost:8000/api/recommendations/${
        genreName === "explore-new-themes"
          ? "explore-new-themes"
          : `genre/${encodeURIComponent(genreName)}`
      }/`;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const moviesArray = Object.values(data).flat(); // Flatten all movies into a single array
          setMovies(moviesArray);
        } else {
          console.error(
            "Failed to fetch genre-specific recommendations:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching genre-specific recommendations:", error);
      }
    };

    fetchGenreRecommendations();
  }, [genreName]);

  // const fetchBookRecommendations = async () => {
  //   try {
  //     console.log(
  //       "Sending request to:",
  //       `http://localhost:8000/api/recommendations/books/genre/${genreName}/`
  //     );
  //     const response = await fetch(
  //       `http://localhost:8000/api/recommendations/books/genre/${genreName}/`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       setBooks(data);
  //     } else {
  //       console.error(
  //         "Failed to fetch book recommendations:",
  //         response.status
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error fetching book recommendations:", error);
  //   }
  // };

  const pageTitle =
    genreName === "explorenewthemes"
      ? "Explore New Themes"
      : `${
          genreName
            ? genreName.charAt(0).toUpperCase() + genreName.slice(1)
            : "Unknown"
        } Movie Recommendations`;

  return (
    <div className="genre-page">
      <Header />
      <h1>{pageTitle}</h1>
      <div className="movie-grid">
        {movies?.map((movie) => (
          <Link to={`/movie-description/${movie.id}`} key={movie.id}>
            <div className="movie-card">
              <img
                src={movie.working_poster_url || "/path/to/default/image.png"}
                alt={movie.original_title}
                className="movie-poster"
              />
              <div className="movie-title">{movie.original_title}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Separator and book recommendations */}
      <hr />
      <h1>Books for Genre Lovers</h1>
      <div className="book-grid">
        {books?.map((book) => (
          <Link to={`/book-description/${book.id}`} key={book.id}>
            <div className="book-card">
              <img
                src={book.cover_url || "/path/to/default/book/image.png"}
                alt={book.title}
                className="book-cover"
              />
              <div className="book-title">{book.title}</div>
            </div>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default HomeGenre;
