import { AuthenticationError } from 'apollo-server';
import { Context } from '../ContextBuilder';
import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
import { Role } from "@prisma/client"

export default (params: Array<Record<Role, any>> | undefined, resolve: GraphQLFieldResolver<any, any, any, unknown>) => {
  return async function (source: any, args: any, context: Context, info: GraphQLResolveInfo) {
    // @ts-ignore
    const requiredRoles: [Role] = params.requires

    const operationName = info.operation.name?.value.toLowerCase();
    if (operationName === 'login' || operationName === 'signup') {

      if (source?.role === 'ADMIN' || context.user?.role === 'ADMIN') {
        return resolve(source, args, context, info);
      }

      if (!requiredRoles.includes(source.role)) {
        throw new AuthenticationError('You do not have permission to access this resource');
      }

      return await resolve(source, args, context, info);
    }

    if (!context.user) {
      throw new AuthenticationError('You must be logged in to access this resource');
    }

    if (context.user?.role === 'ADMIN') {
      return resolve(source, args, context, info);
    }

    if (!requiredRoles.includes(context.user.role)) {
      throw new AuthenticationError('You do not have permission to access this resource');
    }

    return await resolve(source, args, context, info);
  }
}