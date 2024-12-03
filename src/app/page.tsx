import Chat from "./components/chat";
export const runtime = "edge";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <div className="text-center mt-5 mb-8 lg:mb-0">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
          OliBot
        </h1>
        <p className="mt-4 text-lg md:text-xl lg:text-2xl text-gray-300">
          Chat with an AI model in real-time.
        </p>
      </div>
      <Chat />
    </div>
  );
}
