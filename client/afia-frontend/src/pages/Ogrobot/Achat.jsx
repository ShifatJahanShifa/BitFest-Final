import { useState, useEffect } from "react";
import ChatHistory from "./ChatHistory"; // Real-time chat messages
import Loading from "./Loading"; // Loading spinner
import axios from "axios";
import HistoryMessages from "./HistoryMessages"; // Fetched chat history
import "./Chat.css";

const Achat = () => {
  const [userInput, setUserInput] = useState("");
  const [realTimeMessages, setRealTimeMessages] = useState([]); // For real-time messages
  const [historyMessages, setHistoryMessages] = useState([]); // For fetched chat history
  const [isLoading, setIsLoading] = useState(false);

  // Fetch chat history when the component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get("http://localhost:8000/chat/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          setHistoryMessages(response.data.chat_history || []);
        } else {
          console.error("Failed to fetch chat history");
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add user input to real-time chat messages
    setRealTimeMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", message: userInput },
    ]);

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/chat/",
        null,
        {
          params: { message: userInput },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        // Add bot response to real-time messages
        setRealTimeMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", message: response.data.response },
        ]);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      setRealTimeMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", message: "Sorry, there was an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }

    setUserInput("");
  };

  return (
    <div className="w-4/5 mx-auto p-4 bg-white mt-[2rem] rounded-lg h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 relative">
        {/* Fetched Chat History */}
        {historyMessages.length > 0 && (
          <div className="animate-fadeout">
            <HistoryMessages chatHistory={historyMessages} />
          </div>
        )}

        {/* Real-Time Chat Messages */}
        <ChatHistory chatHistory={realTimeMessages} />

        {/* Placeholder Text */}
        {realTimeMessages.length === 0 && historyMessages.length === 0 && (
          <div className="wrapper">
            <div className="typing-demo">Start Chatting with AI!</div>
          </div>
        )}
      </div>

      {/* Loading Spinner */}
      <Loading isLoading={isLoading} />

      {/* User Input */}
      <form onSubmit={handleSubmit} className="flex mt-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Achat;
