import React, { useState, useRef } from 'react';
import { Box, Typography, Paper, TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid, Alert, Tooltip, Divider } from '@mui/material';

const fitAlgorithms = [
  { value: 'first', label: 'First Fit' },
  { value: 'best', label: 'Best Fit' },
  { value: 'worst', label: 'Worst Fit' },
];

function parseInput(str) {
  return str
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n) && n > 0);
}

function allocateMemory(blocks, processes, algorithm) {
  // Convert blocks to objects with size and status
  let blockObjs = blocks.map(size => ({ size, status: 'free' }));
  let allocation = Array(processes.length).fill(-1);
  let blockAlloc = blocks.map(() => []); // For visualization: which processes are in which block

  // Track which blocks have already been allocated to a process
  let blockUsed = Array(blocks.length).fill(false);

  for (let i = 0; i < processes.length; i++) {
    let idx = -1;
    if (algorithm === 'first') {
      for (let j = 0; j < blockObjs.length; j++) {
        if (!blockUsed[j] && blockObjs[j].size >= processes[i]) {
          idx = j;
          // Allocate block
          allocation[i] = j;
          blockAlloc[j].push({ process: i, size: processes[i] });
          blockObjs[j].size -= processes[i];
          blockUsed[j] = true; // Mark this block as used for this simulation run
          break;
        }
      }
    } else if (algorithm === 'best') {
      let bestIdx = -1, minWaste = Infinity;
      for (let j = 0; j < blockObjs.length; j++) {
        if (!blockUsed[j] && blockObjs[j].size >= processes[i] && (blockObjs[j].size - processes[i]) < minWaste) {
          minWaste = blockObjs[j].size - processes[i];
          bestIdx = j;
        }
      }
      idx = bestIdx;
      if (idx !== -1) {
        allocation[i] = idx;
        blockAlloc[idx].push({ process: i, size: processes[i] });
        blockObjs[idx].size -= processes[i];
        blockUsed[idx] = true;
      }
    } else if (algorithm === 'worst') {
      let worstIdx = -1, maxWaste = -1;
      for (let j = 0; j < blockObjs.length; j++) {
        if (!blockUsed[j] && blockObjs[j].size >= processes[i] && (blockObjs[j].size - processes[i]) > maxWaste) {
          maxWaste = blockObjs[j].size - processes[i];
          worstIdx = j;
        }
      }
      idx = worstIdx;
      if (idx !== -1) {
        allocation[i] = idx;
        blockAlloc[idx].push({ process: i, size: processes[i] });
        blockObjs[idx].size -= processes[i];
        blockUsed[idx] = true;
      }
    }
    // If not allocated, allocation[i] stays -1
  }
  // For visualization, return the original block sizes (for labels), blockAlloc, and the final block sizes
  return { allocation, blockAlloc, blockStatus: blockObjs.map(b => b.size) };
}

const COLORS = [
  '#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1', '#c2185b', '#ffa000', '#388e3c', '#512da8'
];

const SPEEDS = {
  slow: 1500,
  normal: 800,
  fast: 300,
};

const ContinuousMemorySimulator = () => {
  const [algorithm, setAlgorithm] = useState('first');
  const [memoryBlocks, setMemoryBlocks] = useState('');
  const [processes, setProcesses] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [simState, setSimState] = useState('idle'); // idle, running, paused, done
  const [simStep, setSimStep] = useState({ processIdx: 0, blockIdx: 0 });
  const [simAlloc, setSimAlloc] = useState([]); // allocations so far
  const [simBlockStatus, setSimBlockStatus] = useState([]); // block sizes left
  const [simBlockUsed, setSimBlockUsed] = useState([]); // block used flags
  const [simText, setSimText] = useState('');
  const [simSpeed, setSimSpeed] = useState('normal');
  const simTimer = useRef(null);
  const [arrowBlockIdx, setArrowBlockIdx] = useState(null); // For best/worst fit arrow
  const [scanPhase, setScanPhase] = useState(false); // For best/worst fit: are we scanning or allocating?
  const [inputDirty, setInputDirty] = useState(false); // Track if input was changed

  const handleSimulate = () => {
    setError('');
    setResult(null);
    setInputDirty(false);
    const blocks = parseInput(memoryBlocks);
    const procs = parseInput(processes);
    if (blocks.length === 0 || procs.length === 0) {
      setError('Please enter valid memory blocks and processes.');
      return;
    }
    const { allocation, blockAlloc, blockStatus } = allocateMemory(blocks, procs, algorithm);
    setResult({ blocks, procs, allocation, blockAlloc, blockStatus });
  };

  // Start simulation
  const handleStartSim = () => {
    if (!result) return;
    setSimState('running');
    setSimStep({ processIdx: 0, blockIdx: 0 });
    setSimAlloc(Array(result.procs.length).fill(-1));
    setSimBlockStatus([...result.blocks]);
    setSimBlockUsed(Array(result.blocks.length).fill(false));
    setSimText('');
    setScanPhase(false);
    setInputDirty(false);
  };

  // Pause simulation
  const handlePauseSim = () => {
    setSimState('paused');
    if (simTimer.current) clearTimeout(simTimer.current);
  };

  // Reset simulation
  const handleResetSim = () => {
    setSimState('idle');
    setSimStep({ processIdx: 0, blockIdx: 0 });
    setSimAlloc([]);
    setSimBlockStatus([]);
    setSimBlockUsed([]);
    setSimText('');
    if (simTimer.current) clearTimeout(simTimer.current);
    setScanPhase(false);
  };

  // Handle speed change
  const handleSpeedChange = (e) => {
    setSimSpeed(e.target.value);
  };

  // Simulation effect
  React.useEffect(() => {
    if (simState !== 'running' || !result) return;
    const { processIdx, blockIdx } = simStep;
    if (processIdx >= result.procs.length) {
      setSimState('done');
      setSimText('Simulation complete.');
      setArrowBlockIdx(null);
      setScanPhase(false);
      return;
    }
    const processSize = result.procs[processIdx];
    if (algorithm === 'first') {
      if (blockIdx >= result.blocks.length) {
        setSimText(`P${processIdx + 1} Unallocated`);
        setSimAlloc(prev => {
          const next = [...prev];
          next[processIdx] = -1;
          return next;
        });
        setArrowBlockIdx(null);
        simTimer.current = setTimeout(() => {
          setSimStep({ processIdx: processIdx + 1, blockIdx: 0 });
        }, SPEEDS[simSpeed]);
        return;
      }
      setSimText(`Checking Block ${blockIdx + 1} for P${processIdx + 1}...`);
      setArrowBlockIdx(blockIdx);
      if (!simBlockUsed[blockIdx] && simBlockStatus[blockIdx] >= processSize) {
        setSimText(`P${processIdx + 1} Allocated to Block ${blockIdx + 1}`);
        setSimAlloc(prev => {
          const next = [...prev];
          next[processIdx] = blockIdx;
          return next;
        });
        setSimBlockStatus(prev => {
          const next = [...prev];
          next[blockIdx] -= processSize;
          return next;
        });
        setSimBlockUsed(prev => {
          const next = [...prev];
          next[blockIdx] = true;
          return next;
        });
        setArrowBlockIdx(blockIdx);
        simTimer.current = setTimeout(() => {
          setSimStep({ processIdx: processIdx + 1, blockIdx: 0 });
        }, SPEEDS[simSpeed]);
      } else {
        simTimer.current = setTimeout(() => {
          setSimStep({ processIdx, blockIdx: blockIdx + 1 });
        }, SPEEDS[simSpeed]);
      }
    } else if (algorithm === 'best' || algorithm === 'worst') {
      // --- New: Scanning phase ---
      if (!scanPhase) {
        // Scanning blocks left to right
        if (blockIdx < result.blocks.length) {
          setSimText(`Checking Block ${blockIdx + 1} for P${processIdx + 1}...`);
          setArrowBlockIdx(blockIdx);
          simTimer.current = setTimeout(() => {
            setSimStep({ processIdx, blockIdx: blockIdx + 1 });
          }, SPEEDS[simSpeed]);
        } else {
          // Finished scanning, now allocate (or not)
          setScanPhase(true);
        }
        return;
      }
      // --- Allocation phase ---
      // Find the best/worst fit block
      let chosenIdx = -1;
      if (algorithm === 'best') {
        let minWaste = Infinity;
        for (let j = 0; j < result.blocks.length; j++) {
          if (!simBlockUsed[j] && simBlockStatus[j] >= processSize && (simBlockStatus[j] - processSize) < minWaste) {
            minWaste = simBlockStatus[j] - processSize;
            chosenIdx = j;
          }
        }
      } else if (algorithm === 'worst') {
        let maxWaste = -1;
        for (let j = 0; j < result.blocks.length; j++) {
          if (!simBlockUsed[j] && simBlockStatus[j] >= processSize && (simBlockStatus[j] - processSize) > maxWaste) {
            maxWaste = simBlockStatus[j] - processSize;
            chosenIdx = j;
          }
        }
      }
      setArrowBlockIdx(chosenIdx);
      if (chosenIdx === -1) {
        setSimText(`P${processIdx + 1} Unallocated`);
        setSimAlloc(prev => {
          const next = [...prev];
          next[processIdx] = -1;
          return next;
        });
      } else {
        setSimText(`P${processIdx + 1} Allocated to Block ${chosenIdx + 1}`);
        setSimAlloc(prev => {
          const next = [...prev];
          next[processIdx] = chosenIdx;
          return next;
        });
        setSimBlockStatus(prev => {
          const next = [...prev];
          next[chosenIdx] -= processSize;
          return next;
        });
        setSimBlockUsed(prev => {
          const next = [...prev];
          next[chosenIdx] = true;
          return next;
        });
      }
      simTimer.current = setTimeout(() => {
        setArrowBlockIdx(null);
        setScanPhase(false);
        setSimStep({ processIdx: processIdx + 1, blockIdx: 0 });
      }, SPEEDS[simSpeed]);
    }
    // eslint-disable-next-line
  }, [simState, simStep, simSpeed, algorithm, scanPhase]);

  // Clean up timer on unmount
  React.useEffect(() => {
    return () => {
      if (simTimer.current) clearTimeout(simTimer.current);
    };
  }, []);

  // Stack visualization: each block is a vertical bar, with colored segments for processes and free space
  const renderStackVisualization = () => {
    if (!result) return null;
    const totalMemory = result.blocks.reduce((a, b) => a + b, 0);
    let currentBase = 0;
    return (
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end', justifyContent: 'center', width: '100%', mb: 2 }}>
        {result.blocks.map((blockSize, blockIdx) => {
          const allocs = result.blockAlloc[blockIdx];
          let used = 0;
          let blockSegments = [];
          // Build segments for this block (processes and free)
          allocs.forEach((alloc, i) => {
            blockSegments.push({
              type: 'process',
              process: alloc.process,
              size: alloc.size,
              color: COLORS[alloc.process % COLORS.length],
            });
            used += alloc.size;
          });
          if (used < blockSize) {
            blockSegments.push({
              type: 'free',
              size: blockSize - used,
              color: '#bdbdbd',
            });
          }
          // For proportional height
          const blockHeight = 320; // px
          return (
            <Box key={blockIdx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {/* Block label */}
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#1976d2', fontWeight: 500 }}>
                Block {blockIdx + 1} ({blockSize})
              </Typography>
              {/* Stack bar */}
              <Box sx={{
                width: 60,
                height: blockHeight,
                border: '2px solid #1976d2',
                borderRadius: 2,
                overflow: 'hidden',
                background: '#e3f2fd',
                display: 'flex',
                flexDirection: 'column-reverse',
                position: 'relative',
                boxShadow: 2,
              }}>
                {blockSegments.map((seg, i) => {
                  const height = (seg.size / blockSize) * blockHeight;
                  return (
                    <Tooltip key={i} title={seg.type === 'process' ? `P${seg.process + 1} (Size: ${seg.size})` : `Free (${seg.size})`} arrow>
                      <Box sx={{
                        height,
                        width: '100%',
                        background: seg.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: seg.type === 'process' ? '#fff' : '#333',
                        fontWeight: 500,
                        fontSize: 15,
                        borderTop: i !== blockSegments.length - 1 ? '1.5px solid #fff' : 'none',
                        transition: 'background 0.3s',
                        position: 'relative',
                      }}>
                        {seg.type === 'process' ? `P${seg.process + 1}` : 'Free'}
                      </Box>
                    </Tooltip>
                  );
                })}
                {/* Base/Limit labels */}
                <Box sx={{ position: 'absolute', left: '100%', top: 0, fontSize: 12, color: '#1976d2', ml: 1 }}>
                  Base: {result.blocks.slice(0, blockIdx).reduce((a, b) => a + b, 0)}
                </Box>
                <Box sx={{ position: 'absolute', left: '100%', bottom: 0, fontSize: 12, color: '#1976d2', ml: 1 }}>
                  Limit: {result.blocks.slice(0, blockIdx + 1).reduce((a, b) => a + b, 0) - 1}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  // Legend for process colors
  const renderLegend = () => {
    if (!result) return null;
    const usedProcesses = result.procs.map((_, i) => i).filter(i => result.allocation[i] !== -1);
    if (usedProcesses.length === 0) return null;
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ mr: 1 }}>Legend:</Typography>
        {usedProcesses.map(i => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 18, height: 18, background: COLORS[i % COLORS.length], borderRadius: 0.5, border: '1px solid #888' }} />
            <Typography variant="body2">P{i + 1}</Typography>
          </Box>
        ))}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 18, height: 18, background: '#bdbdbd', borderRadius: 0.5, border: '1px solid #888' }} />
          <Typography variant="body2">Free</Typography>
        </Box>
      </Box>
    );
  };

  // Render animated arrow above current block
  const renderArrow = () => {
    if (simState !== 'running' && simState !== 'paused') return null;
    let arrowIdx = null;
    if (algorithm === 'first') {
      arrowIdx = simStep.blockIdx;
    } else if (algorithm === 'best' || algorithm === 'worst') {
      arrowIdx = scanPhase ? arrowBlockIdx : simStep.blockIdx;
    }
    if (!result || arrowIdx == null || arrowIdx < 0 || arrowIdx >= result.blocks.length) return null;
    return (
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end', justifyContent: 'center', width: '100%', mb: 1 }}>
        {result.blocks.map((_, idx) => (
          <Box key={idx} sx={{ width: 60, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {idx === arrowIdx ? <span style={{ fontSize: 28, color: '#d32f2f' }}>↓</span> : null}
          </Box>
        ))}
      </Box>
    );
  };

  // Render simulated bar chart
  const renderSimStack = () => {
    if (!result) return null;
    const totalMemory = result.blocks.reduce((a, b) => a + b, 0);
    return (
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end', justifyContent: 'center', width: '100%', mb: 2 }}>
        {result.blocks.map((blockSize, blockIdx) => {
          // Find all allocations to this block so far
          const allocs = simAlloc
            .map((bIdx, pIdx) => (bIdx === blockIdx ? { process: pIdx, size: result.procs[pIdx] } : null))
            .filter(Boolean);
          let used = 0;
          let blockSegments = [];
          allocs.forEach((alloc, i) => {
            blockSegments.push({
              type: 'process',
              process: alloc.process,
              size: alloc.size,
              color: COLORS[alloc.process % COLORS.length],
            });
            used += alloc.size;
          });
          if (used < blockSize) {
            blockSegments.push({
              type: 'free',
              size: blockSize - used,
              color: '#bdbdbd',
            });
          }
          const blockHeight = 320;
          return (
            <Box key={blockIdx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#1976d2', fontWeight: 500 }}>
                Block {blockIdx + 1} ({blockSize})
              </Typography>
              <Box sx={{
                width: 60,
                height: blockHeight,
                border: '2px solid #1976d2',
                borderRadius: 2,
                overflow: 'hidden',
                background: '#e3f2fd',
                display: 'flex',
                flexDirection: 'column-reverse',
                position: 'relative',
                boxShadow: 2,
              }}>
                {blockSegments.map((seg, i) => {
                  const height = (seg.size / blockSize) * blockHeight;
                  return (
                    <Tooltip key={i} title={seg.type === 'process' ? `P${seg.process + 1} (Size: ${seg.size})` : `Free (${seg.size})`} arrow>
                      <Box sx={{
                        height,
                        width: '100%',
                        background: seg.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: seg.type === 'process' ? '#fff' : '#333',
                        fontWeight: 500,
                        fontSize: 15,
                        borderTop: i !== blockSegments.length - 1 ? '1.5px solid #fff' : 'none',
                        transition: 'background 0.3s',
                        position: 'relative',
                      }}>
                        {seg.type === 'process' ? `P${seg.process + 1}` : 'Free'}
                      </Box>
                    </Tooltip>
                  );
                })}
                <Box sx={{ position: 'absolute', left: '100%', top: 0, fontSize: 12, color: '#1976d2', ml: 1 }}>
                  Base: {result.blocks.slice(0, blockIdx).reduce((a, b) => a + b, 0)}
                </Box>
                <Box sx={{ position: 'absolute', left: '100%', bottom: 0, fontSize: 12, color: '#1976d2', ml: 1 }}>
                  Limit: {result.blocks.slice(0, blockIdx + 1).reduce((a, b) => a + b, 0) - 1}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  // Render simulated legend
  const renderSimLegend = () => {
    if (!result) return null;
    const usedProcesses = simAlloc.map((bIdx, i) => (bIdx !== -1 ? i : null)).filter(i => i !== null);
    if (usedProcesses.length === 0) return null;
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ mr: 1 }}>Legend:</Typography>
        {usedProcesses.map(i => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 18, height: 18, background: COLORS[i % COLORS.length], borderRadius: 0.5, border: '1px solid #888' }} />
            <Typography variant="body2">P{i + 1}</Typography>
          </Box>
        ))}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 18, height: 18, background: '#bdbdbd', borderRadius: 0.5, border: '1px solid #888' }} />
          <Typography variant="body2">Free</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>Continuous Memory Allocation</Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="algorithm-label">Algorithm</InputLabel>
              <Select
                labelId="algorithm-label"
                value={algorithm}
                label="Algorithm"
                onChange={e => setAlgorithm(e.target.value)}
              >
                {fitAlgorithms.map(algo => (
                  <MenuItem key={algo.value} value={algo.value}>{algo.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Memory Blocks (comma separated)"
              value={memoryBlocks}
              onChange={e => { setMemoryBlocks(e.target.value); setInputDirty(true); }}
              fullWidth
              placeholder="e.g. 100, 500, 200, 300, 600"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Processes (comma separated)"
              value={processes}
              onChange={e => { setProcesses(e.target.value); setInputDirty(true); }}
              fullWidth
              placeholder="e.g. 212, 417, 112, 426"
            />
          </Grid>
          <Grid item xs={12} className='mt-1'>
            <Button className='h-[90%]' variant="contained" color="primary" onClick={handleSimulate}>
              Simulate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 2 }}>
        {result ? (
          <>
            {/* Allocation Table Section */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Allocation Table:</Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr style={{ background: '#e3f2fd' }}>
                      <th style={{ border: '1px solid #1976d2', padding: '6px 12px' }}>Process</th>
                      <th style={{ border: '1px solid #1976d2', padding: '6px 12px' }}>Size</th>
                      <th style={{ border: '1px solid #1976d2', padding: '6px 12px' }}>Allocated Block</th>
                      <th style={{ border: '1px solid #1976d2', padding: '6px 12px' }}>Memory Left in Block</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.procs.map((proc, i) => {
                      const blockIdx = result.allocation[i];
                      let memLeft = '-';
                      if (blockIdx !== -1) {
                        // Memory left in block = blockStatus[blockIdx]
                        memLeft = result.blockStatus[blockIdx];
                      }
                      return (
                        <tr key={i}>
                          <td style={{ border: '1px solid #1976d2', padding: '6px 12px', textAlign: 'center' }}>{`P${i + 1}`}</td>
                          <td style={{ border: '1px solid #1976d2', padding: '6px 12px', textAlign: 'center' }}>{proc}</td>
                          <td style={{ border: '1px solid #1976d2', padding: '6px 12px', textAlign: 'center' }}>{blockIdx !== -1 ? `Block ${blockIdx + 1}` : 'Unallocated'}</td>
                          <td style={{ border: '1px solid #1976d2', padding: '6px 12px', textAlign: 'center' }}>{memLeft}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Box>
            </Box>
            <Divider sx={{ my: 3 }} />
            {/* Visualization Section */}
            <Typography variant="h6" sx={{ mb: 1 }}>Visualization</Typography>
            {/* Simulation Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                color={
                  simState === 'idle' || simState === 'done'
                    ? 'primary'
                    : simState === 'running'
                    ? 'warning'
                    : 'success'
                }
                onClick={
                  simState === 'idle' || simState === 'done'
                    ? handleStartSim
                    : simState === 'running'
                    ? handlePauseSim
                    : () => setSimState('running')
                }
                disabled={simState === 'idle' && !result || simState === 'done'}
              >
                {inputDirty && (simState === 'idle' || simState === 'done')
                  ? 'Calculate Result'
                  : simState === 'idle' || simState === 'done'
                  ? 'Simulate'
                  : simState === 'running'
                  ? 'Pause'
                  : 'Resume'}
              </Button>
              <Button variant="outlined" color="error" onClick={handleResetSim} disabled={simState === 'idle'}>Reset</Button>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="speed-label">Speed</InputLabel>
                <Select labelId="speed-label" value={simSpeed} label="Speed" onChange={handleSpeedChange}>
                  <MenuItem value="slow">Slow</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="fast">Fast</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* Simulation Feedback */}
            {simState !== 'idle' && (
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976d2' }}>{simText}</Typography>
            )}
            {/* Animated Arrow */}
            <Box sx={{ minHeight: 32, mb: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              {renderArrow()}
            </Box>
            {/* Animated Bar Chart */}
            <Box sx={{ minHeight: 40, mb: 1, display: 'flex', alignItems: 'center' }}>
              {renderSimLegend()}
            </Box>
            {renderSimStack()}
            <Box sx={{ minHeight: 40, mt: 2 }}>
              <Typography variant="subtitle2">Unallocated Processes:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, minHeight: 24 }}>
                {(() => {
                  // Show unallocated processes up to the current simulation step
                  if (!result) return null;
                  let unallocated = [];
                  if (simState === 'done') {
                    // Show all unallocated at the end
                    unallocated = result.procs.map((proc, i) => simAlloc[i] === -1 ? i : null).filter(i => i !== null);
                  } else {
                    // Show only those that have been checked so far and found unallocated
                    unallocated = result.procs.map((proc, i) => (simAlloc[i] === -1 && i < simStep.processIdx) ? i : null).filter(i => i !== null);
                  }
                  if (unallocated.length === 0 && simState === 'done') {
                    return <Typography variant="body2" sx={{ color: 'green' }}>All processes allocated.</Typography>;
                  }
                  return unallocated.map(i => (
                    <Box key={i} sx={{ px: 2, py: 0.5, background: '#ffcdd2', color: '#b71c1c', borderRadius: 1, fontWeight: 500, fontSize: 14 }}>
                      P{i + 1} (Size: {result.procs[i]})
                    </Box>
                  ));
                })()}
              </Box>
            </Box>
          </>
        ) : (
          <Typography variant="body2">Enter data and run simulation to see results.</Typography>
        )}
      </Paper>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>How to use:</Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Enter memory block sizes separated by commas (e.g., 100, 500, 200, 300, 600).</li>
          <li>Enter process sizes separated by commas (e.g., 212, 417, 112, 426).</li>
          <li>Select the allocation algorithm and click Simulate.</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default ContinuousMemorySimulator; 