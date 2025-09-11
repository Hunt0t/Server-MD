
import React from 'react';


export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-100 py-20 px-4 sm:px-8 md:px-16 flex flex-col items-center text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
          <path fill="#a5b4fc" fillOpacity="0.3" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
      </div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <h1 className="text-4xl  pt-20 sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 drop-shadow-lg">
          Best Quality 
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 font-medium">
          Buy, and discover valuable data securely and easily.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/register" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition">
            Get Started
          </a>
        
        </div>
      </div>
      <div className="relative z-10 mt-12 w-full max-w-3xl mx-auto flex justify-center">
       
      </div>
    </section>
  );
}
