import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Line } from 'react-chartjs-2';
import { GET_STOCK } from '../queries';
import Chart from 'chart.js/auto';
import { Modal, Box, Button, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const Graph = ({stock}) => {
  // const symbol =id
  // const { data, loading, error } = useQuery(GET_STOCK, {
  //   variables: {
  //     symbol,
  //   },
  // });

  // if (loading) {
  //   return <div>Loading...</div>;
  // } else if (error) {
  //   return <div>Error fetching stock data: {error.message}</div>;
  // } else {
  //   const stock = data.getStock;

    const backgroundColor = stock.pChange < 0 ? 'rgba(255, 0, 0, 0.2)' : 'rgba(15, 185, 177, 0.2)';
    const borderColor = stock.pChange < 0 ? 'rgba(255, 0, 0, 0.4)' : 'rgba(100, 250, 200, 1)';
    const above = stock.pChange < 0 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(15, 185, 177, 0.2)';
    const chartData = {
      labels: ['Open', 'Previous Close','Last Price'],
      datasets: [
        {
          data: [
            stock.open,
            stock.previousClose,
            stock.lastPrice,
          ],
          backgroundColor, 
          borderColor, 
          fill: {
            target: 'origin',
            above,
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


export default Graph;
