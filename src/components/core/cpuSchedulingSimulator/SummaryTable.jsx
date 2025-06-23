import { useEffect, useState } from "react";

// utils
import { calculateProcessTimes } from '../../../utils/schedulingAlgorithms';

function SummaryTable({ processes, showPriority }) {
  // if no processes are available
  if (!processes || processes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No processes to display
      </div>
    )
  }

  const [totalTimes, setTotalTimes] = useState([]);
  const [averageTimes, setAverageTimes] = useState([]);

  // calculate total & average stats of processes on first render
  useEffect(() => {
    const getTotalTimes = () => {
      const {total, avg} = calculateProcessTimes(processes);
      setTotalTimes(total);
      setAverageTimes(avg);
    }

    getTotalTimes();
  }, [processes]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#FAF3F3]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Process ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Arrival Time
            </th>
            {showPriority && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Burst Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Completion Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Turnaround Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Waiting Time
            </th>
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {
            processes.map((process, idx) => (
              <tr 
                key={process.process_id}
                className={`${idx % 2 !== 0 && 'bg-gray-50'} hover:bg-gray-100 transition-all duration-200`}
              >
                {/* id */}
                <td style={{backgroundColor: `${process.color}`}} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  P{process.process_id}
                </td>

                {/* arrival time */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.arrival_time}
                </td>

                {/* priority */}
                {showPriority && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {process.priority !== undefined ? process.priority : '-'}
                  </td>
                )}

                {/* burst time */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.burst_time}
                </td>

                {/* completion time */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.completionTime !== '-' ? process.completionTime : '-'}
                </td>
                
                {/* turnaround time */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.turnaroundTime !== '-' ? process.turnaroundTime : '-'}
                </td>
                
                {/* waiting time */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.waitingTime !== '-' ? process.waitingTime : '-'}
                </td>

              </tr>
            ))
          }
        </tbody>
        
      </table>

    </div>
  )
}

export default SummaryTable 