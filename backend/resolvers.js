const axios = require('axios');

const API_KEY = '48334e4faemsh146b66580f9c961p13d654jsnfb3484c3b23a';

const resolvers = {
  Query: {
    getStock: async (_, { symbol }) => {
      try {
        const options = {
          method: 'GET',
          url: 'https://latest-stock-price.p.rapidapi.com/any',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com',
          },
          params: {
            identifier: symbol,
          },
        };

        const response = await axios.request(options);
        const stockData = response.data;

        const stock = {
          symbol: stockData.symbol,
          identifier: stockData.identifier,
          open: stockData.open,
          dayHigh: stockData.dayHigh,
          dayLow: stockData.dayLow,
          lastPrice: stockData.lastPrice,
          previousClose: stockData.previousClose,
          change: stockData.change,
          pChange: stockData.pChange,
          yearHigh: stockData.yearHigh,
          yearLow: stockData.yearLow,
          totalTradedVolume: stockData.totalTradedVolume,
          totalTradedValue: stockData.totalTradedValue,
          lastUpdateTime: stockData.lastUpdateTime,
          perChange365d: stockData.perChange365d,
          perChange30d: stockData.perChange30d,
        };

        return stock;
      } catch (error) {
        throw new Error('Failed to fetch stock data');
      }
    },
    getAllStocks: async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://latest-stock-price.p.rapidapi.com/price',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com',
          },
          params: {
            Indices: 'NIFTY 50', // Replace with the desired indices
          },
        };

        const response = await axios.request(options);
        const stocksData = response.data;

        const stocks = stocksData.map((stockData) => ({
          symbol: stockData.symbol,
          identifier: stockData.identifier,
          open: stockData.open,
          dayHigh: stockData.dayHigh,
          dayLow: stockData.dayLow,
          lastPrice: stockData.lastPrice,
          previousClose: stockData.previousClose,
          change: stockData.change,
          pChange: stockData.pChange,
          yearHigh: stockData.yearHigh,
          yearLow: stockData.yearLow,
          totalTradedVolume: stockData.totalTradedVolume,
          totalTradedValue: stockData.totalTradedValue,
          lastUpdateTime: stockData.lastUpdateTime,
          perChange365d: stockData.perChange365d,
          perChange30d: stockData.perChange30d,
        }));

        return stocks;
      } catch (error) {
        throw new Error('Failed to fetch stock data');
      }
    },
  },
  Subscription: {
    stockUpdate: () => {
      // Subscription resolvers are resolved via the WebSocket connection
      // Return an AsyncIterator to listen for stock updates
      return {
        async *[Symbol.asyncIterator]() {
          // This code will not be executed directly
          // Instead, it's used by the Apollo Server to handle subscriptions

          // You can leave this empty or perform any necessary setup before starting the iterator
        },
      };
    },
  },
};

module.exports = resolvers;
