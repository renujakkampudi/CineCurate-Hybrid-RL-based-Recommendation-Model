import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import TitleSection from "./Components/MainPage/Title";
import AboutSection from "./Components/MainPage/AboutSection";
import InteractiveGridSection from "./Components/MainPage/InteractiveGrid";
import AuthButtonsSection from "./Components/MainPage/AuthButtonsSection";
import Footer from "./Components/Footer";
import AuthPage from "./Components/AuthPage";
import HomePage from "./Components/HomePage/HomePage";
import QuestionsPage from "./Components/Questions";
import MovieDescription from "./Components/MovieDescriptionPage";
import Header from "./Components/Header";
import UserInfo from "./Components/Profile/UserInfo/UserInfo";
import Preferences from "./Components/Profile/Preferences/Preferences";
import Favorites from "./Components/Profile/Favorites/Favorites";
import Watchlist from "./Components/Profile/Watchlist/Watchlist";
import ProfilePage from "./Components/Profile/ProfilePage";
import GenrePage from "./Components/MainPage/GenrePage";
import MovieSection from "./Components/HomePage/MovieSection";
import HomeGenre from "./Components/HomePage/HomeGenre";

const genres = [
  {
    id: 1,
    name: "Crime",
    image: "/Images/Genres/Crime.jpg",
  },
  {
    id: 2,
    name: "Comedy",
    image: "/Images/Genres/Comedy.jpg",
  },
  {
    id: 3,
    name: "Romance",
    image: "/Images/Genres/Romance.jpg",
  },
  {
    id: 4,
    name: "Horror",
    image: "/Images/Genres/Horror.jpg",
  },
  {
    id: 5,
    name: "Sci-Fi",
    image: "/Images/Genres/SciFi.jpg",
  },
  {
    id: 6,
    name: "Fantasy",
    image: "/Images/Genres/Fantasy.jpg",
  },
  {
    id: 7,
    name: "Action",
    image: "/Images/Genres/Action.jpg",
  },
  {
    id: 8,
    name: "Drama",
    image: "/Images/Genres/Drama.jpg",
  },
  {
    id: 9,
    name: "Mystery",
    image: "/Images/Genres/Mystery.jpg",
  },
  // ... Add all your genres here with similar structure
];

export default function App() {
  const aboutRef = useRef(null);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <TitleSection />
              <AboutSection />
              <InteractiveGridSection items={genres} />
              <AuthButtonsSection />
              <Footer />
            </>
          }
        />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route
          path="/movie-description/:movieId"
          element={<MovieDescription />}
        />
        <Route path="/profile/userinfo" element={<UserInfo />} />
        <Route path="/profile/preferences" element={<Preferences />} />
        <Route path="/profile/favorites" element={<Favorites />} />
        <Route path="/profile/watchlist" element={<Watchlist />} />
        {/* Profile page that may wrap all the profile sections */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/main/genre/:genreId" element={<GenrePage />} />
        <Route path="/movie/:movieId" element={<MovieDescription />} />
        <Route path="/home/genre/:genreName" element={<HomeGenre />} />
      </Routes>
    </Router>
  );
}
