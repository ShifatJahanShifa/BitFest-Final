import React from 'react';

const ChatBubble = ({ type, message }) => {
  const isUser = type === 'user';
  const alignmentClass = isUser ? 'justify-end' : 'justify-start';
  const bubbleClass = isUser
    ? 'bg-blue-500 text-white rounded-br-xl'
    : 'bg-gray-300 text-black rounded-bl-xl';

  return (
    <div className={`flex ${alignmentClass} gap-2.5 py-2`}>
      <div className={`flex flex-col p-4 border-gray-200 ${bubbleClass} rounded-xl max-w-[320px]`}>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {isUser ? 'User' : 'AI'}
          </span>
        </div>
        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message}</p>
      </div>
    </div>
  );
};

export default ChatBubble;
