import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <span className="font-bold text-xl">ProMaxs</span>
          <p className="text-sm mt-1 text-blue-100">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <a href="/terms-condition" className="hover:underline text-blue-100">Terms & Conditions</a>
          <a href="/rules" className="hover:underline text-blue-100">Rules</a>
          
        </div>
      </div>
    </footer>
  );
}
