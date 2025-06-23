// icons
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";

const ProcessTable = ({ processes, onEdit, onDelete, showPriority }) => {
  if (processes.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No processes added yet
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* table header */}
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
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* table body content */}
          <tbody className="bg-white divide-y divide-gray-200">
            {processes.map((process, idx) => (
              <tr 
                key={process.process_id} 
                className={`${idx % 2 !== 0 && 'bg-gray-50'} hover:bg-gray-100 transition-all duration-200`}
              >
                {/* process id */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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

                {/* action buttons */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: process.color }}
                    />
                    <span className="text-sm text-gray-500">{process.color}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onEdit(process)}
                      className="text-indigo-600 hover:text-indigo-900 hover:scale-110 transition-all duration-300 cursor-pointer"
                    >
                      <CiEdit size={25}/>
                    </button>
                    <button
                      onClick={() => onDelete(process.process_id)}
                      className="text-red-600 hover:text-red-900 hover:scale-110 transition-all duration-300 cursor-pointer"
                    >
                      <AiOutlineDelete size={20}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProcessTable 