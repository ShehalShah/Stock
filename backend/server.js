const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('graphql-tools');
const Redis = require('ioredis');
const { typeDefs } = require('./graphschema');
const resolvers = require('./resolvers');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./Routes/user');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://shehalshah264:WhIGgh4NEfqLteSc@cluster0.wnug1ft.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const httpServer = createServer(app);

const redis = new Redis();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
  context: () => {
    return {
      redis,
    };
  },
});

app.use('/', routes); 

async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  // SubscriptionServer.create(
  //   {
  //     schema,
  //     execute,
  //     subscribe,
  //   },
  //   {
  //     server: httpServer,
  //     path: '/subscriptions',
  //   }
  // );

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/subscriptions',
  });

  const serverCleanup = useServer({ schema }, wsServer);

  httpServer.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    console.log(`Subscriptions ready at ws://localhost:4000/subscriptions`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
