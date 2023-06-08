import React, { useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { GET_ALL_STOCKS, STOCK_UPDATE_SUBSCRIPTION } from '../queries';
import StockList from '../components/StockList';
import { Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

function HomePage() {
  const { loading, error, data } = useQuery(GET_ALL_STOCKS);
  const symbol = "hello";
  const client = useApolloClient();

  useEffect(() => {
    const subscription = client.subscribe({
      query: STOCK_UPDATE_SUBSCRIPTION,
      variables: { symbol },
    }).subscribe({
      next: (stockUpdateData) => {
        console.log("stock updated");
        const updatedStock = stockUpdateData.data.stockUpdate;

        // Update the stocks data in the cache
        const updatedStocks = data.getAllStocks.map((stock) => {
          if (stock.symbol === updatedStock.symbol) {
            return updatedStock;
          }
          return stock;
        });

        // Write the updated stocks data back to the cache
        client.writeQuery({
          query: GET_ALL_STOCKS,
          data: {
            getAllStocks: updatedStocks,
          },
        });
      },
      error: (err) => {
        console.error('frontend subscribe error home.js', err);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [client, data, symbol]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const stocks = data.getAllStocks;
  return (
    <div className="bg-gray-900 min-h-screen">
      <nav className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center">
          <Link to="/" className="text-white font-bold text-xl">
            Stock
          </Link>
          <TextField
            variant="outlined"
            label="Search..."
            className="p-2 ml-4"
            style={{ marginLeft: '65vw', width: '20vw', marginRight: '10px' }}
          />
        </div>
        <div>
          <Button variant="contained" color="primary" size="small">
            Login/Signup
          </Button>
        </div>
      </nav>
      <div className="flex flex-col items-center py-8">
        <h1 className="text-2xl font-bold text-white">Stock Market Data</h1>
        <StockList stocks={stocks} />
      </div>
    </div>
  );
}

export default HomePage;
