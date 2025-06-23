import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section id='hero-section' className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-b from-[#18122B] to-transparent">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-purple-300 drop-shadow-lg">
        Visualize & Compare OS Algorithms
      </h1>
      
      <p className="mt-8 text-lg md:text-2xl text-gray-300 max-w-2xl">
        An interactive platform to learn, simulate, and compare Operating System scheduling and memory management algorithms with dynamic visualizations and performance metrics.
      </p>
      
      {/* buttons */}
      <div className="mt-14 flex flex-wrap gap-4 justify-center">
        <button 
          onClick={() => navigate('/simulator')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all cursor-pointer"
        >
          Get Started
        </button>
        
        {/* TODO: onclick => scroll down to how it works section */}
        <button 
          className="bg-transparent border border-purple-400 hover:bg-purple-800 text-purple-200 font-semibold py-3 px-8 rounded-lg transition-all cursor-pointer"
        >
          <a href='#how-it-works'>Learn More</a>
        </button>
      </div>
    </section>
  );
} 