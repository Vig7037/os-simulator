import React from 'react';

export default function FooterSection() {
  return (
    <footer className="py-8 px-4 bg-[#18122B] text-gray-400 flex flex-col items-center">
      <div className="mb-2">&copy; {new Date().getFullYear()} OS Visualizer. All rights reserved.</div>
      <div className="flex gap-6 text-sm">
        <a href="#" className="hover:text-purple-300">Home</a>
        <a href="#" className="hover:text-purple-300">Docs</a>
        <a href="#" className="hover:text-purple-300">About</a>
        <a href="#" className="hover:text-purple-300">Contact</a>
      </div>
    </footer>
  );
} 