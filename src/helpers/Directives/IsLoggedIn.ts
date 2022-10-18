import { AuthenticationError } from 'apollo-server';
import { Context } from '../ContextBuilder';
import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
// NOTE -
// Write a helper for admin authentication that can be used in the same way as the Authentication directive

export default (params: Array<Record<string, any>> | undefined, resolve: GraphQLFieldResolver<any, any, Context, GraphQLResolveInfo>) => {
  return async function (source: any, args: any, context: Context, info: GraphQLResolveInfo) {
    const operationName = info.operation.name?.value.toLowerCase();
    if (operationName === 'login' || operationName === 'signup') {
      return resolve(source, args, context, info);
    }

    if (!context.user) {
      throw new AuthenticationError('You must be logged in to access this resource');
    }

    return resolve(source, args, context, info);
  }
}