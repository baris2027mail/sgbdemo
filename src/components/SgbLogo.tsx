import React from 'react';

interface SgbLogoProps {
  className?: string;
  size?: number;
}

export const SgbLogo: React.FC<SgbLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-sky-500/20 p-1.5 shadow-inner ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-white drop-shadow-sm"
      >
        {/* Diamond / Origami Crest Shape */}
        <path
          d="M24 4L38 18L24 24L10 18L24 4Z"
          fill="currentColor"
          fillOpacity="0.95"
        />
        <path
          d="M38 18L44 24L38 30L24 24L38 18Z"
          fill="currentColor"
          fillOpacity="0.8"
        />
        <path
          d="M24 24L38 30L24 44L10 30L24 24Z"
          fill="currentColor"
          fillOpacity="0.95"
        />
        <path
          d="M10 18L24 24L10 30L4 24L10 18Z"
          fill="currentColor"
          fillOpacity="0.8"
        />
        {/* Center core highlight */}
        <circle cx="24" cy="24" r="3.5" fill="#0284c7" />
        <circle cx="24" cy="24" r="1.5" fill="white" />
      </svg>
    </div>
  );
};
