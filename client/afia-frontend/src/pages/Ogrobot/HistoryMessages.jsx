import React from "react";
import ReactMarkdown from "react-markdown";
import { FaUserAlt, FaRobot } from "react-icons/fa"; // User and Bot icons from react-icons
import { useScrollReveal } from "../../utils/useScrollReveal";
import "./ChatHistory.css";

const HistoryMessages = ({ chatHistory }) => {
  useScrollReveal();

  {console.log("chatHistory inside ", chatHistory)}

  // Transform the chat history to create separate entries for user and bot
  const transformedChatHistory = chatHistory.flatMap((entry) => [
    { type: "user", message: entry.message, timestamp: entry.timestamp },
    { type: "bot", message: entry.response, timestamp: entry.timestamp },
  ]);

  return (
    <div className="chat-container">
      {transformedChatHistory.map((message, index) => {
        const isUser = message.type === "user";
        const alignmentClass = isUser ? "justify-end" : "justify-start";

        return (
          <div
            key={index}
            className={`fade-in flex items-start rounded-lg m-4 ${alignmentClass}`}
          >
            {/* Icon for User or Bot */}
            {!isUser && (
              <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 rounded-full bg-slate-400 text-black">
                <FaRobot size={20} />
              </div>
            )}

            {/* Message */}
            <div
              className={`inline-flex ${
                isUser
                  ? "bg-gray-100 text-black p-2 rounded-bl-xl mr-[8px] text-right max-w-[1000px]"
                  : "max-w-[1000px] text-left ml-[8px] bg-gradient-to-r p-2 from-blue-300 via-blue-400 to-violet-400 text-black rounded-br-xl"
              }`}
            >
              <p className="text-sm font-normal py-1.5 text-gray-900">
                {isUser ? message.message : <ReactMarkdown>{message.message}</ReactMarkdown>}
              </p>
            </div>

            {isUser && (
              <div className="flex justify-center items-center w-10 h-10 rounded-full bg-slate-400 text-slate-600">
                <FaUserAlt size={20} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HistoryMessages;
