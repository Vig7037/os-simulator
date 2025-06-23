// function to calculate total & average times of processes
export const calculateProcessTimes = (processes) => {
    // total times
    const total_burst_time = processes.reduce((curr, process) => process.burst_time + curr, 0).toFixed(2);
    const total_completion_time =  processes.reduce((curr, process) => process.completionTime + curr, 0).toFixed(2);
    const total_turnaround_time = processes.reduce((curr, process) => process.turnaroundTime + curr, 0).toFixed(2);
    const total_waiting_time = processes.reduce((curr, process) => process.waitingTime + curr, 0).toFixed(2);

    // average times
    const average_burst_time = (total_burst_time / processes.length).toFixed(2);
    const average_completion_time = (total_completion_time / processes.length).toFixed(2);
    const average_turnaround_time = (total_turnaround_time / processes.length).toFixed(2);
    const average_waiting_time = (total_waiting_time / processes.length).toFixed(2);

    const total = {total_burst_time, total_completion_time, total_turnaround_time, total_waiting_time};
    const avg = {average_burst_time, average_completion_time, average_turnaround_time, average_waiting_time};

    return {total, avg};
}

// First Come First Serve (FCFS)
export function firstComeFirstServe(processes) {
  // Sort by arrival time, then by original order (process_id)
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a.arrival_time !== b.arrival_time) return a.arrival_time - b.arrival_time;
    return a.process_id - b.process_id;
  });
  let currentTime = 0;
  const schedule = [];
  const completedProcesses = [];

  sortedProcesses.forEach(process => {
    if (currentTime < process.arrival_time) {
      currentTime = process.arrival_time;
    }
    const startTime = currentTime;
    const endTime = startTime + process.burst_time;
    const completionTime = endTime;
    const turnaroundTime = completionTime - process.arrival_time;
    const waitingTime = turnaroundTime - process.burst_time;
    schedule.push({ ...process, startTime, endTime });
    completedProcesses.push({ ...process, completionTime, turnaroundTime, waitingTime });
    currentTime = endTime;
  });
  return { schedule, completedProcesses };
}

// Shortest Job First (SJF) - Non-preemptive
export function shortestJobFirst(processes) {
  const sortedProcesses = [...processes].sort((a, b) => a.arrival_time - b.arrival_time);
  let currentTime = 0;
  const schedule = [];
  const completedProcesses = [];
  const remainingProcesses = [...sortedProcesses];

  while (remainingProcesses.length > 0) {
    // Only consider processes that have arrived
    const available = remainingProcesses.filter(p => p.arrival_time <= currentTime);
    if (available.length === 0) {
      currentTime = remainingProcesses[0].arrival_time;
      continue;
    }
    // Pick the one with the shortest burst time (tie: first in list)
    const nextProcess = available.reduce((min, p) =>
      p.burst_time < min.burst_time ? p : min
    );
    const startTime = currentTime;
    const endTime = startTime + nextProcess.burst_time;
    const completionTime = endTime;
    const turnaroundTime = completionTime - nextProcess.arrival_time;
    const waitingTime = turnaroundTime - nextProcess.burst_time;
    schedule.push({ ...nextProcess, startTime, endTime });
    completedProcesses.push({ ...nextProcess, completionTime, turnaroundTime, waitingTime });
    remainingProcesses.splice(remainingProcesses.indexOf(nextProcess), 1);
    currentTime = endTime;
  }
  return { schedule, completedProcesses };
}

// Shortest Remaining Time First (SRTF) - Preemptive SJF
export function shortestRemainingTimeFirst(processes) {
  const sortedProcesses = [...processes].sort((a, b) => a.arrival_time - b.arrival_time);
  let currentTime = 0;
  const schedule = [];
  const completedProcesses = [];
  const remainingProcesses = sortedProcesses.map(p => ({ ...p, remainingBurstTime: p.burst_time }));

  while (remainingProcesses.length > 0) {
    // Only consider processes that have arrived
    const available = remainingProcesses.filter(p => p.arrival_time <= currentTime);
    if (available.length === 0) {
      currentTime = remainingProcesses[0].arrival_time;
      continue;
    }
    // Pick the one with the shortest remaining burst time (tie: first in list)
    const nextProcess = available.reduce((min, p) =>
      p.remainingBurstTime < min.remainingBurstTime ? p : min
    );
    const startTime = currentTime;
    const executionTime = 1;
    const endTime = startTime + executionTime;
    schedule.push({ ...nextProcess, startTime, endTime, burst_time: executionTime });
    nextProcess.remainingBurstTime -= executionTime;
    currentTime = endTime;
    if (nextProcess.remainingBurstTime === 0) {
      const completionTime = endTime;
      const turnaroundTime = completionTime - nextProcess.arrival_time;
      const waitingTime = turnaroundTime - nextProcess.burst_time;
      completedProcesses.push({ ...nextProcess, completionTime, turnaroundTime, waitingTime });
      remainingProcesses.splice(remainingProcesses.indexOf(nextProcess), 1);
    }
  }
  return { schedule, completedProcesses };
}

// Priority Scheduling (Preemptive, higher number = higher priority)
export function priorityScheduling(processes) {
  // Higher number = higher priority
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a.arrival_time !== b.arrival_time) return a.arrival_time - b.arrival_time;
    if ((a.priority ?? -Infinity) !== (b.priority ?? -Infinity)) return (b.priority ?? -Infinity) - (a.priority ?? -Infinity);
    return a.process_id - b.process_id;
  });
  let currentTime = 0;
  const schedule = [];
  const completedProcesses = [];
  const remainingProcesses = sortedProcesses.map(p => ({ ...p, remainingBurstTime: p.burst_time }));

  while (remainingProcesses.length > 0) {
    // Only consider processes that have arrived
    const available = remainingProcesses.filter(p => p.arrival_time <= currentTime);
    if (available.length === 0) {
      currentTime = remainingProcesses[0].arrival_time;
      continue;
    }
    // Pick the one with the highest priority (largest number), then process_id
    const nextProcess = available.reduce((max, p) => {
      if ((p.priority ?? -Infinity) > (max.priority ?? -Infinity)) return p;
      if ((p.priority ?? -Infinity) === (max.priority ?? -Infinity)) {
        if (p.process_id < max.process_id) return p;
      }
      return max;
    });
    const startTime = currentTime;
    const executionTime = 1;
    const endTime = startTime + executionTime;
    schedule.push({ ...nextProcess, startTime, endTime, burst_time: executionTime });
    nextProcess.remainingBurstTime -= executionTime;
    currentTime = endTime;
    if (nextProcess.remainingBurstTime === 0) {
      const completionTime = endTime;
      const turnaroundTime = completionTime - nextProcess.arrival_time;
      const waitingTime = turnaroundTime - nextProcess.burst_time;
      completedProcesses.push({ ...nextProcess, completionTime, turnaroundTime, waitingTime });
      remainingProcesses.splice(remainingProcesses.indexOf(nextProcess), 1);
    }
  }
  return { schedule, completedProcesses };
}

// Round Robin (RR) - Preemptive, time-sharing
export function roundRobin(processes, timeQuantum) {
  // Sort by arrival time, then by original order (process_id)
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a.arrival_time !== b.arrival_time) return a.arrival_time - b.arrival_time;
    return a.process_id - b.process_id;
  });
  let currentTime = 0;
  const schedule = [];
  const completedProcesses = [];
  const queue = [];
  const remainingProcesses = sortedProcesses.map(p => ({ ...p, remainingBurstTime: p.burst_time }));
  let lastArrivalIdx = 0;

  // Helper to enqueue newly arrived processes
  function enqueueArrivals() {
    while (lastArrivalIdx < remainingProcesses.length && remainingProcesses[lastArrivalIdx].arrival_time <= currentTime) {
      queue.push(remainingProcesses[lastArrivalIdx]);
      lastArrivalIdx++;
    }
  }

  enqueueArrivals();

  while (queue.length > 0) {
    const currentProcess = queue.shift();
    if (currentTime < currentProcess.arrival_time) {
      currentTime = currentProcess.arrival_time;
      enqueueArrivals();
    }
    const startTime = currentTime;
    const executionTime = Math.min(timeQuantum, currentProcess.remainingBurstTime);
    const endTime = startTime + executionTime;
    schedule.push({ ...currentProcess, startTime, endTime, burst_time: executionTime });
    currentProcess.remainingBurstTime -= executionTime;
    currentTime = endTime;
    enqueueArrivals();
    if (currentProcess.remainingBurstTime > 0) {
      queue.push(currentProcess);
    } else {
      const completionTime = endTime;
      const turnaroundTime = completionTime - currentProcess.arrival_time;
      const waitingTime = turnaroundTime - currentProcess.burst_time;
      completedProcesses.push({ ...currentProcess, completionTime, turnaroundTime, waitingTime });
    }
  }
  return { schedule, completedProcesses };
}

// Utility: Convert schedule to timeline (per time unit), inserting idle periods
export function scheduleToTimeline(schedule) {
  const timeline = [];
  let lastEnd = 0;
  schedule.forEach(entry => {
    // Insert idle if there's a gap
    if (entry.startTime > lastEnd) {
      for (let t = lastEnd; t < entry.startTime; t++) {
        timeline.push({
          time: t,
          process_id: 'idle',
          color: '#E5E7EB', // light gray
          label: 'Idle'
        });
      }
    }
    for (let t = entry.startTime; t < entry.endTime; t++) {
      timeline.push({
        time: t,
        process_id: entry.process_id,
        color: entry.color,
        label: entry.label || undefined
      });
    }
    lastEnd = entry.endTime;
  });
  return timeline;
} 