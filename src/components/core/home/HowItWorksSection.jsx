// how it works steps
const steps = [
  {
    title: 'Select Algorithm',
    desc: 'Choose a scheduling or memory management algorithm to simulate.',
    num: 1,
  },
  {
    title: 'Input Data',
    desc: 'Enter process or memory details as required by the selected algorithm.',
    num: 2,
  },
  {
    title: 'View Visualization',
    desc: 'See dynamic Gantt charts or memory diagrams for your input.',
    num: 3,
  },
  {
    title: 'Compare Metrics',
    desc: 'Analyze performance metrics and compare with other algorithms.',
    num: 4,
  },
];

export default function HowItWorksSection() {
  return (
    <section id='how-it-works' className="py-16 px-4 bg-gradient-to-b from-[#232046] to-[#18122B]">
      {/* heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-200 mb-10">
        How It Works
      </h2>

      {/* steps */}
      <div className="flex flex-wrap lg:flex-nowrap flex-col md:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center bg-[#393053] rounded-xl p-6 w-full md:w-1/4 shadow-lg">
            <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex flex-col items-center justify-center text-2xl font-bold mb-4">
              <span>{step.num}</span>
            </div>

            <h3 className="text-lg font-semibold text-purple-100 mb-2 text-center">
              {step.title}
            </h3>
            <p className="text-gray-300 text-center">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 