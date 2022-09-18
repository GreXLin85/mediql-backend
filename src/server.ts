import { ApolloServer } from 'apollo-server'
import { GraphQLSchema } from 'graphql'
import SchemaLoader from './helpers/SchemaLoader';
import { context } from './helpers/ContextBuilder';

const server = async (schema: GraphQLSchema, context: Function) => {
  const apolloServer = new ApolloServer({
    schema,
    context,
  });

  const { url } = await apolloServer.listen();
  console.log(`🚀 Server ready at ${url}`);
}

const main = async () => {
  const schemaWithResolvers = await SchemaLoader();

  server(schemaWithResolvers, context);
}

main();