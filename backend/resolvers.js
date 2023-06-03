const axios = require('axios');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }); // Create WebSocket server

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Handle subscription request from the client
    const { symbol } = JSON.parse(message);

    // Subscribe to the stock updates for the specified symbol
    // For example, you can use a third-party library or API to subscribe to stock updates

    // When a stock update is received, send it to the client
    const stockUpdateHandler = (update) => {
      const stockUpdate = {
        symbol: update.symbol,
        price: update.price,
        change: update.change,
        volume: update.volume,
      };
      ws.send(JSON.stringify(stockUpdate));
    };

    // Add the stock update handler to the subscription mechanism
    // For example, with a third-party library, you may need to specify the callback function

    ws.on('close', () => {
      // Clean up any resources when the client disconnects
      // For example, unsubscribe from stock updates for the specified symbol
    });
  });
});

const resolvers = {
  Query: {
    getStock: async (_, { symbol }) => {
      try {
        // Make API request to fetch stock data
        const response = await axios.get(`https://api.example.com/stocks/${symbol}`);
        const stockData = response.data;

        // Transform the API response to match the schema structure
        const stock = {
          symbol: stockData.symbol,
          price: stockData.price,
          change: stockData.change,
          volume: stockData.volume,
        };

        return stock;
      } catch (error) {
        throw new Error('Failed to fetch stock data');
      }
    },
    // Implement other resolver functions for fetching stock data as needed
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
