import React, { useState } from "react";
import { useScrollReveal } from "../utils/useScrollReveal";

const Quiz = () => {
  const [quiz, setQuiz] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [quizGenerated, setQuizGenerated] = useState(false);

  useScrollReveal();

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();

    // Clear previous quiz and answers
    setQuiz([]);
    setSelectedAnswers({});
    setFeedback({});
    setScore(null); // Reset score
    setQuizGenerated(false); // Reset quiz generated state
    setIsLoading(true); // Show loading state

    const formData = new FormData(e.target);
    try {
      const token = localStorage.getItem("token"); // Adjust if you're storing the token elsewhere

      if (!token) {
        throw new Error("User is not authenticated. Token not found.");
      }

      const response = await fetch("http://127.0.0.1:8000/quiz/generate", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      const responseText = await response.text();
      console.log("responseText", responseText);

      // Clean the response if needed
      const cleanedResponseText = responseText.replace(/```json/g, "").replace(/```/g, "");

      const data = JSON.parse(cleanedResponseText);

      if (data.quiz) {
        setQuiz(JSON.parse(data.quiz));
        setQuizGenerated(true); // Mark quiz as generated
      } else {
        console.error("Invalid response:", data);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  }; 

  const handleSubmitAnswer = (e, questionIndex, correctAnswer) => {
    e.preventDefault();

    const selectedAnswer = selectedAnswers[questionIndex];
    setFeedback({
      ...feedback,
      [questionIndex]: selectedAnswer === correctAnswer,
    });

    // Calculate score after each answer is submitted
    calculateScore();
  };

  const handleReload = () => {
    // Clear all answers and feedback
    setSelectedAnswers({});
    setFeedback({});
    setScore(null);  // Reset score
    setQuizGenerated(false);  // Reset quiz generated state
  };

  const calculateScore = () => {
    let correctAnswersCount = 0;
    quiz.forEach((item, index) => {
      if (feedback[index] === true) {
        correctAnswersCount += 1;
      }
    });
    setScore(`${correctAnswersCount} / ${quiz.length}`);
  };

  const handleSaveQuiz = async () => {
    // Prepare the data to send to the backend
    const quizData = {
      topic: "Greenhouse Gases",  // You can change this to dynamic if needed
      content: JSON.stringify(quiz),  // Convert quiz content to string
      score: score
    };
  
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
  
      if (!token) {
        throw new Error("User is not authenticated. Token not found.");
      }
  
      const response = await fetch("http://127.0.0.1:8000/quiz/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // Add token to the Authorization header
        },
        body: JSON.stringify(quizData),
      });
  
      const data = await response.json();
      console.log("data", data);
      
      if (response.ok) {
        console.log("Quiz saved successfully:", data);
      } else {
        console.error("Error saving quiz:", data);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Quiz Generation Form */}
      <form
        onSubmit={handleSubmitQuiz}
        className="bg-white shadow-md rounded-lg p-6 mb-6"
      >
        <div className="flex flex-wrap gap-4">
          <input
            name="topic"
            placeholder="Enter topic"
            className="w-full sm:w-1/3 p-2 border rounded-md"
          />
          <input
            type="file"
            name="file"
            className="w-full sm:w-1/3 p-2 border rounded-md"
          />
          <input
            name="num_questions"
            type="number"
            placeholder="Number of questions"
            className="w-full sm:w-1/6 p-2 border rounded-md"
          />
          <select
            name="difficulty"
            className="w-full sm:w-1/6 p-2 border rounded-md"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Generate Quiz
        </button>
      </form>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center text-lg text-gray-500">
          Loading... Please wait.
        </div>
      )}

      {/* Quiz Questions */}
      {quiz.length > 0 && !isLoading ? (
        <div className="space-y-6">
          {quiz.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4">{item.question}</h3>
              <form
                onSubmit={(e) => handleSubmitAnswer(e, index, item.answer)}
              >
                <div className="flex flex-wrap gap-4 mb-4">
                  {item.options.map((option, i) => (
                    <label
                      key={i}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        onChange={() => handleAnswerChange(index, option)}
                        disabled={feedback[index] !== undefined}
                        className="form-radio h-4 w-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={feedback[index] !== undefined}
                  className={`py-2 px-4 rounded-md ${
                    feedback[index] !== undefined
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  Submit Answer
                </button>
              </form>

              {/* Feedback with fade-in effect */}
              {feedback[index] !== undefined && (
                <div
                  className={`mt-4 p-4 rounded-md fade-in text-white ${
                    feedback[index] ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {feedback[index]
                    ? "Correct!"
                    : `Incorrect! The correct answer is: ${item.answer}`}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-center text-gray-500">No quiz available</p>
      )}

      {/* Score Display */}
      {score !== null && (
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold text-black">Your Score: {score}</p>
        </div>
      )}

      {/* Reload Button (only visible after quiz is generated) */}
      {quizGenerated && (
        <div className="mt-6 text-center">
          <button
            onClick={handleReload}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md"
          >
            Reload Quiz
          </button>
          <button
            onClick={handleSaveQuiz}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Save Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
