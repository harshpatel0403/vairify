import React, { useState } from 'react';

export default function TextContainer({ text }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    // Create a textarea element to temporarily hold the text
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // Append the textarea to the document
    document.body.appendChild(textarea);

    // Select the text in the textarea
    textarea.select();

    try {
      // Execute the copy command
      document.execCommand('copy');
      setIsCopied(true);

      // Reset isCopied to false after a delay (e.g., 2 seconds)
      setTimeout(() => {
        setIsCopied(false);
      }, 2000); // 2000 milliseconds (2 seconds)
    } catch (error) {
      console.error('Unable to copy:', error);
    } finally {
      // Remove the textarea
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="custom-text-container py-2 px-4 text-custom-7 flex flex-row justify-between">
      <span>{text}</span>
      <button onClick={handleCopyClick}>
        {isCopied ? 'Copied!' : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
