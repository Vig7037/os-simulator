import React, { useState } from 'react';
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
  let allocation = Array(processes.length).fill(-1);
  let blockStatus = blocks.map(b => b); // Copy of blocks
  let blockAlloc = blocks.map(() => []); // For visualization: which processes are in which block

  for (let i = 0; i < processes.length; i++) {
    let idx = -1;
    if (algorithm === 'first') {
      for (let j = 0; j < blockStatus.length; j++) {
        if (blockStatus[j] >= processes[i]) {
          idx = j;
          break;
        }
      }
    } else if (algorithm === 'best') {
      let bestIdx = -1, minWaste = Infinity;
      for (let j = 0; j < blockStatus.length; j++) {
        if (blockStatus[j] >= processes[i] && (blockStatus[j] - processes[i]) < minWaste) {
          minWaste = blockStatus[j] - processes[i];
          bestIdx = j;
        }
      }
      idx = bestIdx;
    } else if (algorithm === 'worst') {
      let worstIdx = -1, maxWaste = -1;
      for (let j = 0; j < blockStatus.length; j++) {
        if (blockStatus[j] >= processes[i] && (blockStatus[j] - processes[i]) > maxWaste) {
          maxWaste = blockStatus[j] - processes[i];
          worstIdx = j;
        }
      }
      idx = worstIdx;
    }
    if (idx !== -1) {
      allocation[i] = idx;
      blockAlloc[idx].push({ process: i, size: processes[i] });
      blockStatus[idx] -= processes[i];
    }
  }
  return { allocation, blockAlloc, blockStatus };
}

const COLORS = [
  '#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1', '#c2185b', '#ffa000', '#388e3c', '#512da8'
];

const ContinuousMemorySimulator = () => {
  const [algorithm, setAlgorithm] = useState('first');
  const [memoryBlocks, setMemoryBlocks] = useState('');
  const [processes, setProcesses] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSimulate = () => {
    setError('');
    setResult(null);
    const blocks = parseInput(memoryBlocks);
    const procs = parseInput(processes);
    if (blocks.length === 0 || procs.length === 0) {
      setError('Please enter valid memory blocks and processes.');
      return;
    }
    const { allocation, blockAlloc, blockStatus } = allocateMemory(blocks, procs, algorithm);
    setResult({ blocks, procs, allocation, blockAlloc, blockStatus });
  };

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
              onChange={e => setMemoryBlocks(e.target.value)}
              fullWidth
              placeholder="e.g. 100, 500, 200, 300, 600"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Processes (comma separated)"
              value={processes}
              onChange={e => setProcesses(e.target.value)}
              fullWidth
              placeholder="e.g. 212, 417, 112, 426"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSimulate}>
              Simulate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Visualization</Typography>
        {result ? (
          <>
            {renderLegend()}
            {renderStackVisualization()}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Unallocated Processes:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {result.procs.map((proc, i) =>
                  result.allocation[i] === -1 ? (
                    <Box key={i} sx={{ px: 2, py: 0.5, background: '#ffcdd2', color: '#b71c1c', borderRadius: 1, fontWeight: 500, fontSize: 14 }}>
                      P{i + 1} (Size: {proc})
                    </Box>
                  ) : null
                )}
                {result.procs.every((_, i) => result.allocation[i] !== -1) && (
                  <Typography variant="body2" sx={{ color: 'green' }}>All processes allocated.</Typography>
                )}
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