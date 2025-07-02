import React from "react";

const AuthImagePattern = ({ title, subtitle }) => {
  const colors = [
    "from-pink-400 to-purple-500",
    "from-yellow-300 to-pink-400",
    "from-blue-400 to-teal-300",
    "from-green-400 to-lime-300",
    "from-indigo-400 to-violet-500",
    "from-red-400 to-yellow-400",
    "from-rose-400 to-pink-500",
    "from-cyan-400 to-blue-500",
    "from-amber-400 to-orange-500",
  ];

  return (
    <div className="hidden lg:flex items-center justify-center min-h-screen w-full ">
      <div className="max-w-md w-full text-center backdrop-blur-xl bg-white/5 p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Glow animated border effect */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 blur-xl opacity-10 animate-pulse pointer-events-none"></div>

        {/* Color Grid */}
        <div className="grid grid-cols-3 grid-rows-3 gap-4 mb-10 z-10 relative">
          {colors.map((color, i) => (
            <div
              key={i}
              className={`
                aspect-square rounded-xl 
                bg-gradient-to-br ${color}
                animate-pulse 
                hover:scale-105 
                hover:shadow-xl
                transition-all duration-500 ease-in-out
              `}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        {/* Heading & Subtitle */}
        <h2 className="text-3xl font-extrabold text-white drop-shadow-md mb-3">
          {title}
        </h2>
        <p className="text-gray-300 text-base leading-relaxed tracking-wide">
          {subtitle}
        </p>

        {/* Optional CTA Button */}
        {/* <button className="mt-6 px-5 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition">
          Learn More
        </button> */}
      </div>
    </div>
  );
};

export default AuthImagePattern;
