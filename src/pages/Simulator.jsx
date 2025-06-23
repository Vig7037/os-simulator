import { useRef, useState } from "react"
import { toast } from "react-toastify"
import { Tabs, Tab, Box } from '@mui/material'

// CPU Scheduling components
import ProcessForm from "../components/core/cpuSchedulingSimulator/ProcessForm"
import ProcessTable from "../components/core/cpuSchedulingSimulator/ProcessTable"
import GanttChart from "../components/core/cpuSchedulingSimulator/GanttChart"
import SummaryTable from "../components/core/cpuSchedulingSimulator/SummaryTable"
import DataVisualization from '../components/core/cpuSchedulingSimulator/DataVisualization'

// Memory Management components
import MemoryManagementSimulator from "../components/core/memoryManagementSimulator/MemoryManagementSimulator"

// scheduling algorithms
import { 
    firstComeFirstServe,
    shortestJobFirst,
    shortestRemainingTimeFirst,
    roundRobin,
    priorityScheduling
} from "../utils/schedulingAlgorithms"

function Simulator() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [processes, setProcesses] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [schedule, setSchedule] = useState([]);
  const [completedProcesses, setCompletedProcesses] = useState([]);
  const [editingProcess, setEditingProcess] = useState(null);
  const [ganttKey, setGanttKey] = useState(0);

  const summaryTableRef = useRef(null);
  const processInputRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // function to add process
  const handleAddProcess = (process) => {
    if (editingProcess) {
      // Update existing process
      setProcesses(prev => prev.map(p => 
        p.process_id === editingProcess.process_id 
          ? { ...process, process_id: p.process_id }
          : p
      ))
      setEditingProcess(null)
      toast.success('Process updated successfully!')
    } else {
      // Add new process
      setProcesses(prev => [...prev, { ...process, process_id: prev.length + 1 }])
      toast.success('Process added successfully!')
    }
  }

  // function to edit process
  const handleEditProcess = (process) => {
    setEditingProcess(process);
    // scroll to process input box
    processInputRef.current?.scrollIntoView({behavior: 'smooth'});
  }

  // function to delete process
  const handleDeleteProcess = (processId) => {
    setProcesses(prev => prev.filter(p => p.process_id !== processId));

    toast.success('Process deleted successfully!');
  }

  // function to change selected algorithm
  const handleAlgorithmChange = (e) => {
    setSelectedAlgorithm(e.target.value)
  }

  // function to change time quantum
  const handleTimeQuantumChange = (e) => {
    setTimeQuantum(parseInt(e.target.value))
  }

  // function to calculate schedule
  const calculateSchedule = () => {
    if (processes.length === 0) {
      toast.error('No processes added!', {
        position: 'top-center'
      });
      return;
    }

    let result = null;
    switch (selectedAlgorithm) {
      case 'FCFS':
        result = firstComeFirstServe(processes)
        break
      case 'SJF':
        result = shortestJobFirst(processes)
        break
      case 'RR':
        if(!timeQuantum) {
          toast.error("Please enter valid time quantum");
          return;
        }
        result = roundRobin(processes, timeQuantum)
        break
      case 'SRTF':
        result = shortestRemainingTimeFirst(processes)
        break
      case 'PRIORITY':
        result = priorityScheduling(processes)
        break
      default:
        result = { schedule: [], completedProcesses: [] }
    }

    setSchedule(result.schedule);
    setCompletedProcesses(result.completedProcesses);
    setGanttKey(prev => prev + 1);

    // auto scroll to process summary table
    summaryTableRef.current?.scrollIntoView({behavior: 'smooth'});
  }

  // function to clear all processes
  const handleClear = () => {
    setProcesses([])
    setSchedule([])
    setCompletedProcesses([])
    setEditingProcess(null)
    toast.info('All data cleared!')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* main heading */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-mono text-center uppercase tracking-widest">
            Operating System Algorithms Simulator
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: 2, mb: 4 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="CPU Scheduling" />
              <Tab label="Memory Management" />
            </Tabs>
          </Box>

          {selectedTab === 0 ? (
            // CPU Scheduling Simulator
            <div className="flex flex-col gap-6">
              {/* algorithm & process input */}
              <div className='grid grid-cols-1 sm:grid-cols-2 place-self-center gap-8'>
                {/* Algorithm Selection */}
                <div className="bg-white overflow-hidden shadow rounded-lg h-fit">

                  {/* input box */}
                  <div className="px-4 py-5 sm:p-6">
                    {/* heading */}
                    <h2 className="text-lg font-medium text-gray-900">
                        Select Scheduling Algorithm
                    </h2>

                    {/* algorithm options box */}
                    <div className="mt-4 space-y-4">
                      <select
                        value={selectedAlgorithm}
                        onChange={handleAlgorithmChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-1 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="FCFS">First Come First Serve</option>
                        <option value="SJF">Shortest Job First</option>
                        <option value="RR">Round Robin</option>
                        <option value="SRTF">Shortest Remaining Time First</option>
                        <option value="PRIORITY">Priority Scheduling</option>
                      </select>

                      {/* input time quantum if round robin is selected */}
                      {selectedAlgorithm === 'RR' && (
                        <div>
                          <label htmlFor="timeQuantum" className="block text-sm font-medium text-gray-700">
                            Time Quantum
                          </label>
                          <input
                            type="number"
                            id="timeQuantum"
                            placeholder="Enter time quantum"
                            value={timeQuantum}
                            onChange={handleTimeQuantumChange}
                            min="1"
                            className="mt-1 p-2 outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      )}  

                      {/* buttons */}
                      <div className="flex space-x-4">
                        <button
                          onClick={calculateSchedule}
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                        >
                          Calculate Results
                        </button>

                        <button
                          onClick={handleClear}
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Process Input Form */}
                <div ref={processInputRef} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                      {editingProcess ? 'Edit Process' : 'Add Process'}
                    </h2>

                    <ProcessForm 
                      addProcess={handleAddProcess} 
                      initialValues={editingProcess}
                      showPriority={selectedAlgorithm === 'PRIORITY'}
                      processes={processes}
                    />
                  </div>
                </div>
              </div>


              {/* Process Table */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  {/* heading */}
                  <h2 className="text-lg font-medium text-gray-900">
                      Added Processes
                  </h2>
                  
                  {/* table */}
                  <ProcessTable 
                    processes={processes}
                    onEdit={handleEditProcess}
                    onDelete={handleDeleteProcess}
                    showPriority={selectedAlgorithm === 'PRIORITY'}
                  />
                </div>
              </div>

              {/* Gantt Chart */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900">
                      Gantt Chart
                  </h2>

                  <GanttChart key={ganttKey} processes={schedule} />

                </div>
              </div>

              {/* Summary Table */}
              <div ref={summaryTableRef} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  {/* heading */}
                  <h2 className="text-lg font-medium text-gray-900">
                      Process Summary
                  </h2>
                  
                  {/* table */}
                  <SummaryTable 
                    processes={completedProcesses}
                    showPriority={selectedAlgorithm === 'PRIORITY'}
                  />
                </div>
              </div>

              {/* Data Visualization */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Data Visualization
                  </h2>
                  <DataVisualization processes={completedProcesses} />
                </div>
              </div>

            </div>
          ) : (
            // Memory Management Simulator
            <MemoryManagementSimulator />
          )}
        </div>
      </main>
    </div>
  )
}

export default Simulator