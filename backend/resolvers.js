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
        const cachedStock = await redis.get(`stock:${symbol}`);
        if (cachedStock) {
          console.log("cached data retrieved stcokkk");
          return JSON.parse(cachedStock);
        }

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

        // Cache the stock data in Redis
        await redis.set(`stock:${symbol}`, JSON.stringify(stock));

        try {
          const result = await pubsub.publish('stockUpdates', {
            stockUpdate: stock,
            symbol: stock.symbol,
          });
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
        const cachedStocks = await redis.get('stocks');
        if (cachedStocks) {
          console.log("cached data retrieved");
          return JSON.parse(cachedStocks);
        }

        const options = {
          method: 'GET',
          url: 'https://latest-stock-price.p.rapidapi.com/price',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com',
          },
          params: {
            Indices: 'NIFTY 50',
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

        // Cache the stocks data in Redis
        await redis.set('stocks', JSON.stringify(stocks));

        await Promise.all(
          stocks.map(async (stock) => {
            const result = await pubsub.publish('stockUpdates', {
              stockUpdate: stock,
              symbol: stock.identifier,
            });
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
        return pubsub.asyncIterator('stockUpdates');
      },
    },
  },
};

module.exports = resolvers;
