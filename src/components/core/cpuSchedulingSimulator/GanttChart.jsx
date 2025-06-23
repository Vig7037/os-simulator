import React, { useState, useEffect, useMemo } from 'react'
import { scheduleToTimeline } from '../../../utils/schedulingAlgorithms'

const GanttChart = ({ processes }) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000) // 1 second per time unit
  const [activeBars, setActiveBars] = useState([])

  // Build timeline from schedule (processes)
  const timeline = useMemo(() => scheduleToTimeline(processes), [processes])
  const maxTime = timeline.length > 0 ? Math.max(...timeline.map(t => t.time)) + 1 : 0

  useEffect(() => {
    if (timeline.length > 0 && isAnimating && !isPaused) {
      if (currentTime >= maxTime) {
        setIsAnimating(false)
        return
      }
      const timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev + 1 >= maxTime) {
            setIsAnimating(false)
            return maxTime
          }
          return prev + 1
        })
      }, animationSpeed)
      return () => clearInterval(timer)
    }
  }, [timeline, isAnimating, isPaused, animationSpeed, currentTime, maxTime])

  // Update active bars whenever currentTime changes
  useEffect(() => {
    const bars = []
    let lastProcess = null
    let barStart = null

    for (let t = 0; t <= currentTime; t++) {
      const entry = timeline.find(e => e.time === t)
      if (!entry) continue
      
      if (!lastProcess || entry.process_id !== lastProcess.process_id) {
        if (lastProcess) {
          bars.push({
            process_id: lastProcess.process_id,
            color: lastProcess.color,
            start: barStart,
            end: t
          })
        }
        lastProcess = entry
        barStart = t
      }
    }

    if (lastProcess && barStart !== null && currentTime > barStart) {
      bars.push({
        process_id: lastProcess.process_id,
        color: lastProcess.color,
        start: barStart,
        end: currentTime
      })
    }

    setActiveBars(bars)
  }, [currentTime, timeline])

  const handleStartAnimation = () => {
    setCurrentTime(0)
    setIsAnimating(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleResume = () => {
    setIsPaused(false)
  }

  const handleStopAnimation = () => {
    setIsAnimating(false)
    setIsPaused(false)
    setCurrentTime(0)
  }

  const handleSpeedChange = (e) => {
    setAnimationSpeed(parseInt(e.target.value))
  }

  if (timeline.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No processes scheduled yet
      </div>
    )
  }

  const timeScale = maxTime > 0 ? 100 / maxTime : 0 // percentage per time unit

  return (
    <div className="mt-4">
      {/* animation control buttons */}
      <div className="flex flex-col sm:flex-row space-y-4 justify-between items-center mb-4">
        {/* buttons */}
        <div className="flex space-x-4">
          {/* start button */}
          {!isAnimating && (
            <button
              onClick={handleStartAnimation}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
            >
              Start Animation
            </button>
          )}

          {/* pause button */}
          {isAnimating && !isPaused && (
            <button
              onClick={handlePause}
              className="inline-flex justify-center rounded-md border border-yellow-500 bg-yellow-100 py-2 px-4 text-sm font-medium text-yellow-800 shadow-sm hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer"
            >
              Pause
            </button>
          )}

          {/* resume button */}
          {isAnimating && isPaused && (
            <button
              onClick={handleResume}
              className="inline-flex justify-center rounded-md border border-green-500 bg-green-100 py-2 px-4 text-sm font-medium text-green-800 shadow-sm hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
            >
              Resume
            </button>
          )}

          {/* stop button */}
          <button
            onClick={handleStopAnimation}
            disabled={!isAnimating && !isPaused}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
          >
            Stop Animation
          </button>
        </div>
        
        {/* animation speed */}
        <div className="flex items-center space-x-2">
          <label htmlFor="speed" className="text-sm text-gray-700">
            Animation Speed:
          </label>
          <select
            id="speed"
            value={animationSpeed}
            onChange={handleSpeedChange}
            className="rounded-md border-gray-300 shadow-sm focus:outline-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          >
            <option value="500">Fast</option>
            <option value="1000">Normal</option>
            <option value="2000">Slow</option>
          </select>
        </div>
      </div>
      
      {/* gantt chart */}
      <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
        {activeBars.map((bar, idx) => {
          const left = bar.start * timeScale
          const width = (bar.end - bar.start) * timeScale
          // const isCurrent = isAnimating && idx === activeBars.length - 1
          return (
            <div
              key={idx}
              className="absolute h-full"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: bar.process_id === 'idle' ? '#E5E7EB' : bar.color,
                transition: `width ${animationSpeed}ms ease-in-out`,
                transformOrigin: 'left center',
                border: bar.process_id === 'idle' ? '1px dashed #9CA3AF' : undefined
              }}
            >
              <div className="flex items-center justify-center h-full text-sm font-medium" style={{ color: bar.process_id === 'idle' ? '#374151' : '#fff' }}>
                {bar.process_id === 'idle' ? 'Idle' : `P${bar.process_id}`}
              </div>
            </div>
          )
        })}
        {/* Time markers */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-500">
          {Array.from({ length: maxTime + 1 }).map((_, i) => (
            <div key={i} style={{ left: `${i * timeScale}%` }} className="absolute">
              {i}
            </div>
          ))}
        </div>
      </div>

      {/* Time labels for each bar */}
      <div className="relative h-6 mt-1">
        {activeBars.map((bar, idx) => {
          const left = bar.start * timeScale
          const width = (bar.end - bar.start) * timeScale
          const isCurrent = isAnimating && idx === activeBars.length - 1
          return (
            <React.Fragment key={idx}>
              {/* Start time label: only for the first bar */}
              {idx === 0 && (
                <div
                  style={{
                    position: 'absolute',
                    left: `calc(${left}% - 8px)`,
                    fontWeight: 400,
                    fontSize: 16,
                    color: '#222',
                    minWidth: 16,
                    textAlign: 'right',
                    transition: `left ${animationSpeed}ms ease-in-out`,
                  }}
                >
                  {bar.start}
                </div>
              )}
              {/* End/Current time label */}
              <div
                style={{
                  position: 'absolute',
                  left: `calc(${left + width}% - 8px)`,
                  fontWeight: 400,
                  fontSize: 16,
                  color: '#222',
                  minWidth: 16,
                  textAlign: 'left',
                  transition: `left ${animationSpeed}ms ease-in-out`,
                }}
              >
                {isCurrent ? currentTime : bar.end}
              </div>
            </React.Fragment>
          )
        })}
      </div>
      
      {/* current time */}
      <div className="mt-2 text-center text-sm text-gray-500">
        Current Time: {currentTime}
      </div>
    </div>
  )
}

export default GanttChart 