import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import { loadFilesSync } from '@graphql-tools/load-files'
import { join } from 'path'
import { mergeResolvers } from '@graphql-tools/merge'

const schema = loadSchemaSync(join(__dirname, '/../modules/**/schema.graphql'), { loaders: [new GraphQLFileLoader()] })
const resolverFiles = loadFilesSync(join(__dirname, '/../modules/**/resolver.ts'))

const resolvers = mergeResolvers(resolverFiles);
const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

export default schemaWithResolvers