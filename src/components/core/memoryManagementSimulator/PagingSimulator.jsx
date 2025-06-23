import React, { useState } from 'react';
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
} from '@mui/material';

const PagingSimulator = () => {
  const [pageSize, setPageSize] = useState(4);
  const [memorySize, setMemorySize] = useState(32);
  const [processSize, setProcessSize] = useState(16);
  const [pageTable, setPageTable] = useState([]);
  const [memoryMap, setMemoryMap] = useState([]);

  const calculatePages = () => {
    const numPages = Math.ceil(processSize / pageSize);
    const numFrames = Math.floor(memorySize / pageSize);
    
    const newPageTable = [];
    const newMemoryMap = Array(numFrames).fill(null);

    for (let i = 0; i < numPages; i++) {
      const frameNumber = i < numFrames ? i : -1;
      newPageTable.push({
        pageNumber: i,
        frameNumber: frameNumber,
        valid: frameNumber !== -1
      });

      if (frameNumber !== -1) {
        newMemoryMap[frameNumber] = i;
      }
    }

    setPageTable(newPageTable);
    setMemoryMap(newMemoryMap);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Configuration
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Page Size (KB)"
                type="number"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              />
              <TextField
                label="Memory Size (KB)"
                type="number"
                value={memorySize}
                onChange={(e) => setMemorySize(Number(e.target.value))}
              />
              <TextField
                label="Process Size (KB)"
                type="number"
                value={processSize}
                onChange={(e) => setProcessSize(Number(e.target.value))}
              />
              <Button variant="contained" onClick={calculatePages}>
                Calculate Pages
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Page Table
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Page Number</TableCell>
                    <TableCell>Frame Number</TableCell>
                    <TableCell>Valid Bit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pageTable.map((page) => (
                    <TableRow key={page.pageNumber}>
                      <TableCell>{page.pageNumber}</TableCell>
                      <TableCell>{page.frameNumber}</TableCell>
                      <TableCell>{page.valid ? '1' : '0'}</TableCell>
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {memoryMap.map((page, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: page !== null ? 'primary.light' : 'grey.200',
                  }}
                >
                  {page !== null ? `Page ${page}` : 'Free'}
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PagingSimulator; 