import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import { join } from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { loadSchemaSync } from '@graphql-tools/load'
import { mergeResolvers } from '@graphql-tools/merge'
import AuthenticationDirective from './Directives/Authentication'
import DirectiveBuilder from './DirectiveBuilder'
import IsLoggedInDirective from './Directives/IsLoggedIn'
import IsOnlyCanSeeSelfDirective from './Directives/IsOnlyCanSeeSelf'

const schema = loadSchemaSync(join(__dirname, '/../modules/**/schema.graphql'), { loaders: [new GraphQLFileLoader()] })
const resolverFiles = loadFilesSync(join(__dirname, '/../modules/**/resolver.ts'))

const resolvers = mergeResolvers(resolverFiles);
const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

// Add directives to schema
// TODO - Make a loader for directives
const schemaWithAuthDirective = DirectiveBuilder(schemaWithResolvers, 'auth', AuthenticationDirective);
const schemaWithIsLoggedInDirective = DirectiveBuilder(schemaWithAuthDirective, 'isLoggedIn', IsLoggedInDirective);
const schemaWithIsOnlyCanSeeSelfDirective = DirectiveBuilder(schemaWithIsLoggedInDirective, 'isOnlyCanSeeSelf', IsOnlyCanSeeSelfDirective);

export default schemaWithIsOnlyCanSeeSelfDirective