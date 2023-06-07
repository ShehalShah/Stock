import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_STOCKS } from '../graphql/queries';
import StockList from '../components/StockList';

function HomePage() {
  const { loading, error, data } = useQuery(GET_ALL_STOCKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const stocks = data.getAllStocks;

  return (
    <div>
      <h1>Stock Market Data</h1>
      <StockList stocks={stocks} />
    </div>
  );
}

export default HomePage;