import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'stacked' | 'icon-only';
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customIconSize?: string;
  showTagline?: boolean;
}

/**
 * Infovisory Logo Component
 * 
 * Renders the official Infovisory Chartered Accountants brand logo.
 * Combines high-fidelity vector graphics (SVG) with clean Tailwind typography.
 * Implements exact color schema and typography matching the official logo:
 * - INFOVISORY: Deep Blue serif style text
 * - CHARTERED ACCOUNTANTS: Muted Teal tracking-widest text
 * - INSIGHT • INTENT • IMPACT: Neutral tracking-wider sub-tagline
 */
export default function Logo({
  variant = 'horizontal',
  className = '',
  iconSize = 'md',
  customIconSize = '',
  showTagline = true,
}: LogoProps) {
  
  // Icon Size Map
  const sizeClasses = {
    sm: 'w-7.5 h-7.5',
    md: 'w-8 h-8 lg:w-7.5 lg:h-7.5 xl:w-10 xl:h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32',
    custom: customIconSize
  };

  const selectedIconSize = sizeClasses[iconSize];

  // Render high-fidelity SVG Icon
  const renderIcon = () => (
    <div className={`relative flex-shrink-0 transition-transform duration-500 group-hover:rotate-[8deg] ${selectedIconSize}`}>
      <svg 
        viewBox="0 0 120 120" 
        className="w-full h-full" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Gradients for the pages to replicate the exact sleek corporate depth */}
          <linearGradient id="logo-wing-grad-1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0B2F64" />
            <stop offset="60%" stopColor="#1E4E8C" />
            <stop offset="100%" stopColor="#2575FC" />
          </linearGradient>
          <linearGradient id="logo-wing-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#081E3F" />
            <stop offset="65%" stopColor="#123B70" />
            <stop offset="100%" stopColor="#1E5CBA" />
          </linearGradient>
        </defs>

        {/* Left-aligned sweeping crescent border holding the fins */}
        <path 
          d="M 85,32 C 93,42 96,56 92,70 C 86,88 68,98 50,96 C 30,94 16,77 18,58 C 20,38 35,22 55,20 C 67,19 78,24 84,32" 
          stroke="#0b2c5c" 
          strokeWidth="7" 
          strokeLinecap="round" 
          fill="none" 
        />

        {/* Central fanning fins (representing book pages/growth sails) */}
        {/* Fin 1 (Steepest, left wing) */}
        <path 
          d="M 48,78 C 52,62 61,42 74,27 C 72,44 62,65 48,78 Z" 
          fill="url(#logo-wing-grad-1)" 
        />

        {/* Fin 2 (Upper middle wing) */}
        <path 
          d="M 48,78 C 56,66 70,48 82,36 C 78,51 66,68 48,78 Z" 
          fill="url(#logo-wing-grad-2)" 
        />

        {/* Fin 3 (Lower middle wing) */}
        <path 
          d="M 48,78 C 60,70 76,56 87,46 C 81,59 68,72 48,78 Z" 
          fill="url(#logo-wing-grad-1)" 
        />

        {/* Fin 4 (Rightmost wing) */}
        <path 
          d="M 48,78 C 64,73 83,65 91,58 C 83,69 68,77 48,78 Z" 
          fill="url(#logo-wing-grad-2)" 
        />
      </svg>
    </div>
  );

  // Horizontal variant (Ideal for Navbar header)
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 lg:gap-2 xl:gap-3 group ${className}`} id="brand-logo-horizontal">
        {renderIcon()}
        
        <div className="flex flex-col select-none justify-center">
          {/* Brand Name "INFOVISORY" */}
          <span className="text-base lg:text-[14.5px] xl:text-xl font-serif font-black text-[#0d2c5c] tracking-[0.03em] uppercase leading-[0.95]">
            Infovisory
          </span>
          
          {/* Subtitle "CHARTERED ACCOUNTANTS" */}
          <span className="text-[6.5px] lg:text-[5.5px] xl:text-[8.5px] font-sans font-extrabold text-[#108573] tracking-[0.14em] uppercase mt-1 leading-none">
            Chartered Accountants
          </span>
          
          {/* Optional Tagline "INSIGHT • INTENT • IMPACT" */}
          {showTagline && (
            <span className="hidden xl:block text-[5.5px] lg:text-[6.5px] xl:text-[7px] font-sans font-bold text-[#556885] tracking-[0.15em] uppercase mt-1 leading-none opacity-95">
              Insight &bull; Intent &bull; Impact
            </span>
          )}
        </div>
      </div>
    );
  }

  // Stacked variant (Ideal for large centered features, splash screens or footer highlights)
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center group ${className}`} id="brand-logo-stacked">
        {renderIcon()}
        
        <div className="flex flex-col mt-4 select-none">
          {/* Brand Name "INFOVISORY" */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0d2c5c] tracking-[0.05em] uppercase leading-none">
            Infovisory
          </h2>
          
          {/* Subtitle "CHARTERED ACCOUNTANTS" */}
          <h3 className="text-xs sm:text-sm md:text-base font-sans font-extrabold text-[#108573] tracking-[0.24em] uppercase mt-2.5 leading-none">
            Chartered Accountants
          </h3>
          
          {/* Optional Tagline "INSIGHT • INTENT • IMPACT" */}
          {showTagline && (
            <p className="text-[10px] sm:text-xs md:text-sm font-sans font-medium text-[#556885] tracking-[0.3em] uppercase mt-3.5 leading-none">
              Insight &bull; Intent &bull; Impact
            </p>
          )}
        </div>
      </div>
    );
  }

  // Icon-only variant
  return renderIcon();
}
