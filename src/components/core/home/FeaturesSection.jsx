// icons
import { FaCogs, FaChartBar, FaStopwatch, FaBalanceScale } from 'react-icons/fa';

// features
const features = [
  {
    title: 'Algorithm Selection',
    desc: 'Choose from various OS scheduling and memory management algorithms to simulate and analyze.',
    icon: <FaCogs className="text-4xl mb-4 text-purple-400" />,
  },
  {
    title: 'Visualization Engine',
    desc: 'Dynamic Gantt charts and memory diagrams powered by D3.js/Chart.js for real-time insights.',
    icon: <FaChartBar className="text-4xl mb-4 text-purple-400" />,
  },
  {
    title: 'Performance Metrics',
    desc: 'Instantly view waiting time, turnaround time, and efficiency for each algorithm.',
    icon: <FaStopwatch className="text-4xl mb-4 text-purple-400" />,
  },
  {
    title: 'Comparison Tools',
    desc: 'Compare results across algorithms to understand strengths and weaknesses.',
    icon: <FaBalanceScale className="text-4xl mb-4 text-purple-400" />,
  },
];

export default function FeaturesSection() {
  return (
    <section id='features-section' className="py-16 px-4 bg-[#232046]">
      {/* heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-200 mb-10">
        Key Features
      </h2>

      {/* features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((item, idx) => (
          <div key={idx} className="bg-[#393053] rounded-xl p-8 flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
            <div>{item.icon}</div>
            <h3 className="text-xl font-semibold text-purple-100 mb-2">{item.title}</h3>
            <p className="text-gray-300 text-center">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 