import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation
import "./InteractiveGrid.css"; // Your CSS file

const InteractiveGridSection = ({ items }) => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [focusedItem, setFocusedItem] = useState(null);

  // Within InteractiveGridSection
  const handleCardClick = (genreName) => {
    navigate(`/main/genre/${genreName.toLowerCase()}`); // Make sure the genreName is in the correct format to match your URLs
  };

  return (
    <div className="interactive-grid">
      <div className="interactive-grid-heading">
        <h1>Explore Genres</h1>
      </div>
      <div className="interactive-grid-container">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`grid-item grid-item-${index % 3}`}
            onMouseEnter={() => setFocusedItem(item.id)}
            onMouseLeave={() => setFocusedItem(null)}
            onClick={() => handleCardClick(item.name)}
          >
            <img src={item.image} alt={item.name} className="genre-image" />
            <div className="genre-name">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveGridSection;
