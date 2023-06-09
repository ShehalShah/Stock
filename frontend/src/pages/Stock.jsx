import React, { useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { Line } from 'react-chartjs-2';
import { GET_STOCK, STOCK_UPDATE_SUBSCRIPTION } from '../queries';
import Chart from 'chart.js/auto';
import { Modal, Box, Button, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const Stock = () => {
  const { symbol } = useParams();
  const [open, setOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_STOCK, {
    variables: {
      symbol,
    },
  });

  const { data: stockUpdateData } = useSubscription(STOCK_UPDATE_SUBSCRIPTION, {
    variables: { symbol },
  });
  console.log(data);

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error fetching stock data: {error.message}</div>;
  } else {

    console.log(stockUpdateData);
    const stock = stockUpdateData && stockUpdateData.stockUpdate.identifier===symbol ? stockUpdateData.stockUpdate : data.getStock;

    const chartData = {
      labels: ['Year Low', 'Open', 'Day Low', 'Day High', 'Last Price', 'Previous Close', 'Year High'],
      datasets: [
        {
          label: 'Stock Attribute',
          data: [
            stock.yearLow,
            stock.open,
            stock.dayLow,
            stock.dayHigh,
            stock.lastPrice,
            stock.previousClose,
            stock.yearHigh,
          ],
          backgroundColor: 'rgba(15, 185, 177, 0.2)', 
          borderColor: 'rgba(100, 250, 200, 1)',
          fill: {
            target: 'origin',
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
          display: true,
        },
      },
    };

    const handleOpen = () => {
      setOpen(true);
    };

    // Close the modal
    const handleClose = () => {
      setOpen(false);
    };


    return (
      <div className="flex flex-col items-center space-y-4 bg-gray-900 min-h-screen py-8">
        <div className='flex' >
        <h1 className="text-xl text-white text-center">Stock Price for {stock.symbol}</h1>
        <Button className='mx-5' variant="contained" onClick={handleOpen} style={{marginLeft:"50px"}}>
            Show Details
          </Button>
          </div >
          <div className="text-xl text-white text-center"> Last updated at {stock.lastUpdateTime}</div>
        <Line data={chartData} options={chartOptions} />
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Additional Details
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">Symbol:</span> {stock.symbol}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">Open:</span> {stock.open}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">change:</span> {stock.change}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">pChange:</span> {stock.pChange}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">totalTradedVolume:</span> {stock.totalTradedVolume}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">totalTradedValue:</span> {stock.totalTradedValue}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">Day High:</span> {stock.dayHigh}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">Day Low:</span> {stock.dayLow}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">Last Price:</span> {stock.lastPrice}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">Previous Close:</span> {stock.previousClose}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">Year High:</span> {stock.yearHigh}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">Year Low:</span> {stock.yearLow}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">perChange365d:</span> {stock.perChange365d}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <span className="font-bold">perChange30d:</span> {stock.perChange30d}
                </Typography>
              </li>
            </ul>
          </Box>
        </Modal>
      </div>
    );
  }
};

export default Stock;
