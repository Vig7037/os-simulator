import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const getPieData = (processes, field, label) => ({
  labels: processes.map(p => `P${p.process_id}`),
  datasets: [
    {
      label,
      data: processes.map(p => p[field]),
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E42', '#EF4444', '#A78BFA', '#F472B6', '#FBBF24', '#6366F1', '#34D399', '#F87171', '#60A5FA', '#FCD34D', '#6EE7B7', '#C084FC', '#FCA5A5',
      ],
      borderWidth: 1,
    },
  ],
});

const DataVisualization = ({ processes }) => {
  if (!processes || processes.length === 0) {
    return <div className="text-center text-gray-500">No data to visualize</div>;
  }

  // Pie chart data
  const waitingPie = getPieData(processes, 'waitingTime', 'Waiting Time');
  const tatPie = getPieData(processes, 'turnaroundTime', 'Turnaround Time');

  // Check if all waiting times or turnaround times are zero
  const allWaitingZero = processes.every(p => (p.waitingTime || 0) === 0);
  const allTATZero = processes.every(p => (p.turnaroundTime || 0) === 0);

  // Stats
  const totalCPUTime = Math.max(...processes.map(p => p.completionTime || 0), 0);
  const cpuTimeUsed = processes.reduce((sum, p) => sum + (p.burst_time || 0), 0);
  const avgWaiting = (processes.reduce((sum, p) => sum + (p.waitingTime || 0), 0) / processes.length).toFixed(2);
  const avgTAT = (processes.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0) / processes.length).toFixed(2);
  const cpuUtil = totalCPUTime > 0 ? ((cpuTimeUsed / totalCPUTime) * 100).toFixed(2) : '0.00';

  return (
    <div>
      {/* pie charts */}
      <div className="flex flex-col md:flex-row justify-center lg:justify-between items-center gap-16 mb-8">

        {/* waiting time chart */}
        <div className="w-72 h-72 shadow rounded-lg p-4">
          {/* if all waiting times are zero */}
          {allWaitingZero ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-2xl text-gray-400">0</div>
              <div className="text-center mt-2 font-semibold text-gray-500">No waiting time for any process</div>
            </div>
          ) : (
            // display waiting pie chart
            <>
              <Pie data={waitingPie} />
              <div className="text-center mt-6 font-semibold text-gray-700">Waiting Time</div>
            </>
          )}
        </div>
        
        {/* turnaround time chart */}
        <div className="w-72 h-72 shadow rounded-lg p-4">
          {/* if all turn around times are zero */}
          {allTATZero ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-2xl text-gray-400">0</div>
              <div className="text-center mt-2 font-semibold text-gray-500">No turnaround time for any process</div>
            </div>
          ) : (
            // display turnaround time pie chart 
            <>
              <Pie data={tatPie} />
              <div className="text-center mt-6 font-semibold text-gray-700">Turnaround Time</div>
            </>
          )}
        </div>

      </div>
      
      {/* cpu utilization, avg. waiting & avg. turnaround */}
      <div className="flex flex-col items-center gap-2 mt-14 lg:mt-4">
        <div className="text-lg font-semibold text-gray-800">CPU Utilization: <span className="text-indigo-600">{cpuUtil}%</span></div>
        <div className="text-lg font-semibold text-gray-800">Average Waiting Time: <span className="text-indigo-600">{avgWaiting}</span></div>
        <div className="text-lg font-semibold text-gray-800">Average Turnaround Time: <span className="text-indigo-600">{avgTAT}</span></div>
      </div>
    </div>
  );
};

export default DataVisualization; 