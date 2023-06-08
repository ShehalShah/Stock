// queries.js
import { gql } from '@apollo/client';

export const GET_STOCK = gql`
  query GetStock($symbol: String!) {
    getStock(symbol: $symbol) {
      symbol
      identifier
      open
      dayHigh
      dayLow
      lastPrice
      previousClose
      change
      pChange
      yearHigh
      yearLow
      totalTradedVolume
      totalTradedValue
      lastUpdateTime
      perChange365d
      perChange30d
    }
  }
`;

export const GET_ALL_STOCKS = gql`
  query GetAllStocks {
    getAllStocks {
      symbol
      identifier
      open
      dayHigh
      dayLow
      lastPrice
      previousClose
      change
      pChange
      yearHigh
      yearLow
      totalTradedVolume
      totalTradedValue
      lastUpdateTime
      perChange365d
      perChange30d
    }
  }
`;


export const STOCK_UPDATE_SUBSCRIPTION = gql`
  subscription StockUpdate($symbol: String!) {
    stockUpdate(symbol: $symbol) {
      symbol
      identifier
      open
      dayHigh
      dayLow
      lastPrice
      previousClose
      change
      pChange
      yearHigh
      yearLow
      totalTradedVolume
      totalTradedValue
      lastUpdateTime
      perChange365d
      perChange30d
    }
  }
`;