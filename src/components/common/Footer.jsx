import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="bg-[#18122B] border-t border-[#393053] text-white py-8"
  >
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

      <div>
        <p className='text-center tracking-wide'>
          Made by 
          <span className='font-bold'> 4 Outliers</span>
        </p>
        <p className="mt-1 text-sm tracking-wide text-center text-[#907cd8]">

          &copy; {new Date().getFullYear()} TimeSlice. All rights reserved.
        </p>
      </div>

      {/* quick navigation links */}
      <div className="flex space-x-6">
        <Link to="/" className="hover:text-indigo-400 transition-colors duration-200">Home</Link>
        <Link to="/simulator" className="hover:text-indigo-400 transition-colors duration-200">Simulator</Link>
        <Link to="/about" className="hover:text-indigo-400 transition-colors duration-200">About</Link>
      </div>
    </div>
  </motion.footer>
);

export default Footer; 