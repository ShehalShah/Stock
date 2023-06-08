const { gql } = require('apollo-server-express');

exports.typeDefs = gql`
  type Stock {
    symbol: String!
    identifier: String!
    open: Float!
    dayHigh: Float!
    dayLow: Float!
    lastPrice: Float!
    previousClose: Float!
    change: Float!
    pChange: Float!
    yearHigh: Float!
    yearLow: Float!
    totalTradedVolume: Float!
    totalTradedValue: Float!
    lastUpdateTime: String!
    perChange365d: Float!
    perChange30d: Float!
  }

  type Query {
    getStock(symbol: String!): Stock
    getAllStocks: [Stock]
  }

  type Subscription {
    stockUpdate(symbol: String!): Stock
  }
`;

//module.exports = {typeDefs};
