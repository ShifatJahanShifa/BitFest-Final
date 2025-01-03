import { useState } from "react";
import ChatHistory from "./ChatHistory"; // Import ChatHistory component
import Loading from "./Loading"; // Import Loading component
import { useEffect } from "react";
import ScrollReveal from "scrollreveal";
import "./Chat.css";

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    // Initialize ScrollReveal for various effects
    const slideRight = {
      distance: '30px',
      origin: 'right',
      opacity: 0,
      duration: 1300,
      easing: 'ease-in-out',
      reset: true,
    };
    ScrollReveal().reveal('.slide-ai', slideRight);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setChatMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", message: userInput },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", message: data.response },
      ]);
    } catch (error) {
      setChatMessages((prevMessages) => [
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
        {/* Animated Heading */}
        {console.log(chatMessages.length)}
        {chatMessages.length === 0 && (
          <div class="wrapper">
          <div class="typing-demo">
            Start Chatting with AI!
          </div>
      </div>
        
        )}

        {/* Chat History */}
        {chatMessages.length > 0 && (
          <div className="animate-fadeout">
            {console.log("chatMessages")}
            <ChatHistory chatHistory={chatMessages} />
          </div>
        )}
      </div>

      {/* Show Loading Spinner */}
      <Loading isLoading={isLoading} />

      {/* User input */}
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

export default Chat;