import React from 'react';

interface LogoProps {
  isAdmin?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ isAdmin = false, className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Logo */}
      <div className="relative">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200 hover:scale-105"
        >
          {/* Main building shape */}
          <rect
            x="4"
            y="12"
            width="24"
            height="16"
            rx="2"
            fill={isAdmin ? "#374151" : "#1f2937"}
            stroke={isAdmin ? "#6b7280" : "#374151"}
            strokeWidth="1"
          />
          
          {/* Windows */}
          <rect
            x="7"
            y="15"
            width="3"
            height="3"
            rx="0.5"
            fill={isAdmin ? "#9ca3af" : "#6b7280"}
          />
          <rect
            x="12"
            y="15"
            width="3"
            height="3"
            rx="0.5"
            fill={isAdmin ? "#9ca3af" : "#6b7280"}
          />
          <rect
            x="17"
            y="15"
            width="3"
            height="3"
            rx="0.5"
            fill={isAdmin ? "#9ca3af" : "#6b7280"}
          />
          <rect
            x="22"
            y="15"
            width="3"
            height="3"
            rx="0.5"
            fill={isAdmin ? "#9ca3af" : "#6b7280"}
          />
          
          {/* Second row of windows */}
          <rect
            x="7"
            y="20"
            width="3"
            height="3"
            rx="0.5"
            fill={isAdmin ? "#9ca3af" : "#6b7280"}
          />
          <rect
            x="12"
            y="20"
            width="3"
            height="3"
            rx="0.5"
            fill={isAdmin ? "#9ca3af" : "#6b7280"}
          />
          <rect
            x="17"
            y="20"
            width="3"
            height="3"
            rx="0.5"
            fill={isAdmin ? "#9ca3af" : "#6b7280"}
          />
          <rect
            x="22"
            y="20"
            width="3"
            height="3"
            rx="0.5"
            fill={isAdmin ? "#9ca3af" : "#6b7280"}
          />
          
          {/* Door */}
          <rect
            x="14"
            y="22"
            width="4"
            height="6"
            rx="2"
            fill={isAdmin ? "#6b7280" : "#374151"}
          />
          
          {/* Roof accent */}
          <path
            d="M2 12 L16 4 L30 12"
            stroke={isAdmin ? "#6b7280" : "#374151"}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Text */}
      <h1 className={`uppercase text-2xl font-bold tracking-wide transition-colors duration-200 ${
        isAdmin 
          ? "text-gray-800" 
          : "text-gray-900"
      }`}>
        Urban
      </h1>
    </div>
  );
};

export default Logo;
