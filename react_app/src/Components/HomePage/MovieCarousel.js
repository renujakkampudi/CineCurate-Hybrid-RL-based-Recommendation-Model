import React, { useState, useEffect } from "react";
import "./MovieCarousel.css"; // Your CSS file for styling

const backgrounds = [
  "/Images/MoviePosters/Chris.jpg",
  "/Images/MoviePosters/Christopher.jpg",
  "/Images/MoviePosters/gong.jpg",
  "/Images/MoviePosters/Henry.jpg",
  "/Images/MoviePosters/James.jpg",
  "/Images/MoviePosters/Julia.jpg",
  "/Images/MoviePosters/Robert.jpg",
];

const MovieCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((i) => (i + 1) % backgrounds.length);
    }, 2000); // Change every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="dynamic-background"
      style={{ backgroundImage: `url(${backgrounds[index]})` }}
    >
      {/* InteractiveBlocksContainer would go here */}
    </div>
  );
};

export default MovieCarousel;
