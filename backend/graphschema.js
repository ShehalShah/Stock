const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Stock {
    symbol: String!
    price: Float!
    change: Float!
    volume: Float!
  }

  type Query {
    getStock(symbol: String!): Stock
    getAllStocks: [Stock]
  }

  type Subscription {
    stockUpdate(symbol: String!): Stock
  }
`;

module.exports = typeDefs;
