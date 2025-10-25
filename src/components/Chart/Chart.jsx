import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './Chart.css';

const Chart = ({ data, title, year, onYearChange }) => {
  const months = [
    'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
    'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          mb: 3
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Năm</InputLabel>
          <Select
            value={year}
            label="Năm"
            onChange={(e) => onYearChange(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e2e8f0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea',
              },
            }}
          >
            {years.map(yearOption => (
              <MenuItem key={yearOption} value={yearOption}>
                {yearOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ height: 400, width: '100%' }}>
        <LineChart
          xAxis={[
            {
              data: months,
              scaleType: 'point',
            },
          ]}
          series={[
            {
              data: data,
              label: title,
              color: '#667eea',
              curve: 'natural',
              area: true,
            },
          ]}
          sx={{
            '& .MuiChartsAxis-root': {
              fontSize: '0.75rem',
              color: '#718096',
            },
            '& .MuiChartsAxis-line': {
              stroke: '#e2e8f0',
            },
            '& .MuiChartsAxis-tick': {
              stroke: '#e2e8f0',
            },
            '& .MuiChartsGrid-root': {
              stroke: 'rgba(0, 0, 0, 0.05)',
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default Chart;
