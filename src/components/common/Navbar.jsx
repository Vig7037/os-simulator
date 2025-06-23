import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/learn', label: 'Learn' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/about', label: 'About' },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Use different background for home and simulator
  const isHome = location.pathname === '/';
  const isSimulator = location.pathname.startsWith('/simulator');
  const bg = isHome
    ? 'bg-gradient-to-r from-[#18122B] to-[#393053]' // Home theme
    : isSimulator
    ? 'bg-[#232946]' // Simulator theme
    : 'bg-[#232946]'; // Default dark

  return (
    <nav className={`sticky top-0 z-50 ${bg} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0 text-xl md:text-2xl font-bold tracking-wider rmd:tracking-widest text-white select-none">
          TimeSlice
        </div>

        <div className='flex gap-4'>
          {/* github repo link */}
          <div className='flex items-center'> 
            <a
              href="https://github.com/PradeepPs04/TimeSlice-OS-Algorithms-Simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-indigo-300 transition-colors duration-200"
              aria-label="GitHub Repository"
            >
              <FaGithub size={28}/>
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 rounded-md text-lg font-medium transition-all duration-200
                  ${location.pathname === link.to
                    ? 'text-indigo-400 bg-white/10'
                    : 'text-white hover:text-indigo-300 hover:bg-white/10'}
                  after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full
                `}
                style={{ overflow: 'hidden' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>


          {/* Hamburger Icon for Mobile */}
          <button
            className="md:hidden flex items-center justify-center text-white focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>


      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 flex md:hidden">
          <div className="bg-[#232946] w-64 h-full shadow-lg flex flex-col py-8 px-6 animate-slideInLeft">
            {/* close button */}
            <button
              className="self-end mb-8 text-white text-2xl focus:outline-none"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>

            {/* menu bar */}
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-3 rounded-md text-lg font-medium mb-2 transition-all duration-200
                  ${location.pathname === link.to
                    ? 'text-indigo-400 bg-white/10'
                    : 'text-white hover:text-indigo-300 hover:bg-white/10'}
                `}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {/* Clickable backdrop to close */}
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 