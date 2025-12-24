import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: {
      text: "text-xl",
      icon: "w-6 h-6",
      padding: "p-2",
    },
    md: {
      text: "text-3xl",
      icon: "w-8 h-8",
      padding: "p-3",
    },
    lg: {
      text: "text-5xl",
      icon: "w-12 h-12",
      padding: "p-4",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      {/* Icon with glow effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
        <div className={`relative bg-gradient-to-br from-purple-600 to-pink-600 ${classes.padding} rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
          <svg
            className={`${classes.icon} text-white`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2a10 10 0 0110 10 10 10 0 01-10 10A10 10 0 012 12 10 10 0 0112 2m0 2a8 8 0 00-8 8 8 8 0 008 8 8 8 0 008-8 8 8 0 00-8-8m-2 2.5v11l7-5.5-7-5.5z" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <h1 className={`${classes.text} font-bold`}>
        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Podcast
        </span>
        <span className="text-gray-900">Daily</span>
      </h1>
    </div>
  );
}
