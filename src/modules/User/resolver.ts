import { User } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import { Context } from '../../helpers/ContextBuilder';
import HashHelper from '../../helpers/HashHelper';

export default {
    Mutation: {
        createUser: async (_: any, args: { user: User }, context: Context) => {
            const user = await context.prisma.user.create({ data: args.user });
            return user;
        },
        updateUser: async (_: any, args: {id: number, user: User}, context: Context) => {
            const user = await context.prisma.user.update({
                where: { id: args.id },
                data: args.user
            });
            return user;
        },
        deleteUser: async (_: any, args: {id: number}, context: Context) => {
            const user = await context.prisma.user.delete({
                where: { id: args.id }
            });
            return user;
        },
        login: async (_: any, args: {email: string, password: string}, context: Context) => {
            const user = await context.prisma.user.findUnique({
                where: { email: args.email }
            });
            if (!user) {
                throw new ApolloError('User not found');
            }
            if (await HashHelper.compare(args.password, user.password)) {
                throw new ApolloError('Wrong password');
            }
            return {
                token: 'token',
                user: user
            };
        }
    },
    Query: {
        user: async (parent: any, args: { id: number }, context: Context, info: any) => {
            let user = await context.prisma.user.findUnique({
                where: {
                    id: args.id
                }
            });

            if (!user) {
                throw new ApolloError('User not found', '404');
            }

            return user;
        },
        users: async (parent: any, args: any, context: Context, info: any) => {
            let users = await context.prisma.user.findMany();

            return users;
        }
    },
    User: {
        posts: async (parent: User, args: any, context: Context, info: any) => {
            let userPosts = await context.prisma.user.findUnique({
                where: {
                    id: parent.id
                }
            }).posts();

            return userPosts;
        },
        comments: async (parent: User, args: any, context: Context, info: any) => {
            let userComments = await context.prisma.user.findUnique({
                where: {
                    id: parent.id
                }
            }).comments();

            return userComments;
        }
    }
};