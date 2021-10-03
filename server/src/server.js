require('dotenv').config();
import consola from 'consola';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';

import { graphqlUploadExpress } from 'graphql-upload';
import * as schema from './schema';

consola.info({
  message: `Starting on ${process.env.NODE_ENV} mode`,
  badge: true,
});

const context = async ({ req, res }) => {
  return {
    res,
  };
}

export default async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const options = {
    ...schema,
    graphqlPath: '/',
    context,
    uploads: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  }

  if (process.env.NODE_ENV === 'production') {
    Object.assign(options, {
      introspection: false,
      playground: false,
    });
  }
  const server = new ApolloServer(options);
  await server.start();
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  )
  server.applyMiddleware({ app });

  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}
