"use client";

import { useChat } from "ai/react";
import { FormEvent, useEffect, useRef } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full pt-0 pb-24 lg:pt-24 items-center">
      {/* Messages */}
      <div className="flex flex-col space-y-4 w-full px-4 ">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 text-md md:text-base lg:text-lg ${
                m.role === "user"
                  ? "bg-[linear-gradient(90deg,_rgba(38,_198,_255,_0.7),_rgba(72,_225,_174,_0.7))] text-white shadow-md hover:bg-[linear-gradient(90deg,_rgba(38,_198,_255,_0.5),_rgba(72,_225,_174,_0.5))] transition-all duration-200 me-4 md:me-14 ms-auto"
                  : "bg-gray-700 text-gray-200 shadow-lg transform me-auto ms-4 md:ms-14"
              } max-w-[80%] sm:max-w-[75%] lg:max-w-[50%]`}
            >
              {formatMessageContent(m.content)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center space-x-2">
          <div className="loader"></div>{" "}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e: FormEvent) => handleSubmit(e)}
        className="fixed bottom-0 w-full max-w-md px-4 pb-4 flex mb-5"
      >
        <div className="relative w-full">
          <input
            className="w-full p-3 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            disabled={isLoading}
          />

          {/* Stop button */}
          {isLoading && (
            <button
              type="button"
              onClick={() => stop()}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-3 py-2 rounded-md"
            >
              X
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function formatMessageContent(content: string) {
  return (
    <div className="space-y-4">
      {/* Split content into lines or paragraphs */}
      {content.split("\n").map((paragraph, index) => {
        // Detect if the paragraph starts with a number followed by a dot (e.g., "1.")
        if (/^\d+\.\s/.test(paragraph)) {
          const [title, ...textParts] = paragraph.split(": ");
          return (
            <div key={index}>
              <p className="font-bold">{title.trim()}</p>
              <p>{textParts.join(": ").trim()}</p>
            </div>
          );
        }
        return <p key={index}>{paragraph}</p>;
      })}
    </div>
  );
}
