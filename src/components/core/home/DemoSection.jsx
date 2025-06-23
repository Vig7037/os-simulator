import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

export default function DemoSection() {
  
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Close modal on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setShowModal(false);
  };

  return (
    <section className="py-16 px-4 bg-[#232046] flex flex-col items-center">
      {/* heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-200 mb-8">
        User-Friendly Interface
      </h2>

      <div className="bg-[#393053] rounded-xl p-8 shadow-lg max-w-xl w-full flex flex-col items-center">
        <p className="text-lg text-gray-300 mb-4 text-center">
          Our platform is designed for ease of use:
        </p>
        
        {/* list */}
        <ul className="text-gray-200 text-left space-y-2 mb-4">
          <li>• Intuitive process and memory input forms</li>
          <li>• No hidden fees or sign-ups required</li>
          <li>• Accessible from any device</li>
        </ul>

        {/* buttons */}
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/simulator')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all cursor-pointer"
          >
            Try Now
          </button>

          <button 
            onClick={() => setShowModal(true)}
            className="bg-transparent border border-purple-400 hover:bg-purple-800 text-purple-200 font-semibold py-2 px-6 rounded-lg transition-all cursor-pointer"
          >
            See Demo
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all"
          onClick={handleBackdropClick}
        >
          <div className="bg-[#232046] rounded-xl shadow-2xl p-6 max-w-2xl w-full relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-white text-2xl hover:text-purple-400 transition-colors"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/a2csXtfHIn4?si=scryU0_X6y7tq6rR"
                title="Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-72 md:h-96 rounded-lg border-0"
              ></iframe>
            </div>
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
            .animate-fadeIn { animation: fadeIn 0.2s cubic-bezier(0.4,0,0.2,1) both; }
          `}</style>
        </div>
      )}
    </section>
  );
} 