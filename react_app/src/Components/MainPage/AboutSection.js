// src/Components/MainPage/AboutSection.js
import React, { useEffect, useRef } from "react";
import "./AboutSection.css"; // Your existing CSS file for styling

const AboutSection = () => {
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("slide-in");
          }
        });
      },
      { threshold: 0.5 } // Trigger when half the item is in the viewport
    );

    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const line3 = line3Ref.current;

    if (line1) observer.observe(line1);
    if (line2) observer.observe(line2);
    if (line3) observer.observe(line3);

    return () => {
      if (line1) observer.unobserve(line1);
      if (line2) observer.unobserve(line2);
      if (line3) observer.unobserve(line3);
    };
  }, []);

  return (
    <div className="about-container">
      <div className="about-text">
        <h1 className="about-heading">ABOUT US</h1>
        <h2 ref={line1Ref} className="about-line">
          Welcome to CineCurate, where your next favorite movie awaits
          discovery! Born from a passion for cinema and a fascination with the
          power of algorithms, our platform is designed to redefine your
          movie-watching experience. At the heart of our innovation lies a
          unique blend of content-based, collaborative filtering, and
          cutting-edge reinforcement learning algorithms, meticulously crafted
          to tailor recommendations that resonate with your individual
          preferences.
        </h2>
        <h2 ref={line2Ref} className="about-line">
          Our journey began with a simple question: "How can we make discovering
          movies as enjoyable as watching them?" The answer led us to harness
          the capabilities of React and Django, creating a user-friendly
          interface. We understand that movie tastes are as diverse as our
          audience. That's why our platform dives deep into the cinematic
          universe, drawing from an expansive library of genres and industries.
          Whether you're a fan of heart-throbbing action, soul-stirring dramas,
          or mind-bending sci-fi, our algorithms are fine-tuned to uncover the
          gems that align with your unique tastes.
        </h2>
        <h2 ref={line3Ref} className="about-line">
          As you embark on this cinematic journey with us, we invite you to
          explore, interact, and let us guide you to movies that might just
          become your new favorites. Thank you for choosing [Your Website Name].
          Let's make movie magic together.
        </h2>
      </div>
      <div className="about-image">
        <img src="/Images/About Us.jpg" alt="About Us" />
      </div>
    </div>
  );
};

export default AboutSection;
