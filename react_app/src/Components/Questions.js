import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Questions.css"; // Make sure you have this CSS file

const QuestionsPage = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [customOptions, setCustomOptions] = useState({});
  const [answers, setAnswers] = useState({
    movieTypes: [],
    languages: [],
    favoriteMovies: [],
    avoidedGenres: [],
    watchFrequency: [],
  });
  const [customOption, setCustomOption] = useState("");

  const navigate = useNavigate();

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

  const handleCheckboxChange = (questionIndex, option) => {
    const key = questions[questionIndex].key;
    setAnswers((prevAnswers) => {
      const updatedOptions = prevAnswers[key].includes(option)
        ? prevAnswers[key].filter((item) => item !== option)
        : [...prevAnswers[key], option];
      return { ...prevAnswers, [key]: updatedOptions };
    });
  };

  const handleCustomOptionChange = (e) => {
    setCustomOption(e.target.value);
  };

  const handleCustomOptionSubmit = (questionIndex) => {
    if (customOption.trim() !== "") {
      // Add to customOptions state
      setCustomOptions((prev) => ({
        ...prev,
        [questionIndex]: [...(prev[questionIndex] || []), customOption],
      }));
      // Add to answers (for submission)
      handleCheckboxChange(questionIndex, customOption);
      // Clear the input field
      setCustomOption("");
    }
  };

  const handleNextQuestion = () => {
    if (customOption.trim() !== "") {
      handleCustomOptionSubmit(currentQuestion);
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    handleCustomOptionSubmit(currentQuestion);
    const token = localStorage.getItem("token"); // Retrieve the token from storage

    // Adjust the structure of `answers` to match the backend's expected format
    const submissionData = {
      preferred_genres: answers.movieTypes,
      preferred_actors: answers.languages,
      preferred_directors: answers.favoriteMovies,
      favorite_movies: answers.avoidedGenres,
      preferred_keywords: answers.watchFrequency,
    };

    console.log("Submitting:", JSON.stringify(submissionData)); // Debugging line

    const response = await fetch(
      "http://localhost:8000/interactions/preferences/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      }
    );

    if (response.ok) {
      navigate("/home"); // Navigate to the HomePage after successful submission
    } else {
      // Handle submission errors (unauthorized, validation errors, etc.)
      const errorData = await response.json();
      console.error("An error occurred:", errorData);
      alert("Submission failed: " + (errorData.detail || "Unknown error"));
    }
  };

  // Render question based on its type
  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const customQuestionOptions = customOptions[currentQuestion] || [];

    switch (question.type) {
      case "checkbox":
        return (
          <>
            {customQuestionOptions.map((option) => (
              <div key={option} className="option-item selected">
                {option}
              </div>
            ))}
            {question.options.map((option) => (
              <div
                key={option}
                className={`option-item ${
                  answers[question.key].includes(option) ? "selected" : ""
                }`}
                onClick={() => handleCheckboxChange(currentQuestion, option)}
              >
                {option}
              </div>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <div className="questions-page">
      <div className="question-box">
        {!quizStarted ? (
          <>
            <h2>Help us get to know you better!</h2>
            <button onClick={startQuiz}>Start Quiz</button>
          </>
        ) : (
          <>
            {currentQuestion < questions.length && (
              <>
                <h2>{questions[currentQuestion].question}</h2>
                <div className="options">{renderQuestion()}</div>
                <div className="custom-option-container">
                  {" "}
                  {/* Add this wrapper */}
                  <input
                    type="text"
                    value={customOption}
                    onChange={handleCustomOptionChange}
                    placeholder="Type your own option..."
                    className="custom-option-input"
                  />
                  <button
                    onClick={() => handleCustomOptionSubmit(currentQuestion)}
                    className="add-option-button"
                  >
                    Add Option
                  </button>
                </div>
                {currentQuestion < questions.length - 1 ? (
                  <button onClick={handleNextQuestion}>Next</button>
                ) : (
                  <button onClick={handleSubmit}>Submit</button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;
