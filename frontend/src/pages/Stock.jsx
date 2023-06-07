import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Line } from 'react-chartjs-2';
import { GET_STOCK } from '../queries';

const Stock = () => {
  const [symbol, setSymbol] = useState('NIFTY 50');
  const [chartAttribute, setChartAttribute] = useState('lastPrice'); 

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
  // Prepare chart data
const chartData = {
    labels: ['Open', 'Day High', 'Day Low', 'Last Price', 'Previous Close', 'Year High', 'Year Low'],
    datasets: [
      {
        label: 'Stock Attribute',
        data: [
          stock.open,
          stock.dayHigh,
          stock.dayLow,
          stock.lastPrice,
          stock.previousClose,
          stock.yearHigh,
          stock.yearLow,
        ],
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
      },
    ],
  };
  

    // Chart options
    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    // Handle attribute change
    const handleAttributeChange = (event) => {
      setChartAttribute(event.target.value);
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-2xl">Stock Price for {stock.symbol}</h1>
        <div className="w-96">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="attribute" className="text-lg font-medium">
            Select Attribute:
          </label>
          <select
            id="attribute"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={chartAttribute}
            onChange={handleAttributeChange}
          >
            <option value="open">Open</option>
            <option value="dayHigh">Day High</option>
            <option value="dayLow">Day Low</option>
            <option value="lastPrice">Last Price</option>
            <option value="previousClose">Previous Close</option>
            <option value="change">Change</option>
            <option value="pChange">P Change</option>
          </select>
        </div>
      </div>
    );
  }
};

export default Stock;
