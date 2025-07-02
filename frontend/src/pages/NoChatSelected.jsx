import { MessageSquare, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

const typingTexts = [
  "Start a new conversation...",
  "No chat selected yet.",
  "Choose someone to chat with!",
];

const NoChatSelected = () => {
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (charIndex < typingTexts[textIndex].length) {
        setCurrentText((prev) => prev + typingTexts[textIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setCharIndex(0);
          setCurrentText("");
          setTextIndex((prev) => (prev + 1) % typingTexts.length);
        }, 1500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [charIndex, textIndex]);

  return (
  <div className="hidden sm:flex w-full h-full items-center justify-center bg-base-100 px-6 py-16">
  <div className="max-w-xl w-full flex flex-col items-center text-center gap-10">
    <div className="relative w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center shadow-xl ring-4 ring-primary/20">
      <MessageSquare className="w-10 h-10 text-primary drop-shadow-lg animate-bounce" />
      <div className="absolute -inset-1 bg-primary/20 rounded-3xl blur-xl opacity-20 animate-ping" />
    </div>

    <div className="text-xl font-mono text-primary min-h-[32px]">
      {currentText}
      <span className="animate-pulse">|</span>
    </div>

    <div className="bg-base-200/40 backdrop-blur-md rounded-2xl shadow-lg p-6 w-full space-y-4 border border-base-300">
      <h2 className="text-3xl font-bold">Welcome to <span className="text-primary">Chate-List</span>!</h2>
      <p className="text-base-content/70">
        Select a user from the sidebar to start your first conversation. Your messages will appear here.
      </p>
      <ul className="list-disc list-inside text-left text-base-content/60 space-y-1">
        <li>Click on a user to open the chat.</li>
        <li>Type and send messages instantly.</li>
        <li>All conversations are saved securely.</li>
      </ul>
    </div>

    <button className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition duration-200 shadow-md">
      <UserPlus className="w-5 h-5" />
      Start New Chat
    </button>

    <p className="text-sm text-base-content/50">
      Don’t be shy — say hello 👋
    </p>
  </div>
</div>


  );
};

export default NoChatSelected;
