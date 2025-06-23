import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import PagingSimulator from './PagingSimulator';
import SegmentationSimulator from './SegmentationSimulator';
import ContinuousMemorySimulator from './ContinuousMemorySimulator';

const MemoryManagementSimulator = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Memory Management Simulator
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Paging" />
          <Tab label="Segmentation" />
          <Tab label="Continuous Memory (Fit)" />
        </Tabs>
      </Paper>

      {selectedTab === 0 && <PagingSimulator />}
      {selectedTab === 1 && <SegmentationSimulator />}
      {selectedTab === 2 && <ContinuousMemorySimulator />}
    </Box>
  );
};

export default MemoryManagementSimulator; 