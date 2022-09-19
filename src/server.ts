import * as dotenv from "dotenv";
import { ApolloServer } from 'apollo-server'
import { ContextFunc, context } from './helpers/ContextBuilder';
import { GraphQLSchema } from 'graphql'
import { join } from 'path';
import SchemaLoader from './helpers/SchemaLoader';
dotenv.config({ path: join(__dirname, "/.env") });

const server = async (schema: GraphQLSchema, contextf: ContextFunc) => {
  const apolloServer = new ApolloServer({
    schema,
    context: contextf,
  });

  const { url } = await apolloServer.listen();
  console.log(`🚀 Server ready at ${url}`);
}

const main = async () => {
  server(SchemaLoader, context);
}

main();