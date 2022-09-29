import { AuthenticationError } from 'apollo-server';
import { Context } from '../ContextBuilder';
import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';

export default (params: Array<Record<string, any>> | undefined, resolve: GraphQLFieldResolver<any, any, any, unknown>) => {
  return async function (source: any, args: any, context: Context, info: GraphQLResolveInfo) {
    if (context.user?.role === 'ADMIN') {
      return resolve(source, args, context, info);
    }

    if (source.authorId) {
      if (context.user?.id != source.authorId) {
        throw new AuthenticationError('You do not have permission to access this resource');
      }
    }else{
      if (context.user?.id != source.id) {
        throw new AuthenticationError('You do not have permission to access this resource');
      }
    }
    

    return await resolve(source, args, context, info);
  }
}