import { AuthenticationError } from "apollo-server";
import { Context } from "./ContextBuilder";
import { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";

export default (resolve: GraphQLFieldResolver<any, Context, any, GraphQLResolveInfo>, source: any, args: any, context: Context, info: GraphQLResolveInfo) => {
    const operationName = info.operation.name?.value.toLowerCase();
    if (operationName === 'login' || operationName === 'signup') {
        return resolve(source, args, context, info);
    }
    
    if (!context.user) {
        throw new AuthenticationError('You must be logged in to access this resource');
    }
    
    return resolve(source, args, context, info);
    }