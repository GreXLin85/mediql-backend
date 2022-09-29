import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';

export default (schema: GraphQLSchema, directiveName: string, resolverFunction: any) => {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const params = getDirective(schema, fieldConfig, directiveName)?.[0];
            if (params) {
                const { resolve = defaultFieldResolver } = fieldConfig;

                fieldConfig.resolve = resolverFunction(params, resolve);
                return fieldConfig;
            }
        },
    });
}