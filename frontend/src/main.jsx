import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { split } from '@apollo/client';
import { HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { SubscriptionClient } from "subscriptions-transport-ws";
import App from './App';
import "./input.css"
//import  {typeDefs} from "../../backend/graphschema"

// const wsLink = new WebSocketLink({
//   uri: `ws://localhost:4000/subscriptions`, // Replace with your server's WebSocket URL
//   options: {
//     reconnect: true,
//   },
// });

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/subscriptions',
}));

// const wsLink = new WebSocketLink(
//   new SubscriptionClient("ws://localhost:4000/subscriptions")
// );

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql', // Replace with your server's GraphQL URL
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
