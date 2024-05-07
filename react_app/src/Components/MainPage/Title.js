import React, { useState, useEffect } from "react";
import Header from "../Header"; // Adjust the import path as necessary
import "./Title.css";
import { useNavigate } from "react-router-dom";

// Assuming you have an array of poster image URLs
const posters = [
  "/Images/MoviePosters/Interstellar.jpg",
  "/Images/MoviePosters/InsideOut.jpg",
  "/Images/MoviePosters/TheDarkKnightRises.jpg",
  "/Images/MoviePosters/ManOfSteel.jpg",
  "/Images/MoviePosters/IronMan.jpg",
  "/Images/MoviePosters/Avatar.jpg",
  // Add all your poster paths here
];

const TitleSection = (scrollRef) => {
  const [currentPoster, setCurrentPoster] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prevPoster) => (prevPoster + 1) % posters.length);
    }, 3000); // Change posters every 3-4 seconds

    return () => clearInterval(interval);
  }, []);

  const handleArrowClick = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="TitlePage">
      {/* <Header /> */}
      <div
        className="Title-container"
        style={{ backgroundImage: `url(${posters[currentPoster]})` }}
        key={currentPoster}
      >
        <div className="Title-content">
          <div className="Title-name">
            <h1>Cine</h1>
            <h1>Curate</h1>
          </div>
          <div className="Title-posters">
            <img src={posters[currentPoster]} alt="Movie Poster" />
          </div>
        </div>
      </div>
      <div className="dancing-arrow" onClick={handleArrowClick}>
        <i className="fas fa-chevron-down"></i>{" "}
        {/* Example using FontAwesome */}
      </div>
    </div>
  );
};

export default TitleSection;
