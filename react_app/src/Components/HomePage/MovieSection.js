import React from "react";
import { Link } from "react-router-dom";
import "./MovieSection.css"; // Your CSS file for styling

const MovieSection = ({ items = [] }) => {
  console.log("Items in MovieSection:", items);
  return (
    <div className="home-movie-section">
      <div className="home-movie-list">
        {items.map((item) => (
          <Link
            to={`/home/genre/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
            key={item.name}
          >
            <div className="home-movie-card">
              <h3>{item.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieSection;
