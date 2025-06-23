import { motion } from 'framer-motion';

// components
import HeroSection from '../components/core/home/HeroSection';
import FeaturesSection from '../components/core/home/FeaturesSection';
import HowItWorksSection from '../components/core/home/HowItWorksSection';
import DemoSection from '../components/core/home/DemoSection';
import CommunitySection from '../components/core/home/CommunitySection';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-[#18122B] to-[#393053] min-h-screen text-white">
      <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <HeroSection />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
        <FeaturesSection />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}>
        <HowItWorksSection />
      </motion.div>

      {/* <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}>
        <StatisticsSection />
      </motion.div> */}

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.5 }}>
        <DemoSection />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.8 }}>
        <CommunitySection />
      </motion.div>

    </div>
  );
} 