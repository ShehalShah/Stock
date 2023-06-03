const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const Redis = require('ioredis');
const typeDefs = require('./graphschema');
const resolvers = require('./resolvers');

const app = express();
const httpServer = createServer(app);

const redis = new Redis(); // Connect to Redis instance

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    // Make the Redis client available in the context of resolvers
    return {
      redis,
    };
  },
  subscriptions: {
    path: '/subscriptions', // Set the path for subscriptions
    onConnect: () => {
      console.log('Client connected to subscriptions');
    },
    onDisconnect: () => {
      console.log('Client disconnected from subscriptions');
    },
  },
});

server.applyMiddleware({ app });
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 4000 }, () => {
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log(`Subscriptions ready at ws://localhost:4000${server.subscriptionsPath}`);
});
