import { motion } from 'framer-motion';

// icons
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

const team = [
  { 
    name: 'Sagar Singh Bhandari',
    img: './images/sagar.jpg',
    instagram: 'https://www.instagram.com/_sagar.rr/',
    linkedin: 'https://www.linkedin.com/in/sagar-singh-bhandari-4176a328b/',
  },
  { 
    name: 'Pradeep Singh',
    img: './images/pradeep.jpg',
    instagram: 'https://www.instagram.com/ps_prad_eep/',
    linkedin: 'https://www.linkedin.com/in/pradeep-singh-b300362b3/',
  },
  { 
    name: 'Rakhi Rawat',
    img: './images/rakhi.jpg',
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
  },
  { 
    name: 'Vighnesh Singhal',
    img: './images/vighnesh.jpg',
    instagram: 'https://www.instagram.com/vighneshsinghal/',
    linkedin: 'https://www.linkedin.com/in/vig7037/',
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18122B] to-[#393053] text-white flex flex-col items-center py-12 px-4 transition-colors duration-700">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">About Us</h1>
        <p className="text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto">
          We are a passionate team dedicated to building modern, interactive, and educational web applications for everyone.
        </p>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-16"
      >
        {team.map((member, idx) => (
          <motion.div
            key={member.name}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, type: 'spring' } },
            }}
            className="bg-[#232946] rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          >
            <img
              src={member.img}
              alt={member.name}
              className="w-24 h-24 rounded-full mb-4 border-4 border-indigo-400 shadow-md object-cover"
            />
            <h3 className="text-xl font-bold mb-1 text-indigo-200">{member.name}</h3>
            <div className="flex space-x-4 mt-2">
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-500 transition-colors duration-200 text-2xl"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500 transition-colors duration-200 text-2xl"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mission & Vision Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-300">Our Mission</h2>
        <p className="mb-8 text-indigo-100">
          To empower learners and developers by providing intuitive, visually engaging, and technically robust tools for understanding complex concepts.
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-300">Our Vision</h2>
        <p className="text-indigo-100">
          To be a leading platform for interactive learning and innovation, making technology accessible and enjoyable for all.
        </p>
      </motion.div>
    </div>
  );
};

export default AboutUs; 