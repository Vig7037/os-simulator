import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SEGMENT_COLORS = [
  '#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1', '#c2185b', '#ffa000', '#388e3c', '#512da8'
];

let segmentIdCounter = 0;

const SegmentationSimulator = () => {
  const [segments, setSegments] = useState([]);
  const [memorySize, setMemorySize] = useState(64);
  const [segmentName, setSegmentName] = useState('');
  const [segmentSize, setSegmentSize] = useState('');
  const [memoryMap, setMemoryMap] = useState([]);

  const addSegment = () => {
    if (!segmentName || !segmentSize) return;
    const newSegment = {
      id: segmentIdCounter++,
      name: segmentName,
      size: Number(segmentSize),
      base: calculateBaseAddress(),
    };
    setSegments([...segments, newSegment]);
    setSegmentName('');
    setSegmentSize('');
  };

  const calculateBaseAddress = () => {
    if (segments.length === 0) return 0;
    const lastSegment = segments[segments.length - 1];
    return lastSegment.base + lastSegment.size;
  };

  const deleteSegment = (id) => {
    // Remove the segment and recalculate base addresses for all remaining segments
    const filtered = segments.filter(segment => segment.id !== id);
    let base = 0;
    const recalculated = filtered.map(segment => {
      const newSegment = { ...segment, base };
      base += segment.size;
      return newSegment;
    });
    setSegments(recalculated);
  };

  useEffect(() => {
    const newMemoryMap = Array(memorySize).fill(null);
    segments.forEach((segment) => {
      for (let i = 0; i < segment.size; i++) {
        if (segment.base + i < memorySize) {
          newMemoryMap[segment.base + i] = segment.id;
        }
      }
    });
    setMemoryMap(newMemoryMap);
  }, [segments, memorySize]);

  // Legend for segment colors
  const renderLegend = () => {
    if (segments.length === 0) return null;
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ mr: 1 }}>Legend:</Typography>
        {segments.map((segment, idx) => (
          <Box key={segment.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 18, height: 18, background: SEGMENT_COLORS[idx % SEGMENT_COLORS.length], borderRadius: 0.5, border: '1px solid #888' }} />
            <Typography variant="body2">{segment.name}</Typography>
          </Box>
        ))}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 18, height: 18, background: '#bdbdbd', borderRadius: 0.5, border: '1px solid #888' }} />
          <Typography variant="body2">Free</Typography>
        </Box>
      </Box>
    );
  };

  // Helper to get color for a segment id
  const getColorById = (id) => {
    const idx = segments.findIndex(seg => seg.id === id);
    return SEGMENT_COLORS[idx % SEGMENT_COLORS.length];
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Segment
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Segment Name"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
              <TextField
                label="Segment Size (KB)"
                type="number"
                value={segmentSize}
                onChange={(e) => setSegmentSize(e.target.value)}
              />
              <TextField
                label="Memory Size (KB)"
                type="number"
                value={memorySize}
                onChange={(e) => setMemorySize(Number(e.target.value))}
              />
              <Button variant="contained" onClick={addSegment}>
                Add Segment
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Segment Table
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Segment Name</TableCell>
                    <TableCell>Base Address</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {segments.map((segment) => (
                    <TableRow key={segment.id}>
                      <TableCell>{segment.name}</TableCell>
                      <TableCell>{segment.base}</TableCell>
                      <TableCell>{segment.size}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => deleteSegment(segment.id)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Memory Map
            </Typography>
            {renderLegend()}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {memoryMap.map((segmentId, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: segmentId !== null ? getColorById(segmentId) : 'grey.200',
                    color: segmentId !== null ? '#fff' : '#333',
                    fontWeight: 500,
                    fontSize: 16,
                  }}
                >
                  {segmentId !== null ? (segments.find(s => s.id === segmentId)?.name || '') : 'Free'}
                </Paper>
              ))}
            </Box>
            <Divider sx={{ mt: 2 }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SegmentationSimulator; 