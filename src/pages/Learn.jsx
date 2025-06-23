import React from 'react';
import { Box, Typography, Paper, Divider, Chip, Stack } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import ScheduleIcon from '@mui/icons-material/Schedule';
import InfoIcon from '@mui/icons-material/Info';

const highlight = (text) => <span style={{ color: '#1976d2', fontWeight: 600 }}>{text}</span>;

const Learn = () => (
  <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1, md: 3 } }}>
    <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 700, color: '#232946', letterSpacing: 1 }}>
      <InfoIcon sx={{ fontSize: 40, color: '#1976d2', mb: -1, mr: 1 }} /> Learn Operating System Concepts
    </Typography>
    <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4, background: 'linear-gradient(90deg, #e3f2fd 60%, #fff 100%)', boxShadow: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <ScheduleIcon sx={{ color: '#1976d2', fontSize: 32 }} />
        <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 600 }}>CPU Scheduling</Typography>
      </Stack>
      <Typography variant="body1" paragraph>
        {highlight('CPU Scheduling')} is the process of determining which process in the ready queue will be assigned to the CPU next. The main goal is to maximize CPU utilization, throughput, and fairness while minimizing waiting and response times.
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ color: '#393053', fontWeight: 600 }}>Key Algorithms:</Typography>
      <Stack spacing={1} mb={2}>
        <Chip label="First-Come, First-Served (FCFS): Processes are scheduled in the order they arrive. Simple but can cause long waiting times for short processes." color="primary" variant="outlined" />
        <Chip label="Shortest Job First (SJF): The process with the shortest burst time is scheduled next. Reduces average waiting time but requires knowledge of future burst times." color="info" variant="outlined" />
        <Chip label="Round Robin (RR): Each process gets a fixed time slice (quantum). After its time is up, it goes to the end of the queue. Good for time-sharing systems." color="success" variant="outlined" />
        <Chip label="Priority Scheduling: Each process is assigned a priority. The CPU is allocated to the process with the highest priority (lowest number). Can cause starvation for low-priority processes." color="warning" variant="outlined" />
      </Stack>
      <Typography variant="body1" paragraph>
        <b>Key Terms:</b> <br/>
        <span style={{ color: '#1976d2' }}>Throughput:</span> Number of processes completed per unit time.<br/>
        <span style={{ color: '#1976d2' }}>Turnaround Time:</span> Total time taken from submission to completion.<br/>
        <span style={{ color: '#1976d2' }}>Waiting Time:</span> Time a process spends in the ready queue.<br/>
        <span style={{ color: '#1976d2' }}>Response Time:</span> Time from submission to first response.
      </Typography>
    </Paper>
    <Divider sx={{ my: 4, borderColor: '#1976d2', borderBottomWidth: 3 }} />
    <Paper sx={{ p: { xs: 2, md: 4 }, background: 'linear-gradient(90deg, #ede7f6 60%, #fff 100%)', boxShadow: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <MemoryIcon sx={{ color: '#7b1fa2', fontSize: 32 }} />
        <Typography variant="h4" sx={{ color: '#7b1fa2', fontWeight: 600 }}>Memory Management</Typography>
      </Stack>
      <Typography variant="body1" paragraph>
        {highlight('Memory Management')} is about efficiently allocating memory to processes and keeping track of each allocation. The goal is to maximize memory utilization and system performance while preventing errors like fragmentation and memory leaks.
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ color: '#393053', fontWeight: 600 }}>Key Concepts:</Typography>
      <Stack spacing={1} mb={2}>
        <Chip label="Contiguous Memory Allocation: Each process is allocated a single contiguous block of memory. Simple but can lead to fragmentation." color="primary" variant="outlined" />
        <Chip label="Paging: Memory is divided into fixed-size pages. Processes are split into pages and loaded into any available memory frames. Eliminates external fragmentation." color="info" variant="outlined" />
        <Chip label="Segmentation: Memory is divided into variable-sized segments based on logical divisions (e.g., code, data). Each segment can be placed anywhere in memory." color="success" variant="outlined" />
      </Stack>
      <Typography variant="h6" gutterBottom sx={{ color: '#393053', fontWeight: 600 }}>Allocation Strategies:</Typography>
      <Stack spacing={1} mb={2}>
        <Chip label="First Fit: Allocates the first block of memory that is large enough." color="primary" variant="outlined" />
        <Chip label="Best Fit: Allocates the smallest block that is large enough, minimizing wasted space." color="info" variant="outlined" />
        <Chip label="Worst Fit: Allocates the largest available block, leaving big holes for future allocations." color="warning" variant="outlined" />
      </Stack>
      <Typography variant="body1" paragraph>
        <b>Fragmentation:</b> <br/>
        <span style={{ color: '#7b1fa2' }}>External Fragmentation:</span> Free memory is split into small blocks and cannot be used for new processes.<br/>
        <span style={{ color: '#7b1fa2' }}>Internal Fragmentation:</span> Allocated memory may have unused space inside blocks.
      </Typography>
    </Paper>
  </Box>
);

export default Learn; 