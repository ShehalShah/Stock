import React from 'react';
import { Link } from 'react-router-dom';

function StockList({ stocks }) {
  return (
    <ul>
      {stocks.map((stock) => (
        <li key={stock.symbol}>
          <Link to={`/stock/${stock.symbol}`}>{stock.symbol}</Link>
        </li>
      ))}
    </ul>
  );
}

export default StockList;
