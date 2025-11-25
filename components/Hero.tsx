import React from 'react';
import { Compass, Map, Sun } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-majorelle text-white overflow-hidden shadow-xl rounded-b-[3rem]">
      {/* Abstract Pattern Background - mimicking Zellige tiles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="zellige" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="white" />
            <rect x="20" y="20" width="20" height="20" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#zellige)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center text-center z-10">
        <div className="flex items-center space-x-2 mb-4 text-gold">
          <Sun className="w-8 h-8 animate-spin-slow" />
          <span className="uppercase tracking-widest text-sm font-semibold">Welcome to Morocco</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
          Atlas Voyager
        </h1>
        
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-10 font-light">
          Your personal AI assistant for crafting unforgettable journeys through the majestic landscapes, ancient medinas, and vibrant culture of Morocco.
        </p>

        <div className="flex space-x-8 text-blue-200">
          <div className="flex flex-col items-center">
            <Compass className="w-6 h-6 mb-2" />
            <span className="text-xs uppercase tracking-wider">Tailored Plans</span>
          </div>
          <div className="flex flex-col items-center">
            <Map className="w-6 h-6 mb-2" />
            <span className="text-xs uppercase tracking-wider">Local Experts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;