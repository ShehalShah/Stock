const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
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
});

async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  SubscriptionServer.create(
    {
      schema: server.schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: '/subscriptions',
    }
  );

  httpServer.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    console.log(`Subscriptions ready at ws://localhost:4000/subscriptions`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
