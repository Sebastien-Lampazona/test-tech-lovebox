import startApolloServer from './server';

startApolloServer();

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.stop());
}
