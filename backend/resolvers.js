const axios = require('axios');
const { RedisPubSub } = require('graphql-redis-subscriptions');
const { Redis } = require('ioredis');

const API_KEY = '48334e4faemsh146b66580f9c961p13d654jsnfb3484c3b23a';

const publisher = new Redis();
const subscriber = new Redis();

const pubsub = new RedisPubSub({
  publisher: publisher,
  subscriber: subscriber,
});

const resolvers = {
  Query: {
    getStock: async (_, { symbol }, { redis }) => {
      try {
        const options = {
          method: 'GET',
          url: 'https://latest-stock-price.p.rapidapi.com/any',
          params: {
            Identifier: symbol,
          },
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com',
          },
        };

        const response = await axios.request(options);
        const stockData = response.data;
        const stock = {
          symbol: stockData[0].symbol,
          identifier: stockData[0].identifier,
          open: stockData[0].open,
          dayHigh: stockData[0].dayHigh,
          dayLow: stockData[0].dayLow,
          lastPrice: stockData[0].lastPrice,
          previousClose: stockData[0].previousClose,
          change: stockData[0].change,
          pChange: stockData[0].pChange,
          yearHigh: stockData[0].yearHigh,
          yearLow: stockData[0].yearLow,
          totalTradedVolume: stockData[0].totalTradedVolume,
          totalTradedValue: stockData[0].totalTradedValue,
          lastUpdateTime: stockData[0].lastUpdateTime,
          perChange365d: stockData[0].perChange365d,
          perChange30d: stockData[0].perChange30d,
        };
        // Publish the stock update to the stockUpdates channel
        try {
          const result = await pubsub.publish('stockUpdates', JSON.stringify(stock));
        } catch (error) {
          console.error('Failed to publish stock update:', error);
        }
        return stock;
      } catch (error) {
        throw new Error('Failed to fetch stock data');
      }
    },
    getAllStocks: async (_, __, { redis }) => {
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

        // Publish the stock updates to the stockUpdates channel
        await Promise.all(
          stocks.map(async (stock) => {
            await pubsub.publish('stockUpdates', JSON.stringify(stock));
          })
        );

        return stocks;
      } catch (error) {
        throw new Error('Failed to fetch stock data');
      }
    },
  },
  Subscription: {
    stockUpdate: {
      subscribe: async (_, { symbol }) => {
        console.log(`Subscribing to stock updates ${symbol}`);
        const subscriber = new Redis();

        // Subscribe to the stockUpdates channel using the subscriber instance
        await subscriber.subscribe('stockUpdates');
        subscriber.on('message', (channel, message) => {
          console.log(`Received message from channel ${channel}: ${message}`);
        });
  
        return pubsub.asyncIterator('stockUpdates');
      },
      // resolve: (message) => {
      //   console.log('Received message:', message);
      //   // Parse the message if it's in string format (e.g., JSON)
      //   const parsedMessage = JSON.parse(message);
      //   return parsedMessage;
      // },
      // subscribe: () => {
      //   console.log("Subscribing to stock update");
  
      //   return pubsub.asyncIterator('stockUpdates');
      // },
    },
  },
  
};

module.exports = resolvers;
