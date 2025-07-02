import { useEffect, useState, useRef } from "react";
import { THEME_COLORS } from "../consonent/index.js";
import { useTHEME_COLORStore } from "../store/useThemeStore.js";
import { Send, Smile, PhoneCall } from "lucide-react";

const CHAT_FEATURES = [
  { icon: <Smile className="text-primary" size={20} />, label: "Emojis" },
  { icon: <PhoneCall className="text-secondary" size={20} />, label: "Voice Call" },
  { icon: <Send className="text-accent" size={20} />, label: "Fast Messaging" },
];

const SettingsPage = () => {
  const { theme, setTheme } = useTHEME_COLORStore();
  const [emojiRain, setEmojiRain] = useState(false);
  const [rainColors, setRainColors] = useState([]);
  const [messages, setMessages] = useState([
    { id: 1, content: "Hey! How's it going?", isSent: false },
    { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
  ]);
  const [inputText, setInputText] = useState("");

  const scrollRef = useRef(null);  

  useEffect(() => {
    const messagesList = [
      "Hey there! 👋",
      "Welcome to the preview chat.",
      "We’re just testing auto messages.",
      "Hope you like the theme!",
      "Enjoy your chat experience 😄",
    ];
    let msgIndex = 0;

    const typeMessage = (message) => {
      let charIndex = 0;
      setInputText("");  

      const typingInterval = setInterval(() => {
        setInputText((prev) => prev + message[charIndex]);
        charIndex++;

        if (charIndex >= message.length) {
          clearInterval(typingInterval);

          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                content: message,
                isSent: true,
              },
            ]);
            setInputText("");
          }, 500);
        }
      }, 100);
    };

    const loop = setInterval(() => {
      typeMessage(messagesList[msgIndex]);
      msgIndex = (msgIndex + 1) % messagesList.length; 
    }, 4000);

    return () => clearInterval(loop);
  }, []);


   
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

 
  useEffect(() => {
    if (emojiRain) {
      const selectedColors = Object.values(THEME_COLORS[theme]);
      setRainColors(selectedColors);
      const timeout = setTimeout(() => setEmojiRain(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [emojiRain, theme]);

  return (
    <div className="min-h-screen container mx-auto px-4 pt-24 max-w-6xl relative overflow-hidden">
      {emojiRain && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 100 }).map((_, idx) => (
            <div
              key={idx}
              className="absolute w-3 h-3 rounded-full animate-slide-burst"
              style={{
                top: "50%",
                left: "50%",
                backgroundColor: rainColors[Math.floor(Math.random() * rainColors.length)],
                animationDelay: `${Math.random() * 1.5}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      <style>
        {`
          @keyframes slide-burst {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            50% {
              transform: translate(
                calc(-50% + ${Math.random() * 300 - 150}px),
                calc(-50% + ${Math.random() * 300 - 150}px))
                scale(1.4);
              opacity: 0.8;
            }
            100% {
              transform: translate(
                calc(-50% + ${Math.random() * 800 - 400}px),
                calc(-50% + ${Math.random() * 800 - 400}px))
                scale(0.6);
              opacity: 0;
            }
          }
          .animate-slide-burst {
            animation: slide-burst 2.5s ease-out forwards;
          }
        `}
      </style>

      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Pick a Theme</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {Object.keys(THEME_COLORS).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTheme(t);
                setEmojiRain(true);
              }}
              className={`group p-2 rounded-xl bg-white border border-base-300 shadow-xl hover:shadow-2xl hover:scale-105 transition-transform duration-200 ease-in-out
              ${theme === t ? "ring-2 ring-primary scale-110" : ""}`}
            >
              <div className="w-full h-10 rounded-md overflow-hidden relative">
                <div
                  className="absolute inset-0 grid grid-cols-4 gap-px p-1"
                  style={{ backgroundColor: THEME_COLORS[t]["--color-base-100"] }}
                >
                  <div className="rounded" style={{ backgroundColor: THEME_COLORS[t]["--color-primary"] }}></div>
                  <div className="rounded" style={{ backgroundColor: THEME_COLORS[t]["--color-secondary"] }}></div>
                  <div className="rounded" style={{ backgroundColor: THEME_COLORS[t]["--color-accent"] }}></div>
                  <div className="rounded" style={{ backgroundColor: THEME_COLORS[t]["--color-neutral"] }}></div>
                </div>
              </div>
              <span className="block mt-2 text-xs font-medium text-center truncate">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Live Chat Preview</h3>
        <div className="rounded-3xl border border-base-300 bg-base-100 shadow-2xl overflow-hidden">
          <div className="p-6 bg-base-200">
            <div className="max-w-2xl mx-auto">
              <div className="bg-base-100 border border-base-300 rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-4 px-6 py-4 bg-base-100 border-b border-base-300">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg shadow">
                    S
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-base leading-none">Suraj Rajput</h4>
                    <p className="text-sm text-base-content/60">Online now</p>
                  </div>
                </div>

                <div
                  ref={scrollRef}
                  className="p-5 space-y-4 min-h-[240px] max-h-[240px] overflow-y-auto bg-gradient-to-b from-base-100 to-base-200"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex transition-all duration-300 ease-in-out ${msg.isSent ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`max-w-[75%] px-5 py-3 text-sm shadow-md rounded-xl relative ${msg.isSent
                            ? "bg-primary text-primary-content rounded-tr-none"
                            : "bg-base-200 text-base-content rounded-tl-none"
                          }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-[10px] mt-1 text-right opacity-60">12:00 PM</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 bg-base-100 border-t border-base-300">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="input input-bordered flex-1 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      value={inputText}
                      readOnly
                    />
                    <button
                      className="btn btn-primary h-10 min-h-0 px-4 shadow-md hover:scale-105 transition-transform"
                      onClick={() => setEmojiRain(true)}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-base-content/70 mt-4">
                Designed with ❤️ by Suraj Rajput
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
