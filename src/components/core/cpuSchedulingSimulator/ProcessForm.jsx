import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const DISTINCT_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E42', // orange
  '#EF4444', // red
  '#A78BFA', // purple
  '#F472B6', // pink
  '#FBBF24', // yellow
  '#6366F1', // indigo
  '#34D399', // teal
  '#F87171', // light red
  '#60A5FA', // light blue
  '#FCD34D', // light yellow
  '#6EE7B7', // light green
  '#C084FC', // violet
  '#FCA5A5', // rose
];

const ProcessForm = ({ addProcess, initialValues, showPriority, processes = [] }) => {
  const [formData, setFormData] = useState({
    arrival_time: '',
    burst_time: '',
    color: '', // Will be set in useEffect
    priority: ''
  })

  useEffect(() => {
    if (initialValues) {
      setFormData({
        arrival_time: initialValues.arrival_time,
        burst_time: initialValues.burst_time,
        color: initialValues.color || '',
        priority: initialValues.priority !== undefined ? initialValues.priority : ''
      })
    } else {
      // Assign a random unused color
      const usedColors = processes.map(p => p.color);
      const availableColors = DISTINCT_COLORS.filter(c => !usedColors.includes(c));
      const randomColor = availableColors.length > 0
        ? availableColors[Math.floor(Math.random() * availableColors.length)]
        : DISTINCT_COLORS[Math.floor(Math.random() * DISTINCT_COLORS.length)];
      setFormData({
        arrival_time: '',
        burst_time: '',
        color: randomColor,
        priority: ''
      })
    }
  }, [initialValues, processes])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert to numbers
    const process = {
      arrival_time: parseInt(formData.arrival_time),
      burst_time: parseInt(formData.burst_time),
      color: formData.color,
      priority: formData.priority !== '' ? parseInt(formData.priority) : undefined
    }

    // Validate numbers
    if (isNaN(process.arrival_time) || isNaN(process.burst_time) || (formData.priority !== '' && isNaN(process.priority))) {
      toast.error('Please enter valid numbers')
      return
    }

    // Validate positive numbers
    if (process.arrival_time < 0 || process.burst_time <= 0 || (formData.priority !== '' && process.priority < 0)) {
      toast.error('Please enter positive numbers (burst time and priority must be >= 0, burst time > 0)')
      return
    }

    addProcess(process)
    
    // Reset form if not editing
    if (!initialValues) {
      setFormData({
        arrival_time: '',
        burst_time: '',
        color: '',
        priority: ''
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {/* arrival time */}
      <div>
        <label htmlFor="arrival_time" className="block text-sm font-medium text-gray-700">
          Arrival Time
        </label>
        <input
          type="number"
          name="arrival_time"
          id="arrival_time"
          value={formData.arrival_time}
          onChange={handleChange}
          min="0"
          autoComplete='off'
          className="mt-1 p-2 outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="Enter arrival time"
        />
      </div>

      {/* burst time */}
      <div>
        <label htmlFor="burst_time" className="block text-sm font-medium text-gray-700">
          Burst Time
        </label>
        <input
          type="number"
          name="burst_time"
          id="burst_time"
          autoComplete='off'
          value={formData.burst_time}
          onChange={handleChange}
          min="1"
          className="mt-1 p-2 outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="Enter burst time"
        />
      </div>

      {/* priority */}
      {showPriority && (
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority (higher = higher priority)
          </label>
          <input
            type="number"
            name="priority"
            id="priority"
            autoComplete='off'
            value={formData.priority}
            onChange={handleChange}
            min="0"
            className="mt-1 p-2 outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Enter priority (e.g. 1, 2, 3)"
          />
        </div>
      )}

      {/* process color */}
      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
          Process Color
        </label>
        <div className="mt-1 flex items-center space-x-2">
          <input
            type="color"
            name="color"
            id="color"
            value={formData.color}
            onChange={handleChange}
            className="h-10 w-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-sm text-gray-500">
            {formData.color}
          </span>
        </div>
      </div>

      {/* submit button */}
      <div className='flex justify-center'>
        <button
          type="submit"
          className="cursor-pointer inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {initialValues ? 'Update Process' : 'Add Process'}
        </button>
      </div>
    </form>
  )
}

export default ProcessForm 