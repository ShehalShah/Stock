import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Line } from 'react-chartjs-2';
import { GET_STOCK } from '../queries';
import Chart from 'chart.js/auto';
import { Modal, Box, Button, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const Graph = ({id}) => {
  const symbol =id
  const { data, loading, error } = useQuery(GET_STOCK, {
    variables: {
      symbol,
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error fetching stock data: {error.message}</div>;
  } else {
    const stock = data.getStock;

    // Prepare chart data
    const chartData = {
      labels: [ 'Previous Close','Last Price','Open'],
      datasets: [
        {
          data: [
            stock.previousClose,
            stock.lastPrice,
            stock.open,
          ],
          backgroundColor: 'rgba(15, 185, 177, 0.2)', // Fluorescent Green background color
          borderColor: 'rgba(100, 250, 200, 1)', 
          fill: {
            target: 'origin', // Set the fill options
            above: 'rgba(15, 185, 177, 0.2)',
          },
        },
      ],
    };
    const chartOptions = {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        legend: {
          display: false, // Hide legend
        },
      },
    };

    return (
        <Line data={chartData} options={chartOptions} />
    );
  }
};

export default Graph;
